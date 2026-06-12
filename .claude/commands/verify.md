---
description: Run the PSYFR regression harnesses (math + runtime) and report pass / fail.
argument-hint: ""
allowed-tools: Bash(node:*), Bash(npm:*)
---

## Baseline check

!`npm test 2>&1`

## Instructions

The block above is the live output of the PSYFR verification harnesses
(`test/verify.js` — chronology anchors, calendar round-trips, operation grammar, and the
known 2040 convergence; then `test/runtime.js` — boots the full engine under a DOM stub).

- If every check passed and both harnesses exited 0, confirm the baseline is **green** in
  one short line and stop.
- If anything failed, name the specific failing check, open the relevant code in
  `clocks/PSYFR1.html`, explain the likely cause, and propose a fix. After applying a fix,
  run `npm test` again and repeat until green.

Always run this after editing `clocks/PSYFR1.html`. Remember: "it parses" is not "it runs."
