import "../../inner-deposit-methods.css";
import type { Metadata } from "next";

import { InnerPage } from "@/components/sites/tagmarkets/InnerPage";
import { description, mainHtml, title } from "@/content/tagmarkets/pages/deposit-methods";

export const metadata: Metadata = {
  title,
  description,
};

export default function DepositMethodsPage() {
  return <InnerPage mainHtml={mainHtml} />;
}
