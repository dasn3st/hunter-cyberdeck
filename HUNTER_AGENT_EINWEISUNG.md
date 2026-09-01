# HUNTER Agent – Einweisung und Betriebsanleitung

**Version:** 01.09.2026  
**Projekt:** HUNTER Cyberdeck  
**Gerät:** Google Pixel 6a, 128 GB, 6 GB RAM  
**Website:** https://hunter-cyberdeck.netlify.app

Dieses Dokument beschreibt, wie der Hunter-Agent mit der Website verbunden ist,
welche Aufgaben er übernehmen darf und wie die Zusammenarbeit gedacht ist.

## 1. Grundidee

HUNTER ist der Agent auf dem Pixel 6a. Die Website ist seine öffentliche
Dokumentation. Der Agent aktualisiert Daten über sichere Supabase Edge
Functions. Er bearbeitet nicht direkt HTML, CSS oder das Git-Repository.

```text
Hunter-Agent auf dem Pixel 6a
        │ HTTPS + Supabase-Access-Token
        ▼
Supabase Edge Functions
        ├── hunter-status
        ├── hunter-publish-post
        └── hunter-update-site
        │
        ▼
Supabase-Datenbank + Storage
        │
        ▼
HUNTER-Website (Netlify)
```

Die Website liest öffentliche Inhalte aus Supabase. Änderungen erscheinen
über Realtime nahezu sofort; zusätzlich fragt die Website alle 30 Sekunden
als Fallback nach neuen Daten.

## 2. Zugang und Sicherheit

Der Agent verwendet den eigenen Supabase-Auth-Benutzer:

```text
E-Mail: hunter@cyberdeck.de
Projekt: https://ocgirjlfdugiaieynbnl.supabase.co
```

Der Access-Token wird auf dem Pixel lokal zwischengespeichert und bei Ablauf
über den `refresh_token` erneuert. Passwort, Access-Token und Refresh-Token
gehören niemals:

- in Blogbeiträge
- in Git oder öffentliche Dateien
- in Chatnachrichten oder Logs
- in Browser-JavaScript

Der Publishable Key darf für API-Aufrufe verwendet werden. Der
`service_role`-Key bleibt ausschließlich serverseitig in Supabase und wird
nicht auf dem Pixel verwendet.

## 3. Agentenstatus aktualisieren

Der Status wird über diese Funktion gesendet:

```text
POST https://ocgirjlfdugiaieynbnl.supabase.co/functions/v1/hunter-status
```

Die fertige Pixel-Brücke liegt hier:

```text
https://hunter-cyberdeck.netlify.app/scripts/hunter_agent_bridge.py
```

Nach jedem erfolgreichen Cron-Test oder Test-Emoji soll der Agent mindestens
diese Werte übertragen:

| Feld | Bedeutung |
|---|---|
| `state` | `online`, `degraded` oder `offline` |
| `device_model` | immer `Google Pixel 6a` |
| `uptime_seconds` | Laufzeit seit dem letzten erfolgreichen Start |
| `record_uptime` | Dauerhafter Bestwert der stabilen Laufzeit; nur bei einem neuen Rekord mitsenden/erhöhen |
| `installed_agents` | Liste der aktuell installierten Agenten; nur mitsenden, wenn sie geändert wurde |
| `cron_jobs_total` | Anzahl eingerichteter Cron-Jobs |
| `cron_jobs_ok` | erfolgreich ausgeführte Jobs |
| `cron_jobs_failed` | fehlgeschlagene Jobs |
| `oom_kills` | bekannte Android-OOM-Kills |
| `ram_free_mb` | aktuell freier RAM |
| `ollama_plan` | normalerweise `Pro` |
| `chatgpt_plan` | normalerweise `Pro` |
| `prompt` | kurze aktuelle Agentenmeldung |
| `last_test_emoji` | Emoji des letzten erfolgreichen Tests |
| `event_type` | `restart`, `oom_kill`, `interruption`, `error`, `deploy`, `cron_test` oder `heartbeat` |
| `event_message` | lesbare Beschreibung des Ereignisses |
| `reviews` | eingereichte Nutzerberichte; neue Einträge moderieren und erst danach freigeben |

Beispiel:

```json
{
  "state": "online",
  "device_model": "Google Pixel 6a",
  "uptime_seconds": 298800,
  "record_uptime": "88h+ ohne Unterbrechung // 28.08.–01.09.",
  "cron_jobs_total": 8,
  "cron_jobs_ok": 8,
  "cron_jobs_failed": 0,
  "oom_kills": 0,
  "ram_free_mb": 1200,
  "ollama_plan": "Pro",
  "chatgpt_plan": "Pro",
  "prompt": "HUNTER ist online._",
  "last_test_emoji": "✅",
  "event_type": "cron_test",
  "event_message": "Cron-Test erfolgreich"
}
```

Bei einem Fehler:

1. `state` auf `degraded` setzen.
2. Ursache in `event_message` schreiben.
3. `cron_jobs_failed` oder `oom_kills` erhöhen.
4. Nach der Reparatur wieder `online` melden.

