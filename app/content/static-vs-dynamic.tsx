import { DevNote } from "../components/DevNote";
import { GL } from "../components/GuideLink";
import { SvdDiagram } from "../components/SvdDiagram";

const ROWS: [string, string, string, string][] = [
  ["What is printed", "The page address", "An address the service often owns", "A short address on your own domain"],
  ["What you can change", "Nothing, short of reprinting", "Where the code goes, usually through the service", "Where the short address forwards"],
  ["What it depends on", "The print and the page", "The service and the print", "Your domain, your forward, and the print"],
];

export function Body() {
  return (
    <>
      <section className="card" id="inside" aria-labelledby="h-inside">
        <h2 id="h-inside">Does a QR code carry the page or only the address?</h2>
        <p>
          A static QR code carries the text that was typed into it, usually a page address, so the page it opens lives on a website.
        </p>
        <div className="pair pair-art">
          <SvdDiagram />
          <ul className="twin-list">
            <li>A code that holds its own address goes straight from the square to your page. You own the address.</li>
            <li>
              A code that holds a short address goes through a forward first, then to your page. The forward belongs either to you, on your
              own domain, or to a service, and whoever owns it decides where the short address leads.
            </li>
          </ul>
        </div>
        <p>ClearQR makes the code; the address and the redirect stay yours.</p>
      </section>

      <section className="card" aria-labelledby="h-change">
        <h2 id="h-change">Can I change a QR code after it is printed?</h2>
        <p>
            The square stays as printed, and the page it opens is the part that can change. A code whose page can change is often called
            dynamic: either a service holds the code for you, or you forward a short address yourself. A code with your own short address
            keeps working as long as you keep the domain and the forward, and the page it points to still exists. Any printed code can still
            stop scanning, and the list below shows what does it. ClearQR offers guidance on{" "}
            <GL slug="count-your-scans">counting visits</GL> and on <GL slug="changeable-code">changing where a code goes</GL>.
        </p>
        <div className="pair-box">
          <h3>What stops a scan</h3>
          <p>A printed code keeps working as long as it can be read.</p>
          <ul className="inline-list">
            <li>Wear</li>
            <li>Fading</li>
            <li>Low contrast</li>
          </ul>
        </div>
        <div className="table-scroll" role="region" aria-label="Three kinds of QR code compared" tabIndex={0}>
          <table>
            <caption>As of November 2026, most services work this way and some differ; read the terms of any one you consider.</caption>
            <thead>
              <tr>
                <th scope="col">Kind</th>
                <th scope="col">A static QR code</th>
                <th scope="col">A code a service holds (often, as of November 2026)</th>
                <th scope="col">A static code with your own short address</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([k, a, b, c]) => (
                <tr key={k}>
                  <th scope="row">{k}</th>
                  <td>{a}</td>
                  <td>{b}</td>
                  <td>{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="h-dev">
        <h2 id="h-dev">Note for your developer</h2>
        <p className="dev-intro">The details below are for whoever manages your website.</p>
        <DevNote
          rows={[
            {
              title: "What the app's preview shows before you print",
              body: (
                <p>
                  The ClearQR app shows a preview of the address that goes into the code. Read it before you print, because the square will
                  hold that address.
                </p>
              ),
            },
            {
              title: "What a short address looks like inside the code",
              body: (
                <p>
                  With your own short address, the code holds text such as <code>https://example.com/menu</code> (an invented example). The
                  preview shows that exact text.
                </p>
              ),
            },
            {
              title: "Why the code itself holds no count",
              body: (
                <p>
                  The code holds an address and has no counter. If the page it opens has analytics, a count comes from there, through a tagged
                  address on a link code, and counts are a minimum because ad blockers and cookie banners hide some visits. The{" "}
                  <GL slug="count-your-scans">tracking guide</GL> explains it.
                </p>
              ),
            },
            {
              title: "The redirect type to choose: temporary (302)",
              body: (
                <p>
                  The ClearQR app&apos;s guidance is to forward the short address with a temporary (302) redirect, using one of three routes: a
                  Cloudflare rule, a WordPress plugin, or your web host&apos;s setting.
                </p>
              ),
            },
          ]}
        />
      </section>

      <section className="card" aria-labelledby="h-which">
        <h2 id="h-which">Which QR code should I print?</h2>
        <p>
          If the page never changes, print a static code. If the page may change, put your own short address in the code. To see what happens
          if a service stops, read <GL slug="do-qr-codes-expire">the expiry guide</GL>.
        </p>
      </section>

      <p className="more-guides">
        <GL slug="changeable-code">Change where a QR code goes after you print it</GL>
      </p>
    </>
  );
}
