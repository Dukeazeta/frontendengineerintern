import Link from "next/link";
import { HeroFigure } from "@/components/figures/hero/hero-figure";
import { Header } from "@/components/site/header";
import { Reveal } from "@/components/site/reveal";
import { Roadmap } from "@/components/site/roadmap";
import styles from "./landing.module.css";

const REPO = "https://github.com/Dukeazeta/frontendengineerintern";

const METHOD = [
  {
    title: "Read a short section",
    body: "Each section explains one idea in plain words, and every new term is defined where it first appears.",
  },
  {
    title: "See it working",
    body: "Interactive figures show each part of the idea as a machine you can switch on and try.",
  },
  {
    title: "Do the exercises",
    body: "Every section ends with exercises you answer from memory, with feedback straight away.",
  },
];

export default function Home() {
  return (
    <>
      <Header />

      <main id="top">
        <section className={styles.hero} aria-labelledby="hero-title">
          <Reveal as="h1" id="hero-title" className={styles.heroTitle} text="From zero to frontend engineer." />
          <Reveal
            className={styles.heroLead}
            delay={120}
            text="A free course that starts at your first web page and goes all the way to how senior engineers think, one small lesson at a time."
          />
          <div className={styles.actions}>
            <Link href="/learn/chapter-01/client-and-server" className={styles.cta}>
              Start reading
            </Link>
            <a href="#contents" className="text-link">
              See the contents
            </a>
          </div>
          <div className={styles.figure}>
            <HeroFigure />
          </div>
        </section>

        <section id="method" className={`${styles.section} ${styles.raised}`} aria-labelledby="method-title">
          <Reveal as="h2" id="method-title" className={styles.title} text="How the book works" />
          <Reveal className={styles.lead} text="Nineteen chapters, each made of short sections. Every section works the same way." />
          <ol className={styles.steps}>
            {METHOD.map((step, i) => (
              <li key={step.title} className={styles.step}>
                <span className={styles.stepNum}>{i + 1}</span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepBody}>{step.body}</p>
              </li>
            ))}
          </ol>
          <p className={styles.note}>No coding experience needed. Every section lists its sources, mostly MDN.</p>
        </section>

        <section id="contents" className={styles.section} aria-labelledby="contents-title">
          <Reveal as="h2" id="contents-title" className={styles.title} text="Contents" />
          <Reveal
            className={styles.lead}
            text="Nineteen chapters in four parts, from how the web works to how senior engineers think."
          />
          <Roadmap />
        </section>

      </main>

      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <a href={REPO} className={styles.github} target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57l-.02-2.04c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.31-5.47-1.34-5.47-5.94 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22l-.01 3.29c0 .31.21.69.82.57A12 12 0 0 0 12 .3" />
            </svg>
            Star on GitHub
          </a>
          <a href="https://dukedev.space" className="text-link" target="_blank" rel="noopener noreferrer">
            Built by Duke Azeta
          </a>
        </div>
        <p className={styles.footerLine}>
          Open source. Code under{" "}
          <a href={`${REPO}/blob/main/LICENSE`} className="text-link">
            MIT
          </a>
          , lessons under{" "}
          <a href={`${REPO}/blob/main/LICENSE-CONTENT.md`} className="text-link">
            CC BY-NC-SA 4.0
          </a>
          .
        </p>
      </footer>
    </>
  );
}
