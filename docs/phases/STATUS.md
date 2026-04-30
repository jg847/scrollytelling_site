# Scrolly — Implementation status

Single source of truth for phase state. Update on every phase completion.

| Phase | Title | Status | Notes |
|---|---|---|---|
| 00 | Scaffold | ✅ done | Next.js 16 + static export config + Actions workflow stub + assets copied |
| 01 | Design system foundation | ⏳ pending | — |
| 02 | Content pipeline | ⏳ pending | — |
| 03 | Shared shell + markdown renderer | ⏳ pending | — |
| 04 | Motion primitives | ⏳ pending | — |
| 05 | Continuous scrollytelling layout | 🔨 in-progress | Legacy presentation mode is still implemented, but the shipped ocean path now runs through the standard narrative shell |
| 06 | Visualizations | ⏳ pending | — |
| 07 | CI + deploy hardening | 🔨 in-progress | Local workflow hardening and local Lighthouse sampling are complete; live GitHub Pages verification is still pending |
| 08 | Ocean content pass | 🔨 in-progress | Content, accessibility coverage, and orphan-asset cleanup are complete locally; homepage performance and live deploy verification remain |

## Legend

- ⏳ pending — not started
- 🔨 in-progress — actively being implemented
- ✅ done — exit checks passed
- ⚠️ blocked — see phase file for details

## Last updated

Locally, phases 05, 07, and 08 all have meaningful implementation progress reflected in the repo. The remaining tracker work is now mostly closeout: live deploy verification, homepage performance follow-up, and final disposition of any secondary legacy paths.
