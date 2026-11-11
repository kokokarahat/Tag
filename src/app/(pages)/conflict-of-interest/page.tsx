import type { Metadata } from "next";

import { InnerPage } from "@/components/sites/tagmarkets/InnerPage";
import { description, mainHtml, title } from "@/content/tagmarkets/pages/conflict-of-interest";

export const metadata: Metadata = {
  title,
  description,
};

export default function ConflictOfInterestPage() {
  return <InnerPage mainHtml={mainHtml} />;
}
