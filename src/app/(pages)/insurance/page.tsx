import type { Metadata } from "next";

import { InnerPage } from "@/components/sites/tagmarkets/InnerPage";
import { description, mainHtml, title } from "@/content/tagmarkets/pages/insurance";

export const metadata: Metadata = {
  title,
  description,
};

export default function InsurancePage() {
  return <InnerPage mainHtml={mainHtml} />;
}
