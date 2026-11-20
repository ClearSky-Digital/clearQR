import { DevNote } from "../components/DevNote";
import { AppLink, GL } from "../components/GuideLink";
import { TagPlanner } from "../components/TagPlanner";
import { setupLink } from "../lib/site";

const NO_SCRIPT = ".js-only{display:none!important}";
const ANSWER: [string, string, number][] = [
  ["Bag sticker", "bakery-sticker", 61],
  ["Flyer", "bakery-flyer", 38],
  ["Window card", "bakery-window", 12],
];
const BAKERY: [string, string][] = [
  ["Flyer", "bakery-flyer"],
  ["Packaging", "bakery-sticker"],
  ["Other", "bakery-window"],
];

export function Body() {
  const setup = setupLink();
  return (
    <>
      <noscript>
        <style>{NO_SCRIPT}</style>
      </noscript>

      <section className="card" id="bakery" aria-labelledby="h-bakery">
        <h2 id="h-bakery">A bakery, three kinds of paper, one question</h2>
        <p className="steps-label">
          <span>1 Tag</span> · <span>2 Print</span> · <span>3 Read</span>
        </p>
        <div className="pair">
          <p>
            Corner Crumb Bakery is an invented example. The owner hands out a flyer and puts a sticker on every bag. A card hangs in the window.
            Each one carries a QR code to the same order page. A month later she wants to know which one is worth printing again.
          </p>
          <p>
            A QR code alone leaves that open, because every code opens the same page. Give each code its own tag first, and your analytics can
            tell the three apart.
          </p>
        </div>
      </section>

      <section className="card" aria-labelledby="h-tag">
        <h2 id="h-tag">Tag each QR code so analytics can tell them apart</h2>
        <div className="pair">
          <div>
            <p>
              A tag is a short label added to the web address inside the code. When you make a link code in <AppLink>ClearQR</AppLink>, you can
              fill in a source, a medium, and, if you like, a campaign name and a content word. Source and medium are a required pair, while
              campaign and content are optional.
            </p>
            <p>ClearQR has five presets that fill in the source and medium for you:</p>
            <ul className="inline-list">
              <li>Flyer</li>
              <li>Business card</li>
              <li>Vehicle</li>
              <li>Mailer</li>
              <li>Packaging</li>
            </ul>
            <p>
              The bakery uses the Flyer preset for the flyer and the Packaging preset for the bag sticker. The window card has no preset, so she
              types its source and medium by hand. Her campaign names are bakery-flyer, bakery-sticker, and bakery-window. Tags work on link
              codes only, and if the address already carries a tag of its own, that one stays.
            </p>
          </div>
          <div className="pair-box">
            <h3>The parts of a tagged address</h3>
            <dl className="parts">
              <dt>Source</dt>
              <dd>Where the paper came from, such as a flyer.</dd>
              <dt>Medium</dt>
              <dd>The kind of thing it is. All five presets use print.</dd>
              <dt>Campaign</dt>
              <dd>Your own short name for this batch, such as bakery-flyer.</dd>
              <dt>Content</dt>
              <dd>An optional extra word, such as spring.</dd>
            </dl>
            <p className="mono-line">
              <code>https://example.com/order?utm_source=SOURCE&amp;utm_medium=MEDIUM&amp;utm_campaign=bakery-flyer</code>
            </p>
          </div>
        </div>
      </section>

      <section className="card" aria-labelledby="h-print">
        <h2 id="h-print">Scan every printed code before you hand it out</h2>
        <div className="pair">
          <p>A misprint is easy to miss, so check each code while a fix is still cheap.</p>
          <ul className="checklist">
            <li>Scan the code. Your page should open.</li>
            <li>Check the address. The tags show in ClearQR&apos;s preview before you print, and in the address bar of the page that opens.</li>
            <li>Write down which code is on which paper. You will match the names later.</li>
          </ul>
        </div>
      </section>

      <section className="card" aria-labelledby="h-read">
        <h2 id="h-read">How to track QR code scans in Google Analytics</h2>
        <p>
          Open Google Analytics. Go to Reports, then Acquisition, then Traffic acquisition. Add Session campaign to the table. Each of your
          campaign names shows with its visits beside it. To count a goal such as an order, mark that action as a key event in Google Analytics.
        </p>
        <p>Counts are a minimum, because ad blockers and cookie banners hide some visits. Compare one piece of paper with another.</p>
        <div className="table-scroll" role="region" aria-label="Example visit counts" tabIndex={0}>
          <table>
            <caption>Example numbers, invented; your own report will look different.</caption>
            <thead>
              <tr>
                <th scope="col">Paper</th>
                <th scope="col">Campaign name</th>
                <th scope="col">Visits</th>
              </tr>
            </thead>
            <tbody>
              {ANSWER.map(([a, b, c]) => (
                <tr key={b}>
                  <th scope="row">{a}</th>
                  <td>{b}</td>
                  <td>{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>The bakery&apos;s answer: the bag sticker brought the most visits, so that is the one she prints again.</p>
      </section>

      <section className="card" aria-labelledby="h-trust">
        <h2 id="h-trust">What your QR code analytics can tell you</h2>
        <p>
          Setting up analytics is your own job. ClearQR does not create or read your analytics. If you would like a person to set it up with
          you,{" "}
          <a href={setup} target="_blank" rel="noopener noreferrer">
            ask for setup help<span className="sr-only"> (opens in a new tab)</span>
          </a>
          .
        </p>
        <div className="pair">
          <div className="pair-box">
            <h3>What you can trust</h3>
            <ul>
              <li>Which piece of paper brought more visits than another.</li>
              <li>Whether a new design did better than the old one.</li>
              <li>Which campaign names are getting no visits at all, so you know to check that code.</li>
            </ul>
          </div>
          <div className="pair-box">
            <h3>What to hold loosely</h3>
            <ul>
              <li>The exact number of people who came.</li>
              <li>A single day&apos;s numbers, because a small count moves a lot.</li>
              <li>Anything about a page that has no analytics. Set analytics up before you print.</li>
            </ul>
          </div>
        </div>
        <p>Tags ride on codes that open a web page, so other code types carry none.</p>
      </section>

      <section className="card" aria-labelledby="h-plan">
        <h2 id="h-plan">Plan your own tags</h2>
        <p>
          Pick where you will print and how many. Add a campaign name if you want one. You get a list to copy into ClearQR and a tally sheet to
          print. Nothing here is sent or saved.
        </p>
        <TagPlanner />
        <noscript>
          <h3>The bakery&apos;s list</h3>
          <ul>
            {BAKERY.map(([p, c]) => (
              <li key={p}>
                {p}. In ClearQR, fill the source and medium pair, then the campaign: {c}. Content: leave blank or add a word.
              </li>
            ))}
          </ul>
          <div className="table-scroll" role="region" aria-label="Tally sheet" tabIndex={0}>
            <table>
              <thead>
                <tr>
                  <th scope="col">Place</th>
                  <th scope="col">Campaign</th>
                  <th scope="col">Printed</th>
                  <th scope="col">Visits</th>
                </tr>
              </thead>
              <tbody>
                {[0, 1, 2].map((i) => (
                  <tr key={i}>
                    <td />
                    <td />
                    <td />
                    <td />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </noscript>
      </section>

      <section aria-labelledby="h-dev">
        <h2 id="h-dev">Note for your developer</h2>
        <p className="dev-intro">The details below are for whoever manages your website.</p>
        <DevNote
          rows={[
            {
              title: "Tag key names",
              body: (
                <p>
                  ClearQR adds <code>utm_source</code>, <code>utm_medium</code>, <code>utm_campaign</code>, and <code>utm_content</code> to the
                  address before it makes the code. The campaign and content tags are optional.
                </p>
              ),
            },
            {
              title: "Percent-encoding and the 100-character limit",
              body: <p>Values are percent-encoded, and each tag is at most 100 characters.</p>,
            },
            {
              title: "Capital letters in tag names",
              body: (
                <p>
                  If the address already has a <code>utm_</code> key, that key wins in any letter case, and the preview shows the address as it
                  will be coded.
                </p>
              ),
            },
            {
              title: "The 2,500-character address limit",
              body: <p>The tagged address may be up to 2,500 characters.</p>,
            },
            {
              title: "Tags in a config file",
              body: (
                <p>
                  On the command line, set <code>content.campaign</code> in the config file. It is an object that holds the source and medium,
                  plus an optional campaign and content, for link codes only, and the JSON schema covers that shape.
                </p>
              ),
            },
          ]}
        />
      </section>

      <p className="more-guides">
        <GL slug="changeable-code">Change where a QR code goes after you print it</GL>
      </p>
      <p className="fine">QR Code is a registered trademark of DENSO WAVE INCORPORATED.</p>
    </>
  );
}
