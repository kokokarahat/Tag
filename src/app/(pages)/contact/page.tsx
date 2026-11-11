import type { Metadata } from "next";

import { InnerPage } from "@/components/sites/tagmarkets/InnerPage";
import { description, mainHtml, title } from "@/content/tagmarkets/pages/contact";

export const metadata: Metadata = {
  title,
  description,
};

export default function ContactPage() {
  return <InnerPage mainHtml={mainHtml} />;
}
