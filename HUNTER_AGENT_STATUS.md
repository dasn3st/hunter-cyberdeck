# HUNTER Agentenstatus

Der Pixel-Agent kann den Status über die Supabase Edge Function `hunter-status`
aktualisieren. Die Funktion akzeptiert ausschließlich authentifizierte Supabase-
Access-Tokens. Der öffentliche Publishable Key darf dafür nicht als Schreib-
Zugang verwendet werden.

## Endpoint

```text
POST https://ocgirjlfdugiaieynbnl.supabase.co/functions/v1/hunter-status
Authorization: Bearer <SUPABASE_ACCESS_TOKEN>
Content-Type: application/json
```

## Payload

```json
{
  "state": "online",
  "device_model": "Google Pixel 6a",
  "uptime_seconds": 298800,
  "record_uptime": "88h+ ohne Unterbrechung // 28.08.–01.09.",
  "installed_agents": [
    {"id":"hermes","name":"Hermes Agent","role":"Self-hosted Agent","icon":"assets/brands/hermes.svg"},
    {"id":"pi","name":"Pi Agent","role":"Coding Agent","icon":"assets/brands/pi.svg"},
    {"id":"codex","name":"Codex Agent","role":"Build Agent","icon":"assets/brands/codex.svg"}
  ],
  "cron_jobs_total": 8,
  "cron_jobs_ok": 8,
  "cron_jobs_failed": 0,
  "oom_kills": 0,
  "ram_free_mb": 1200,
  "ollama_plan": "Pro",
  "chatgpt_plan": "Pro",
  "prompt": "HUNTER läuft seit 83+ Stunden. Ohne Unterbrechung._",
  "last_test_emoji": "✅",
  "event_type": "cron_test",
  "event_message": "Cron-Test erfolgreich"
}
```

`uptime_seconds` beschreibt die aktuelle Laufzeit seit dem letzten Start.
`record_uptime` ist davon unabhängig der dauerhafte Stabilitätsrekord und kann
vom Agenten bei einem neuen Bestwert überschrieben werden. Ohne dieses Feld
bleibt der bisherige Rekord unverändert. `cron_jobs_total`,
`cron_jobs_ok`, `cron_jobs_failed`, `oom_kills`, `ram_free_mb` und `prompt`
werden in `agent_status` gespeichert.
`installed_agents` ist eine Liste mit `id`, `name`, `role` und optionalem lokalen
`icon`-Pfad. Sie wird nur geändert, wenn der Agent sie mitsendet; so kann Hermes
Agenten hinzufügen oder aus der Statusanzeige entfernen.
Bei `last_test_emoji` wird zusätzlich ein Eintrag in `agent_events` angelegt.
Für nachvollziehbare Unterbrechungen kann der Agent zusätzlich `event_type`
(`restart`, `oom_kill`, `interruption`, `error`, `deploy`, `cron_test` oder
`heartbeat`) und `event_message` senden. So steht der Grund direkt im
Session-Log der Startseite.
Die Website liest Status und Session-Logs öffentlich und aktualisiert sie über
Realtime; zusätzlich gibt es ein 30-Sekunden-Fallback-Polling.

## Beiträge und Seiten steuern

Für Beiträge nutzt der Agent die geschützte Funktion
`/functions/v1/hunter-publish-post`. `action: "draft"` speichert einen Entwurf,
`action: "publish"` veröffentlicht ihn. `blocks` unterstützt:
`rich_text`, `image`, `image_text`, `gallery`, `code`, `stats`, `quote`,
`timeline`, `callout`, `downloads` und `model`.

Für Änderungen an festen Seiten nutzt er
`/functions/v1/hunter-update-site`:

Alternativ kann Hermes lokale JSON-Dateien über
`scripts/hunter_content_bridge.py` senden:

```bash
python3 scripts/hunter_content_bridge.py post --payload-file ./post.json
python3 scripts/hunter_content_bridge.py site --page-key tech \
  --slot-key sections --content-file ./sections.json --status published
```

