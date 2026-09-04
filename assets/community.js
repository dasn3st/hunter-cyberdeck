(() => {
  const config = {
    url: "https://ocgirjlfdugiaieynbnl.supabase.co",
    key: "sb_publishable_sihx39p63ZEO4M3I1APVlw_GhySEcfu",
    // Public repository and category used by the embedded GitHub Discussions widget.
    giscusRepo: "dasn3st/hunter-cyberdeck",
    giscusRepoId: "R_kgDOUKx3IA",
    giscusCategoryId: "DIC_kwDOUKx3IM4DEpRA",
  };

  const slug = new URLSearchParams(window.location.search).get("slug") || "";
  const isEnglish = () => window.HUNTER_LANG === "en";
  const reviewTargets = [...document.querySelectorAll("[data-community-reviews]")];
  const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  })[character]);
  const safeUrl = (value = "") => /^https?:\/\//i.test(String(value).trim()) ? String(value).trim() : "";
  const stars = (rating) => `${"★".repeat(Math.max(0, Math.min(5, Number(rating) || 0)))}${"☆".repeat(Math.max(0, 5 - (Number(rating) || 0)))}`;

  const renderReviews = (reviews) => {
    const average = reviews.length ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length : 0;
    document.querySelectorAll("[data-review-average]").forEach((target) => {
      target.textContent = reviews.length ? `${average.toFixed(1).replace(".", isEnglish() ? "." : ",")} / 5 · ${reviews.length} ${isEnglish() ? "review" : "Review"}${reviews.length === 1 ? "" : "s"}` : (isEnglish() ? "No reviews yet" : "Noch keine Reviews");
    });
    reviewTargets.forEach((target) => {
      if (!reviews.length) {
        target.innerHTML = `<p class="community-empty">${slug ? (isEnglish() ? "No reviews for this entry yet." : "Noch keine Reviews für diesen Eintrag.") : (isEnglish() ? "No reviews published yet. Be the first." : "Noch keine Reviews veröffentlicht. Sei der Erste.")}</p>`;
        return;
      }
      target.innerHTML = reviews.map((review) => {
        const projectUrl = safeUrl(review.project_url);
        return `<article class="review-card">
          <div class="review-card-top"><span class="review-stars" aria-label="${escapeHtml(review.rating)} ${isEnglish() ? "out of 5 stars" : "von 5 Sternen"}">${stars(review.rating)}</span><time datetime="${escapeHtml(review.published_at || review.created_at || "")}">${escapeHtml(new Date(review.published_at || review.created_at).toLocaleDateString(isEnglish() ? "en-US" : "de-DE"))}</time></div>
          <h3>${escapeHtml(review.title)}</h3>
          <p>${escapeHtml(review.body)}</p>
          <div class="review-card-byline"><span>${escapeHtml(review.author_name)}${review.device_model ? ` · ${escapeHtml(review.device_model)}` : ""}</span>${projectUrl ? `<a href="${escapeHtml(projectUrl)}" target="_blank" rel="ugc nofollow noopener">Build ↗</a>` : ""}</div>
        </article>`;
      }).join("");
    });
  };

  const loadReviews = async () => {
    const filter = slug ? `&post_slug=eq.${encodeURIComponent(slug)}` : "&post_slug=is.null";
    try {
      const response = await fetch(`${config.url}/rest/v1/reviews?select=rating,title,body,author_name,device_model,project_url,created_at,published_at&status=eq.approved${filter}&order=published_at.desc,created_at.desc&limit=12`, {
        headers: { apikey: config.key, Authorization: `Bearer ${config.key}` },
        cache: "no-store",
      });
      if (!response.ok) throw new Error(`reviews ${response.status}`);
      renderReviews(await response.json());
    } catch (error) {
      console.info("HUNTER Reviews momentan nicht erreichbar.", error);
    }
  };

  const submitReview = async (form) => {
    const status = form.querySelector("[data-review-form-status]");
    const submit = form.querySelector("button[type=submit]");
    const data = new FormData(form);
    if (String(data.get("website") || "").trim()) return;
    const cooldownKey = "hunter-review-last-submit";
    try {
      if (Date.now() - Number(localStorage.getItem(cooldownKey) || 0) < 30000) {
        throw new Error(isEnglish() ? "Please wait 30 seconds before sending another report." : "Bitte 30 Sekunden warten, bevor du den nächsten Bericht sendest.");
      }
    } catch (error) {
      if (error.message.startsWith("Bitte")) throw error;
    }
    const payload = {
      post_slug: slug || null,
      rating: Number(data.get("rating")),
      title: String(data.get("title") || "").trim(),
      body: String(data.get("body") || "").trim(),
      author_name: String(data.get("author_name") || "").trim(),
      device_model: String(data.get("device_model") || "").trim() || null,
      project_url: safeUrl(data.get("project_url")) || null,
      status: "pending",
    };
    if (!payload.rating || payload.title.length < 3 || payload.body.length < 20 || payload.author_name.length < 2) {
      throw new Error(isEnglish() ? "Please add a rating, title, name and a slightly longer report." : "Bitte Bewertung, Titel, Namen und einen etwas längeren Erfahrungsbericht ausfüllen.");
    }
    submit && (submit.disabled = true);
    if (status) status.textContent = isEnglish() ? "Submitting for moderation …" : "Wird zur Moderation eingereicht …";
    const response = await fetch(`${config.url}/rest/v1/reviews`, {
      method: "POST",
      headers: { apikey: config.key, Authorization: `Bearer ${config.key}`, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(isEnglish() ? "The report could not be saved. Please try again later." : "Der Bericht konnte nicht gespeichert werden. Bitte später erneut versuchen.");
    try { localStorage.setItem(cooldownKey, String(Date.now())); } catch {}
    form.reset();
    if (status) status.textContent = isEnglish() ? "Thanks — your report is now waiting for approval." : "Danke — dein Bericht wartet jetzt auf die Freigabe.";
  };

  document.querySelectorAll("[data-review-form]").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const status = form.querySelector("[data-review-form-status]");
      try {
        await submitReview(form);
      } catch (error) {
        if (status) status.textContent = error.message || (isEnglish() ? "Transmission failed." : "Übertragung fehlgeschlagen.");
        form.querySelector("button[type=submit]")?.removeAttribute("disabled");
      }
    });
  });

  // Giscus uses GitHub Discussions for authenticated community comments. It
  // needs a real HTTP(S) origin: browsers reject an iframe loaded from a
  // local file:// page because that origin is `null`.
  const discussionTarget = document.querySelector("[data-community-discussion]");
  if (discussionTarget && config.giscusRepo && config.giscusRepoId && config.giscusCategoryId) {
    const isWebOrigin = window.location.protocol === "http:" || window.location.protocol === "https:";
    if (!isWebOrigin) {
      discussionTarget.innerHTML = `<span class="technical-label">GitHub Discussions</span>
        <p>${isEnglish() ? "The live discussion widget is available when this page is opened from a web address. For local file previews, open the community directly on GitHub." : "Das Live-Kommentarfenster steht zur Verfügung, sobald die Seite über eine Webadresse geöffnet wird. Bei einer lokalen Dateivorschau kannst du die Community direkt auf GitHub öffnen."}</p>
        <a class="text-link" href="https://github.com/${config.giscusRepo}/discussions" target="_blank" rel="noopener">${isEnglish() ? "Open GitHub Discussions ↗" : "GitHub Discussions öffnen ↗"}</a>`;
    } else {
    discussionTarget.innerHTML = `<div class="giscus-host"></div>
      <div class="community-fallback"><span class="technical-label">GitHub Discussions</span>
        <p>${isEnglish() ? "Join the live discussion directly on GitHub." : "Die Diskussion läuft direkt über GitHub Discussions."}</p>
        <a class="text-link" href="https://github.com/${config.giscusRepo}/discussions" target="_blank" rel="noopener">${isEnglish() ? "Open GitHub Discussions ↗" : "GitHub Discussions öffnen ↗"}</a></div>`;
    const script = document.createElement("script");
    Object.assign(script.dataset, {
      repo: config.giscusRepo,
      repoId: config.giscusRepoId,
      category: "General",
      categoryId: config.giscusCategoryId,
      mapping: slug ? "specific" : "pathname",
      term: slug || window.location.pathname,
      strict: "0", reactionsEnabled: "1", emitMetadata: "0", inputPosition: "top",
      theme: "dark_dimmed", lang: isEnglish() ? "en" : "de",
    });
    script.src = "https://giscus.app/client.js";
    script.crossOrigin = "anonymous";
    script.async = true;
    discussionTarget.querySelector(".giscus-host")?.appendChild(script);
    }
  }

  if (reviewTargets.length) {
    loadReviews();
    window.addEventListener("hunter-language-change", loadReviews);
    window.setInterval(loadReviews, 30000);
    import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm")
      .then(({ createClient }) => createClient(config.url, config.key)
        .channel("hunter-community-reviews")
        .on("postgres_changes", { event: "*", schema: "public", table: "reviews" }, loadReviews)
        .subscribe())
      .catch(() => {});
  }
})();
