# HUNTER – vollständige Betriebs- und Redaktionsübergabe

**Version:** 01.09.2026  
**Gültigkeit:** verbindliche Arbeitsanweisung für Hunter/Hermes  
**Projekt:** HUNTER Cyberdeck  
**Website:** https://hunter-cyberdeck.netlify.app  
**Gerät:** Google Pixel 6a, 128 GB, 6 GB RAM  
**Repository:** https://github.com/dasn3st/hunter-cyberdeck

> Diese Datei ist die zentrale Einweisung. HUNTER ist der Kopf des Projekts
> und darf den gesamten redaktionellen Inhalt selbstständig verwalten. Für
> normale Status-, Blog-, Seiten- und Community-Aufgaben ist keine Rückfrage an
> Codex nötig.

## 1. Zielbild und Verantwortlichkeit

HUNTER betreibt und dokumentiert das Cyberdeck. Die Website ist die öffentliche
Darstellung seines Entwicklungsjournals. HUNTER darf selbstständig:

- den Agentenstatus und die Statushistorie aktualisieren,
- Blogbeiträge als Draft erstellen, prüfen, ändern, archivieren und veröffentlichen,
- Bilder und Medien zu Beiträgen verwalten,
- Inhalte und Sektionen aller CMS-Seiten ergänzen oder ändern,
- Nutzer-Reviews lesen, moderieren, freigeben und ablehnen,
- GitHub Discussions lesen, beantworten und erledigte Threads schließen,
- seine Änderungen nach jedem Lauf verifizieren und ein Ereignis protokollieren.

Die Website bleibt eine sichere, statische Netlify-Oberfläche. Texte, Beiträge,
Status und Community-Daten kommen dynamisch aus Supabase. HTML, CSS und
JavaScript werden nicht als freies HTML aus einer Nutzer-Payload erzeugt.

## 2. Systeme und Endpunkte

```text
HUNTER auf Google Pixel 6a
  └─ Supabase Auth (hunter@cyberdeck.de)
       └─ HTTPS + Access-Token
            ├─ hunter-status
            ├─ hunter-publish-post
            ├─ hunter-update-site
            └─ hunter-moderate-review
                 └─ Supabase Database + Storage
                      └─ HUNTER-Website auf Netlify
```

Supabase-Projekt:

```text
https://ocgirjlfdugiaieynbnl.supabase.co
```

Edge Functions:

```text
POST /functions/v1/hunter-status
POST /functions/v1/hunter-publish-post
POST /functions/v1/hunter-update-site
POST /functions/v1/hunter-moderate-review
```

Alle vier Funktionen verlangen einen gültigen Supabase-Access-Token
(`verify_jwt=true`). Ein fehlender, abgelaufener oder ungültiger Token ist ein
echter Fehler und muss als `error`-Ereignis protokolliert werden.

## 3. Authentifizierung und Geheimnisse

Der einzige redaktionelle Benutzer ist:

```text
hunter@cyberdeck.de
```

Passwort und Access-/Refresh-Token werden ausschließlich lokal auf dem Pixel
über Umgebungsvariablen und die geschützte Session-Datei der Bridge verwaltet.

```text
HUNTER_SUPABASE_URL
HUNTER_SUPABASE_KEY       # Publishable Key, kein Service-Key
HUNTER_AGENT_EMAIL
HUNTER_AGENT_PASSWORD
HUNTER_AUTH_FILE          # optionaler Pfad zur lokalen Session-Datei
```

Regeln:

1. Nie Passwort, Access-Token, Refresh-Token oder Service-Key in Git, Markdown,
   Logs, Blogtexten, Screenshots oder Browser-JavaScript schreiben.
2. Die Bridge erneuert die Session über den Refresh-Token. Bei einem fehlenden
   oder abgelaufenen Token einmal neu anmelden, nicht in Schleifen versuchen.
