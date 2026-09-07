const SITE_URL = "https://hunter-cyberdeck.d4sn3st.dev";
const SUPABASE_URL = "https://ocgirjlfdugiaieynbnl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_sihx39p63ZEO4M3I1APVlw_GhySEcfu";

const validIsoDate = (value) => {
  const date = new Date(value || "");
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
};

const hasChanged = (posts, manifest) => {
  const rendered = new Map((manifest?.posts || []).map((post) => [post.slug, post.updated_at]));
  if (rendered.size !== posts.length) return true;
  return posts.some((post) => rendered.get(post.slug) !== validIsoDate(post.updated_at || post.published_at || post.created_at));
};

export default async () => {
  const hookUrl = process.env.HUNTER_NETLIFY_BUILD_HOOK || "";
  if (!hookUrl) return new Response("Build hook is not configured.", { status: 500 });
  try {
    const [postsResponse, manifestResponse] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/blog_posts?select=slug,published_at,updated_at,created_at&status=eq.published&order=slug.asc`, {
        headers: { apikey: SUPABASE_PUBLISHABLE_KEY, Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}` },
      }),
      fetch(`${SITE_URL}/blog/_manifest.json?check=${Date.now()}`, { cache: "no-store" }),
    ]);
    if (!postsResponse.ok) throw new Error(`Supabase returned ${postsResponse.status}`);
    const posts = (await postsResponse.json()).filter((post) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(String(post?.slug || "")));
    const manifest = manifestResponse.ok ? await manifestResponse.json() : null;
    if (!hasChanged(posts, manifest)) return new Response("Static blog is current.", { status: 200 });
    const trigger = await fetch(hookUrl, { method: "POST" });
    if (!trigger.ok) throw new Error(`Netlify build hook returned ${trigger.status}`);
    return new Response("Static blog rebuild requested.", { status: 202 });
  } catch (error) {
    console.error("Static blog rebuild check failed", error);
    return new Response("Static blog rebuild check failed.", { status: 500 });
  }
};

export const config = { schedule: "*/5 * * * *" };
