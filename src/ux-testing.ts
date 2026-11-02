import AxeBuilder from '@axe-core/playwright';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { readFile, writeFile, copyFile } from 'node:fs/promises';
import type { z } from 'zod';
import { uxStepSchema } from './schema.js';
import { WebDriver } from './drivers/web.js';
import type { Driver } from './drivers/types.js';
import { Workspace } from './workspace.js';

export async function executeUx(driver:Driver,step:z.infer<typeof uxStepSchema>,workspace:Workspace,prefix:string){
  if(!(driver instanceof WebDriver)&&step.check!=='visual')throw new Error('Browser UX checks require a web or Electron target; native desktop supports visual baselines and UIA assertions');
  const page=driver instanceof WebDriver?driver.page:undefined;
  if(step.viewport){if(!(driver instanceof WebDriver)||driver.target.cdpUrl)throw new Error('Viewport resizing needs an isolated web/Electron session');await page!.setViewportSize(step.viewport);}
  const start=performance.now();if(step.selector){if(!page)throw new Error('CSS selector scope requires web/Electron');await page.locator(step.selector).waitFor({state:'visible',timeout:(driver as WebDriver).target.timeoutMs});}
  const readyWaitMs=performance.now()-start;
  let actual:any;const attachments:{label:string;path:string}[]=[];
  if(step.check==='accessibility'){
    let builder=new AxeBuilder({page:page!}).withTags(step.tags);if(step.selector)builder=builder.include(step.selector);
    const results=await builder.analyze();
    actual={engine:'axe-core',scope:step.selector||'document',violationCount:results.violations.length,incompleteCount:results.incomplete.length,violations:results.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,help:v.help,helpUrl:v.helpUrl,nodes:v.nodes.slice(0,50).map(n=>({target:n.target,failureSummary:n.failureSummary}))})),note:'Automated checks cover a subset of accessibility requirements; manual keyboard, screen-reader and usability review remains necessary.'};
  }else if(step.check==='layout'){
    actual=await page!.evaluate(({selector,minTapTargetPx})=>{
      const root=selector?document.querySelector(selector):document.documentElement;if(!root)throw new Error('Layout scope was not found');
      const smallTargets=Array.from(root.querySelectorAll('button,a,input,select,[role="button"]')).filter(el=>{const r=el.getBoundingClientRect();return r.width>0&&r.height>0&&(r.width<minTapTargetPx||r.height<minTapTargetPx);}).slice(0,100).map(el=>({tag:el.tagName,name:el.getAttribute('aria-label')||el.textContent?.trim().slice(0,80),width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height}));
      return {viewport:{width:innerWidth,height:innerHeight},overflowPx:Math.max(0,root.scrollWidth-root.clientWidth),smallTargets};
    },{selector:step.selector,minTapTargetPx:step.minTapTargetPx});
  }else if(step.check==='performance'){
    actual=await page!.evaluate(()=>{const nav=performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming|undefined;return {navigation:nav?{timeToFirstByteMs:nav.responseStart-nav.requestStart,domContentLoadedMs:nav.domContentLoadedEventEnd,loadMs:nav.loadEventEnd,domInteractiveMs:nav.domInteractive}:null,paint:performance.getEntriesByType('paint').map(p=>({name:p.name,startTimeMs:p.startTime})),webVitals:(window as any).__infiMetrics||null,note:'Navigation and paint are browser timings; readyWaitMs measures only this step\'s wait for visibility. LCP and CLS are observed up to this checkpoint, not final field Core Web Vitals. This is not backend latency or subjective usability.'};});
    actual.readyWaitMs=readyWaitMs;
  }else{
    const baseline=PNG.sync.read(await readFile(await workspace.safe(step.baseline!)));
    const currentPath=prefix+'-current.png',baselinePath=prefix+'-baseline.png';
    const current=page?PNG.sync.read(await page.screenshot({animations:'disabled',timeout:(driver as WebDriver).target.timeoutMs})):await (async()=>{await driver.screenshot(await workspace.safe(currentPath));return PNG.sync.read(await readFile(await workspace.safe(currentPath)));})();
    await writeFile(await workspace.safe(currentPath),PNG.sync.write(current));await copyFile(await workspace.safe(step.baseline!),await workspace.safe(baselinePath));
    attachments.push({label:'Current screenshot',path:currentPath.split('/').at(-1)!},{label:'Approved baseline',path:baselinePath.split('/').at(-1)!});
    if(current.width!==baseline.width||current.height!==baseline.height)throw Object.assign(new Error('Visual baseline dimensions differ; review viewport, OS, browser and font configuration'),{actual:{baseline:{width:baseline.width,height:baseline.height},current:{width:current.width,height:current.height}},attachments});
    const diff=new PNG({width:current.width,height:current.height});const differentPixels=pixelmatch(baseline.data,current.data,diff.data,current.width,current.height,{threshold:step.threshold});
    const diffPath=prefix+'-diff.png';await writeFile(await workspace.safe(diffPath),PNG.sync.write(diff));attachments.push({label:'Pixel difference',path:diffPath.split('/').at(-1)!});
    actual={differentPixels,totalPixels:current.width*current.height,diffRatio:differentPixels/(current.width*current.height),maxDiffRatio:step.maxDiffRatio};
  }
  const durationMs=performance.now()-start,timings={uxCheckMs:durationMs,readyWaitMs};
  let message:string|undefined;
  if(step.check==='accessibility'&&actual.violationCount>step.maxViolations)message='Accessibility violations '+actual.violationCount+' exceed '+step.maxViolations;
  if(step.check==='layout'&&(actual.overflowPx>step.maxOverflowPx||actual.smallTargets.length))message='Layout thresholds failed (overflow or small interactive targets)';
  if(step.check==='performance'&&step.maxDurationMs!==undefined&&Math.max(actual.navigation?.domContentLoadedMs||0,readyWaitMs)>step.maxDurationMs)message='UI readiness/DOMContentLoaded exceeded '+step.maxDurationMs+' ms';
  if(step.check==='visual'&&actual.diffRatio>step.maxDiffRatio)message='Visual difference ratio '+actual.diffRatio+' exceeds '+step.maxDiffRatio;
  if(message)throw Object.assign(new Error(message),{actual,timings,attachments});
  return {actual,timings,attachments};
}
