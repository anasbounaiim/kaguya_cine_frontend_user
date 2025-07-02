import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['image.tmdb.org'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
