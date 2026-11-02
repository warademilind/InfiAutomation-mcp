import { request, type APIRequestContext } from 'playwright';
import { Ajv } from 'ajv';
import { Ajv2020 } from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import type { z } from 'zod';
import { apiStepSchema, apiTargetSchema, type UnifiedSuite } from './schema.js';
import { assertHttpPolicy, checkValues } from './execution-values.js';

export function parseXml(xml:string):any {
  if(/<!DOCTYPE|<!ENTITY/i.test(xml))throw new Error('DTD/entity declarations are not accepted');
  const valid=XMLValidator.validate(xml);if(valid!==true)throw new Error('Malformed XML: '+valid.err.msg);
  return new XMLParser({ignoreAttributes:false,removeNSPrefix:true,processEntities:false,parseTagValue:false}).parse(xml);
}
export class ApiTester {
  private context?: APIRequestContext;
  constructor(readonly target:z.infer<typeof apiTargetSchema>,readonly policy:UnifiedSuite['policy']){}
  async execute(step:z.infer<typeof apiStepSchema>){
    const url=new URL(step.path,this.target.baseUrl).href;
    assertHttpPolicy(url,step.method,this.policy,this.target.baseUrl);
    if(!this.context)this.context=await request.newContext({timeout:this.target.timeoutMs,ignoreHTTPSErrors:false});
    const headers={...this.target.headers,...step.headers};
    if(step.soapVersion==='1.1'||step.soapAction){headers['Content-Type']??='text/xml; charset=utf-8';if(step.soapAction)headers.SOAPAction=step.soapAction;}
    if(step.soapVersion==='1.2')headers['Content-Type']='application/soap+xml; charset=utf-8'+(step.soapAction?'; action="'+step.soapAction.replace(/["\r\n]/g,'')+'"':'');
    const start=performance.now();
    const response=await this.context.fetch(url,{method:step.method,headers,data:step.body,failOnStatusCode:false,maxRedirects:0,timeout:this.target.timeoutMs});
    try{
      const bytes=await response.body(),durationMs=performance.now()-start;
      if(bytes.length>2*1024*1024)throw new Error('Response exceeds 2 MiB evidence limit');
      const text=bytes.toString('utf8'),responseHeaders=response.headers();let body:unknown=text;
      if(text.trim()&&(responseHeaders['content-type']||'').includes('json'))body=JSON.parse(text);
      else if(text.trim()&&(/xml/.test(responseHeaders['content-type']||'')||step.soapVersion||step.soapAction))body=parseXml(text);
      const actual={request:{method:step.method,url,headers,body:step.body},status:response.status(),headers:responseHeaders,body,durationMs};
      try{
        if(actual.status!==step.expect.status)throw new Error('HTTP status assertion failed: expected '+step.expect.status+', received '+actual.status);
        if((step.soapAction||step.soapVersion)&&!step.expect.allowSoapFault&&(body as any)?.Envelope?.Body?.Fault)throw new Error('Unexpected SOAP Fault');
        checkValues(actual,step.expect.checks);
        if(step.expect.maxDurationMs!==undefined&&durationMs>step.expect.maxDurationMs)throw new Error('API response exceeded '+step.expect.maxDurationMs+' ms');
        if(step.expect.jsonSchema){
          const Constructor=String(step.expect.jsonSchema.$schema||'').includes('2020-12')?Ajv2020:Ajv;
          const ajv=new Constructor({allErrors:true,strict:false,validateFormats:true});(addFormats as any)(ajv);
          const validate=ajv.compile(step.expect.jsonSchema);
          if(!validate(body))throw new Error('JSON Schema assertion failed: '+ajv.errorsText(validate.errors));
        }
      }catch(error){throw Object.assign(error as Error,{actual,timings:{requestMs:durationMs}});}
      return {actual,timings:{requestMs:durationMs}};
    }finally{await response.dispose();}
  }
  async close(){await this.context?.dispose();}
}
