import Link from "next/link";
import { Logo } from "./Logo";
import { readyGuides } from "../lib/pages";

/** The slim bar on top of every guide page: the brand, the generator, and each guide that has copy. */
export function SiteBar() {
  const guides = readyGuides();
  return (
    <header className="site-bar">
      <div className="wrap site-bar-inner">
        <Link className="brand site-brand" href="/">
          <Logo size={26} />
          <span className="brand-name">
            Clear<span>QR</span>
          </span>
        </Link>
        <nav aria-label="Guides">
          <ul>
            <li>
              <Link href="/#generator">Make a code</Link>
            </li>
            {guides.map((g) => (
              <li key={g.slug}>
                <Link href={`/${g.slug}/`}>{g.nav}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="foot">
      <div className="wrap">
        <p>
          ClearQR is free and open source under the MIT license. Built and maintained by{" "}
          <a href="https://cscloud.digital" rel="noopener noreferrer">ClearSky Digital</a>. Nothing you type into the
          generator leaves your device.
        </p>
      </div>
    </footer>
  );
}
