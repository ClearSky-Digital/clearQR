import { GuidePage } from "../components/GuidePage";
import { Body } from "../content/do-qr-codes-expire";
import { guideBySlug } from "../lib/pages";
import { guideMetadata } from "../lib/guide-meta";

export const metadata = guideMetadata("do-qr-codes-expire");

export default function Page() {
  return (
    <GuidePage guide={guideBySlug("do-qr-codes-expire")}>
      <Body />
    </GuidePage>
  );
}
