#!/usr/bin/env node
/* ============================================================
   PSYFR · verify.js
   Verify-first regression harness for the prediction engine.
   Reads clocks/PSYFR1.html, extracts the pure-math core (no DOM),
   and checks chronology anchors, calendar round-trips, the operation
   grammar, and a known convergence. Exits non-zero on any failure.

   Run from the project root:   node test/verify.js
   ============================================================ */
const fs = require('fs');
const path = require('path');

const ENGINE = path.join(__dirname, '..', 'clocks', 'PSYFR1.html');
const html = fs.readFileSync(ENGINE, 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];

// Core = everything before the "STATE + UI" marker (functions, MSRF, SCORING,
// compileOp, cast, findConvergences). DEFAULT_OPS / PACKS are data blocks that
// live just after the marker, so pull them out separately and append.
// Core = math + grammar, ending cleanly *before* the "STATE + UI" banner
// comment (cutting mid-banner would leave an unterminated /* block).
const _cut  = script.indexOf('STATE + UI');
const _pre  = script.lastIndexOf('/*', _cut);
const core  = (_pre >= 0 && _cut - _pre < 400) ? script.slice(0, _pre) : script.slice(0, _cut);
const dops  = (html.match(/const DEFAULT_OPS=\[[\s\S]*?\];/) || [''])[0];
const packs = (html.match(/const PACKS=\{[\s\S]*?\n\};/)     || [''])[0];

let PASS = 0, FAIL = 0;
const ok  = (name) => { console.log('  OK   ' + name); PASS++; };
const bad = (name, got, want) => { console.log('  FAIL ' + name + '  got ' + got + ' want ' + want); FAIL++; };
const eq  = (name, got, want) => (got === want ? ok(name) : bad(name, got, want));

const harness = `
/* ---- 1. CHRONOLOGY ANCHORS (AM = astro+3894, LC = astro+3112) ---- */
eq('today 2026 -> AM 5920',  am(2026), 5920);
eq('today 2026 -> LC 5138',  lcYear(2026), 5138);
eq('Great Flood -> AM 1656', am(-2238), 1656);
eq('Petrie 1882 -> AM 5776', am(1882), 5776);
eq('oph_flip(138) = 831',    oph_flip(138), 831);
eq('oph_flip(19)  = 91',     oph_flip(19), 91);
eq('isPalindrome(1331)',     isPalindrome(1331), true);

/* ---- 2. CALENDAR ROUND-TRIPS (jdToDate(jdn(y,m,d)) === y,m,d) ---- */
let rt = 0, rtFail = 0;
for (let y = -5000; y <= 4000; y += 11) {
  for (const [m, d] of [[1,1],[3,15],[7,4],[12,31]]) {
    const back = jdToDate(jdn(y, m, d));
    if (back.year === y && back.month === m && back.day === d) rt++;
    else { rtFail++; if (rtFail <= 3) console.log('  round-trip miss', y, m, d, '->', JSON.stringify(back)); }
  }
}
(rtFail === 0) ? ok('calendar round-trips ('+rt+'/'+rt+')')
               : bad('calendar round-trips', rt+' ok / '+rtFail+' bad', 'all pass');

/* ---- 3. OPERATION GRAMMAR (every default + pack op compiles) ---- */
let opN = 0, opBad = 0;
const allOps = [].concat(DEFAULT_OPS, ...Object.values(PACKS));
for (const eqn of allOps) { opN++; try { compileOp(eqn); } catch (e) { opBad++; console.log('  bad op:', eqn, e.message); } }
(opBad === 0) ? ok('operation grammar ('+opN+' ops compile)')
              : bad('operation grammar', opBad+' invalid', '0 invalid');
// grammar must still reject malformed input
let rejected = 0; for (const junk of ['Y*2','X3+Y','X1+fetch(1)']) { try { compileOp(junk); } catch (e) { rejected++; } }
eq('grammar rejects 3 bad ops', rejected, 3);

/* ---- 4. KNOWN CAST: 2040 convergence appears at strength >= 2 ---- */
const mkA = (ay,m,d,l) => ({ ay, m, d, jd: jdn(ay,m,d), label: l, enabled: true });
const anchors = [ mkA(-2238,5,15,'Great Flood'), mkA(2040,5,15,'Phoenix 2040'), mkA(2026,5,30,'Today') ];
const ops = DEFAULT_OPS.map(e => { const c = compileOp(e); return { eq:e, start:c.start, fn:c.fn, enabled:true }; });
const res = cast(anchors, ops, SCORING.V8).filter(r => !r.echo);
const conv = findConvergences(res, 'year');
const top = conv[0];
(top && top.ay === 2040 && top.nOps >= 2)
  ? ok('2040 convergence (strength '+top.nOps+')')
  : bad('2040 convergence', top ? (top.ay+' s'+top.nOps) : 'none', '2040 strength>=2');
`;

try {
  eval(core + '\n' + dops + '\n' + packs + '\n' + harness);
} catch (e) {
  console.error('HARNESS CRASH:', e.message);
  process.exit(2);
}

console.log('\n' + PASS + ' passed, ' + FAIL + ' failed');
process.exit(FAIL === 0 ? 0 : 1);
