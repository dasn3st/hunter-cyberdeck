# Die komplette Befehls-Kette: Termux bis Hunter — Stück für Stück

> **Copy-Paste-Anleitung:** Jeder Befehl ist der echte Befehl von der laufenden Maschine, in der Reihenfolge, in der er ausgeführt gehört. Kopiere Block für Block, prüfe nach jedem Block die erwartete Ausgabe, dann weiter.
> Alle Platzhalter in `<WINKELKLAMMERN>` ersetzen. **Kein Key, kein Passwort in irgendeinem Befehl** — wo ein Secret hingehört, steht der Datei-Weg.
> Geprüft: 05.09.2026 auf Pixel 6a (6 GB), Android, kein Root.

---

## STUFE 0 — Android-Apps (App-Store-Arbeit, kein Terminal)

**Installieren (aus F-Droid, nicht Play Store):**

| App | Zweck |
|---|---|
| **Termux** | das Terminal selbst |
| **Termux:Boot** | Boot-Scripts (für Schrittmacher in Schritt 9) |
| **Obsidian** | das Gehirn/Vault-Sync (optional, empfohlen) |

**Android-Einstellungen (Settings-App):**

```
Einstellungen → Apps → Termux → Akku → "Nicht optimiert"  ← PFLICHT
```

Danach **Termux:Boot einmal manuell öffnen** (einmal reicht, danach lauscht es).

---

## STUFE 1 — Termux-Grundlagen

Termux öffnen, dann Block für Block:

```bash
pkg update -y && pkg upgrade -y
```
```bash
pkg install -y proot-distro git curl nodejs-lts
```
```bash
termux-setup-storage
```

> `termux-setup-storage` fragt nach Android-Berechtigung für den Speicher — JA tippen. Danach liegt das Handy-Dateisystem unter `~/storage/shared/`.

**Erwartung:** keine Fehler. Wenn `pkg install` meckert: `pkg update` erneut und wiederholen.

---

## STUFE 2 — Ubuntu-Container

```bash
proot-distro install ubuntu
```
```bash
proot-distro login ubuntu
```

> Ab jetzt bist du IM CONTAINER (Prompt ändert sich zu `root@localhost`). Alles aus Stufe 3–5 passiert hier drin.

Container-Grundausstattung:

```bash
apt update && apt install -y tmux curl
```
```bash
tmux -V
```

**Erwartung:** `tmux 3.x`. tmux ist Pflicht — das Gateway läuft als tmux-Session, sonst überleben die Cron-Jobs keine Trennung der Verbindung.

---

## STUFE 3 — Hermes Agent installieren (im Container)

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

> Das installiert Python + venv + den Launcher nach `/usr/local/bin/hermes`.

Danach:

```bash
hermes setup
```

> Interaktiver Wizard: Modell/Provider wählen (bei uns: **Ollama Cloud**), API-Key interaktiv einfügen (siehe Sicherheit am Ende), Einstellungen bestätigen.

```bash
hermes doctor
```

**Erwartung:** Statuszeilen grün/ok. Was rot ist, sagt dir genau, was fehlt.

---

## STUFE 4 — Gateway als Dauerbetrieb (im Container)

Gateway in einer tmux-Session starten (überlebt geschlossene Termux-Sessions):

```bash
tmux new-session -d -s hermes-gw -x 200 -y 40 'hermes gateway run'
```
```bash
tmux ls
```

**Erwartung:** `hermes-gw:` läuft. Das Gateway fährt jetzt Crons + Telegram-Ausgang.

Gateway jederzeit ansehen/beenden:

```bash
tmux attach -t hermes-gw     # reinschauen (Exit: Ctrl+B, dann D)
tmux kill-session -t hermes-gw
```

---

## STUFE 5 — Secrets (nur in Dateien, nie in Befehle)

Die Keys gehören in die Datei `/root/.hermes/.env` — mit dem Editor, nicht per Befehl im Klartext (Shell-History!):

```bash
nano /root/.hermes/.env
```

In die Datei eintragen (Werte aus deinen Konten holen — nicht hier dokumentiert):

```
TELEGRAM_BOT_TOKEN=<dein-bot-token-von-@BotFather>
TELEGRAM_ALLOWED_USERS=<deine-chat-id>
OLLAMA_API_KEY=<dein-ollama-cloud-key>
```

Speichern: `Ctrl+O`, `Enter`, `Ctrl+X`. Danach Rechte hart setzen:

```bash
chmod 600 /root/.hermes/.env
```

> **Regel:** Keys erscheinen NIE in einem Befehl, Skript, Chat oder Repo. Nur in dieser Datei. Wenn ein Key kompromittiert ist: im Konto rotieren, Datei aktualisieren, fertig.

---

## STUFE 6 — Heartbeat + erste Crons (im Container, in der Hermes-Session)

```bash
hermes
```

In der Agenten-Session die Crons anlegen (Heartbeat zuerst — er ist der Lebens-Beweis):

```text
/cron  Heartbeat-Emoji  0 * * * *   stündliches Emoji an Telegram
```

> Genauer: im Chat dem Agenten einfach sagen "richte einen stündlichen Heartbeat-Cron ein, der ein Emoji an Telegram schickt". Hermes legt den Job selbst an. Die Script-Variante (`~/.hermes/scripts/heartbeat-emoji.sh`) ist reines Bash und kostet 0 LLM-Requests.

**Telegram-Test:** Der Bot muss dir jetzt schreiben können. Wenn nicht: Chat-ID in `.env` prüfen (die ID deines eigenen Chats mit dem Bot).

---

