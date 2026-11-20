import type { Metadata } from "next";
import { HomePage } from "./content/HomePage";
import { canonicalUrl } from "./lib/pages";

export const metadata: Metadata = {
  title: "Free QR Code Generator: Open Source, No Account",
  description:
    "Free QR code generator with no account. Count its visits in your own analytics, and change where a code goes with a short address on your own domain.",
  alternates: { canonical: canonicalUrl("") },
};

export default function Page() {
  return <HomePage />;
}
