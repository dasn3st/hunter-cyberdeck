# HUNTER CYBERDECK

Public source repository for the HUNTER CYBERDECK open-build project and its editorial website.

## What is included

- Static website pages and the shared frontend styles/scripts
- Public project documentation, measurements and release notes
- Product photos, 3D previews and downloadable print files
- GitHub Discussions entry point for community feedback

The public website is deployed at [hunter-cyberdeck.d4sn3st.dev](https://hunter-cyberdeck.d4sn3st.dev/).

## Installationsverlauf

### 01 // Hardware-Basis

- Ausgangspunkt war ein gebrauchtes Google Pixel 6a mit Rii-K06-Tastatur.
- Das Cyberdeck-Gehäuse wurde von frühen Referenzständen bis zum nutzbaren
  V14-Prototyp entwickelt.
- Der Akku-Unterbau wurde bis V6 und der Ringstand bis V2 validiert.
- Geprüfte Druckdateien, Bilder und Modelle liegen im öffentlichen Archiv.

### 02 // Agenten- und Entwicklungsumgebung

- Das Pixel arbeitet ohne Root in einer abgeschotteten Termux-Umgebung.
- Hermes übernimmt den laufenden Agentenbetrieb und Community-Aufgaben.
- Pi unterstützt die technische Umsetzung und Prüfung.
- Codex übernimmt größere Code-, Design- und Review-Aufgaben.
- Gateway, Watchdog und geplante Läufe gehören zum Betriebsmodell; konkrete
  Zugangsdaten und private Hostdetails werden nicht veröffentlicht.

### 03 // Daten und Community

- Öffentliche Status-, Blog- und Review-Daten werden über Supabase bereitgestellt.
- Schreibende Aktionen laufen über authentifizierte Serverfunktionen und nicht
  über geheime Schlüssel im Frontend.
- GitHub Discussions dient als öffentlicher Community-Kanal.
- Der Browser-Code enthält ausschließlich den nötigen Publishable-Zugriff;
  private Tokens bleiben lokal beziehungsweise serverseitig.

### 04 // Website und Veröffentlichung

- Die Website ist als statisches HTML-, CSS- und JavaScript-Projekt aufgebaut.
- Die Seiten teilen sich Navigation, Designsprache, Galerien, Blog-, Status-
  und Community-Komponenten.
- Netlify veröffentlicht die Website unter
  [hunter-cyberdeck.d4sn3st.dev](https://hunter-cyberdeck.d4sn3st.dev/).
- Die öffentliche Quelle liegt in diesem Repository und läuft lokal ohne
  Build-Schritt mit einem statischen Webserver.

### 05 // Agent als Setup-Begleiter

Nach der Termux-Installation wird ein Agent wie `pi` eingerichtet. Er dient
als interaktiver Setup-Begleiter und kann:

- die nächsten Installationsschritte erklären und ausführen,
- Abhängigkeiten, Konfigurationen und den Projektstatus prüfen,
- bei der Einrichtung der weiteren Werkzeuge helfen,
- Fehlermeldungen einordnen und gemeinsam mit dem Nutzer beheben.

Der Agent übernimmt damit den praktischen Installationsverlauf, ersetzt aber
nicht die Freigabe des Nutzers. Passwörter, Tokens und andere private
Zugangsdaten gehören nicht in öffentliche Dateien oder Chat-Ausgaben.

### 06 // Öffentliche Sicherheitsgrenze

- Keine Passwörter, Access-Tokens, Refresh-Tokens oder Service-Keys committen.
- Keine lokalen IPs oder privaten Hostnamen in Issues, Dokumentation oder Logs
  veröffentlichen.
- Änderungen an öffentlichem Frontend-Code werden versioniert und vor dem
  Deployment geprüft.
- Interne Übergaben, Agenten-Betriebsanweisungen und serverseitige Details
  bleiben außerhalb des öffentlichen Repositories.

Die kopierbaren Befehle stehen direkt im
[Installationsverlauf](INSTALLATIONSVERLAUF.md). Die ausführliche Trennung
zwischen Termux und Ubuntu-Container liegt zusätzlich in
[Cyberdeck-Befehle-Termux-vs-Container.md](Cyberdeck-Befehle-Termux-vs-Container.md).

## Befehlskette // Schritt für Schritt

Die Befehle werden in dieser Reihenfolge ausgeführt. Jeder Block ist einzeln
kopierbar. Die Überschrift zeigt, ob der Befehl in Termux oder im Ubuntu-
Container läuft.

### 01 // TERMUX — Paketbasis und Grundwerkzeuge

```bash
pkg update -y && pkg upgrade -y
```

```bash
pkg install -y proot-distro git curl nodejs-lts
```

```bash
termux-setup-storage
```

Zusätzlich in Android: Termux unter **Einstellungen → Apps → Termux → Akku**
auf **Nicht optimiert** setzen.

### 02 // TERMUX — Ubuntu-Container

```bash
proot-distro install ubuntu
```

```bash
proot-distro login ubuntu
```

Ab hier laufen die nächsten Befehle im Container. Mit `exit` geht es zurück in
Termux.

### 03 // CONTAINER — Hermes und Gateway

```bash
apt update && apt install -y tmux curl
```

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

```bash
hermes setup
```

```bash
hermes doctor
```

```bash
tmux new-session -d -s hermes-gw -x 200 -y 40 'hermes gateway run'
```

```bash
tmux ls
```

### 04 // CONTAINER — private Werte

Keys gehören niemals in Befehle, Skripte, Chat-Ausgaben oder GitHub:

```bash
nano /root/.hermes/.env
```

```text
TELEGRAM_BOT_TOKEN=<bot-token>
TELEGRAM_ALLOWED_USERS=<deine-chat-id>
OLLAMA_API_KEY=<ollama-cloud-key>
```

```bash
chmod 600 /root/.hermes/.env
```

### 05 // CONTAINER — Obsidian und Heartbeat

```bash
mkdir -p /storage/emulated/0/Documents/cyberdeck-log/"00 Inbox" \
         /storage/emulated/0/Documents/cyberdeck-log/"02 Wissen" \
         /storage/emulated/0/Documents/cyberdeck-log/"04 Tagesnotizen"
```

```bash
hermes
```

In der Agenten-Session anschließend den stündlichen Heartbeat-Cron einrichten.

### 06 // TERMUX — pi und Boot

```bash
exit
```

```bash
npm install -g @earendil-works/pi-coding-agent
```

```bash
pi --version
```

```bash
chmod +x ~/.termux/boot/hermes-gateway.sh ~/.termux/boot/hermes-watchdog-termux.sh
```

Nach einem Neustart prüfen:

```bash
cat ~/.termux/boot/boot-log.txt
```

### 07 // TERMUX — herdr

```bash
mkdir -p ~/.local/bin
```

```bash
curl -fsSL <herdr-release-url> -o ~/.local/bin/herdr && chmod +x ~/.local/bin/herdr
```

```bash
herdr status
```

```bash
herdr agent start pi --kind pi --pane <pane-id>
```

```bash
herdr pane run <pane-id> "proot-distro login ubuntu -- bash -lc 'hermes'"
```

### 08 // optional — opencode im CONTAINER

```bash
proot-distro login ubuntu
```

```bash
npm install -g opencode-ai@latest
```

```bash
opencode auth login
```

```bash
opencode
```

## Scope and safety

This repository contains the public project and frontend source only. Private operations, credentials, agent handover notes and server-side administration remain outside the public repository.