## STUFE 7 — Obsidian-Gehirn (im Handy-Speicher)

Im Container liegt der Handy-Speicher unter `/storage/emulated/0`:

```bash
mkdir -p /storage/emulated/0/Documents/cyberdeck-log
```

Darin die Ordnerstruktur anlegen:

```bash
cd /storage/emulated/0/Documents/cyberdeck-log
mkdir -p "00 Inbox" "02 Wissen" "04 Tagesnotizen"
```

Obsidian-App auf Android: Vault an dieser Stelle öffnen (Ordner auswählen). Damit ist das Gehirn vom Terminal UND von der Obsidian-App lesbar — dieselbe Quelle, zwei Ansichten.

---

## STUFE 8 — pi installieren (zurück in Termux, NICHT im Container)

Container verlassen (`exit` oder zweites Termux-Socket). Dann:

```bash
npm install -g @earendil-works/pi-coding-agent
```
```bash
pi --version
```

**Erwartung:** Versionsnummer. pi läuft nativ in Termux (kein Container nötig) — das war bei uns der erste Agent, der danach Hermes installiert hat. Wenn du das original nachbauen willst: **pi sagen, es soll Hermes installieren** — der Compounding-Moment des ganzen Projekts.

pi-Config liegt danach unter `~/.pi/agent/`.

---

## STUFE 9 — Termux:Boot-Script (der Immortalitätsschritt)

Zwei Dateien in `~/.termux/boot/` anlegen (Termux-Ebene). Original-Inhalte liegen auf der laufenden Maschine und sind im Vault dokumentiert; hier die Kurzfassung der Befehle:

**Datei 1: `~/.termux/boot/hermes-gateway.sh`** — zündet nach jedem Handy-Neustart Gateway + Watchdog im Container (tmux-Session `hermes-gw` + `hermes-wd`), schreibt ein Boot-Log.

**Datei 2: `~/.termux/boot/hermes-watchdog-termux.sh`** — der Termux-Level-Wächter AUSSERHALB des Containers (überlebt Container-Restarts): Aktiviert `termux-wake-lock`, prüft alle 2 Minuten den Gateway-Heartbeat, führt alle 60 Sekunden `hermes cron tick` aus (externer Tick — Jobs feuern auch, wenn der interne Ticker tot ist), und startet das Gateway neu, wenn der Heartbeat älter als 5 Minuten ist. Alarmiert per Telegram (liest die Werte selbst aus der `.env` — kein Key im Script).

Beide nach dem Anlegen ausführbar machen:

```bash
chmod +x ~/.termux/boot/hermes-gateway.sh ~/.termux/boot/hermes-watchdog-termux.sh
```

Danach einmal testweise: Handy neu starten, 1 Minute warten, Termux öffnen:

```bash
cat ~/.termux/boot/boot-log.txt
```

**Erwartung:** `[hermes-boot] ... Boot hook fired.` — das System ist alleine hochgekommen. Ab diesem Punkt überlebt das Deck Android-Neustarts, Doze-Schlaf und Prozess-Kills allein.

---

## STUFE 10 — herdr installieren (Termux-Ebene)

herdr ist ein statisches ARM64-Binary (kein npm-Paket, kein Container):

```bash
mkdir -p ~/.local/bin
```
```bash
curl -fsSL <herdr-install-url> -o ~/.local/bin/herdr && chmod +x ~/.local/bin/herdr
```

> Die Install-URL ist versionsspezifisch (Release-Seite des herdr-Projekts); auf der laufenden Maschine liegt herdr v0.8.2 an `~/.local/bin/herdr`. Wer den Pfad dauerhaft braucht: `echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc && source ~/.bashrc`

```bash
herdr status
```

**Erwartung:** `server: running` + Version. Falls "server_not_running": einmal `herdr` ohne Argument starten (TUI), oder im Skript-Kontext prüfen, ob der Socket unter `~/.config/herdr/herdr.sock` liegt.

Agenten in Panes starten (Beispiele, IDs aus `herdr pane list --workspace <id>` holen):

```bash
herdr agent start pi --kind pi --pane <pane-id>
```
```bash
herdr pane run <pane-id> "proot-distro login ubuntu -- bash -lc 'hermes'"
```

---

## STUFE 11 (optional) — opencode im Container

Nur wenn Coding-Abo-Client gewünscht (braucht ~658 MB RAM!). Die ausführliche Anleitung mit den zwei Fallen steht separat:

**Siehe `00 Inbox/HowTo-opencode-auf-Android-installieren.md`** — Kurzform:

```bash
# im Container:
apt install -y nodejs npm   # Node 22 via NodeSource (siehe HowTo)
npm install -g opencode-ai@latest
opencode auth login          # Key interaktiv!
opencode
```

---

## Nach dem Install: der Gesundheitscheck

```bash
# im Container:
hermes doctor          # System-Check
tmux ls                # hermes-gw läuft?
cat /root/.hermes/cron/ticker_heartbeat   # frischer Timestamp = Scheduler lebt

# in Termux:
herdr status           # server: running
pi --version           # erste Agentin antwortet
```

Und der ultimative Test: Handy neu starten, Kaffee holen, zurückkommen — das Deck ist von allein wieder oben, Heartbeat-Emojis trudeln in Telegram. Genau so war es am 28.08.2026, und es läuft seitdem.

---

*Alle Befehle geprüft gegen die laufende Maschine am 05.09.2026 (Pixel 6a, 6 GB, kein Root). Die Boot- und Watchdog-Scripts sind Original-Dateien der Maschine (Volltext im Vault: Installationsverlauf). Kein Key dieses Dokuments — nur Platzhalter.*