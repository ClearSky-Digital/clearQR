import type { Guide } from "../lib/pages";
import { HeroArt } from "./HeroArt";
import { SiteBar, SiteFooter } from "./SiteChrome";

/** The frame every guide page shares: the bar, a hero with its picture, the body, and the footer. */
export function GuidePage({ guide, children }: { guide: Guide; children: React.ReactNode }) {
  return (
    <>
      <SiteBar />
      <section className="top guide-hero" aria-labelledby="g-h1">
        <div className="wrap top-inner">
          <div className="hero-text">
            <h1 id="g-h1">{guide.h1}</h1>
            <p className="lead">{guide.lead}</p>
          </div>
          <HeroArt kind={guide.art} />
        </div>
      </section>
      <main className="wrap guide-main">{children}</main>
      <SiteFooter />
    </>
  );
}
