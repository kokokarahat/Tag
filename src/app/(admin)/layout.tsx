import type { Metadata } from "next";

import "../globals.css";

export const metadata: Metadata = {
  title: "Admin | Tag Markets",
  description: "Internal console for captured portal activity.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#08090a] text-neutral-200 antialiased">{children}</body>
    </html>
  );
}
