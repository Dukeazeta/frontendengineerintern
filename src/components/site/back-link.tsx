import Link from "next/link";
import styles from "./back-link.module.css";

// A quiet "back" link at the top of reading pages.
export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <div className={styles.bar}>
      <Link href={href} className={styles.back}>
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M13 8H3M7 4L3 8l4 4" />
        </svg>
        {label}
      </Link>
    </div>
  );
}
