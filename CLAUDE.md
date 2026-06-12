# PSYFR — NATORI-ON-PSYFR Predictive Chronology Engine

## WHY
A worldbuilding & study instrument that renders Jason Breshears' ARCHAIX alternative
chronology as a live, predictive calendar. It fuses the **prediction grammar** of a
reverse-engineered app called *Ophis* with a correct **Chronicon calendar**, then scores
every projected date against the real timeline and the signature numbers **19** and **138**.
This is presented as the Breshears thesis, **not** as established science — keep that framing
visible in the product.

## WHAT (the deliverables)
- `clocks/PSYFR1.html` — **the engine / main page**. Single-file, offline, no network calls.
  Sections: The Oracle (seed anchors → choose operations → cast → scored Z-Dates),
  The Wheels (read any date across all chronology cycles), The Ledger (documented events),
  Method. Two scoring lenses: **V8** (chronology-first) and **V7** (numbers-first).
- `clocks/PSYFR2.html` — **the field guide**. Quick-start, glossary, copy-to-paste formula
  cookbook, grammar, tag key, 3 worked examples, FAQ.
- `docs/NATORI-ON-PSYFR-Technical-Walkthrough.docx` — teaching write-up of the whole build.
- `test/verify.js`, `test/runtime.js` — the regression harnesses (see HOW).

The two HTML files **cross-link by bare filename** (`PSYFR1.html` ↔ `PSYFR2.html`), so they
MUST stay together in the same folder (`clocks/`) or the nav links break. They also share
`localStorage` keys `ophion-theme` / `ophion-zoom` so theme + text-size carry across both —
do **not** rename those keys.

## HOW (work + verify)
Verify-first is the core discipline. **Prove the math before touching UI**, and after any
change to `clocks/PSYFR1.html`, run both harnesses:

```bash
npm test                 # runs verify + runtime
node test/verify.js      # chronology anchors, calendar round-trips, op grammar, 2040 convergence
node test/runtime.js     # boots the full script under a DOM stub (catches load-order/TDZ bugs)
```

Both must exit 0. `verify.js` extracts the pure-math core from the HTML (it cuts just before
the `STATE + UI` banner and pulls `DEFAULT_OPS`/`PACKS` by regex), so if you rename those
in-file markers, update the harness to match.

A `/verify` slash command (`.claude/commands/verify.md`) runs both harnesses and reports.
Folder-specific rules for the engine live in `clocks/CLAUDE.md` and auto-load when you edit there.

### Engine internals worth knowing
- Dates use astronomical years (year 0 = 1 BC). `jdn(ay,m,d)` ↔ `jdToDate(J)` are the
  calendar core. `am = a => a+3894` (Annus Mundi), `lcYear = a => a+3112` (Mayan Long Count).
  Sanity: 2026 → AM 5920 / LC 5138; Great Flood (astro −2238) → AM 1656; Petrie 1882 → AM 5776.
- An **operation** is a string that must start `X1+` or `X2+`, may use `Y` (interval in days),
  numbers, `OPH_PHI` (1.618) / `OPH_PI` (3.14) / `OPH_CRV` (5.08), and `oph_flip` (digit
  reversal: 138→831), `oph_round/floor/ceil/abs/sqrt`. `compileOp(str)` → `{start, fn}`;
  anything off-grammar throws. Phoenix events sit on the 138-lattice (`mod 138 == 108`).
- `cast(anchors, ops, SCORING.V8|V7)` returns scored Z-Dates; `findConvergences(res, window)`
  clusters dates where multiple distinct operations agree (window: `'exact' | 1 | 7 | 30 | 90 | 'year'`).

## CONVENTIONS
- **Single-file, air-gapped HTML** — no build step, no external requests, no localStorage for
  app data beyond the two theme keys. (Browser storage APIs are otherwise avoided.)
- **Separate display from logic** when renaming/rebranding: change visible text, cross-links,
  and download filenames; leave function names, IDs, and storage keys alone.
- **Make surgical, line-targeted edits** and re-run the harnesses; don't hand-wave "it parses."
- Aesthetic: Cinzel / EB Garamond / IBM Plex Mono; gold `#d8a943`, red `#d3402f`, cyan,
  violet on near-black, with a parchment light theme. Dark/light + A−/A/A+ are accessibility
  features (ARIA, focus-visible, reduced-motion) — preserve them.
- House signatures: lean into palindromes and the numbers **19** and **138** in new work.

## POSSIBLE NEXT STEPS
- Split the single file into modules (engine core / data / UI) without losing the air-gapped,
  open-from-disk property — or keep single-file by choice and document why.
- Add a printable cheat-sheet; embed engine screenshots into the walkthrough docx.
- Widen eclipse-table coverage (currently ~1–3000 CE; outside that the tag is simply omitted).

## REFERENCE
Claude Code memory & CLAUDE.md docs: https://code.claude.com/docs/en/memory
