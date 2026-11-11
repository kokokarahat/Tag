import type { Metadata } from "next";

import { InnerPage } from "@/components/sites/tagmarkets/InnerPage";
import { description, mainHtml, title } from "@/content/tagmarkets/pages/privacy";

export const metadata: Metadata = {
  title,
  description,
};

export default function PrivacyPage() {
  return <InnerPage mainHtml={mainHtml} />;
}
