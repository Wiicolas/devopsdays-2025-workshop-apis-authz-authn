import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: ['dashboard.devopsbeerer.ch'],
  },
};

export default nextConfig;
