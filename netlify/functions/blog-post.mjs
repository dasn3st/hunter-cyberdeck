const SITE_URL = "https://hunter-cyberdeck.d4sn3st.dev";
const HUNTER_ORIGINS = new Set([SITE_URL, "https://hunter-cyberdeck.netlify.app"]);
const SUPABASE_URL = "https://ocgirjlfdugiaieynbnl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_sihx39p63ZEO4M3I1APVlw_GhySEcfu";

const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
})[character]);
const jsonForHtml = (value) => JSON.stringify(value).replace(/[<>&]/g, (character) => ({
  "<": "\\u003c", ">": "\\u003e", "&": "\\u0026",
})[character]);
const safeUrl = (value = "") => {
  const url = String(value).trim();
  if (url.startsWith("assets/")) return `/${url}`;
  return /^(https?:\/\/|\/|assets\/)/i.test(url) && !/^javascript:/i.test(url) ? url : "";
};
const publicUrl = (value = "") => {
  const raw = String(value).trim();
  try {
    const parsed = new URL(raw, SITE_URL);
    const slug = parsed.searchParams.get("slug");
    if (HUNTER_ORIGINS.has(parsed.origin) && ["/post.html", "/blog/post.html"].includes(parsed.pathname) && /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(String(slug || ""))) {
      return `/blog/${encodeURIComponent(slug)}/`;
    }
  } catch {}
  return safeUrl(raw);
};
const absoluteUrl = (value = "") => {
  const url = publicUrl(value);
  if (!url) return "";
  try { return new URL(url, SITE_URL).href; } catch { return ""; }
};
const paragraphs = (value = "") => String(value).split(/\n{2,}/).filter(Boolean)
  .map((part) => `<p>${escapeHtml(part).replace(/\n/g, "<br>")}</p>`).join("");
const figure = (src, alt, caption = "") => {
  const url = publicUrl(src);
  if (!url) return "";
  return `<figure class="post-figure"><img src="${escapeHtml(url)}" alt="${escapeHtml(alt || "HUNTER Blogbild")}" loading="lazy" decoding="async">${caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ""}</figure>`;
};