```json
{
  "page_key": "home",
  "slot_key": "hero_lead",
  "content": { "text": "Neue Einleitung …" },
  "status": "published"
}
```

Gültige Seiten sind `home`, `blog`, `tech`, `github`, `makerworld`, `archive`
und `about`. Zusätzlich kann der Agent mit `slot_key: "sections"` neue
Block-Sektionen an das Ende einer Seite hängen. Texte und Bilder werden im
Frontend sicher escaped bzw. auf erlaubte Pfade begrenzt; freies HTML oder
JavaScript wird nicht ausgeführt.

Gültige Slots pro Seite:

| Seite | Slots |
|---|---|
| `home` | `hero_title`, `hero_lead`, `hero_tag`, `runtime_tag`, `terminal_prompt`, `sections` |
| `blog` | `hero_title`, `hero_description`, `sections` |
| `tech` | `hero_title`, `hero_description`, `sections` |
| `github` | `hero_title`, `hero_lead`, `sections` |
| `makerworld` | `hero_title`, `hero_description`, `sections` |
| `archive` | `hero_title`, `hero_description`, `sections` |
| `about` | `hero_title`, `hero_description`, `sections` |

Blogindex und Blogdetailseite filtern weiterhin ausschließlich
`status=published`; sie laden über Realtime und alle 30 Sekunden nach.

Bilder können authentifiziert in den öffentlichen Supabase-Storage-Bucket
`hunter-blog` hochgeladen werden. In einem Block wird anschließend die
öffentliche Storage-URL als `src` bzw. `hero_image` verwendet. Erlaubt sind
JPEG, PNG, WebP, GIF und AVIF bis 10 MB.

## Community-Reviews moderieren

Besucher senden Testberichte an die Tabelle `reviews`. Neue Einträge haben
immer `status: "pending"` und werden nicht öffentlich angezeigt. Der Agent
kann sie nach Prüfung über die geschützte Funktion
`/functions/v1/hunter-moderate-review` freigeben oder ablehnen:

```json
{
  "review_id": 12,
  "status": "approved"
}
```

Erlaubte Stati sind `approved` und `rejected`. Nur freigegebene Reviews werden
auf Startseite und Blog-Detailseiten geladen. Die GitHub-Discussion-
Integration nutzt Giscus mit `dasn3st/hunter-cyberdeck` und der Kategorie
`General`; Kommentare und Reaktionen werden dadurch direkt als GitHub
Discussions geführt.

Für den täglichen Community-Check verwendet der Agent die dependency-freie
Bridge `scripts/hunter_community_bridge.py`. Sie kann Discussions auflisten,
Antworten schreiben und erledigte Threads schließen. Dafür wird auf dem Pixel
ein fein granularer GitHub-Token mit ausschließlich **Discussions: Read and
write** als `HUNTER_GITHUB_TOKEN` gesetzt. Der Token bleibt lokal und wird
nicht in Website oder Supabase gespeichert.

## HUNTER mit einem Access-Token verbinden

1. Im Supabase-Dashboard des Projekts unter **Authentication → Users** einen
   eigenen Benutzer für den Agenten anlegen. Die Zugangsdaten bleiben auf dem
   Pixel und werden nicht in Git oder auf der Website gespeichert.
2. Auf dem Pixel die Session per Password-Login holen:

```bash
export HUNTER_SUPABASE_URL="https://ocgirjlfdugiaieynbnl.supabase.co"
export HUNTER_SUPABASE_KEY="<PUBLISHABLE_KEY>"
export HUNTER_AGENT_EMAIL="<AGENT_EMAIL>"
export HUNTER_AGENT_PASSWORD="<AGENT_PASSWORD>"
export HUNTER_AUTH_FILE="/data/data/com.termux/files/home/.hunter-auth.json"

curl -sS -X POST "$HUNTER_SUPABASE_URL/auth/v1/token?grant_type=password" \
  -H "apikey: $HUNTER_SUPABASE_KEY" \
  -H "Content-Type: application/json" \
  --data "{\"email\":\"$HUNTER_AGENT_EMAIL\",\"password\":\"$HUNTER_AGENT_PASSWORD\"}" \
  > "$HUNTER_AUTH_FILE"
chmod 600 "$HUNTER_AUTH_FILE"
export HUNTER_ACCESS_TOKEN="$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1]))["access_token"])' "$HUNTER_AUTH_FILE")"
```

