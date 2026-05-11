import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Increase timeout for API requests
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
