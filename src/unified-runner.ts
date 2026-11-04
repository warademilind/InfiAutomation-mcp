import { randomUUID } from 'node:crypto';
import { mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { type UnifiedSuite, type Target, type RunResult, type CaseResult, type StepResult } from './schema.js';
import { Workspace } from './workspace.js';
import { loadPlan } from './planning.js';
import { validateTraceability, writeTraceability } from './traceability.js';
import { createDriver } from './drivers/index.js';
import type { Driver } from './drivers/types.js';
import { WebDriver } from './drivers/web.js';
import { suggestHealing } from './healing.js';
import { renderReport } from './report.js';
import { ApiTester } from './api-testing.js';
import { executeDatabase } from './database.js';
import { executeUx } from './ux-testing.js';
import { ExecutionValues, effectivePolicy, assertHttpPolicy } from './execution-values.js';

export async function runUnifiedSuite(suite:UnifiedSuite,workspace:Workspace,factory:(target:Target)=>Driver=createDriver){
  const started=Date.now(),plan=suite.planPath?await loadPlan(suite.planPath,workspace):undefined;
  if(plan)validateTraceability(plan,suite);
  const policy=effectivePolicy(plan?.policy,suite.policy);
  // Resolve policy conflicts before any target is launched or endpoint called.
  for(const test of suite.tests)for(const step of test.steps){
    if(policy.deniedTargets.includes(step.target))throw new Error('Policy blocked target '+step.target);
    if(step.kind==='api'&&!policy.allowedMethods.includes(step.method))throw new Error('Policy blocked HTTP method '+step.method);
    if(step.kind==='ui'&&policy.deniedUiActions.includes(step.step.action))throw new Error('Policy blocked UI action '+step.step.action);
    if(step.kind==='database'&&step.sql?.includes('${'))throw new Error('Use bound params for database variables, never interpolate SQL text');
    if(step.kind==='ux'&&step.check==='visual'&&!policy.captureScreenshots)throw new Error('Visual checks conflict with captureScreenshots=false');
    if(step.kind==='ui'&&step.step.action==='screenshot'&&!policy.captureScreenshots)throw new Error('Screenshot step conflicts with captureScreenshots=false');
  }
  const id=new Date().toISOString().replace(/[:.]/g,'-')+'-'+randomUUID().slice(0,8),directory='.infiautomation/runs/'+id;
  await mkdir(await workspace.safe(directory),{recursive:true});
  const require=createRequire(import.meta.url),values=new ExecutionValues(policy.redactKeys);
  const result:RunResult={schemaVersion:2,id,name:suite.name,target:[...new Set(Object.values(suite.targets).map(t=>t.kind))].join(' + '),startedAt:new Date().toISOString(),durationMs:0,status:'passed',summary:{total:suite.tests.length,passed:0,failed:0,healed:0,skipped:0},tests:[],environment:{platform:process.platform+'-'+process.arch,node:process.version,playwright:require('playwright/package.json').version},policy};
  for(const test of suite.tests){
    const begun=Date.now(),drivers=new Map<string,Driver>(),apis=new Map<string,ApiTester>();
    // Captures are isolated per case. Related layers in one case share them.
    for(const key of Object.keys(values.variables))delete values.variables[key];
    const record:CaseResult={id:test.id,name:test.name,tags:test.tags,requirements:test.requirements,status:'passed',durationMs:0,steps:[]};result.tests.push(record);
    for(let index=0;index<test.steps.length;index++){
      const original=test.steps[index],stepStart=performance.now(),target=suite.targets[original.target];
      const row:StepResult={name:original.name,action:original.kind==='ui'?original.step.action:original.kind==='ux'?original.check:original.kind==='api'?original.method:original.operation,layer:original.kind==='ui'?target.kind:original.kind,target:original.target,status:'passed',durationMs:0};record.steps.push(row);
      if(record.status==='failed'){row.status='skipped';continue;}
      const prefix=directory+'/'+test.id+'-step-'+(index+1);
      let active:Driver|undefined;
      try{
        const step=values.resolve(original) as typeof original;
        let outcome:{actual?:unknown;timings?:Record<string,number>;attachments?:{label:string;path:string}[]};
        if(step.kind==='api'&&target.kind==='api'){
          let tester=apis.get(step.target);if(!tester){tester=new ApiTester(values.resolve(target),policy);apis.set(step.target,tester);}outcome=await tester.execute(step);
        }else if(step.kind==='database'&&target.kind==='database'){
          if(target.connectionEnv&&process.env[target.connectionEnv])values.addSecret(process.env[target.connectionEnv]!);
          outcome=await executeDatabase(target,step,workspace);
        }else{
          if(target.kind==='api'||target.kind==='database')throw new Error('Incompatible UI target');
          active=drivers.get(step.target);
          if(!active){
            const resolved=values.resolve(target) as Target;
            if(resolved.cdpUrl)throw new Error('Version 2 requires an isolated browser/Electron session for execution policy; use version 1 for existing CDP attachment suites');
            if(resolved.kind==='web'&&resolved.url&&/^https?:/.test(resolved.url)&&policy.allowedOrigins.length)assertHttpPolicy(resolved.url,'GET',policy,resolved.url);
            active=factory(resolved.kind==='web'&&!resolved.cwd?{...resolved,cwd:workspace.root}:resolved);drivers.set(step.target,active);
            if(active instanceof WebDriver)active.executionPolicy=policy;
            await active.start();
            if(active.info)(record.sessions ||= []).push({target:step.target,info:await active.info()});
          }
          if(step.kind==='ux')outcome=await executeUx(active,step,workspace,prefix);
          else if(step.kind==='ui'){
            if(step.step.action==='navigate'&&/^https?:/.test(String(step.step.value))&&policy.allowedOrigins.length)assertHttpPolicy(String(step.step.value),'GET',policy,String(step.step.value));
            const actionStart=performance.now();let actual:unknown;
            if(step.step.action!=='screenshot'){
              try{actual=await active.act(step.step);}catch(error){
                if(suite.healing!=='semantic'||!step.step.locator||step.step.action.startsWith('assert')||(error as any).code!=='LOCATOR_NOT_FOUND')throw error;
                const candidates=suggestHealing(step.step.locator,await active.snapshot());if(candidates.length!==1)throw error;
                row.healing=candidates[0];actual=await active.act({...step.step,locator:row.healing.proposed});row.healing.applied=true;row.status='healed';record.status='healed';
              }
            }
            outcome={actual,timings:{actionMs:performance.now()-actionStart}};
          }else throw new Error('Incompatible step');
          if(policy.captureScreenshots){await active.screenshot(await workspace.safe(prefix+'.png'));row.screenshot=prefix.split('/').at(-1)!+'.png';}
        }
        row.actual=outcome.actual;row.timings=outcome.timings;row.attachments=outcome.attachments;
        if('capture' in step)values.capture(step.capture,outcome.actual);
      }catch(error){
        row.status='failed';record.status='failed';row.error=error instanceof Error?error.message:String(error);
        if(error&&typeof error==='object'){row.actual=(error as any).actual;row.timings=(error as any).timings;row.attachments=(error as any).attachments;}
        if(active&&policy.captureScreenshots)try{await active.screenshot(await workspace.safe(prefix+'-failure.png'));row.screenshot=prefix.split('/').at(-1)!+'-failure.png';}catch{}
      }finally{
        row.durationMs=performance.now()-stepStart;
        const safe=values.redact(row);Object.assign(row,safe);
        row.evidence=prefix.split('/').at(-1)!+'-evidence.json';
        await workspace.write(prefix+'-evidence.json',JSON.stringify(values.redact(row),null,2));
      }
    }
    for(const resource of [...drivers.values(),...apis.values()])try{await resource.close();}catch(error){record.status='failed';record.error=values.redact('Session teardown failed: '+String(error));}
    record.durationMs=Date.now()-begun;result.summary[record.status]++;
    await workspace.write(directory+'/results.partial.json',JSON.stringify(values.redact(result),null,2));
  }
  result.durationMs=Date.now()-started;result.status=result.summary.failed?'failed':result.summary.healed?'healed':'passed';
  result.layers=[...new Set(result.tests.flatMap(t=>t.steps.map(s=>s.layer!)))].map(layer=>{const steps=result.tests.flatMap(t=>t.steps).filter(s=>s.layer===layer);return {layer,steps:steps.length,passed:steps.filter(s=>s.status==='passed').length,healed:steps.filter(s=>s.status==='healed').length,failed:steps.filter(s=>s.status==='failed').length,skipped:steps.filter(s=>s.status==='skipped').length,durationMs:steps.reduce((sum,s)=>sum+s.durationMs,0)};});
  if(plan){const coverage=await writeTraceability(plan,suite,workspace,directory,result);result.traceability={planPath:suite.planPath!,total:coverage.summary.total,unmapped:coverage.summary.unmapped};}
  const safeResult=values.redact(result) as RunResult;
  await workspace.write(directory+'/results.json',JSON.stringify(safeResult,null,2));
  await workspace.write(directory+'/index.html',renderReport(safeResult));await workspace.write(directory+'/detailed.html',renderReport(safeResult,true));
  await workspace.write('.infiautomation/latest.json',JSON.stringify({id,directory,summary:result.summary,status:result.status},null,2));
  return {result:safeResult,directory:workspace.path(directory)};
}
