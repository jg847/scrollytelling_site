---
title: Start here
audience: students
last-reviewed: 2026-04-23
---

# Start here

You have been using AI for coding all semester. One chat, one file, one session, mostly homework-sized problems. **This project is different: multi-session, multi-file, multi-week.** The habits that worked on a one-shot assignment break at this scale — the AI forgets, invents APIs, contradicts yesterday's decisions, and confidently ships code that doesn't run.

This guide is about the habits that don't break.

> **The brief:** ship a scrollytelling personal web page, deployed to GitHub Pages, built from this template.
> **The real lesson:** how to direct an AI coding assistant on a real project — with references, specs, phases, tests, and audits — without losing control of what it writes.

The Next.js stack is the *vehicle*. The process is the *payload*. Frameworks will change; how you direct an AI pair on a codebase larger than a chat window will not. Do the brief honestly and the process will stick.

## Reading order

The guide is in three parts. **Do Part 1 first**, ship something, then come back for Part 2. Methodology makes more sense after you have felt the work.

### Part 1 — Ship something (feel the work before the theory)

| # | File | Time | Why |
|---|------|------|-----|
| 1 | [01-the-stack.md](01-the-stack.md) | 10 min | What Next.js, React, JSX, and static export actually are |
| 2 | [02-hosting.md](02-hosting.md) | 5 min | GitHub Pages, and why this class uses it |
| 3 | [04-your-assignment.md](04-your-assignment.md) | 10 min | The brief itself — setup, workflow, rubric, how to submit |

**Stop and ship.** Deploy a placeholder version of your site before reading Part 2. You want to have felt at least one real change-build-deploy cycle.

### Part 2 — Why we work this way (read after your first deploy)

| # | File | Time | Why |
|---|------|------|-----|
| 4 | [03-working-with-ai.md](03-working-with-ai.md) | 20 min | **The most important file.** Garden-hose model, failure modes, control loop, tests as durable exit checks, quality audits |
| 5 | [07-prompt-templates.md](07-prompt-templates.md) | 10 min | Copy-pasteable prompts for every step of the control loop |
| 6 | [06-reference-as-context-pack.md](06-reference-as-context-pack.md) | 10 min | How to harvest ideas and working code from real sites into your own specs and phases |
| 7 | [08-a-real-run.md](08-a-real-run.md) | 10 min | One end-to-end run of the loop on a real phase — prompts, loopbacks, and all (template until phase 01 completes) |

### Part 3 — Reference

| # | File | Why |
|---|------|-----|
| 7 | [05-glossary.md](05-glossary.md) | Every term in one place |
| — | [`../specs/`](../specs/) | What the full site is supposed to do (10 short files) |
| — | [`../phases/`](../phases/) | Step-by-step implementation plan (9 phases) |

You do not need Part 3 to submit a basic assignment. It is there if you want to build the full scrollytelling experience end-to-end.

## What you are building (the brief)

A personal scrollytelling web page that:

1. Uses scroll to drive the story — sticky panels, reveals, or scroll-linked animation, whatever fits your topic.
2. Is built from Markdown + React components.
3. Deploys to **your own** GitHub Pages URL.
4. Lists your images automatically at `/images/` — a feature inherited from this template.

## What you are learning (the payload)

- How a modern web framework (Next.js + React) is organised.
- How to deploy a static site to GitHub Pages for free.
- **How to direct an AI pair on a real project across many sessions — using files, not chat, to hold meaning.** This is the transferable skill.

By the end of this project you will have shipped a real, deployed, tested web application using the same planning-and-review discipline software teams use in production: spec-driven development, phased delivery, automated test coverage, and structured code review. The AI is how you scale your output. The discipline is how you stay employable when the AI does the easy 80%.

Keep going → [01-the-stack.md](01-the-stack.md).
