import type { Metadata } from "next";
import { BackLink } from "@/components/site/back-link";
import { Header } from "@/components/site/header";
import { Reveal } from "@/components/site/reveal";
import { Roadmap } from "@/components/site/roadmap";
import styles from "@/components/lesson/book.module.css";

export const metadata: Metadata = {
  title: "Contents · FrontendEngineerIntern",
  description: "Nineteen chapters, from how the web works to how senior engineers think.",
};

export default function ContentsPage() {
  return (
    <>
      <Header />
      <BackLink href="/" label="Home" />
      <main className={styles.page}>
        <header className={styles.head}>
          <Reveal as="h1" className={styles.title} text="Contents" />
          <Reveal
            className={styles.chapterSummary}
            delay={120}
            text="Nineteen chapters in four parts, from how the web works to how senior engineers think."
          />
        </header>
        <div className={styles.contents}>
          <Roadmap />
        </div>
      </main>
    </>
  );
}
