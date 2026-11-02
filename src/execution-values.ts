import { isDeepStrictEqual } from 'node:util';
import type { UnifiedSuite } from './schema.js';

export function readPath(value: unknown, path: string): unknown {
  if (!path || path === '$') return value;
  const parts = path.replace(/^\$\.?/, '').replace(/\[(\d+)\]/g, '.$1').split('.');
  let current: any = value;
  for (const part of parts) {
    if (['__proto__','constructor','prototype'].includes(part)) throw new Error('Unsafe value path');
    if (current === null || typeof current !== 'object' || !Object.hasOwn(current, part)) return undefined;
    current = current[part];
  }
  return current;
}
export class ExecutionValues {
  readonly variables: Record<string,unknown> = Object.create(null);
  private readonly secrets = new Set<string>();
  constructor(readonly redactKeys: string[] = []) {}
  resolve(value: any): any {
    if (Array.isArray(value)) return value.map(v=>this.resolve(v));
    if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,this.resolve(v)]));
    if (typeof value !== 'string') return value;
    const replace = (_:string, source:string, key:string) => {
      const resolved = source === 'env' ? process.env[key] : this.variables[key];
      if (resolved === undefined) throw new Error('Missing '+source+' value: '+key);
      if (source === 'env' && String(resolved).length) this.secrets.add(String(resolved));
      return resolved;
    };
    const exact = /^\$\{(env|vars)\.([A-Za-z][A-Za-z0-9_]*)\}$/.exec(value);
    if (exact) return replace(exact[0],exact[1],exact[2]);
    return value.replace(/\$\{(env|vars)\.([A-Za-z][A-Za-z0-9_]*)\}/g,(all,source,key)=>String(replace(all,source,key)));
  }
  capture(map: Record<string,string>, value: unknown) {
    for (const [name,path] of Object.entries(map)) {
      if (['__proto__','constructor','prototype'].includes(name)) throw new Error('Unsafe capture name');
      const found = readPath(value,path);
      if (found === undefined) throw new Error('Capture path not found: '+path);
      if(/password|token|secret|api[-_]?key|authorization/i.test(name+' '+path)&&typeof found==='string')this.addSecret(found);
      this.variables[name] = found;
    }
  }
  addSecret(value: string) { if(value)this.secrets.add(value); }
  redact(value: any): any {
    if (typeof value === 'bigint') return String(value);
    if (value instanceof Date) return value.toISOString();
    if (typeof value === 'string') {let text=value;for(const secret of [...this.secrets].sort((a,b)=>b.length-a.length))text=text.split(secret).join('[REDACTED]');return text.replace(/(https?:\/\/)[^/@\s]+:[^/@\s]+@/g,'$1[REDACTED]@');}
    if (Array.isArray(value)) return value.map(v=>this.redact(v));
    if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,(/authorization|cookie|password|passwd|token|secret|api[-_]?key|connectionstring/i.test(k)||this.redactKeys.some(key=>key.toLowerCase()===k.toLowerCase()))?'[REDACTED]':this.redact(v)]));
    return value;
  }
}
export function checkValues(value:unknown, checks:{path:string;equals?:unknown;contains?:string;exists?:boolean}[]) {
  for(const check of checks){
    const actual=readPath(value,check.path);
    if(check.exists!==undefined && (actual!==undefined)!==check.exists)throw new Error('Existence assertion failed at '+check.path);
    if(Object.hasOwn(check,'equals')&&!isDeepStrictEqual(actual,check.equals))throw new Error('Value assertion failed at '+check.path+': expected '+JSON.stringify(check.equals)+', received '+JSON.stringify(actual));
    if(check.contains!==undefined&&!String(actual).includes(check.contains))throw new Error('Contains assertion failed at '+check.path);
  }
}
export function assertHttpPolicy(url:string,method:string,policy:UnifiedSuite['policy'],baseUrl:string) {
  const parsed=new URL(url);
  if(!['http:','https:'].includes(parsed.protocol)||parsed.username||parsed.password)throw new Error('Only HTTP(S) URLs without embedded credentials are supported');
  const origins=policy.allowedOrigins.length?policy.allowedOrigins.map(origin=>new URL(origin).origin):[new URL(baseUrl).origin];
  if(!origins.includes(parsed.origin))throw new Error('Policy blocked origin: '+parsed.origin);
  if(!policy.allowedMethods.includes(method as any))throw new Error('Policy blocked HTTP method: '+method);
}
export function effectivePolicy(planPolicy:UnifiedSuite['policy']|undefined,suitePolicy:UnifiedSuite['policy']):UnifiedSuite['policy'] {
  if(!planPolicy)return suitePolicy;
  const intersection=(a:string[],b:string[])=>a.filter(v=>b.includes(v));
  const planOrigins=planPolicy.allowedOrigins.map(value=>new URL(value).origin),suiteOrigins=suitePolicy.allowedOrigins.map(value=>new URL(value).origin);
  const origins=planOrigins.length?(suiteOrigins.length?intersection(planOrigins,suiteOrigins):planOrigins):suiteOrigins;
  if(planPolicy.allowedOrigins.length&&suitePolicy.allowedOrigins.length&&!origins.length)throw new Error('Plan and suite policies have no allowed origin in common');
  return {...suitePolicy,allowedMethods:intersection(planPolicy.allowedMethods,suitePolicy.allowedMethods) as UnifiedSuite['policy']['allowedMethods'],allowedOrigins:origins,captureScreenshots:planPolicy.captureScreenshots&&suitePolicy.captureScreenshots,deniedTargets:[...new Set([...planPolicy.deniedTargets,...suitePolicy.deniedTargets])],deniedUiActions:[...new Set([...planPolicy.deniedUiActions,...suitePolicy.deniedUiActions])],redactKeys:[...new Set([...planPolicy.redactKeys,...suitePolicy.redactKeys])],dos:[...new Set([...planPolicy.dos,...suitePolicy.dos])],donts:[...new Set([...planPolicy.donts,...suitePolicy.donts])]};
}
