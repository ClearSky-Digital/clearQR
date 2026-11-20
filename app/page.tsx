import type { Metadata } from "next";
import Generator from "./components/Generator";
import { canonicalUrl } from "./lib/pages";

export const metadata: Metadata = {
  title: "Free Open Source QR Codes: Count and Change Them Yourself",
  description:
    "ClearQR is a free, open source QR code generator. Count the visits a code brings in your own analytics, and change where it goes with your own web address. No account.",
  alternates: { canonical: canonicalUrl("") },
};

export default function Page() {
  return <Generator />;
}
