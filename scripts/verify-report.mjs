import { chromium } from 'playwright';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
import { renderReport } from '../dist/report.js';

const directory=(await readFile('integration/output/web-report-path.txt','utf8')).trim();
const run=JSON.parse(await readFile(resolve(directory,'results.json'),'utf8'));
await writeFile(resolve(directory,'index.html'),renderReport(run));
await writeFile(resolve(directory,'detailed.html'),renderReport(run,true));
await mkdir('integration/output',{recursive:true});
const browser=await chromium.launch({headless:true});
try {
  const page=await browser.newPage({viewport:{width:1512,height:1100}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(pathToFileURL(resolve(directory,'index.html')).href);
  await page.getByRole('heading',{name:'Web adapter verification',exact:true}).waitFor();
  const nav=name=>page.locator('.nav').getByRole('button',{name,exact:true}).click();

  const stability=await page.evaluate(async()=>{
    const row=document.querySelector('#rows tr'),filters=[...document.querySelectorAll('[data-filter]')],frames=[];
    let mutations=0;const observer=new MutationObserver(records=>mutations+=records.length);
    observer.observe(document.getElementById('rows'),{childList:true});
    for(let cycle=0;cycle<3;cycle++)for(const name of ['tests','healing','environment','overview']){
      document.querySelector('.nav [data-view="'+name+'"]').click();
      await new Promise(requestAnimationFrame);
      const header=document.querySelector('.hero').getBoundingClientRect(),nav=document.querySelector('.nav').getBoundingClientRect();
      frames.push({headerX:header.x,headerY:header.y,width:header.width,navY:nav.y,height:document.documentElement.scrollHeight,viewport:document.documentElement.clientWidth});
    }
    observer.disconnect();
    return {frames,mutations,sameRow:document.querySelector('#rows tr')===row,sameFilters:filters.every((button,i)=>button===document.querySelectorAll('[data-filter]')[i])};
  });
  for(const key of ['headerX','headerY','width','navY','height','viewport'])assert.ok(Math.max(...stability.frames.map(f=>f[key]))-Math.min(...stability.frames.map(f=>f[key]))<=1,'Navigation layout changed: '+key);
  assert.equal(stability.mutations,0,'Menu navigation rebuilt test rows');
  assert.equal(stability.sameRow,true);assert.equal(stability.sameFilters,true);

  await nav('Test explorer');assert.equal(await page.locator('#rows tr').count(),3);
  await page.getByRole('button',{name:'Save project with form controls',exact:true}).click();
  await page.getByRole('dialog').waitFor();assert.equal(await page.locator('.step').count(),6);
  await page.getByRole('button',{name:'Expand actual results',exact:true}).click();
  assert.ok(await page.locator('.actual-result[open]').count()>0);
  const frameBefore=await page.locator('.evidence-frame').first().boundingBox();
  await page.locator('.evidence').first().evaluate(img=>img.decode());
  assert.deepEqual(await page.locator('.evidence-frame').first().boundingBox(),frameBefore,'Image loading shifted evidence layout');
  const portrait='data:image/png;base64,'+(await readFile('examples/calculator/report/CALC04-step-6.png')).toString('base64');
  await page.locator('.evidence').first().evaluate((img,url)=>{img.src=url;return img.decode()},portrait);
  assert.deepEqual(await page.locator('.evidence-frame').first().boundingBox(),frameBefore,'A portrait screenshot shifted the reserved frame');
  await page.getByRole('button',{name:'Expand image',exact:true}).first().click();
  assert.equal(await page.locator('.evidence-block.expanded').count(),1);
  await page.getByRole('button',{name:'Next test',exact:true}).click();
  await page.getByRole('heading',{name:run.tests[1].name,exact:true}).waitFor();
  const failedIndex=run.tests.findIndex(test=>test.status==='failed');
  for(let i=1;i<failedIndex;i++)await page.getByRole('button',{name:'Next test',exact:true}).click();
  await page.getByRole('button',{name:/Failed steps \([1-9]/}).click();
  assert.equal(await page.locator('.step:not(.hidden):not(.failed)').count(),0);
  await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog').isVisible(),false);
  assert.equal(await page.getByRole('button',{name:'Save project with form controls',exact:true}).evaluate(el=>el===document.activeElement),true);

  await page.getByRole('searchbox').fill('negative');assert.equal(await page.locator('#rows tr').count(),1);
  await nav('Environment');await nav('Test explorer');assert.equal(await page.getByRole('searchbox').inputValue(),'negative');
  await page.getByRole('button',{name:'Clear search',exact:true}).click();assert.equal(await page.locator('#rows tr').count(),3);
  await nav('Healing audit');assert.equal(await page.locator('.audit-card').count(),1);
  await page.getByText('Compare original and proposed locators',{exact:true}).click();
  await page.getByRole('button',{name:'Recover renamed CSS ID with exact accessible identity',exact:true}).click();
  await page.getByText('Locator repair applied',{exact:false}).waitFor();await page.keyboard.press('Escape');
  await nav('Test explorer');await page.getByRole('searchbox').fill('no-such-test');
  await page.getByRole('button',{name:'Reset filters',exact:true}).click();assert.equal(await page.locator('#rows tr').count(),3);
  await nav('Overview');await page.screenshot({path:'integration/output/report-desktop.png',fullPage:true});
  await page.getByRole('button',{name:'Toggle color theme',exact:true}).click();
  await page.screenshot({path:'integration/output/report-light.png',fullPage:true});
  await page.getByRole('button',{name:'Toggle color theme',exact:true}).click();
  for(const width of [390,320]){
    await page.setViewportSize({width,height:844});
    for(const name of ['Overview','Test explorer','Healing audit','Environment']){await nav(name);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'Mobile overflow: '+name+' at '+width)}
  }
  await nav('Overview');await page.screenshot({path:'integration/output/report-mobile.png',fullPage:true});
  await page.setViewportSize({width:1512,height:1100});
  await page.goto(pathToFileURL(resolve(directory,'detailed.html')).href);assert.equal(await page.locator('#overview').isVisible(),false);

  // A clearly named UI fixture exercises pages beyond the three real adapter cases.
  const cases=Array.from({length:27},(_,i)=>({...run.tests[i%run.tests.length],id:'ui-'+i,name:'Pagination fixture '+i,steps:run.tests[i%run.tests.length].steps.map(({screenshot,...step})=>step),trace:undefined}));
  const summary={total:cases.length,passed:0,failed:0,healed:0,skipped:0};for(const test of cases)summary[test.status]++;
  const fixture=resolve('integration/output/report-pagination.html');
  await writeFile(fixture,renderReport({...run,id:'report-ui-fixture',name:'Report UI pagination fixture',tests:cases,summary},true));
  await page.goto(pathToFileURL(fixture).href);
  assert.equal(await page.locator('#rows tr').count(),10);
  await page.getByRole('button',{name:'Next page',exact:true}).click();assert.match(await page.locator('#showing').textContent(),/11–20 of 27/);
  await nav('Environment');await nav('Test explorer');assert.match(await page.locator('#showing').textContent(),/11–20 of 27/);
  await page.getByRole('button',{name:'Next page',exact:true}).click();assert.equal(await page.locator('#rows tr').count(),7);
  assert.equal(await page.getByRole('button',{name:'Next page',exact:true}).isDisabled(),true);
  await page.getByRole('combobox',{name:'Rows per page'}).selectOption('25');assert.equal(await page.locator('#rows tr').count(),25);
  await page.getByRole('button',{name:/^Failed\s+\d/}).click();assert.ok(await page.locator('#rows tr').count()>0);
  assert.equal(await page.locator('#rows tr .badge:not(.failed)').count(),0);
  await page.emulateMedia({reducedMotion:'reduce'});
  assert.equal(await page.locator('.nav button').first().evaluate(el=>getComputedStyle(el).transitionDuration),'0s');
  // An auto-sized iframe must not measure its height against its own viewport.
  await page.goto('about:blank');
  await page.setContent('<iframe id="embedded-report" title="Embedded report" style="width:1100px;height:500px;border:0"></iframe>');
  await page.locator('#embedded-report').evaluate((frame,html)=>frame.srcdoc=html,renderReport(run).replace('<body>','<body><div style="padding:20px">Embedding test header</div>'));
  const embedded=page.frameLocator('#embedded-report');
  await embedded.locator('#title').getByText(run.name,{exact:true}).waitFor();
  const heights=[];
  for(let i=0;i<5;i++){
    const height=await embedded.locator('body').evaluate(el=>el.scrollHeight);heights.push(height);
    await page.locator('#embedded-report').evaluate((frame,value)=>frame.style.height=value+'px',height);
    await page.evaluate(()=>new Promise(requestAnimationFrame));
  }
  assert.ok(Math.max(...heights)-Math.min(...heights)<=1,'Embedded report has a resize feedback loop: '+heights.join(', '));
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({navigation:'12 switches, no layout shift or row rebuild',layoutTolerancePx:1,embeddedAutoResizeHeights:heights,verified:['filters persist','search','pagination','healing audit','case navigation','actual results','reserved image space','image expansion','keyboard focus restoration','theme','320/390px mobile layouts','reduced motion','detailed entry point']},null,2));
}finally{await browser.close()}
