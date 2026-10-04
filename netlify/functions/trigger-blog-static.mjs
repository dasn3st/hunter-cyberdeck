const SUPABASE_URL = "https://ocgirjlfdugiaieynbnl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_sihx39p63ZEO4M3I1APVlw_GhySEcfu";

const isHunterSession = async (request) => {
  const authorization = request.headers.get("authorization") || "";
  if (!authorization.startsWith("Bearer ")) return false;
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Authorization: authorization,
    },
  });
  return response.ok;
};

export default async (request) => {
  if (request.method !== "POST") return new Response("POST required.", { status: 405 });
  if (!(await isHunterSession(request))) return new Response("Unauthorized.", { status: 401 });

  const hookUrl = Netlify.env.get("HUNTER_NETLIFY_BUILD_HOOK") || "";
  if (!hookUrl) return new Response("Build hook is not configured.", { status: 500 });

  const trigger = await fetch(hookUrl, { method: "POST" });
  if (!trigger.ok) return new Response("Static build could not be started.", { status: 502 });
  return Response.json({ ok: true, static_build: "queued" }, { status: 202 });
};
