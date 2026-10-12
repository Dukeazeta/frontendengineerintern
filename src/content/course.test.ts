import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { levels, readyLessons } from "./course";

describe("course map", () => {
  it("has 19 levels numbered in order", () => {
    expect(levels.map((level) => level.number)).toEqual(Array.from({ length: 19 }, (_, i) => i + 1));
  });

  it("uses unique lesson slugs inside each level", () => {
    for (const level of levels) {
      const slugs = level.lessons.map((lesson) => lesson.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });

  it("has an MDX file for every ready lesson", () => {
    for (const { level, lesson } of readyLessons()) {
      expect(existsSync(join(__dirname, "lessons", level, `${lesson}.mdx`))).toBe(true);
    }
  });
});
