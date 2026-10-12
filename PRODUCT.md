# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router, TypeScript), pnpm. Turso (libSQL) with Drizzle ORM stores learner data only: lesson progress, quiz attempts and the spaced review schedule. Better Auth handles optional Google and GitHub sign-in. Lessons are MDX files in `src/content/`. Lesson figures are interactive isometric SVG React components made with the anatomy skill. Hosted on Vercel.

## Users

People learning frontend engineering from absolute zero, with no programming background, who want to get hired as a frontend intern and keep growing from there. Usually studying a few hours a week, on a laptop or a phone.

## Product Purpose

A self-paced course that follows a 19-level roadmap, from how the web works to senior engineering practice. Success is a learner who can do real frontend work and pass an intern interview, not one who has scrolled through pages.

## Positioning

A book you can poke: each level is a chapter and each lesson a short numbered section, written as plain technical prose with interactive figures that show each idea working as a machine, and exercises answered from memory at the end. Later sections add code checked in the page.

## Operating Context

Lessons are written once, reviewed by hand and revisited during review. The course is built one level and one lesson at a time, with the owner reviewing each before the next. `RESOURCES.md` lists the sources lessons cite. `MISSION.md` keeps lessons tied to the goal.

## Capabilities and Constraints

- 19 levels, each with its own lessons. Lessons are added to `src/content/course.ts` as they are built.
- Progress is kept in the browser and synced to the database once a learner signs in. Sign-in is optional.
- A section can carry several anatomy figures. Figures are slow to generate, so they are built one at a time.
- Code exercises (editor, sandboxed preview, hidden tests) start at Level 2.
- No AI tutor until several levels exist.
- Public and open source. Code MIT, lessons CC BY-NC-SA 4.0.

## Brand Commitments

- Name: FrontendEngineerIntern.
- Design system: the owner's portfolio system (Duke Azeta, Augen Pro reference on Refero), recorded in DESIGN.md. PP Neue Montreal used with permission.
- Voice: plain, direct, encouraging without hype. All copy passes the humanizer skill. No em dashes.

## Evidence on Hand

No learners, results, testimonials or metrics exist yet. Never invent progress, scores, learner counts or quotes.

## Product Principles

1. Assume zero prior knowledge. Define every new word the first time it appears.
2. Read like a book: numbered sections, numbered figures, sources as notes. Analogies only in passing, never as boxes.
3. One idea per lesson, one win per lesson.
4. Show the concept working. The figure should make the idea obvious before the words do.
5. Retrieval beats rereading: quizzes from memory, spaced review.