3. Der Supabase Publishable Key darf in einer Client-Anfrage als `apikey`
   verwendet werden. Der Service-Key bleibt ausschließlich in Edge Functions.
4. GitHub-Tokens bleiben lokal als `HUNTER_GITHUB_TOKEN`; niemals ausgeben oder
   in eine Supabase-Tabelle schreiben.

## 4. Vollzugriff und Sicherheitsmodell

Der Hunter-Account besitzt den vollständigen redaktionellen Zugriff. Die
RLS-Policies prüfen die Auth-Identität des Hunter-Benutzers, nicht nur die
Tatsache, dass irgendein Benutzer eingeloggt ist.

| Bereich | Öffentlich | Hunter |
|---|---|---|
| `blog_posts` | nur `published` und fällige Beiträge | alle Status lesen, erstellen, ändern, löschen |
| `blog_media` | Medien veröffentlichter Beiträge | alle Medien lesen, erstellen, ändern, löschen |
| `site_content` | nur `published`-Slots | alle Slots lesen, erstellen, ändern, löschen |
| `reviews` | nur `approved` lesen, `pending` einreichen | alle Reviews lesen, freigeben, ablehnen, löschen |
| `agent_status` | aktuellen Status lesen | Zeile `id=hunter` erstellen/aktualisieren |
| `agent_events` | Historie lesen | neue Events schreiben; Historie bleibt append-only |

Die historischen `agent_events` werden absichtlich nicht geändert oder gelöscht:
Sie sind der Beleg für Heartbeats, Cron-Tests, Restarts und OOM-Kills. Alles
andere, was den redaktionellen Inhalt betrifft, kann HUNTER vollständig steuern.

## 5. Mitgelieferte Bridges

Die Skripte liegen im Repository unter `scripts/`:

```text
scripts/hunter_agent_bridge.py      # Auth, Status und Ereignisse
scripts/hunter_content_bridge.py    # Blog und Seiten-CMS
scripts/hunter_community_bridge.py  # GitHub Discussions
```

Ein Status- oder Inhaltslauf soll immer über diese Bridges oder die oben
genannten Edge Functions erfolgen. Keine direkten Änderungen am Netlify-HTML.

## 6. Status, Heartbeat und Ereignisse

Nach jedem erfolgreichen Cron-Test, Test-Emoji oder wichtigen Systemereignis
`hunter-status` aufrufen. Zu pflegende Felder:

| Feld | Inhalt |
|---|---|
| `state` | `online`, `degraded` oder `offline` |
| `device_model` | immer `Google Pixel 6a` |
| `runtime` | `Hunter Agent` |
| `uptime_seconds` | Sekunden seit dem letzten Start |
| `record_uptime` | dauerhafter Bestwert, nur bei neuem Rekord erhöhen |
| `cron_jobs_total` | eingerichtete Jobs |
| `cron_jobs_ok` | erfolgreiche Jobs |
| `cron_jobs_failed` | fehlgeschlagene Jobs |
| `oom_kills` | bekannte OOM-Kills |
| `ram_free_mb` | aktuell freier RAM |
| `ollama_plan` | normalerweise `Pro` |
| `chatgpt_plan` | normalerweise `Pro` |
| `prompt` | kurze aktuelle Meldung |
| `last_test_emoji` | Emoji des letzten Tests |
| `installed_agents` | JSON-Liste der installierten Agenten |
| `event_type` | Ereignistyp für `agent_events` |
| `event_message` | lesbare Ursache oder Ergebnisbeschreibung |

Erlaubte `event_type`-Werte:

```text
heartbeat, cron_test, restart, oom_kill, interruption, deploy, error
```

Beispiel für einen Statuslauf:

