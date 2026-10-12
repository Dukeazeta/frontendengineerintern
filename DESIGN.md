---
name: FrontendEngineerIntern
description: A centred, text-first course page in one weight of PP Neue Montreal on a cool off-white canvas, where interactive isometric figures are the only imagery.
colors:
  canvas: "#f2f2f4"
  surface: "#fdfdfd"
  ink: "#0f1012"
  ink-strong: "#020201"
  ink-muted: "#5e5e5e"
  ink-faint: "#8f8f8f"
  signal: "#0071e3"
  hairline: "rgba(0, 0, 0, 0.06)"
  hairline-strong: "rgba(0, 0, 0, 0.12)"
  tint: "rgba(12, 13, 15, 0.05)"
  tint-hover: "rgba(12, 13, 15, 0.09)"
typography:
  display:
    fontFamily: "PP Neue Montreal, Inter, system-ui, sans-serif"
    fontSize: "clamp(3rem, 1.8rem + 4.6vw, 5.25rem)"
    fontWeight: 350
    lineHeight: 0.98
    letterSpacing: "-0.035em"
    fontFeature: "\"ss01\", \"ss02\""
  headline:
    fontFamily: "PP Neue Montreal, Inter, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 1.5rem + 3vw, 3.75rem)"
    fontWeight: 350
    lineHeight: 1.02
    letterSpacing: "-0.03em"
    fontFeature: "\"ss01\", \"ss02\""
  title:
    fontFamily: "PP Neue Montreal, Inter, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 1.3rem + 0.8vw, 1.875rem)"
    fontWeight: 350
    lineHeight: 1.15
    letterSpacing: "-0.025em"
    fontFeature: "\"ss01\", \"ss02\""
  lead:
    fontFamily: "PP Neue Montreal, Inter, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 1.1rem + 0.6vw, 1.625rem)"
    fontWeight: 350
    lineHeight: 1.35
    letterSpacing: "-0.02em"
    fontFeature: "\"ss01\", \"ss02\""
  lead-section:
    fontFamily: "PP Neue Montreal, Inter, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem)"
    fontWeight: 350
    lineHeight: 1.35
    letterSpacing: "-0.02em"
    fontFeature: "\"ss01\", \"ss02\""
  row:
    fontFamily: "PP Neue Montreal, Inter, system-ui, sans-serif"
    fontSize: "clamp(1.1875rem, 1.1rem + 0.35vw, 1.375rem)"
    fontWeight: 350
    lineHeight: 1.25
    letterSpacing: "-0.02em"
    fontFeature: "\"ss01\", \"ss02\""
  reading:
    fontFamily: "PP Neue Montreal, Inter, system-ui, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 350
    lineHeight: 1.45
    letterSpacing: "-0.02em"
    fontFeature: "\"ss01\", \"ss02\""
  action:
    fontFamily: "PP Neue Montreal, Inter, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 350
    lineHeight: 1.2
    letterSpacing: "-0.02em"
    fontFeature: "\"ss01\", \"ss02\""
  body:
    fontFamily: "PP Neue Montreal, Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 350
    lineHeight: 1.2
    letterSpacing: "-0.02em"
    fontFeature: "\"ss01\", \"ss02\""
  meta:
    fontFamily: "PP Neue Montreal, Inter, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 350
    lineHeight: 1.2
    letterSpacing: "-0.02em"
    fontFeature: "\"ss01\", \"ss02\""
  label:
    fontFamily: "PP Neue Montreal, Inter, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 350
    lineHeight: 1.2
    letterSpacing: "-0.02em"
    fontFeature: "\"ss01\", \"ss02\""
rounded:
  button: "26px"
  pill: "9999px"
spacing:
  gutter: "clamp(1rem, 0.55rem + 1.9vw, 2.125rem)"
  section: "clamp(5.5rem, 3.5rem + 7vw, 9.5rem)"
  column: "1200px"
  figure: "68rem"
  list: "44rem"
  steps: "38rem"
  row-min: "3.75rem"
