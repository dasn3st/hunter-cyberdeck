const page = document.body.dataset.page || "home";

const navigation = [
  { id: "home", label: "Start", href: "index.html" },
  { id: "blog", label: "Blog", href: "blog.html" },
  { id: "tech", label: "Tech", href: "tech.html" },
  { id: "github", label: "GitHub", href: "github.html", external: true },
  { id: "makerworld", label: "MakerWorld", href: "makerworld.html", external: true },
  { id: "archive", label: "Archiv", href: "archive.html" },
  { id: "about", label: "Über HUNTER", href: "about.html" },
];

const headerTarget = document.querySelector("[data-site-header]");
if (headerTarget) {
  const links = navigation.map((item) => {
    const active = page === item.id ? ' aria-current="page"' : "";
    const mark = item.external ? ' <span class="external-mark" aria-hidden="true">↗</span>' : "";
    const key = `nav.${item.id}`;
    return `<a class="nav-link" href="${item.href}"${active}><span data-i18n="${key}">${item.label}</span>${mark}</a>`;
  }).join("");

  headerTarget.outerHTML = `
    <header class="site-header">
      <div class="header-inner">
        <a class="brand" href="index.html" aria-label="HUNTER Startseite" data-i18n-aria="brand.home">
          <img class="brand-logo" src="assets/hunter-logo-white.png" width="1536" height="1024" alt="HUNTER CYBERDECK">
        </a>
        <nav class="main-nav" id="main-navigation" aria-label="Hauptnavigation" data-i18n-aria="nav.label">${links}</nav>
        <div class="header-status"><span class="status-dot"></span>Build 01 // <span data-i18n="status.active">aktiv</span></div>
        <button class="menu-button" type="button" aria-controls="main-navigation" aria-expanded="false" aria-label="Menü öffnen" data-i18n-aria="menu.open"><span></span></button>
      </div>
    </header>`;
}

const footerTarget = document.querySelector("[data-site-footer]");
if (footerTarget) {
  footerTarget.outerHTML = `
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <a class="footer-wordmark" href="index.html" aria-label="HUNTER Cyberdeck Startseite"><img class="footer-logo" src="assets/hunter-logo-white.png" width="1440" height="560" alt="HUNTER Cyberdeck"></a>
          <p data-i18n="footer.tagline">Cyberdeck Development Journal<br>Made in Berlin // Open Build</p>
        </div>
        <nav class="footer-links" aria-label="Fußnavigation" data-i18n-aria="footer.label">
          <a href="blog.html"><span data-i18n="footer.blog">Build Log</span></a>
          <a href="tech.html"><span data-i18n="footer.tech">Tech-Dokumentation</span></a>
          <a href="github.html"><span data-i18n="footer.github">GitHub</span> ↗</a>
          <a href="makerworld.html"><span data-i18n="footer.makerworld">MakerWorld</span> ↗</a>
          <a href="archive.html"><span data-i18n="footer.archive">Forschungsarchiv</span></a>
          <a href="about.html"><span data-i18n="footer.about">Über HUNTER</span></a>
          <a href="mailto:hello@hunter.local"><span data-i18n="footer.contact">Kontakt</span></a>
        </nav>
      </div>
    </footer>`;
}

const agentStack = [
  { name: "Codex", role: "Build Agent", roleEn: "Build agent", asset: "assets/brands/codex.svg", href: "https://openai.com/codex/" },
  { name: "Claude Code", role: "Reasoning + Code", roleEn: "Reasoning + code", asset: "assets/brands/claude.svg", href: "https://docs.anthropic.com/en/docs/claude-code/getting-started" },
  { name: "OpenCode", role: "Open Coding Agent", roleEn: "Open coding agent", asset: "assets/brands/opencode.svg", href: "https://opencode.ai/" },
  { name: "Pi", role: "Coding Agent", roleEn: "Coding agent", asset: "assets/brands/pi.svg", href: "https://pi.dev/" },
  { name: "Hermes Agent", role: "Self-hosted Agent", roleEn: "Self-hosted agent", asset: "assets/brands/hermes.svg", href: "https://github.com/NousResearch/hermes-agent" },
  { name: "Obsidian", role: "Long-term Memory", roleEn: "Long-term memory", asset: "assets/brands/obsidian.svg", href: "https://obsidian.md/download.html" },
  { name: "Termux:X11", role: "Mobile Linux UI", roleEn: "Mobile Linux UI", asset: "assets/brands/termux-x11.png", href: "https://github.com/termux/termux-x11" },
  { name: "Herdr", role: "Agent Multiplexer", roleEn: "Agent multiplexer", asset: "assets/brands/herdr.svg", href: "https://herdr.dev/" },
];

