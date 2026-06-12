#!/usr/bin/env node
/* ============================================================
   PSYFR · runtime.js
   Boots the FULL engine script under a fake DOM to catch load-order
   bugs (e.g. the temporal-dead-zone "$ before initialization" class)
   that a syntax check alone would miss. "It parses" != "it runs".

   Run from the project root:   node test/runtime.js
   ============================================================ */
const fs = require('fs');
const path = require('path');

const ENGINE = path.join(__dirname, '..', 'clocks', 'PSYFR1.html');
const html = fs.readFileSync(ENGINE, 'utf8');
const script = html.match(/<script>([\s\S]*)<\/script>/)[1];

// --- minimal DOM/Window/localStorage stubs ---
function fakeEl() {
  const s = { style: { setProperty() {} }, dataset: {},
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false } },
    children: [], value: '', textContent: '', checked: false };
  return new Proxy(s, {
    get(t, p) {
      if (p in t) return t[p];
      if (['addEventListener','setAttribute','removeAttribute','appendChild','removeChild',
           'append','remove','click','focus','scrollIntoView','insertBefore','replaceChildren'].includes(p)) return () => {};
      if (p === 'getAttribute') return () => 'dark';
      if (p === 'querySelector') return () => fakeEl();
      if (p === 'querySelectorAll') return () => [];
      if (p === 'getContext') return () => ({});
      if (p === 'parentNode' || p === 'firstChild') return fakeEl();
      return '';
    },
    set(t, p, v) { t[p] = v; return true; }
  });
}
const cache = {};
global.document = {
  getElementById: id => (cache[id] || (cache[id] = fakeEl())),
  querySelector: () => fakeEl(),
  querySelectorAll: () => [],
  createElement: () => fakeEl(),
  createElementNS: () => fakeEl(),
  addEventListener: () => {},
  documentElement: fakeEl(),
  body: fakeEl()
};
global.window = {
  matchMedia: () => ({ matches: false, addEventListener() {}, addListener() {} }),
  addEventListener: () => {},
  requestAnimationFrame: () => {},
  location: { href: '' }
};
global.navigator = { clipboard: { writeText: () => Promise.resolve() } };
global.localStorage = { _d: {}, getItem(k){ return this._d[k] ?? null; }, setItem(k,v){ this._d[k] = String(v); }, removeItem(k){ delete this._d[k]; } };
global.requestAnimationFrame = () => {};

try {
  eval(script);
  console.log('RUNTIME: engine booted under DOM stub, init() completed, NO error \u2713');
  process.exit(0);
} catch (e) {
  console.error('RUNTIME FAILURE:', e.message);
  process.exit(1);
}