components:
  button-primary:
    backgroundColor: "{colors.tint}"
    textColor: "{colors.ink-strong}"
    typography: "{typography.action}"
    rounded: "{rounded.button}"
    padding: "0 1.5rem"
    height: "3rem"
  button-primary-hover:
    backgroundColor: "{colors.tint-hover}"
    textColor: "{colors.ink-strong}"
  button-github:
    backgroundColor: "{colors.tint}"
    textColor: "{colors.ink-strong}"
    typography: "{typography.action}"
    rounded: "{rounded.pill}"
    padding: "0 1.25rem 0 1rem"
    height: "2.75rem"
  button-github-hover:
    backgroundColor: "{colors.tint-hover}"
  text-link:
    textColor: "{colors.signal}"
    typography: "{typography.action}"
  nav-link:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
  nav-link-hover:
    textColor: "{colors.ink-muted}"
  status-tag:
    textColor: "{colors.ink-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 0.625rem"
    height: "1.375rem"
  status-tag-live:
    textColor: "{colors.signal}"
  step-numeral:
    textColor: "{colors.signal}"
    rounded: "{rounded.pill}"
    size: "1.75rem"
  switch-toggle:
    textColor: "{colors.ink-muted}"
    typography: "{typography.meta}"
    rounded: "{rounded.pill}"
    padding: "0 1.125rem 0 0.875rem"
    height: "2.75rem"
  switch-toggle-on:
    textColor: "{colors.ink}"
---

# Design System: FrontendEngineerIntern

## Overview

**Creative North Star: "Set Type, Working Machines"**

The course runs on the Augen Pro system from Refero, carried over through Duke Azeta's portfolio: one face at one weight (PP Neue Montreal Book, 350, with ss01 and ss02 on), a cool off-white canvas, near-black ink, one Signal Blue that only ever draws text and thin outlines, 0.5px hairlines instead of shadows, and a lot of empty space. Words carry the page.

The layout is the owner's own, not augen.pro's page structure. Everything sits on a centred axis: headline, lead, actions and figure stack down the middle, and long lists (the method steps, the roadmap) sit in narrow centred columns. Type runs a step larger than the Refero ramp, so a page reads calm and big rather than dense. Sections alternate between canvas and surface, which is the only way a page changes tone. There are no cards, no coloured bands and no chips.

Lessons need to show ideas, so the only imagery is the interactive isometric figures made with the anatomy skill. Each figure is a machine the reader can switch on. Around them, the interface stays flat and text-first. Headings and leads resolve from blur word by word as they come into view; that is the one entrance move.

**Key Characteristics:**
- One weight (350) of one face for everything, nothing bolder.
- Centred axis, big type, narrow centred lists.
- Canvas and surface alternate by section; nothing else carries colour.
- Signal Blue as link text and 0.5px outlines only.
- 0.5px hairlines and inset rings; no shadows.
- Anatomy figures are the only pictures.
- Blur-in word reveal on headings and leads.

## Colors

A near-monochrome cool grey palette with a single blue that behaves like ink, never like paint.

### Primary
- **Signal Blue** (signal): text links (with a faint 0.5px underline that firms up on hover), focus outlines (1px, 3px offset), the step numeral ring and the "In progress" status ring. Inside a figure it marks the one live part the figure is about.

### Neutral
- **Cool Canvas** (canvas): the page background and every section that is not raised. Also the theme colour.
- **Paper Surface** (surface): raised sections (the method section on the landing page), selection text, and the figure's screens and faces.
- **Ink** (ink): headlines, body text, nav links, the brand name.
- **Deep Ink** (ink-strong): label text inside the tinted pills.
- **Steel Gray** (ink-muted): leads, step bodies, numbers, meta lines, unpressed toggles and "Coming soon" tags. Measures 5.8:1 on canvas.
- **Faint Gray** (ink-faint): decorative only, currently the scrollbar thumb. Never for text (2.9:1 on canvas).
- **Hairline** (hairline): the footer top rule and lesson row dividers inside an open level.
- **Strong Hairline** (hairline-strong): step dividers, roadmap level dividers, and the ring of neutral tags and toggles.
- **Pill Tint** (tint) and **Pill Tint Hover** (tint-hover): the only filled shapes in the interface, used for the primary action and the GitHub star pill.

