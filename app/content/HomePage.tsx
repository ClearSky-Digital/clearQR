import { Chooser, type Hrefs } from "../components/Chooser";
import { DevNote } from "../components/DevNote";
import { HomeArt } from "../components/HomeArt";
import { SiteBar, SiteFooter } from "../components/SiteChrome";
import { readyGuides } from "../lib/pages";
import { setupLink } from "../lib/site";
import { CHOOSER, CLOSE, DEV, FREE, HERO } from "./home-copy";

/** Without script every answer shows as a list, as in print. */
const NO_SCRIPT_CSS =
  ".chooser-rows,.shuffle{display:none!important}.chooser-answers{display:block!important}.chooser-answers .answer{visibility:visible!important;margin-bottom:20px}.answer-title{display:block!important}.shuffle-all{display:block!important}";

/** The mini-site home page. A guide link shows only when that guide has real copy. */
export function HomePage() {
  const ready = new Set(readyGuides().map((g) => g.slug));
  const hrefs: Hrefs = { app: "/make/", setup: setupLink() };
  if (ready.has("do-qr-codes-expire")) hrefs.expire = "/do-qr-codes-expire/";
  if (ready.has("count-your-scans")) hrefs.track = "/count-your-scans/";
  if (ready.has("changeable-code")) hrefs.change = "/changeable-code/";
  const more = readyGuides().filter((g) => g.slug === "static-vs-dynamic");
  const setup = hrefs.setup as string;
  return (
    <>
      <noscript>
        <style>{NO_SCRIPT_CSS}</style>
      </noscript>
      <SiteBar />
      <section className="top home-hero" aria-labelledby="h-home">
        <div className="wrap top-inner">
          <div className="hero-text">
            <h1 id="h-home">{HERO.h1}</h1>
            <div className="hero-lines">
              {HERO.lines.map((l) => (
                <p key={l}>{l}</p>
              ))}
            </div>
            <p className="hero-buttons">
              <a className="btn primary" href="/make/">
                {HERO.make}
              </a>
              <a className="btn" href="#chooser">
                {HERO.how}
              </a>
              <a className="btn" href={setup} target="_blank" rel="noopener noreferrer">
                {HERO.help}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </p>
          </div>
          <HomeArt />
        </div>
        <p className="wrap fine">{HERO.fine}</p>
      </section>
      <main>
        <section id="chooser" className="wrap home-band" aria-labelledby="h-chooser">
          <h2 id="h-chooser">{CHOOSER.title}</h2>
          <Chooser hrefs={hrefs} />
        </section>
        <section className="wrap home-band" aria-labelledby="h-free">
          <div className="free-pair">
            <div>
              <h2 id="h-free">{FREE.title}</h2>
              <p>{FREE.text}</p>
              <p>
                {FREE.credit}{" "}
                <a href="https://cscloud.digital" rel="noopener noreferrer">
                  ClearSky Digital
                </a>
                .
              </p>
            </div>
            <ul className="free-list card">
              {FREE.facts.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        </section>
        <section className="wrap home-band" aria-labelledby="h-dev">
          <h2 id="h-dev">{DEV.title}</h2>
          <p className="dev-intro">{DEV.intro}</p>
          <DevNote />
        </section>
        {more.length > 0 && (
          <p className="wrap more-guides">
            {CLOSE.more}{" "}
            {more.map((g) => (
              <a key={g.slug} href={`/${g.slug}/`}>
                {g.nav}
              </a>
            ))}
          </p>
        )}
      </main>
      <section className="close-band" aria-labelledby="h-close">
        <div className="wrap close-inner">
          <h2 id="h-close">{CLOSE.title}</h2>
          <a className="btn primary" href="/make/">
            {CLOSE.button}
          </a>
          <p className="trademark">{CLOSE.trademark}</p>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
