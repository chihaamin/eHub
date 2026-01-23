import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL("https://efootballhub.net/images/**")],
  },
};

export default nextConfig;
