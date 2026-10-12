import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Header } from "@/components/site/header";
import { Reveal } from "@/components/site/reveal";
import { getLevel, lessonHref, levels, sectionNumber } from "@/content/course";
import styles from "@/components/lesson/book.module.css";

// Chapter openers exist only for chapters that have sections planned.
export function generateStaticParams() {
  return levels.filter((level) => level.lessons.length > 0).map((level) => ({ chapter: level.slug }));
}

export async function generateMetadata({ params }: PageProps<"/learn/[chapter]">): Promise<Metadata> {
  const { chapter } = await params;
  const level = getLevel(chapter);
  if (!level) return {};
  return { title: `Chapter ${level.number}: ${level.title} · FrontendEngineerIntern`, description: level.summary };
}

export default function ChapterPage({ params }: PageProps<"/learn/[chapter]">) {
  return (
    <>
      <Header />
      <Suspense fallback={<main className={styles.page} />}>
        <Chapter params={params} />
      </Suspense>
    </>
  );
}

async function Chapter({ params }: { params: PageProps<"/learn/[chapter]">["params"] }) {
  const { chapter } = await params;
  const level = getLevel(chapter);
  if (!level || level.lessons.length === 0) notFound();

  return (
    <>
      <main className={styles.page}>
        <header className={styles.head}>
          <p className={styles.running}>
            <Link href="/learn">Contents</Link>
          </p>
          <p className={styles.number}>Chapter {level.number}</p>
          <Reveal as="h1" className={styles.title} text={level.title} />
          {level.summary ? <Reveal className={styles.chapterSummary} delay={120} text={level.summary} /> : null}
        </header>

        <ol className={styles.toc} aria-label={`Sections in chapter ${level.number}`}>
          {level.lessons.map((lesson, i) => (
            <li key={lesson.slug} className={styles.tocRow}>
              <span className={styles.tocNum}>{sectionNumber(level, i)}</span>
              {lesson.ready ? (
                <Link href={lessonHref(level.slug, lesson.slug)} className={styles.tocTitle}>
                  {lesson.title}
                </Link>
              ) : (
                <span className={styles.tocTitle}>{lesson.title}</span>
              )}
              {lesson.ready ? <span /> : <span className={styles.soon}>Coming soon</span>}
            </li>
          ))}
        </ol>
      </main>
    </>
  );
}