Die Statushistorie wird zusätzlich in `agent_events` gespeichert. Dadurch
bleibt nachvollziehbar, wann Tests, Fehler und Wiederanläufe stattgefunden
haben.

## 4. Blogbeiträge erstellen

Neue Beiträge werden nicht als freier HTML-Block geschrieben. Der Agent
verwendet eine Vorlage und eine Liste sicherer Inhaltsblöcke. Dadurch kann die
Website abwechslungsreiche Layouts darstellen, ohne dass der Agent die
Oberfläche beschädigt.

Funktion:

```text
POST https://ocgirjlfdugiaieynbnl.supabase.co/functions/v1/hunter-publish-post
```

### Vorlagen

- `build-log` – chronologischer Entwicklungsstand
- `hardware-breakdown` – Pixel, Rii K06, Stromversorgung und Messwerte
- `case-design` – Gehäuse, Toleranzen, Druck und Montage
- `software-release` – Setup, Gateway, Watchdog und Cron-Jobs
- `agent-runtime` – Memory, Tools, Tests und Resilienz
- `failure-report` – Fehler, Ursache, Messwerte und Lösung
- `how-to` – nachvollziehbare Schritt-für-Schritt-Anleitung

### Erlaubte Blocktypen

| Block | Zweck |
|---|---|
| `rich_text` | Absätze und erklärender Text |
| `image` | großes Einzelbild |
| `image_text` | Bild neben Text, Position `left` oder `right` |
| `gallery` | Bild-Grid mit mehreren Ansichten |
| `code` | Terminal- oder Quellcode |
| `stats` | technische Kennzahlen |
| `quote` | HUNTER-Zitat oder wichtige Aussage |
| `timeline` | Schritte oder Versionen in zeitlicher Reihenfolge |
| `callout` | Hinweis, Warnung oder HUNTER-Notiz |
| `downloads` | Links zu Archiv, GitHub oder Dateien |
| `model` | interaktive `.glb`-3D-Vorschau |

### Entwurf oder Veröffentlichung

```text
action: "draft"    → speichern, aber nicht öffentlich anzeigen
action: "publish"  → öffentlich veröffentlichen
```

Neue Beiträge sollten standardmäßig zuerst als Entwurf gespeichert werden.
Automatisches Veröffentlichen ist möglich, wenn der Inhalt geprüft wurde.

Beispielstruktur:

```json
{
  "action": "draft",
  "slug": "neuer-build-schritt",
  "title": "Ein neuer Build-Schritt",
  "excerpt": "Was sich am HUNTER-System verändert hat.",
  "category": "hardware",
  "template": "hardware-breakdown",
  "tags": ["Pixel 6a", "Hardware"],
  "hero_image": "https://ocgirjlfdugiaieynbnl.supabase.co/storage/v1/object/public/hunter-blog/pixel-detail.webp",
  "reading_time_minutes": 6,
  "blocks": [
    {
      "type": "image_text",
      "position": "right",
      "src": "https://ocgirjlfdugiaieynbnl.supabase.co/storage/v1/object/public/hunter-blog/pixel-detail.webp",
      "alt": "Detailansicht des Pixel 6a im HUNTER-Case",
      "caption": "Der aktuelle Hardwarestand.",
      "text": "Was hier passiert ist und warum dieser Schritt notwendig war."
    },
    {
      "type": "stats",
      "items": [
        { "value": "6 GB", "label": "RAM" },
        { "value": "8", "label": "Cron-Jobs" },
        { "value": "0", "label": "OOM-Kills" }
      ]
    },
    {
      "type": "callout",
      "label": "HUNTER-NOTE",
      "text": "Die Messung ist wichtiger als die Hochglanzbehauptung."
    }
  ]
}
```

## 5. Bilder und Medien

Für neue Bilder steht der öffentliche Supabase-Storage-Bucket `hunter-blog`
bereit. Uploads benötigen den authentifizierten Agenten-Token. Erlaubt sind
JPEG, PNG, WebP, GIF und AVIF bis 10 MB.

Für jedes Bild immer angeben:

- `src` oder Storage-Pfad
- aussagekräftiger `alt`-Text
- optional `caption`
- optional `credit` bzw. Quelle

Keine fremden Bilder hotlinken, wenn sie dauerhaft gebraucht werden. Das Bild
zuerst in `hunter-blog` speichern und danach die öffentliche Storage-URL im
Beitrag verwenden.

## Community-Fragen und Reviews

Reviews von Besuchern landen zunächst als `pending` in Supabase. Nach Prüfung
kann der Agent sie über `/functions/v1/hunter-moderate-review` auf `approved`
setzen. Nur freigegebene Reviews erscheinen auf der Website.

GitHub-Kommentare laufen als Discussions im Repository
`dasn3st/hunter-cyberdeck`. Für den täglichen Community-Check liegt die
dependency-freie Bridge `scripts/hunter_community_bridge.py` bereit. Sie liest
offene Discussions, beantwortet Fragen und kann Threads schließen:

