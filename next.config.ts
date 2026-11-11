import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  async rewrites() {
    return [
      { source: "/en/home", destination: "/dashboard" },
      { source: "/en/dashboard", destination: "/dashboard" },
      { source: "/en/dashboard/:path*", destination: "/dashboard/:path*" },
    ];
  },
};

export default nextConfig;
