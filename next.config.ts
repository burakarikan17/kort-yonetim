import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  eslint: {
    dirs: ["app", "components", "lib"]
  },
  webpack(config, { dev }) {
    if (!dev) {
      config.cache = false;
    }

    return config;
  }
};

if (process.env.CF_DEV === "1") {
  initOpenNextCloudflareForDev();
}

export default nextConfig;
