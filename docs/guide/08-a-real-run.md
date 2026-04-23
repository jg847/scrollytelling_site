---
title: A real run of the loop
audience: students
status: template — to be filled in during phase 01
last-reviewed: 2026-04-23
---

# A real run of the loop

> **Status: template.** This file is a skeleton. It will be filled in with an actual transcript from running the control loop on a real phase in this repo, so you can see what the process looks like in practice — including the bad prompts, the wrong turns, and the loopbacks. Until then, use the structure below as a guide for your own `PROCESS.md`.

## Why this file exists

The guide describes the methodology in the abstract. Seeing one honest end-to-end run is worth more than all of it. This file will show:

- **Exactly what was typed to the AI**, in order, including the bad prompts.
- **What the AI produced** at each step, summarised.
- **Where it went wrong**, and which failure mode from [03-working-with-ai.md](03-working-with-ai.md) showed up.
- **The loopback decision** — which step we went back to, and why.
- **What the phase file looked like at the start vs the end.**

This is the artefact the guide has been missing. A student reading it should be able to say: *"OK, I see what it actually looks like. I can do that."*

---

## Template — fill this in for one real phase

### Setup

- **Phase:** `docs/phases/NN-name.md`
- **Spec(s) addressed:** `docs/specs/NN-*.md`
- **Starting state of the repo:** *(commit SHA, what was done before this phase)*
- **Estimated time:** *(your guess up front)*
- **Actual time:** *(filled in at the end)*

### Step 1 — Harvest

**Prompt used:**

> *(paste the actual prompt — unedited)*

**AI output (summary):**

*(2–5 bullet summary of what the AI listed)*

**What survived into the next step:**

*(which ideas did we carry forward, which did we cut, and why)*

---

### Step 2 — Converge

**Prompt used:**

> *(actual prompt)*

**Agreed scope (one paragraph):**

*(the paragraph you would defend to the instructor)*

---

### Step 3 — Specify

**Prompts used:**

> *(one or more — paste them)*

**Specs created or updated:**

- `docs/specs/NN-*.md` — *one-line purpose*

**Link to the diff:** *(commit SHA or PR)*

---

### Step 4 — Phase

**Prompt used:**

> *(actual prompt)*

**Coverage check:** does every spec map to at least one phase? *(yes / no — and if no, what did we do?)*

---

### Step 5 — Pre-flight QA

**Prompt used:**

> *(actual prompt)*

**What we found that the plan didn't know about:**

*(this is the interesting part — if you found nothing, pre-flight QA was too shallow)*

**Changes made to the phase file before starting:**

*(list)*

---

### Step 6 — Implement (with 6a tests)

**Prompts used (in order):**

> *(paste the sequence — don't clean it up)*

**Tests written:**

| Level | What it covers | Pass/fail on first run |
|---|---|---|
| Unit — positive | | |
| Unit — negative | | |
| Unit — edge | | |
| Integration | | |
| E2E golden path | | |

**Failure modes that showed up:**

- [ ] Short memory
- [ ] Invents when unsure
- [ ] Does more than you asked
- [ ] Cannot tell you it is lost

*(check any that happened, and describe the moment in one line each)*

---

### Step 7 — Exit QA

**Commands run:**

```
npm run lint
npm run test
npm run build
npm run test:e2e
```

**Result:** *(all pass / which failed)*

**If anything failed: which step did we loop back to, and why?**

*(honest answer — this is the most instructive part of the whole file)*

---

### Step 7.5 — Audit pass *(if run)*

**Lens(es) used:** Knuth / Clean Code / GoF

**Findings list:**

- `[file:line] — observation — disposition (blocker | backlog | wontfix)`

**Blockers resolved before closing the phase:** *(list)*

---

### Retrospective

One paragraph, honest:

- **What worked.**
- **What didn't.**
- **What I'd do differently next phase.**
- **What I'd change in the guide based on this run.**

---

## Keep reading

- The methodology itself → [03-working-with-ai.md](03-working-with-ai.md)
- The prompts to drive each step → [07-prompt-templates.md](07-prompt-templates.md)
- Your assignment's `PROCESS.md` uses the same shape — see [04-your-assignment.md](04-your-assignment.md)
