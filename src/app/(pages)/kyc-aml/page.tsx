import type { Metadata } from "next";

import { InnerPage } from "@/components/sites/tagmarkets/InnerPage";
import { description, mainHtml, title } from "@/content/tagmarkets/pages/kyc-aml";

export const metadata: Metadata = {
  title,
  description,
};

export default function KycAmlPage() {
  return <InnerPage mainHtml={mainHtml} />;
}
