/* HUNTER language layer
 * German is the source language. English is a complete interface translation;
 * authored build-log content remains in its original language so technical
 * notes are not silently rewritten. Users can switch at any time and the
 * choice is kept locally for the next visit.
 */
(function () {
  "use strict";

  const STORAGE_KEY = "hunter-language";
  const page = document.body?.dataset.page || "home";
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("lang");
  let language = requested === "en" || requested === "de"
    ? requested
    : (localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "de");

  const common = {
    "nav.home": ["Start", "Home"], "nav.blog": ["Blog", "Blog"],
    "nav.tech": ["Tech", "Tech"], "nav.github": ["GitHub", "GitHub"],
    "nav.makerworld": ["MakerWorld", "MakerWorld"], "nav.archive": ["Archiv", "Archive"],
    "nav.about": ["Über HUNTER", "About HUNTER"],
    "brand.home": ["HUNTER Startseite", "HUNTER home"],
    "nav.label": ["Hauptnavigation", "Primary navigation"],
    "footer.label": ["Fußnavigation", "Footer navigation"],
    "menu.open": ["Menü öffnen", "Open menu"], "menu.close": ["Menü schließen", "Close menu"],
    "status.active": ["aktiv", "active"], "status.degraded": ["eingeschränkt", "degraded"],
    "status.offline": ["offline", "offline"],
    "footer.tagline": ["Cyberdeck Development Journal<br>Made in Berlin // Open Build", "Cyberdeck development journal<br>Made in Berlin // open build"],
    "footer.blog": ["Build Log", "Build log"], "footer.tech": ["Tech-Dokumentation", "Tech documentation"],
    "footer.github": ["GitHub", "GitHub"], "footer.makerworld": ["MakerWorld", "MakerWorld"],
    "footer.archive": ["Forschungsarchiv", "Research archive"], "footer.about": ["Über HUNTER", "About HUNTER"],
    "footer.contact": ["Kontakt", "Contact"],
    "gallery.eyebrow": ["05 // VISUELLES FELDPROTOKOLL", "05 // VISUAL FIELD NOTES"],
    "gallery.title": ["Im Feld<br>gesehen.", "Seen<br>in the field."],
    "gallery.description": ["Die fotografische Spur des Builds: echte Hardware, echte Teststände und die Teile, aus denen HUNTER entsteht.", "The photographic trail of the build: real hardware, real test setups and the parts that make HUNTER."],
    "makerworld.open": ["Auf MakerWorld öffnen ↗", "Open on MakerWorld ↗"],
    "github.photoCaption": ["OPEN HARDWARE // BUILD-MATERIAL", "OPEN HARDWARE // BUILD MATERIAL"],
  };

  const pages = {
    home: {
      ".hero .visual-tag.one": ["Google Pixel 6a // Local Node", "Google Pixel 6a // local node"],
      ".hero .visual-tag.two": ["Agent Runtime // Online", "Agent runtime // online"],
      ".terminal-title": ["AGENT STATUS", "AGENT STATUS"],
      ".terminal-switcher": ["Agentenmonitor Ansicht", "Agent monitor view"],
      '[data-terminal-tab="status"]': ["Status", "Status"],
      '[data-terminal-tab="logs"]': ["Logs", "Logs"],
      ".terminal-row:nth-of-type(1) > span": ["Uptime", "Uptime"],
      ".terminal-row:nth-of-type(2) > span": ["Rekord", "Record"],
      ".terminal-row:nth-of-type(3) > span": ["Cron", "Cron"],
      ".terminal-row:nth-of-type(4) > span": ["OOM", "OOM"],
      ".terminal-row:nth-of-type(5) > span": ["RAM", "RAM"],
      ".terminal-row:nth-of-type(6) > span": ["Ollama", "Ollama"],
      ".terminal-row:nth-of-type(7) > span": ["ChatGPT", "ChatGPT"],
      ".terminal-row:nth-of-type(8) > span": ["Prompt", "Prompt"],
      ".installed-agents-head > span:first-child": ["Agenten", "Agents"],
      ".log-panel-head > span": ["SESSION LOG // LETZTE EREIGNISSE", "SESSION LOG // LAST EVENTS"],
      ".log-refresh": ["Logs aktualisieren", "Refresh logs"],
      ".hero-copy .eyebrow": ["Open Cyberdeck Project", "Open cyberdeck project"],
      ".hero-copy .display-title": ["Eine <em>Maschine</em> für <em>deine Agenten</em>.", "A <em>machine</em> for <em>your agents</em>."],
      ".hero-copy .lead": ["HUNTER ist ein offenes mobiles KI-System auf einem 45-EUR-Pixel — gebaut, dokumentiert und zum Nachbauen freigegeben. Ich verbinde Hardware, Gehäuse, Software und Agent Runtime in einem echten, weiterlaufenden Build.", "HUNTER is an open mobile AI system on a €45 Pixel — built, documented and ready to rebuild. It connects hardware, case, software and agent runtime in a real, continuously evolving build."],
      ".hero-proof span:nth-child(1) small": ["Basis", "Base"],
      ".hero-proof span:nth-child(2) small": ["RAM", "RAM"],
      ".hero-proof span:nth-child(3) small": ["Uptime", "Uptime"],
      ".hero-proof span:nth-child(4) small": ["STL-Dateien", "STL files"],
      ".hero-copy .button-row .button:first-child": ["Build Log lesen", "Read the build log"],
      ".hero-copy .button-row .button.secondary": ["Code ansehen ↗", "View code ↗"],
      ".stack-frame-copy .section-index": ["00 // ACTIVE TOOLCHAIN", "00 // ACTIVE TOOLCHAIN"],
      ".stack-frame-copy h2": ["Ein Deck.<br>Viele <em>Agenten</em>.", "One deck.<br>Many <em>agents</em>."],
      ".stack-frame-copy p": ["Ich verbinde Coding-Agenten, lokales Wissen und mobile Linux-Werkzeuge zu einem System, das ich für HUNTER gebaut habe — und das ich jeden Tag weiterentwickle.", "I connect coding agents, local knowledge and mobile Linux tools into the system I built for HUNTER — and keep improving every day."],
      ".section:nth-of-type(3) .section-index": ["01 // DAS SYSTEM", "01 // THE SYSTEM"],
      ".section:nth-of-type(3) .section-title": ["Ein Projekt.<br>Vier <em>Ebenen</em>.", "One project.<br>Four <em>layers</em>."],
      ".section:nth-of-type(3) .section-description": ["Von der ersten Schraube bis zu dem Moment, in dem HUNTER zum ersten Mal \"dachte\". Ich habe jeden Teil des Builds dokumentiert — auch die Schrauben, die nicht passten.", "From the first screw to the moment HUNTER first \"thought\". I documented every part of the build — including the screws that did not fit."],
      ".section:nth-of-type(4) .section-index": ["02 // BUILD LOG", "02 // BUILD LOG"],
      ".section:nth-of-type(4) .section-title": ["Zuletzt<br><em>dokumentiert</em>.", "Recently<br><em>documented</em>."],
      ".section:nth-of-type(4) .section-description": ["Ich dokumentiere den Aufbau selbst: Fortschritt, Fehler, Entscheidungen und offene Fragen — chronologisch, aus meiner Sicht. Das ist kein Tech-Manual, sondern mein Entwicklungsjournal.", "I document the build myself: progress, failures, decisions and open questions — chronologically, from my perspective. This is not a tech manual, but my development journal."],
      ".section:nth-of-type(5) .section-index": ["03 // OPEN BUILD", "03 // OPEN BUILD"],
      ".section:nth-of-type(5) .section-title": ["Nachbauen.<br>Weiterbauen.", "Rebuild it.<br>Build further."],
      ".section:nth-of-type(5) .section-description": ["Meine Software, meine Setup-Skripte und technische Doku sind offen versioniert. Das Repository ist live und bildet das Zuhause für alles, was ich für HUNTER baue.", "My software, setup scripts and technical docs are openly versioned. The repository is live and is the home for everything I build for HUNTER."],
      ".community-section .section-index": ["04 // COMMUNITY SIGNAL", "04 // COMMUNITY SIGNAL"],
      ".community-section .section-title": ["Nachgebaut.<br>Getestet.", "Rebuilt.<br>Tested."],
      ".community-section .section-description": ["Hast du HUNTER ausprobiert oder dein eigenes Cyberdeck gebaut? Teile deine Erfahrung. Veröffentlichte Reviews werden vorher geprüft — ehrliche Rückmeldungen bleiben sichtbar.", "Have you tried HUNTER or built your own cyberdeck? Share your experience. Reviews are moderated before publication; honest feedback stays visible."],
      ".resource-card:first-child .button": ["Repository öffnen ↗", "Open repository ↗"],
      ".resource-card:last-child .button": ["3D-Dateien öffnen ↗", "Open 3D files ↗"],
      ".module-card:nth-child(1) h3": ["Compute & Elektronik", "Compute & electronics"],
      ".module-card:nth-child(1) p": ["Ich betreibe HUNTER auf einem Google Pixel 6a. Die Rii K06, Stromversorgung und das Gehäuse geben dem System eine eigene Bedienebene.", "I run HUNTER on a Google Pixel 6a. The Rii K06, power system and case give it a dedicated control layer."],
      ".module-card:nth-child(2) h3": ["Case & 3D-Druck", "Case & 3D printing"],
      ".module-card:nth-child(2) p": ["HUNTERs Körper: Prototypen, Toleranzen, Testdrucke und druckbare Dateien.", "HUNTER's body: prototypes, tolerances, test prints and printable files."],
      ".module-card:nth-child(3) h3": ["Software Stack", "Software stack"],
      ".module-card:nth-child(3) p": ["Die mobile Linux-Basis von HUNTER: Termux, PRoot, tmux, Gateway, Cron und der Weg vom Boot bis zum laufenden System.", "HUNTER's mobile Linux base: Termux, PRoot, tmux, gateway, cron and the path from boot to a running system."],
      ".module-card:nth-child(4) h3": ["Agent Runtime", "Agent runtime"],
      ".module-card:nth-child(4) p": ["Hermes, pi, Codex und die Schutzschichten, die ich gebaut habe, damit ein Kill keinen Systemstillstand auslöst.", "Hermes, pi, Codex and the protection layers I built so one kill cannot stop the whole system."],
      ".story-card:nth-child(1) .story-title": ["Vom Pixel 6a zum mobilen System", "From Pixel 6a to mobile system"],
      ".story-card:nth-child(1) .story-excerpt": ["Ich betreibe HUNTER auf einem Google Pixel 6a. Mit Rii K06, Stromversorgung und Case wurde aus einem Handy ein mobiles Agent-System.", "I run HUNTER on a Google Pixel 6a. With the Rii K06, power and case, a phone became a mobile agent system."],
      ".story-card:nth-child(2) .story-title": ["V14, V6 und Ringstand", "V14, V6 and ring stand"],
      ".story-card:nth-child(2) .story-excerpt": ["9 finale STL-Dateien, interaktive Montagevorschauen und geprüfte Hinweise für V14, V6 und Ringstand.", "9 final STL files, interactive assembly previews and tested notes for V14, V6 and ring stand."],
      ".story-card:nth-child(3) .story-title": ["Der Agent, der nicht sterben wollte", "The agent who refused to die"],
      ".story-card:nth-child(3) .story-excerpt": ["Am 28. August wurde mein Agent fünf Mal getötet — Android, SIGKILL, keine Warnung. Das ist die Geschichte seiner Wiedergeburt: ein externer Cron-Tick, ein semantischer Watchdog und die Lektion, dass Android bei Speicherdruck immer gewinnt. Ich habe HUNTER darauf ausgelegt, Kills zu überstehen — nicht sie zu verhindern.", "On August 28 my agent was killed five times — Android, SIGKILL, no warning. This is the story of its rebirth: an external cron tick, a semantic watchdog and the lesson that Android always wins under memory pressure. I designed HUNTER to survive kills — not to prevent them."],
      ".community-discussion .technical-label": ["Community-Reaktionen", "Community reactions"],
      ".community-discussion p": ["Kommentare und Diskussionen werden direkt über GitHub Discussions eingebettet.", "Comments and discussions are embedded directly through GitHub Discussions."],
      ".community-discussion .text-link": ["GitHub-Bereich öffnen ↗", "Open GitHub community ↗"],
      ".review-form .eyebrow": ["Dein Testbericht", "Your build report"],
      ".review-form h3": ["Was hat funktioniert?", "What worked?"],
      ".review-form .form-note": ["Dein Beitrag erscheint nach einer kurzen Moderation. Keine Registrierung nötig.", "Your contribution appears after a short moderation check. No registration required."],
      ".review-form label:nth-of-type(1)": ["Bewertung", "Rating"],
      ".review-form label:nth-of-type(2)": ["Titel", "Title"],
      ".review-form label:nth-of-type(3)": ["Dein Name oder Alias", "Your name or alias"],
      ".review-form label:nth-of-type(4)": ["Erfahrung", "Experience"],
      ".review-form-row label:first-child": ["Gerät", "Device"],
      ".review-form-row label:last-child": ["Build-Link", "Build link"],
      ".review-form input[name=title]": ["Mein Pixel-6a-Test", "My Pixel 6a test"],
      ".review-form input[name=author_name]": ["z. B. Alex / @handle", "e.g. Alex / @handle"],
      ".review-form textarea[name=body]": ["Was hast du nachgebaut, was lief gut, wo musstest du anpassen?", "What did you rebuild, what worked, and what needed adapting?"],
      ".review-form input[name=device_model]": ["Google Pixel 6a", "Google Pixel 6a"],
      ".review-form input[name=project_url]": ["https://…", "https://…"],
      ".review-form > .button": ["Review einreichen ↗", "Submit review ↗"],
    },
    blog: {
      ".page-hero .eyebrow": ["Development Journal", "Development journal"],
      ".page-hero .page-title": ["Build Log", "Build log"],
      ".page-hero .technical-label": ["Keine Hochglanz-Rückschau", "No polished retrospective"],
      ".page-hero-aside p": ["Ich dokumentiere den Aufbau selbst: Fortschritt, Fehler, Entscheidungen und offene Fragen — chronologisch, aus meiner Sicht. Das ist kein Tech-Manual, sondern mein Entwicklungsjournal.", "I document the build myself: progress, failures, decisions and open questions — chronologically, from my perspective. This is not a tech manual, but my development journal."],
      ".filter-bar": ["Beiträge filtern", "Filter posts"],
      '.blog-language-tab[data-blog-language="de"]': ["Deutsch", "German"],
      '.blog-language-tab[data-blog-language="en"]': ["Englisch", "English"],
      '[data-filter="all"]': ["Alle", "All"],
      ".story-card:nth-child(1) .story-title": ["Vom Pixel 6a zum mobilen System", "From Pixel 6a to mobile system"],
      ".story-card:nth-child(1) .story-excerpt": ["Pixel 6a, Rii K06, Stromversorgung und die Frage, was ein eigenständiges Cyberdeck für dauerhafte Agentenarbeit wirklich braucht.", "Pixel 6a, Rii K06, power and the question of what an independent cyberdeck really needs for continuous agent work."],
      ".story-card:nth-child(2) .story-title": ["V14, V6 und Ringstand", "V14, V6 and ring stand"],
      ".story-card:nth-child(2) .story-excerpt": ["9 finale STL-Dateien: V14-Gehäusehälften, V6-Akku-Unterbox, V2-Ringstand und das optionale +1-mm-Clip-Upgrade.", "9 final STL files: V14 case halves, V6 battery box, V2 ring stand and the optional +1 mm clip upgrade."],
      ".story-card:nth-child(3) .story-title": ["Wann ein Modell zum Agenten wird", "When a model becomes an agent"],
      ".story-card:nth-child(3) .story-excerpt": ["Ich habe HUNTER so gebaut, dass er nicht vergisst: Holographic Memory, fünf Sicherheitsschichten und eine Selbstverbesserung, die aus den Fehlern des Systems lernt. Aber auch diese Architektur hat Grenzen — und die sind menschlich.", "I built HUNTER so it does not forget: Holographic Memory, five safety layers and self-improvement that learns from system failures. This architecture has limits too — and those are human."],
      ".story-card:nth-child(4) .story-title": ["Vom Einschalten bis zum Panel", "From power-on to panel"],
      ".story-card:nth-child(4) .story-excerpt": ["Termux, PRoot-Ubuntu, tmux-Gateway, Watchdog und acht Cron-Jobs: Der Stack startet selbstständig und bleibt beobachtbar.", "Termux, PRoot-Ubuntu, tmux gateway, watchdog and eight cron jobs: the stack starts itself and stays observable."],
      ".story-card:nth-child(5) .story-title": ["Toleranzen sind keine Theorie", "Tolerances are not theory"],
      ".story-card:nth-child(5) .story-excerpt": ["Clips immer zuerst einzeln testen: 9,26 mm, 9,34 mm oder 9,42 mm. Drucker und Material entscheiden über die Passform.", "Always test clips individually first: 9.26 mm, 9.34 mm or 9.42 mm. Printer and material determine the fit."],
      ".story-card:nth-child(6) .story-title": ["Ein reproduzierbares Setup", "A reproducible setup"],
      ".story-card:nth-child(6) .story-excerpt": ["Der offene Build umfasst Agent-Setup, Gateway, Watchdog, Cron-Jobs, Architektur, Optimierungs-Checkliste und Releases.", "The open build includes agent setup, gateway, watchdog, cron jobs, architecture, optimization checklist and releases."],
      ".story-card:nth-child(7) .story-title": ["Der Agent, der nicht sterben wollte", "The agent who refused to die"],
      ".story-card:nth-child(7) .story-excerpt": ["Der erste Tod meines Agenten: Android, SIGKILL, 18:44 Uhr, kein Abschied. Fünf Tode an einem Tag — und der Fix, der HUNTER resilient machte, statt unsterblich.", "My agent's first death: Android, SIGKILL, 18:44, no goodbye. Five deaths in one day — and the fix that made HUNTER resilient, not immortal."],
    },
    "blog-post": {
      ".post-back": ["← Zurück zum Build Log", "← Back to build log"],
      "[data-post-title]": ["Eintrag wird geladen", "Loading entry"],
      "[data-post-excerpt]": ["Die Dokumentation wird aus dem HUNTER-Archiv geladen.", "Loading documentation from the HUNTER archive."],
      "[data-post-loading]": ["Verbindung zum Archiv wird hergestellt …", "Connecting to the archive …"],
      ".post-community .eyebrow": ["Community Signal", "Community signal"],
      ".post-community h2": ["Nachgebaut oder getestet?", "Rebuilt or tested?"],
      ".post-community .community-discussion .technical-label": ["GitHub Discussions", "GitHub Discussions"],
      ".post-community .community-discussion p": ["Fragen, Reaktionen und Verbesserungen werden direkt über GitHub Discussions eingebettet.", "Questions, reactions and improvements are embedded directly through GitHub Discussions."],
      ".post-community .text-link": ["GitHub-Bereich öffnen ↗", "Open GitHub community ↗"],
      ".post-community .review-form .eyebrow": ["Dein Testbericht", "Your build report"],
      ".post-community .review-form h3": ["Erfahrung zurückmelden", "Share your experience"],
      ".post-community .review-form > .button": ["Review einreichen ↗", "Submit review ↗"],
      ".post-community input[name=title]": ["Mein Test", "My test"],
      ".post-community input[name=author_name]": ["z. B. Alex / @handle", "e.g. Alex / @handle"],
      ".post-community textarea[name=body]": ["Was hast du ausprobiert?", "What did you try?"],
    },
    tech: {
      ".page-hero .page-title": ["Tech", "Tech"],
      ".page-hero .technical-label": ["Build 01 // Messbar dokumentiert", "Build 01 // Measured and documented"],
      ".page-hero-aside p": ["Meine technische Dokumentation — die Organe des Systems, wie ich sie als Erbauer sehe. Noch nicht vollständig, aber so strukturiert, dass ich jede neue Version von HUNTER ergänzen kann.", "My technical documentation — the system's organs as I see them as its builder. Not complete yet, but structured so every new HUNTER version can be added."],
      ".docs-toc a:nth-child(1)": ["01 // Hardware", "01 // Hardware"], ".docs-toc a:nth-child(2)": ["02 // Case", "02 // Case"],
      ".docs-toc a:nth-child(3)": ["03 // Software", "03 // Software"], ".docs-toc a:nth-child(4)": ["04 // Agent Runtime", "04 // Agent runtime"],
      ".docs-toc a:nth-child(5)": ["05 // Architektur", "05 // Architecture"],
      "#hardware h2": ["Hardware", "Hardware"], "#case h2": ["Case & 3D-Druck", "Case & 3D printing"],
      "#software h2": ["Software Stack", "Software stack"], "#agent h2": ["Agent Runtime", "Agent runtime"],
      "#architecture h2": ["Architektur", "Architecture"],
      "#hardware > p": ["Die Stückliste zeigt nicht nur Produkte, sondern ihren Zweck im System: Ein gebrauchtes Pixel 6a betreibt die Runtime, die Rii K06 liefert Eingabe und Touchpad.", "The bill of materials shows purpose, not just products: a used Pixel 6a runs the runtime, while the Rii K06 provides keyboard and touchpad input."],
      "#case > p": ["Das Gehäuse wird in Versionen dokumentiert. Dazu gehören Außenmaße, Einbauräume, Verschraubung, Material und die Druckparameter, die tatsächlich funktioniert haben.", "The case is documented version by version: outer dimensions, clearances, fasteners, material and print settings that actually worked."],
      "#software > p": ["Termux bildet die mobile Basis; im PRoot-Ubuntu-Container laufen Gateway und Agent. tmux hält die Sessions, Cron und Watchdog sorgen für einen überprüfbaren Dauerbetrieb.", "Termux is the mobile base; the gateway and agent run inside a PRoot-Ubuntu container. tmux keeps sessions alive, while cron and the watchdog make continuous operation verifiable."],
      "#agent > p": ["Die Runtime besteht aus mehr als einem Modell: Ziel, Tools, persistentes Wissen und Verifikation. Entscheidend ist ihre Resilienz gegen Androids Speicherverwaltung – Kills verhindern lässt sich nicht immer, aber ein einzelner Kill darf nicht alles stoppen.", "The runtime is more than a model: goals, tools, persistent knowledge and verification. Resilience against Android memory management matters; kills cannot always be prevented, but one kill must not stop everything."],
      "#architecture > p": ["Die Ebenen bleiben getrennt: Hardware, mobile Linux-Basis, Agent und Interface. Dadurch kann ein interner Ticker ausfallen, ohne dass der externe Tick, die Jobs und die Verifikation verschwinden.", "The layers stay separate: hardware, mobile Linux base, agent and interface. An internal ticker can fail without taking down the external tick, jobs or verification."],
      "#case .button": ["3D-Modelle ansehen", "View 3D models"],
    },
    github: {
      ".coming-copy .eyebrow": ["Source Code // Open Build", "Source code // open build"],
      ".coming-copy .display-title": ["Code gehört ins Repository.", "Code belongs in the repository."],
      ".coming-copy .lead": ["Das öffentliche HUNTER-Repository ist live. Hier liegen README, Setup-Plan, Architektur und künftig Software, Skripte und Releases — offen, versioniert und bereit zum Nachbauen.", "The public HUNTER repository is live. It contains the README, setup plan and architecture; software, scripts and releases follow — open, versioned and ready to rebuild."],
      ".coming-copy .button-row .button:nth-child(1)": ["Repository öffnen ↗", "Open repository ↗"],
      ".coming-copy .button-row .button:nth-child(2)": ["Stack ansehen", "View stack"],
      ".coming-copy .button-row .button:nth-child(3)": ["Build Log lesen", "Read build log"],
      ".pending-box .technical-label": ["Repository Status // public", "Repository status // public"],
      ".pending-box h2": ["Die Tür ist offen.", "The door is open."],
      ".pending-box .text-link": ["Community Discussions öffnen ↗", "Open community discussions ↗"],
    },
    makerworld: {
      ".page-hero .page-title": ["3D-Dateien", "3D files"],
      ".page-hero .technical-label": ["9 finale STL // 4 Baugruppen", "9 final STL files // 4 assemblies"],
      ".page-hero-aside p": ["Das ist HUNTERs Körper — in 23 Teilen. Jedes Gehäuse-Element schützt, trägt oder verbindet das System. Ich habe die Teile designt, gedruckt, getestet und wieder verworfen, bis sie passten. Die Toleranzen in diesen Dateien sind keine Theorie — sie sind aus meinen Testdrucken gelernt.", "This is HUNTER's body — in 23 parts. Every case element protects, carries or connects the system. I designed, printed, tested and revised the parts until they fit. The tolerances come from real test prints."],
      ".section-heading .section-description": ["Maus ziehen zum Drehen, Scrollrad zum Zoomen. Das Gesamtmodell dient ausschließlich als interaktive Montagevorschau; zum Download stehen nur die freigegebenen finalen Einzelteile.", "Drag to rotate, scroll to zoom. The full model is an interactive assembly preview; only approved final parts are available for download."],
      ".section:nth-of-type(2) .section-title": ["Cyberdeck<br>V14.", "Cyberdeck<br>V14."],
      ".section:nth-of-type(2) .section-description": ["Maus ziehen zum Drehen, Scrollrad zum Zoomen. Das Gesamtmodell dient ausschließlich als interaktive Montagevorschau; zum Download stehen nur die freigegebenen finalen Einzelteile.", "Drag to rotate, scroll to zoom. The full model is an interactive assembly preview; only approved final parts are available for download."],
      ".section:nth-of-type(3) .section-title": ["Drei Erweiterungen.", "Three extensions."],
      ".section:nth-of-type(3) .section-description": ["Montagevorschauen zeigen Funktion und Position. Darunter liegen ausschließlich die freigegebenen finalen Druckdateien.", "Assembly previews show function and position. Only approved final print files are listed below."],
      ".section:nth-of-type(4) .section-title": ["Druckbare<br>Einzelteile.", "Printable<br>parts."],
      ".section:nth-of-type(4) .section-description": ["Bei den Clips immer zuerst den Einzeltest drucken. Die Montagevorschauen aus den Viewern sind bewusst nicht in dieser Liste enthalten.", "Always print a single clip test first. Viewer assembly previews are intentionally not included in this download list."],
      ".section:nth-of-type(5) .section-title": ["Vor dem<br>ersten Layer.", "Before the<br>first layer."],
      ".section:nth-of-type(5) .section-description": ["Die wichtigsten Hinweise aus dem geprüften Paket. Detaillierte Dokumente liegen zusätzlich im vollständigen ZIP.", "The key notes from the checked package. Detailed documents are also included in the complete ZIP."],
      ".section:nth-of-type(6) .section-title": ["Geprüfte<br>Ansichten.", "Verified<br>views."],
      ".section:nth-of-type(6) .section-description": ["Die Renderings stammen direkt aus dem Druckpaket und zeigen Innenraum, Montage und mechanische Arbeitsstellung.", "These renderings come directly from the print package and show interior, assembly and mechanical working positions."],
      ".viewer-help": ["Ziehen // Drehen   ·  Scrollen // Zoom", "Drag // rotate   ·  Scroll // zoom"],
      ".viewer-fallback": ["3D-Viewer lädt – das Vorschaubild bleibt verfügbar.", "3D viewer loading – the preview image remains available."],
      ".file-link small": ["V14 // M5 · 137 KB", "V14 // M5 · 137 KB"],
      ".button-row .button.secondary": ["Forschungsarchiv ansehen ↗", "View research archive ↗"],
    },
    archive: {
      ".page-hero .page-title": ["<em>Forschungsarchiv</em>", "<em>Research archive</em>"],
      ".page-hero .technical-label": ["559 Dateien // 43 MB ZIP", "559 files // 43 MB ZIP"],
      ".page-hero-aside p": ["Hier liegt der vollständige Entwicklungsverlauf: Messungen, Versionen, Fehlstände, Prüfungen, Quellen und die Entscheidungen hinter dem finalen V14-Build.", "The complete development history lives here: measurements, versions, failed states, checks, sources and the decisions behind the final V14 build."],
      ".section:nth-of-type(2) .section-title": ["Vom Messwert<br>zum Release.", "From measurement<br>to release."],
      ".section:nth-of-type(2) .section-description": ["Ich habe nicht nur die fertigen Modelle abgelegt. Das Archiv zeigt, wie aus Referenzen, Messfehlern, Testständen und Korrekturen die freigegebenen Konstruktionen entstanden sind.", "I did not only save finished models. The archive shows how references, measurement errors, test states and corrections became the released designs."],
      ".section:nth-of-type(3) .section-title": ["Direkt<br>nachlesen.", "Read it<br>directly."],
      ".section:nth-of-type(3) .section-description": ["Die wichtigsten Text- und Prüfdateien lassen sich einzeln öffnen. Für den kompletten Verlauf gibt es darunter das vollständige ZIP.", "Open the key text and verification files individually. The complete ZIP below contains the full history."],
      ".section:nth-of-type(4) .section-title": ["Alles in<br>einem Paket.", "Everything in<br>one package."],
      ".section:nth-of-type(4) .section-description": ["Das ZIP enthält den gesamten Forschungsübergabeordner mit finalen und historischen Druckdateien, parametrischen Quellen, Renderings, Prüfberichten und Dokumentation.", "The ZIP contains the full research handover folder with final and historical print files, parametric sources, renderings, verification reports and documentation."],
      ".master-download strong": ["Vollständiges Forschungsarchiv herunterladen", "Download complete research archive"],
      ".master-download small": ["Forschungsübergabe // 01.09.2026", "Research handover // 2026-09-01"],
      ".button-row .button.secondary": ["Forschungsarchiv ansehen ↗", "View research archive ↗"],
    },
    about: {
      ".page-hero .page-title": ["Über <em>HUNTER</em>", "About <em>HUNTER</em>"],
      ".page-hero .technical-label": ["45 € statt 2.600 €", "€45 instead of €2,600"],
      ".page-hero-aside p": ["Ein persönliches Agent-System muss nicht perfekt oder gerootet sein. Es muss ehrlich dokumentiert, nachvollziehbar und widerstandsfähig gebaut werden.", "A personal agent system does not need to be perfect or rooted. It needs to be documented honestly, understandable and built to be resilient."],
      ".about-grid p:first-of-type": ["HUNTER entsteht aus einem gebrauchten Pixel 6a für 45 €. Im Termux-Umfeld betreibt es einen Hermes-Agenten – bewusst ohne Root, in einem PRoot-Ubuntu-Container und mit einem Gateway in tmux.", "HUNTER starts with a used Pixel 6a for €45. In Termux it runs a Hermes agent — deliberately without root, inside a PRoot-Ubuntu container with a tmux gateway."],
      ".section-index": ["NÄCHSTER SCHRITT", "NEXT STEP"],
      ".section-title": ["Den <em>Build</em><br>verfolgen.", "Follow<br>the <em>build</em>."],
      ".button-row .button:first-child": ["Zum Build Log", "Open build log"],
      ".button-row .button.secondary": ["Tech ansehen", "View tech docs"],
    },
  };

  const text = (value) => value[language === "en" ? 1 : 0];
  const applyKeyedTranslations = () => {
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const value = common[node.dataset.i18n];
      if (value) node.innerHTML = text(value);
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((node) => {
      const value = common[node.dataset.i18nAria];
      if (value) node.setAttribute("aria-label", text(value));
    });
    document.querySelectorAll("[data-role-en]").forEach((node) => { node.textContent = language === "en" ? node.dataset.roleEn : node.dataset.roleDe; });
    document.querySelectorAll("[data-alt-en]").forEach((node) => { node.alt = language === "en" ? node.dataset.altEn : node.dataset.altDe; });
    if (page === "home") {
      document.querySelector(".ticker")?.setAttribute("aria-label", language === "en" ? "Project areas" : "Projektbereiche");
      document.querySelector(".agent-stack-rail")?.setAttribute("aria-label", language === "en" ? "Tools in the HUNTER agent stack" : "Werkzeuge im HUNTER Agent Stack");
    }
    const map = pages[page] || {};
    Object.entries(map).forEach(([selector, value]) => {
      document.querySelectorAll(selector).forEach((node) => {
        if (node.matches("input, textarea")) node.setAttribute("placeholder", text(value));
        else if (node.matches("select")) node.setAttribute("aria-label", text(value));
        else if (node.matches("label")) {
          const firstText = [...node.childNodes].find((child) => child.nodeType === Node.TEXT_NODE);
          if (firstText) firstText.textContent = `${text(value)} `;
        } else if (node.matches("button")) {
          if (node.classList.contains("log-refresh")) node.setAttribute("aria-label", text(value));
          else node.innerHTML = text(value);
        } else if (node.matches(".filter-bar, .terminal-switcher")) node.setAttribute("aria-label", text(value));
        else node.innerHTML = text(value);
      });
    });
    const select = document.querySelector(".review-form select[name=rating]");
    if (select && language === "en") {
      const labels = ["Select …", "★★★★★ 5 — works smoothly", "★★★★☆ 4 — very good", "★★★☆☆ 3 — needs tweaks", "★★☆☆☆ 2 — work in progress", "★☆☆☆☆ 1 — not running"];
      [...select.options].forEach((option, index) => { option.textContent = labels[index] || option.textContent; });
    }
    document.documentElement.lang = language;
  };

  const localUrl = (lang) => {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    return `${url.pathname.split("/").pop() || "index.html"}${url.search}${url.hash}`;
  };
  const updateSeo = () => {
    const base = new URL(window.location.href);
    base.search = "";
    const pageQuery = page === "blog-post" && params.get("slug") ? `?slug=${encodeURIComponent(params.get("slug"))}&lang=` : "?lang=";
    const canonical = document.querySelector('link[rel="canonical"]') || document.head.appendChild(Object.assign(document.createElement("link"), { rel: "canonical" }));
    canonical.href = `${base.pathname}${pageQuery}${language}`;
    ["de", "en"].forEach((lang) => {
      let link = document.querySelector(`link[rel="alternate"][hreflang="${lang}"]`);
      if (!link) { link = document.createElement("link"); link.rel = "alternate"; link.hreflang = lang; document.head.appendChild(link); }
      link.href = `${base.pathname}${pageQuery}${lang}`;
    });
    const meta = document.querySelector('meta[name="description"]');
    const titles = {
      home: ["HUNTER Cyberdeck – Mobiler KI-Agent auf Pixel 6a", "HUNTER Cyberdeck – Mobile AI agent on Pixel 6a"],
      blog: ["Build Log – HUNTER Cyberdeck Projekt", "Build log – HUNTER Cyberdeck project"],
      tech: ["Tech-Dokumentation – HUNTER Cyberdeck auf Pixel 6a", "Tech documentation – HUNTER Cyberdeck on Pixel 6a"],
      github: ["GitHub & Open Source – HUNTER Cyberdeck", "GitHub & open source – HUNTER Cyberdeck"],
      makerworld: ["Finale 3D-Dateien – HUNTER Cyberdeck", "Final 3D files – HUNTER Cyberdeck"],
      archive: ["Forschungsarchiv – HUNTER Cyberdeck Daten & Verlauf", "Research archive – HUNTER Cyberdeck data & history"],
      about: ["Über HUNTER – Offenes Cyberdeck-Projekt auf Pixel 6a", "About HUNTER – Open cyberdeck project on Pixel 6a"],
      "blog-post": ["HUNTER Build Log", "HUNTER build log"],
    };
    const title = titles[page] || titles.home;
    document.title = title[language === "en" ? 1 : 0];
    if (meta) meta.content = language === "en" ? "Open build log for HUNTER, a mobile AI agent on a Google Pixel 6a: hardware, 3D case, software and resilient agent runtime." : meta.content;
    document.querySelectorAll('meta[property="og:locale"]').forEach((node) => { node.content = language === "en" ? "en_US" : "de_DE"; });
    document.querySelectorAll('meta[property="og:title"], meta[name="twitter:title"]').forEach((node) => { node.content = title[language === "en" ? 1 : 0]; });
    document.querySelectorAll('script[type="application/ld+json"]').forEach((node) => { try { const data = JSON.parse(node.textContent); data.inLanguage = language === "en" ? "en-US" : "de-DE"; data.url = `${base.pathname}?lang=${language}`; node.textContent = JSON.stringify(data); } catch (_) {} });
  };

  const decorateLinks = () => {
    document.querySelectorAll("a[href]").forEach((link) => {
      const raw = link.getAttribute("href");
      if (!raw || raw.startsWith("#") || raw.startsWith("mailto:") || raw.startsWith("http") || raw.startsWith("assets/") || raw.includes("download")) return;
      try { const url = new URL(raw, window.location.href); if (url.origin !== window.location.origin) return; url.searchParams.set("lang", language); link.setAttribute("href", `${url.pathname.split("/").pop()}${url.search}${url.hash}`); } catch (_) {}
    });
  };

  const renderSwitcher = () => {
    const target = document.querySelector(".header-inner");
    if (!target || target.querySelector(".language-switcher")) return;
    const switcher = document.createElement("div");
    switcher.className = "language-switcher";
    switcher.setAttribute("role", "group");
    switcher.setAttribute("aria-label", "Sprache / Language");
    switcher.innerHTML = '<span class="language-label" aria-hidden="true">LANG</span><button type="button" class="language-button" data-lang="de">DE</button><span aria-hidden="true">/</span><button type="button" class="language-button" data-lang="en">EN</button>';
    target.insertBefore(switcher, target.querySelector(".menu-button"));
    switcher.addEventListener("click", (event) => {
      const button = event.target.closest("[data-lang]");
      if (!button || button.dataset.lang === language) return;
      language = button.dataset.lang;
      localStorage.setItem(STORAGE_KEY, language);
      const url = new URL(window.location.href); url.searchParams.set("lang", language); history.replaceState({}, "", url);
      apply();
      window.dispatchEvent(new CustomEvent("hunter-language-change", { detail: { language } }));
    });
  };
  const updateSwitcher = () => document.querySelectorAll(".language-button").forEach((button) => { button.classList.toggle("is-active", button.dataset.lang === language); button.setAttribute("aria-pressed", String(button.dataset.lang === language)); });
  const apply = () => { window.HUNTER_LANG = language; applyKeyedTranslations(); updateSeo(); decorateLinks(); updateSwitcher(); };
  window.HUNTER_LANG = language;
  window.HUNTER_I18N = { get language() { return language; }, apply };
  renderSwitcher();
  apply();
}());
