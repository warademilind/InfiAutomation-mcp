// Embedded verbatim: generated reports need no server, build assets or network access.
export function reportClient(detailed: boolean): string {
  return String.raw`
(() => {
  try{if(window.self!==window.top)document.body.classList.add('embedded')}catch{document.body.classList.add('embedded')}
  const run=JSON.parse(document.getElementById('run-data').textContent);
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const duration=ms=>ms<1000?Math.round(ms)+' ms':ms<60000?(ms/1000).toFixed(1)+' s':(ms/60000).toFixed(1)+' min';
  const badge=status=>'<span class="badge '+esc(status)+'">'+({passed:'✓',failed:'×',healed:'↻',skipped:'−'}[status]||'')+' '+esc(status)+'</span>';
  const artifact=p=>typeof p==='string'&&/^[a-zA-Z0-9_.\/-]+$/.test(p)&&!p.includes('..')&&!p.startsWith('/')?p:null;
  const names={overview:'Overview',tests:'Test explorer',healing:'Healing audit',environment:'Environment',layers:'Layers & timings',policy:'Execution policy'};
  const panels={overview:$('overview'),tests:$('results'),healing:$('healing'),environment:$('environment'),...(run.layers?{layers:$('layers')} : {}),...(run.policy?{policy:$('policy')} : {})};
  const s=run.summary,total=s.total||1,rate=Math.round(s.passed/total*100);
  const maxDuration=Math.max(1,...run.tests.map(t=>t.durationMs));
  const repairs=run.tests.flatMap(t=>t.steps.flatMap((step,index)=>step.healing?[{test:t,step,index}]:[]));
  const rowCache=new Map();
  let view='',filter='all',page=0,pageSize=10,auditPage=0,filtered=run.tests,renderedRows='',opener,previousOverflow='',toastTimer;

  $('title').textContent=run.name;
  $('run-id').textContent=run.id.slice(-12);
  $('subtitle').textContent=new Date(run.startedAt).toLocaleString()+' · '+run.target+' · '+s.total+' test cases';
  $('run-status').innerHTML=badge(run.status);
  $('nav-tests-count').textContent=s.total;
  $('nav-healing-count').textContent=repairs.length;
  $('metrics').innerHTML=[['Total test cases',s.total,'Recorded in this execution',''],['Clean passes',s.passed,rate+'% passed without repairs','green'],['Failures',s.failed,s.healed+' healed · '+s.skipped+' skipped','red'],['Execution time',duration(run.durationMs),'End-to-end recorded duration','accent']].map(([label,n,note,c])=>'<article class="metric"><div class="head">'+label+'</div><div class="number '+c+'">'+n+'</div><div class="note">'+note+'</div></article>').join('');
  $('rate').textContent=rate+'%';
  let offset=0;const circumference=2*Math.PI*60;
  $('arcs').innerHTML=[['passed','var(--green)'],['failed','var(--red)'],['healed','var(--accent)'],['skipped','var(--muted)']].map(([key,color])=>{const length=s[key]/total*circumference;const arc='<circle cx="72" cy="72" r="60" fill="none" stroke="'+color+'" stroke-width="9" stroke-dasharray="'+length+' '+(circumference-length)+'" stroke-dashoffset="'+(-offset)+'"/>';offset+=length;return arc}).join('');
  $('legend').innerHTML=[['passed','green'],['failed','red'],['healed','accent'],['skipped','']].map(([key,color])=>'<div class="legend-row"><span class="legend-label"><span class="dot '+color+'"></span>'+key[0].toUpperCase()+key.slice(1)+'</span><strong>'+s[key]+'</strong></div>').join('');
  $('context').innerHTML=[['Engine',run.target],['Platform',run.environment.platform],['Playwright',run.environment.playwright],['Node.js',run.environment.node],['Started',new Date(run.startedAt).toLocaleTimeString()]].map(([key,value])=>'<div class="meta-row"><span>'+key+'</span><strong>'+esc(value)+'</strong></div>').join('');
  $('timings').innerHTML=[...run.tests].sort((a,b)=>b.durationMs-a.durationMs).slice(0,5).map(test=>'<div class="timing-row"><button data-case="'+esc(test.id)+'">'+esc(test.name)+'</button><span>'+duration(test.durationMs)+'</span><div class="bar-track"><div class="bar-fill" style="width:'+Math.min(100,test.durationMs/maxDuration*100)+'%"></div></div></div>').join('')||'<p class="subtle">No cases recorded.</p>';
  const attention=run.tests.filter(t=>t.status!=='passed');
  $('attention-count').textContent=attention.length?attention.length+' to review':'No exceptions';
  $('attention').innerHTML=attention.length?attention.slice(0,4).map(test=>'<div class="attention-row"><button class="case-title" data-case="'+esc(test.id)+'">'+esc(test.name)+'</button>'+badge(test.status)+'</div>').join('')+'<button class="btn" data-review-issues>Review in test explorer →</button>':'<div class="attention-success"><span class="success-mark" aria-hidden="true">✓</span><h3>No failed, healed or skipped cases</h3><p>Explore the case evidence and requirement mappings to review what was actually checked.</p></div><button class="btn" data-view="tests">Browse all test cases →</button>';
  const provenance={runId:run.id,startedAt:run.startedAt,target:run.target,durationMs:run.durationMs,...run.environment,...(run.traceability?{traceability:run.traceability}:{})};
  $('env-json').textContent=JSON.stringify(provenance,null,2);
  $('environment-values').innerHTML=[['Run ID',run.id],['Started (UTC)',run.startedAt],['Target',run.target],['Platform',run.environment.platform],['Node.js',run.environment.node],['Playwright',run.environment.playwright],['Recorded duration',duration(run.durationMs)]].map(([key,value])=>'<dt>'+key+'</dt><dd><code>'+esc(value)+'</code></dd>').join('');
  $('generated').textContent='Recorded '+new Date(run.startedAt).toLocaleDateString();
  $('repair-summary').textContent=repairs.filter(r=>r.step.healing.applied).length+' applied · '+repairs.filter(r=>!r.step.healing.applied).length+' proposed';
  $('filters').innerHTML=['all','passed','failed','healed','skipped'].map(key=>'<button class="filter" data-filter="'+key+'" aria-pressed="false">'+key[0].toUpperCase()+key.slice(1)+' <span>'+ (key==='all'?s.total:s[key])+'</span></button>').join('');

  if(run.layers){
    const select=document.createElement('select');select.id='layer-filter';select.setAttribute('aria-label','Filter by layer');select.innerHTML='<option value="all">All layers</option>'+run.layers.map(l=>'<option value="'+esc(l.layer)+'">'+esc(l.layer)+'</option>').join('');$('sort').before(select);select.onchange=()=>{page=0;renderTests()};
    $('layer-rows').innerHTML=run.layers.map(l=>'<tr><td><strong>'+esc(l.layer)+'</strong></td><td>'+l.steps+'</td><td>'+l.passed+'</td><td>'+l.failed+' / '+l.skipped+'</td><td>'+duration(l.durationMs)+'</td></tr>').join('');
    $('timing-rows').innerHTML=run.tests.flatMap(t=>t.steps.flatMap(step=>Object.entries(step.timings||{}).map(([name,value])=>'<tr><td><button class="case-title" data-case="'+esc(t.id)+'">'+esc(t.id)+'</button><div class="subtle">'+esc(step.name)+'</div></td><td>'+esc(step.layer)+' / '+esc(step.target)+'</td><td>'+esc(name)+'</td><td>'+duration(value)+'</td><td>'+(artifact(step.evidence)?'<a href="'+artifact(step.evidence)+'" target="_blank" rel="noopener">JSON evidence</a>':'—')+'</td></tr>'))).join('')||'<tr><td colspan="5">No timing measurements recorded.</td></tr>';
  }
  if(run.policy)$('policy-json').textContent=JSON.stringify(run.policy,null,2);

  // Navigation only selects existing panels. It never reconstructs rows or filters.
  function switchView(next){
    if(!panels[next]||next===view)return;
    view=next;
    document.querySelectorAll('.nav [data-view]').forEach(button=>{
      const active=button.dataset.view===next;button.classList.toggle('active',active);
      if(active)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');
    });
    for(const [name,panel] of Object.entries(panels)){
      const active=name===next;panel.classList.toggle('is-active',active);panel.setAttribute('aria-hidden',String(!active));panel.inert=!active;
    }
    $('current-view').textContent=names[next];
  }
  function renderTests(){
    const query=$('search').value.trim().toLowerCase();
    filtered=run.tests.filter(t=>(!$('layer-filter')||$('layer-filter').value==='all'||t.steps.some(step=>step.layer===$('layer-filter').value))&&(filter==='all'||(filter==='issues'?t.status!=='passed':t.status===filter))&&[t.name,t.id,...t.tags,...(t.requirements||[])].join(' ').toLowerCase().includes(query));
    if($('sort').value==='slow')filtered.sort((a,b)=>b.durationMs-a.durationMs);
    if($('sort').value==='name')filtered.sort((a,b)=>a.name.localeCompare(b.name));
    const pages=Math.max(1,Math.ceil(filtered.length/pageSize));page=Math.max(0,Math.min(page,pages-1));
    const visible=filtered.slice(page*pageSize,(page+1)*pageSize),key=JSON.stringify(visible.map(t=>t.id));
    if(key!==renderedRows){
      const fragment=document.createDocumentFragment();
      for(const test of visible){
        let row=rowCache.get(test.id);
        if(!row){
          row=document.createElement('tr');
          row.dataset.testId=test.id;
          row.innerHTML='<td><button class="case-title" data-case="'+esc(test.id)+'">'+esc(test.name)+'</button><div class="case-id">'+esc(test.id)+test.tags.slice(0,2).map(tag=>'<span class="tag">'+esc(tag)+'</span>').join('')+(test.tags.length>2?'<span class="tag">+'+(test.tags.length-2)+'</span>':'')+'</div></td><td>'+badge(test.status)+'</td><td>'+test.steps.filter(step=>step.status==='passed'||step.status==='healed').length+' / '+test.steps.length+'</td><td><div class="duration"><span>'+duration(test.durationMs)+'</span><div class="bar-track"><div class="bar-fill" style="width:'+Math.min(100,test.durationMs/maxDuration*100)+'%"></div></div></div></td><td><button class="btn ghost" data-case="'+esc(test.id)+'" aria-label="Inspect '+esc(test.name)+'">↗</button></td>';
          rowCache.set(test.id,row);
        }
        fragment.appendChild(row);
      }
      $('rows').replaceChildren(fragment);renderedRows=key;
    }
    document.querySelectorAll('[data-filter]').forEach(button=>{const active=button.dataset.filter===filter;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active))});
    $('showing').textContent=filtered.length?'Showing '+(page*pageSize+1)+'–'+Math.min((page+1)*pageSize,filtered.length)+' of '+filtered.length+' matching cases':'No matching cases';
    $('empty').classList.toggle('hidden',filtered.length>0);
    $('page-label').textContent='Page '+(page+1)+' / '+pages;
    $('previous-page').disabled=page===0;$('next-page').disabled=page===pages-1;
    $('clear-search').disabled=!query;
    $('result-context').textContent=filter==='issues'?'Showing failed, healed and skipped outcomes.':'Explicit assertions · recorded evidence';
  }
  function renderAudit(){
    const pages=Math.max(1,Math.ceil(repairs.length/5));auditPage=Math.max(0,Math.min(auditPage,pages-1));
    $('audit-list').innerHTML=repairs.slice(auditPage*5,(auditPage+1)*5).map(({test,step,index})=>{
      const h=step.healing;
      return '<article class="audit-card"><header><div><button class="case-title" data-case="'+esc(test.id)+'">'+esc(test.name)+'</button><div class="case-id">'+esc(test.id)+' · Step '+(index+1)+' · '+esc(step.name)+'</div></div><span class="badge healed">'+(h.applied?'Repair applied':'Proposal only')+'</span></header><p class="subtle">'+esc(h.reason)+' · Identity confidence '+Math.round(h.confidence*100)+'%</p><details><summary>Compare original and proposed locators</summary><div class="repair-columns"><div><h3>Original</h3><pre>'+esc(JSON.stringify(h.original,null,2))+'</pre></div><div><h3>Proposed</h3><pre>'+esc(JSON.stringify(h.proposed,null,2))+'</pre></div></div></details></article>';
    }).join('');
    $('audit-empty').classList.toggle('hidden',repairs.length>0);
    $('audit-pages').classList.toggle('hidden',repairs.length<=5);
    $('audit-page-label').textContent='Page '+(auditPage+1)+' / '+pages;
    $('audit-previous').disabled=auditPage===0;$('audit-next').disabled=auditPage===pages-1;
  }
  function notify(text){clearTimeout(toastTimer);$('toast').textContent=text;toastTimer=setTimeout(()=>$('toast').textContent='',4000)}
  async function copy(text,label){
    try{
      if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(text);
      else{
        const input=document.createElement('textarea');input.value=text;input.style.position='fixed';input.style.opacity='0';document.body.appendChild(input);input.select();
        let copied=false;try{copied=document.execCommand('copy')}finally{input.remove()}
        if(!copied)throw new Error('Copy unavailable');
      }
      notify(label+' copied');
    }catch{notify('Copy is unavailable here. Open Environment to select the run ID.')}
  }
  function close(){
    if($('drawer').classList.contains('hidden'))return;
    $('drawer').classList.add('hidden');$('overlay').classList.add('hidden');$('main').inert=false;$('sidebar').inert=false;
    document.body.style.overflow=previousOverflow;
    if(opener?.isConnected)opener.focus();
  }
  function detail(id){
    const test=run.tests.find(t=>t.id===id);if(!test)return;
    const opening=$('drawer').classList.contains('hidden');
    if(opening){opener=document.activeElement;previousOverflow=document.body.style.overflow}
    const list=view==='tests'&&filtered.some(t=>t.id===id)?filtered:run.tests;
    const index=list.findIndex(t=>t.id===id),failed=test.steps.filter(step=>step.status==='failed').length;
    $('drawer').innerHTML='<header class="drawer-head"><div class="drawer-top"><span class="eyebrow">'+esc(test.id)+'</span><div class="drawer-actions"><button class="btn" data-copy-case="'+esc(test.id)+'">Copy case link</button><button class="btn" id="close" aria-label="Close test details">✕</button></div></div><h3 id="detail-title">'+esc(test.name)+'</h3>'+badge(test.status)+' <span class="subtle"> &nbsp; '+duration(test.durationMs)+' · '+test.steps.length+' steps · '+test.steps.filter(step=>artifact(step.screenshot)).length+' screenshots</span><div class="drawer-toolbar"><span class="subtle">Test '+(index+1)+' of '+list.length+'</span><div class="drawer-actions"><button class="btn" data-case="'+esc(list[Math.max(0,index-1)].id)+'" '+(index===0?'disabled':'')+' aria-label="Previous test">← Previous</button><button class="btn" data-case="'+esc(list[Math.min(list.length-1,index+1)].id)+'" '+(index===list.length-1?'disabled':'')+' aria-label="Next test">Next →</button></div></div></header><div class="drawer-body"><div class="case-context">'+(test.requirements?.length?'<p class="subtle">Requirements: '+test.requirements.map(esc).join(', ')+'</p>':'')+(test.tags.length?'<p class="subtle">Tags: '+test.tags.map(esc).join(', ')+'</p>':'')+(test.error?'<pre class="error">'+esc(test.error)+'</pre>':'')+(artifact(test.trace)?'<p><a class="btn" href="'+artifact(test.trace)+'" download>↓ Playwright trace</a></p>':'')+'</div><div class="detail-controls"><button class="btn" id="actual-toggle" aria-pressed="false">Expand actual results</button><button class="btn" id="failed-toggle" aria-pressed="false" '+(!failed?'disabled':'')+'>Failed steps ('+failed+')</button></div>'+test.steps.map((step,i)=>'<article class="step '+esc(step.status)+'" data-step-status="'+esc(step.status)+'"><div class="step-title"><span>'+String(i+1).padStart(2,'0')+' &nbsp; '+esc(step.name)+'</span>'+badge(step.status)+'</div><div class="step-meta">'+esc(step.action)+' · '+esc(step.layer||run.target)+(step.target?' / '+esc(step.target):'')+' · '+duration(step.durationMs)+'</div>'+(step.error?'<pre class="error">'+esc(step.error)+'</pre>':'')+(step.healing?'<div class="healing-note">↻ Locator repair '+(step.healing.applied?'applied':'proposed')+' · assertions preserved<pre>'+esc(JSON.stringify(step.healing,null,2))+'</pre></div>':'')+(step.timings?'<div class="step-meta">'+Object.entries(step.timings).map(([key,value])=>esc(key)+': '+duration(value)).join(' · ')+'</div>':'')+(artifact(step.evidence)?'<p><a href="'+artifact(step.evidence)+'" target="_blank" rel="noopener">Open JSON evidence</a></p>':'')+(step.attachments?.length?'<p>'+step.attachments.filter(a=>artifact(a.path)).map(a=>'<a href="'+artifact(a.path)+'" target="_blank" rel="noopener">'+esc(a.label)+'</a>').join(' · ')+'</p>':'')+(step.actual!==undefined?'<details class="actual-result"><summary>Actual result</summary><pre>'+esc(JSON.stringify(step.actual,null,2))+'</pre></details>':'')+(artifact(step.screenshot)?'<div class="evidence-block"><a class="evidence-frame" href="'+artifact(step.screenshot)+'" target="_blank" rel="noopener"><img class="evidence" loading="lazy" alt="Screenshot after '+esc(step.name)+'" src="'+artifact(step.screenshot)+'"></a><div class="evidence-caption"><span>Recorded step screenshot</span><button class="btn" data-expand-image aria-expanded="false">Expand image</button></div></div>':'')+'</article>').join('')+'</div>';
    $('drawer').classList.remove('hidden');$('overlay').classList.remove('hidden');$('main').inert=true;$('sidebar').inert=true;document.body.style.overflow='hidden';
    $('drawer').scrollTop=0;$('close').onclick=close;$('close').focus({preventScroll:true});
    $('actual-toggle').onclick=event=>{const expanded=event.currentTarget.getAttribute('aria-pressed')!=='true';$('drawer').querySelectorAll('.actual-result').forEach(el=>el.open=expanded);event.currentTarget.setAttribute('aria-pressed',String(expanded));event.currentTarget.textContent=expanded?'Collapse actual results':'Expand actual results'};
    $('failed-toggle').onclick=event=>{const only=event.currentTarget.getAttribute('aria-pressed')!=='true';event.currentTarget.setAttribute('aria-pressed',String(only));$('drawer').querySelectorAll('.step').forEach(el=>el.classList.toggle('hidden',only&&el.dataset.stepStatus!=='failed'))};
  }
  document.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button||button.disabled)return;
    if(button.dataset.view)switchView(button.dataset.view);
    if(button.dataset.filter){filter=button.dataset.filter;page=0;renderTests()}
    if(button.dataset.case)detail(button.dataset.case);
    if(button.hasAttribute('data-review-issues')){filter='issues';page=0;$('search').value='';renderTests();switchView('tests')}
    if(button.hasAttribute('data-reset-tests')){filter='all';page=0;$('search').value='';renderTests();$('search').focus()}
    if(button.hasAttribute('data-expand-image')){const block=button.closest('.evidence-block'),expanded=block.classList.toggle('expanded');button.setAttribute('aria-expanded',String(expanded));button.textContent=expanded?'Fit image':'Expand image'}
    if(button.dataset.copyCase){const href=typeof location.href==='string'?location.href.split('#')[0]+'#'+encodeURIComponent(button.dataset.copyCase):'detailed.html#'+encodeURIComponent(button.dataset.copyCase);void copy(href,'Case link')}
  });
  document.addEventListener('keydown',event=>{
    if($('drawer').classList.contains('hidden'))return;
    if(event.key==='Escape'){event.preventDefault();close()}
    if(event.key==='Tab'){
      const focusable=[...$('drawer').querySelectorAll('button:not(:disabled),a[href],summary')].filter(el=>el.getClientRects().length&&!el.closest('.hidden'));
      if(event.shiftKey&&document.activeElement===focusable[0]){event.preventDefault();focusable.at(-1)?.focus()}
      else if(!event.shiftKey&&document.activeElement===focusable.at(-1)){event.preventDefault();focusable[0]?.focus()}
    }
  });
  $('search').oninput=()=>{page=0;renderTests()};$('sort').onchange=()=>{page=0;renderTests()};
  $('clear-search').onclick=()=>{$('search').value='';page=0;renderTests();$('search').focus()};
  $('page-size').onchange=()=>{pageSize=Number($('page-size').value);page=0;renderTests()};
  $('previous-page').onclick=()=>{page--;renderTests()};$('next-page').onclick=()=>{page++;renderTests()};
  $('audit-previous').onclick=()=>{auditPage--;renderAudit()};$('audit-next').onclick=()=>{auditPage++;renderAudit()};
  $('overlay').onclick=close;$('copy-run').onclick=()=>void copy(run.id,'Run ID');
  try{if(localStorage.getItem('infiautomation-report-theme')==='light')document.body.classList.add('light')}catch{}
  $('theme').setAttribute('aria-pressed',String(document.body.classList.contains('light')));
  $('theme').onclick=()=>{const light=document.body.classList.toggle('light');$('theme').setAttribute('aria-pressed',String(light));try{localStorage.setItem('infiautomation-report-theme',light?'light':'dark')}catch{}};
  $('print').onclick=()=>window.print();
  $('export').onclick=()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(run,null,2)],{type:'application/json'})),link=document.createElement('a');link.href=url;link.download='infiautomation-'+run.id+'.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
  renderTests();renderAudit();switchView(${JSON.stringify(detailed ? 'tests' : 'overview')});
  if(location.hash&&run.tests.some(test=>test.id===location.hash.slice(1)))detail(location.hash.slice(1));
})();
`;
}
