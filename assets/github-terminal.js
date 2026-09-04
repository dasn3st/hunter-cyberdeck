(() => {
  "use strict";

  const host = document.querySelector("[data-github-terminal]");
  if (!host) return;

  const files = [
    { path: "DESIGN.md", group: "root", label: "DESIGN.md", lang: "Markdown" },
    { path: "about.html", group: "root", label: "about.html", lang: "HTML" },
    { path: "archive.html", group: "root", label: "archive.html", lang: "HTML" },
    { path: "blog.html", group: "root", label: "blog.html", lang: "HTML" },
    { path: "code.html", group: "root", label: "code.html", lang: "HTML" },
    { path: "github.html", group: "root", label: "github.html", lang: "HTML" },
    { path: "index.html", group: "root", label: "index.html", lang: "HTML" },
    { path: "INSTALLATIONSVERLAUF.md", group: "root", label: "INSTALLATIONSVERLAUF.md", lang: "Markdown" },
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
      description: "Die öffentlichen HUNTER-Dateien und der Installationsverlauf direkt in der Seite: auswählbar, lesbar und mit einem Klick kopierbar. Interne Betriebs- und Übergabedokumente bleiben bewusst außerhalb der öffentlichen Ansicht.",
      tree: "REPOSITORY // HIERARCHIE",
      code: "DATEI // CODE-VORSCHAU",
      copy: "CODE KOPIEREN",
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
      description: "The public HUNTER files and setup history directly on the page: selectable, readable and copyable with one click. Internal operations and handover documents stay outside the public view.",
      tree: "REPOSITORY // HIERARCHY",
      code: "FILE // CODE PREVIEW",
      copy: "COPY CODE",
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

  const locale = () => labels[window.HUNTER_LANG === "en" ? "en" : "de"];
  const fileByPath = (path) => files.find((file) => file.path === path) || files[0];
  let activeFile = files.find((file) => file.path === "assets/site.js") || files[0];
  let activeSource = "";

  host.innerHTML = `
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
        <div class="github-code-body"><div class="github-code-loading" data-code-loading></div><pre class="github-code-pre" data-code-output tabindex="0" aria-label="Codezeilen"></pre></div>
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
  };

  const render = (source) => {
    activeSource = source;
    const output = host.querySelector("[data-code-output]");
    const loading = host.querySelector("[data-code-loading]");
    loading.hidden = true;
    output.innerHTML = source.split("\n").map((line, index) => `<span class="github-code-line"><span class="github-line-number">${String(index + 1).padStart(3, "0")}</span><span class="github-line-text">${highlight(line) || " "}</span></span>`).join("");
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
      render(await response.text());
    } catch (error) {
      render(`# ${activeFile.path}\n# Datei ist im Repository verlinkt.\n# Öffne den GitHub-Link für die vollständige Version.`);
      console.info("HUNTER Code-Vorschau konnte die lokale Datei nicht laden.", error);
    }
  };

  host.addEventListener("click", async (event) => {
    const fileButton = event.target.closest("[data-file]");
    if (fileButton) { await loadFile(fileButton.dataset.file); return; }
    const copyButton = event.target.closest("[data-copy-code]");
    if (!copyButton || !activeSource) return;
    try {
      await navigator.clipboard.writeText(activeSource);
    } catch (_) {
      const helper = document.createElement("textarea");
      helper.value = activeSource; helper.setAttribute("readonly", ""); helper.style.position = "fixed"; helper.style.opacity = "0";
      document.body.appendChild(helper); helper.select(); document.execCommand("copy"); helper.remove();
    }
    copyButton.dataset.copied = "true";
    copyButton.textContent = locale().copied;
    window.setTimeout(() => { delete copyButton.dataset.copied; copyButton.textContent = locale().copy; }, 1500);
  });

  setLabels();
  loadFile(activeFile.path);
  window.addEventListener("hunter-language-change", setLabels);
})();
