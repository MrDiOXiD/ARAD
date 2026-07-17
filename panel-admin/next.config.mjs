/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      // 1. Your existing API/Backend pattern
      {
        protocol: `${process.env.API_PROTOCOL}`,
        hostname: `${process.env.API_HOSTNAME}`,
      },
      // 2.Trust all ArvanCloud buckets and regions
      {
        protocol: 'https',
        hostname: '*.arvanstorage.ir',
        pathname: '/**', // Matches all paths inside your buckets
      },
    ],
  },
};

export default nextConfig;