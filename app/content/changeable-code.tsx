import { ChangeStrip } from "../components/ChangeStrip";
import { DevNote } from "../components/DevNote";
import { AppLink, GL } from "../components/GuideLink";

export function Body() {
  return (
    <>
      <section className="card" id="setup" aria-labelledby="h-setup">
        <h2 id="h-setup">How to change a QR code link after you print it</h2>
        <p>
          A food truck prints a menu card with a QR code that opens this week&apos;s specials page (an invented example), and next week the
          specials page moves while the card on every table stays. You need a domain you own and renew, and access to where its forwards are
          set. With no domain yet, a static code for a page that will not move is the simpler choice, and{" "}
          <GL slug="static-vs-dynamic">static vs dynamic QR codes</GL> shows the difference.
        </p>
        <div className="pair pair-art">
          <div className="stack">
            <ul className="twin-list">
              <li>
                <strong>The square stays printed.</strong> It holds <code>truck.example/menu</code>, and that address stays as long as you keep the
                domain.
              </li>
              <li>
                <strong>The forward changes.</strong> Last week it led to the old specials page, and this week it leads to the new one.
              </li>
            </ul>
            <ChangeStrip />
          </div>
          <div className="pair-box">
            <h3>Setup</h3>
            <ol className="steps">
              <li>
                Pick a short address on your own domain, such as <code>truck.example/menu</code>.
              </li>
              <li>Set a temporary forward for it where your domain&apos;s forwards live. Your own provider&apos;s help page has the exact setting.</li>
              <li>
                Make the code in <AppLink>ClearQR</AppLink> from the short address. Print one, then scan it.
              </li>
            </ol>
            <p>When the page moves, change only the forward to change where the printed code goes, then scan it again.</p>
          </div>
        </div>
        <p>
          A shorter address makes a simpler square, which is easier to read at small sizes. If your page has analytics, it counts visits to the
          new page. The number is a minimum, because ad blockers and cookie banners hide some visits. A printed code keeps working as long as it
          can be read, and wear or low contrast can stop a scan.
        </p>
      </section>

      <section aria-labelledby="h-dev">
        <h2 id="h-dev">Note for your developer</h2>
        <p className="dev-intro">The details below are for whoever manages your website.</p>
        <DevNote
          rows={[
            {
              title: "Where the forward lives in your setup",
              body: (
                <>
                  <p>
                    Set the forward in one of these places, as a temporary (302) redirect. This is the QR code redirect, and ClearQR runs none
                    itself.
                  </p>
                  <ul>
                    <li>A rule at your CDN.</li>
                    <li>A setting at your web host.</li>
                    <li>A plugin on your WordPress site.</li>
                    <li>A forwarding setting at your domain provider that can pass a specific path.</li>
                  </ul>
                  <p>A plain DNS record alone does not forward.</p>
                </>
              ),
            },
            {
              title: "Checking a forward from a terminal",
              body: (
                <p>
                  Run <code>curl -I https://truck.example/menu</code> (an invented address). A working temporary forward answers with a 302 status
                  and a Location line that names the page.
                </p>
              ),
            },
            {
              title: "Paths and query strings through a forward",
              body: <p>Check whether the forward passes the path and the query string on to the new page, because some setups drop them.</p>,
            },
            {
              title: "What a cached forward does after you change it",
              body: (
                <p>
                  A permanent (301) redirect is cacheable by default, so a browser may keep the old destination after you change it. The{" "}
                  <GL slug="static-vs-dynamic">static vs dynamic guide</GL> has a row on the redirect type, which names the app&apos;s guidance.
                </p>
              ),
            },
          ]}
        />
      </section>

      <p className="more-guides">
        <GL slug="count-your-scans">Count the visits to your new page</GL>
      </p>
      <p className="fine">QR Code is a registered trademark of DENSO WAVE INCORPORATED.</p>
    </>
  );
}
