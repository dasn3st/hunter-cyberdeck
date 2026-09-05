const SITE_URL = "https://hunter-cyberdeck.d4sn3st.dev";
const SUPABASE_URL = process.env.SUPABASE_URL || "https://ocgirjlfdugiaieynbnl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || "sb_publishable_sihx39p63ZEO4M3I1APVlw_GhySEcfu";

const staticEntries = [
  ["/", "2026-09-01", "1.0"],
  ["/blog.html", "2026-09-01", "0.9"],
  ["/post.html", "2026-09-01", "0.8"],
  ["/tech.html", "2026-09-01", "0.8"],
  ["/makerworld.html", "2026-09-01", "0.8"],
  ["/archive.html", "2026-09-01", "0.7"],
  ["/github.html", "2026-09-01", "0.7"],
  ["/about.html", "2026-09-01", "0.6"],
  ["/index.html?lang=en", "2026-09-01", "1.0"],
  ["/blog.html?lang=en", "2026-09-01", "0.9"],
  ["/tech.html?lang=en", "2026-09-01", "0.8"],
  ["/makerworld.html?lang=en", "2026-09-01", "0.8"],
  ["/archive.html?lang=en", "2026-09-01", "0.7"],
  ["/github.html?lang=en", "2026-09-01", "0.7"],
  ["/about.html?lang=en", "2026-09-01", "0.6"],
];

const escapeXml = (value) => String(value).replace(/[<>&'\"]/g, (character) => ({
  "<": "&lt;",
  ">": "&gt;",
  "&": "&amp;",
  "'": "&apos;",
  "\"": "&quot;",
}[character]));

const validIsoDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
};

const renderUrl = ([loc, lastmod, priority]) => [
  "  <url>",
  `    <loc>${escapeXml(`${SITE_URL}${loc}`)}</loc>`,
  lastmod ? `    <lastmod>${escapeXml(lastmod)}</lastmod>` : "",
  priority ? `    <priority>${escapeXml(priority)}</priority>` : "",
  "  </url>",
].filter(Boolean).join("\n");

exports.handler = async () => {
  let postEntries = [];
  try {
    const endpoint = `${SUPABASE_URL}/rest/v1/blog_posts?select=slug,published_at,updated_at&status=eq.published&order=published_at.desc`;
    const response = await fetch(endpoint, {
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
      },
    });
    if (!response.ok) throw new Error(`Supabase ${response.status}`);
    const posts = await response.json();
    postEntries = posts
      .filter((post) => post && /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(String(post.slug || "")))
      .map((post) => [
        `/post.html?slug=${encodeURIComponent(post.slug)}`,
        validIsoDate(post.updated_at) || validIsoDate(post.published_at),
        "0.7",
      ]);
  } catch (error) {
    console.error("Sitemap blog query failed", error);
  }

  const body = [...staticEntries, ...postEntries]
    .map(renderUrl)
    .join("\n");
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/xml; charset=UTF-8",
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
    body: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
  };
};
