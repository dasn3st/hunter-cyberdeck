import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

const sourceDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(sourceDir, "dist");
const i18n = await readFile(path.join(sourceDir, "assets", "i18n.js"), "utf8");
const pages = [
  ["index.html", "/"],
  ["blog.html", "/blog.html"],
  ["tech.html", "/tech.html"],
  ["hardware.html", "/hardware"],
  ["makerworld.html", "/makerworld.html"],
  ["archive.html", "/archive.html"],
  ["github.html", "/github.html"],
  ["about.html", "/about.html"],
];

await mkdir(path.join(outputDir, "_en"), { recursive: true });
for (const [filename, publicPath] of pages) {
  const html = await readFile(path.join(outputDir, filename), "utf8");
  const dom = new JSDOM(html, {
    url: `https://hunter-cyberdeck.d4sn3st.dev${publicPath}?lang=en`,
    runScripts: "outside-only",
  });
  try {
    dom.window.eval(i18n);
    const { document } = dom.window;
    if (document.documentElement.lang !== "en") throw new Error(`${filename}: language not applied`);
    const canonical = document.querySelector('link[rel="canonical"]')?.href;
    if (!canonical?.endsWith("?lang=en")) throw new Error(`${filename}: invalid English canonical ${canonical}`);
    const description = document.querySelector('meta[name="description"]')?.content || "";
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogDescription) ogDescription.content = description;
    if (twitterDescription) twitterDescription.content = description;
    if (ogUrl) ogUrl.content = canonical;
    await writeFile(path.join(outputDir, "_en", filename), dom.serialize(), "utf8");
  } finally {
    dom.window.close();
  }
}
console.log(`Generated ${pages.length} English static pages.`);
