import { chromium, firefox, webkit, _electron, type Browser, type BrowserContext, type ElectronApplication, type Locator, type Page } from 'playwright';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import type { Selector, Snapshot, Step, Target } from '../schema.js';
import type { Driver } from './types.js';

export class LocatorError extends Error { readonly code = 'LOCATOR_NOT_FOUND'; }
export class WebDriver implements Driver {
  readonly kind: Target['kind'];
  browser?: Browser; context!: BrowserContext; page!: Page; electron?: ElectronApplication;
  private tracing = false;
  private windowIds = new WeakMap<Page, string>();
  private windowSerial = 0;
  executionPolicy?: {allowedOrigins:string[];allowedMethods:string[]};
  constructor(readonly target: Target) { this.kind = target.kind; }
  async start(): Promise<void> {
    if (this.target.cdpUrl && this.executionPolicy) throw new Error('Version 2 requires an isolated browser/Electron session; attached CDP cannot guarantee policy isolation. Launch an owned Electron target or use a version 1 attachment suite.');
    if (this.target.cdpUrl) {
      // Preserve the app's settings and avoid unsupported context-management defaults on older Electron.
      this.browser = await chromium.connectOverCDP(this.target.cdpUrl, { timeout: this.target.timeoutMs, noDefaults: true });
      this.context = this.browser.contexts()[0];
      if (!this.context) throw new Error('CDP endpoint has no browser context');
      this.page = await this.waitForWindow(this.target.windowTitle, this.target.windowUrlContains);
    } else if (this.kind === 'electron') {
      const env = Object.fromEntries(Object.entries(process.env).filter(([key, value]) => key !== 'ELECTRON_RUN_AS_NODE' && value !== undefined)) as Record<string, string>;
      try {
        this.electron = await _electron.launch({ env, executablePath: this.target.executable, args: this.target.args, cwd: this.target.cwd, timeout: this.target.timeoutMs });
      } catch (error) {
        throw new Error('Electron launch failed. Check the executable, app arguments, interactive display and nodeCliInspect fuse. Try an app-authorized CDP endpoint, or explicit Windows UIA for accessible controls. No fuses are modified. Cause: ' + (error instanceof Error ? error.message : String(error)));
      }
      this.context = this.electron.context();
      this.page = await this.waitForWindow(this.target.windowTitle, this.target.windowUrlContains);
    } else {
      const engine = { chromium, firefox, webkit }[this.target.browser];
      this.browser = await engine.launch({ headless: this.target.headless, ...(this.target.channel ? { channel: this.target.channel } : {}) });
      this.context = await this.browser.newContext({ viewport: { width: 1440, height: 1000 }, ...(this.executionPolicy?{serviceWorkers:'block' as const}:{}) });
      this.page = await this.context.newPage();
    }
    this.setPage(this.page);
    if(this.executionPolicy){
      const policy=this.executionPolicy,origins=policy.allowedOrigins.map(value=>new URL(value).origin);
      await this.context.route('**/*',async route=>{const request=route.request(),url=new URL(request.url());if(['http:','https:'].includes(url.protocol)&&((origins.length>0&&!origins.includes(url.origin))||!policy.allowedMethods.includes(request.method())))await route.abort('blockedbyclient');else await route.continue();});
    }
    if(this.executionPolicy){
      const installMetrics=()=>{if((window as any).__infiMetrics)return;const metrics={largestContentfulPaintMs:0,cumulativeLayoutShift:0};(window as any).__infiMetrics=metrics;try{new PerformanceObserver(list=>{for(const entry of list.getEntries())metrics.largestContentfulPaintMs=entry.startTime;}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(list=>{for(const entry of list.getEntries())if(!(entry as any).hadRecentInput)metrics.cumulativeLayoutShift+=(entry as any).value;}).observe({type:'layout-shift',buffered:true});}catch{}};
      await this.context.addInitScript(installMetrics);await this.page.evaluate(installMetrics);
    }
    if (this.target.url) await this.page.goto(this.url(this.target.url), { waitUntil: 'domcontentloaded', timeout: this.target.timeoutMs });
  }
  private pages(): Page[] {
    return (this.browser ? this.browser.contexts().flatMap(context => context.pages()) : this.context?.pages() || []).filter(page => !page.isClosed());
  }
  private windowId(page: Page): string {
    let id = this.windowIds.get(page);
    if (!id) { id = 'window-' + (++this.windowSerial); this.windowIds.set(page, id); }
    return id;
  }
  private async waitForWindow(title?: string, urlPart?: string, timeout = this.target.timeoutMs): Promise<Page> {
    const deadline = Date.now() + timeout;
    do {
      const matches: Page[] = [];
      for (const page of this.pages()) {
        try { if ((!title || (await page.title()).includes(title)) && (!urlPart || page.url().includes(urlPart))) matches.push(page); }
        catch { /* A splash window may close while its title is read. */ }
      }
      if (matches.length > 1) throw new Error('Window selector is ambiguous: matched ' + matches.length + ' renderer windows. Set windowTitle and/or windowUrlContains; use ui_windows to inspect an existing session.');
      if (matches.length === 1) return matches[0];
      await new Promise(resolve => setTimeout(resolve, 100));
    } while (Date.now() < deadline);
    throw new Error('No matching renderer window within ' + timeout + 'ms. Check windowTitle/windowUrlContains, finish login or startup, and verify the CDP endpoint belongs to the intended app. No new tab was created.');
  }
  private setPage(page: Page) { this.page = page; this.context = page.context(); this.page.setDefaultTimeout(this.target.timeoutMs); }
  async windows() {
    const windows = [];
    for (const page of this.pages()) {
      try { windows.push({ windowId: this.windowId(page), title: await page.title(), url: page.url(), selected: page === this.page }); }
      catch { /* Ignore windows closed during enumeration. */ }
    }
    return { windows };
  }
  async selectWindow(windowId: string) {
    const page = this.pages().find(page => this.windowId(page) === windowId);
    if (!page) throw new Error('Window ID is unknown or closed. Refresh ui_windows; IDs belong to this session only.');
    this.setPage(page);
    return { windowId, title: await page.title(), url: page.url() };
  }
  async info() {
    const runtime: Record<string, string> = { playwright: createRequire(import.meta.url)('playwright/package.json').version };
    const notes: string[] = [];
    if (this.electron) {
      Object.assign(runtime, await this.electron.evaluate(() => ({ electron: process.versions.electron!, chromium: process.versions.chrome!, node: process.versions.node })));
      notes.push('Playwright Electron launch support is experimental. The app supplies its embedded Chromium; installed Chrome is not used.');
    } else {
      runtime.browser = this.browser!.version();
      const userAgent = await this.page.evaluate(() => navigator.userAgent);
      const chrome = /(?:Chrome|Chromium)\/([\d.]+)/.exec(userAgent), electron = /Electron\/([\d.]+)/.exec(userAgent);
      if (chrome) runtime.chromium = chrome[1];
      if (electron) runtime.electron = electron[1];
      if (this.target.cdpUrl) notes.push('CDP exposes renderer DOM only. Runtime versions inferred from the user agent may be absent or customized. Native Electron Menu/main-process access is unavailable. Closing this session detaches; it does not close the app.');
    }
    return { kind: this.kind, transport: this.target.cdpUrl ? 'cdp' : this.electron ? 'electron-launch' : 'browser-launch', ownership: this.target.cdpUrl ? 'attached' : 'owned', runtime,
      capabilities: { rendererDom: true, screenshots: true, windowSelection: true, nativeElectronMenus: !!this.electron, mainProcess: !!this.electron, osDialogs: false, version2Execution: !this.target.cdpUrl },
      selectedWindowId: this.windowId(this.page), notes };
  }
  private url(value: string) { return /^[a-z][a-z0-9+.-]*:/i.test(value) ? value : pathToFileURL(resolve(this.target.cwd || process.env.INFIAUTOMATION_WORKSPACE || process.cwd(), value)).href; }
  locator(s: Selector): Locator {
    const root = s.frame ? this.page.frameLocator(s.frame) : this.page;
    if (s.css) return root.locator(s.css);
    if (s.testId) return root.getByTestId(s.testId);
    if (s.role) return root.getByRole(s.role as Parameters<Page['getByRole']>[0], s.name === undefined ? {} : { name: s.name, exact: true });
    if (s.label) return root.getByLabel(s.label, { exact: true });
    if (s.text) return root.getByText(s.text, { exact: true });
    throw new Error('Web/Electron locator needs css, testId, role, label or text');
  }
  private async element(s: Selector, timeout: number): Promise<Locator> {
    const loc = this.locator(s);
    try { await loc.waitFor({ state: 'attached', timeout }); }
    catch (error) {
      if (await loc.count() === 0) throw new LocatorError('Locator matched no element: ' + JSON.stringify(s));
      throw error;
    }
    const count = await loc.count();
    if (count !== 1) throw new Error('Ambiguous locator matched ' + count + ' elements: ' + JSON.stringify(s));
    return loc;
  }
  async snapshot(depth = 8, maxNodes = 500): Promise<Snapshot> {
    const result = await this.page.evaluate(({ depth, maxNodes }) => {
      const nodes: import('../schema.js').UiNode[] = [];
      let truncated = false;
      function walk(el: Element, d: number) {
        if (nodes.length >= maxNodes) { truncated = true; return; }
        const html = el as HTMLElement;
        const tag = el.tagName.toLowerCase();
        const roles: Record<string, string> = { button: 'button', a: 'link', input: 'textbox', textarea: 'textbox', select: 'combobox', option: 'option', h1: 'heading', h2: 'heading', h3: 'heading', nav: 'navigation', main: 'main' };
        let role: string | undefined = el.getAttribute('role') || roles[tag];
        if (tag === 'input') {
          const type = (el as HTMLInputElement).type;
          role = ['checkbox', 'radio', 'range'].includes(type) ? ({ range: 'slider', checkbox: 'checkbox', radio: 'radio' }[type]) : ['submit','button'].includes(type) ? 'button' : role;
        }
        const visible = !!(html.getClientRects().length) && getComputedStyle(html).visibility !== 'hidden';
        const labelled = el.getAttribute('aria-labelledby')?.split(/\s+/).map(id => document.getElementById(id)?.textContent || '').join(' ').trim();
        const labels = (el as HTMLInputElement).labels;
        const name = el.getAttribute('aria-label') || labelled || (labels ? Array.from(labels).map(l => l.textContent || '').join(' ').trim() : '') || el.getAttribute('alt') || (['input','textarea','select'].includes(tag) ? el.getAttribute('placeholder') || '' : (html.innerText || '').trim().slice(0, 180));
        if (role || el.hasAttribute('data-testid')) nodes.push({ name, role, testId: el.getAttribute('data-testid') || undefined, text: (html.innerText || '').trim().slice(0, 300), visible, enabled: !(el as HTMLInputElement).disabled, depth: d });
        if (d >= depth) { if (el.children.length) truncated = true; return; }
        for (const child of el.children) walk(child, d + 1);
        if (el.shadowRoot) for (const child of el.shadowRoot.children) walk(child, d + 1);
      }
      walk(document.body, 0);
      return { nodes, truncated };
    }, { depth, maxNodes });
    let accessibility = '';
    try { accessibility = (await this.page.locator('body').ariaSnapshot({ timeout: this.target.timeoutMs })).slice(0, 50000); } catch { /* structured DOM nodes remain available */ }
    return { title: await this.page.title(), url: this.page.url(), ...result, accessibility };
  }
  private async assert(read: () => Promise<unknown>, expected: unknown, contains: boolean, timeout: number): Promise<unknown> {
    const end = Date.now() + timeout;
    let actual: unknown;
    do {
      actual = await read();
      if (contains ? String(actual).includes(String(expected)) : String(actual) === String(expected)) return { actual, expected };
      await new Promise(r => setTimeout(r, 100));
    } while (Date.now() < end);
    throw new Error('Assertion failed: expected ' + JSON.stringify(expected) + (contains ? ' within ' : ', received ') + JSON.stringify(actual));
  }
  async act(step: Step): Promise<unknown> {
    const timeout = step.timeoutMs || this.target.timeoutMs;
    if (step.action === 'navigate') { await this.page.goto(this.url(String(step.value)), { waitUntil: 'domcontentloaded', timeout }); return { url: this.page.url() }; }
    if (step.action === 'selectWindow') {
      this.setPage(await this.waitForWindow(String(step.value), undefined, timeout));
      return { windowId: this.windowId(this.page), title: await this.page.title() };
    }
    if (step.action === 'focusWindow') { await this.page.bringToFront(); return { focused: true }; }
    if (step.action === 'assertTitle') return this.assert(() => this.page.title(), step.value, step.contains, timeout);
    if (step.action === 'press' && !step.locator) { await this.page.keyboard.press(String(step.value)); return { pressed: true }; }
    if (step.action === 'menu') {
      if (step.menuSource === 'native' && !this.electron) throw new Error('Native Electron Menu API requires an electron-launch session. CDP supplies renderer access only; use DOM menus or explicit Windows UIA.');
      if (this.electron && step.menuSource !== 'dom') {
        const windowHandle = await this.electron.browserWindow(this.page);
        const windowId = await windowHandle.evaluate(window => window.id);
        await windowHandle.dispose();
        const result = await this.electron.evaluate(({ Menu, BrowserWindow }, { path, windowId, source }) => {
          type NativeMenuItem = { label: string; enabled: boolean; visible: boolean; type: string; submenu?: { items: NativeMenuItem[] }; click(event: object, window: unknown, contents: unknown): unknown };
          let items: NativeMenuItem[] = Menu.getApplicationMenu()?.items || [];
          if (source !== 'native' && !items.some(item => item.label === path[0])) return null;
          for (let index = 0; index < path.length; index++) {
            const matches = items.filter(item => item.label === path[index]);
            if (matches.length !== 1) throw new Error('Native menu path must match one exact item at each level: ' + path[index] + ' matched ' + matches.length);
            const item = matches[0];
            if (!item.enabled || !item.visible) throw new Error('Native menu item is disabled or hidden: ' + path[index]);
            if (index < path.length - 1) {
              if (!item.submenu) throw new Error('Native menu item has no submenu: ' + path[index]);
              items = item.submenu.items;
            } else {
              if (item.submenu || ['separator', 'header'].includes(item.type)) throw new Error('Native menu path must end at an invokable leaf command');
              const window = BrowserWindow.fromId(windowId);
              if (!window || window.isDestroyed()) throw new Error('Selected Electron window is closed');
              item.click({ shiftKey: false, ctrlKey: false, altKey: false, metaKey: false, triggeredByAccelerator: false }, window, window.webContents);
              return { path, source: 'electron-native-menu', invocation: 'MenuItem.click' };
            }
          }
          return null;
        }, { path: step.menuPath!, windowId, source: step.menuSource });
        if (result) return result;
      }
      for (const name of step.menuPath || []) await this.page.getByRole('menuitem', { name, exact: true }).click({ timeout });
      return { path: step.menuPath, source: 'renderer-dom' };
    }
    if (step.action === 'assertCount') return this.assert(() => this.locator(step.locator!).count(), step.value, false, timeout);
    if (step.action === 'assertVisible' && step.value === false) {
      await this.locator(step.locator!).waitFor({ state: 'hidden', timeout }); return { visible: false };
    }
    const loc = await this.element(step.locator!, timeout);
    switch (step.action) {
      case 'click': await loc.click({ timeout }); break;
      case 'doubleClick': await loc.dblclick({ timeout }); break;
      case 'fill': await loc.fill(String(step.value), { timeout }); break;
      case 'press': await loc.press(String(step.value), { timeout }); break;
      case 'select': await loc.selectOption(String(step.value), { timeout }); break;
      case 'check': await loc.check({ timeout }); break;
      case 'uncheck': await loc.uncheck({ timeout }); break;
      case 'hover': await loc.hover({ timeout }); break;
      case 'waitFor': case 'assertVisible': await loc.waitFor({ state: 'visible', timeout }); break;
      case 'assertText': return this.assert(async () => (await loc.innerText({ timeout })).trim(), step.value, step.contains, timeout);
      case 'assertValue': return this.assert(() => loc.inputValue({ timeout }), step.value, step.contains, timeout);
      case 'assertEnabled': return this.assert(() => loc.isEnabled(), step.value ?? true, false, timeout);
      case 'assertChecked': return this.assert(() => loc.isChecked(), step.value ?? true, false, timeout);
      case 'setRange': throw new Error('Web range controls: use fill or press with an accessible slider locator; setRange is a desktop action');
      default: throw new Error('Unsupported action: ' + step.action);
    }
    return { completed: true };
  }
  async menus(depth = 6): Promise<unknown> {
    if (this.electron) {
      return this.electron.evaluate(({ Menu }, limit) => {
        type MenuEntry = { label: string; role?: string; enabled: boolean; visible: boolean; checked: boolean; type: string; submenu?: { items: MenuEntry[] } };
        const read = (items: MenuEntry[], d: number): unknown[] => d > limit ? [] : items.map(i => ({ label: i.label, role: i.role, enabled: i.enabled, visible: i.visible, checked: i.checked, type: i.type, submenu: i.submenu ? read(i.submenu.items, d + 1) : [] }));
        return { source: 'electron-native-menu', items: read(Menu.getApplicationMenu()?.items || [], 0), note: 'Read from the running application; no leaf commands invoked.' };
      }, depth);
    }
    const snapshot = await this.snapshot(depth, 1500);
    return { source: 'live-accessibility', items: snapshot.nodes.filter(n => ['menu', 'menubar', 'menuitem', 'menuitemcheckbox', 'menuitemradio'].includes(n.role || '')), truncated: snapshot.truncated, note: 'Only currently exposed menus. Open submenu paths using ui_action to inspect lazy-rendered entries.' };
  }
  async screenshot(path: string) { await this.page.screenshot({ path, fullPage: false, timeout: this.target.timeoutMs }); }
  async traceStart() { await this.context.tracing.start({ screenshots: true, snapshots: true, sources: false }); this.tracing = true; }
  async traceStop(path: string) { if (this.tracing) { await this.context.tracing.stop({ path }); this.tracing = false; } }
  async close() { if (this.electron) await this.electron.close(); else await this.browser?.close(); }
}
