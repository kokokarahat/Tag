import "../../inner-amplify.css";
import type { Metadata } from "next";

import { InnerPage } from "@/components/sites/tagmarkets/InnerPage";
import { description, mainHtml, title } from "@/content/tagmarkets/pages/amplify";

export const metadata: Metadata = {
  title,
  description,
};

export default function AmplifyPage() {
  return <InnerPage mainHtml={mainHtml} />;
}
