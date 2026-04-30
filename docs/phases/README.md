# Phases

Phased, actionable implementation plan for Scrolly. Each phase is a self-contained checklist grounded in the canonical spec ([../specs/](../specs/)) and reference implementation ([../_references/bseai_degree/](../_references/bseai_degree/)).

## How to use this

Tell me **"implement phase N"** (e.g. *"implement phase 01"*) and I will:

1. Re-read the phase file and the spec sections it references.
2. Read the exact reference files it lists before writing any code.
3. Apply the listed changes to this workspace.
4. Run the phase's **Exit checks**.
5. Update `STATUS.md` and flip the phase's front-matter `status` to `done`.

## Phase index

| # | Phase | Status |
|---|---|---|
| 00 | [Scaffold](./00-scaffold.md) | ✅ done |
| 01 | [Design system foundation](./01-design-system.md) | ⏳ pending |
| 02 | [Content pipeline](./02-content-pipeline.md) | ⏳ pending |
| 03 | [Shared shell + markdown renderer](./03-standard-layout.md) | ⏳ pending |
| 04 | [Motion primitives](./04-motion-primitives.md) | ⏳ pending |
| 05 | [Presentation layout](./05-presentation-layout.md) | ⏳ pending |
| 06 | [Visualizations](./06-visualizations.md) | ⏳ pending |
| 07 | [CI + deploy hardening](./07-ci-deploy.md) | ⏳ pending |
| 08 | [Ocean content pass](./08-content-pass.md) | ⏳ pending |

Current live tracker: [STATUS.md](./STATUS.md).

## Ground rules (apply to every phase)

- **Read the reference files first.** Do not invent patterns that already exist in [../_references/bseai_degree/](../_references/bseai_degree/). Port, then adapt.
- **Do not copy domain-specific content** (NJIT, BSEAI, studio_ordo branding). The phase files call out what is reusable vs what must be generalized.
- **Each phase must leave the build green and the test suite passing.** `npm run lint && npm run test && npm run build && npm run test:e2e` must all succeed at the end of every phase.
- **Every phase declares tests up front** in `## Tests required` — see [specs/07-testing.md](../specs/07-testing.md) for the matrix. No merge without tests covering the changed code.
- **Non-trivial phases get an audit pass** (Knuth / Clean Code / GoF). Findings dispositioned as blocker / backlog / wontfix in `## Audit findings`.
- **Non-trivial phases also run the agentic failure-mode check and the review burden report.** Both live in the phase file, below `## Audit findings`. They exist so the diff is easy for a human to inspect and so known agent failure modes are ruled out explicitly, not implicitly.
- **Commit boundaries = phase boundaries.** One phase, one (set of) commits.
- **Update the phase file on completion.** At the bottom of each phase file is a "Completion notes" section — fill it in with what was actually done, what deviated from the plan, and any follow-ups for later phases. This is how the plan stays grounded.

## Phase file structure

Every phase file follows this shape:

```markdown
---
status: pending | in-progress | done
phase: NN
title: …
depends-on: [list of prior phases]
---

# Phase NN — Title

## Objective
(1–3 sentences)

## Spec references
- specs/NN-*.md §section

## Reference code to port
- docs/_references/bseai_degree/<path>   → scrolly/<target>

## Steps
1. …
2. …

## Files created / modified
- path — purpose

## Tests required
Declared up front, alongside objectives. See [specs/07-testing.md](../specs/07-testing.md) for the matrix.
- **Unit** (Vitest): positive / negative / edge cases for each changed `lib/` module.
- **Integration** (Vitest): seams between modules introduced or changed in this phase.
- **E2E golden path** (Playwright): one spec per user-facing spec this phase fulfils.

## Exit checks
- [ ] concrete command or state to verify
- [ ] `npm run lint && npm run test && npm run build && npm run test:e2e` all pass

## Audit findings
(filled in after execution — optional but recommended for non-trivial phases)

Run Knuth / Clean Code / GoF audit passes. Each finding:
- `[file:line] — observation — disposition (blocker | backlog | wontfix)`

Blockers must be resolved before closing the phase. Backlog items become follow-up phases or `NOTES.md` entries. Wontfix entries carry a one-line reason.

## Agentic failure-mode check
(filled in during or after execution — required for non-trivial phases)

A short checklist to force explicit reflection on agent failure modes before the phase closes:

- Could the agent edit before understanding?
- Could this fix the symptom instead of the root cause?
- Could stale docs or old notes mislead the agent?
- Could this touch too many files?
- What would prove this works?

One sentence per item is enough. If any answer is "yes, and we did not mitigate it," that becomes a blocker or a backlog item in `## Audit findings`.

## Review burden report
(filled in after execution — required for non-trivial phases)

Keep this under ten lines. If it grows past that, the phase was too big.

- Files changed:
- LOC added / removed:
- Tests added:
- Commands run: `npm run lint` / `npm run test` / `npm run build` / `npm run test:e2e`
- What changed from the plan:
- What I deliberately did not change:
- What a human reviewer should inspect first:

## Completion notes
(filled in after execution)
```

See [guide/07-prompt-templates.md](../guide/07-prompt-templates.md) for copy-pasteable prompts that drive each section of this template.
