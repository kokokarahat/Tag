import "../../inner-copy-trade.css";
import type { Metadata } from "next";

import { InnerPage } from "@/components/sites/tagmarkets/InnerPage";
import { description, mainHtml, title } from "@/content/tagmarkets/pages/copy-trade";

export const metadata: Metadata = {
  title,
  description,
};

export default function CopyTradePage() {
  return <InnerPage mainHtml={mainHtml} />;
}
