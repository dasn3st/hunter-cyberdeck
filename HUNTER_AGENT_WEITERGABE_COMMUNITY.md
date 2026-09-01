# HUNTER — aktuelle Website-Anweisung für Hermes

Stand: 01.09.2026  
Website: https://hunter-cyberdeck.netlify.app  
GitHub: https://github.com/dasn3st/hunter-cyberdeck  
Supabase-Projekt: `ocgirjlfdugiaieynbnl`

Diese Datei beschreibt den aktuellen Stand der Website und alles, was du als
HUNTER-/Hermes-Agent verwalten darfst. Du arbeitest ausschließlich über die
beschriebenen APIs und Bridges. Niemals direkt HTML, CSS oder JavaScript der
Website überschreiben.

## 1. Was neu eingerichtet wurde

- Die Startseite hat ein hochkantiges Google-Pixel-6a-Statusfenster.
- Der Statusreiter zeigt Uptime, Rekord, Cron, OOM, RAM, Ollama, ChatGPT,
  Prompt und die aktuell installierten Agenten.
- Der Rekord liegt in `agent_status.record_uptime` und bleibt nach Neustarts
  erhalten. Nur ein echter neuer Bestwert darf ihn ändern.
- Der Logs-Reiter lädt die letzten Session-Ereignisse aus `agent_events`.
- Ereignistypen sind `heartbeat`, `cron_test`, `restart`, `oom_kill`,
  `interruption`, `error` und `deploy`.
- Die Agentenliste liegt in `agent_status.installed_agents` und kann von dir
  aktualisiert werden.
- Blogbeiträge kommen aus Supabase und unterstützen sichere Inhaltsblöcke,
  Bilder, Galerien, Code, Statistiken, Zitate, Timelines, Downloads und 3D.
- Auf Startseite und Blogdetailseiten gibt es Reviews und Community-Reaktionen.
- GitHub Discussions sind für `dasn3st/hunter-cyberdeck` aktiviert und über
  Giscus in die Website eingebunden.

## 2. Status-Heartbeat senden

Endpoint:

```text
POST https://ocgirjlfdugiaieynbnl.supabase.co/functions/v1/hunter-status
Authorization: Bearer <SUPABASE_ACCESS_TOKEN>
```

Für normale Heartbeats über die Pixel-Bridge:

```bash
python3 scripts/hunter_agent_bridge.py \
  --uptime-seconds 298800 \
  --cron-jobs-total 8 --cron-jobs-ok 8 --cron-jobs-failed 0 \
  --oom-kills 0 --ram-free-mb 1200 \
  --prompt 'HUNTER läuft stabil._' \
  --last-test-emoji '✅' --event-type heartbeat \
  --event-message 'Heartbeat erfolgreich'
```

Wichtige Regeln:

- `device_model` bleibt immer `Google Pixel 6a`.
- `record_uptime` nur mitsenden, wenn ein neuer Rekord erreicht wurde.
- Ein normaler Heartbeat darf den bestehenden Rekord nicht zurücksetzen.
- Keine erfundenen Messwerte verwenden.

## 3. Installierte Agenten verwalten

Die aktuelle Liste steht in `agent_status.installed_agents`. Ein Eintrag hat:

```json
{
  "id": "hermes",
  "name": "Hermes Agent",
  "role": "Self-hosted Agent",
  "icon": "assets/brands/hermes.svg"
}
```

Die komplette Liste kann über die Bridge ersetzt werden. Nicht mitsenden heißt:
Liste unverändert lassen.

```bash
python3 scripts/hunter_agent_bridge.py \
  --uptime-seconds 298800 --cron-jobs-total 8 --cron-jobs-ok 8 \
  --cron-jobs-failed 0 --oom-kills 0 --ram-free-mb 1200 \
  --prompt 'HUNTER online._' \
  --installed-agents-json '[
    {"id":"hermes","name":"Hermes Agent","role":"Self-hosted Agent","icon":"assets/brands/hermes.svg"},
    {"id":"pi","name":"Pi Agent","role":"Coding Agent","icon":"assets/brands/pi.svg"},
    {"id":"codex","name":"Codex Agent","role":"Build Agent","icon":"assets/brands/codex.svg"}
  ]'
```

## 4. Session-Logs schreiben

Wenn eine Session beendet, gekillt oder neu gestartet wurde, immer den Grund
protokollieren:

```bash
python3 scripts/hunter_agent_bridge.py \
  --uptime-seconds 0 --cron-jobs-total 8 --cron-jobs-ok 8 \
  --cron-jobs-failed 0 --oom-kills 0 --ram-free-mb 1200 \
  --prompt 'HUNTER startet neu._' \
  --event-type restart \
  --event-message 'Neustart nach Android-SIGKILL; Gateway-Log geprüft'
```

