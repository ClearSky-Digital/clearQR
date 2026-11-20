/** Stands in for a guide's body until its copy is written. A release build refuses any page that still shows it. */
export function Placeholder() {
  return (
    <section className="card" data-placeholder="copy">
      <p>The copy for this guide is not written yet.</p>
    </section>
  );
}
