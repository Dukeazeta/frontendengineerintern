import Link from "next/link";
import { chapterHref, lessonHref, levels, sectionNumber, type Level } from "@/content/course";
import styles from "./roadmap.module.css";

const STAGES: { key: Level["stage"]; name: string }[] = [
  { key: "foundations", name: "Part 1 · Foundations" },
  { key: "builder", name: "Part 2 · Builder" },
  { key: "professional", name: "Part 3 · Professional" },
  { key: "senior", name: "Part 4 · Senior" },
];

const pad = (n: number) => String(n).padStart(2, "0");

function Tag({ state }: { state: "progress" | "ready" | "soon" }) {
  const text = { progress: "In progress", ready: "Ready", soon: "Coming soon" }[state];
  return (
    <span className={styles.tag} data-live={state === "soon" ? undefined : true}>
      {text}
    </span>
  );
}

function LevelRow({ level }: { level: Level }) {
  const open = level.lessons.length > 0;
  const head = (
    <>
      <span className={styles.num}>{pad(level.number)}</span>
      {level.lessons.length > 0 ? (
        <Link href={chapterHref(level.slug)} className={styles.title}>
          {level.title}
        </Link>
      ) : (
        <span className={styles.title}>{level.title}</span>
      )}
      <Tag state={open ? "progress" : "soon"} />
    </>
  );

  if (!open) {
    return (
      <li className={styles.level} id={level.slug}>
        <div className={styles.head}>{head}</div>
      </li>
    );
  }

  return (
    <li className={styles.level} id={level.slug}>
      <details className={styles.details} open>
        <summary className={styles.head}>
          {head}
          <svg className={styles.chev} viewBox="0 0 16 16" aria-hidden="true">
            <path d="M4 6l4 4 4-4" />
          </svg>
        </summary>
        <ol className={styles.lessons}>
          {level.lessons.map((lesson, i) => (
            <li key={lesson.slug} className={styles.lesson}>
              <span className={styles.lessonNum}>{sectionNumber(level, i)}</span>
              {lesson.ready ? (
                <Link href={lessonHref(level.slug, lesson.slug)} className={styles.lessonLink}>
                  {lesson.title}
                </Link>
              ) : (
                <span className={styles.lessonTitle}>{lesson.title}</span>
              )}
              <Tag state={lesson.ready ? "ready" : "soon"} />
            </li>
          ))}
        </ol>
        <p className={styles.note}>Sections open one at a time as they’re finished.</p>
      </details>
    </li>
  );
}

export function Roadmap() {
  return (
    <div className={styles.stages}>
      {STAGES.map((stage) => {
        const inStage = levels.filter((level) => level.stage === stage.key);
        const first = inStage[0].number;
        const last = inStage[inStage.length - 1].number;
        return (
          <section key={stage.key} className={styles.stage} aria-labelledby={`stage-${stage.key}`}>
            <div className={styles.label}>
              <h3 id={`stage-${stage.key}`} className={styles.stageName}>
                {stage.name}
              </h3>
              <p className={styles.range}>
                Chapters {first} to {last}
              </p>
            </div>
            <ol className={styles.levels}>
              {inStage.map((level) => (
                <LevelRow key={level.slug} level={level} />
              ))}
            </ol>
          </section>
        );
      })}
    </div>
  );
}