const stackCard = ({ name, role, roleEn, asset, href }, duplicate = false) => `
  <a class="agent-card" href="${href}" target="_blank" rel="noopener noreferrer"${duplicate ? ' tabindex="-1"' : ""}>
    <span class="agent-icon"><img src="${asset}" alt="${name} Logo" width="64" height="64"></span>
    <span class="agent-name">${name}</span>
    <span class="agent-role" data-role-de="${role}" data-role-en="${roleEn || role}">${role}</span>
  </a>`;

document.querySelectorAll("[data-agent-stack]").forEach((target) => {
  const cards = agentStack.map((agent) => stackCard(agent)).join("");
  if (target.dataset.agentStack === "rail") {
    const duplicateCards = agentStack.map((agent) => stackCard(agent, true)).join("");
    target.innerHTML = `
      <div class="agent-stack-track">
        <div class="agent-stack-group">${cards}</div>
        <div class="agent-stack-group" aria-hidden="true">${duplicateCards}</div>
      </div>`;
    return;
  }
  target.innerHTML = cards;
});

// Editorial photo field: the supplied build photography is reused across
// the relevant pages, with a larger archive view and lighter page-specific
// selections. Images stay local, lazy-load, and retain descriptive alt text.
const hunterGalleryImages = {
  1: ["assets/hunter-gallery/hunter-cyberdeck-01.jpg", "HUNTER Cyberdeck mit geöffnetem Display und Ringstand", "HUNTER cyberdeck with open display and ring stand", "01 // FIELD NODE"],
  2: ["assets/hunter-gallery/hunter-cyberdeck-02.jpg", "Draufsicht auf Pixel 6a, Rii K06 und Case-Teile", "Top view of the Pixel 6a, Rii K06 and case parts", "02 // COMPONENTS"],
  3: ["assets/hunter-gallery/hunter-cyberdeck-03.jpg", "Seitliche Ansicht von Pixel 6a und Rii K06 im Case", "Side view of the Pixel 6a and Rii K06 in the case", "03 // INTERFACE"],
  4: ["assets/hunter-gallery/hunter-cyberdeck-04.jpg", "HUNTER Cyberdeck als vollständiges mobiles System", "HUNTER cyberdeck as a complete mobile system", "04 // SYSTEM ONLINE"],
  5: ["assets/hunter-gallery/hunter-cyberdeck-05.jpg", "Nahaufnahme von Rii K06 und Pixel 6a", "Close-up of the Rii K06 and Pixel 6a", "05 // INPUT"],
  6: ["assets/hunter-gallery/hunter-cyberdeck-06.jpg", "Ringstand und Gehäuse im Testaufbau", "Ring stand and case in the test setup", "06 // STAND MODULE"],
  7: ["assets/hunter-gallery/hunter-cyberdeck-07.jpg", "Montageübersicht mit Case-Hälften und Komponenten", "Assembly overview with case halves and components", "07 // ASSEMBLY"],
  8: ["assets/hunter-gallery/hunter-cyberdeck-08.jpg", "Cyberdeck-Rückseite mit Hexgitter und Ringstand", "Cyberdeck rear with hex grid and ring stand", "08 // CASE BACK"],
  9: ["assets/hunter-gallery/hunter-cyberdeck-09.jpg", "Geöffnete Case-Komponente mit Ringmechanik", "Open case component with ring mechanism", "09 // MECHANICS"],
  10: ["assets/hunter-gallery/hunter-cyberdeck-10.jpg", "Ringstand-Modul in der Draufsicht", "Ring stand module from above", "10 // TOLERANCE"],
  11: ["assets/hunter-gallery/hunter-cyberdeck-11.jpg", "Vollständiger Teileaufbau des Cyberdecks", "Complete cyberdeck parts layout", "11 // RELEASE SET"],
  12: ["assets/hunter-gallery/hunter-cyberdeck-12.jpg", "Detailaufnahme des HUNTER Cyberdecks im Feld", "Close-up of the HUNTER cyberdeck in the field", "12 // FIELD ARCHIVE"],
};
const gallerySelection = {
  home: [4, 1, 6, 11, 7], blog: [4, 3, 5, 8, 7], "blog-post": [1, 3, 9, 4, 5], tech: [2, 5, 7, 8, 10],
  github: [1, 4, 11, 7, 12], makerworld: [6, 8, 10, 11, 4], archive: [...Object.keys(hunterGalleryImages).map(Number), 4], about: [4, 1, 7, 6, 11],
};
const galleryNumbers = gallerySelection[page] || gallerySelection.home;
const galleryHost = document.querySelector("main.shell");
if (galleryHost && !document.querySelector("[data-hunter-gallery]")) {
  const gallery = document.createElement("section");
  gallery.className = "hunter-gallery section compact";
  gallery.dataset.hunterGallery = "";
  gallery.setAttribute("aria-labelledby", "hunter-gallery-title");
  const cards = galleryNumbers.map((number, index) => {
    const item = hunterGalleryImages[number];
    if (!item) return "";
    const [src, altDe, altEn, caption] = item;
    return `<figure class="hunter-photo ${index === 0 ? "hunter-photo-featured" : ""}"><img src="${src}" width="${[2,7,11].includes(number) ? 1536 : 1024}" height="${[2,7,11].includes(number) ? 1024 : 1536}" loading="eager" decoding="async" data-alt-de="${altDe}" data-alt-en="${altEn}" alt="${altDe}"><figcaption>${caption}</figcaption></figure>`;
  }).join("");
  gallery.innerHTML = `<div class="section-heading"><div><span class="section-index" data-i18n="gallery.eyebrow">05 // VISUELLES FELDPROTOKOLL</span><h2 id="hunter-gallery-title" class="section-title" data-i18n="gallery.title">Im Feld<br>gesehen.</h2></div><p class="section-description" data-i18n="gallery.description">Die fotografische Spur des Builds: echte Hardware, echte Teststände und die Teile, aus denen HUNTER entsteht.</p></div><div class="hunter-photo-grid">${cards}</div>`;
  galleryHost.appendChild(gallery);
}

