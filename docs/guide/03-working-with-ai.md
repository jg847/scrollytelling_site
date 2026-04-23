---
title: Working with AI
audience: students
last-reviewed: 2026-04-23
---

# Working with AI

> **Read this after your first deploy.** If you haven't shipped a placeholder version of the assignment yet, start with [04-your-assignment.md](04-your-assignment.md) and come back. This file makes more sense once you have felt at least one real change-build-deploy cycle.

This is the most important file in the guide. The tech stack is something you will forget and re-learn. The habit you build *here* — how to direct an AI pair on a real project — will outlast any framework. **The scrollytelling assignment is the vehicle; this file is the payload.**

> **TL;DR.** AI writes code cheaply; direction is scarce. Put your direction in files (references, specs, phases), not in chat. Verify with a command, not a vibe. Run the [control loop](#the-control-loop).

## Pedigree — whose shoulders this stands on

Nothing in this guide is new. The methodology is four old engineering disciplines re-applied to AI pairing:

- **W. Edwards Deming** — *Plan-Do-Check-Act*, the quality-control loop from 1950s manufacturing. **Our control loop is PDCA with seven steps instead of four.** If you ever take an operations or quality class, you'll meet him again.
- **Donald Knuth** — *The Art of Computer Programming.* Algorithmic correctness, invariants, termination proofs, and the warning against premature optimization. This is the **Knuth audit** lens.
- **Robert C. Martin ("Uncle Bob")** — *Clean Code* and the SOLID principles (the "L" in SOLID is **Barbara Liskov**'s substitution principle). Names that tell the truth, small functions, separated responsibilities. This is the **Clean Code audit** lens.
- **Gamma, Helm, Johnson, and Vlissides ("the Gang of Four")** — *Design Patterns: Elements of Reusable Object-Oriented Software.* The vocabulary for common solutions: strategy, factory, observer, adapter. This is the **GoF audit** lens.

**What's new is applying these to AI pairing.** The AI is fast and fluent but has no judgment about correctness, structure, or patterns. You supply the judgment by running the same review passes a senior engineer would have done before AI existed. The process is older than your AI assistant; the AI just makes it more necessary, not less.

## Start from the physics

Take a moment to notice what is actually happening when you open an AI coding assistant.

Somewhere in a data centre, electricity is flowing through chips. Those chips are running matrix multiplications across weights trained on most of the public code humanity has ever written. Electricity is being converted, in real time, into something that looks and behaves very much like **intelligence**. You can ask it to write a React component and it does. You can ask it to design a database schema and it does. You can ask it to explain recursion to a seven-year-old and it does.

This is genuinely new. It is also genuinely raw. The output is not scarce — an AI will produce as much code as you let it — and it is not automatically correct. What is scarce, and what you have to bring, is **direction**.

## What AI is good for in this workflow

Be honest about what you are using it for. In this course, the jobs look like this:

| Use it for | Don't use it for |
|------------|------------------|
| Drafting code against a spec you wrote | Deciding *what* to build |
| Porting a known-working reference to a new file | Inventing APIs it has not seen |
| Explaining unfamiliar code or errors | Remembering decisions across sessions |
| Generating a first pass you will then edit and test | Final correctness (*you* run the check) |

If a task falls in the right column, the problem is not the AI — it is the process wrapped around it.

## Prompt wide early, narrow late — the garden-hose model

Think of an AI coding assistant as a garden hose hooked up to mains pressure.

The **water** is already there. You cannot generate more of it. What you control is your **thumb on the nozzle**.

- **Thumb off.** Water sprays wide — the flower bed, the fence, the neighbour's cat, your own feet. This is an AI with no specs, no scope, no exit checks. Lots of output, some of it useful.
- **Thumb pressed down.** Water narrows to a focused jet that hits exactly the patch you are aiming at. This is an AI given a single, scoped task with a reference and an exit check.

Same hose, same water, completely different outcome. The skill is **knowing which mode you are in and switching deliberately.**

| Mode | Use it for | Example prompt |
|------|------------|----------------|
| **Wide spray** (exploration) | Brainstorming, comparing approaches, learning a new area | *"What are three different ways to animate something on scroll in React?"* |
| **Narrow jet** (execution) | Making a specific change correctly | *"Add a new page at `/about/` that renders `content/about.md`. After build, `out/about/index.html` must exist."* |

Rule of thumb: **the earlier you are in a task, the wider the spray; the closer you are to shipping, the narrower the jet.** Switching too late is the most common mistake — people keep exploring when they should be executing.

## Why AI fails on real projects — the four failure modes

AI pairs fail in predictable ways. You will see all four in your own work. Everything after this section exists to prevent one of these.

1. **Short memory.** The AI does not remember what you decided three messages ago, let alone three sessions ago.
2. **Invents when unsure.** Faced with an API it does not know, it produces a plausible-looking call that does not exist.
3. **Does more than you asked.** Ask for a button; get a refactor.
4. **Cannot tell you it is lost.** There is no reliable "I do not know" signal. The output always reads as confident.

Notice what these have in common: they are all **context problems**, not intelligence problems. The model is smart enough. It is just missing the right inputs, at the right size, at the right moment. That is a problem you solve with **process**, not with cleverer prompting.

## Safety and boundaries

Before the process, a few hard lines. These are small habits, not legal boilerplate:

- **No secrets in chat.** No API keys, tokens, passwords, `.env` contents, or private student data pasted into an AI window. Assume anything you paste may be logged.
- **Do not trust generated code without running it.** "It compiles in the chat window" is not a test. The exit check is the test.
- **Do not let the model invent when a reference exists.** If the repo already has a working example, point at it. Inventing is a symptom of missing context.
- **Do not treat chat history as durable memory.** Sessions end, summaries drift, messages get truncated. Decisions belong in files.

If you follow these, most of the horror stories you have heard about AI-written code do not apply to you.

## How the repo structure prevents failure — the three-layer process

This is the specific shape we use to keep the jet narrow when it needs to be narrow. Each folder exists to block one of the failure modes above.

```
┌────────────────────────────────────────────────────────────┐
│  References    Real working code we port from              │
│  (ground truth)   e.g. docs/_references/                   │
├────────────────────────────────────────────────────────────┤
│  Specs         What the project is supposed to do          │
│  (stable)         e.g. docs/specs/                         │
├────────────────────────────────────────────────────────────┤
│  Phases        How and when we build it, step by step      │
│  (executed)       e.g. docs/phases/                        │
└────────────────────────────────────────────────────────────┘
```

Each layer exists because the other two cannot do its job:

- **Specs** outlive individual tasks. They hold the meaning — what, for whom, what "done" looks like. They defeat **short memory**.
- **Phases** are sized for one focused session. They turn the spec into concrete, bounded steps. They defeat **does more than you asked**.
- **References** give the AI something real to port from. They defeat **invents when unsure**.
- **Exit checks** (inside phases) turn "done?" into a command. They defeat **cannot tell you it is lost**.

The point is not the folder names. The point is that **context lives in files, work is broken into phases, each phase has constraints, and each phase ends with a concrete test.** Swap our names for someone else's and it is still the same idea.

## References: local vs external

Not all references are equal.

- **Local references** (files already in this repo — `src/app/page.tsx`, an existing component, a working test) are the strongest. The AI can port structure, imports, and conventions directly. This is where consistency comes from.
- **External references** (official vendor docs, a GitHub example, a blog post) are useful but moving targets. Versions change. Copy the specific snippet you need into the repo — as a reference file or a comment in the phase — rather than relying on the model's training data, which may be stale.

When in doubt: **anchor the AI to this repo's actual files.** That is what keeps the output consistent with the rest of your code.

## Three habits to take away

If you only remember three things from this file, make it these.

1. **Write the spec before the code.** One paragraph is enough. What are you building? For whom? What does "done" look like? Writing this forces you to think; handing it to the AI focuses the jet.
2. **Run the exit check.** For every task, decide *in advance* what would prove it is done. Then run it. "Build passes" is not a check. `npm run build && test -f out/about/index.html` is a check.
3. **Write down what you changed from the plan.** When the AI does something different than you intended (and it will), record it in the phase file or a `NOTES.md`. Future-you — and future AI sessions — will need to know.

## The control loop

The habits above are what you do. This is the order you do them in. Every real task in this course runs through some version of this loop — once for planning, then once per phase for execution.

**Planning (wide → narrow):**

1. **Harvest.** *"Look at this codebase and list the good ideas you can find."* Wide spray on existing code. You are building a menu, not deciding yet.
2. **Converge.** *"Discuss. Refine. Agree on what needs done."* Narrow the menu to a scope you can defend in one paragraph.
3. **Specify.** *"Go into `docs/specs/` and create as many specs as we need to cover this part of the project."* Lock the meaning into files so the next session starts from the same place.
4. **Phase.** *"Review these specs and plan phases so that at the end of this process we will have addressed 100% of the specs."* Every spec maps to at least one phase. Gaps here become bugs later.

**Per phase (before → during → after):**

5. **Pre-flight QA.** *"QA `docs/phases/NN-name.md` and update it with any relevant information from the current codebase to prepare it for implementation."* The plan was written before. Reality has moved. Reconcile before you execute.
6. **Implement.** One phase, one session, thumb on the nozzle.
    - **6a. Tests.** For each objective, write or update unit / integration / e2e tests covering positive, negative, edge, and (for the spec overall) golden-path cases. See [Tests as durable exit checks](#tests-as-durable-exit-checks).
7. **Exit QA.** *"QA this phase to ensure that 100% of the phase objectives are met."* Not a vibe. A list, each item pass or fail. The test suite must be green.
    - **7.5. Audit.** Optional but recommended after non-trivial phases: run a Knuth / Clean Code / Gang-of-Four reading pass. Each finding gets a disposition (blocker, backlog, wontfix). See [Quality audits](#quality-audits--knuth-clean-code-gof).

If step 7 fails, you do not move on — you loop back to step 5 (or further) with what you learned. That is why it is called a control loop and not a checklist.

Two ideas are doing most of the work here:

- **100% coverage as an explicit target.** *Every spec has a phase; every phase objective has a check.* Treat coverage like a test suite — gaps are failures.
- **Pre-flight QA.** Reading the codebase against the plan *before* touching it catches drift before the AI has a chance to invent around it.

Copy-pasteable versions of these seven prompts live in [07-prompt-templates.md](07-prompt-templates.md).

## Scaling the loop to the work

The full seven-step loop is overkill for "rename a variable" and the right weight for "add a new route with tests." Match the process to the risk:

| Task size | What to run | What to skip | Typical time |
|---|---|---|---|
| **Toy** — small fix, one file, reversible in a commit | Steps 1 + 6 + 7. One prompt, implement, eyeball the result, done. | Specs, phases, audit | 5–20 min |
| **Normal** — one feature, one session, a few files | Steps 3–7 + 6a. Skip harvest/converge if scope is already obvious. One small test. | Audit, unless something feels off | 1–3 hours |
| **Serious** — new subsystem, refactor, or anything touching shared code | All seven steps, full 6a (positive/negative/edge/golden), 7.5 with at least the Clean Code lens | Nothing | Multiple sessions |

Two rules for picking:

1. **When in doubt, go one step heavier.** The cost of an unnecessary test is an hour. The cost of a missing one is a regression you ship.
2. **Shared or long-lived code always runs the serious loop.** "It's just a small change" to a file five other components import is not a small change.

The full loop exists so you have the machinery when you need it, not so you run it on every task. A student who runs the toy loop on trivial work and the serious loop on risky work has understood the methodology better than one who runs the full seven steps on everything.

## What good prompting looks like — worked examples

### Example 1: Kind of Blue album page

Same task, two prompts.

**Wide spray (early in the task — OK):**

> I want to add a page about my favourite album. What are some ways I could lay it out using scrollytelling techniques? Give me three rough approaches.

You are exploring. You want range.

**Narrow jet (when you are ready to build):**

> In this repo, add a new page at `src/app/album/page.tsx`.
> It should:
> - Render an `<h1>` with the text "Kind of Blue".
> - Render the image at `/images/album-cover.jpg` using `next/image`.
> - Use the existing layout at `src/app/layout.tsx`; do not modify it.
>
> Reference `src/app/page.tsx` for the import style.
> When done, confirm: `npm run build` succeeds, and `out/album/index.html` exists.

Notice: one file named, behaviour specified concretely, explicit "do not touch," a runnable exit check, a reference so the AI is porting, not inventing.

### Example 2: improving an existing section

**Vague (don't do this):**

> Make this section better.

The AI has no spec, no reference, no boundary, no way to know if it succeeded. You will get a refactor.

**Scoped (do this):**

> In `src/components/Hero.tsx`, update the layout to match the spec in `docs/specs/hero.md` §3.
> Reference `docs/_references/hero-v1.tsx` for the grid structure.
> Do not touch `layout.tsx` or any file under `src/styles/`.
> Exit check: `npm run build` succeeds and the rendered `/` page shows the two-column hero as described in the spec.

Same intent, completely different output. The difference is not the model. The difference is that you did the work of pointing at a spec, a reference, a boundary, and a test.

## How to verify — the exit check

A check is a command that returns pass or fail. If you cannot run it, it is not a check.

Exit checks operate at two scales:

- **Per task / per phase.** Did the thing I just built do the thing I said it would? (Step 7 in the control loop.)
- **Per plan.** Does every spec have a phase, and does every phase objective have a concrete check? (Step 4 in the control loop.)

Good checks for this course:

- `npm run build` exits 0
- `test -f out/<route>/index.html`
- A specific string appears in a specific file: `grep -q "Kind of Blue" out/album/index.html`
- A screenshot of `/` matches what the spec describes (human-verified, but still a specific artefact)

Bad "checks":

- "The AI said it worked."
- "It looks right in the chat."
- "I'll test it later."

Define the check **before** you start the task. That is the moment your thumb presses down on the nozzle.

## Tests as durable exit checks

An exit check is a *one-time* gate: it runs at the end of a task. An **automated test** is a *perpetual* gate: it runs forever, on every commit. This matters for AI pairing specifically:

- AI regresses what you didn't tell it to preserve. The test suite is the "things already true" memo that never gets truncated.
- Refactoring without tests is un-auditable. With tests, you can let the AI restructure freely and know within seconds whether it broke something.
- A **golden-path end-to-end test** is the single best artefact you can hand an AI: *"here is the scripted user journey that must always pass — do not break it."*

Cover four axes at three levels. Each slot blocks a specific kind of regression:

| Level \ Axis | Positive | Negative | Edge | Golden path |
|---|---|---|---|---|
| **Unit** | Function returns the right value for typical input | Throws / returns error for bad input | Empty, zero, unicode, TZ, off-by-one | *(n/a at unit level)* |
| **Integration** | Two modules wire up and produce the expected result | The seam fails safely when one side misbehaves | Concurrency, retries, missing files | *(n/a)* |
| **E2E** | User can complete the flow in a real browser | Bad routes / missing content degrade gracefully | Keyboard nav, reduced motion, small screens | The headline flow the project exists to deliver |

The operational rule in this course:

- **Every spec gets at least one golden-path e2e test.** If there is no e2e, the spec is not really specified.
- **Every phase objective gets at least one unit or integration test as its exit check.** Declare them in the phase file, up front, the same way objectives are declared.
- **A failing test is never "fixed" by deleting the test.** Fix the code, or change the spec and then change the test deliberately.

Testing conventions and the existing test matrix for this repo live in [docs/specs/07-testing.md](../specs/07-testing.md).

## Quality audits — Knuth, Clean Code, GoF

Tests answer *is it correct?* Audits answer *is it any good?* They are planned reading passes at phase boundaries, not per-commit gates.

| Audit | What it asks | When to run |
|---|---|---|
| **Knuth** | Is the algorithm right? Do the invariants hold? Am I optimizing something that doesn't need it? | After a phase that introduces non-trivial logic (sort, diff, scheduling, parsing, layout math) |
| **Clean Code / Uncle Bob** | Are names honest? Are functions small? Are responsibilities separated? Any SOLID violations? | End of every phase — it is fast |
| **Gang of Four** | Does a named pattern fit here? Am I cargo-culting one that doesn't (fake factories, singletons as globals)? | When a phase adds a new abstraction |

Two rules keep audits from turning into endless refactors:

1. **Reading pass, not rewriting pass.** The output of an audit is a *list of findings*, not code changes.
2. **Every finding gets a disposition.** One of:
   - **Blocker** — fix before closing the phase.
   - **Backlog** — file a follow-up phase or `NOTES.md` entry.
   - **Wontfix** — documented trade-off with a one-line reason.

An audit with zero findings is suspicious. An audit with twenty findings and no dispositions is worse.

## When the hose is misbehaving

Symptoms and fixes you will actually use:

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| AI keeps "fixing" things you did not ask about | Scope too wide | Re-state the task narrower; list files it may and may not touch |
| AI references a function or import that does not exist | No reference, inventing | Give it a real file to port from |
| AI contradicts a decision from earlier in the session | Short memory | Write the decision to a file, then point the AI at the file |
| AI says "done" but the build breaks | No exit check | Define and run a concrete check; make it re-verify |
| Answers feel confident but subtly off | Operating beyond training (newer library version) | Feed it the actual docs or reference code; do not trust training data on moving targets |
| Phase drifts from what the spec said | Skipped pre-flight QA | Re-run step 5 of the control loop against the current codebase before resuming |
| Yesterday's feature stopped working after today's change | No regression test | Add a test that fails now, then fix. Do not proceed without it |
| AI refactor "succeeded" but something subtle is off | No test on the refactored boundary | Write the golden-path e2e first; refactor under it |

## Self-assessment — am I actually doing this?

The process is easy to perform badly. One honest question per loop step — answer yes or you haven't really done it.

| Step | The honest question |
|---|---|
| **1. Harvest** | Did I list at least one idea I would not have thought of on my own? |
| **2. Converge** | Can I defend the chosen scope in a single paragraph without saying "also"? |
| **3. Specify** | Could I delete half my spec and still know what I'm building? (If no, it's too big.) |
| **4. Phase** | Does every phase objective map to a command I can run? |
| **5. Pre-flight QA** | Did I find something in the codebase the plan didn't know about? |
| **6. Implement** | Did I stop at the edges of the phase instead of following an interesting tangent? |
| **6a. Tests** | Did I write the failing test *before* the code that fixes it, at least once? |
| **7. Exit QA** | Did I resist calling it done before every check passed — including the ones I almost skipped? |
| **7.5. Audit** | Did each finding get a disposition, including "wontfix" with a reason? |

If you answer no to several of these on the same phase, the fix is not a better prompt. The fix is to slow down at the step you're skipping.

## Keep reading

- Next: [04-your-assignment.md](04-your-assignment.md)
- One end-to-end run of the loop on a real phase → [08-a-real-run.md](08-a-real-run.md)
- Copy-pasteable loop prompts (including tests + audits) → [07-prompt-templates.md](07-prompt-templates.md)
- Testing matrix and conventions → [../specs/07-testing.md](../specs/07-testing.md)
- How to harvest and reuse working code as a "context pack" → [06-reference-as-context-pack.md](06-reference-as-context-pack.md)
- Glossary: [05-glossary.md](05-glossary.md)
