import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL("https://efootballhub.net/images/efootball24/players/**"),
    ],
  },
};

export default nextConfig;
