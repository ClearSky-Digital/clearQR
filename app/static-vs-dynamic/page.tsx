import { GuidePage } from "../components/GuidePage";
import { Body } from "../content/static-vs-dynamic";
import { guideBySlug } from "../lib/pages";
import { guideMetadata } from "../lib/guide-meta";

export const metadata = guideMetadata("static-vs-dynamic");

export default function Page() {
  return (
    <GuidePage guide={guideBySlug("static-vs-dynamic")}>
      <Body />
    </GuidePage>
  );
}
