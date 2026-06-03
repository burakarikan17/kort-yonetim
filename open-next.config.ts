import { defineCloudflareConfig, type OpenNextConfig } from "@opennextjs/cloudflare";

const cloudflareConfig = defineCloudflareConfig();

export default {
  ...cloudflareConfig,
  buildCommand: "npm run build:next"
} satisfies OpenNextConfig;
