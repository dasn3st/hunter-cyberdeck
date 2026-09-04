# Cyberdeck-Befehle: Termux vs. Container — sauber getrennt

> **Die zwei Ebenen der Cyberdeck-Installation, ohne Verwirrung:** Welche Befehle gehören in Termux, welche in den Ubuntu-Container? Die häufigste Fehlerquelle beim Nachbauen ist, Dinge am falschen Ort zu installieren. Diese Datei trennt das sauber.
> Kein Key im Dokument — Keys gehören NUR in `/root/.hermes/.env` (im Container, via nano).

---

## Die Merkregel vorab

```
TERMUX (Android nativ)          = pi, herdr, Boot-Scripts, proot-distro selbst
CONTAINER (Ubuntu, via login)   = Hermes, Gateway, opencode, .env mit Keys
```

**Die glibc-Falle:** Linux-Binaries (Hermes-Installer, opencode) laufen NICHT nativ in Termux — Termux ist kein glibc-Linux. Sie gehören in den Container. pi und herdr sind die Ausnahmen (Node/nativ bzw. statisches Binary) und laufen direkt in Termux.

---

## TEIL A — TERMUX: App frisch öffnen

### A1 — Paketbasis

```bash
pkg update -y && pkg upgrade -y
```

### A2 — Grundwerkzeuge

```bash
pkg install -y proot-distro git curl nodejs-lts
```

### A3 — Speicher-Berechtigung (Handy-Storage erreichbar machen)

```bash
termux-setup-storage
```

> Android fragt nach Berechtigung → JA. Danach liegt der Speicher unter `~/storage/shared/`.

### A4 — Android-Setting (kein Befehl, aber Pflicht)

```
Einstellungen → Apps → Termux → Akku → "Nicht optimiert"
```

Ohne das killt Android Termux im Hintergrund — egal wie gut der Rest steht.

---

## TEIL B — CONTAINER: Ubuntu installieren & betreten

### B1 — Container anlegen

```bash
proot-distro install ubuntu
```

### B2 — Container betreten

```bash
proot-distro login ubuntu
```

> Der Prompt wechselt zu `root@localhost`. AB HIER läuft alles im Container (Teil C). Mit `exit` kommst du zurück in Termux.

---

## TEIL C — CONTAINER: Hermes installieren & Gateway starten

### C1 — Grundausstattung im Container

```bash
apt update && apt install -y tmux curl
```

### C2 — Hermes installieren

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

### C3 — Setup-Wizard (Modell/Provider wählen, Key interaktiv!)

```bash
hermes setup
```

### C4 — System-Check

```bash
hermes doctor
```

### C5 — Gateway als Dauerbetrieb (tmux-Session)

```bash
tmux new-session -d -s hermes-gw -x 200 -y 40 'hermes gateway run'
```

```bash
tmux ls
```

> Erwartung: `hermes-gw:` läuft. Reinschauen: `tmux attach -t hermes-gw` (raus: Ctrl+B, dann D). Beenden: `tmux kill-session -t hermes-gw`.

### C6 — KEYS: nur in die Datei (nie in Befehle!)

```bash
nano /root/.hermes/.env
```

In die Datei (Platzhalter ersetzen, Werte aus deinen Konten):

```
TELEGRAM_BOT_TOKEN=<bot-token>
TELEGRAM_ALLOWED_USERS=<deine-chat-id>
OLLAMA_API_KEY=<ollama-cloud-key>
```

Speichern: `Ctrl+O` → `Enter` → `Ctrl+X`. Dann Rechte:

```bash
chmod 600 /root/.hermes/.env
```

### C7 — Obsidian-Gehirn anlegen

```bash
mkdir -p /storage/emulated/0/Documents/cyberdeck-log/"00 Inbox" \
         /storage/emulated/0/Documents/cyberdeck-log/"02 Wissen" \
         /storage/emulated/0/Documents/cyberdeck-log/"04 Tagesnotizen"
```

### C8 — Heartbeat-Cron einrichten

```bash
hermes
```

> In der Agenten-Session: "Richte einen stündlichen Heartbeat-Cron ein, der ein Emoji an Telegram schickt." Danach Telegram-Check: Der Bot muss dir schreiben können.

---

## TEIL D — zurück in TERMUX: pi + Boot + herdr

### D1 — Container verlassen

```bash
exit
```

> Prompt ist wieder Termux (nicht mehr root@localhost).

### D2 — pi installieren (der erste Agent, Termux-nativ)

```bash
npm install -g @earendil-works/pi-coding-agent
```

```bash
pi --version
```

> Original-Bau: pi sagen, es soll Hermes installieren — dann hat der erste Agent den zweiten aufgesetzt (genau so lief es bei uns).

### D3 — Boot-Scripts anlegen + ausführbar machen

Die zwei Dateien `~/.termux/boot/hermes-gateway.sh` und `~/.termux/boot/hermes-watchdog-termux.sh` anlegen. Dann:

```bash
chmod +x ~/.termux/boot/hermes-gateway.sh ~/.termux/boot/hermes-watchdog-termux.sh
```

### D4 — Boot-Test (der Immortalitäts-Beweis)

Handy NEU STARTEN → 1 Minute warten → Termux öffnen:

```bash
cat ~/.termux/boot/boot-log.txt
```

> Erwartung: `[hermes-boot] ... Boot hook fired.` — das System ist ohne dich hochgekommen. Ab hier überlebt das Deck Android-Neustarts allein.

### D5 — herdr installieren (statisches Binary, Termux-nativ)

```bash
mkdir -p ~/.local/bin
```

```bash
curl -fsSL <herdr-release-url> -o ~/.local/bin/herdr && chmod +x ~/.local/bin/herdr
```

```bash
herdr status
```

> Erwartung: `server: running` + Version. Agenten starten (IDs aus `herdr pane list --workspace <id>`):

```bash
herdr agent start pi --kind pi --pane <pane-id>
```

```bash
herdr pane run <pane-id> "proot-distro login ubuntu -- bash -lc 'hermes'"
```

---

## TEIL E — optional: opencode (NUR im Container!)

Kurz:

```bash
proot-distro login ubuntu
```

```bash
npm install -g opencode-ai@latest
```

```bash
opencode auth login     # Key interaktiv!
```

```bash
opencode
```

> RAM-Warnung: Die TUI belegt ungefähr 658 MB — auf 6-GB-Geräten nur für gezielte Sessions.

---

## Schnellreferenz: Welcher Befehl, wo?

| Befehl | Ebene |
|---|---|
| `pkg install ...` | TERMUX |
| `termux-setup-storage` | TERMUX |
| `proot-distro install/login` | TERMUX |
| `apt install tmux` | CONTAINER |
| `curl ... install.sh` (Hermes) | CONTAINER |
| `hermes setup/doctor/gateway run` | CONTAINER |
| `nano /root/.hermes/.env` | CONTAINER |
| `tmux new-session ... gateway` | CONTAINER |
| `npm i -g @earendil-works/pi-coding-agent` | TERMUX |
| `chmod +x ~/.termux/boot/...` | TERMUX |
| `herdr ...` | TERMUX |
| `opencode ...` | CONTAINER |

*Keys gehören nur in die `.env` im Container — nie in Befehle, Skripte oder Repositories.*
