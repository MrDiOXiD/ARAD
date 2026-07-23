import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "chatra-phanoos.s3.ir-thr-at1.arvanstorage.ir",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost", // 👈 Allows local testing if your NestJS serves static files
        port: "3020",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
