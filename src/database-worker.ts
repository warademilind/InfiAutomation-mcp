import { createRequire } from 'node:module';
import { join } from 'node:path';
import { performance } from 'node:perf_hooks';
import { databaseDrivers } from './database.js';

// A separate process bounds synchronous SQLite/native ODBC too: the parent can kill it.
async function execute(data:any){
  const {target,step,connection,workspace}=data;
  const require=createRequire(join(workspace,'tools/database/package.json'));
  const name=databaseDrivers[target.driver as keyof typeof databaseDrivers].module;
  let module:any;try{module=require(name);}catch{throw new Error('Missing database driver '+name+'. Install its package under tools/database in your workspace; see docs/DATABASES.md.');}
  const config=()=>connection.trim().startsWith('{')?JSON.parse(connection):connection;
  const begun=performance.now();let query:()=>Promise<any[]>,close:()=>Promise<void>,client:any;
  if(target.driver==='sqlite'){
    client=new module.DatabaseSync(target.file,{readOnly:true,enableExtensionLoading:false,timeout:target.timeoutMs});
    client.exec('PRAGMA query_only=ON');
    query=async()=>{const rows:any[]=[];for(const row of client.prepare(step.sql).iterate(...step.params)){rows.push(row);if(rows.length>target.maxRows)break;}return rows;};close=async()=>client.close();
  }else if(target.driver==='postgres'){
    client=new module.Client(typeof config()==='string'?{connectionString:connection,connectionTimeoutMillis:target.timeoutMs,query_timeout:target.timeoutMs,options:'-c default_transaction_read_only=on -c statement_timeout='+target.timeoutMs}:{...config(),connectionTimeoutMillis:target.timeoutMs,query_timeout:target.timeoutMs,options:'-c default_transaction_read_only=on -c statement_timeout='+target.timeoutMs});
    try{await client.connect();}catch(e){await client.end().catch(()=>{});throw e;}
    query=async()=>(await client.query('SELECT * FROM ('+step.sql+') AS infi_read LIMIT '+(target.maxRows+1),step.params)).rows;close=()=>client.end();
  }else if(target.driver==='mysql'){
    client=await module.createConnection(config());
    query=async()=>{await client.query('SET SESSION TRANSACTION READ ONLY');await client.query('START TRANSACTION READ ONLY');return (await client.execute({sql:'SELECT * FROM ('+step.sql+') AS infi_read LIMIT '+(target.maxRows+1),timeout:target.timeoutMs},step.params))[0];};close=()=>client.end();
  }else if(target.driver==='mssql'){
    client=await new module.ConnectionPool(typeof config()==='string'?config():{...config(),connectionTimeout:target.timeoutMs,requestTimeout:target.timeoutMs}).connect();
    query=async()=>{const request=client.request();request.timeout=target.timeoutMs;step.params.forEach((value:any,index:number)=>request.input('p'+(index+1),value));return (await request.query('SELECT TOP ('+(target.maxRows+1)+') * FROM ('+step.sql+') AS infi_read')).recordset;};close=()=>client.close();
  }else if(target.driver==='oracle'){
    client=await module.getConnection(config());client.callTimeout=target.timeoutMs;
    query=async()=>{await client.execute('SET TRANSACTION READ ONLY');return (await client.execute(step.sql,step.params,{outFormat:module.OUT_FORMAT_OBJECT,maxRows:target.maxRows+1})).rows;};close=()=>client.close();
  }else if(target.driver==='mongodb'){
    client=new module.MongoClient(connection,{serverSelectionTimeoutMS:target.timeoutMs,connectTimeoutMS:target.timeoutMs,socketTimeoutMS:target.timeoutMs});
    try{await client.connect();}catch(e){await client.close();throw e;}
    query=()=>client.db(target.database).collection(step.collection).find(step.filter,{maxTimeMS:target.timeoutMs}).limit(target.maxRows+1).toArray();close=()=>client.close();
  }else if(target.driver==='redis'){
    client=module.createClient({url:connection,socket:{connectTimeout:target.timeoutMs,reconnectStrategy:false}});client.on('error',()=>{});
    try{await client.connect();}catch(e){client.destroy();throw e;}
    query=async()=>{const value=await client.get(step.key);return value===null?[]:[{key:step.key,value}];};close=async()=>{client.destroy();};
  }else{
    client=await module.connect(connection);query=async()=>Array.from(await client.query(step.sql,step.params));close=()=>client.close();
  }
  const connected=performance.now();
  try{const rows=await query(),ended=performance.now();if(rows.length>target.maxRows)throw new Error('Query exceeded maxRows '+target.maxRows+'; narrow the query instead of silently truncating assertions');return {driver:target.driver,rows,rowCount:rows.length,connectMs:connected-begun,queryMs:ended-connected};}
  finally{await close();}
}
process.once('message',data=>void execute(data).then(result=>process.send?.(result)).catch(error=>process.send?.({error:error instanceof Error?error.message:String(error)})));
