const page = document.body.dataset.page || "home";

const navigation = [
  { id: "home", label: "Start", href: "/index.html" },
  { id: "blog", label: "Blog", href: "/blog.html" },
  { id: "tech", label: "Tech", href: "/tech.html" },
  { id: "hardware", label: "Hardware", href: "/hardware.html" },
  { id: "github", label: "GitHub", href: "/github.html", external: true },
  { id: "makerworld", label: "MakerWorld", href: "/makerworld.html", external: true },
  { id: "archive", label: "Archiv", href: "/archive.html" },
  { id: "about", label: "Über HUNTER", href: "/about.html" },
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
        <a class="brand" href="/index.html" aria-label="HUNTER Startseite" data-i18n-aria="brand.home">
          <img class="brand-logo" src="/assets/hunter-logo-white.png" width="1536" height="1024" alt="HUNTER CYBERDECK">
        </a>
        <nav class="main-nav" id="main-navigation" aria-label="Hauptnavigation" data-i18n-aria="nav.label">${links}</nav>
        <div class="header-status"><span class="status-dot"></span>Build 01 // <span>Status lädt</span></div>
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
          <a class="footer-wordmark" href="/index.html" aria-label="HUNTER Cyberdeck Startseite"><img class="footer-logo" src="/assets/hunter-logo-white.png" width="1440" height="560" alt="HUNTER Cyberdeck"></a>
          <p data-i18n="footer.tagline">Cyberdeck Development Journal<br>Made in Berlin // Open Build</p>
        </div>
        <div class="footer-utility">
          <nav class="footer-links" aria-label="Fußnavigation" data-i18n-aria="footer.label">
            <a href="/blog.html"><span data-i18n="footer.blog">Build Log</span></a>
            <a href="/tech.html"><span data-i18n="footer.tech">Tech-Dokumentation</span></a>
            <a href="/github.html"><span data-i18n="footer.github">GitHub</span> ↗</a>
            <a href="/makerworld.html"><span data-i18n="footer.makerworld">MakerWorld</span> ↗</a>
            <a href="/archive.html"><span data-i18n="footer.archive">Forschungsarchiv</span></a>
            <a href="/about.html"><span data-i18n="footer.about">Über HUNTER</span></a>
            <a href="mailto:d4sn3st@gmail.com"><span data-i18n="footer.contact">Kontakt</span></a>
          </nav>
          <div class="footer-social" aria-label="Öffentliche Profile" data-i18n-aria="footer.social.label">
            <span class="footer-social-label" data-i18n="footer.social.label">Öffentliche Profile</span>
            <a href="https://www.linkedin.com/in/marcelnuernberg" target="_blank" rel="noopener noreferrer"><span data-i18n="footer.linkedin">LinkedIn</span> ↗</a>
            <a href="https://x.com/d4sn3st" target="_blank" rel="noopener noreferrer"><span data-i18n="footer.x">X / @d4sn3st</span> ↗</a>
          </div>
        </div>
      </div>
    </footer>`;
}

// The three public projects share one small edge navigation. It stays dormant
// as three LEDs and only expands after hover, keyboard focus, or a tap.
const projectNodes = [
  { id: "d4sn3st", name: "d4sn3st.dev", label: "Studio & Archiv", href: "https://d4sn3st.dev/" },
  { id: "mockup-paint", name: "Mockup Paint", label: "Browser Studio", href: "https://mockup-paint.d4sn3st.dev/" },
  { id: "hunter", name: "HUNTER", label: "Field Build", href: "https://hunter-cyberdeck.d4sn3st.dev/" },
];

const nodeHost = window.location.hostname;
const activeProjectNode = nodeHost.startsWith("mockup-paint.")
  ? "mockup-paint"
  : nodeHost.startsWith("hunter-cyberdeck.") ? "hunter" : "d4sn3st";

if (!document.querySelector(".project-nodes")) {
  document.body.insertAdjacentHTML("beforeend", `
    <aside class="project-nodes project-nodes--hunter" aria-label="Projekt-Navigation">
      <button class="project-nodes__rail" type="button" aria-expanded="false" aria-label="Projekt-Navigation öffnen">
        <span class="project-nodes__dots" aria-hidden="true">${projectNodes.map((node) => `<i class="${node.id === activeProjectNode ? "is-active" : ""}"></i>`).join("")}</span>
        <span class="project-nodes__rail-label">NODES</span>
      </button>
      <div class="project-nodes__panel">
        <p>PROJECT NODES // 03</p>
        <nav>${projectNodes.map((node) => `<a href="${node.href}"${node.id === activeProjectNode ? ' aria-current="page"' : ""}><span class="project-nodes__signal" aria-hidden="true"></span><span><strong>${node.name}</strong><small>${node.label}</small></span><b aria-hidden="true">↗</b></a>`).join("")}</nav>
      </div>
    </aside>`);

  const nodeSwitcher = document.querySelector(".project-nodes");
  const nodeButton = nodeSwitcher?.querySelector(".project-nodes__rail");
  const setNodeSwitcher = (open) => {
    nodeSwitcher?.classList.toggle("is-open", open);
    nodeButton?.setAttribute("aria-expanded", String(open));
  };
  nodeButton?.addEventListener("click", () => setNodeSwitcher(!nodeSwitcher.classList.contains("is-open")));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setNodeSwitcher(false);
  });
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
  13: ["assets/hunter-gallery/repack/hunter-cyberdeck-repack-01.webp", "HUNTER Cyberdeck im Transportcase mit geöffneter Rii K06 Tastatur", "HUNTER cyberdeck in its transport case with the Rii K06 keyboard open", "13 // REPACK // SYSTEM FRAME", 1022, 1050],
  14: ["assets/hunter-gallery/repack/hunter-cyberdeck-repack-02.webp", "HUNTER Cyberdeck im Hartschalenkoffer mit geöffnetem Display", "HUNTER cyberdeck in a hard case with the display open", "14 // REPACK // FIELD NODE", 1024, 1034],
  15: ["assets/hunter-gallery/repack/hunter-cyberdeck-repack-03.webp", "HUNTER Cyberdeck wird im Feld mit schwarzem Handschuh bedient", "HUNTER cyberdeck operated in the field with a black glove", "15 // REPACK // FIELD TEST", 1015, 941],
  16: ["assets/hunter-gallery/repack/hunter-cyberdeck-repack-04.webp", "Seitliche Nahaufnahme der roten Cyberdeck-Scharniermechanik", "Side close-up of the red cyberdeck hinge mechanism", "16 // REPACK // HINGE", 1024, 1078],
  17: ["assets/hunter-gallery/repack/hunter-cyberdeck-repack-05.webp", "HUNTER Cyberdeck seitlich zwischen Koffer und Komponenten", "HUNTER cyberdeck beside its case and components", "17 // REPACK // HARDWARE", 1017, 1156],
  18: ["assets/hunter-gallery/repack/hunter-cyberdeck-repack-06.webp", "Displaymodul und Elektronik des Cyberdecks im geöffneten Transportcase", "Cyberdeck display module and electronics in the open transport case", "18 // REPACK // COMPONENTS", 1012, 1063],
  19: ["assets/hunter-gallery/repack/hunter-cyberdeck-repack-07.webp", "Geöffnetes HUNTER Cyberdeck mit hochgestelltem Ringstand", "Open HUNTER cyberdeck with raised ring stand", "19 // REPACK // STAND MODULE", 1013, 1165],
  20: ["assets/hunter-gallery/repack/hunter-cyberdeck-repack-08.webp", "Rückseite des Cyberdecks und separates Displaymodul im Koffer", "Cyberdeck rear and separate display module in the case", "20 // REPACK // SERVICE", 1022, 1098],
  21: ["assets/hunter-gallery/repack/hunter-cyberdeck-repack-09.webp", "Detailaufnahme des roten Cyberdeck-Ringstands", "Close-up of the red cyberdeck ring stand", "21 // REPACK // DETAIL", 1024, 1536],
  22: ["assets/hunter-gallery/repack/hunter-cyberdeck-repack-10.webp", "Nahaufnahme des Ringstands auf dem roten HUNTER Gehäuse", "Close-up of the ring stand on the red HUNTER case", "22 // REPACK // MECHANICS", 1536, 1024],
  23: ["assets/hunter-gallery/repack/hunter-cyberdeck-repack-11.webp", "Nahaufnahme von Pixel 6a Terminal und Rii K06 Tastatur", "Close-up of the Pixel 6a terminal and Rii K06 keyboard", "23 // REPACK // INTERFACE", 1536, 1024],
  24: ["assets/hunter-gallery/repack/hunter-cyberdeck-repack-12.webp", "Offenes Elektronikmodul mit Display und freiliegender Platine", "Open electronics module with display and exposed board", "24 // REPACK // INTERNALS", 1536, 1024],
  25: ["assets/hunter-gallery/repack/hunter-cyberdeck-repack-13.webp", "Geöffnetes HUNTER Cyberdeck mit sichtbarer Tastatur und Displayhalterung", "Open HUNTER cyberdeck with visible keyboard and display mount", "25 // REPACK // ASSEMBLY", 1536, 1024],
  26: ["assets/hunter-gallery/repack/hunter-cyberdeck-repack-14.webp", "HUNTER Cyberdeck mit Terminal und Rii K06 aus schräger Perspektive", "HUNTER cyberdeck with terminal and Rii K06 from an angled view", "26 // REPACK // ANGLE", 1536, 1024],
  27: ["assets/hunter-gallery/repack/hunter-cyberdeck-repack-15.webp", "Cyberdeck mit aktivem Terminal in der Hand im Werkstattaufbau", "Cyberdeck with active terminal held in a workshop setup", "27 // REPACK // OPERATOR", 1536, 1024],
  28: ["assets/hunter-gallery/repack/hunter-cyberdeck-repack-16.webp", "HUNTER Cyberdeck und Zubehör als geordnetes mobiles Field Kit", "HUNTER cyberdeck and accessories arranged as a mobile field kit", "28 // REPACK // FIELD KIT", 1016, 1146],
  29: ["assets/hunter-gallery/repack/hunter-cyberdeck-repack-17.webp", "Komponenten, Werkzeug und HUNTER Cyberdeck als Draufsicht", "Components, tools and HUNTER cyberdeck in a top-down view", "29 // REPACK // LOADOUT", 1536, 1024],
  30: ["assets/hunter-gallery/repack/hunter-cyberdeck-repack-18.webp", "Detail des gedruckten HUNTER Gehäusedeckels mit Ringhalterung", "Detail of the printed HUNTER case lid with ring mount", "30 // REPACK // PRINT DETAIL", 1536, 1024],
  31: ["assets/hunter-gallery/repack/hunter-cyberdeck-repack-19.webp", "HUNTER Cyberdeck und separates Displaymodul im Werkstatt-Layout", "HUNTER cyberdeck and separate display module in the workshop layout", "31 // REPACK // BENCH", 1024, 1536],
  32: ["assets/hunter-gallery/repack/hunter-cyberdeck-repack-20.webp", "Cyberdeck mit aufgeklapptem Ringstand und Displaymodul auf der Arbeitsfläche", "Cyberdeck with open ring stand and display module on the work surface", "32 // REPACK // CONFIGURATION", 1536, 1024],
  33: ["assets/hunter-gallery/repack/hunter-cyberdeck-repack-21.webp", "Geöffnetes HUNTER Case mit violett beleuchtetem Displaymodul", "Open HUNTER case with a violet-lit display module", "33 // REPACK // CASE OPEN", 1536, 1024],
  34: ["assets/hunter-gallery/repack/hunter-cyberdeck-repack-22.webp", "Vollständiges HUNTER Field Kit mit Cyberdeck, Werkzeug und Cases", "Complete HUNTER field kit with cyberdeck, tools and cases", "34 // REPACK // FULL KIT", 1536, 1024],
  35: ["assets/hunter-gallery/repack/hunter-cyberdeck-repack-23.webp", "Draufsicht auf das vollständige Cyberdeck- und Zubehör-Setup", "Top view of the complete cyberdeck and accessory setup", "35 // REPACK // INVENTORY", 1536, 1024],
  36: ["assets/hunter-gallery/repack/hunter-cyberdeck-repack-24.webp", "HUNTER Cyberdeck mit Werkzeugen und Komponenten im offenen Transportcase", "HUNTER cyberdeck with tools and components beside the open transport case", "36 // REPACK // ARCHIVE", 1536, 1024],
};
const gallerySelection = {
  home: [13, 14, 19, 34, 35], blog: [13, 15, 23, 33, 28], "blog-post": [14, 17, 21, 26, 31], tech: [18, 20, 24, 25, 30],
  github: [13, 16, 34, 29, 36], makerworld: [19, 22, 30, 32, 33], archive: [...Object.keys(hunterGalleryImages).map(Number), 4], about: [13, 14, 28, 34, 35],
};
const galleryNumbers = gallerySelection[page] || gallerySelection.home;
const galleryHost = document.querySelector("main.shell");
const galleryAssetUrl = (value) => String(value || "").startsWith("assets/") ? `/${value}` : value;
if (page !== "github" && galleryHost && !document.querySelector("[data-hunter-gallery]")) {
  const gallery = document.createElement("section");
  gallery.className = "hunter-gallery section compact";
  gallery.dataset.hunterGallery = "";
  gallery.setAttribute("aria-labelledby", "hunter-gallery-title");
  const cards = galleryNumbers.map((number, index) => {
    const item = hunterGalleryImages[number];
    if (!item) return "";
    const [src, altDe, altEn, caption, width, height] = item;
    const fallbackWidth = [2, 7, 11].includes(number) ? 1536 : 1024;
    const fallbackHeight = [2, 7, 11].includes(number) ? 1024 : 1536;
    return `<figure class="hunter-photo ${index === 0 ? "hunter-photo-featured" : ""}"><img src="${galleryAssetUrl(src)}" width="${width || fallbackWidth}" height="${height || fallbackHeight}" loading="eager" decoding="async" data-alt-de="${altDe}" data-alt-en="${altEn}" alt="${altDe}"><figcaption>${caption}</figcaption></figure>`;
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

const formatUptime = (seconds, heartbeat) => {
  const total = Math.max(0, Number(seconds) || 0);
  const english = window.HUNTER_LANG === "en";
  const hours = (total / 3600).toFixed(1).replace(".", english ? "." : ",");
  const reference = Date.parse(heartbeat);
  const startedAt = new Date((Number.isFinite(reference) ? reference : Date.now()) - total * 1000);
  const pad = (value) => String(value).padStart(2, "0");
  const time = `${pad(startedAt.getHours())}:${pad(startedAt.getMinutes())}`;
  const date = english
    ? startedAt.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : `${pad(startedAt.getDate())}.${pad(startedAt.getMonth() + 1)}.`;
  return english ? `${hours} h since ${date}, ${time}` : `${hours} h seit ${date} ${time}`;
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
    uptime: `$ ${formatUptime(status.uptime_seconds, status.last_heartbeat)} // live`,
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
    const response = await fetch(`${hunterSupabase.url}/rest/v1/agent_events?select=id,event_type,emoji,message,metadata,created_at&event_type=eq.heartbeat&order=created_at.desc&limit=16`, {
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
    if (!rows[0]) throw new Error("No HUNTER status row");
    currentHunterStatus = rows[0];
    applyHunterStatus(rows[0]);
    return rows[0] || null;
  } catch (error) {
    console.info("HUNTER live status unavailable.", error);
    const message = window.HUNTER_LANG === "en" ? "$ Live status unavailable" : "$ Live-Status nicht verfügbar";
    hunterStatusFields.forEach((target) => { target.textContent = message; });
    document.querySelectorAll(".header-status").forEach((target) => {
      target.innerHTML = `<span class="status-dot"></span>Build 01 // <span>${window.HUNTER_LANG === "en" ? "status unavailable" : "Status unbekannt"}</span>`;
      target.dataset.agentState = "unknown";
    });
    document.querySelectorAll(".visual-tag.two").forEach((target) => {
      target.textContent = "Agent Runtime // STATUS UNKNOWN";
    });
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
