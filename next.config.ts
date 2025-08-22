import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
  transpilePackages: ["framer-motion"],
}

export default nextConfig;
