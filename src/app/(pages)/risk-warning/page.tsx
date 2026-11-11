import type { Metadata } from "next";

import { InnerPage } from "@/components/sites/tagmarkets/InnerPage";
import { description, mainHtml, title } from "@/content/tagmarkets/pages/risk-warning";

export const metadata: Metadata = {
  title,
  description,
};

export default function RiskWarningPage() {
  return <InnerPage mainHtml={mainHtml} />;
}
