// The course map. Lessons are added here one at a time as they are built and reviewed.

export type Lesson = {
  slug: string;
  title: string;
};

export type Level = {
  number: number;
  slug: string;
  title: string;
  stage: "foundations" | "builder" | "professional" | "senior";
  lessons: Lesson[];
};

export const levels: Level[] = [
  {
    number: 1,
    slug: "level-01",
    title: "Web fundamentals",
    stage: "foundations",
    lessons: [
      { slug: "client-and-server", title: "Client and server" },
      { slug: "request-and-response", title: "Request and response" },
      { slug: "typing-a-url", title: "What happens when you type a URL" },
      { slug: "anatomy-of-a-url", title: "Anatomy of a URL" },
      { slug: "how-a-browser-draws-a-page", title: "How a browser draws a page" },
      { slug: "static-and-dynamic-sites", title: "Static and dynamic sites" },
      { slug: "the-command-line", title: "The command line" },
      { slug: "git-and-version-control", title: "Git and version control" },
    ],
  },
  { number: 2, slug: "level-02", title: "HTML", stage: "foundations", lessons: [] },
  { number: 3, slug: "level-03", title: "CSS", stage: "foundations", lessons: [] },
  { number: 4, slug: "level-04", title: "JavaScript core", stage: "foundations", lessons: [] },
  { number: 5, slug: "level-05", title: "JavaScript in the browser", stage: "foundations", lessons: [] },
  { number: 6, slug: "level-06", title: "Intermediate JavaScript", stage: "builder", lessons: [] },
  { number: 7, slug: "level-07", title: "Tooling", stage: "builder", lessons: [] },
  { number: 8, slug: "level-08", title: "Component-based UI", stage: "builder", lessons: [] },
  { number: 9, slug: "level-09", title: "Working with data", stage: "builder", lessons: [] },
  { number: 10, slug: "level-10", title: "Type safety", stage: "builder", lessons: [] },
  { number: 11, slug: "level-11", title: "Accessibility", stage: "professional", lessons: [] },
  { number: 12, slug: "level-12", title: "Testing", stage: "professional", lessons: [] },
  { number: 13, slug: "level-13", title: "Performance", stage: "professional", lessons: [] },
  { number: 14, slug: "level-14", title: "Rendering strategies", stage: "professional", lessons: [] },
  { number: 15, slug: "level-15", title: "Security", stage: "professional", lessons: [] },
  { number: 16, slug: "level-16", title: "Advanced browser and platform", stage: "professional", lessons: [] },
  { number: 17, slug: "level-17", title: "Architecture and design", stage: "senior", lessons: [] },
  { number: 18, slug: "level-18", title: "Production and operations", stage: "senior", lessons: [] },
  { number: 19, slug: "level-19", title: "Engineering leadership", stage: "senior", lessons: [] },
];

export function getLevel(slug: string) {
  return levels.find((level) => level.slug === slug);
}
