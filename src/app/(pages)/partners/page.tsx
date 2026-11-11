import "../../inner-partners.css";
import type { Metadata } from "next";

import { InnerPage } from "@/components/sites/tagmarkets/InnerPage";
import { description, mainHtml, title } from "@/content/tagmarkets/pages/partners";

export const metadata: Metadata = {
  title,
  description,
};

export default function PartnersPage() {
  return <InnerPage mainHtml={mainHtml} />;
}
