import Link from "next/link";
import styles from "./header.module.css";

type Crumb = { label: string; href: string };

// Site header. On reading pages it shows where you are (chapter, section) instead of site links.
export function Header({ trail }: { trail?: Crumb[] }) {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.name}>
        FrontendEngineerIntern
      </Link>
      {trail ? (
        <nav aria-label="You are here" className={styles.trail}>
          {trail.map((crumb, i) => (
            <Link key={crumb.href} href={crumb.href} aria-current={i === trail.length - 1 ? "page" : undefined}>
              {crumb.label}
            </Link>
          ))}
        </nav>
      ) : (
        <nav aria-label="Main" className={styles.links}>
          <Link href="/#method">How it works</Link>
          <Link href="/learn">Contents</Link>
        </nav>
      )}
    </header>
  );
}
