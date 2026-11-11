import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tag Markets",
  description:
    "Log in or register for your Tag Markets account. Trading Forex & CFDs is Risky.",
};

export default function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/*
          Linked straight from /public so the browser receives the source
          stylesheets byte-for-byte. Going through the bundler re-serialises
          numbers (e.g. line-height 1.42857143 -> 1.42857), which shifts the
          portal's pixel grid.
        */}
        <link rel="stylesheet" href="/sites/tagmarkets/portal/css/portal.css" />
        <link rel="stylesheet" href="/sites/tagmarkets/portal/css/portal-inline.css" />
      </head>
      <body lang="en">{children}</body>
    </html>
  );
}