### Named Rules
**The Signal Is Never a Fill Rule.** In the interface, Signal Blue is text colour, a 0.5px ring or a focus outline. It never fills a button, tag, section or block. The one exception lives inside a figure, where a depicted interface part (Fig 0's clicked button) may be filled blue because the figure is showing a real page.

**The Two Grounds Rule.** A page changes tone only by switching a whole section between canvas and surface. No coloured bands, dark bands or gradient backgrounds.

**The Inverted Selection Rule.** Selected text is an ink background with surface text.

**The Figure Palette Rule.** Figures use the anatomy kit's light theme cooled to the canvas: page and card on canvas, faces and tops on surface, four cool shades (#d9d9de to #f2f2f5) for volume, ink steps for edges and text. Signal Blue may mark the one moving or active part. No other hue enters a figure unless the concept needs it, and then it is recorded here.

## Typography

**Display Font:** PP Neue Montreal Book (with Inter, system-ui)
**Body Font:** PP Neue Montreal Book (with Inter, system-ui)

**Character:** A single neo-grotesk at a light book weight, tracked tight. Hierarchy comes from size and colour alone, so the big steps do all the work.

### Hierarchy
- **Display** (350, 3rem to 5.25rem fluid, 0.98, -0.035em): the one page headline, balanced, held to about 12 characters per line so it breaks into two lines.
- **Headline** (350, 2.25rem to 3.75rem fluid, 1.02, -0.03em): section titles.
- **Title** (350, 1.5rem to 1.875rem fluid, 1.15, -0.025em): step titles and other item headings inside a section.
- **Lead** (350, 1.25rem to 1.625rem fluid, 1.35): the hero lead in Steel Gray, about 42ch. Section leads use the slightly smaller **Lead Section** step (up to 1.5rem, about 32ch).
- **Row** (350, 1.1875rem to 1.375rem fluid, 1.25): roadmap level names.
- **Reading** (350, 1.1875rem, 1.45): short explanatory paragraphs in Steel Gray, about 34ch, `text-wrap: pretty`.
- **Action** (350, 1.0625rem): button and link labels in action rows, lesson titles.
- **Body** (350, 1rem, 1.2): header, footer and notes.
- **Meta** (350, 0.9375rem): stage labels, level numbers, switch labels, the licence line.
- **Label** (350, 0.75rem): status tags and lesson numbers. Numbers use tabular figures.

### Named Rules
**The One Weight Rule.** Everything is set at 350. No bold, no italic, no weight above 400; `font-synthesis: none` stays on.

**The Step Larger Rule.** The landing ramp sits one step above the Refero ramp (hero to 5.25rem, section titles to 3.75rem, leads to 1.625rem, step titles to 1.875rem). New pages start from these sizes, not the smaller Refero ones.

**The Blur-In Rule.** Headings and leads arrive word by word from a 10px blur (1.1s per word, 38ms stagger, 0.12em rise) when they enter the viewport. Text renders fully visible until the script arms it, and nothing moves under prefers-reduced-motion.

## Layout

A centred axis inside a 1200px column with the fluid gutter (1rem to 2.125rem). The header is a plain row: brand name left, two ink links right, 2.125rem from the top; below 30rem the first link drops. Sections are full-bleed bands with generous vertical padding (5.5rem to 9.5rem) and centred text. Content inside a section narrows by job: the figure up to 68rem (also capped by viewport height so the figure's screen shows above the fold), the roadmap list 44rem, the step list 38rem.

Lists inside the centred axis are left-aligned rows (the roadmap's number, name and tag grid) or centred stacks (the method steps). Rows have a 3.75rem minimum height. At 48rem the roadmap grid tightens and lesson rows lose their indent; at 40rem the figure scales past its frame (122%) so the machine stays legible on a 390px phone.

Rhythm runs from small fixed gaps inside components (0.5rem to 1rem) to fluid gaps between blocks (1.25rem leads, 1.75rem to 2.25rem actions, 3rem to 5.5rem before lists).

## Elevation & Depth

Flat. The interface has no drop shadows, no ambient shadows and no gradients. Boundaries are 0.5px hairlines, drawn either as borders or as inset 0.5px rings (`box-shadow: inset 0 0 0 0.5px ...`), which read as outlines, not depth. Tone shifts come from canvas against surface and from the 5% ink tint of the pills. Figures are the one place with volume: the anatomy kit's four-tone shading gives parts their mass, but the figure plate itself is transparent and frameless on the canvas.

### Named Rules
**The Hairline Rule.** Every edge is 0.5px. If a boundary needs more weight, move it to hairline-strong, not to a thicker line or a shadow.

## Shapes

Two shapes: straight hairline rules that divide lists, and full pills. The primary action uses a 26px radius on a 3rem tall pill, which reads as a full capsule; tags, toggles, the GitHub pill and step numerals use a full 9999px radius. There are no rectangles with soft corners, because there are no cards.

## Components

### Buttons
Quiet, tinted capsules with deep ink labels.
- **Shape:** capsule (26px radius on the primary, full pill on the GitHub pill).
- **Primary:** Pill Tint background, Deep Ink label, 3rem tall, 1.5rem side padding.
- **Hover / Focus:** background deepens to Pill Tint Hover over 300ms; focus is the global 1px Signal Blue outline at 3px offset.
- **GitHub star pill:** same tint and hover, 2.75rem tall, with the GitHub mark at 1.125rem before the label.
- **Text link (secondary):** Signal Blue text beside the pill, 0.5px underline at 35% strength that turns solid on hover.

### Status tags
Small outlined pills that say where a level or lesson stands. They are status, not decoration.
- **Style:** transparent, 0.5px hairline-strong ring, Steel Gray label text, 1.375rem tall.
- **State:** "In progress" switches the ring and label to Signal Blue; "Coming soon" stays neutral.

### Navigation
Plain ink text links, 1rem, no underline, fading to Steel Gray on hover. No pill nav, no scroll pill, no sticky bar.

### Method steps
A centred stack between hairline-strong rules: a 1.75rem Signal Blue ring numeral, a Title step heading, a Steel Gray Reading paragraph.

### Roadmap
Stages labelled by name and level range in Meta, each followed by a list of level rows on hairline-strong dividers: number, Row name, status tag. An open level is a native disclosure with a thin chevron that turns 180 degrees, listing its lessons on lighter hairlines with Label numbers.

### Figure (signature)
An anatomy-skill isometric SVG on a transparent plate, with the kit's four plate corners (figure number, title, hint, live readout) in 0.6875rem figure-muted grey (#6b6b6b, 4.8:1 on canvas), the readout in ink. It focuses in from an 18px blur over 1.6s on load. Its controls are mirrored as real buttons underneath: **switch toggles** are 2.75rem pills with a hairline-strong ring and Steel Gray label; pressed, the ring turns Signal Blue, the label Ink and the dot fills Ink. Keyboard shortcuts and a polite live region come with every figure; with reduced motion the figure is static and still readable.

## Do's and Don'ts

### Do:
- **Do** set every piece of text in PP Neue Montreal at 350 with ss01 and ss02 on.
- **Do** centre the page's axis and keep lists in narrow centred columns (44rem for long lists, 38rem for stacks).
- **Do** start type from the step-larger ramp: display up to 5.25rem, section titles up to 3.75rem, leads up to 1.625rem.
- **Do** alternate whole sections between canvas (#f2f2f4) and surface (#fdfdfd).
- **Do** use the tinted capsule for the one primary action on a view, with a Signal Blue text link beside it for the secondary.
- **Do** draw edges as 0.5px hairlines or inset 0.5px rings.
- **Do** reveal headings and leads word by word from blur, and gate every animation behind prefers-reduced-motion.
- **Do** keep one anatomy figure per lesson, in the light theme cooled to the canvas.
- **Do** write copy plainly, run it through the humanizer, and never use em dashes.

### Don't:
- **Don't** use weights above 400, bold or italic.
- **Don't** fill any interface element with Signal Blue.
- **Don't** set text in Faint Gray (#8f8f8f).
- **Don't** add drop shadows, glows or gradients to the interface.
- **Don't** use cards, coloured or dark bands, or decorative chips; status tags and figure toggles are the only small pills.
- **Don't** copy augen.pro's page structure: no pill nav, scroll pill or two-line label columns.
- **Don't** add stock illustration, photos or ornamental icons. Functional marks (the disclosure chevron, the GitHub mark) are fine; the anatomy figures are the only pictures.