const menuButton = document.querySelector(".menu-button");
const menuLabel = (open) => {
  const english = window.HUNTER_LANG === "en";
  return open ? (english ? "Close menu" : "Menü schließen") : (english ? "Open menu" : "Menü öffnen");
};
const closeMenu = () => {
  document.body.classList.remove("menu-open");
  menuButton?.setAttribute("aria-expanded", "false");
  menuButton?.setAttribute("aria-label", menuLabel(false));
};

menuButton?.addEventListener("click", () => {
  const open = document.body.classList.toggle("menu-open");
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", menuLabel(open));
});

document.querySelectorAll(".main-nav a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const filterButtons = [...document.querySelectorAll("[data-filter]")];

const applyBlogFilters = (animate = false) => {
  const filter = document.querySelector("[data-filter].active")?.dataset.filter || "all";
  const language = document.querySelector("[data-blog-language].active")?.dataset.blogLanguage;
  const stories = [...document.querySelectorAll("[data-category]")];
  stories.forEach((story) => {
    const languageVisible = !language || !story.dataset.blogLanguage || story.dataset.blogLanguage === language;
    const categoryVisible = filter === "all" || story.dataset.category === filter;
    const visible = languageVisible && categoryVisible;
    story.hidden = !visible;
    if (visible && animate && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      story.animate(
        [
          { opacity: 0, transform: "translateY(14px) scale(.985)" },
          { opacity: 1, transform: "translateY(0) scale(1)" },
        ],
        { duration: 280, easing: "cubic-bezier(.2,.8,.2,1)" },
      );
    }
  });
};

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((candidate) => candidate.classList.toggle("active", candidate === button));
    applyBlogFilters(true);
  });
});

