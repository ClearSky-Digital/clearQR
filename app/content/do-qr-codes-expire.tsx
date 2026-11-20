import { DevNote } from "../components/DevNote";
import { ExpireCheck } from "../components/ExpireCheck";
import { GL } from "../components/GuideLink";

const NO_SCRIPT = ".js-only{display:none!important}";

export function Body() {
  return (
    <>
      <noscript>
        <style>{NO_SCRIPT}</style>
      </noscript>

      <section className="card" aria-labelledby="h-two">
        <h2 id="h-two">Does my QR code expire? It depends on what is inside it.</h2>
        <p>
          This is how free QR codes that don&apos;t expire differ from codes that depend on someone else. ClearQR is free and open source under
          the MIT license, with no account to create.
        </p>
        <div className="pair">
          <div className="pair-box">
            <h3>A code that holds its own information</h3>
            <p>
              The address is in the picture itself. Nothing behind the code needs renewing. It works while the printed square can still be
              scanned, and wear or fading can end that. A menu card with a link code is a good example: scan it in a few years and, if the print
              is still clean and the page is still there, it opens the same page.
            </p>
          </div>
          <div className="pair-box">
            <h3>A code that depends on a service</h3>
            <p>
              Some codes point to a service that holds the code for you, and the service decides where it goes. As of November 2026, these often
              stop working when the service stops. The address belongs to the service, so only the service can change it. A service-held code
              may work today, and it depends on that service for as long as it lasts.
            </p>
          </div>
        </div>
        <p>
          ClearQR makes the first kind only, and it hosts nothing. The code stays as printed. The page it opens is the part you control, and{" "}
          <GL slug="changeable-code">the changeable-code guide</GL> shows how to set up a code you can point to a new page later. That setup
          has to happen before you print.
        </p>
      </section>

      <section className="card" aria-labelledby="h-three">
        <h2 id="h-three">Why do QR codes expire? Three causes, and a test for each</h2>
        <div className="triple">
          <div className="pair-box" id="cause-print">
            <h3>The print wore out</h3>
            <p>
              <strong>Test:</strong> scan the code at arm&apos;s length and at an angle, and check it again after a season outdoors, since sun
              and rain fade ink.
            </p>
            <p>
              <strong>Fix:</strong> reprint it dark on light, with a clear border around it. A QR code with no expiration date still needs a
              clean surface, because ink fades.
            </p>
          </div>
          <div className="pair-box" id="cause-page">
            <h3>The page it opens is gone, or its domain lapsed</h3>
            <p>
              <strong>Test:</strong> scan it, read the address on your phone, then type that address in by hand.
            </p>
            <p>
              <strong>Fix:</strong> ask whoever runs the website to send the old address to the new page. That change lives on the website
              side. A printed code keeps the address it was made with.
            </p>
          </div>
          <div className="pair-box" id="cause-service">
            <h3>A service that held the code stopped</h3>
            <p>
              <strong>Test:</strong> scan the printed code and look at the web address before you open the page. If the address names the
              service, the service holds the code.
            </p>
            <p>
              <strong>Fix:</strong> if you know which page it should open, make a plain code for that address and reprint. If you are unsure,
              the old printed code stays as it is, so start a new one. A QR code with no expiration date is simply one that holds your own
              address.
            </p>
          </div>
        </div>
      </section>

      <section className="card" id="check" aria-labelledby="h-check">
        <h2 id="h-check">Will my QR code expire? A quick check</h2>
        <ExpireCheck />
      </section>

      <section className="card" aria-labelledby="h-keep">
        <h2 id="h-keep">Keep a printed code readable</h2>
        <div className="pair">
          <p>
            Wear, fading, and low contrast can stop a scan, so look after the print. ClearQR has four error correction levels, which let a
            code survive some wear, and a quiet zone option, which keeps a clear border so scanners can find it. Both work on the print, while
            a gone page or a stopped service needs the fixes in the causes above.
          </p>
          <ul className="checklist" id="checklist">
            <li>Print it dark on light.</li>
            <li>Leave a clear border around it.</li>
            <li>Test the printed copy with your own phone.</li>
            <li>Keep the source file, so you can reprint.</li>
            <li>Keep a spare printed copy.</li>
            <li>Check the print again each season.</li>
          </ul>
        </div>
      </section>

      <section aria-labelledby="h-dev">
        <h2 id="h-dev">Note for your developer</h2>
        <p className="dev-intro">The details below are for whoever manages your website.</p>
        <DevNote
          rows={[
            {
              title: "Error correction levels",
              body: <p>ClearQR offers four: L, M, Q, and H, which recover up to about 7, 15, 25, and 30 percent of the code.</p>,
            },
            {
              title: "The quiet zone option",
              body: <p>The quiet zone is the blank border around the code. ClearQR lets you set it, and a clear border helps scanners find the code.</p>,
            },
            {
              title: "Sending an old address to a new page",
              body: (
                <p>
                  When a page moves, the owner of the website sets a redirect from the old address to the new one. ClearQR&apos;s{" "}
                  <GL slug="changeable-code">changeable-code guide</GL> describes a different setup, a short address on your own domain with a
                  temporary redirect.
                </p>
              ),
            },
            {
              title: "Checking when a domain expires",
              body: (
                <p>
                  Look up the domain in your registrar account or run a WHOIS lookup. A lapsed domain ends the page the code opens, though the
                  printed code itself still reads fine.
                </p>
              ),
            },
          ]}
        />
      </section>

      <p className="more-guides">
        <GL slug="static-vs-dynamic">Static and changeable QR codes compared</GL>
      </p>
    </>
  );
}
