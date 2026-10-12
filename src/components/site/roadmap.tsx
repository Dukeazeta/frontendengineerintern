import { levels, type Level } from "@/content/course";
import styles from "./roadmap.module.css";

const STAGES: { key: Level["stage"]; name: string }[] = [
  { key: "foundations", name: "Foundations" },
  { key: "builder", name: "Builder" },
  { key: "professional", name: "Professional" },
  { key: "senior", name: "Senior" },
];

// Lessons go live one at a time; until then every lesson is marked coming soon.
const LIVE_LESSONS = new Set<string>();

const pad = (n: number) => String(n).padStart(2, "0");

function Tag({ live }: { live: boolean }) {
  return <span className={styles.tag} data-live={live || undefined}>{live ? "In progress" : "Coming soon"}</span>;
}

function LevelRow({ level }: { level: Level }) {
  const open = level.lessons.length > 0;
  const head = (
    <>
      <span className={styles.num}>{pad(level.number)}</span>
      <span className={styles.title}>{level.title}</span>
      <Tag live={open} />
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
              <span className={styles.lessonNum}>
                {level.number}.{i + 1}
              </span>
              <span className={styles.lessonTitle}>{lesson.title}</span>
              <Tag live={LIVE_LESSONS.has(`${level.slug}/${lesson.slug}`)} />
            </li>
          ))}
        </ol>
        <p className={styles.note}>Lessons open one at a time as they’re finished.</p>
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
                Levels {first} to {last}
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