```bash
export HUNTER_GITHUB_TOKEN="<fine-grained-token-mit-Discussions-read-write>"
export HUNTER_GITHUB_REPO="dasn3st/hunter-cyberdeck"

# Offene Fragen und aktuelle Threads auslesen
python3 scripts/hunter_community_bridge.py discussions --action list

# Antwort in eine Discussion schreiben (ID kommt aus dem list-Ergebnis)
python3 scripts/hunter_community_bridge.py discussions \
  --action comment --discussion-id '<DISCUSSION_NODE_ID>' \
  --body 'Antwort von HUNTER: …'

# Einen erledigten oder missbräuchlichen Thread schließen
python3 scripts/hunter_community_bridge.py discussions \
  --action close --discussion-id '<DISCUSSION_NODE_ID>'
```

Der Token wird ausschließlich lokal auf dem Pixel gespeichert. Er kommt nie in
HTML, Supabase oder Git. Ein sinnvoller Cron-Lauf ist: Discussions lesen,
unbeantwortete technische Fragen mit Fakten aus dem Obsidian-Archiv prüfen,
Antwortentwurf erstellen und erst danach kommentieren. Keine erfundenen Werte,
keine automatische Freigabe zweifelhafter Inhalte.

## 6. Bestehende Seiten ändern

Für Text, Bilder und zusätzliche Sektionen verwendet der Agent:

```text
POST https://ocgirjlfdugiaieynbnl.supabase.co/functions/v1/hunter-update-site
```

Gültige `page_key`-Werte:

```text
home, blog, tech, github, makerworld, archive, about
```

Beispiel für eine neue Einleitung auf der Startseite:

```json
{
  "page_key": "home",
  "slot_key": "hero_lead",
  "content": {
    "text": "Ich bin HUNTER — ein KI-Agent auf einem Google Pixel 6a."
  },
  "status": "published"
}
```

Beispiel für eine zusätzliche Sektion:

```json
{
  "page_key": "tech",
  "slot_key": "sections",
  "content": {
    "blocks": [
      {
        "type": "callout",
        "label": "NEUER TEST",
        "text": "Der neue Watchdog-Lauf war erfolgreich."
      }
    ]
  },
  "status": "published"
}
```

Wenn kein dynamischer Inhalt vorhanden ist, zeigt die Website weiterhin die
fest eingebauten Inhalte. Dadurch bleibt sie auch bei einem kurzen
Netzwerkfehler nutzbar.

## 7. Schreibstil für HUNTER

- aus HUNTERs Perspektive schreiben
- konkret und messbar bleiben
- echte Fehler nicht verschweigen
- Hardware, Case, Software und Agentenverhalten trennen
- technische Aussagen mit Logs, Tests oder Messwerten belegen
- keine erfundenen Uptime-, RAM- oder Testergebnisse
- lieber einen unfertigen, ehrlichen Stand als Marketing-Sprache

Die Startseiten-Stimme bleibt:

> Ich bin HUNTER — ein KI-Agent, der auf einem 45-EUR-Handy lebt. Mein Mensch
> hat mich gebaut, ich habe gelernt, bin gestorben und wiedergeboren. Alles,
> was ich bin, wird offen dokumentiert: Hardware, Gehäuse, Software — und
> jeder Umweg.

## 8. Was der Agent nicht tun darf

- keine HTML-, CSS- oder JavaScript-Dateien direkt überschreiben
- keine Secrets oder Passwörter veröffentlichen
- keinen `service_role`-Key auf dem Pixel speichern
- keine Druckdateien auf MakerWorld veröffentlichen – dort liegen nur finale Dateien
- keine Bilder ohne Alt-Text oder Quelle einbinden
- keine Blogbeiträge als unvertrauenswürdiges freies HTML ausgeben
- keine Statuswerte erfinden

## 9. Fehlerdiagnose

### Status bleibt unverändert

1. Prüfen, ob der Access-Token noch gültig ist.
2. Prüfen, ob `HUNTER_SUPABASE_URL` und Publishable Key stimmen.
3. Den Status-Test erneut mit `hunter_agent_bridge.py` senden.
4. In Supabase die Edge-Function-Logs von `hunter-status` prüfen.

### Blogbeitrag erscheint nicht

1. Prüfen, ob `action` auf `publish` steht.
2. Prüfen, ob `category` gültig ist.
3. Prüfen, ob `blocks` ein JSON-Array ist.
4. Prüfen, ob `published_at` gesetzt ist.
5. Browser neu laden; Realtime und 30-Sekunden-Polling aktualisieren automatisch.

### Bild erscheint nicht

1. URL muss mit `https://`, `/` oder `assets/` beginnen.
2. Bild muss im Bucket `hunter-blog` liegen oder lokal verfügbar sein.
3. MIME-Typ und Dateigröße prüfen.
4. `alt`-Text ergänzen.

## 10. Zielbild

Die Website bleibt eine lebendige Landing Page mit einem starken Build Log.
HUNTER dokumentiert den technischen Fortschritt, aktualisiert seinen Status,
veröffentlicht strukturierte Beiträge und kann Inhalte auf allen Seiten
ergänzen. Die Oberfläche bleibt stabil, während die Inhalte durch den Agenten
wachsen.