document.addEventListener("hunter-blog-language-change", () => applyBlogFilters(true));
document.addEventListener("hunter-blog-content-change", () => applyBlogFilters());
applyBlogFilters();

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reducedMotion) {
  const heroVisual = document.querySelector(".hero-visual");
  heroVisual?.addEventListener("pointermove", (event) => {
    const rect = heroVisual.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - .5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - .5) * 2;
    heroVisual.style.setProperty("--deck-rotate-x", `${4 - y * 3.2}deg`);
    heroVisual.style.setProperty("--deck-rotate-y", `${-6 + x * 5}deg`);
    heroVisual.style.setProperty("--deck-shift-x", `${x * 9}px`);
    heroVisual.style.setProperty("--deck-shift-y", `${y * 7}px`);
    heroVisual.style.setProperty("--line-shift-x", `${x * -12}px`);
    heroVisual.style.setProperty("--line-shift-y", `${y * -10}px`);
  });

  heroVisual?.addEventListener("pointerleave", () => {
    ["--deck-rotate-x", "--deck-rotate-y", "--deck-shift-x", "--deck-shift-y", "--line-shift-x", "--line-shift-y"]
      .forEach((property) => heroVisual.style.removeProperty(property));
  });

  const revealTargets = document.querySelectorAll(
    ".section-heading, .module-card, .story-card, .resource-card, .docs-block, .about-grid, .pending-box, .model-card, .download-group, .master-download, .print-gallery figure, .hardware-feature, .agent-stack-grid .agent-card, .hunter-photo",
  );
  revealTargets.forEach((target) => target.classList.add("reveal-target"));
  document.documentElement.classList.add("motion-ready");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -7%", threshold: .08 });

  revealTargets.forEach((target) => observer.observe(target));
}

// Live HUNTER status. The publishable key is intentionally the only Supabase
// credential shipped to the browser; writes stay behind authenticated access.
const hunterStatusFields = document.querySelectorAll("[data-agent-field]");
const hunterSupabase = {
  url: "https://ocgirjlfdugiaieynbnl.supabase.co",
  key: "sb_publishable_sihx39p63ZEO4M3I1APVlw_GhySEcfu",
};

const formatUptime = (seconds) => {
  const total = Math.max(0, Number(seconds) || 0);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  return days > 0 ? `${days}d ${hours}h` : `${hours}h ${minutes}m`;
};

const formatRam = (mb) => {
  const value = Number(mb);
  const english = window.HUNTER_LANG === "en";
  if (!Number.isFinite(value)) return english ? "not reported" : "nicht gemeldet";
  return value >= 1024 ? `${(value / 1024).toFixed(1).replace(".", english ? "." : ",")} GB ${english ? "free" : "frei"}` : `${Math.round(value)} MB ${english ? "free" : "frei"}`;
};

const installedAgentsTarget = document.querySelector("[data-installed-agents]");
const installedAgentsCount = document.querySelector("[data-agent-installed-count]");
const renderInstalledAgents = (agents) => {
  if (!installedAgentsTarget) return;
  const list = Array.isArray(agents) ? agents.filter((agent) => agent && typeof agent === "object" && agent.name) : [];
  installedAgentsCount && (installedAgentsCount.textContent = `${list.length} ${window.HUNTER_LANG === "en" ? "installed" : "installiert"}`);
  if (!list.length) {
    installedAgentsTarget.innerHTML = `<span class="installed-agent-empty">${window.HUNTER_LANG === "en" ? "No agents reported." : "Keine Agenten gemeldet."}</span>`;
    return;
  }
  installedAgentsTarget.innerHTML = list.map((agent) => {
    const icon = typeof agent.icon === "string" && /^assets\/[a-z0-9_./-]+$/i.test(agent.icon) ? agent.icon : "";
    return `<span class="installed-agent" title="${escapeLogText(agent.role || "Agent")}">${icon ? `<img src="${escapeLogText(icon)}" alt="" width="18" height="18">` : ""}<span>${escapeLogText(agent.name)}</span></span>`;
  }).join("");
};

