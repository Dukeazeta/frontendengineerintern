import Link from "next/link";
import styles from "./header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.name}>
        FrontendEngineerIntern
      </Link>
      <nav aria-label="Main" className={styles.links}>
        <Link href="/#method">How it works</Link>
        <Link href="/learn">Contents</Link>
      </nav>
    </header>
  );
}
