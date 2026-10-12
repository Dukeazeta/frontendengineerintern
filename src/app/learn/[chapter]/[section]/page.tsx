import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Header } from "@/components/site/header";
import { Reveal } from "@/components/site/reveal";
import { chapterHref, findLesson, lessonHref, readyLessons, sectionNumber } from "@/content/course";
import { SECTIONS } from "@/content/lessons";
import styles from "@/components/lesson/book.module.css";

const REPO = "https://github.com/Dukeazeta/frontendengineerintern";

export function generateStaticParams() {
  return readyLessons().map(({ level, lesson }) => ({ chapter: level, section: lesson }));
}

async function load(chapter: string, section: string) {
  const entry = findLesson(chapter, section);
  const mod = SECTIONS[`${chapter}/${section}`];
  if (!entry?.lesson.ready || !mod) return null;
  return { ...entry, mod };
}

export async function generateMetadata({ params }: PageProps<"/learn/[chapter]/[section]">): Promise<Metadata> {
  const { chapter, section } = await params;
  const found = await load(chapter, section);
  if (!found) return {};
  return {
    title: `${sectionNumber(found.level, found.index)} ${found.mod.meta.title} · FrontendEngineerIntern`,
    description: found.mod.meta.lead,
  };
}

export default function SectionPage({ params }: PageProps<"/learn/[chapter]/[section]">) {
  return (
    <Suspense fallback={<main className={styles.page} />}>
      <Section params={params} />
    </Suspense>
  );
}

async function Section({ params }: { params: PageProps<"/learn/[chapter]/[section]">["params"] }) {
  const { chapter, section } = await params;
  const found = await load(chapter, section);
  if (!found) notFound();
  const { mod, index, next, level } = found;
  const Content = mod.default;
  const prev = index > 0 ? level.lessons[index - 1] : null;

  return (
    <>
      <Header
        trail={[
          { label: `Chapter ${level.number} · ${level.title}`, href: chapterHref(level.slug) },
          { label: `${sectionNumber(level, index)} ${mod.meta.title}`, href: lessonHref(level.slug, level.lessons[index].slug) },
        ]}
      />
      <main className={styles.page}>
        <header className={styles.head}>
          <p className={styles.number}>{sectionNumber(level, index)}</p>
          <Reveal as="h1" className={styles.title} text={mod.meta.title} />
          <Reveal className={styles.lead} delay={120} text={mod.meta.lead} />
        </header>

        <article className={styles.prose}>
          <Content />
        </article>

        <footer className={styles.end}>
          <h2 className={styles.endTitle}>Sources</h2>
          <ol className={styles.sources}>
            {mod.meta.sources.map((source, i) => (
              <li key={source.href} id={`source-${i + 1}`}>
                <span className={styles.sourceNum}>{i + 1}</span>
                <span>
                  <a href={source.href} className="text-link" target="_blank" rel="noopener noreferrer">
                    {source.label}
                  </a>
                  <span className={styles.sourceNote}>{source.note}</span>
                </span>
              </li>
            ))}
          </ol>
          <p className={styles.ask}>
            Something still unclear?{" "}
            <a href={`${REPO}/issues/new`} className="text-link" target="_blank" rel="noopener noreferrer">
              Ask a question on GitHub
            </a>
            .
          </p>

          <nav className={styles.turns} aria-label="Page turns">
            {prev?.ready ? (
              <Link href={lessonHref(level.slug, prev.slug)} className={styles.turn} data-side="prev">
                <span className={styles.turnLabel}>Previous</span>
                <span className={styles.turnTitle}>
                  {sectionNumber(level, index - 1)} {prev.title}
                </span>
              </Link>
            ) : (
              <Link href={chapterHref(level.slug)} className={styles.turn} data-side="prev">
                <span className={styles.turnLabel}>Previous</span>
                <span className={styles.turnTitle}>Chapter {level.number} contents</span>
              </Link>
            )}
            {next ? (
              next.ready ? (
                <Link href={lessonHref(level.slug, next.slug)} className={styles.turn} data-side="next">
                  <span className={styles.turnLabel}>Next</span>
                  <span className={styles.turnTitle}>
                    {sectionNumber(level, index + 1)} {next.title}
                  </span>
                </Link>
              ) : (
                <div className={styles.turn} data-side="next">
                  <span className={styles.turnLabel}>Next</span>
                  <span className={styles.turnTitle}>
                    {sectionNumber(level, index + 1)} {next.title}
                  </span>
                  <span className={styles.soon}>Coming soon</span>
                </div>
              )
            ) : (
              <span />
            )}
          </nav>
        </footer>
      </main>
    </>
  );
}
