// Every published section, imported statically so the bundler sees each one and its figures.
// Add a line here when a section in course.ts is marked ready.
import type { ComponentType } from "react";
import * as clientAndServer from "./chapter-01/client-and-server.mdx";

export type SectionModule = {
  default: ComponentType;
  meta: { title: string; lead: string; sources: { label: string; href: string; note: string }[] };
};

export const SECTIONS: Record<string, SectionModule> = {
  "chapter-01/client-and-server": clientAndServer as unknown as SectionModule,
};