const renderBlock = (block = {}) => {
  const type = String(block.type || "rich_text");
  if (type === "rich_text") return `<div class="post-prose">${paragraphs(block.text || block.content)}</div>`;
  if (type === "heading") { const level = Number(block.level) === 3 ? 3 : 2; return `<h${level} class="post-heading">${escapeHtml(block.text)}</h${level}>`; }
  if (type === "image") return figure(block.src || block.image, block.alt, block.caption);
  if (type === "image_text") return `<section class="post-image-text ${block.position === "left" ? "image-left" : "image-right"}">${figure(block.src || block.image, block.alt, block.caption)}<div class="post-prose">${paragraphs(block.text || block.content)}</div></section>`;
  if (type === "gallery") return `<div class="post-gallery${block.layout === "three-up" ? " post-gallery-three-up" : ""}">${(Array.isArray(block.images) ? block.images : []).slice(0, 12).map((item) => typeof item === "string" ? figure(item, "HUNTER Galerie") : figure(item?.src, item?.alt, item?.caption)).join("")}</div>`;
  if (type === "code") return `<div class="post-code"><div class="post-code-label"><span>${escapeHtml(block.language || "code")}</span>${block.filename ? `<span>${escapeHtml(block.filename)}</span>` : ""}</div><pre><code>${escapeHtml(block.code)}</code></pre></div>`;
  if (type === "quote") return `<blockquote class="post-quote"><p>${escapeHtml(block.text)}</p>${block.author ? `<cite>— ${escapeHtml(block.author)}</cite>` : ""}</blockquote>`;
  if (type === "callout") return `<aside class="post-callout"><span class="technical-label">${escapeHtml(block.label || "SIGNAL")}</span><p>${escapeHtml(block.text || block.content)}</p></aside>`;
  if (type === "timeline") return `<ol class="post-timeline">${(Array.isArray(block.items) ? block.items : []).slice(0, 16).map((item) => `<li><span>${escapeHtml(item.date || item.label)}</span><div><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.text || item.description)}</p></div></li>`).join("")}</ol>`;
  if (type === "table") { const headers = Array.isArray(block.headers) ? block.headers : []; const rows = Array.isArray(block.rows) ? block.rows : []; return headers.length ? `<div class="post-table-wrap"><table class="post-table"><thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead><tbody>${rows.slice(0, 50).map((row) => `<tr>${headers.map((_, index) => `<td>${escapeHtml(Array.isArray(row) ? row[index] : "")}</td>`).join("")}</tr>`).join("")}</tbody></table></div>` : ""; }
  if (type === "stats") return `<div class="post-stats">${(Array.isArray(block.items) ? block.items : []).slice(0, 8).map((item) => `<div class="post-stat-card"><strong>${escapeHtml(item.value ?? "—")}</strong><span>${escapeHtml(item.label)}</span>${item.detail ? `<small>${escapeHtml(item.detail)}</small>` : ""}</div>`).join("")}</div>`;
  if (type === "faq") return `<section class="post-faq"><span class="technical-label">FAQ</span>${(Array.isArray(block.items) ? block.items : []).slice(0, 20).map((item) => `<details><summary>${escapeHtml(item.question)}</summary><div class="post-faq-answer">${paragraphs(item.answer)}</div></details>`).join("")}</section>`;
  if (type === "link" || type === "downloads") { const items = type === "downloads" ? block.items : [block]; return `<div class="post-downloads">${(Array.isArray(items) ? items : []).slice(0, 12).map((item) => { const url = publicUrl(item.url); return url ? `<a class="button secondary" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.label || item.text || item.name || url)} ↗</a>` : ""; }).join("")}</div>`; }
  if (type === "cta") { const url = publicUrl(block.button_url); return `<aside class="post-cta"><div><span class="technical-label">NEXT MOVE</span><h3>${escapeHtml(block.title || "Weiterbauen")}</h3><p>${escapeHtml(block.text)}</p></div>${url ? `<a class="button" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(block.button_text || "Öffnen")} ↗</a>` : ""}</aside>`; }
  return "";
};