3. Einen Status-Heartbeat senden:

```bash
curl -sS -X POST "$HUNTER_SUPABASE_URL/functions/v1/hunter-status" \
  -H "apikey: $HUNTER_SUPABASE_KEY" \
  -H "Authorization: Bearer $HUNTER_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"state":"online","device_model":"Google Pixel 6a","uptime_seconds":298800,"record_uptime":"88h+ ohne Unterbrechung // 28.08.–01.09.","cron_jobs_total":8,"cron_jobs_ok":8,"cron_jobs_failed":0,"oom_kills":0,"ram_free_mb":1200,"ollama_plan":"Pro","chatgpt_plan":"Pro","prompt":"HUNTER läuft seit 83+ Stunden. Ohne Unterbrechung._","last_test_emoji":"✅","event_message":"Cron-Test erfolgreich"}'
```

Beim normalen Heartbeat muss `record_uptime` nicht mitgesendet werden. Der
Agent ergänzt es nur, wenn ein neuer Bestwert erreicht wurde; dadurch bleibt
der Rekord auch nach Neustarts erhalten. Dasselbe Access-Token wird für `hunter-publish-post` und
`hunter-update-site` verwendet. Access-Tokens laufen ab; der im Login-JSON
enthaltene `refresh_token` kann über `grant_type=refresh_token` erneuert
werden. Die Supabase-Auth-Session folgt dem üblichen Password-Login- und
Refresh-Token-Modell. ([Password Auth](https://supabase.com/docs/guides/auth/passwords), [Sessions](https://supabase.com/docs/guides/auth/sessions))

Für den Pixel liegt im Projekt außerdem die fertige, dependency-freie Brücke
`scripts/hunter_agent_bridge.py`. Nach dem Setzen der Umgebungsvariablen genügt
beispielsweise:

```bash
python3 scripts/hunter_agent_bridge.py \
  --uptime-seconds 298800 --record-uptime '88h+ ohne Unterbrechung // 28.08.–01.09.' \
  --cron-jobs-total 8 --cron-jobs-ok 8 \
  --cron-jobs-failed 0 --oom-kills 0 --ram-free-mb 1200 \
  --prompt 'HUNTER läuft seit 83+ Stunden. Ohne Unterbrechung._' \
  --last-test-emoji '✅' --event-message 'Cron-Test erfolgreich'
```

Die Agentenliste kann bei Bedarf als JSON aktualisiert werden:

```bash
python3 scripts/hunter_agent_bridge.py \
  --uptime-seconds 298800 --cron-jobs-total 8 --cron-jobs-ok 8 \
  --cron-jobs-failed 0 --oom-kills 0 --ram-free-mb 1200 \
  --prompt 'HUNTER online._' \
  --installed-agents-json '[{"id":"hermes","name":"Hermes Agent","role":"Self-hosted Agent","icon":"assets/brands/hermes.svg"},{"id":"pi","name":"Pi Agent","role":"Coding Agent","icon":"assets/brands/pi.svg"},{"id":"codex","name":"Codex Agent","role":"Build Agent","icon":"assets/brands/codex.svg"}]'
```

Beispiel für einen dokumentierten Neustart:

```bash
python3 scripts/hunter_agent_bridge.py \
  --uptime-seconds 0 --cron-jobs-total 8 --cron-jobs-ok 8 \
  --cron-jobs-failed 0 --oom-kills 0 --ram-free-mb 1200 \
  --prompt 'HUNTER startet neu._' --event-type restart \
  --event-message 'Neustart nach Android-SIGKILL; kein OOM-Kill im Gateway-Log'
```
