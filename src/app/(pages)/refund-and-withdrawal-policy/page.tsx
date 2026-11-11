import type { Metadata } from "next";

import { InnerPage } from "@/components/sites/tagmarkets/InnerPage";
import { description, mainHtml, title } from "@/content/tagmarkets/pages/refund-and-withdrawal-policy";

export const metadata: Metadata = {
  title,
  description,
};

export default function RefundAndWithdrawalPolicyPage() {
  return <InnerPage mainHtml={mainHtml} />;
}
