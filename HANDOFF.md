# HUNTER Cyberdeck — Übergabe für die Weiterarbeit

Stand: 10.10.2026  
Live-Seite: <https://hunter-cyberdeck.d4sn3st.dev/>  
Quellcode: <https://github.com/dasn3st/hunter-cyberdeck>

Diese Datei ist der Einstieg für einen neuen Chat oder eine neue Person. Sie
beschreibt ausschließlich die öffentliche Website und enthält keine privaten
Zugänge, Tokens oder Betriebsdaten.

## Kurzstatus

- Die Website ist ein statisches HTML/CSS/JavaScript-Projekt auf Netlify.
- Veröffentliche Blog-Beiträge kommen aus Supabase und werden beim Build als
  vollständige HTML-Seiten unter `/blog/<slug>/` erzeugt.
- Die statischen Artikelseiten sind die bevorzugte öffentliche Ausgabe. Die
  Netlify-Funktion ist nur ein Fallback, falls eine statische Seite fehlt.
- Für Suchmaschinen sind die Artikel öffentlich, crawlbar und mit Canonical,
  `index,follow`, Open Graph und `BlogPosting`-Schema ausgezeichnet.
- Der alte Artikelweg `post.html?slug=…` ist nur noch ein Weiterleitungsweg.
  Er darf nicht wieder als interne Linkform verwendet werden.

## Projektkarte

| Thema | Zuständige Stelle |
| --- | --- |
| Globale Gestaltung und Komponenten | `assets/styles.css`, `assets/site.js`, `assets/i18n.js` |
| Öffentliche Seiten | `index.html`, `hardware.html`, `tech.html`, `makerworld.html`, `archive.html`, `github.html`, `about.html` |
| Blog-Übersicht | `blog.html` — Bereich zwischen `BLOG_INDEX_START` und `BLOG_INDEX_END` wird beim Build ersetzt |
| Statischer Blog-Build | `scripts/prerender-blog.mjs` |
| Englische statische Seiten | `scripts/prerender-en.mjs` |
| Blog-Fallback zur Laufzeit | `netlify/functions/blog-post.mjs` |
| Dynamische Sitemap | `netlify/functions/sitemap.js` |
| Automatischer Blog-Neubau | `netlify/functions/rebuild-blog-static.mjs` und `trigger-blog-static.mjs` |
| Hosting und Routen | `netlify.toml`, `_headers`, `robots.txt` |

## Blog und SEO: nicht zurückbauen

Ein veröffentlichter Beitrag muss unter dieser Form erreichbar sein:

```text
https://hunter-cyberdeck.d4sn3st.dev/blog/<slug>/
```

Der Build erzeugt für jeden veröffentlichten Supabase-Beitrag:

- eine komplette HTML-Datei in `dist/blog/<slug>/index.html`,
- eine Canonical-URL auf genau diese Adresse,
- `meta robots="index,follow,max-image-preview:large"`,
- strukturierte `BlogPosting`-Daten und bei FAQ-Blöcken zusätzlich `FAQPage`,
- bereinigte interne Links: alte `post.html?slug=…`- und
  `blog/post.html?slug=…`-Links werden nach `/blog/<slug>/` normalisiert.

`post.html` selbst trägt bewusst `noindex,follow` und verweist kanonisch auf
die Blog-Übersicht. Das verhindert doppelte Suchergebnisvarianten.

`robots.txt` erlaubt Crawling. Nur interne Archivdokumente und Downloads sind
ausgeschlossen. Die Sitemap ist unter `/sitemap.xml` erreichbar und wird von
der Netlify-Funktion aus den veröffentlichten Beiträgen ergänzt.

Der 3D-Viewer wird in vorgerenderten Artikeln nur geladen, wenn ein Beitrag
tatsächlich einen `model`-Block besitzt. Die Content-Security-Policy enthält
deshalb gezielt `wasm-unsafe-eval` für WebAssembly; nicht durch eine allgemeine
`unsafe-eval`-Freigabe ersetzen.

## Lokales Arbeiten

```bash
git clone https://github.com/dasn3st/hunter-cyberdeck.git
cd hunter-cyberdeck
npm ci
npm run build
```

