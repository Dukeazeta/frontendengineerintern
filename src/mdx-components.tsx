import type { MDXComponents } from "mdx/types";

// Lesson-wide MDX overrides live here. Lesson components (quizzes, figures)
// are imported directly by each lesson file.
const components: MDXComponents = {};

export function useMDXComponents(): MDXComponents {
  return components;
}
