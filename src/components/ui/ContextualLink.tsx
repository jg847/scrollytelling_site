import Link from "next/link";
import { url } from "@/lib/site-config";
import styles from "./ContextualLink.module.css";

export function ContextualLink({ href, children }: { href: string; children: React.ReactNode }) {
  if (href.startsWith("http://") || href.startsWith("https://")) {
    return (
      <a className={styles.link} href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link className={styles.link} href={url(href)}>
      {children}
    </Link>
  );
}