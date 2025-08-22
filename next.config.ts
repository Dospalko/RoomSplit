import type { NextConfig } from "next";
import bundleAnalyzer from '@next/bundle-analyzer';

// Bundle analyzer for development
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
});

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["framer-motion", "react-icons"],
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
    webpackBuildWorker: true,
  },
  transpilePackages: ["framer-motion"],
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  webpack: (config, { dev, isServer }) => {
    // Optimize for faster builds
    if (dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      };
      
      // Enable faster compilation
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      };
    }
    
    return config;
  },
}

export default withBundleAnalyzer(nextConfig);
