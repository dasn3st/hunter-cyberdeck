// Cloudflare Pages: ersetzt die Netlify-Weiterleitungen, die auf Query-Parametern beruhen (?lang=en, ?slug=),
// und liefert für interne Dateien die 404-Seite. Läuft nur für die Pfade in _routes.json.
const EN_PAGES = {
  "/": "", "/index.html": "", "/blog.html": "blog", "/blog": "blog", "/tech.html": "tech", "/tech": "tech",
  "/hardware": "hardware", "/hardware.html": "hardware", "/hardware/": "hardware",
  "/makerworld.html": "makerworld", "/makerworld": "makerworld", "/archive.html": "archive", "/archive": "archive",
  "/github.html": "github", "/github": "github", "/about.html": "about", "/about": "about",
};
const BLOCKED_EXACT = new Set([
  "/HUNTER_AGENT_EINWEISUNG.md", "/HUNTER_AGENT_STATUS.md", "/HUNTER_AGENT_VOLLSTAENDIGE_UEBERGABE.md",
  "/HUNTER_AGENT_WEITERGABE_COMMUNITY.md", "/NOTEBOOKLM_AGENT_WORKFLOW.md", "/BLOG_DELUXE_VORLAGE.json",
]);
const BLOCKED_PREFIX = ["/scripts/", "/.git/", "/.env"];

// Asset holen und dabei interne Weiterleitungen (z. B. /about.html -> /about) selbst folgen.
async function asset(env, url, path) {
  let target = new URL(path, url);
  for (let i = 0; i < 4; i += 1) {
    const response = await env.ASSETS.fetch(new Request(target.href));
    if (response.status >= 300 && response.status < 400 && response.headers.get("location")) {
      target = new URL(response.headers.get("location"), target);
      continue;
    }
    return response;
  }
  return new Response("Not found", { status: 404 });
}

export async function onRequest({ request, env, next }) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (BLOCKED_EXACT.has(path) || BLOCKED_PREFIX.some((prefix) => path === prefix.replace(/\/$/, "") || path.startsWith(prefix))) {
    const page = await asset(env, url, "/404");
    return new Response(page.body, { status: 404, headers: page.headers });
  }

  if (path === "/post.html") {
    const slug = url.searchParams.get("slug") || "";
    if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(slug)) {
      const target = slug === "git-config-kapert-agenten" ? "git-config-fallen-coding-agenten" : slug;
      return Response.redirect(`${url.origin}/blog/${target}/`, 301);
    }
  }

  if (url.searchParams.get("lang") === "en" && path in EN_PAGES) {
    const name = EN_PAGES[path];
    const response = await asset(env, url, name ? `/_en/${name}` : "/_en/");
    if (response.status === 200) return response;
  }

  return next();
}
