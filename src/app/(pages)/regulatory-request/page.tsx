import type { Metadata } from "next";

import { InnerPage } from "@/components/sites/tagmarkets/InnerPage";
import { description, mainHtml, title } from "@/content/tagmarkets/pages/regulatory-request";

export const metadata: Metadata = {
  title,
  description,
};

export default function RegulatoryRequestPage() {
  return <InnerPage mainHtml={mainHtml} />;
}
