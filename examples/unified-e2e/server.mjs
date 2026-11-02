// Local demonstration only: synthetic data, loopback binding, no production secrets.
import { createServer } from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { pathToFileURL } from 'node:url';

export async function startFixture(workspace,port=47831){
  await mkdir(workspace,{recursive:true});
  const database=new DatabaseSync(resolve(workspace,'orders.sqlite'));
  database.exec('CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, product TEXT NOT NULL, status TEXT NOT NULL)');
  const server=createServer(async(req,res)=>{
    const route=new URL(req.url,'http://127.0.0.1'),json=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json'});res.end(JSON.stringify(data));};
    if(req.method==='POST'&&route.pathname==='/api/orders'){
      let text='';for await(const chunk of req){text+=chunk;if(text.length>8192)return json(413,{error:'Body too large'});}
      let body;try{body=JSON.parse(text);}catch{return json(400,{error:'Invalid JSON'});}
      if(typeof body.product!=='string'||!body.product.trim())return json(400,{error:'product is required'});
      const order={id:randomUUID(),product:body.product,status:'created'};database.prepare('INSERT INTO orders VALUES (?,?,?)').run(order.id,order.product,order.status);return json(201,order);
    }
    if(req.method==='GET'&&route.pathname.startsWith('/api/orders/')){const row=database.prepare('SELECT * FROM orders WHERE id = ?').get(route.pathname.split('/').at(-1));return row?json(200,row):json(404,{error:'Order not found'});}
    if(req.method==='POST'&&route.pathname==='/soap'){
      let text='';for await(const chunk of req){text+=chunk;if(text.length>8192)return json(413,{error:'Body too large'});}
      const a=Number(/<(?:\w+:)?a>([^<]+)</.exec(text)?.[1]),b=Number(/<(?:\w+:)?b>([^<]+)</.exec(text)?.[1]);
      if(!Number.isFinite(a)||!Number.isFinite(b))return json(400,{error:'Expected numeric a and b'});
      res.writeHead(200,{'Content-Type':'text/xml; charset=utf-8'});return res.end('<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><AddResponse xmlns="urn:infi:math"><AddResult>'+(a+b)+'</AddResult></AddResponse></soap:Body></soap:Envelope>');
    }
    if(req.method==='GET'&&(route.pathname==='/'||route.pathname.startsWith('/orders/'))){
      res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});return res.end(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Order workspace</title><style>*{box-sizing:border-box}body{margin:0;background:#f4f6fb;color:#18243b;font:16px/1.6 system-ui}main{max-width:880px;margin:48px auto;padding:32px;background:white;border:1px solid #cbd5e1;border-radius:18px}h1{font-size:32px}p{overflow-wrap:anywhere}.eyebrow{color:#4d3c9e;font-weight:700}.panel{background:#eff3fa;padding:24px;border-radius:12px}a{color:#4d3c9e}button{min-width:48px;min-height:48px;padding:12px 20px;background:#5037a5;color:white;border:0;border-radius:8px;font:inherit;cursor:pointer}:focus-visible{outline:3px solid #194cbc;outline-offset:4px}@media(max-width:600px){main{margin:16px;padding:20px}h1{font-size:26px}.panel{padding:16px}}</style></head><body><main><p class="eyebrow">InfiAutomation / synthetic local fixture</p><h1>Order workspace</h1><p>This page, REST service and SQLite store share the same demonstration order.</p><section class="panel" aria-labelledby="order-title"><h2 id="order-title">Order details</h2><p>Order ID: <strong data-testid="order-id">Loading</strong></p><p>Product: <strong data-testid="product">Loading</strong></p><p>Status: <strong data-testid="status" role="status">Loading</strong></p></section><h2>Cross-application calculation</h2><p>Calculate 2 + 3 here, then verify the same result in Windows Calculator.</p><button id="add" type="button">Calculate 2 + 3</button><p>Result: <output data-testid="sum" aria-live="polite">Ready</output></p><p>Evidence is produced by actual test execution. No production data is used.</p></main><script>document.getElementById('add').onclick=()=>{document.querySelector('[data-testid=sum]').textContent=String(2+3)};const id=location.pathname.split('/').at(-1);if(location.pathname.startsWith('/orders/'))fetch('/api/orders/'+encodeURIComponent(id)).then(r=>r.json()).then(order=>{for(const [key,value] of Object.entries(order)){const el=document.querySelector('[data-testid="'+key.replace('id','order-id')+'"]');if(el)el.textContent=value}}).catch(()=>document.querySelector('[data-testid=status]').textContent='Unavailable');else for(const el of document.querySelectorAll('[data-testid]'))if(el.dataset.testid!=='sum')el.textContent='No order selected';</script></body></html>`);
    }
    json(404,{error:'Not found'});
  });
  await new Promise((done,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',done);});
  return {url:'http://127.0.0.1:'+server.address().port,close:()=>new Promise((done,reject)=>server.close(error=>{database.close();error?reject(error):done();}))};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){const workspace=resolve(process.argv[2]||'.');const fixture=await startFixture(workspace);console.log('Synthetic fixture: '+fixture.url+'\nSQLite file: '+resolve(workspace,'orders.sqlite')+'\nKeep this terminal open during the suite. Ctrl+C stops the fixture.');}
