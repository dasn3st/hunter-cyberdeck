import { cp, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const sourceDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(sourceDir, "dist");
const siteUrl = "https://hunter-cyberdeck.d4sn3st.dev";
const supabaseUrl = process.env.SUPABASE_URL || "https://ocgirjlfdugiaieynbnl.supabase.co";
const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY || "sb_publishable_sihx39p63ZEO4M3I1APVlw_GhySEcfu";

const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
})[character]);
const safeJson = (value) => JSON.stringify(value).replace(/[<>&]/g, (character) => ({ "<": "\\u003c", ">": "\\u003e", "&": "\\u0026" })[character]);
const safeUrl = (value = "") => {
  const url = String(value).trim();
  if (/^(https?:\/\/|\/|assets\/)/i.test(url) && !/^javascript:/i.test(url)) return url;
  return "";
};
const publicUrl = (value = "") => {
  const url = safeUrl(value);
  if (!url) return "";
  try {
    const parsed = new URL(url, siteUrl);
    const slug = parsed.searchParams.get("slug");
    if (parsed.origin === siteUrl && parsed.pathname === "/post.html" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(String(slug || ""))) {
      return `/blog/${encodeURIComponent(slug)}/`;
    }
  } catch {}
  if (/^https?:\/\//i.test(url) || url.startsWith("/")) return url;
  return `/${url}`;
};
const absoluteUrl = (value = "") => {
  const url = publicUrl(value);
  if (!url) return "";
  try { return new URL(url, siteUrl).href; } catch { return ""; }
};
const validIsoDate = (value) => {
  const date = new Date(value || "");
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
};
const paragraphs = (value = "") => String(value).split(/\n{2,}/).map((part) => `<p>${escapeHtml(part).replace(/\n/g, "<br>")}</p>`).join("");
const imageMarkup = (src, alt, className = "") => {
  const url = publicUrl(src);
  return url ? `<img class="${className}" src="${escapeHtml(url)}" alt="${escapeHtml(alt || "HUNTER Blogbild")}" loading="lazy" decoding="async">` : "";
};
const imageFigure = (src, alt, caption = "", credit = "") => {
  const url = publicUrl(src);
  if (!url) return "";
  const captionMarkup = caption || credit
    ? `<figcaption>${caption ? `<span class="post-caption">${escapeHtml(caption)}</span>` : ""}${credit ? `<span class="post-credit">Quelle: ${escapeHtml(credit)}</span>` : ""}</figcaption>`
    : "";
  return `<figure class="post-figure"><button class="post-image-button" type="button" data-lightbox-src="${escapeHtml(url)}" data-lightbox-alt="${escapeHtml(alt || "HUNTER Blogbild")}" aria-label="Bild vergrößern">${imageMarkup(url, alt)}</button>${captionMarkup}</figure>`;
};
const videoEmbedUrl = (value) => {
  const raw = String(value || "").trim();
  try {
    const url = new URL(raw);
    if (["www.youtube.com", "youtube.com", "m.youtube.com", "youtu.be", "www.youtube-nocookie.com"].includes(url.hostname)) {
      const id = url.hostname === "youtu.be" ? url.pathname.slice(1).split("/")[0] : (url.searchParams.get("v") || url.pathname.split("/").filter(Boolean).pop());
      return id && /^[A-Za-z0-9_-]{6,}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : "";
    }
    if (["vimeo.com", "www.vimeo.com"].includes(url.hostname)) {
      const id = url.pathname.split("/").filter(Boolean).pop();
      return id && /^\d{5,}$/.test(id) ? `https://player.vimeo.com/video/${id}` : "";
    }
  } catch {}
  return "";
};
const embedMarkup = (block = {}) => {
  const platform = String(block.platform || "").toLowerCase();
  const raw = String(block.url || "").trim();
  const title = escapeHtml(block.title || `HUNTER ${platform} Einbettung`);
  let iframeUrl = "";
  let content = "";
  try {
    const url = new URL(raw);
    if ((platform === "twitter" || platform === "x") && ["twitter.com", "x.com", "www.twitter.com", "www.x.com"].includes(url.hostname)) {
      content = `<blockquote class="twitter-tweet"><a href="${escapeHtml(raw)}">${escapeHtml(raw)}</a></blockquote>`;
    } else if (platform === "github" && url.hostname === "github.com") {
      content = `<a class="post-embed-card" href="${escapeHtml(raw)}" target="_blank" rel="noopener noreferrer"><span class="technical-label">GitHub</span><strong>${title}</strong><span>${escapeHtml(url.pathname.replace(/^\//, ""))} ↗</span></a>`;
    } else if (platform === "codepen" && url.hostname === "codepen.io") {
      const parts = url.pathname.split("/").filter(Boolean); const penIndex = parts.indexOf("pen"); const user = parts[0]; const pen = penIndex >= 0 ? parts[penIndex + 1] : "";
      if (user && pen && /^[A-Za-z0-9_-]+$/.test(user) && /^[A-Za-z0-9_-]+$/.test(pen)) iframeUrl = `https://codepen.io/${user}/embed/${pen}?default-tab=result`;
    } else if (platform === "instagram" && url.hostname === "www.instagram.com") {
      const match = url.pathname.match(/^\/(?:p|reel)\/([A-Za-z0-9_-]+)/);
      if (match) iframeUrl = `https://www.instagram.com/${url.pathname.split("/").filter(Boolean)[0]}/${match[1]}/embed`;
    } else if (platform === "tiktok" && ["www.tiktok.com", "tiktok.com"].includes(url.hostname)) {
      const match = url.pathname.match(/\/video\/(\d+)/); if (match) iframeUrl = `https://www.tiktok.com/embed/v2/${match[1]}`;
    } else if (platform === "reddit" && ["www.reddit.com", "reddit.com"].includes(url.hostname)) {
      iframeUrl = `https://www.redditmedia.com${url.pathname}?ref_source=embed&ref=share&embed=true`;
    }
  } catch {}
  if (iframeUrl) content = `<iframe src="${escapeHtml(iframeUrl)}" title="${title}" loading="lazy" allow="fullscreen" referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
  if (!content) {
    const url = publicUrl(raw);
    return url ? `<div class="post-embed-fallback"><span class="technical-label">${escapeHtml(platform || "External Link")}</span><a class="post-link" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${title} ↗</a></div>` : "";
  }
  return `<div class="post-embed" data-embed-platform="${escapeHtml(platform)}">${content}</div>`;
};

const renderBlock = (block = {}) => {
  const type = block.type;
  if (type === "rich_text") return { html: `<div class="post-prose">${paragraphs(block.text || block.content || "")}</div>`, schemas: [] };
  if (type === "heading") { const level = Number(block.level) === 3 ? 3 : 2; return { html: `<h${level} class="post-heading">${escapeHtml(block.text || "")}</h${level}>`, schemas: [] }; }
  if (type === "image") return { html: imageFigure(block.src || block.image, block.alt, block.caption, block.credit), schemas: [] };
  if (type === "image_text") return { html: `<section class="post-image-text ${block.position === "left" ? "image-left" : "image-right"}">${imageFigure(block.src || block.image, block.alt, block.caption, block.credit)}<div class="post-prose">${paragraphs(block.text || block.content || "")}</div></section>`, schemas: [] };
  if (type === "gallery") {
    const images = Array.isArray(block.images) ? block.images : [];
    const layout = block.layout === "three-up" ? " post-gallery-three-up" : "";
    const html = `<div class="post-gallery${layout}">${images.slice(0, 12).map((item) => {
      const source = typeof item === "string" ? item : item?.src; const alt = typeof item === "string" ? "HUNTER Galerie" : item?.alt;
      return imageFigure(source, alt, typeof item === "object" ? item?.caption : "", typeof item === "object" ? item?.credit : "").replace('class="post-figure"', 'class="post-figure post-gallery-figure"');
    }).join("")}</div>`;
    return { html, schemas: [] };
  }
  if (type === "video") { const url = videoEmbedUrl(block.url); return { html: url ? `<figure class="post-video"><iframe src="${escapeHtml(url)}" title="${escapeHtml(block.title || "HUNTER Video")}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>${block.caption ? `<figcaption>${escapeHtml(block.caption)}</figcaption>` : ""}</figure>` : "", schemas: [] }; }
  if (type === "link") { const url = publicUrl(block.url); return { html: url ? `<p class="post-link-block"><a class="post-link" href="${escapeHtml(url)}"${block.new_tab === false ? "" : " target=\"_blank\" rel=\"noopener noreferrer\""}>${escapeHtml(block.text || block.url)} ↗</a></p>` : "", schemas: [] }; }
  if (type === "table") {
    const headers = Array.isArray(block.headers) ? block.headers.slice(0, 12) : []; const rows = Array.isArray(block.rows) ? block.rows.slice(0, 50) : [];
    const html = headers.length ? `<div class="post-table-wrap"><table class="post-table"><thead><tr>${headers.map((header) => `<th scope="col">${escapeHtml(header)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${headers.map((_, index) => `<td>${escapeHtml(Array.isArray(row) ? row[index] || "" : "")}</td>`).join("")}</tr>`).join("")}</tbody></table></div>` : "";
    return { html, schemas: [] };
  }
  if (type === "faq") {
    const items = Array.isArray(block.items) ? block.items.slice(0, 20) : [];
    const questions = items.filter((item) => item?.question && item?.answer).map((item) => ({ "@type": "Question", name: String(item.question).slice(0, 500), acceptedAnswer: { "@type": "Answer", text: String(item.answer).slice(0, 2000) } }));
    return { html: `<section class="post-faq"><span class="technical-label">FAQ</span>${items.map((item) => `<details><summary>${escapeHtml(item.question || "Frage")}</summary><div class="post-faq-answer">${paragraphs(item.answer || "")}</div></details>`).join("")}</section>`, schemas: questions.length ? [{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: questions }] : [] };
  }
  if (type === "cta") { const url = publicUrl(block.button_url); return { html: `<aside class="post-cta"><div><span class="technical-label">NEXT MOVE</span><h3>${escapeHtml(block.title || "Weiterbauen")}</h3><p>${escapeHtml(block.text || "")}</p></div>${url ? `<a class="button" href="${escapeHtml(url)}"${/^https?:\/\//i.test(url) ? " target=\"_blank\" rel=\"noopener noreferrer\"" : ""}>${escapeHtml(block.button_text || "Öffnen")} ↗</a>` : ""}</aside>`, schemas: [] }; }
  if (type === "embed") return { html: embedMarkup(block), schemas: [] };
  if (type === "code") return { html: `<div class="post-code"><div class="post-code-label"><span>${escapeHtml(block.language || "code")}</span>${block.filename ? `<span>${escapeHtml(block.filename)}</span>` : ""}</div><pre><code>${escapeHtml(block.code || "")}</code></pre></div>`, schemas: [] };
  if (type === "stats") { const items = Array.isArray(block.items) ? block.items : []; return { html: `<div class="post-stats">${items.slice(0, 8).map((item = {}) => { const progress = Number(item.progress); const valid = Number.isFinite(progress) ? Math.max(0, Math.min(100, progress)) : null; return `<div class="post-stat-card"><strong>${escapeHtml(item.value ?? "—")}</strong><span>${escapeHtml(item.label || "Messwert")}</span>${item.detail ? `<small>${escapeHtml(item.detail)}</small>` : ""}${valid === null ? "" : `<i class="post-stat-progress" style="--progress:${valid}%"></i>`}</div>`; }).join("")}</div>`, schemas: [] }; }
  if (type === "quote") return { html: `<blockquote class="post-quote"><p>${escapeHtml(block.text || "")}</p>${block.author ? `<cite>— ${escapeHtml(block.author)}</cite>` : ""}</blockquote>`, schemas: [] };
  if (type === "callout") return { html: `<aside class="post-callout"><span class="technical-label">${escapeHtml(block.label || "Signal")}</span><p>${escapeHtml(block.text || block.content || "")}</p></aside>`, schemas: [] };
  if (type === "timeline") { const items = Array.isArray(block.items) ? block.items : []; return { html: `<ol class="post-timeline">${items.slice(0, 16).map((item) => `<li><span>${escapeHtml(item.date || item.label || "")}</span><div><strong>${escapeHtml(item.title || "")}</strong><p>${escapeHtml(item.text || item.description || "")}</p></div></li>`).join("")}</ol>`, schemas: [] }; }
  if (type === "downloads") { const items = Array.isArray(block.items) ? block.items : []; return { html: `<div class="post-downloads">${items.slice(0, 12).map((item) => { const url = publicUrl(item.url); return url ? `<a class="button secondary" href="${escapeHtml(url)}" target="_blank" rel="noopener">${escapeHtml(item.label || item.name || "Download")} ↗</a>` : ""; }).join("")}</div>`, schemas: [] }; }
  if (type === "model") { const model = publicUrl(block.src || block.model); return { html: model ? `<div class="post-model"><model-viewer src="${escapeHtml(model)}" camera-controls auto-rotate loading="lazy" aria-label="${escapeHtml(block.alt || "HUNTER 3D-Modell")}"></model-viewer></div>` : "", schemas: [] }; }
  return { html: "", schemas: [] };
};

const renderPost = (post) => {
  const slug = String(post.slug || "");
  const canonical = `${siteUrl}/blog/${encodeURIComponent(slug)}/`;
  const language = String(post.language || post.lang || "de").toLowerCase().startsWith("en") ? "en" : "de";
  const title = String(post.title || "HUNTER Build Log");
  const excerpt = String(post.excerpt || "HUNTER Build Log");
  const image = absoluteUrl(post.hero_image);
  const revision = validIsoDate(post.updated_at || post.created_at || post.published_at);
  const published = validIsoDate(post.published_at || post.created_at);
  const blocks = Array.isArray(post.blocks) && post.blocks.length ? post.blocks : [{ type: "rich_text", text: post.content || "" }];
  const rendered = blocks.map(renderBlock);
  const articleSchema = {
    "@context": "https://schema.org", "@type": "BlogPosting", headline: title,
    author: { "@type": "Person", name: "Marcel", url: "https://d4sn3st.dev" },
    publisher: { "@type": "Organization", name: "HUNTER Cyberdeck", url: siteUrl },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
  };
  if (excerpt) articleSchema.description = excerpt;
  if (image) articleSchema.image = [image];
  if (published) articleSchema.datePublished = published;
  if (revision) articleSchema.dateModified = revision;
  const faqSchemas = rendered.flatMap((item) => item.schemas);
  const reference = slug.split("-").filter(Boolean).slice(0, 2).join("-").toUpperCase() || "LIVE";
  const category = String(post.category || "Build Log");
  const hero = publicUrl(post.hero_image);
  const metaDate = published ? new Intl.DateTimeFormat(language === "en" ? "en-US" : "de-DE").format(new Date(published)) : "live";
  return `<!doctype html>
<html lang="${language}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escapeHtml(excerpt)}">
  <meta name="author" content="HUNTER Cyberdeck Project">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <meta name="theme-color" content="#ff5a1f">
  <link rel="canonical" href="${escapeHtml(canonical)}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="HUNTER Cyberdeck">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(excerpt)}">
  <meta property="og:url" content="${escapeHtml(canonical)}">
  ${image ? `<meta property="og:image" content="${escapeHtml(image)}">\n  <meta property="og:image:alt" content="${escapeHtml(post.hero_alt || title)}">` : ""}
  <meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(excerpt)}">
  ${image ? `<meta name="twitter:image" content="${escapeHtml(image)}">` : ""}
  <script type="application/ld+json">${safeJson(articleSchema)}</script>
  ${faqSchemas.map((schema) => `<script type="application/ld+json">${safeJson(schema)}</script>`).join("\n  ")}
  <link rel="stylesheet" href="/assets/styles.css">
  <link rel="icon" type="image/png" href="/assets/hunter-logo-white.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
  <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.3.1/model-viewer.min.js"></script>
  <script src="/assets/site.js" defer></script>
  <script src="/assets/i18n.js" defer></script>
  <script src="/assets/blog.js" defer></script>
  <title>${escapeHtml(title)} – HUNTER Cyberdeck</title>
</head>
<body data-page="blog-post">
  <div data-site-header></div>
  <main class="shell">
    <article class="post-page dossier-page" data-post-page data-post-slug="${escapeHtml(slug)}" data-post-template="${escapeHtml(String(post.template || "build-log").toLowerCase().replace(/[^a-z0-9_-]/g, ""))}" data-post-layout="${escapeHtml(String(post.layout_key || "editorial").toLowerCase().replace(/[^a-z0-9_-]/g, ""))}">
      <header class="post-hero dossier-hero">
        <div class="dossier-rail" aria-label="Artikelkennung"><span>HNT/LOG/<b data-post-reference>${escapeHtml(reference)}</b></span><span>REVISION <b data-post-revision>${escapeHtml(revision ? revision.slice(0, 10).replace(/-/g, ".") : "0.1")}</b></span><span>STATUS: <b data-post-status>PUBLISHED</b></span></div>
        <a class="post-back" href="/blog.html">← Zurück zum Build Log</a>
        <span class="eyebrow" data-post-category>${escapeHtml(category)} // ${escapeHtml(post.template || "HUNTER")}</span>
        <h1 class="post-title" data-post-title>${escapeHtml(title)}</h1>
        <p class="post-lead" data-post-excerpt>${escapeHtml(excerpt)}</p>
        <div class="post-meta" data-post-meta>${escapeHtml(post.author_name || "HUNTER")} // ${escapeHtml(String(post.reading_time_minutes || 5))} ${language === "en" ? "min." : "Min."} // ${escapeHtml(metaDate)}</div>
      </header>
      ${hero ? `<figure class="post-hero-figure" data-post-hero><img data-post-hero-image src="${escapeHtml(hero)}" alt="${escapeHtml(post.hero_alt || title)}" loading="eager">${post.hero_caption ? `<figcaption data-post-hero-caption>${escapeHtml(post.hero_caption)}</figcaption>` : ""}</figure>` : ""}
      <section class="dossier-system-sheet" aria-label="HUNTER Systemübersicht"><div class="dossier-sheet-label"><span class="technical-label">SYSTEM NOTE // CURRENT BUILD</span><span class="dossier-signal">● LIVE ARCHIVE</span></div><div class="dossier-specs"><div><span>DEVICE</span><strong>GOOGLE PIXEL 6A</strong></div><div><span>INPUT</span><strong>RII K06</strong></div><div><span>ROOT ACCESS</span><strong>NONE</strong></div><div><span>RUNTIME</span><strong>TERMUX / HERMES</strong></div></div></section>
      <div class="dossier-intro"><span class="technical-label">READ THIS AS FIELD NOTES</span><p>Kein fertiges Produkt und keine Hochglanz-Rückschau: Dieser Eintrag hält fest, was gebaut, getestet, verworfen und als Nächstes überprüft wird.</p></div>
      <div class="post-blocks" data-post-blocks>${rendered.map((item, index) => `<section class="post-block-frame post-block-frame-${escapeHtml(String(blocks[index]?.type || "unknown").toLowerCase().replace(/[^a-z0-9_-]/g, "") || "unknown")}">${item.html}</section>`).join("")}</div>
      <section class="post-community" data-community><div class="community-proof"><span class="eyebrow">Community Signal</span><h2>Nachgebaut oder getestet?</h2><p>Teile deine Erfahrung mit genau diesem Build-Log. Reviews werden vor der Veröffentlichung moderiert.</p><div class="review-list" data-community-reviews><p class="community-empty">Noch keine Reviews für diesen Eintrag.</p></div><div class="community-discussion" data-community-discussion><span class="technical-label">GitHub Discussions</span><p>Fragen, Reaktionen und Verbesserungen werden direkt über GitHub Discussions eingebettet.</p><a class="text-link" href="/github.html">GitHub-Bereich öffnen ↗</a></div></div><form class="review-form" data-review-form><span class="eyebrow">Dein Testbericht</span><h3>Erfahrung zurückmelden</h3><label>Bewertung <select name="rating" required><option value="">Auswählen …</option><option value="5">★★★★★ 5 — läuft rund</option><option value="4">★★★★☆ 4 — sehr gut</option><option value="3">★★★☆☆ 3 — mit Ecken</option><option value="2">★★☆☆☆ 2 — Baustelle</option><option value="1">★☆☆☆☆ 1 — nicht lauffähig</option></select></label><label>Titel <input name="title" maxlength="120" required placeholder="Mein Test"></label><label>Dein Name oder Alias <input name="author_name" maxlength="80" required placeholder="z. B. Alex / @handle"></label><label>Erfahrung <textarea name="body" minlength="20" maxlength="4000" required placeholder="Was hast du ausprobiert?"></textarea></label><div class="review-form-row"><label>Gerät <input name="device_model" maxlength="120" placeholder="Google Pixel 6a"></label><label>Build-Link <input name="project_url" type="url" maxlength="500" placeholder="https://…"></label></div><label class="review-honeypot" aria-hidden="true">Website <input name="website" tabindex="-1" autocomplete="off"></label><button class="button" type="submit">Review einreichen ↗</button><p class="form-status" data-review-form-status role="status"></p></form></section>
    </article>
  </main>
  <div data-site-footer></div>
  <script src="/assets/community.js" defer></script>
</body>
</html>`;
};

const ignored = new Set([".git", ".netlify", "dist", "node_modules", "scripts"]);
const copyFilter = (source) => !source.split(path.sep).some((part) => ignored.has(part));

const copyWebsite = async () => {
  const entries = await readdir(sourceDir, { withFileTypes: true });
  await Promise.all(entries
    .filter((entry) => !ignored.has(entry.name))
    .map((entry) => cp(path.join(sourceDir, entry.name), path.join(outputDir, entry.name), { recursive: true, filter: copyFilter })));
};

async function main() {
  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });
  await copyWebsite();
  const endpoint = `${supabaseUrl}/rest/v1/blog_posts?select=*&status=eq.published&order=published_at.desc,created_at.desc`;
  const response = await fetch(endpoint, { headers: { apikey: publishableKey, Authorization: `Bearer ${publishableKey}` } });
  if (!response.ok) throw new Error(`Supabase ${response.status}: published posts could not be generated.`);
  const posts = await response.json();
  const publishedPosts = posts.filter((post) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(String(post?.slug || "")));
  await Promise.all(publishedPosts.map(async (post) => {
    const directory = path.join(outputDir, "blog", post.slug);
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, "index.html"), renderPost(post), "utf8");
  }));
  await mkdir(path.join(outputDir, "blog"), { recursive: true });
  await writeFile(path.join(outputDir, "blog", "_manifest.json"), `${JSON.stringify({
    generated_at: new Date().toISOString(),
    posts: publishedPosts.map((post) => ({
      slug: post.slug,
      updated_at: validIsoDate(post.updated_at || post.published_at || post.created_at),
    })),
  })}\n`, "utf8");
  console.log(`Generated ${publishedPosts.length} static blog posts.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
