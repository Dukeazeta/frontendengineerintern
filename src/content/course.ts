// The book map: each level is a chapter and each lesson a numbered section.
// Sections are added here one at a time as they are built and reviewed.

export type Lesson = {
  slug: string;
  title: string;
  /** True once the lesson is written, reviewed and published. */
  ready?: boolean;
};

export type Level = {
  number: number;
  slug: string;
  title: string;
  stage: "foundations" | "builder" | "professional" | "senior";
  /** One or two sentences for the chapter opener. */
  summary?: string;
  lessons: Lesson[];
};

export const levels: Level[] = [
  {
    number: 1,
    slug: "chapter-01",
    title: "Web fundamentals",
    stage: "foundations",
    summary:
      "What happens between typing an address and seeing a page: the computers involved, how they talk, and the tools you will use every day to build for them.",
    lessons: [
      { slug: "client-and-server", title: "Client and server", ready: true },
      { slug: "request-and-response", title: "Request and response" },
      { slug: "typing-a-url", title: "What happens when you type a URL" },
      { slug: "anatomy-of-a-url", title: "Anatomy of a URL" },
      { slug: "how-a-browser-draws-a-page", title: "How a browser draws a page" },
      { slug: "static-and-dynamic-sites", title: "Static and dynamic sites" },
      { slug: "the-command-line", title: "The command line" },
      { slug: "git-and-version-control", title: "Git and version control" },
    ],
  },
  { number: 2, slug: "chapter-02", title: "HTML", stage: "foundations", lessons: [] },
  { number: 3, slug: "chapter-03", title: "CSS", stage: "foundations", lessons: [] },
  { number: 4, slug: "chapter-04", title: "JavaScript core", stage: "foundations", lessons: [] },
  { number: 5, slug: "chapter-05", title: "JavaScript in the browser", stage: "foundations", lessons: [] },
  { number: 6, slug: "chapter-06", title: "Intermediate JavaScript", stage: "builder", lessons: [] },
  { number: 7, slug: "chapter-07", title: "Tooling", stage: "builder", lessons: [] },
  { number: 8, slug: "chapter-08", title: "Component-based UI", stage: "builder", lessons: [] },
  { number: 9, slug: "chapter-09", title: "Working with data", stage: "builder", lessons: [] },
  { number: 10, slug: "chapter-10", title: "Type safety", stage: "builder", lessons: [] },
  { number: 11, slug: "chapter-11", title: "Accessibility", stage: "professional", lessons: [] },
  { number: 12, slug: "chapter-12", title: "Testing", stage: "professional", lessons: [] },
  { number: 13, slug: "chapter-13", title: "Performance", stage: "professional", lessons: [] },
  { number: 14, slug: "chapter-14", title: "Rendering strategies", stage: "professional", lessons: [] },
  { number: 15, slug: "chapter-15", title: "Security", stage: "professional", lessons: [] },
  { number: 16, slug: "chapter-16", title: "Advanced browser and platform", stage: "professional", lessons: [] },
  { number: 17, slug: "chapter-17", title: "Architecture and design", stage: "senior", lessons: [] },
  { number: 18, slug: "chapter-18", title: "Production and operations", stage: "senior", lessons: [] },
  { number: 19, slug: "chapter-19", title: "Engineering leadership", stage: "senior", lessons: [] },
];

export function getLevel(slug: string) {
  return levels.find((level) => level.slug === slug);
}

export function findLesson(levelSlug: string, lessonSlug: string) {
  const level = getLevel(levelSlug);
  if (!level) return undefined;
  const index = level.lessons.findIndex((lesson) => lesson.slug === lessonSlug);
  if (index < 0) return undefined;
  return { level, lesson: level.lessons[index], index, next: level.lessons[index + 1] };
}

export function readyLessons() {
  return levels.flatMap((level) =>
    level.lessons.filter((lesson) => lesson.ready).map((lesson) => ({ level: level.slug, lesson: lesson.slug })),
  );
}

export const lessonHref = (levelSlug: string, lessonSlug: string) => `/learn/${levelSlug}/${lessonSlug}`;
export const chapterHref = (levelSlug: string) => `/learn/${levelSlug}`;
export const sectionNumber = (level: Level, index: number) => `${level.number}.${index + 1}`;
