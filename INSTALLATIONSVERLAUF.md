# HUNTER CYBERDECK // INSTALLATIONSVERLAUF

Öffentliche, bewusst technische Kurzchronik des Aufbaus. Zugangsdaten, private
Betriebsdetails und lokale Infrastruktur gehören nicht in dieses Repository.

## 01 // Hardware-Basis

- Ausgangspunkt war ein gebrauchtes Google Pixel 6a mit Rii-K06-Tastatur.
- Das Cyberdeck-Gehäuse wurde schrittweise von frühen Referenzständen bis zum
  nutzbaren V14-Prototyp entwickelt.
- Der Akku-Unterbau wurde bis V6 und der Ringstand bis V2 validiert.
- Die geprüften Druckdateien, Bilder und Modelle liegen im öffentlichen Archiv.

## 02 // Agenten- und Entwicklungsumgebung

- Das Pixel arbeitet ohne Root in einer abgeschotteten Termux-Umgebung.
- Hermes übernimmt den laufenden Agentenbetrieb und Community-Aufgaben.
- Pi unterstützt die technische Umsetzung und Prüfung.
- Codex übernimmt größere Code-, Design- und Review-Aufgaben.
- Gateway, Watchdog und geplante Läufe sind Teil des Betriebsmodells; konkrete
  Zugangsdaten und private Hostdetails werden nicht veröffentlicht.

## 03 // Daten und Community

- Öffentliche Status-, Blog- und Review-Daten werden über Supabase bereitgestellt.
- Schreibende Aktionen laufen über authentifizierte Serverfunktionen und nicht
  über geheime Schlüssel im Frontend.
- GitHub Discussions dient als öffentlicher Community-Kanal.
- Der veröffentlichte Browser-Code enthält ausschließlich den dafür nötigen
  Publishable-Zugriff; private Tokens bleiben lokal beziehungsweise serverseitig.

## 04 // Website und Veröffentlichung

- Die Website ist als statisches HTML-, CSS- und JavaScript-Projekt aufgebaut.
- Die Seiten teilen sich eine gemeinsame Navigation, Designsprache, Galerie-,
  Blog-, Status- und Community-Komponenten.
- Netlify veröffentlicht die Website unter
  [hunter-cyberdeck.d4sn3st.dev](https://hunter-cyberdeck.d4sn3st.dev/).
- Die öffentliche Quelle liegt in diesem Repository und kann lokal ohne Build-
  Schritt mit einem statischen Webserver geöffnet werden.

## 05 // Lokaler Start

```bash
git clone https://github.com/dasn3st/hunter-cyberdeck.git
cd hunter-cyberdeck
python3 -m http.server 4173
```

Danach ist die Startseite unter `http://127.0.0.1:4173/` erreichbar.

## 06 // Agent als Setup-Begleiter

Nach der Termux-Installation wird ein Agent wie `pi` eingerichtet. Er dient
als interaktiver Setup-Begleiter und kann die nächsten Schritte erklären und
ausführen, Abhängigkeiten und Konfigurationen prüfen, weitere Werkzeuge
einrichten sowie Fehlermeldungen einordnen und bei der Behebung helfen.

Der Agent begleitet den praktischen Installationsverlauf, ersetzt aber nicht
die Freigabe des Nutzers. Passwörter, Tokens und andere private Zugangsdaten
gehören nicht in öffentliche Dateien oder Chat-Ausgaben.

## 07 // Öffentliche Sicherheitsgrenze

- Keine Passwörter, Access-Tokens, Refresh-Tokens oder Service-Keys committen.
- Keine lokalen IPs oder privaten Hostnamen in Issues, Dokumentation oder Logs
  veröffentlichen.
- Änderungen an öffentlichem Frontend-Code werden versioniert und vor dem
  Deployment geprüft.
- Interne Übergaben, Agenten-Betriebsanweisungen und serverseitige Details
  bleiben außerhalb des öffentlichen Repositories.
