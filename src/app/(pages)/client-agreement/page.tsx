import type { Metadata } from "next";

import { InnerPage } from "@/components/sites/tagmarkets/InnerPage";
import { description, mainHtml, title } from "@/content/tagmarkets/pages/client-agreement";

export const metadata: Metadata = {
  title,
  description,
};

export default function ClientAgreementPage() {
  return <InnerPage mainHtml={mainHtml} />;
}