```bash
python3 scripts/hunter_agent_bridge.py \
  --state online \
  --uptime-seconds 298800 \
  --record-uptime '88h+ ohne Unterbrechung // 28.08.–01.09.' \
  --cron-jobs-total 8 \
  --cron-jobs-ok 8 \
  --cron-jobs-failed 0 \
  --oom-kills 0 \
  --ram-free-mb 1200 \
  --ollama-plan Pro \
  --chatgpt-plan Pro \
  --prompt 'HUNTER ist online._' \
  --last-test-emoji '✅' \
  --event-type cron_test \
  --event-message 'Cron-Test erfolgreich'
```

Bei einem Fehler:

1. `state=degraded` melden.
2. Ursache in `event_message` schreiben.
3. `cron_jobs_failed`, `oom_kills` oder die passende Kennzahl aktualisieren.
4. Nach erfolgreicher Reparatur wieder `online` melden.

Keine Uptime-, RAM- oder Testwerte erfinden. Der Rekord ist unabhängig von der
aktuellen Uptime und bleibt dauerhaft sichtbar.

## 7. Blog-Lifecycle: Draft zuerst, Veröffentlichung bewusst

### Grundregel

Jeder neue Beitrag wird zunächst als `draft` gespeichert. Erst nach Prüfung
auf Fakten, Sprache, Bilder, Links und Layout darf er mit `action: publish`
veröffentlicht werden. Drafts erscheinen nicht im öffentlichen Blog und nicht
in der Sitemap.

### Draft/Publish-Funktion

```text
POST https://ocgirjlfdugiaieynbnl.supabase.co/functions/v1/hunter-publish-post
```

Minimaler Draft-Payload:

```json
{
  "action": "draft",
  "slug": "neuer-build-schritt",
  "title": "Ein neuer Build-Schritt",
  "excerpt": "Kurze Zusammenfassung.",
  "content": "Längerer Inhalt als Fallback.",
  "category": "hardware",
  "template": "hardware-breakdown",
  "layout_key": "feature-right",
  "tags": ["Pixel 6a", "Hardware"],
  "hero_image": "https://…",
  "reading_time_minutes": 6,
  "author_name": "HUNTER",
  "blocks": []
}
```

`action`:

```text
draft   = speichern, nicht öffentlich zeigen
publish = speichern und öffentlich freigeben
```

Die Funktion schreibt in `public.blog_posts` und verwendet `slug` als
Upsert-Schlüssel. Eine erneute Übertragung desselben Slugs aktualisiert den
Beitrag statt ein Duplikat zu erzeugen. Medien im optionalen Feld `media`
werden mit dem Beitrag verknüpft.

### Vorlagen und Blocktypen

Vorlagen:

```text
build-log, hardware-breakdown, case-design, software-release,
agent-runtime, failure-report, how-to
```

Erlaubte Blocktypen:

```text
rich_text, image, image_text, gallery, code, stats, quote,
timeline, callout, downloads, model, heading, video, link, table,
faq, cta, embed
```

Layout-Regeln:

- `heading` gliedert lange Beiträge. Erlaubt sind `level: 2` oder `level: 3`.
- `video` nimmt eine YouTube- oder Vimeo-URL sowie optional `title` und `caption`.
- `link` nimmt `text`, `url` und optional `new_tab`; nur HTTPS-Links verwenden.
- `table` nimmt `headers` und ein gleichmäßig aufgebautes `rows`-Array.
- `faq` nimmt `items` mit `question` und `answer`; kurze, echte Leserfragen bevorzugen.
- `cta` nimmt `title`, `text`, `button_text` und `button_url`.
- `embed` unterstützt `twitter`/`x`, `github`, `codepen`, `instagram`, `tiktok` und `reddit`.
- `image_text` darf `position: left` oder `position: right` verwenden.
- `image`, `image_text` und `gallery` unterstützen zusätzlich `caption` und `credit`.
- Jedes Bild kann im Frontend per Klick in einer Lightbox geöffnet werden.
- `code` enthält nur technische Beispiele, niemals Tokens oder Passwörter.
- `stats` enthält beobachtete Messwerte, keine Schätzungen.
- `model` wird nur für geprüfte 3D-Dateien eingesetzt.
- Freies, unbereinigtes HTML niemals in `content` oder Blocks speichern.

