(() => {
  const page = document.body.dataset.page;
  const config = {
    url: "https://ocgirjlfdugiaieynbnl.supabase.co",
    key: "sb_publishable_sihx39p63ZEO4M3I1APVlw_GhySEcfu",
  };
  const selectors = {
    home: {
      hero_title: ".hero-copy .display-title",
      hero_lead: ".hero-copy .lead",
      hero_tag: ".visual-tag.one",
      runtime_tag: ".visual-tag.two",
      terminal_prompt: '[data-agent-field="prompt"]',
    },
    blog: { hero_title: ".page-hero-copy .page-title", hero_description: ".page-hero-aside p" },
    tech: { hero_title: ".page-hero-copy .page-title", hero_description: ".page-hero-aside p" },
    github: { hero_title: ".coming-copy .display-title", hero_lead: ".coming-copy .lead" },
    makerworld: { hero_title: ".page-hero-copy .page-title", hero_description: ".page-hero-aside p" },
    archive: { hero_title: ".page-hero-copy .page-title", hero_description: ".page-hero-aside p" },
    about: { hero_title: ".page-hero-copy .page-title", hero_description: ".page-hero-aside p" },
  };
  if (!page || !selectors[page]) return;

  const safeUrl = (value = "") => {
    const url = String(value).trim();
    return /^(https?:\/\/|\/|assets\/)/i.test(url) && !/^javascript:/i.test(url) ? url : "";
  };
  const targetFor = (slot) => {
    const selector = selectors[page]?.[slot];
    return selector ? document.querySelector(selector) : null;
  };
  const applyRow = (row) => {
    // Realtime also emits draft rows. Never apply non-published content to the
    // public DOM; REST polling remains the source of truth for visible rows.
    if (row?.status && row.status !== "published") return;
    const content = row?.content && typeof row.content === "object" ? row.content : {};
    const lang = window.HUNTER_LANG === "en" ? "en" : "de";
    const localizedText = typeof content[`text_${lang}`] === "string" ? content[`text_${lang}`] : (lang === "de" ? content.text : "");
    const target = targetFor(row.slot_key);
    if (target) {
      // Do not let a German-only CMS row overwrite the English interface.
      // Agents can provide text_de/text_en when a slot needs both variants.
      if (localizedText) target.textContent = localizedText;
      if (content.image) {
        const image = safeUrl(content.image);
        const imageTarget = target.matches("img") ? target : target.querySelector("img");
        if (imageTarget && image) imageTarget.src = image;
        else if (image) target.style.backgroundImage = `url("${image.replace(/"/g, "")}")`;
      }
      if (typeof content.visible === "boolean") target.hidden = !content.visible;
    }
    const blocks = Array.isArray(content[`blocks_${lang}`]) ? content[`blocks_${lang}`] : (lang === "de" ? content.blocks : null);
    if (row.slot_key === "sections" && Array.isArray(blocks)) renderSections(blocks);
  };
  const renderSections = (blocks) => {
    let host = document.querySelector("[data-agent-sections]");
    if (!host) {
      host = document.createElement("section");
      host.className = "section agent-content-section";
      host.dataset.agentSections = "";
      document.querySelector("main.shell")?.append(host);
    }
    const fallback = (block) => {
      if (block?.type === "image") {
        const src = safeUrl(block.src || block.image);
        return src ? `<figure class="post-figure"><img src="${src.replace(/"/g, "&quot;")}" alt="HUNTER Blogbild" loading="lazy"></figure>` : "";
      }
      if (block?.type === "callout") return `<aside class="post-callout"><span class="technical-label">${String(block.label || "Signal").replace(/[<>]/g, "")}</span><p>${String(block.text || "").replace(/[<>]/g, "")}</p></aside>`;
      return `<div class="post-prose"><p>${String(block?.text || block?.content || "").replace(/[<>]/g, "")}</p></div>`;
    };
    host.innerHTML = blocks.slice(0, 20).map((block) => window.HUNTER_RENDER_BLOCK ? window.HUNTER_RENDER_BLOCK(block) : fallback(block)).join("");
  };
  const request = async () => {
    const response = await fetch(`${config.url}/rest/v1/site_content?select=page_key,slot_key,content&status=eq.published&page_key=eq.${encodeURIComponent(page)}`, {
      headers: { apikey: config.key, Authorization: `Bearer ${config.key}` }, cache: "no-store",
    });
    if (!response.ok) throw new Error(`Supabase ${response.status}`);
    return response.json();
  };
  const refresh = async () => { try { (await request()).forEach(applyRow); } catch (error) { console.info("HUNTER nutzt lokale Seiteninhalte.", error); } };
  refresh();
  window.setInterval(refresh, 30000);
  import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm").then(({ createClient }) => {
    createClient(config.url, config.key).channel(`site-content-${page}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "site_content", filter: `page_key=eq.${page}` }, (payload) => {
        if (payload.eventType === "DELETE" || payload.new?.status !== "published") {
          refresh();
          return;
        }
        applyRow(payload.new);
      }).subscribe();
  }).catch(() => {});
})();
