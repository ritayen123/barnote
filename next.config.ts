import type { NextConfig } from "next";
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["recharts"],
  },
  // Use webpack for build (next-pwa requires webpack, not turbopack)
  turbopack: {},
};

export default withPWA(nextConfig);
