import type { Metadata, Viewport } from "next";

import "../inner-shared.css";
import "../tagmarkets.css";

export const metadata: Metadata = {
  title: "Tag Markets",
};

export const viewport: Viewport = {
  themeColor: "#1a202c",
};

export default function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ "--mobile-jurisdiction-height": "0px" } as React.CSSProperties}>
      <body>{children}</body>
    </html>
  );
}
