import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { executeDatabase } from '../dist/database.js';
import { databaseTargetSchema, databaseStepSchema } from '../dist/schema.js';
import { Workspace } from '../dist/workspace.js';

const workspace=new Workspace(),require=createRequire(resolve('tools/database/package.json')),results=[];
const configs=[['postgres','INFI_TEST_POSTGRES','SELECT $1::integer AS value'],['mysql','INFI_TEST_MYSQL','SELECT ? AS value'],['mssql','INFI_TEST_MSSQL','SELECT @p1 AS value'],['oracle','INFI_TEST_ORACLE','SELECT :1 AS "value" FROM dual'],['odbc','INFI_TEST_ODBC',process.env.INFI_TEST_ODBC_SELECT||'SELECT ? AS value']];
for(const [driver,connectionEnv,sql] of configs){
  if(!process.env[connectionEnv]){results.push({driver,status:'not-exercised',reason:'No test connection configured'});continue;}
  const target=databaseTargetSchema.parse({kind:'database',driver,connectionEnv,timeoutMs:20000});
  const step=databaseStepSchema.parse({kind:'database',target:'records',name:'Bound parameter read',sql,params:[7],expect:{rowCount:1,checks:[{path:'rows.0.value',equals:7}]}});
  const out=await executeDatabase(target,step,workspace);assert.equal(out.actual.rows[0].value,7);results.push({driver,status:'passed',timings:out.timings});
}
if(process.env.INFI_TEST_MONGODB){
  const {MongoClient}=require('mongodb'),client=new MongoClient(process.env.INFI_TEST_MONGODB),collection='infi_'+randomUUID().replaceAll('-','');await client.connect();
  try{await client.db('infi').collection(collection).insertOne({id:7,status:'ready'});const out=await executeDatabase(databaseTargetSchema.parse({kind:'database',driver:'mongodb',connectionEnv:'INFI_TEST_MONGODB',database:'infi',timeoutMs:20000}),databaseStepSchema.parse({kind:'database',target:'documents',name:'Read synthetic document',operation:'find',collection,filter:{id:7},expect:{rowCount:1,checks:[{path:'rows.0.status',equals:'ready'}]}}),workspace);results.push({driver:'mongodb',status:'passed',timings:out.timings});}
  finally{await client.db('infi').collection(collection).drop();await client.close();}
}else results.push({driver:'mongodb',status:'not-exercised',reason:'No test connection configured'});
if(process.env.INFI_TEST_REDIS){
  const {createClient}=require('redis'),client=createClient({url:process.env.INFI_TEST_REDIS}),key='infi:'+randomUUID();await client.connect();
  try{await client.set(key,'ready');const out=await executeDatabase(databaseTargetSchema.parse({kind:'database',driver:'redis',connectionEnv:'INFI_TEST_REDIS',timeoutMs:20000}),databaseStepSchema.parse({kind:'database',target:'cache',name:'Read synthetic key',operation:'get',key,expect:{rowCount:1,checks:[{path:'rows.0.value',equals:'ready'}]}}),workspace);results.push({driver:'redis',status:'passed',timings:out.timings});}
  finally{await client.del(key);await client.quit();}
}else results.push({driver:'redis',status:'not-exercised',reason:'No test connection configured'});
console.log(JSON.stringify({results},null,2));
if(process.env.INFI_REQUIRE_CORE_DATABASES==='1')for(const driver of ['postgres','mysql','mongodb','redis'])assert.equal(results.find(r=>r.driver===driver)?.status,'passed',driver+' must be exercised in service CI');