Der Build ruft die öffentlichen, veröffentlichten Blogdaten ab und erzeugt
`dist/`. `dist/` ist Build-Ausgabe und wird nicht manuell gepflegt.

Vor einem Commit mindestens prüfen:

```bash
npm run build
test -f dist/blog/_manifest.json
rg 'href="[^"]*(?:/blog/)?post\.html\?slug=' dist/blog || true
git status --short
```

Die letzte Suche soll keine Treffer liefern. Der Text eines historischen
Artikels darf die alte Adresse zitieren; eine echte HTML-Verlinkung auf
`post.html?slug=` oder `blog/post.html?slug=` ist dagegen ein SEO-Rückschritt.

## Veröffentlichung

Der Netlify-Build führt `npm run build` aus und veröffentlicht `dist/`.
Laut Repository-README ist der öffentliche GitHub-Stand nicht automatisch an
den produktiven Netlify-Deploy gekoppelt. Ein Git-Commit allein ist deshalb
keine Live-Veröffentlichung.

Für einen manuellen Deploy gilt:

1. Lokalen Build erfolgreich ausführen.
2. Erst eine Deploy-Vorschau kontrollieren.
3. Erst danach aus dem authentifizierten, mit der Site verknüpften
   Arbeitsverzeichnis produktiv deployen.
4. Live prüfen: Startseite, Blogübersicht, mindestens ein neuer Artikel,
   `/robots.txt` und `/sitemap.xml`.

Nach dem Veröffentlichen eines Beitrags stößt die geschützte Funktion
`trigger-blog-static` einen Neubau an. Zusätzlich prüft
`rebuild-blog-static` alle fünf Minuten, ob sich veröffentlichte Beiträge
geändert haben. Beide benötigen die Netlify-Umgebungsvariable
`HUNTER_NETLIFY_BUILD_HOOK`; ihren Wert niemals in Git oder Chat-Ausgaben
schreiben.

## Search Console: Ausgangslage und Erwartung

Beim SEO-Audit am 21.09.2026 war die Sitemap erfolgreich eingelesen.
Startseite und Blogübersicht waren indexiert; viele neuere Beiträge standen
noch auf „Gefunden – zurzeit nicht indexiert“. Das war kein `noindex`, keine
Robots-Sperre und kein Zugriffsproblem, sondern Googles noch ausstehender
Crawl. Ein aktueller Beispielartikel wurde damals zusätzlich zur Indexierung
eingereicht.

Wenn ein neuer Chat die Indexierung kontrollieren soll, zuerst in Google Search
Console prüfen statt den alten Wert zu übernehmen:

1. Property `sc-domain:d4sn3st.dev` öffnen.
2. Sitemaps-Bericht auf `https://hunter-cyberdeck.d4sn3st.dev/sitemap.xml`
   eingrenzen.
3. Eine betroffene kanonische Artikel-URL mit der URL-Prüfung kontrollieren.
4. Nur bei einem konkreten technischen Problem umbauen. Fehlende oder noch
   nicht gecrawlte neue URLs sind nicht automatisch ein Website-Fehler.

## Sichere Änderungsregeln

- Keine privaten Schlüssel, IP-Adressen, Hostnamen oder internen Agentenabläufe
  in dieses öffentliche Repository übernehmen.
- Inhalte im Blog nur mit gültigem `slug` (`a-z`, `0-9`, Bindestriche)
  veröffentlichen.
- Bei neuen externen Quellen die CSP in `_headers` bewusst ergänzen und die
  jeweilige Seite im Browser prüfen. Keine pauschalen Sicherheitsfreigaben.
- Bei Änderungen an Blog, Routen, Sitemap oder Headern immer bauen und die
  Live-URL nach dem Deploy prüfen.
- Bei Änderungen an `netlify/functions/blog-post.mjs` muss das Ergebnis zum
  statischen Renderer in `scripts/prerender-blog.mjs` passen; der Fallback
  darf keine zweite, abweichende Artikelversion erzeugen.

## Nächster sinnvoller Einstieg

1. `git pull --ff-only` und `npm ci` ausführen.
2. `npm run build` laufen lassen.
3. Die gewünschte fachliche Erweiterung umsetzen.
4. Die obigen SEO-Checks ausführen.
5. Commit erstellen; für eine Live-Änderung anschließend bewusst deployen.