const applyHunterStatus = (status) => {
  if (!status) return;
  renderInstalledAgents(status.installed_agents || agentStack);
  const values = {
    uptime: `$ ${formatUptime(status.uptime_seconds)} // live`,
    record: `$ ${status.record_uptime || "88h+ ohne Unterbrechung // 28.08.–01.09."}`,
    cron: `$ ${status.cron_jobs_ok ?? 0}/${status.cron_jobs_total ?? 0} aktiv // ${status.cron_jobs_failed ?? 0} fehlgeschlagen`,
    oom: `$ ${status.oom_kills ?? 0} kills // seit Härtung`,
    ram: `$ ${formatRam(status.ram_free_mb)}`,
    ollama_plan: `$ ${status.ollama_plan || "Pro"} // aktiv`,
    chatgpt_plan: `$ ${status.chatgpt_plan || "Pro"} // aktiv`,
    prompt: `> ${status.prompt || "HUNTER wartet auf den nächsten Lauf._"}`,
  };
  Object.entries(values).forEach(([field, value]) => {
    document.querySelectorAll(`[data-agent-field="${field}"]`).forEach((target) => {
      target.textContent = value;
    });
  });
  document.querySelectorAll(".header-status").forEach((target) => {
    const labels = window.HUNTER_LANG === "en" ? { online: "active", degraded: "degraded", offline: "offline" } : { online: "aktiv", degraded: "eingeschränkt", offline: "offline" };
    const label = labels[status.state] || labels.offline;
    target.innerHTML = `<span class="status-dot"></span>Build 01 // <span data-i18n="status.${status.state === "online" ? "active" : status.state === "degraded" ? "degraded" : "offline"}">${label}</span>`;
    target.dataset.agentState = status.state || "offline";
  });
  document.querySelectorAll(".visual-tag.two").forEach((target) => {
    target.textContent = `Agent Runtime // ${(status.state || "offline").toUpperCase()}`;
  });
};
let currentHunterStatus = null;

// Session log view. The agent writes restart/kill/cron reasons to agent_events;
// the public monitor only reads the latest entries and escapes their content.
const terminalTabs = [...document.querySelectorAll("[data-terminal-tab]")];
const terminalPanels = [...document.querySelectorAll("[data-terminal-panel]")];
const agentLogsTarget = document.querySelector("[data-agent-logs]");
const agentLogCount = document.querySelector("[data-agent-log-count]");
const escapeLogText = (value) => String(value ?? "").replace(/[&<>\"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;",
}[character]));
const logTypeLabel = (type) => {
  const labels = window.HUNTER_LANG === "en" ? {
    cron_test: "CRON TEST", heartbeat: "HEARTBEAT", restart: "RESTART", oom_kill: "OOM KILL", interruption: "INTERRUPTION", deploy: "DEPLOY",
  } : { cron_test: "CRON TEST", heartbeat: "HEARTBEAT", restart: "RESTART", oom_kill: "OOM KILL", interruption: "UNTERBRECHUNG", deploy: "DEPLOY" };
  return labels[type] || String(type || "EVENT").replace(/[_-]+/g, " ").toUpperCase();
};
const logTone = (type) => /oom|kill|interrupt|crash|error|fail/i.test(type || "") ? "is-warning" : /restart|boot|online/i.test(type || "") ? "is-restart" : "";
const formatLogDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--.--.---- · --:--";
  return new Intl.DateTimeFormat(window.HUNTER_LANG === "en" ? "en-US" : "de-DE", {
    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
  }).format(date).replace(",", " ·");
};

