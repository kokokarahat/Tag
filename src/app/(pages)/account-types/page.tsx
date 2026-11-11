import "../../inner-account-types.css";
import type { Metadata } from "next";

import { InnerPage } from "@/components/sites/tagmarkets/InnerPage";
import { description, mainHtml, title } from "@/content/tagmarkets/pages/account-types";

export const metadata: Metadata = {
  title,
  description,
};

export default function AccountTypesPage() {
  return <InnerPage mainHtml={mainHtml} />;
}
