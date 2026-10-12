---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: []
---

# Landing page (/)

Scope: the public landing page. Mode: Persuade.

Audience: absolute beginners who want to become frontend engineers. Job: understand what the course is and see the whole roadmap. Action: browse the 19 levels (Level 1 open, its lessons listed). Proof: Fig 0 demonstrates a real concept working; the roadmap shows exactly what exists and what is coming soon. No learner numbers, quotes or results exist.

Constraints (owner, 2026-10-12): use the Augen Pro design system from Refero (https://styles.refero.design/style/0f7da1b2-9d06-4ef5-b5a8-ef7f92e57ab2) but our own layout. An earlier build that copied augen.pro's page layout was rejected as too literal: no pill nav, chips, scroll pill, two-line label columns, dark or blue bands. Most things centred, text a step larger than usual, minimal. Keep: blur-in text reveal, calm spacing, object-led centred hero with the anatomy figure. Unbuilt levels and lessons carry Coming soon. Credit Duke Azeta with a link to dukedev.space. Sign-in waits for OAuth keys.

## Direction contract

THESIS: A quiet, centred course page where the only picture is a working machine. Refuses both the feature-card grid and a copy of augen.pro's own page structure.

OWN-WORLD: Canvas #f2f2f4 alternating with #fdfdfd sections, ink #0f1012, Steel Gray #5e5e5e for leads, Signal Blue only as text links and 0.5px outlines (step numerals, In progress tags). PP Neue Montreal 350 only, sizes a step above the Refero ramp. 0.5px hairlines, the 26px tinted pill for the primary action and the GitHub star pill. No shadows, no fills of blue.

STORY: The visitor reads one promise, sees a page being built by three switches, learns the four steps every lesson follows, scans the 19-level roadmap with Level 1's lessons listed, and sees who builds it, where to star the repo, and the licences.

FIRST VIEWPORT: Plain header row (name left, two links right). Centred: headline at up to 5.25rem over two lines, a two-line muted lead, the tinted See the roadmap pill beside a How a lesson works text link, then Fig 0 centred directly below, up to 68rem wide, with the page on its screen visible above the fold on a 1440 by 900 screen and the switch deck just below; three named HTML, CSS and JavaScript toggles sit under the figure.

FORM: Owner-directed centred layout on the Refero Augen Pro system (seed key 2a3fbb2d; rolled structures and the pinned augen.pro page layout both superseded).

Signature interaction: Fig 0's switches build the page (HTML stack, CSS layout, JavaScript click). Headings and leads resolve from blur word by word as they enter view.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
