import type { Metadata } from "next";
import Generator from "../components/Generator";
import { canonicalUrl } from "../lib/pages";

export const metadata: Metadata = {
  title: "ClearQR: make a free QR code in your browser",
  description:
    "Make a QR code for a link, contact card, Wi-Fi, email, text message, map location or calendar event. Free, no account, and nothing leaves your device.",
  alternates: { canonical: canonicalUrl("make") },
};

export default function Page() {
  return <Generator />;
}
