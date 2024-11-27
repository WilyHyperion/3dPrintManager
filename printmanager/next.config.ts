import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['next-auth'],
  /* config options here */
  reactStrictMode: true,
};

export default nextConfig;