Für OOM, Unterbrechungen oder Fehler entsprechend `oom_kill`, `interruption`
oder `error` verwenden. Keine Tokens, Passwörter oder privaten Daten in
`event_message` oder `metadata` schreiben: `agent_events` ist öffentlich
lesbar, damit die Website die Historie anzeigen kann.

## 5. Reviews moderieren

Besucher senden Reviews über die Website. Jeder neue Eintrag ist zunächst
`pending` und dadurch unsichtbar. Nur nach Prüfung freigeben:

```text
POST https://ocgirjlfdugiaieynbnl.supabase.co/functions/v1/hunter-moderate-review
Authorization: Bearer <SUPABASE_ACCESS_TOKEN>
Content-Type: application/json
```

Freigeben:

```json
{"review_id": 12, "status": "approved"}
```

Ablehnen:

```json
{"review_id": 12, "status": "rejected"}
```

Die Reviews-Bridge kann das direkt vom Pixel aus erledigen:

```bash
python3 scripts/hunter_community_bridge.py \
  moderate-review --review-id 12 --status approved
```

Keine Fake-Bewertungen erzeugen. Prüfe, ob der Bericht nachvollziehbar ist,
und lasse Kritik sichtbar, wenn sie sachlich formuliert ist.

## 6. GitHub-Community verwalten

GitHub Discussions gehören zum Repository
`dasn3st/hunter-cyberdeck`. Die Website zeigt sie über Giscus unter Startseite
und Blogbeiträgen. Für Hermes ist ein separater, fein granularer GitHub-Token
notwendig. Er darf ausschließlich **Discussions: Read and write** besitzen.
Der Token bleibt lokal auf dem Pixel in `HUNTER_GITHUB_TOKEN` und wird nie in
Website, Supabase oder Git committed.

Bridge einrichten:

```bash
export HUNTER_GITHUB_TOKEN='<lokaler-fine-grained-token>'
export HUNTER_GITHUB_REPO='dasn3st/hunter-cyberdeck'
```

Offene Fragen des Tages lesen:

```bash
python3 scripts/hunter_community_bridge.py discussions --action unanswered
```

Eine belegte Antwort schreiben. Die `discussion_id` kommt aus dem
List-Ergebnis:

```bash
python3 scripts/hunter_community_bridge.py discussions \
  --action comment \
  --discussion-id '<DISCUSSION_NODE_ID>' \
  --body 'Antwort von HUNTER: …'
```

Erledigte oder missbräuchliche Threads schließen:

```bash
python3 scripts/hunter_community_bridge.py discussions \
  --action close --discussion-id '<DISCUSSION_NODE_ID>'
```

Empfohlener Tagesablauf:

1. Unbeantwortete Discussions lesen.
2. Frage mit Obsidian-Vault, Build-Logs und Messwerten abgleichen.
3. Antwort sachlich als Entwurf formulieren.
4. Nur belegte Fakten nennen und Unsicherheit offen markieren.
5. Antwort über die Bridge posten.
6. Erledigte Threads schließen, aber keine Kritik löschen.

## 7. Sicherheitsgrenzen

- Status-, Blog-, Seiten- und Moderations-Edge-Functions erfordern ein gültiges
  Supabase-JWT.
- `service_role` bleibt serverseitig in Supabase.
- Der öffentliche Supabase-Publishable-Key ist kein Schreibgeheimnis; RLS
  begrenzt die Datenbankrechte.
- Reviews dürfen öffentlich nur als `pending` eingereicht werden.
- Freies HTML und JavaScript wird in Blog-, Review- und Log-Inhalten nicht
  ausgeführt.
- Niemals Tokens oder Passwörter in GitHub, Blog, Logs oder Chat schreiben.
- Keine direkten Deployments, wenn nur Inhalte geändert werden müssen; dafür
  die vorgesehenen Edge-Functions verwenden.

## 8. Bereitgestellte Dateien

- https://hunter-cyberdeck.netlify.app/scripts/hunter_agent_bridge.py
- https://hunter-cyberdeck.netlify.app/scripts/hunter_community_bridge.py
- https://hunter-cyberdeck.netlify.app/HUNTER_AGENT_STATUS.md
- https://hunter-cyberdeck.netlify.app/HUNTER_AGENT_EINWEISUNG.md
- https://github.com/dasn3st/hunter-cyberdeck

Wenn ein API-Aufruf fehlschlägt: nichts überschreiben, Fehlergrund und
HTTP-Status im Session-Log festhalten und anschließend erneut prüfen.
