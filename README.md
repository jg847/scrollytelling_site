# Scrolly

A statically-exported Next.js site that teaches **how to direct an AI pair on a real project** — disguised as an assignment to build a scrollytelling web page.

- **Live site:** https://jg847.github.io/scrollytelling_site/
- **Image library:** https://jg846.github.io/scrollytelling_site/images/
- **Repo:** https://github.com/jg847/scrollytelling_site
- **Stack:** Next.js 16 App Router (static export) · React 19 · TypeScript · framer-motion · Markdown + Zod · CSS Modules

## The brief (and the real lesson)

> **Vehicle:** a scrollytelling personal web page, deployed to GitHub Pages.
> **Payload:** how to work with an AI coding assistant on a real, multi-session project without losing control of what it writes.

The Next.js stack is the *technical objective* — the thing you will ship and put on your résumé. The **process** — references, specs, phases, the control loop, tests, audits — is the *transferable skill*. Frameworks change. How you direct an AI pair on a codebase larger than a chat window does not.

Treat this repo like a technology brief: the requirements are concrete (ship a scrollytelling page), but the point of the exercise is learning the ideology and process used to deliver it.

## If you are a student

Start here → **[docs/guide/00-start-here.md](docs/guide/00-start-here.md)**.

The guide is organized in three parts:

**Part 1 — Ship something first** (feel the work before the theory)
1. [The stack](docs/guide/01-the-stack.md) — what Next.js, React, JSX, and static export actually are.
2. [Hosting](docs/guide/02-hosting.md) — GitHub Pages vs Vercel, and why this class uses Pages.
3. [Your assignment](docs/guide/04-your-assignment.md) — the brief. Setup, workflow, rubric, how to submit.

**Part 2 — Why we work this way** (the real lesson; read after your first deploy)
4. [Working with AI](docs/guide/03-working-with-ai.md) — garden-hose model, failure modes, control loop, tests as durable exit checks, quality audits. **The most important file.**
5. [Prompt templates](docs/guide/07-prompt-templates.md) — copy-pasteable prompts for every step of the control loop.
6. [Reference projects as context packs](docs/guide/06-reference-as-context-pack.md) — how to harvest ideas and working code from sites like [bseai_degree](https://github.com/kaw393939/bseai_degree) into your own specs and phases.
7. [A real run of the loop](docs/guide/08-a-real-run.md) — one end-to-end transcript on a real phase, including loopbacks. (Template until phase 01 is complete.)

**Part 3 — Reference**
7. [Glossary](docs/guide/05-glossary.md) — every term in one place.
8. [`docs/specs/`](docs/specs/) and [`docs/phases/`](docs/phases/) — the full build plan.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000

npm run build      # static export → out/
```

Deploying to Pages is handled by [.github/workflows/deploy.yml](.github/workflows/deploy.yml); see [docs/specs/08-deployment.md](docs/specs/08-deployment.md).

## How this project is built

This repo uses a three-layer process to keep a human and an AI coding assistant aligned across long sessions.

```
┌──────────────────────────────────────────────────────────────┐
│  docs/_references/     Reference implementation              │
│  (ground truth)        Real working code to port from        │
├──────────────────────────────────────────────────────────────┤
│  docs/specs/           Specification — what to build         │
│  (stable)              10 short files, one concern each      │
├──────────────────────────────────────────────────────────────┤
│  docs/phases/          Phased plan — how and when            │
│  (executed)            9 scoped phases + STATUS tracker      │
└──────────────────────────────────────────────────────────────┘
```

The idea in one paragraph: a modern AI coding assistant is a nearly unlimited supply of raw intelligence. What is scarce is **direction**. Specs give the AI stable meaning; phases give it a scoped task; references give it real code to port from; runnable exit checks and automated tests decide when the work is actually done. Correctness is a matter of commands, not vibes.

### Why we work this way (the research in four numbers)

This is not folklore. Large-scale studies of real coding-agent runs converge on four findings that shape every habit in this repo:

- **The ceiling is architectural judgment, not editing skill.** On 12 SWE-bench tasks that *no* agent solves, agents find the correct file 12/12 times and edit it 10/12 times — then fix the symptom instead of the root cause. [4]
- **Trajectory *shape* predicts success; length does not.** Once task difficulty is controlled, longer runs are not worse runs. What separates wins from losses is the ratio of read → edit → verify. Premature patching in the opening steps is the single strongest negative signal (ρ = −0.78). [4]
- **Reviewer abandonment is the #1 reason agent PRs fail in the wild** (38% of rejections across 33,596 PRs), followed by duplicate PRs (23%) and CI/test failures (17%). Big diffs don't get read. [2]
- **The model matters more than the scaffold.** Agents with the same LLM agree on 85–93% of tasks across frameworks; agents sharing a framework but with different LLMs agree on only 47–88%. Verbose prompts don't rescue weaker models at the frontier. [3][4]

Translation for this course: diagnose before editing, keep diffs reviewable, test as you go, and put your effort into spec quality rather than prompt verbosity. Long-form treatment — garden-hose model, failure modes, testing matrix, audit lenses, and full citations — lives in [docs/guide/03-working-with-ai.md](docs/guide/03-working-with-ai.md).

## The control loop (at a glance)

Every real task in this repo runs through a seven-step loop — once for planning, then once per phase for execution:

**Planning (wide → narrow):** Harvest → Converge → Specify → Phase.
**Per phase (before → during → after):** Pre-flight QA → Implement (+ tests) → Exit QA (+ optional Knuth / Clean Code / GoF audit).

If exit QA fails, you loop back — that's why it's a *control loop*, not a checklist.

Copy-pasteable prompts, loopback rules, and the testing/audit details: **[docs/guide/07-prompt-templates.md](docs/guide/07-prompt-templates.md)**.

## Project layout

```
scrolly/
├── .github/workflows/deploy.yml   # GitHub Pages CI
├── docs/
│   ├── guide/                     # student-facing teaching material
│   ├── specs/                     # what to build (stable)
│   ├── phases/                    # how to build it (executed)
│   └── _references/               # real working code to port from
├── public/images/                 # assets (listed at /images/ on the live site)
├── src/app/                       # App Router entry points
├── next.config.ts                 # static export + basePath for Pages
├── package.json
└── tsconfig.json
```

## Current status

See [docs/phases/STATUS.md](docs/phases/STATUS.md). At the time of writing, Phase 00 (scaffold) is done; Phase 01 (design system) is next.

## Continuing the build

Run the [control loop](#the-control-loop) once per phase:

1. Read [docs/phases/README.md](docs/phases/README.md) and check `STATUS.md` for the next pending phase.
2. **Pre-flight QA** the phase file against the current codebase (loop step 5).
3. **Implement** the phase with tests (loop steps 6 + 6a).
4. **Exit QA** — `npm run lint && npm run test && npm run build && npm run test:e2e` all green (loop step 7).
5. **Audit pass** for non-trivial phases — Knuth / Clean Code / GoF (loop step 7.5).
6. Fill in the Completion notes and Audit findings. Update `STATUS.md`.
7. Commit. Repeat.

Copy-pasteable prompts for each step: [docs/guide/07-prompt-templates.md](docs/guide/07-prompt-templates.md).

## License

TBD.
