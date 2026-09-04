(() => {
  const config = {
    url: "https://ocgirjlfdugiaieynbnl.supabase.co",
    key: "sb_publishable_sihx39p63ZEO4M3I1APVlw_GhySEcfu",
  };
  const categoryLabels = { hardware: "Hardware", case: "Case", software: "Software", agent: "Agent" };
  const categoryLabelsEn = { hardware: "Hardware", case: "Case", software: "Software", agent: "Agent" };
  const categoryLabel = (category) => (window.HUNTER_LANG === "en" ? categoryLabelsEn : categoryLabels)[category] || "Build Log";
  const suppliedGallery = [
    "assets/hunter-gallery/hunter-cyberdeck-04.jpg", "assets/hunter-gallery/hunter-cyberdeck-06.jpg",
    "assets/hunter-gallery/hunter-cyberdeck-03.jpg", "assets/hunter-gallery/hunter-cyberdeck-05.jpg",
    "assets/hunter-gallery/hunter-cyberdeck-09.jpg", "assets/hunter-gallery/hunter-cyberdeck-07.jpg",
    "assets/hunter-gallery/hunter-cyberdeck-01.jpg",
  ];

  const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  })[character]);

  const safeUrl = (value = "") => {
    const url = String(value).trim();
    if (/^(https?:\/\/|\/|assets\/)/i.test(url) && !/^javascript:/i.test(url)) return url;
    return "";
  };

  const postLanguage = (post = {}) => {
    const explicit = String(post.language || post.lang || post.locale || "").toLowerCase();
    if (explicit.startsWith("en")) return "en";
    if (explicit.startsWith("de")) return "de";
    const source = [post.slug, post.title, post.excerpt, post.content].filter(Boolean).join(" ");
    const german = (source.match(/\b(der|die|das|und|ein|eine|zum|vom|für|ohne|mit|ich|wird|ist|des|auf|über|nach|handy|prozesse|läuft|werden)\b/giu) || []).length;
    const english = (source.match(/\b(the|this|and|a|an|from|built|runs|when|i|with|without|phone|processes|survives|becomes|is|on)\b/gi) || []).length;
    if (english > german) return "en";
    if (german > english) return "de";
    return window.HUNTER_LANG === "en" ? "en" : "de";
  };

  const imageMarkup = (src, alt, className = "") => {
    const url = safeUrl(src);
    return url
      ? `<img class="${className}" src="${escapeHtml(url)}" alt="${escapeHtml(alt || "HUNTER Blogbild")}" loading="lazy" decoding="async">`
      : "";
  };

  const imageFigure = (src, alt, caption = "", credit = "") => {
    const url = safeUrl(src);
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
        const parts = url.pathname.split("/").filter(Boolean);
        const penIndex = parts.indexOf("pen");
        const user = parts[0];
        const pen = penIndex >= 0 ? parts[penIndex + 1] : "";
        if (user && pen && /^[A-Za-z0-9_-]+$/.test(user) && /^[A-Za-z0-9_-]+$/.test(pen)) iframeUrl = `https://codepen.io/${user}/embed/${pen}?default-tab=result`;
      } else if (platform === "instagram" && url.hostname === "www.instagram.com") {
        const match = url.pathname.match(/^\/(?:p|reel)\/([A-Za-z0-9_-]+)/);
        if (match) iframeUrl = `https://www.instagram.com/${url.pathname.split("/").filter(Boolean)[0]}/${match[1]}/embed`;
      } else if (platform === "tiktok" && ["www.tiktok.com", "tiktok.com"].includes(url.hostname)) {
        const match = url.pathname.match(/\/video\/(\d+)/);
        if (match) iframeUrl = `https://www.tiktok.com/embed/v2/${match[1]}`;
      } else if (platform === "reddit" && ["www.reddit.com", "reddit.com"].includes(url.hostname)) {
        iframeUrl = `https://www.redditmedia.com${url.pathname}?ref_source=embed&ref=share&embed=true`;
      }
    } catch {}
    if (iframeUrl) content = `<iframe src="${escapeHtml(iframeUrl)}" title="${title}" loading="lazy" allow="fullscreen" referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
    if (!content) {
      const url = safeUrl(raw);
      return url ? `<div class="post-embed-fallback"><span class="technical-label">${escapeHtml(platform || "External Link")}</span><a class="post-link" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${title} ↗</a></div>` : "";
    }
    return `<div class="post-embed" data-embed-platform="${escapeHtml(platform)}">${content}</div>`;
  };

  const paragraphs = (value = "") => String(value).split(/\n{2,}/).map((part) => `<p>${escapeHtml(part).replace(/\n/g, "<br>")}</p>`).join("");

  const firstImage = (post) => {
    if (post.hero_image) return post.hero_image;
    const block = Array.isArray(post.blocks) && post.blocks.find((item) => item?.type === "image" || item?.type === "image_text");
    return block?.src || block?.image || "";
  };

  const cardMarkup = (post, index) => {
    const category = categoryLabels[post.category] ? post.category : "agent";
    // Use the supplied field photography for the public index cards. A post's
    // own hero image remains available inside its detail page.
    const image = suppliedGallery[index] || firstImage(post);
    const visual = image
      ? `<div class="story-visual">${imageMarkup(image, post.title)}</div>`
      : `<div class="story-visual visual-${category}"></div>`;
    return `<a class="story-card ${index === 0 ? "featured" : ""} blog-dynamic-card" data-category="${category}" data-blog-language="${postLanguage(post)}" href="post.html?slug=${encodeURIComponent(post.slug)}">
      ${visual}
      <div class="story-content">
        <span class="meta" style="color:var(--green)">${categoryLabel(category)} // ${escapeHtml(post.template || (window.HUNTER_LANG === "en" ? "Build log" : "Build Log"))}</span>
        <h2 class="story-title">${escapeHtml(post.title)}</h2>
        <p class="story-excerpt">${escapeHtml(post.excerpt || (window.HUNTER_LANG === "en" ? "A new HUNTER entry." : "Ein neuer HUNTER-Eintrag."))}</p>
        <div class="story-footer"><span>${escapeHtml((post.tags || []).slice(0, 2).join(" // ") || "HUNTER")}</span><span>${post.reading_time_minutes || 5} min. ↗</span></div>
      </div>
    </a>`;
  };

  const renderBlock = (block = {}) => {
    const type = block.type;
    if (type === "rich_text") return `<div class="post-prose">${paragraphs(block.text || block.content || "")}</div>`;
    if (type === "heading") {
      const level = Number(block.level) === 3 ? 3 : 2;
      return `<h${level} class="post-heading">${escapeHtml(block.text || "")}</h${level}>`;
    }
    if (type === "image") return imageFigure(block.src || block.image, block.alt, block.caption, block.credit);
    if (type === "image_text") {
      const image = imageFigure(block.src || block.image, block.alt, block.caption, block.credit);
      const copy = `<div class="post-prose">${paragraphs(block.text || block.content || "")}</div>`;
      return `<section class="post-image-text ${block.position === "left" ? "image-left" : "image-right"}">${image}${copy}</section>`;
    }
    if (type === "gallery") {
      const images = Array.isArray(block.images) ? block.images : [];
      const layout = block.layout === "three-up" ? " post-gallery-three-up" : "";
      return `<div class="post-gallery${layout}">${images.slice(0, 12).map((item) => {
        const source = typeof item === "string" ? item : item?.src;
        const alt = typeof item === "string" ? "HUNTER Galerie" : item?.alt;
        return imageFigure(source, alt, typeof item === "object" ? item?.caption : "", typeof item === "object" ? item?.credit : "").replace('class="post-figure"', 'class="post-figure post-gallery-figure"');
      }).join("")}</div>`;
    }
    if (type === "video") {
      const url = videoEmbedUrl(block.url);
      return url ? `<figure class="post-video"><iframe src="${escapeHtml(url)}" title="${escapeHtml(block.title || "HUNTER Video")}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>${block.caption ? `<figcaption>${escapeHtml(block.caption)}</figcaption>` : ""}</figure>` : "";
    }
    if (type === "link") {
      const url = safeUrl(block.url);
      return url ? `<p class="post-link-block"><a class="post-link" href="${escapeHtml(url)}"${block.new_tab === false ? "" : " target=\"_blank\" rel=\"noopener noreferrer\""}>${escapeHtml(block.text || block.url)} ↗</a></p>` : "";
    }
    if (type === "table") {
      const headers = Array.isArray(block.headers) ? block.headers.slice(0, 12) : [];
      const rows = Array.isArray(block.rows) ? block.rows.slice(0, 50) : [];
      if (!headers.length) return "";
      return `<div class="post-table-wrap"><table class="post-table"><thead><tr>${headers.map((header) => `<th scope="col">${escapeHtml(header)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${headers.map((_, index) => `<td>${escapeHtml(Array.isArray(row) ? row[index] || "" : "")}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
    }
    if (type === "faq") {
      const items = Array.isArray(block.items) ? block.items.slice(0, 20) : [];
      const schemaItems = items.filter((item) => item && item.question && item.answer).map((item) => ({
        "@type": "Question",
        name: String(item.question).slice(0, 500),
        acceptedAnswer: { "@type": "Answer", text: String(item.answer).slice(0, 2000) },
      }));
      const schema = schemaItems.length
        ? `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: schemaItems }).replace(/[<>&]/g, (character) => ({ "<": "\\u003c", ">": "\\u003e", "&": "\\u0026" })[character])}</script>`
        : "";
      return `<section class="post-faq"><span class="technical-label">FAQ</span>${items.map((item) => `<details><summary>${escapeHtml(item.question || "Frage")}</summary><div class="post-faq-answer">${paragraphs(item.answer || "")}</div></details>`).join("")}${schema}</section>`;
    }
    if (type === "cta") {
      const url = safeUrl(block.button_url);
      return `<aside class="post-cta"><div><span class="technical-label">NEXT MOVE</span><h3>${escapeHtml(block.title || "Weiterbauen")}</h3><p>${escapeHtml(block.text || "")}</p></div>${url ? `<a class="button" href="${escapeHtml(url)}"${/^https?:\/\//i.test(url) ? " target=\"_blank\" rel=\"noopener noreferrer\"" : ""}>${escapeHtml(block.button_text || "Öffnen")} ↗</a>` : ""}</aside>`;
    }
    if (type === "embed") return embedMarkup(block);
    if (type === "code") return `<div class="post-code"><div class="post-code-label"><span>${escapeHtml(block.language || "code")}</span>${block.filename ? `<span>${escapeHtml(block.filename)}</span>` : ""}</div><pre><code>${escapeHtml(block.code || "")}</code></pre></div>`;
    if (type === "stats") {
      const items = Array.isArray(block.items) ? block.items : [];
      return `<div class="post-stats">${items.slice(0, 8).map((item = {}) => {
        const numericProgress = Number(item.progress);
        const progress = Number.isFinite(numericProgress) ? Math.max(0, Math.min(100, numericProgress)) : null;
        return `<div class="post-stat-card"><strong>${escapeHtml(item.value ?? "—")}</strong><span>${escapeHtml(item.label || "Messwert")}</span>${item.detail ? `<small>${escapeHtml(item.detail)}</small>` : ""}${progress === null ? "" : `<i class="post-stat-progress" style="--progress:${progress}%"></i>`}</div>`;
      }).join("")}</div>`;
    }
    if (type === "quote") return `<blockquote class="post-quote"><p>${escapeHtml(block.text || "")}</p>${block.author ? `<cite>— ${escapeHtml(block.author)}</cite>` : ""}</blockquote>`;
    if (type === "callout") return `<aside class="post-callout"><span class="technical-label">${escapeHtml(block.label || "Signal")}</span><p>${escapeHtml(block.text || block.content || "")}</p></aside>`;
    if (type === "timeline") {
      const items = Array.isArray(block.items) ? block.items : [];
      return `<ol class="post-timeline">${items.slice(0, 16).map((item) => `<li><span>${escapeHtml(item.date || item.label || "")}</span><div><strong>${escapeHtml(item.title || "")}</strong><p>${escapeHtml(item.text || item.description || "")}</p></div></li>`).join("")}</ol>`;
    }
    if (type === "downloads") {
      const items = Array.isArray(block.items) ? block.items : [];
      return `<div class="post-downloads">${items.slice(0, 12).map((item) => `<a class="button secondary" href="${escapeHtml(safeUrl(item.url))}" target="_blank" rel="noopener">${escapeHtml(item.label || item.name || "Download")} ↗</a>`).join("")}</div>`;
    }
    if (type === "model") {
      const model = safeUrl(block.src || block.model);
      return model ? `<div class="post-model"><model-viewer src="${escapeHtml(model)}" camera-controls auto-rotate loading="lazy" aria-label="${escapeHtml(block.alt || "HUNTER 3D-Modell")}"></model-viewer></div>` : "";
    }
    return "";
  };
  window.HUNTER_RENDER_BLOCK = renderBlock;

  const setupLightbox = () => {
    if (document.body.dataset.lightboxReady) return;
    document.body.dataset.lightboxReady = "true";
    const overlay = document.createElement("div");
    overlay.className = "lightbox-overlay";
    overlay.hidden = true;
    overlay.innerHTML = `<div class="lightbox-dialog" role="dialog" aria-modal="true" aria-label="Bildansicht"><button class="lightbox-close" type="button" aria-label="Bildansicht schließen">×</button><img alt=""><span class="lightbox-caption"></span></div>`;
    document.body.appendChild(overlay);
    const close = () => { overlay.hidden = true; document.body.classList.remove("lightbox-open"); };
    overlay.addEventListener("click", (event) => { if (event.target === overlay || event.target.closest(".lightbox-close")) close(); });
    document.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-lightbox-src]");
      if (!trigger) return;
      event.preventDefault();
      overlay.querySelector("img").src = trigger.dataset.lightboxSrc;
      overlay.querySelector("img").alt = trigger.dataset.lightboxAlt || "HUNTER Bild";
      overlay.querySelector(".lightbox-caption").textContent = trigger.dataset.lightboxAlt || "";
      overlay.hidden = false;
      document.body.classList.add("lightbox-open");
    });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !overlay.hidden) close(); });
  };
  setupLightbox();

  const loadEmbedScripts = () => {
    if (!document.querySelector('.post-embed[data-embed-platform="twitter"], .post-embed[data-embed-platform="x"]')) return;
    if (document.querySelector('script[data-hunter-twitter-widgets]')) return;
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    script.dataset.hunterTwitterWidgets = "true";
    document.body.appendChild(script);
  };

  const blogLanguageTabs = [...document.querySelectorAll("[data-blog-language]")].filter((node) => node.matches("button"));
  const initialBlogLanguage = new URLSearchParams(window.location.search).get("blog_lang");
  let activeBlogLanguage = initialBlogLanguage === "en" || initialBlogLanguage === "de"
    ? initialBlogLanguage
    : (window.HUNTER_LANG === "en" ? "en" : "de");

  const applyBlogLanguage = (language, updateUrl = true) => {
    activeBlogLanguage = language === "en" ? "en" : "de";
    blogLanguageTabs.forEach((tab) => {
      const selected = tab.dataset.blogLanguage === activeBlogLanguage;
      tab.classList.toggle("active", selected);
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    if (updateUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set("blog_lang", activeBlogLanguage);
      window.history.replaceState({}, "", url);
    }
    document.dispatchEvent(new CustomEvent("hunter-blog-language-change", { detail: { language: activeBlogLanguage } }));
  };

  blogLanguageTabs.forEach((tab) => tab.addEventListener("click", () => applyBlogLanguage(tab.dataset.blogLanguage)));
  applyBlogLanguage(activeBlogLanguage, false);

  const request = async (path) => {
    const response = await fetch(`${config.url}/rest/v1/${path}`, {
      headers: { apikey: config.key, Authorization: `Bearer ${config.key}` },
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Supabase ${response.status}`);
    return response.json();
  };

  const loadIndex = async () => {
    const grid = document.querySelector("[data-blog-grid]");
    if (!grid) return;
    try {
      const posts = await request("blog_posts?select=*&status=eq.published&order=published_at.desc,created_at.desc");
      // Static cards are a no-network fallback only; once Supabase responds,
      // the database becomes the single source of truth for the grid.
      if (posts.length) grid.innerHTML = posts.map(cardMarkup).join("");
      document.dispatchEvent(new CustomEvent("hunter-blog-content-change"));
    } catch (error) {
      console.info("HUNTER Blog nutzt lokale Fallback-Beiträge.", error);
    }
  };

  const loadPost = async () => {
    const shell = document.querySelector("[data-post-page]");
    if (!shell) return;
    const slug = new URLSearchParams(window.location.search).get("slug");
    if (!slug) return;
    const hero = shell.querySelector("[data-post-hero]");
    if (hero) hero.hidden = true;
    try {
      const posts = await request(`blog_posts?select=*&slug=eq.${encodeURIComponent(slug)}&status=eq.published&limit=1`);
      const post = posts[0];
      if (!post) throw new Error("not found");
      document.title = `${post.title} – HUNTER Cyberdeck`;
      const reference = String(post.slug || "live").split("-").filter(Boolean).slice(0, 2).join("-").toUpperCase() || "LIVE";
      const revisionDate = post.updated_at || post.created_at || post.published_at;
      shell.querySelector("[data-post-reference]")?.replaceChildren(document.createTextNode(reference));
      shell.querySelector("[data-post-revision]")?.replaceChildren(document.createTextNode(revisionDate ? new Date(revisionDate).toISOString().slice(0, 10).replace(/-/g, ".") : "0.1"));
      shell.querySelector("[data-post-status]")?.replaceChildren(document.createTextNode(post.status === "published" ? "PUBLISHED" : "DOCUMENTED"));
      shell.querySelector("[data-post-category]").textContent = `${categoryLabel(post.category)} // ${post.template || "HUNTER"}`;
      shell.querySelector("[data-post-title]").textContent = post.title;
      shell.querySelector("[data-post-excerpt]").textContent = post.excerpt || "";
      shell.querySelector("[data-post-meta]").textContent = `${post.author_name || "HUNTER"} // ${post.reading_time_minutes || 5} ${window.HUNTER_LANG === "en" ? "min." : "Min."} // ${new Date(post.published_at || post.created_at).toLocaleDateString(window.HUNTER_LANG === "en" ? "en-US" : "de-DE")}`;
      shell.dataset.postTemplate = String(post.template || "build-log").toLowerCase().replace(/[^a-z0-9_-]/g, "");
      shell.dataset.postLayout = String(post.layout_key || "editorial").toLowerCase().replace(/[^a-z0-9_-]/g, "");
      const heroUrl = safeUrl(post.hero_image);
      const heroImage = shell.querySelector("[data-post-hero-image]");
      if (hero && heroImage && heroUrl) {
        heroImage.src = heroUrl;
        heroImage.alt = post.hero_alt || post.title || "HUNTER Blogbild";
        heroImage.loading = "eager";
        const heroCaption = shell.querySelector("[data-post-hero-caption]");
        if (heroCaption) heroCaption.textContent = post.hero_caption || "HUNTER // FIELD IMAGE";
        hero.hidden = false;
      }
      const blocks = Array.isArray(post.blocks) && post.blocks.length ? post.blocks : [{ type: "rich_text", text: post.content || "" }];
      shell.querySelector("[data-post-blocks]").innerHTML = blocks.map((block) => {
        const blockClass = String(block?.type || "unknown").toLowerCase().replace(/[^a-z0-9_-]/g, "") || "unknown";
        return `<section class="post-block-frame post-block-frame-${blockClass}">${renderBlock(block)}</section>`;
      }).join("");
      loadEmbedScripts();
      shell.querySelector("[data-post-loading]")?.remove();
    } catch (error) {
      shell.querySelector("[data-post-loading]").textContent = "Dieser Eintrag ist noch nicht veröffentlicht.";
    }
  };

  loadIndex();
  loadPost();
  // Blog posts are content-managed in Supabase. Keep both the index grid and
  // an open detail page fresh without a deploy; the REST filters still ensure
  // that drafts never render publicly.
  const refreshBlog = () => { loadIndex(); loadPost(); };
  window.addEventListener("hunter-language-change", () => {
    applyBlogLanguage(window.HUNTER_LANG === "en" ? "en" : "de");
    refreshBlog();
  });
  if (document.querySelector("[data-blog-grid], [data-post-page]")) {
    window.setInterval(refreshBlog, 30000);
    import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm")
      .then(({ createClient }) => createClient(config.url, config.key)
        .channel("hunter-blog-posts")
        .on("postgres_changes", { event: "*", schema: "public", table: "blog_posts" }, refreshBlog)
        .subscribe())
      .catch(() => {});
  }
})();