const renderPost = (post, postSlugs = new Set()) => {
  const slug = String(post.slug || "");
  const canonical = `${SITE_URL}/blog/${encodeURIComponent(slug)}/`;
  const title = String(post.title || "HUNTER Build Log");
  const excerpt = String(post.excerpt || "HUNTER Build Log");
  const hero = publicUrl(post.hero_image);
  const image = absoluteUrl(post.hero_image);
  const publishedAt = post.published_at || post.created_at || "";
  const updatedAt = post.updated_at || publishedAt;
  const language = slug.endsWith("-en") ? "en" : "de";
  const germanSlug = language === "en" ? slug.replace(/-en$/i, "") : slug;
  const englishSlug = language === "en" ? slug : `${slug}-en`;
  const languageLinks = [
    postSlugs.has(germanSlug) ? `<link rel="alternate" hreflang="de" href="${SITE_URL}/blog/${encodeURIComponent(germanSlug)}/">` : "",
    postSlugs.has(englishSlug) ? `<link rel="alternate" hreflang="en" href="${SITE_URL}/blog/${encodeURIComponent(englishSlug)}/">` : "",
  ].filter(Boolean).join("\n");
  const blocks = Array.isArray(post.blocks) && post.blocks.length ? post.blocks : [{ type: "rich_text", content: post.content || "" }];
  const schema = {
    "@context": "https://schema.org", "@type": "BlogPosting", headline: title,
    description: excerpt, author: { "@type": "Person", name: "Marcel", url: "https://d4sn3st.dev" },
    publisher: { "@type": "Organization", name: "HUNTER Cyberdeck", url: SITE_URL },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    ...(image ? { image: [image] } : {}), ...(publishedAt ? { datePublished: publishedAt } : {}), ...(updatedAt ? { dateModified: updatedAt } : {}),
  };
  return `<!doctype html><html lang="${language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="${escapeHtml(excerpt)}"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${escapeHtml(canonical)}">${languageLinks ? `\n${languageLinks}` : ""}<meta property="og:type" content="article"><meta property="og:site_name" content="HUNTER Cyberdeck"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(excerpt)}"><meta property="og:url" content="${escapeHtml(canonical)}">${image ? `<meta property="og:image" content="${escapeHtml(image)}"><meta property="og:image:alt" content="${escapeHtml(post.hero_alt || title)}">` : ""}<meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}"><meta name="twitter:title" content="${escapeHtml(title)}"><meta name="twitter:description" content="${escapeHtml(excerpt)}">${image ? `<meta name="twitter:image" content="${escapeHtml(image)}">` : ""}<script type="application/ld+json">${jsonForHtml(schema)}</script><link rel="stylesheet" href="/assets/styles.css"><script src="/assets/site.js" defer></script><script src="/assets/i18n.js" defer></script><script src="/assets/blog.js" defer></script><title>${escapeHtml(title)} – HUNTER Cyberdeck</title></head><body data-page="blog-post"><div data-site-header></div><main class="shell"><article class="post-page dossier-page" data-post-page data-post-slug="${escapeHtml(slug)}"><header class="post-hero dossier-hero"><a class="post-back" href="/blog.html">← Zurück zum Build Log</a><span class="eyebrow" data-post-category>${escapeHtml(post.category || "Build Log")}</span><h1 class="post-title" data-post-title>${escapeHtml(title)}</h1><p class="post-lead" data-post-excerpt>${escapeHtml(excerpt)}</p><div class="post-meta">${escapeHtml(post.author_name || "HUNTER")} // ${escapeHtml(post.reading_time_minutes || 5)} Min.</div></header>${hero ? `<figure class="post-hero-figure"><img src="${escapeHtml(hero)}" alt="${escapeHtml(post.hero_alt || title)}" loading="eager"></figure>` : ""}<div class="post-blocks" data-post-blocks>${blocks.map((block) => `<section class="post-block-frame post-block-frame-${escapeHtml(String(block?.type || "rich_text"))}">${renderBlock(block)}</section>`).join("")}</div></article></main><div data-site-footer></div></body></html>`;
};

export default async (request) => {
  const slug = new URL(request.url).pathname.replace(/^\/blog\//, "").replace(/\/$/, "");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(slug)) return new Response("Not found.", { status: 404 });
  const endpoint = `${SUPABASE_URL}/rest/v1/blog_posts?select=*&slug=eq.${encodeURIComponent(slug)}&status=eq.published&limit=1`;
  const response = await fetch(endpoint, { headers: { apikey: SUPABASE_PUBLISHABLE_KEY, Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}` } });
  if (!response.ok) return new Response("Post lookup failed.", { status: 502 });
  const [post] = await response.json();
  if (!post) return new Response("Not found.", { status: 404 });
  const language = slug.endsWith("-en") ? "en" : "de";
  const alternateSlugs = language === "en" ? [slug.replace(/-en$/i, "")] : [`${slug}-en`];
  const alternateResponse = await Promise.all(alternateSlugs.map((alternateSlug) => fetch(`${SUPABASE_URL}/rest/v1/blog_posts?select=slug&slug=eq.${encodeURIComponent(alternateSlug)}&status=eq.published&limit=1`, { headers: { apikey: SUPABASE_PUBLISHABLE_KEY, Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}` } }).then((result) => result.ok ? result.json() : []).catch(() => [])));
  const postSlugs = new Set([slug, ...alternateResponse.flat().map((item) => String(item?.slug || ""))]);
  return new Response(renderPost(post, postSlugs), { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store, must-revalidate", "X-Hunter-Render": "on-demand-live" } });
};

// Static articles are the canonical public output. The scheduled rebuild
// refreshes them after a published post changes; the function is a fallback.
export const config = { path: "/blog/:slug", preferStatic: true };
