import { fork } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { performance } from 'node:perf_hooks';
import type { z } from 'zod';
import { databaseStepSchema, databaseKinds, type DatabaseTarget } from './schema.js';
import { Workspace } from './workspace.js';
import { checkValues } from './execution-values.js';

export const databaseDrivers:Record<typeof databaseKinds[number],{module:string;label:string}>={sqlite:{module:'node:sqlite',label:'SQLite'},postgres:{module:'pg',label:'PostgreSQL / compatible servers'},mysql:{module:'mysql2/promise',label:'MySQL / MariaDB'},mssql:{module:'mssql',label:'Microsoft SQL Server / Azure SQL'},oracle:{module:'oracledb',label:'Oracle (Thin mode)'},mongodb:{module:'mongodb',label:'MongoDB'},redis:{module:'redis',label:'Redis'},odbc:{module:'odbc',label:'ODBC DSN (vendor driver required)'}};
export function databaseCapabilities(workspace:Workspace){
  const loader=createRequire(join(workspace.root,'tools/database/package.json'));
  return databaseKinds.map(driver=>{const entry=databaseDrivers[driver];let installed=driver==='sqlite';try{loader.resolve(entry.module);installed=true;}catch{}return {driver,...entry,installed,readOnly:true,qualification:driver==='odbc'?'Requires a compatible installed vendor ODBC driver and read-only account; validate SQL dialect per server':'Adapter available; connectivity depends on your server, credentials and network'};});
}
export function validateReadQuery(sql:string){
  const query=sql.trim().replace(/;\s*$/,'');
  if(!/^select\b/i.test(query)||/;|--|\/\*|\*\//.test(query))throw new Error('Database policy allows a single SELECT statement without comments');
  const clean=query.replace(/'(?:''|[^'])*'/g,"''");
  if(/\b(insert|update|delete|merge|drop|alter|create|truncate|grant|revoke|execute|exec|call|copy|attach|detach|pragma|vacuum|into|for\s+update|lock|load_file|outfile|dumpfile|openrowset|opendatasource|xp_\w+|pg_read\w*|pg_write\w*|pg_ls\w*|dblink\w*|lo_import|lo_export|load_extension|nextval|setval|set_config|pg_advisory\w*)\b/i.test(clean))throw new Error('Database policy blocked a potentially mutating or external-access query');
  if(/\$\{/.test(query))throw new Error('Use bound params for variables, never interpolate SQL text');
  return query;
}
export async function executeDatabase(target:DatabaseTarget,step:z.infer<typeof databaseStepSchema>,workspace:Workspace){
  if(target.driver==='mongodb'?step.operation!=='find':target.driver==='redis'?step.operation!=='get':step.operation!=='query')throw new Error('Database operation is incompatible with driver '+target.driver);
  const sql=step.operation==='query'?validateReadQuery(step.sql||''):undefined;
  if(step.operation==='find'&&!step.collection)throw new Error('MongoDB find requires collection');
  if(step.operation==='get'&&!step.key)throw new Error('Redis get requires key');
  if(/\$(where|function|accumulator|out|merge)\b/.test(JSON.stringify(step.filter)))throw new Error('MongoDB executable/write operators are not allowed');
  const connection=target.connectionEnv?process.env[target.connectionEnv]:undefined;
  if(target.driver!=='sqlite'&&!connection)throw new Error('Missing database connection environment variable '+target.connectionEnv);
  const file=target.driver==='sqlite'?await workspace.safe(target.file!):undefined;
  const built=new URL('./database-worker.js',import.meta.url);
  const url=existsSync(fileURLToPath(built))?built:new URL('../dist/database-worker.js',import.meta.url);
  const started=performance.now();
  const actual:any=await new Promise((resolve,reject)=>{
    const environment=Object.fromEntries(['PATH','SystemRoot','SYSTEMDRIVE','HOME','USERPROFILE','APPDATA','LOCALAPPDATA','TMP','TEMP','LD_LIBRARY_PATH','ODBCINI','ODBCSYSINI','NODE_EXTRA_CA_CERTS','NODE_USE_SYSTEM_CA'].flatMap(key=>process.env[key]===undefined?[]:[[key,process.env[key]!]]));
    const worker=fork(fileURLToPath(url),[],{serialization:'advanced',env:environment,execArgv:[],stdio:['ignore','ignore','ignore','ipc'],windowsHide:true});
    let settled=false;
    const timer=setTimeout(()=>finish(new Error('Database operation timed out after '+target.timeoutMs+' ms')),target.timeoutMs);
    function finish(error?:Error,value?:unknown){if(settled)return;settled=true;clearTimeout(timer);worker.kill();if(error)reject(error);else resolve(value);}
    worker.once('message',(message:any)=>message.error?finish(new Error(message.error)):finish(undefined,message));
    worker.once('error',error=>finish(error));
    worker.once('exit',code=>{if(!settled)finish(new Error('Database worker exited without a result ('+code+')'));});
    worker.send({target:{...target,file},step:{...step,sql},connection,workspace:workspace.root});
  });
  actual.totalMs=performance.now()-started;
  const timings={connectMs:actual.connectMs,queryMs:actual.queryMs,totalMs:actual.totalMs};
  try{
    if(step.expect.rowCount!==undefined&&actual.rowCount!==step.expect.rowCount)throw new Error('Row count assertion failed: expected '+step.expect.rowCount+', received '+actual.rowCount);
    checkValues(actual,step.expect.checks);
    if(step.expect.maxDurationMs!==undefined&&actual.queryMs>step.expect.maxDurationMs)throw new Error('Database query exceeded '+step.expect.maxDurationMs+' ms');
  }catch(error){throw Object.assign(error as Error,{actual,timings});}
  return {actual,timings};
}
