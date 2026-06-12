# PSYFR

The **NATORI-ON-PSYFR Predictive Chronology Engine** — a single-file, offline web
instrument that renders the ARCHAIX chronology of Jason Breshears as a live, predictive
calendar, plus its companion field guide.

## Open the app
Both files live in `clocks/` and **must stay together** (they link to each other by
filename and share theme settings).

- `clocks/PSYFR1.html` — the engine (open this one)
- `clocks/PSYFR2.html` — the field guide (reachable from the engine's 📖 link)

Just double-click `clocks/PSYFR1.html` — no server, no internet, no install.

## Run the tests
Requires Node.js (no dependencies).

```bash
npm test            # runs both harnesses
# or individually:
node test/verify.js   # math: chronology anchors, calendar round-trips, grammar, convergence
node test/runtime.js  # boots the full engine under a fake DOM to catch load-order bugs
```

Both should print their checks and exit 0. Run them after any edit to `clocks/PSYFR1.html`.

## Continue this project in Claude Code
This folder is set up so Claude Code picks up the full context automatically — it reads
`CLAUDE.md` at the start of every session.

1. Install Claude Code (see the official docs): https://code.claude.com/docs/en/overview
2. Open a terminal **in this folder** and run `claude`.
3. Ask it to read the project, then describe what you want next. A good first prompt:
   *"Read CLAUDE.md and run `npm test` to confirm the baseline, then let's plan the next change."*

`CLAUDE.md` holds the architecture, the engine internals, the conventions, and the
verify-first workflow, so a fresh session starts informed.

## Layout
```
PSYFR/
├── CLAUDE.md     ← auto-loaded project context for Claude Code
├── README.md     ← this file
├── package.json  ← `npm test` runner (no dependencies)
├── .claude/
│   └── commands/
│       └── verify.md   ← the /verify slash command
├── clocks/
│   ├── CLAUDE.md     ← folder rules (auto-load when editing the engine)
│   ├── PSYFR1.html   ← engine / main page
│   └── PSYFR2.html   ← field guide
├── docs/
│   └── NATORI-ON-PSYFR-Technical-Walkthrough.docx
└── test/
    ├── verify.js     ← math + grammar + convergence checks
    └── runtime.js    ← DOM-stub boot check
```

In Claude Code, type `/verify` any time to run the harnesses and get a pass/fail report.

## Note on the material
This is a worldbuilding and study instrument presenting the Breshears/ARCHAIX thesis —
not a claim of established science. That framing is stated inside the app itself.
