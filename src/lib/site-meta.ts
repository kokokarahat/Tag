/**
 * Shared site metadata used by the layouts.
 *
 * Facebook (and most unfurlers) need an absolute `og:image`, so `metadataBase`
 * is set from `SITE_URL`. Override the origin here if the production domain
 * ever changes.
 */

export const SITE_URL = "https://tagmrakets.com";

export const OG_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "Tag Markets",
};

export const SHARED_METADATA = {
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website" as const,
    siteName: "Tag Markets",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image" as const,
    images: ["/og-image.png"],
  },
};