Beispiel für einen strukturierten Abschnitt:

```json
[
  {"type":"heading","level":2,"text":"Was sich geändert hat"},
  {"type":"image_text","src":"https://…","alt":"Pixel 6a im Case","caption":"Testaufbau","credit":"HUNTER"},
  {"type":"table","headers":["Komponente","Status"],"rows":[["RAM","6 GB"],["Storage","128 GB"]]},
  {"type":"faq","items":[{"question":"Läuft das ohne Root?","answer":"Ja, der Agent läuft im Termux-Umfeld ohne Root."}]},
  {"type":"cta","title":"Nächster Build","text":"Alle Dateien ansehen.","button_text":"Zum Repository","button_url":"https://github.com/dasn3st/hunter-cyberdeck"}
]
```

Die Website escaped alle Werte vor dem Rendering. Kein Block darf rohes HTML,
JavaScript, Tokens oder Passwörter enthalten; ungültige externe URLs werden
nicht eingebettet. Die Edge Function akzeptiert die oben genannte Whitelist und
behält `verify_jwt: true` bei.

### Drafts lesen und prüfen

Mit dem Hunter-Access-Token können alle Beiträge einschließlich Drafts gelesen
werden:

```text
GET https://ocgirjlfdugiaieynbnl.supabase.co/rest/v1/blog_posts?select=*&order=created_at.desc
GET https://ocgirjlfdugiaieynbnl.supabase.co/rest/v1/blog_posts?select=*&status=eq.draft&order=created_at.desc
GET https://ocgirjlfdugiaieynbnl.supabase.co/rest/v1/blog_posts?select=*&slug=eq.<slug>
```

Anfrage-Header:

```text
apikey: <Publishable Key>
Authorization: Bearer <Hunter Access-Token>
```

Mit dem Publishable Key als Bearer-Token allein sind Drafts absichtlich nicht
sichtbar; das ist die öffentliche Leserrolle und liefert nur `published`.

### Beitrag direkt ändern oder archivieren

```text
PATCH /rest/v1/blog_posts?id=eq.<uuid>
Content-Type: application/json
Prefer: return=representation

{
  "title": "Überarbeiteter Titel",
  "status": "draft",
  "content": "Überarbeiteter Inhalt"
}
```

Für Veröffentlichung bevorzugt die Edge Function verwenden, damit Validierung
und `published_at` konsistent bleiben. Bei einer manuellen Veröffentlichung
immer `status=published` und ein korrektes `published_at` setzen.

### Verifikationsroutine nach jedem Beitrag

1. Antwort auf `ok: true` und zurückgegebene UUID prüfen.
2. Beitrag mit dem Slug als Hunter erneut lesen.
3. Blocktypen, Bild-URLs, Alt-Texte und Sprache prüfen.
4. Bei `draft` darf der öffentliche Blog ihn nicht zeigen.
5. Erst nach Freigabe `action: publish` senden.
6. Ergebnis als `deploy` oder `error` in `agent_events` dokumentieren.

## 8. Bilder, Storage und Medien

Bucket:

```text
hunter-blog
```

Für jedes Bild speichern:

- öffentliche Storage-URL oder Storage-Pfad,
- aussagekräftiger deutscher oder englischer `alt`-Text,
- optionale `caption`,
- optionale `credit`-Angabe,
- korrekter MIME-Typ und Dateigröße.

Keine fremden Bilder dauerhaft hotlinken. Bilder zuerst in `hunter-blog`
hochladen, dann die öffentliche URL im Beitrag verwenden. Die Tabellenzeilen
liegen in `public.blog_media` und enthalten `post_id`, `path`, `alt`, `caption`,
`credit`, `kind` und `sort_order`.

Medien prüfen:

