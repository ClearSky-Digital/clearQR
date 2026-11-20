import { GuidePage } from "../components/GuidePage";
import { Body } from "../content/count-your-scans";
import { guideBySlug } from "../lib/pages";
import { guideMetadata } from "../lib/guide-meta";

export const metadata = guideMetadata("count-your-scans");

export default function Page() {
  return (
    <GuidePage guide={guideBySlug("count-your-scans")}>
      <Body />
    </GuidePage>
  );
}
