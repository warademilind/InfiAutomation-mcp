import { VERSION } from '../runtime.js';
import type { RunResult } from '../schema.js';
import { reportStyles } from './styles.js';
import { reportClient } from './client.js';

export function renderReport(run: RunResult, detailed = false): string {
  const data = JSON.stringify(run).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  return String.raw`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark light"><title>InfiAutomation · Test report</title>
<style>${reportStyles}</style></head><body>
<a class="skip-link" href="#results">Skip to test results</a>
<div class="shell">
  <aside class="sidebar" id="sidebar">
    <div class="brand"><div class="mark" aria-hidden="true">≋</div>InfiAutomation</div>
    <nav class="nav" aria-label="Report sections">
      <button data-view="overview"><span class="nav-icon" aria-hidden="true">◈</span>Overview</button>
      <button data-view="tests"><span class="nav-icon" aria-hidden="true">☷</span>Test explorer<span class="nav-count" id="nav-tests-count" aria-hidden="true"></span></button>
      <button data-view="healing"><span class="nav-icon" aria-hidden="true">↻</span>Healing audit<span class="nav-count" id="nav-healing-count" aria-hidden="true"></span></button>
      <button data-view="environment"><span class="nav-icon" aria-hidden="true">⌘</span>Environment</button>
      ${run.layers?'<button data-view="layers"><span class="nav-icon" aria-hidden="true">◷</span>Layers & timings</button>':''}
      ${run.policy?'<button data-view="policy"><span class="nav-icon" aria-hidden="true">✓</span>Execution policy</button>':''}
    </nav>
    <div class="sidebar-foot"><span class="live-dot"></span>Local evidence, portable report<br><span class="subtle">Report renderer · v${VERSION}</span></div>
  </aside>
  <main class="main" id="main">
    <header class="topbar">
      <div class="breadcrumbs"><span>Test runs</span><span aria-hidden="true">/</span><code id="run-id"></code><span aria-hidden="true">/</span><span id="current-view"></span></div>
      <div class="actions"><button class="btn" id="copy-run">Copy run ID</button><button class="btn" id="theme" aria-label="Toggle color theme" aria-pressed="false">◐</button><button class="btn" id="export">↓ JSON</button><button class="btn primary" id="print">Print view</button></div>
    </header>
    <div class="hero">
      <div><div class="eyebrow">Execution intelligence</div><h1 id="title"></h1><p id="subtitle"></p>${run.traceability?'<div class="hero-links"><a href="traceability.html">Requirement coverage and test mappings</a></div>':''}</div>
      <div class="run-status" id="run-status"></div>
    </div>
    <section class="metrics" aria-label="Run metrics" id="metrics"></section>
    <div class="view-stage" id="view-stage">
      <section id="overview" class="view-panel" aria-labelledby="overview-title" aria-hidden="true" inert>
        <div class="section-head"><div><h2 id="overview-title">Execution overview</h2><p class="subtle">Health, runtime context and cases worth reviewing.</p></div><button class="btn" data-view="tests">Explore tests →</button></div>
        <div class="grid">
          <article class="card"><div class="card-head"><h2>Execution health</h2><span class="subtle">Recorded outcomes</span></div><div class="health"><div class="donut"><svg viewBox="0 0 144 144" aria-hidden="true"><circle cx="72" cy="72" r="60" fill="none" stroke="var(--line)" stroke-width="9"/><g id="arcs"></g></svg><div class="donut-label"><strong id="rate"></strong><span>clean pass rate</span></div></div><div class="legend" id="legend"></div></div></article>
          <article class="card"><div class="card-head"><h2>Run context</h2><span class="subtle">Reproducibility</span></div><div class="meta" id="context"></div></article>
        </div>
        <div class="grid">
          <article class="card"><div class="card-head"><h2>Slowest tests</h2><span class="subtle">Select for evidence</span></div><div class="timings" id="timings"></div></article>
          <article class="card"><div class="card-head"><h2>Attention needed</h2><span class="subtle" id="attention-count"></span></div><div class="attention" id="attention"></div></article>
        </div>
      </section>
      <section id="results" class="view-panel" aria-labelledby="results-title" aria-hidden="true" inert>
        <div class="section-head"><div><h2 id="results-title">Test explorer</h2><p class="subtle" id="result-context">Explicit assertions · recorded evidence</p></div><span class="subtle">Select a test to inspect its steps and screenshots.</span></div>
        <div class="card">
          <div class="toolbar"><div class="filters" id="filters" role="group" aria-label="Filter by outcome"></div><div class="search-wrap"><input class="search" id="search" type="search" placeholder="Search tests, IDs, tags…" aria-label="Search tests"><button class="btn ghost" id="clear-search" aria-label="Clear search">×</button><select id="sort" aria-label="Sort tests"><option value="original">Execution order</option><option value="slow">Slowest first</option><option value="name">Name A–Z</option></select></div></div>
          <div class="table-wrap"><table><thead><tr><th scope="col">Test case</th><th scope="col">Outcome</th><th scope="col">Steps</th><th scope="col">Duration</th><th scope="col" aria-label="Open details"></th></tr></thead><tbody id="rows"></tbody></table><div id="empty" class="empty hidden"><h3>No matching cases</h3><p>Try another search or clear the outcome filter.</p><button class="btn" data-reset-tests>Reset filters</button></div></div>
          <div class="table-foot"><span id="showing" aria-live="polite"></span><div class="pagination"><label>Rows <select id="page-size" aria-label="Rows per page"><option value="10">10</option><option value="25">25</option><option value="50">50</option></select></label><button class="btn" id="previous-page" aria-label="Previous page">←</button><span class="page-label" id="page-label"></span><button class="btn" id="next-page" aria-label="Next page">→</button></div></div>
        </div>
      </section>
      <section id="healing" class="view-panel" aria-labelledby="healing-title" aria-hidden="true" inert>
        <div class="section-head"><div><h2 id="healing-title">Healing audit</h2><p class="subtle">Review locator changes while preserving the original assertions.</p></div><span class="subtle" id="repair-summary"></span></div>
        <div id="audit-list" class="audit-list"></div>
        <div id="audit-empty" class="card audit-empty"><span class="success-mark" aria-hidden="true">↻</span><h3>No locator repairs recorded</h3><p>This run contains no healing records. Case outcomes and expected values remain exactly as recorded by the runner.</p><button class="btn" data-view="tests">Inspect test evidence →</button></div>
        <div id="audit-pages" class="audit-pages hidden"><button class="btn" id="audit-previous" aria-label="Previous repairs">← Previous</button><span class="subtle" id="audit-page-label"></span><button class="btn" id="audit-next" aria-label="Next repairs">Next →</button></div>
      </section>
      <section id="environment" class="view-panel" aria-labelledby="environment-title" aria-hidden="true" inert>
        <div class="section-head"><div><h2 id="environment-title">Environment & provenance</h2><p class="subtle">The runtime and source data behind this execution.</p></div></div>
        <div class="environment-grid">
          <article class="card"><div class="card-head"><h2>Recorded environment</h2></div><div class="environment"><dl id="environment-values"></dl><details><summary>View raw environment JSON</summary><pre id="env-json"></pre></details></div></article>
          <article class="card"><div class="card-head"><h2>Evidence and interpretation</h2></div><div class="environment"><p>Results reflect actual runner outcomes. Healed cases remain separately classified; setup and teardown failures fail the case.</p><p>Screenshots and trace files are relative to this report folder. Keep them together when sharing the offline report.</p><p>Native screenshots need a visible, unlocked desktop. Open web/Electron trace ZIPs with Playwright Trace Viewer.</p><p>Requirement mapping describes the linked cases. Review acceptance criteria and untested business rules before claiming product acceptance.</p></div></article>
        </div>
      </section>
      ${run.layers?'<section id="layers" class="view-panel" aria-labelledby="layers-title" aria-hidden="true" inert><div class="section-head"><div><h2 id="layers-title">Layers & timings</h2><p class="subtle">Measured requests, queries and UI checks across the same journey.</p></div></div><div class="card"><div class="card-head"><h2>Execution by layer</h2></div><div class="table-wrap"><table><thead><tr><th>Layer</th><th>Steps</th><th>Passed</th><th>Failed / skipped</th><th>Total step time</th></tr></thead><tbody id="layer-rows"></tbody></table></div></div><div class="card"><div class="card-head"><h2>Timing evidence</h2></div><p class="subtle" style="padding:0 24px">API request time includes receipt of the body. Query time excludes connection setup. UI action time excludes screenshot capture. Values come from this run; they are not load-test percentiles.</p><div class="table-wrap" style="max-height:560px;overflow:auto"><table><thead><tr><th>Case / step</th><th>Layer / target</th><th>Measurement</th><th>Duration</th><th>Evidence</th></tr></thead><tbody id="timing-rows"></tbody></table></div></div></section>':''}
      ${run.policy?'<section id="policy" class="view-panel" aria-labelledby="policy-title" aria-hidden="true" inert><div class="section-head"><div><h2 id="policy-title">Execution policy</h2><p class="subtle">Effective restrictions after combining the plan and suite.</p></div></div><div class="card"><div class="environment"><h3>Do / don\'t rules and enforced restrictions</h3><pre id="policy-json" style="max-height:440px;overflow:auto"></pre><p>Methods, target/action denials, approved origins and screenshot permission are structured restrictions. Database checks expose reads only. Text notes describe user intent and require matching assertions or review; arbitrary prose cannot be enforced automatically.</p><p>API/database JSON evidence is redacted by known secrets and key names. Screenshots can still contain application data; disable capture when required and review artifacts before sharing.</p></div></div></section>':''}
    </div>
    <footer class="footer"><span>InfiAutomation · One testing workflow, across your applications.</span><span id="generated"></span></footer>
    <div class="toast" id="toast" role="status" aria-live="polite"></div>
  </main>
</div>
<div id="overlay" class="overlay hidden"></div>
<section id="drawer" class="drawer hidden" role="dialog" aria-modal="true" aria-labelledby="detail-title" tabindex="-1"></section>
<script id="run-data" type="application/json">${data}</script>
<script>${reportClient(detailed)}</script>
</body></html>`;
}
