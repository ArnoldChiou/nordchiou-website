import { spawn } from "node:child_process";
import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const port = "4317";

function spawnNpx(args, options) {
  if (process.platform === "win32") {
    return spawn(
      process.env.ComSpec,
      ["/d", "/s", "/c", "npx", ...args],
      options,
    );
  }
  return spawn("npx", args, options);
}

function run(args) {
  return new Promise((resolve, reject) => {
    const child = spawnNpx(args, { cwd: root, stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0
        ? resolve()
        : reject(new Error(`${args.join(" ")} exited with ${code}`)),
    );
  });
}

async function waitForPage(url) {
  let lastError;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return response.text();
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw lastError ?? new Error("Timed out waiting for the local site");
}

await run(["vinext", "build"]);

const server = spawnNpx(["vinext", "start", "-p", port], {
  cwd: root,
  stdio: "inherit",
});
try {
  const rendered = await waitForPage(`http://127.0.0.1:${port}/`);
  const document = rendered.match(/<!DOCTYPE html><html[\s\S]*?<\/html>/i)?.[0];
  if (!document) throw new Error("Could not extract rendered HTML");

  const staticHtml = document
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>\s*/gi, "")
    .replace(/<link\b[^>]*rel="modulepreload"[^>]*>\s*/gi, "");

  const docs = join(root, "docs");
  await rm(docs, { recursive: true, force: true });
  await mkdir(docs, { recursive: true });
  await cp(join(root, "dist", "client", "assets"), join(docs, "assets"), {
    recursive: true,
  });
  await cp(join(root, "public", "portfolio"), join(docs, "portfolio"), {
    recursive: true,
  });
  await cp(join(root, "public", "logo.png"), join(docs, "logo.png"));
  await cp(join(root, "public", "favicon.ico"), join(docs, "favicon.ico"));
  await cp(join(root, "public", "robots.txt"), join(docs, "robots.txt"));
  await cp(join(root, "public", "sitemap.xml"), join(docs, "sitemap.xml"));
  await writeFile(join(docs, "index.html"), staticHtml, "utf8");
  await writeFile(join(docs, ".nojekyll"), "", "utf8");
} finally {
  if (process.platform === "win32") {
    spawn("taskkill", ["/pid", String(server.pid), "/t", "/f"]);
  } else {
    server.kill();
  }
}
