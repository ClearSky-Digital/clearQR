import { GuidePage } from "../components/GuidePage";
import { Body } from "../content/changeable-code";
import { guideBySlug } from "../lib/pages";
import { guideMetadata } from "../lib/guide-meta";

export const metadata = guideMetadata("changeable-code");

export default function Page() {
  return (
    <GuidePage guide={guideBySlug("changeable-code")}>
      <Body />
    </GuidePage>
  );
}
