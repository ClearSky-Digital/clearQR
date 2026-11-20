import Link from "next/link";
import { readyGuides } from "../lib/pages";

/** A link to another guide. The guide's own words show as a link only when that guide has real copy; otherwise as plain text. */
export function GL({ slug, children }: { slug: string; children: React.ReactNode }) {
  const ready = readyGuides().some((g) => g.slug === slug);
  return ready ? <Link href={`/${slug}/`}>{children}</Link> : <>{children}</>;
}

/** A link into the generator, which is always there. */
export function AppLink({ children }: { children: React.ReactNode }) {
  return <Link href="/#generator">{children}</Link>;
}