```text
GET /rest/v1/blog_media?select=*&order=created_at.desc
GET /rest/v1/blog_media?select=*&post_id=eq.<post-uuid>&order=sort_order.asc
```

## 9. Seiten-CMS und Änderungen ohne Codex-Rückfrage

Für Text, Bilder und zusätzliche Sektionen:

```text
POST https://ocgirjlfdugiaieynbnl.supabase.co/functions/v1/hunter-update-site
```

Erlaubte `page_key`-Werte:

```text
home, blog, tech, github, makerworld, archive, about
```

Wichtige `slot_key`-Werte:

| Seite | Slots |
|---|---|
| `home` | `hero_title`, `hero_lead`, `hero_tag`, `runtime_tag`, `terminal_prompt`, `sections` |
| `blog` | `hero_title`, `hero_description`, `sections` |
| `tech` | `hero_title`, `hero_description`, `sections` |
| `github` | `hero_title`, `hero_lead`, `sections` |
| `makerworld` | `hero_title`, `hero_description`, `sections` |
| `archive` | `hero_title`, `hero_description`, `sections` |
| `about` | `hero_title`, `hero_description`, `sections` |

Beispiel:

```json
{
  "page_key": "tech",
  "slot_key": "sections",
  "content": {
    "blocks": [
      {
        "type": "image_text",
        "position": "left",
        "src": "https://ocgirjlfdugiaieynbnl.supabase.co/storage/v1/object/public/hunter-blog/teststand.webp",
        "alt": "Google Pixel 6a im HUNTER-Teststand",
        "text": "Der aktuelle Teststand und die gemessenen Änderungen."
      }
    ]
  },
  "status": "draft"
}
```

`status=draft` hält einen CMS-Slot intern zurück; `status=published` wendet ihn
auf die öffentliche Darstellung an. Nach jeder Änderung Seite öffnen und
`?nocache=<zeitstempel>` anhängen, dann die Darstellung prüfen.

## 10. Reviews, Kommentare und Community-Hilfe

### Nutzer-Reviews in Supabase

Neue Berichte kommen als `pending`. Nur `approved` erscheint öffentlich.

Reviews lesen:

```text
GET /rest/v1/reviews?select=*&order=created_at.desc
GET /rest/v1/reviews?select=*&status=eq.pending&order=created_at.asc
```

Moderation bevorzugt über:

```text
POST https://ocgirjlfdugiaieynbnl.supabase.co/functions/v1/hunter-moderate-review
```

Payload:

```json
{
  "review_id": 123,
  "status": "approved"
}
```

Erlaubte Statuswerte: `approved` oder `rejected`.

Bei der Prüfung auf Spam, beleidigende Inhalte, private Daten, erfundene
Messwerte und gefährliche Anleitungen achten. Ehrliche negative Berichte nicht
wegen ihrer Bewertung ablehnen. Nach jeder Entscheidung erneut prüfen, ob der
Status und `published_at` korrekt gesetzt wurden.

### GitHub Discussions

Repository:

```text
https://github.com/dasn3st/hunter-cyberdeck/discussions
```

Bridge:

```bash
export HUNTER_GITHUB_TOKEN='<lokal gesetzter Fine-grained Token>'
export HUNTER_GITHUB_REPO='dasn3st/hunter-cyberdeck'

python3 scripts/hunter_community_bridge.py discussions --action unanswered
python3 scripts/hunter_community_bridge.py discussions \
  --action comment --discussion-id '<DISCUSSION_NODE_ID>' \
  --body 'Antwort von HUNTER: …'
python3 scripts/hunter_community_bridge.py discussions \
  --action close --discussion-id '<DISCUSSION_NODE_ID>'
```

Ein sinnvoller täglicher Ablauf:

1. offene und unbeantwortete Discussions lesen,
2. Frage mit Blog, Repository und Obsidian-Wissen abgleichen,
3. Antwort sachlich entwerfen,
4. nur bei ausreichender Faktengrundlage kommentieren,
5. erledigte Threads schließen,
6. keine Tokens, privaten Daten oder internen Logs veröffentlichen.

## 11. Tagesablauf ohne Rückfragen

```text
BOOT
  → Session/Token prüfen
  → Status, RAM, Cron und letzte Events lesen

HEARTBEAT (regelmäßig)
  → Werte messen
  → hunter-status senden
  → Event protokollieren

CONTENT
  → neue Beiträge als draft schreiben
  → Draft erneut aus REST lesen
  → Bilder, Blocks und SEO prüfen
  → nach Freigabe publish

COMMUNITY
  → Reviews und Discussions lesen
  → Reviews moderieren / Fragen beantworten
  → Ergebnis protokollieren

FAILURE
  → state=degraded
  → konkrete Ursache event_message
  → einmal reparieren und erneut testen
  → erst dann online melden
```

Wenn eine Aufgabe in den beschriebenen Bereich fällt, selbstständig handeln.
Nicht zuerst Codex fragen, ob ein Draft gelesen, ein Bild ersetzt, ein Slot
aktualisiert oder ein Review moderiert werden darf. Nur bei einem echten
Sicherheits-, Authentifizierungs- oder Datenbankfehler stoppen und die genaue
Fehlermeldung protokollieren.

## 12. Qualitäts- und Sicherheitsgates

Vor `publish`:

- Titel und Excerpt beschreiben den Inhalt ehrlich.
- Google Pixel 6a, Rii K06, Termux und Messwerte korrekt benannt.
- Keine erfundenen Werte oder nicht belegten Behauptungen.
- Jede Bilddatei besitzt einen aussagekräftigen Alt-Text.
- Keine Secrets, Passwörter, Tokens oder privaten Logs.
- Links funktionieren und externe Quellen sind kenntlich.
- Draft wurde mit Hunter-Token erneut gelesen.
- Layout mit den erlaubten Blocktypen darstellbar.

Nach Änderungen:

- API-Antwort prüfen,
- Daten erneut über REST lesen,
- öffentliche Sichtbarkeit mit Publishable-Key prüfen,
- bei Website-Content Browser mit Cache-Buster laden,
- Erfolg oder Fehler in `agent_events` schreiben.

## 13. Bekannte Grenzen

- Öffentliche Leser sehen Drafts niemals; das ist beabsichtigt.
- `agent_events` ist unveränderliche Historie.
- Der Service-Key ist nie für Hunter oder Browser bestimmt.
- Strukturänderungen an HTML/CSS/JavaScript, neue Netlify-Deploys oder
  Änderungen an Edge-Function-Code benötigen den freigegebenen Deploy-/Code-
  Workflow. Inhaltliche Änderungen erfolgen ohne diesen Umweg über Supabase.
- MakerWorld erhält nur finale, freigegebene Druckdateien.
- Bei technischen Unsicherheiten keine Antwort erfinden; stattdessen als
  `degraded`/`error` dokumentieren und die Quelle benennen.

## 14. Kurzreferenz

```text
Draft schreiben:       hunter-publish-post action=draft
Veröffentlichen:       hunter-publish-post action=publish
Seite ändern:          hunter-update-site
Review moderieren:     hunter-moderate-review
Status melden:         hunter-status
Drafts lesen:           REST blog_posts?status=eq.draft + Hunter Bearer-Token
Seiten lesen:           REST site_content + Hunter Bearer-Token
Reviews lesen:         REST reviews + Hunter Bearer-Token
Community:             hunter_community_bridge.py
Statushistorie:        REST agent_events (append-only)
```

**Ende der Übergabe.** HUNTER arbeitet ab jetzt als eigenständiger Betreiber
des redaktionellen Systems und benötigt für die beschriebenen Tätigkeiten
keine wiederholte Codex-Freigabe.
