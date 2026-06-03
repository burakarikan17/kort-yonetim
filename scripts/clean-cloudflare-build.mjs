import { rm, stat, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const maxBytes = 25 * 1024 * 1024;
const cleanupTargets = [
  ".next/cache",
  ".open-next/cache",
  ".open-next/server-functions/default/.next/cache"
];

for (const target of cleanupTargets) {
  const absolute = path.join(root, target);
  if (existsSync(absolute)) {
    await rm(absolute, { recursive: true, force: true });
  }
}

async function collectOversizedFiles(dir, oversized = []) {
  if (!existsSync(dir)) {
    return oversized;
  }

  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await collectOversizedFiles(absolute, oversized);
      continue;
    }

    const fileStat = await stat(absolute);
    if (fileStat.size > maxBytes) {
      oversized.push({
        path: path.relative(root, absolute).replaceAll("\\", "/"),
        sizeMiB: (fileStat.size / 1024 / 1024).toFixed(1)
      });
    }
  }

  return oversized;
}

const oversizedFiles = [
  ...(await collectOversizedFiles(path.join(root, ".open-next"))),
  ...(await collectOversizedFiles(path.join(root, ".next/server")))
];

if (oversizedFiles.length > 0) {
  console.error("Cloudflare Pages file size limit exceeded:");
  for (const file of oversizedFiles) {
    console.error(`- ${file.path} (${file.sizeMiB} MiB)`);
  }
  process.exit(1);
}
