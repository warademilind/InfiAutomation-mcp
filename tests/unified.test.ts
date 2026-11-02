import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdir, mkdtemp } from 'node:fs/promises';
import { resolve } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { runSuite } from '../src/runner.js';
import { Workspace } from '../src/workspace.js';
import { suiteSchema, policySchema } from '../src/schema.js';
import { validateReadQuery } from '../src/database.js';
import { ExecutionValues, effectivePolicy } from '../src/execution-values.js';
import { importApiDocument, readApiDocument } from '../src/api-documents.js';
import { createPlan } from '../src/planning.js';
import type { Driver } from '../src/drivers/types.js';

async function workspace(){await mkdir('.infiautomation/unit',{recursive:true});return new Workspace(await mkdtemp(resolve('.infiautomation/unit/unified-')));}
const apiSuite=(url:string)=>({schemaVersion:2,name:'HTTP/SQL integration',targets:{service:{kind:'api',baseUrl:url}},tests:[{id:'api',name:'Read',steps:[{kind:'api',target:'service',name:'Read',path:'/item',expect:{status:200,checks:[{path:'body.id',equals:7}]}}]}]});
test('version 2 rejects incompatible/missing targets, missing assertions and invalid visual baselines',()=>{
  const suite=apiSuite('http://127.0.0.1');assert.equal(suiteSchema.parse(suite).schemaVersion,2);
  assert.throws(()=>suiteSchema.parse({...suite,targets:{service:{kind:'web'}}}));
  assert.throws(()=>suiteSchema.parse({...suite,tests:[{id:'a',name:'No oracle',steps:[{kind:'database',name:'Read',target:'service',expect:{}}]}]}));
  assert.throws(()=>suiteSchema.parse({...suite,targets:{service:{kind:'web'}},tests:[{id:'a',name:'Visual',steps:[{kind:'ux',target:'service',name:'Diff',check:'visual'}]}]}));
  assert.throws(()=>suiteSchema.parse({...suite,targets:{service:{kind:'web'}},tests:[{id:'a',name:'No performance oracle',steps:[{kind:'ux',target:'service',name:'Metrics only',check:'performance'}]}]}),/explicit assertion/);
});
test('execution values use typed captures and environment secrets, reject inherited paths, and redact nested evidence',()=>{
  process.env.INFI_UNIT_SECRET='unit-only-credential-48213';
  try{const v=new ExecutionValues(['customerEmail']);v.capture({id:'body.id'},{body:{id:7}});assert.equal(v.resolve('${vars.id}'),7);assert.equal(v.resolve('id=${vars.id}'),'id=7');assert.equal(v.resolve('${env.INFI_UNIT_SECRET}'),process.env.INFI_UNIT_SECRET);assert.equal(v.redact({message:'Bearer '+process.env.INFI_UNIT_SECRET,password:'pw',customerEmail:'test@example.invalid'}).message,'Bearer [REDACTED]');assert.equal(v.redact({password:'pw'}).password,'[REDACTED]');assert.throws(()=>v.capture({id:'constructor'},{id:1}));assert.throws(()=>v.resolve('${vars.missing}'));}finally{delete process.env.INFI_UNIT_SECRET;}
});
test('structured plan restrictions can only narrow suite permissions',()=>{
  const plan=policySchema.parse({allowedMethods:['GET'],deniedTargets:['production'],captureScreenshots:false});
  const suite=policySchema.parse({allowedMethods:['GET','POST'],captureScreenshots:true});const policy=effectivePolicy(plan,suite);
  assert.deepEqual(policy.allowedMethods,['GET']);assert.equal(policy.captureScreenshots,false);assert.ok(policy.deniedTargets.includes('production'));
  for(const sql of ['DELETE FROM orders','SELECT 1; DROP TABLE orders','SELECT 1 INTO OUTFILE \'x\'','SELECT * FROM x -- comment','SELECT pg_read_file(\'x\')','SELECT nextval(\'x\')','SELECT * FROM orders WHERE id=${vars.id}'])assert.throws(()=>validateReadQuery(sql));
  assert.equal(validateReadQuery('SELECT * FROM orders WHERE id = ?;'),'SELECT * FROM orders WHERE id = ?');
});
test('real HTTP + SOAP + read-only SQLite run chains captures, schema checks, redacts evidence and keeps timings',async()=>{
  const ws=await workspace(),db=new DatabaseSync(await ws.safe('orders.sqlite'));db.exec('CREATE TABLE orders (id INTEGER, status TEXT); INSERT INTO orders VALUES (7,\'ready\')');db.close();
  const server=createServer((req,res)=>{if(req.url==='/soap'){res.setHeader('Content-Type','text/xml');res.end('<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"><s:Body><AddResponse><AddResult>5</AddResult></AddResponse></s:Body></s:Envelope>');}else{res.setHeader('Content-Type','application/json');res.end(JSON.stringify({id:7,status:'ready',token:'sensitive-response-token'}));}});
  await new Promise<void>(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+(server.address() as any).port;
  process.env.INFI_UNIT_SECRET='private-unit-key-093';
  try{
    const out=await runSuite({schemaVersion:2,name:'HTTP SOAP SQL',targets:{service:{kind:'api',baseUrl:url,headers:{Authorization:'Bearer ${env.INFI_UNIT_SECRET}'}},records:{kind:'database',driver:'sqlite',file:'orders.sqlite'}},policy:{allowedMethods:['GET','POST']},tests:[{id:'chain',name:'Cross-layer verification',requirements:['ORDER-1'],steps:[{kind:'api',target:'service',name:'Read API',path:'/item',expect:{status:200,jsonSchema:{type:'object',required:['id'],properties:{id:{type:'integer'}}},checks:[{path:'body.status',equals:'ready'}]},capture:{orderId:'body.id'}},{kind:'database',target:'records',name:'Verify persisted order',sql:'SELECT id,status FROM orders WHERE id = ?',params:['${vars.orderId}'],expect:{rowCount:1,checks:[{path:'rows.0.status',equals:'ready'}]}},{kind:'api',target:'service',name:'SOAP addition',method:'POST',path:'/soap',soapAction:'Add',body:'<Envelope><Body><Add/></Body></Envelope>',expect:{status:200,checks:[{path:'body.Envelope.Body.AddResponse.AddResult',equals:'5'}]}}]}]},ws);
    assert.equal(out.result.status,'passed');assert.equal(out.result.tests[0].steps.length,3);assert.ok(out.result.tests[0].steps[0].timings!.requestMs>0);assert.ok(out.result.tests[0].steps[1].timings!.queryMs>=0);assert.equal(out.result.layers!.length,2);
    const raw=await ws.read(out.directory+'/results.json');assert.ok(!raw.includes(process.env.INFI_UNIT_SECRET!));assert.ok(!raw.includes('sensitive-response-token'));assert.match(raw,/REDACTED/);
    const html=await ws.read(out.directory+'/index.html');assert.match(html,/Layers & timings/);assert.match(html,/Execution policy/);assert.match(html,/JSON evidence/);
    for(const step of out.result.tests[0].steps)assert.ok(await ws.read(out.directory+'/'+step.evidence));
  }finally{delete process.env.INFI_UNIT_SECRET;await new Promise<void>((r,j)=>server.close(e=>e?j(e):r()));}
});
test('policy rejects writes before requests, external redirects are not followed, failed assertions keep evidence and skip later steps',async()=>{
  let hits=0;const server=createServer((req,res)=>{hits++;if(req.url==='/redirect'){res.writeHead(302,{Location:'http://localhost:1/blocked'});res.end();}else{res.setHeader('Content-Type','application/json');res.end('{"id":7}');}});await new Promise<void>(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+(server.address() as any).port;
  try{const ws=await workspace(),suite=apiSuite(url);await assert.rejects(()=>runSuite({...suite,tests:[{id:'write',name:'Write',steps:[{kind:'api',target:'service',name:'Forbidden',path:'/item',method:'POST',expect:{status:200}}]}]},ws),/Policy blocked HTTP method/);assert.equal(hits,0);
    const out=await runSuite({...suite,tests:[{id:'redirect',name:'Redirect',steps:[{kind:'api',target:'service',name:'No redirect',path:'/redirect',expect:{status:200}},{kind:'api',target:'service',name:'Must skip',path:'/item',expect:{status:200}}]}]},ws);assert.equal(hits,1);assert.equal(out.result.status,'failed');assert.equal((out.result.tests[0].steps[0].actual as any).status,302);assert.equal(out.result.tests[0].steps[1].status,'skipped');
    const restricted=await runSuite({...suite,policy:{allowedOrigins:['https://example.invalid']}},ws);assert.equal(restricted.result.status,'failed');assert.equal(hits,1);
  }finally{await new Promise<void>((r,j)=>server.close(e=>e?j(e):r()));}
});
test('SOAP 1.1/1.2 use their wire headers and unexpected faults cannot pass as HTTP 200',async()=>{
  const server=createServer((req,res)=>{
    const ok=req.url==='/v12'?String(req.headers['content-type']).startsWith('application/soap+xml')&&String(req.headers['content-type']).includes('action="urn:Ping"')&&req.headers.soapaction===undefined:req.headers.soapaction==='"urn:Ping"';
    res.writeHead(ok?200:400,{'Content-Type':'application/soap+xml'});res.end('<Envelope><Body>'+(req.url==='/fault'?'<Fault><Reason>Expected demo fault</Reason></Fault>':'<PingResult>ok</PingResult>')+'</Body></Envelope>');
  });await new Promise<void>(r=>server.listen(0,'127.0.0.1',r));
  try{const ws=await workspace(),baseUrl='http://127.0.0.1:'+(server.address() as any).port;
    const step={kind:'api',target:'service',name:'SOAP',method:'POST',path:'/v11',soapVersion:'1.1',soapAction:'urn:Ping',body:'<Envelope><Body><Ping/></Body></Envelope>',expect:{status:200,checks:[{path:'body.Envelope.Body.PingResult',equals:'ok'}]}};
    const out=await runSuite({schemaVersion:2,name:'SOAP semantics',targets:{service:{kind:'api',baseUrl}},policy:{allowedMethods:['POST']},tests:[{id:'soap11',name:'SOAP 1.1',steps:[step]},{id:'soap12',name:'SOAP 1.2',steps:[{...step,path:'/v12',soapVersion:'1.2'}]},{id:'unexpected-fault',name:'Fault is not a pass',steps:[{...step,path:'/fault',expect:{status:200}}]},{id:'expected-fault',name:'Explicit fault case',steps:[{...step,path:'/fault',expect:{status:200,allowSoapFault:true,checks:[{path:'body.Envelope.Body.Fault.Reason',equals:'Expected demo fault'}]}}]}]},ws);
    assert.deepEqual(out.result.summary,{total:4,passed:3,failed:1,healed:0,skipped:0});assert.match(out.result.tests[2].steps[0].error!,/Unexpected SOAP Fault/);
  }finally{await new Promise<void>((r,j)=>server.close(e=>e?j(e):r()));}
});
test('mixed web and desktop targets share one case, are started lazily and closed even on failure',async()=>{
  const events:string[]=[];const ws=await workspace();
  const out=await runSuite({schemaVersion:2,name:'Mixed UI',targets:{portal:{kind:'web'},calculator:{kind:'desktop',windowTitle:'Calculator'}},policy:{captureScreenshots:false},tests:[{id:'mixed',name:'Cross UI',steps:[{kind:'ui',target:'portal',name:'Web title',step:{name:'Title',action:'assertTitle',value:'Web'}},{kind:'ui',target:'calculator',name:'Native result',step:{name:'Result',action:'assertText',locator:{automationId:'result'},value:'5'}}]}]},ws,target=>({kind:target.kind,start:async()=>{events.push('start:'+target.kind);},act:async()=>({actual:'ok'}),close:async()=>{events.push('close:'+target.kind);},screenshot:async()=>{},snapshot:async()=>({title:'Fixture',nodes:[],truncated:false}),menus:async()=>[],traceStart:async()=>{},traceStop:async()=>{}} as Driver));
  assert.equal(out.result.status,'passed');assert.deepEqual(events,['start:web','start:desktop','close:web','close:desktop']);assert.equal(out.result.tests[0].steps[1].layer,'desktop');
});
test('database reads refuse excess rows, cannot mutate SQLite, and hard timeouts stop synchronous expensive queries',async()=>{
  const ws=await workspace(),db=new DatabaseSync(await ws.safe('bounded.sqlite'));db.exec('CREATE TABLE numbers (n INTEGER)');const insert=db.prepare('INSERT INTO numbers VALUES (?)');for(let i=0;i<100;i++)insert.run(i);db.close();
  const suite={schemaVersion:2,name:'Bounded database',targets:{records:{kind:'database',driver:'sqlite',file:'bounded.sqlite',maxRows:2}},tests:[{id:'rows',name:'Rows',steps:[{kind:'database',target:'records',name:'Read',sql:'SELECT n FROM numbers',expect:{rowCount:2}}]}]};
  const out=await runSuite(suite,ws);assert.equal(out.result.status,'failed');assert.match(out.result.tests[0].steps[0].error!,/exceeded maxRows/);
  const denied=await runSuite({...suite,tests:[{id:'write',name:'Denied',steps:[{kind:'database',target:'records',name:'Write',sql:'DELETE FROM numbers',expect:{rowCount:0}}]}]},ws);assert.equal(denied.result.status,'failed');
  const expensive=await runSuite({...suite,targets:{records:{...suite.targets.records,timeoutMs:300}},tests:[{id:'slow',name:'Hard timeout',steps:[{kind:'database',target:'records',name:'Expensive read',sql:'SELECT COUNT(*) AS n FROM numbers a, numbers b, numbers c, numbers d, numbers e, numbers f',expect:{rowCount:1}}]}]},ws);assert.equal(expensive.result.status,'failed');assert.match(expensive.result.tests[0].steps[0].error!,/timed out/);
  const verify=new DatabaseSync(await ws.safe('bounded.sqlite'),{readOnly:true});try{assert.equal(verify.prepare('SELECT COUNT(*) AS count FROM numbers').get()!.count,100);}finally{verify.close();}
});
test('API import supports OpenAPI YAML, paginated catalogs, Postman, WSDL and refuses XML entity declarations',async()=>{
  const ws=await workspace();await ws.write('openapi.yaml','openapi: 3.1.0\ninfo: {title: Orders, version: 1.0.0}\npaths:\n  /orders:\n    get:\n      operationId: listOrders\n      responses: {"200": {description: OK}}\n    post:\n      operationId: createOrder\n      responses: {"201": {description: Created}}\n');
  const imported=await importApiDocument('openapi.yaml',ws);assert.equal(imported.operationCount,2);const page=await readApiDocument(imported.documentId,ws,0,1);assert.equal(page.nextOffset,1);assert.equal(page.operations[0].operationId,'listOrders');
  await ws.write('service.wsdl','<definitions name="Math"><portType name="MathPort"><operation name="Add"><input message="AddRequest"/><output message="AddResult"/></operation></portType></definitions>');assert.equal((await importApiDocument('service.wsdl',ws)).operations[0].name,'Add');
  await ws.write('postman.json',JSON.stringify({info:{name:'Orders',schema:'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'},item:[{name:'Get order',request:{method:'GET',url:'https://example.invalid/orders'}}]}));assert.equal((await importApiDocument('postman.json',ws)).operationCount,1);
  await ws.write('evil.wsdl','<!DOCTYPE x [<!ENTITY e SYSTEM "file:///private">]><definitions/>');await assert.rejects(()=>importApiDocument('evil.wsdl',ws),/DTD\/entity/);
  const plan=await createPlan({name:'Mixed plan',goal:'Cross-layer',target:{kind:'mixed'},apiDocuments:[imported.documentId],policy:{allowedMethods:['GET']},requirements:['Order is consistent'],scenarios:[{name:'Read order',layers:['web','api','database'],requirementIds:['R01'],steps:['Read all layers'],expected:'Consistent order'}]},ws);assert.match(await ws.read(plan.path),/Execution policy/);
});
