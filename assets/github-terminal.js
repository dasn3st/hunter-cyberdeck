(() => {
  "use strict";

  const host = document.querySelector("[data-github-terminal]");
  if (!host) return;

  const files = [
    { path: "DESIGN.md", group: "root", label: "DESIGN.md", lang: "Markdown" },
    { path: "HUNTER_ENTSTEHUNGSGESCHICHTE.md", group: "root", label: "HUNTER_ENTSTEHUNGSGESCHICHTE.md", lang: "Markdown" },
    { path: "about.html", group: "root", label: "about.html", lang: "HTML" },
    { path: "archive.html", group: "root", label: "archive.html", lang: "HTML" },
    { path: "blog.html", group: "root", label: "blog.html", lang: "HTML" },
    { path: "code.html", group: "root", label: "code.html", lang: "HTML" },
    { path: "github.html", group: "root", label: "github.html", lang: "HTML" },
    { path: "index.html", group: "root", label: "index.html", lang: "HTML" },
    { path: "INSTALLATIONSVERLAUF.md", group: "root", label: "INSTALLATIONSVERLAUF.md", lang: "Markdown" },
    { path: "Cyberdeck-Befehle-Termux-vs-Container.md", group: "root", label: "Cyberdeck-Befehle-Termux-vs-Container.md", lang: "Markdown" },
    { path: "makerworld.html", group: "root", label: "makerworld.html", lang: "HTML" },
    { path: "post.html", group: "root", label: "post.html", lang: "HTML" },
    { path: "tech.html", group: "root", label: "tech.html", lang: "HTML" },
    { path: "assets/blog.js", group: "assets", label: "blog.js", lang: "JavaScript" },
    { path: "assets/community.js", group: "assets", label: "community.js", lang: "JavaScript" },
    { path: "assets/content.js", group: "assets", label: "content.js", lang: "JavaScript" },
    { path: "assets/github-terminal.js", group: "assets", label: "github-terminal.js", lang: "JavaScript" },
    { path: "assets/i18n.js", group: "assets", label: "i18n.js", lang: "JavaScript" },
    { path: "assets/model-data.js", group: "assets", label: "model-data.js", lang: "JavaScript" },
    { path: "assets/print-viewers.js", group: "assets", label: "print-viewers.js", lang: "JavaScript" },
    { path: "assets/site.js", group: "assets", label: "site.js", lang: "JavaScript" },
    { path: "assets/styles.css", group: "assets", label: "styles.css", lang: "CSS" },
  ];

  const labels = {
    de: {
      eyebrow: "SOURCE CODE // LIVE REPOSITORY MAP",
      title: "CODE-STRUKTUR IM TERMINAL.",
      description: "Die öffentlichen HUNTER-Dateien, der Installationsverlauf und die kopierbare Befehlsstrecke direkt in der Seite: auswählbar, lesbar und mit einem Klick kopierbar. Interne Betriebs- und Übergabedokumente bleiben bewusst außerhalb der öffentlichen Ansicht.",
      tree: "REPOSITORY // HIERARCHIE",
      code: "DATEI // CODE-VORSCHAU",
      copy: "CODE KOPIEREN",
      commandCopy: "BEFEHL KOPIEREN",
      commandCopied: "KOPIERT",
      copied: "KOPIERT",
      github: "DATEI AUF GITHUB ↗",
      loading: "DATEI WIRD GELADEN …",
      ready: "BEREIT // AUSWÄHLEN UND KOPIEREN",
      root: "ROOT",
      assets: "ASSETS",
    },
    en: {
      eyebrow: "SOURCE CODE // LIVE REPOSITORY MAP",
      title: "CODE STRUCTURE IN TERMINAL.",
      description: "The public HUNTER files, setup history and copyable command chain directly on the page: selectable, readable and copyable with one click. Internal operations and handover documents stay outside the public view.",
      tree: "REPOSITORY // HIERARCHY",
      code: "FILE // CODE PREVIEW",
      copy: "COPY CODE",
      commandCopy: "COPY COMMAND",
      commandCopied: "COPIED",
      copied: "COPIED",
      github: "OPEN FILE ON GITHUB ↗",
      loading: "LOADING FILE …",
      ready: "READY // SELECT AND COPY",
      root: "ROOT",
      assets: "ASSETS",
    },
  };

  const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  })[character]);

  const highlight = (line) => {
    const escaped = escapeHtml(line);
    const token = /(#[^\n]*|\/\/[^\n]*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|\b(def|return|from|import|class|if|else|elif|for|while|try|except|raise|const|let|function|new|async|await|export|default|true|false|null|None)\b/g;
    return escaped.replace(token, (match, comment, string, keyword) => {
      if (comment) return `<span class="code-comment">${comment}</span>`;
      if (string) return `<span class="code-string">${string}</span>`;
      if (keyword) return `<span class="code-keyword">${keyword}</span>`;
      return match;
    });
  };

  const inlineMarkdown = (value) => escapeHtml(value)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");

  const renderOriginStory = (source) => {
    const lines = source.split(/\r?\n/);
    const output = [];
    let paragraph = [];
    let list = [];

    const flushParagraph = () => {
      if (!paragraph.length) return;
      output.push(`<p>${paragraph.map((line) => inlineMarkdown(line)).join(" ")}</p>`);
      paragraph = [];
    };
    const flushList = () => {
      if (!list.length) return;
      output.push(`<ul>${list.map((item) => `<li>${inlineMarkdown(item)}</li>`).join("")}</ul>`);
      list = [];
    };
    const flush = () => { flushParagraph(); flushList(); };

    lines.forEach((line) => {
      if (!line.trim()) { flush(); return; }
      const heading = line.match(/^(#{1,3})\s+(.+)/);
      if (heading) {
        flush();
        const level = heading[1].length === 1 ? 2 : 3;
        output.push(`<h${level}>${inlineMarkdown(heading[2].trim())}</h${level}>`);
        return;
      }
      const item = line.match(/^\s*[-*]\s+(.+)/);
      if (item) { flushParagraph(); list.push(item[1].trim()); return; }
      flushList();
      paragraph.push(line.trim());
    });
    flush();
    const content = host.querySelector("[data-origin-story-content]");
    if (!content) return;
    content.innerHTML = output.join("");

    const figure = host.querySelector(".github-origin-portrait");
    const firstChapter = content.querySelector("h3");
    if (!figure || !firstChapter) return;
    const lead = document.createElement("div");
    const leadCopy = document.createElement("div");
    const flow = document.createElement("div");
    lead.className = "github-origin-lead";
    leadCopy.className = "github-origin-lead-copy";
    flow.className = "github-origin-flow";
    const nodes = [...content.childNodes];
    const leadNodes = [];
    const contextNodes = [];
    const chapters = [];
    let mode = "lead";
    let currentChapter;
    let introParagraphs = 0;
    nodes.forEach((node) => {
      if (node === firstChapter) {
        mode = "chapter";
        currentChapter = { heading: node, nodes: [] };
        chapters.push(currentChapter);
        return;
      }
      if (mode === "lead") {
        if (node.tagName === "P" && introParagraphs >= 4) mode = "context";
        if (mode === "lead") {
          leadNodes.push(node);
          if (node.tagName === "P") introParagraphs += 1;
        } else {
          contextNodes.push(node);
        }
        return;
      }
      if (mode === "context") {
        if (node.tagName === "H3") {
          mode = "chapter";
          currentChapter = { heading: node, nodes: [] };
          chapters.push(currentChapter);
        } else {
          contextNodes.push(node);
        }
        return;
      }
      if (node.tagName === "H3") {
        currentChapter = { heading: node, nodes: [] };
        chapters.push(currentChapter);
      } else if (currentChapter) {
        currentChapter.nodes.push(node);
      }
    });
    leadCopy.append(...leadNodes);
    const compactParagraphs = (items, limit = 520) => {
      const compact = [];
      let paragraph;
      const flush = () => {
        if (paragraph) compact.push(paragraph);
        paragraph = undefined;
      };
      items.forEach((node) => {
        if (node.tagName !== "P") {
          flush();
          compact.push(node.cloneNode(true));
          return;
        }
        const clone = node.cloneNode(true);
        if (!paragraph || paragraph.textContent.length + clone.textContent.length > limit) {
          flush();
          paragraph = clone;
          return;
        }
        paragraph.append(document.createTextNode(" "), ...clone.childNodes);
      });
      flush();
      return compact;
    };
    const makeCard = (items, heading, chapterIndex, context = false) => {
      const card = document.createElement("section");
      const chapterNumber = String(chapterIndex).padStart(2, "0");
      card.className = `github-origin-chapter${context ? " github-origin-context" : ""}`;
      card.dataset.chapter = chapterNumber;
      const meta = document.createElement("div");
      meta.className = "github-origin-card-meta";
      const chapterLabel = document.createElement("span");
      chapterLabel.textContent = context ? "PROLOG // HUNTER" : `KAPITEL ${chapterNumber} // ORIGIN LOG`;
      const storyLabel = document.createElement("span");
      storyLabel.textContent = "ENTSTEHUNGSGESCHICHTE // 2026";
      meta.append(chapterLabel, storyLabel);
      card.appendChild(meta);
      if (heading) {
        const title = heading.cloneNode(true);
        title.id = `origin-chapter-${chapterNumber}`;
        card.appendChild(title);
        card.setAttribute("aria-labelledby", title.id);
      }
      const body = document.createElement("div");
      body.className = "github-origin-card-body";
      body.append(...compactParagraphs(items));
      card.appendChild(body);
      return card;
    };
    const pages = [];
    if (contextNodes.length) {
      const contextBody = [...contextNodes];
      const firstParagraph = contextBody.find((node) => node.tagName === "P");
      const contextHeading = document.createElement("h3");
      contextHeading.textContent = firstParagraph?.textContent || "AUSGANGSLAGE";
      if (firstParagraph) contextBody.splice(contextBody.indexOf(firstParagraph), 1);
      pages.push({ card: makeCard(contextBody, contextHeading, 0, true), chapterIndex: 0, headingText: contextHeading.textContent });
    }
    chapters.forEach(({ heading, nodes: chapterNodes }, chapterIndex) => {
      pages.push({ card: makeCard(chapterNodes, heading, chapterIndex + 1), chapterIndex: chapterIndex + 1, headingText: heading.textContent });
    });
    const storyMedia = [
      ["assets/hunter-gallery/hunter-cyberdeck-02.jpg", "Draufsicht auf Pixel 6a, Rii K06 und Case-Teile", "02 // COMPONENTS"],
      ["assets/hunter-gallery/hunter-cyberdeck-11.jpg", "Vollständiger Teileaufbau des Cyberdecks", "11 // RELEASE SET"],
      ["assets/hunter-gallery/hunter-cyberdeck-01.jpg", "HUNTER Cyberdeck mit geöffnetem Display und Ringstand", "01 // FIELD NODE"],
      ["assets/hunter-gallery/hunter-cyberdeck-05.jpg", "Nahaufnahme von Rii K06 und Pixel 6a", "05 // INPUT"],
      ["assets/hunter-gallery/hunter-cyberdeck-04.jpg", "HUNTER Cyberdeck als vollständiges mobiles System", "04 // SYSTEM ONLINE"],
      ["assets/hunter-gallery/hunter-cyberdeck-03.jpg", "Seitliche Ansicht von Pixel 6a und Rii K06 im Case", "03 // INTERFACE"],
      ["assets/hunter-gallery/hunter-cyberdeck-06.jpg", "Ringstand und Gehäuse im Testaufbau", "06 // STAND MODULE"],
      ["assets/hunter-gallery/hunter-cyberdeck-07.jpg", "Montageübersicht mit Case-Hälften und Komponenten", "07 // ASSEMBLY"],
      ["assets/hunter-gallery/hunter-cyberdeck-08.jpg", "Cyberdeck-Rückseite mit Hexgitter und Ringstand", "08 // CASE BACK"],
      ["assets/hunter-gallery/hunter-cyberdeck-09.jpg", "Geöffnete Case-Komponente mit Ringmechanik", "09 // MECHANICS"],
      ["assets/hunter-gallery/hunter-cyberdeck-10.jpg", "Ringstand-Modul in der Draufsicht", "10 // TOLERANCE"],
      ["assets/hunter-gallery/hunter-cyberdeck-12.jpg", "Detailaufnahme des HUNTER Cyberdecks im Feld", "12 // FIELD ARCHIVE"],
    ];
    const makeMedia = (media, screenIndex) => {
      const [src, alt, caption] = media;
      const figure = document.createElement("figure");
      figure.className = "github-origin-media";
      const image = document.createElement("img");
      image.src = src;
      image.alt = alt;
      image.loading = screenIndex < 2 ? "eager" : "lazy";
      image.decoding = "async";
      const label = document.createElement("figcaption");
      label.textContent = caption;
      figure.append(image, label);
      return figure;
    };
    const brandStories = [
      { match: /UBUNTU|EIGENTLICHE SYSTEM/, label: "TERMUX // MOBILE LINUX", logos: [["assets/brands/termux-x11.png", "Termux X11"]] },
      { match: /AGENT WURDE ZUM SCHLÜSSEL/, label: "PI // CODING AGENT", logos: [["assets/brands/pi.svg", "Pi Coding Agent"]] },
      { match: /AB JETZT BAUTEN DIE AGENTEN MIT/, label: "ACTIVE AGENT STACK", logos: [["assets/brands/opencode.svg", "OpenCode"], ["assets/brands/claude.svg", "Claude Code"], ["assets/brands/codex.svg", "Codex"], ["assets/brands/pi.svg", "Pi Coding Agent"]] },
      { match: /NICHT INSTALLIEREN WOLLTE/, label: "HERMES // SELF-HOSTED AGENT", logos: [["assets/brands/hermes.svg", "Hermes Agent"]] },
      { match: /OHNE ROOT/, kind: "terminal", label: "HERMES // LIVE SYSTEM VIEW" },
      { match: /ANDERE KIS/, label: "CROSS-MODEL RESEARCH", logos: [["assets/brands/codex.svg", "Codex"], ["assets/brands/claude.svg", "Claude Code"]] },
      { match: /STAND HEUTE/, label: "HUNTER // MULTI-AGENT SYSTEM", logos: [["assets/brands/opencode.svg", "OpenCode"], ["assets/brands/codex.svg", "Codex"], ["assets/brands/pi.svg", "Pi Coding Agent"]] },
    ];
    const makeBrandMedia = ({ label, logos = [], kind }, screenIndex) => {
      const figure = document.createElement("figure");
      figure.className = "github-origin-media github-origin-brandstage";
      if (kind === "terminal") {
        figure.classList.add("is-terminal");
        const terminal = document.createElement("div");
        terminal.className = "github-origin-agent-terminal";
        terminal.innerHTML = `
          <div class="github-origin-agent-terminal-bar"><span>● ● ●</span><span>HUNTER@PIXEL6A // HERMES</span></div>
          <div class="github-origin-agent-terminal-body">
            <p><span>$</span> hermes gateway status</p>
            <p class="is-success">● GATEWAY ONLINE</p>
            <p><span>$</span> hermes doctor</p>
            <dl>
              <div><dt>RUNTIME</dt><dd>TERMUX // ARM64</dd></div>
              <div><dt>PLATFORM</dt><dd>TELEGRAM // CONNECTED</dd></div>
              <div><dt>WATCHDOG</dt><dd>ARMED // RECOVERY READY</dd></div>
              <div><dt>HEARTBEAT</dt><dd>HOURLY // ACTIVE</dd></div>
            </dl>
            <p class="is-prompt"><span>›</span> HUNTER wartet auf den nächsten Auftrag_</p>
          </div>`;
        const caption = document.createElement("figcaption");
        caption.textContent = label;
        figure.append(terminal, caption);
        return figure;
      }
      const grid = document.createElement("div");
      grid.className = `github-origin-brand-grid${logos.length > 1 ? " is-multi" : ""}`;
      logos.forEach(([src, name]) => {
        const tile = document.createElement("div");
        tile.className = "github-origin-brand-tile";
        const image = document.createElement("img");
        image.src = src;
        image.alt = `${name} Logo`;
        image.loading = screenIndex < 2 ? "eager" : "lazy";
        const text = document.createElement("span");
        text.textContent = name;
        tile.append(image, text);
        grid.appendChild(tile);
      });
      const caption = document.createElement("figcaption");
      caption.textContent = label;
      figure.append(grid, caption);
      return figure;
    };
    pages.forEach(({ card, chapterIndex, headingText }, index) => {
      const screen = document.createElement("section");
      screen.className = "github-origin-screen";
      const storyLength = card.querySelector(".github-origin-card-body")?.textContent.length || 0;
      const searchableHeading = headingText.toLocaleUpperCase("de-DE");
      const brandStory = brandStories.find(({ match }) => match.test(searchableHeading));
      screen.dataset.layout = brandStory?.kind === "terminal" ? "balanced" : storyLength > 1500 ? "copy-focus" : storyLength < 780 ? "balanced" : "media-focus";
      screen.dataset.screen = String(index + 1).padStart(2, "0");
      const mediaIndex = (chapterIndex * 2) % storyMedia.length;
      screen.append(card, brandStory ? makeBrandMedia(brandStory, index) : makeMedia(storyMedia[mediaIndex], index));
      flow.appendChild(screen);
    });
    lead.append(figure, leadCopy);
    content.replaceChildren(lead, flow);
  };

  const commandBlocks = (source) => {
    const entries = [];
    const lines = source.split(/\r?\n/);
    let section = "Befehls-Kette";
    let language = "bash";
    let inFence = false;
    let block = [];
    lines.forEach((line) => {
      if (!inFence) {
        const heading = line.match(/^##\s+(.+)/);
        if (heading) {
          section = heading[1].trim();
          return;
        }
        const fence = line.match(/^```\s*([\w+-]*)/);
        if (fence) {
          inFence = true;
          language = fence[1] || "bash";
          block = [];
        }
        return;
      }
      if (/^```/.test(line)) {
        const command = block.join("\n").trim();
        if (command) entries.push({ section, language, command });
        inFence = false;
        return;
      }
      block.push(line);
    });
    return entries;
  };

  const locale = () => labels[window.HUNTER_LANG === "en" ? "en" : "de"];
  const fileByPath = (path) => files.find((file) => file.path === path) || files[0];
  const commandGuidePaths = new Set(["INSTALLATIONSVERLAUF.md", "Cyberdeck-Befehle-Termux-vs-Container.md"]);
  let activeFile = files.find((file) => file.path === "INSTALLATIONSVERLAUF.md") || files[0];
  let activeSource = "";

  host.innerHTML = `
    <article class="github-origin-story" data-origin-story aria-label="HUNTER: Wie das Projekt entstanden ist">
      <div class="github-origin-story-kicker">BUILD ORIGIN // HUNTER</div>
      <div class="github-origin-story-layout">
        <div class="github-origin-story-content" data-origin-story-content>
          <h2>HUNTER: WIE DAS PROJEKT ENTSTANDEN IST</h2>
          <p>DER ÖFFENTLICHE URSPRUNGSBERICHT WIRD GELADEN …</p>
        </div>
        <figure class="github-origin-portrait">
          <img src="assets/hunter-origin-portrait-workshop.jpg" alt="Marcel in seiner Werkstatt mit einem Bauteil des HUNTER Cyberdecks" loading="lazy" decoding="async">
          <figcaption>MARCEL // BUILDER OF HUNTER</figcaption>
        </figure>
      </div>
    </article>
    <div class="github-terminal-heading">
      <div>
        <span class="section-index" data-terminal-label="eyebrow"></span>
        <h2 id="github-code-title" class="section-title" data-terminal-label="title"></h2>
      </div>
      <p class="section-description" data-terminal-label="description"></p>
    </div>
    <div class="github-terminal-shell">
      <aside class="github-repo-tree" aria-label="Repository hierarchy">
        <div class="github-terminal-bar"><span data-terminal-label="tree"></span><span class="github-tree-status">PUBLIC</span></div>
        <div class="github-tree-list">
          <div class="github-tree-root">⌄ <span>hunter-cyberdeck/</span></div>
          <div class="github-tree-group"><span class="github-tree-folder">▾ <span data-terminal-label="root"></span></span>${files.filter((file) => file.group === "root").map((file) => `<button type="button" class="github-tree-file" data-file="${file.path}">◻ <span>${file.label}</span></button>`).join("")}</div>
          <div class="github-tree-group"><span class="github-tree-folder">▾ <span data-terminal-label="assets"></span>/</span>${files.filter((file) => file.group === "assets").map((file) => `<button type="button" class="github-tree-file" data-file="${file.path}">◼ <span>${file.label}</span></button>`).join("")}</div>
        </div>
      </aside>
      <section class="github-code-window" aria-label="Code preview">
        <div class="github-terminal-bar github-code-bar"><span data-terminal-label="code"></span><div class="github-code-actions"><span class="github-code-path" data-code-path></span><span class="github-code-lang" data-code-lang></span><button type="button" class="github-copy-button" data-copy-code></button><a class="github-file-link" data-github-file target="_blank" rel="noopener"></a></div></div>
        <div class="github-code-body"><div class="github-code-loading" data-code-loading></div><pre class="github-code-pre" data-code-output tabindex="0" aria-label="Codezeilen"></pre><div class="github-command-guide" data-command-guide hidden></div></div>
        <div class="github-terminal-status"><span class="status-dot"></span><span data-terminal-label="ready"></span></div>
      </section>
    </div>`;

  const setLabels = () => {
    const current = locale();
    host.querySelectorAll("[data-terminal-label]").forEach((node) => {
      const key = node.dataset.terminalLabel;
      if (current[key]) node.textContent = current[key];
    });
    const fileLink = host.querySelector("[data-github-file]");
    if (fileLink) fileLink.textContent = current.github;
    const copyButton = host.querySelector("[data-copy-code]");
    if (copyButton && !copyButton.dataset.copied) copyButton.textContent = current.copy;
    host.querySelectorAll("[data-command-copy]").forEach((button) => {
      if (!button.dataset.copied) button.textContent = current.commandCopy;
    });
  };

  const render = (source) => {
    activeSource = source;
    const output = host.querySelector("[data-code-output]");
    const loading = host.querySelector("[data-code-loading]");
    loading.hidden = true;
    output.innerHTML = source.split("\n").map((line, index) => `<span class="github-code-line"><span class="github-line-number">${String(index + 1).padStart(3, "0")}</span><span class="github-line-text">${highlight(line) || " "}</span></span>`).join("");
    output.hidden = false;
    host.querySelector("[data-command-guide]").hidden = true;
  };

  const renderCommandGuide = (source) => {
    activeSource = source;
    const output = host.querySelector("[data-code-output]");
    const guide = host.querySelector("[data-command-guide]");
    const entries = commandBlocks(source);
    output.hidden = true;
    guide.hidden = false;
    guide.innerHTML = entries.map((entry, index) => `
      <article class="github-command-step">
        <div class="github-command-meta"><span>STEP ${String(index + 1).padStart(2, "0")}</span><span>${escapeHtml(entry.language.toUpperCase())}</span></div>
        <h3>${escapeHtml(entry.section)}</h3>
        <pre class="github-command-block"><code>${escapeHtml(entry.command)}</code></pre>
        <button type="button" class="github-copy-command" data-command-copy>${locale().commandCopy}</button>
      </article>`).join("");
  };

  const copyText = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch (_) {
      const helper = document.createElement("textarea");
      helper.value = value; helper.setAttribute("readonly", ""); helper.style.position = "fixed"; helper.style.opacity = "0";
      document.body.appendChild(helper); helper.select(); document.execCommand("copy"); helper.remove();
    }
  };

  const loadFile = async (path) => {
    activeFile = fileByPath(path);
    host.querySelectorAll("[data-file]").forEach((button) => button.classList.toggle("is-active", button.dataset.file === activeFile.path));
    host.querySelector("[data-code-path]").textContent = activeFile.path;
    host.querySelector("[data-code-lang]").textContent = activeFile.lang;
    host.querySelector("[data-github-file]").href = `https://github.com/dasn3st/hunter-cyberdeck/blob/main/${activeFile.path}`;
    const loading = host.querySelector("[data-code-loading]");
    loading.hidden = false;
    loading.textContent = locale().loading;
    try {
      const response = await fetch(activeFile.path, { cache: "no-store" });
      if (!response.ok) throw new Error(`file ${response.status}`);
      const source = await response.text();
      commandGuidePaths.has(activeFile.path) ? renderCommandGuide(source) : render(source);
    } catch (error) {
      render(`# ${activeFile.path}\n# Datei ist im Repository verlinkt.\n# Öffne den GitHub-Link für die vollständige Version.`);
      console.info("HUNTER Code-Vorschau konnte die lokale Datei nicht laden.", error);
    }
  };

  const loadOriginStory = async () => {
    try {
      const response = await fetch("HUNTER_ENTSTEHUNGSGESCHICHTE.md", { cache: "no-store" });
      if (!response.ok) throw new Error(`story ${response.status}`);
      renderOriginStory(await response.text());
    } catch (error) {
      console.info("HUNTER Ursprungsbericht konnte nicht geladen werden.", error);
    }
  };

  host.addEventListener("click", async (event) => {
    const fileButton = event.target.closest("[data-file]");
    if (fileButton) { await loadFile(fileButton.dataset.file); return; }
    const commandButton = event.target.closest("[data-command-copy]");
    if (commandButton) {
      const command = commandButton.closest(".github-command-step")?.querySelector(".github-command-block")?.textContent || "";
      if (!command) return;
      await copyText(command);
      commandButton.dataset.copied = "true";
      commandButton.textContent = locale().commandCopied;
      window.setTimeout(() => { delete commandButton.dataset.copied; commandButton.textContent = locale().commandCopy; }, 1500);
      return;
    }
    const copyButton = event.target.closest("[data-copy-code]");
    if (!copyButton || !activeSource) return;
    await copyText(activeSource);
    copyButton.dataset.copied = "true";
    copyButton.textContent = locale().copied;
    window.setTimeout(() => { delete copyButton.dataset.copied; copyButton.textContent = locale().copy; }, 1500);
  });

  setLabels();
  loadOriginStory();
  loadFile(activeFile.path);
  window.addEventListener("hunter-language-change", setLabels);
})();
