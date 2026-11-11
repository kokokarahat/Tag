import type { Metadata, Viewport } from "next";
import "../globals.css";
import "../tagmarkets.css";

export const metadata: Metadata = {
  title: "Regulated FX & CFD Broker | Tag Markets",
  description:
    "Amplify accounts, CopyX copy trading, MT5 access, tournaments, and trading technology from Tag Markets.",
};

export const viewport: Viewport = {
  themeColor: "#1a202c",
};

export default function RootLayout({
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
