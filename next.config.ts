import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    dirs: ["app", "components", "lib"]
  }
};

if (process.env.CF_DEV === "1") {
  initOpenNextCloudflareForDev();
}

export default nextConfig;
