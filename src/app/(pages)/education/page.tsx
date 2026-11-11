import "../../inner-education.css";
import type { Metadata } from "next";

import { InnerPage } from "@/components/sites/tagmarkets/InnerPage";
import { description, mainHtml, title } from "@/content/tagmarkets/pages/education";

export const metadata: Metadata = {
  title,
  description,
};

export default function EducationPage() {
  return <InnerPage mainHtml={mainHtml} />;
}
