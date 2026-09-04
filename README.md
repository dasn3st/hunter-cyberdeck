# HUNTER CYBERDECK

Public source repository for the HUNTER CYBERDECK open-build project and its editorial website.

## What is included

- Static website pages and the shared frontend styles/scripts
- Public project documentation, measurements and release notes
- Product photos, 3D previews and downloadable print files
- GitHub Discussions entry point for community feedback

## Run locally

Serve this directory with any static web server and open `index.html` in a browser. No build step is required.

```bash
python3 -m http.server 4173
```

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

### 05 // Lokaler Start

```bash
git clone https://github.com/dasn3st/hunter-cyberdeck.git
cd hunter-cyberdeck
python3 -m http.server 4173
```

Danach ist die Startseite unter `http://127.0.0.1:4173/` erreichbar.

### 06 // Öffentliche Sicherheitsgrenze

- Keine Passwörter, Access-Tokens, Refresh-Tokens oder Service-Keys committen.
- Keine lokalen IPs oder privaten Hostnamen in Issues, Dokumentation oder Logs
  veröffentlichen.
- Änderungen an öffentlichem Frontend-Code werden versioniert und vor dem
  Deployment geprüft.
- Interne Übergaben, Agenten-Betriebsanweisungen und serverseitige Details
  bleiben außerhalb des öffentlichen Repositories.

Die ausführliche Fassung liegt zusätzlich in
[INSTALLATIONSVERLAUF.md](INSTALLATIONSVERLAUF.md).

The complete copy-paste command chain is documented in [Cyberdeck-Befehlskette-Schritt-fuer-Schritt.md](Cyberdeck-Befehlskette-Schritt-fuer-Schritt.md).

## Scope and safety

This repository contains the public project and frontend source only. Private operations, credentials, agent handover notes and server-side administration remain outside the public repository.