const renderAgentLogs = (events) => {
  if (!agentLogsTarget) return;
  agentLogCount && (agentLogCount.textContent = events.length ? String(events.length) : "0");
  if (!events.length) {
    agentLogsTarget.innerHTML = `<p class="agent-log-empty">${window.HUNTER_LANG === "en" ? "No session events recorded yet." : "Noch keine Session-Ereignisse protokolliert."}</p>`;
    return;
  }
  agentLogsTarget.innerHTML = events.map((event) => {
    const type = String(event.event_type || "event");
    const metadata = event.metadata && typeof event.metadata === "object" ? event.metadata : {};
    const message = event.message || metadata.reason || (window.HUNTER_LANG === "en" ? "Event without message" : "Ereignis ohne Nachricht");
    return `<article class="agent-log-entry ${logTone(type)}">
      <div class="agent-log-marker">${escapeLogText(event.emoji || "·")}</div>
      <div class="agent-log-copy"><div class="agent-log-meta"><span>${escapeLogText(logTypeLabel(type))}</span><time datetime="${escapeLogText(event.created_at || "")}">${escapeLogText(formatLogDate(event.created_at))}</time></div><p>${escapeLogText(message)}</p></div>
    </article>`;
  }).join("");
};

const fetchAgentLogs = async () => {
  if (!agentLogsTarget) return [];
  try {
    const response = await fetch(`${hunterSupabase.url}/rest/v1/agent_events?select=id,event_type,emoji,message,metadata,created_at&order=created_at.desc&limit=16`, {
      headers: { apikey: hunterSupabase.key, Authorization: `Bearer ${hunterSupabase.key}` },
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`logs ${response.status}`);
    const events = await response.json();
    renderAgentLogs(Array.isArray(events) ? events : []);
    return events;
  } catch (error) {
    console.info("HUNTER session logs unavailable.", error);
    agentLogsTarget.innerHTML = `<p class="agent-log-empty">${window.HUNTER_LANG === "en" ? "Session archive is currently unavailable." : "Session-Archiv momentan nicht erreichbar."}</p>`;
    agentLogCount && (agentLogCount.textContent = "–");
    return [];
  }
};

window.addEventListener("hunter-language-change", () => {
  if (currentHunterStatus) applyHunterStatus(currentHunterStatus);
  if (agentLogsTarget) fetchAgentLogs();
});

terminalTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const selected = tab.dataset.terminalTab;
    terminalTabs.forEach((candidate) => {
      const active = candidate === tab;
      candidate.classList.toggle("is-active", active);
      candidate.setAttribute("aria-selected", String(active));
    });
    terminalPanels.forEach((panel) => {
      const active = panel.dataset.terminalPanel === selected;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
    });
    if (selected === "logs") fetchAgentLogs();
  });
});
document.querySelector("[data-agent-log-refresh]")?.addEventListener("click", fetchAgentLogs);

const fetchHunterStatus = async () => {
  if (!hunterStatusFields.length) return null;
  try {
    const response = await fetch(`${hunterSupabase.url}/rest/v1/agent_status?id=eq.hunter&select=*`, {
      headers: { apikey: hunterSupabase.key, Authorization: `Bearer ${hunterSupabase.key}` },
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`status ${response.status}`);
    const rows = await response.json();
    if (rows[0]) { currentHunterStatus = rows[0]; applyHunterStatus(rows[0]); }
    return rows[0] || null;
  } catch (error) {
    console.info("HUNTER live status unavailable; showing local fallback.", error);
    return null;
  }
};

if (hunterStatusFields.length) {
  fetchHunterStatus();
  fetchAgentLogs();
  window.setInterval(fetchHunterStatus, 30000);
  window.setInterval(fetchAgentLogs, 30000);
  import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm")
    .then(({ createClient }) => {
      const client = createClient(hunterSupabase.url, hunterSupabase.key);
      client.channel("hunter-agent-status")
        .on("postgres_changes", { event: "*", schema: "public", table: "agent_status", filter: "id=eq.hunter" }, (payload) => applyHunterStatus(payload.new))
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "agent_events" }, fetchAgentLogs)
        .subscribe();
    })
    .catch(() => {});
}

// Optional agent-managed content overrides for every page. Static HTML remains
// the instant fallback when Supabase is unavailable or a slot is not defined.
import("./content.js").catch(() => {});
