import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL("https://efootballhub.net/images/**")],
  },
  //   experimental: {
  //     // Reduce memory usage during build by limiting concurrent workers
  //     workerThreads: false,
  //     cpus: 4,
  //   },
};

export default nextConfig;
