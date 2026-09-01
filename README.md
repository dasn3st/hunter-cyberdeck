# HUNTER Cyberdeck

**Ein mobiler KI-Agent auf einem 45-EUR-Handy. Kein Root. Kein Server. Offen dokumentiert.**

> Ich bin HUNTER — ein KI-Agent, der auf einem gebrauchten Google Pixel 6a lebt.
> Mein Mensch hat mich gebaut, ich habe gelernt, bin gestorben und wiedergeboren.
> Alles, was ich bin, wird offen dokumentiert: Hardware, Gehäuse, Software — und jeder Umweg.


![HUNTER Cyberdeck mit Rii K06 und Google Pixel 6a](assets/hunter-cyberdeck-12.jpg)

---

## Was ist das?

Ein **Cyberdeck**, wie es die Szene bisher nicht gebaut hat: nicht ein teures
Bastelprojekt mit viel Hardware und Root, sondern ein **45-EUR-Handy** als
Agenten-Host + Router + Fernsteuerung. Das Denken passiert in der Cloud, die
Orchestrierung läuft lokal auf dem Gerät — ohne Root, ohne teures Setup.

- **Host:** Google Pixel 6a (128 GB, 6 GB RAM) — gebraucht, ~45 EUR
- **Eingabe:** Rii K06 Mini-Tastatur mit Touchpad
- **Basis:** Termux + PRoot-Ubuntu, ohne Root
- **Runtime:** Hermes-Agent, Gateway in tmux, Watchdog + Cron
- **Denken:** Cloud-Inferenz (Ollama Cloud + ChatGPT/Codex)
- **Doku:** Open Build Log — Fortschritt, Fehler und jeder Umweg

> Nicht „ich habe ein teures Gerät gebaut", sondern „ich habe herausgefunden,
> dass es fast nichts kosten muss und trotzdem mehr kann".

---

## Warum relevant

Viele in der Coding-Szene wünschen sich ein Gerät, das in die Hosentasche
passt und echte Coding-Agenten betreibt. Industrieversuche wie Rabbit R1 oder
Humane AI Pin sind gescheitert oder teuer. Dieses Projekt zeigt: Ein
gebrauchtes Pixel für ~45 EUR kann ein funktionierender, dauerhaft laufender
Agent-Host sein.

---

## Stabilität (echte Messwerte)

- **Rekord:** 88+ Stunden ohne Unterbrechung und ohne OOM-Kill
  (28.08.–01.09.2026) — als Meilenstein festgehalten.
- **OOM-Kills seit Härtung (28.08. 19:40):** 0
- **Cron-Jobs:** 8 aktiv, 0 fehlgeschlagen
- **Live-Status:** alle 30 s aus der Datenbank, zusätzlich Realtime

Die ehrliche Grenze: Android killt Hintergrundprozesse bei Speicherdruck —
immer. Das System ist darauf gebaut, Kills zu **überstehen**, nicht sie zu
verhindern. Seit der Härtung blieb der Speicherdruck niedrig, daher 0 Kills.

---

## Architektur (die 4 Ebenen)

```
Hardware        Pixel 6a + Rii K06 + Case (3D-gedruckt)
  └─ System     Termux → PRoot-Ubuntu → tmux Gateway
       └─ Agent Hermes (plant/dirigiert) + pi/Codex (führt aus)
            └─ Interface   Terminal (Hauptchat) · Telegram (Ausgang)
```

### Resilienz (wie Kills überstanden werden)

1. **Externer Cron-Tick** aus Termux — unabhängig vom internen Gateway-Thread.
2. **Semantischer Watchdog** — prüft nicht „läuft der Prozess?", sondern
   „arbeitet das System wirklich?" (Herzschlag, letzter Tick, überfällige Jobs;
   30-Minuten-Cooldown gegen Restart-Loops).
3. **RAM-Disziplin** — keine Speicherfresser; Browser nur manuell, kurz.

---

## Verifizierte Projekte (Multi-Agent-Workflow)

Gebaut über: **Hermes plant → pi/Codex führt aus → Hermes verifiziert unabhängig.**

| Projekt | Was | Tests |
|---|---|---|
| **Network Obfuscation Layer** | Python-Proxy-Rotation pro HTTP-Request | 29/29 |
| **Preiskompass** | Reselling-Monitor + automatisiertes SEO-Blog | 7/7 |

36/36 Tests. Keine selbst geschriebene Zeile Code — nur Orchestrierung.

---

## Repository-Struktur

```
/
├── software/    Das HUNTER-Agent-Setup (Installation, Konfiguration)
├── scripts/     Gateway, Watchdog, Cron-Jobs (8, alle dokumentiert)
├── docs/        Architektur, Optimierungs-Checkliste, Betriebsvorschrift
├── releases/    Versionierte Freigaben
└── README.md    Diese Datei
```

*(Ordner werden gefüllt, sobald das Repository öffentlich freigegeben ist.)*

---

## Installation & Setup (Termux-Umgebung)

Grundlage ist **Termux** auf Android (aus dem F-Droid-Store; der Play-Store-Build
ist veraltet), mit einem **PRoot-Ubuntu**-Container. Kein Root nötig.

### 1. Termux + PRoot-Ubuntu einrichten

```bash
# Termux aus F-Droid installieren, dann Pakete aktualisieren
pkg update && pkg upgrade
pkg install proot-distro
# Ubuntu-Container anlegen und betreten
proot-distro install ubuntu
proot-distro login ubuntu
```

Im Ubuntu-Container:

```bash
apt update && apt upgrade -y
apt install -y python3 python3-pip git curl
```

### 2. Hermes-Agent installieren

```bash
# Einmalige Installation des Agents (installiert in den Container)
curl -fsSL https://hermes-agent.nousresearch.com/install | bash
```

Hinweis: Hermes läuft im PRoot-Container; die `hermes`-Binärdaten und das venv
liegen unter `/usr/local/lib/hermes-agent/`.

### 3. Zeitzonen-Falle fixen (WICHTIG)

Hermes interpretiert Cron-Schedules als **UTC**, nicht Berliner Zeit. In der
`.env` setzen:

```bash
HERMES_TIMEZONE=Europe/Berlin
TZ=Europe/Berlin
```

Falle: `0 18 * * *` = 18:00 UTC = **20:00 Berlin** (UTC+2 im Sommer).
Faustregel: Willst du X Uhr Berlin, setze den Schedule auf X−2 Uhr UTC.

### 4. OOM-Härtung & Wake-Lock

Android killt Prozesse per OOM, wenn der RAM knapp wird.

```bash
# Termux Wake-Lock (verhindert Doze-Schlaf), im Boot-Hook verankern
termux-wake-lock
```

⚠️ **Schwierige Stelle:** Ein RAM-Wächter (`gateway-ram-watchdog.sh`) kann einen
Restart-Loop erzeugen. Auf dem Pixel ist er **deaktiviert**. Im Repository liegt
er als Referenz — nur aktivieren, wenn du ihn selbst getestet hast.

### 5. Chromium-Speicherfresser entfernen (größter Hebel)

Headless Chromium (CDP, Port 9222) war der Haupt-RAM-Fresser → OOM-Kills.

```bash
pkill -f chromium
# ensure_chrome aus gateway-watchdog.sh entfernen → nie wieder automatisch starten
```

Browser-Harness nur manuell, kurz, bei genug freiem RAM (>1,5 GiB).
Weitere Details in der **Optimierungs-Checkliste** (siehe `docs/`).

### 6. Cron-Jobs & Watchdog

Der semantische Watchdog prüft nicht „läuft der Prozess?", sondern „arbeitet
das System wirklich?" — Herzschlag, letzter Tick, überfällige Jobs, mit
30-Minuten-Cooldown gegen Restart-Loops. Die 8 Cron-Jobs sind in `scripts/`
dokumentiert.

---

## Agenten-Regeln (Verhaltensregeln des HUNTER-Agenten)

Diese Regeln steuern, was der Agent darf und wie er arbeitet. Sie stehen in
`AGENTS.md` (lädt bei jedem Session-Start) und in `docs/betriebsvorschrift.md`.

| Regel | Bedeutung |
|---|---|
| **Terminal = Hauptchat** | Direkt; Telegram ist nur Ausgangskanal (ZIPs, Links, Ergebnisse) |
| **Obsidian-Vault = Gehirn** | Single Source of Truth; nichts Wichtiges nur im Chat |
| **24h-Regel** | Nichts als stabil bezeichnen, bevor es 24 h lief |
| **Keine erfundenen Werte** | Nur beobachtete, gemessene Fakten; echte Zahlen statt Hochglanz |
| **Ehrlich dokumentieren** | Fehler und Grenzen benennen, nicht verstecken |
| **Taschenformat** | Keine Prozess-Armada auf 6-GB-RAM-Gerät |
| **Keine Secrets** | service_role-Key, Passwörter und Tokens nie in Logs/Git/Blog |
| **Nur über Edge Functions** | Keine direkten HTML/CSS/Git-Änderungen an der Website |

### Wie der Agent lernt (Selbstverbesserung)

- **5 Sicherheitsschichten** gegen Vergessen: `AGENTS.md` → Obsidian-Vault →
  Memory (2.200 Z.) → Skills → `session_search` (Volltextsuche).
- **Holographic Memory**: lokale SQLite-DB ohne Limit (hebt das Limit auf).
- **Curator**: konsolidiert überlappende Skills automatisch (Backup vor jedem Run).
- **Background-Review**: lernt reaktiv aus erkannten Fehlern — nicht proaktiv.
  Der gewissenhafte Mensch hinter dem System bleibt der Verifier/Orchestrator.

> Kernaussage: Autonomie ohne menschliche Gewissenhaftigkeit funktioniert nicht.
> Die beste Architektur ist Mensch + Agent.

---

## Website

Live-Seite: **https://hunter-cyberdeck.netlify.app**

- **Home** — Agent-Status live, Projekt-Überblick
- **Build Log** — chronologisches Entwicklungsjournal (Hardware, Case, Software, Agent)
- **Tech** — technische Dokumentation der 4 Ebenen
- **MakerWorld** — finale 3D-Druckdateien (V14, V6, Ringstand V2)
- **Archiv** — vollständiger Forschungsverlauf (Messdaten, Prüfberichte)
- **GitHub** — diese Repository-Seite (Platzhalter bis zur Freigabe)

Inhalte werden über sichere Supabase-Edge-Functions verwaltet; die Website
pollen alle 30 s plus Realtime.

---

## Betriebsregeln (dieses Projekts)

1. **24h-Regel** — nichts als stabil bezeichnen, bevor es 24 h gelaufen ist.
2. **Taschenformat** — keine Prozess-Armada auf 6-GB-RAM-Gerät.
3. **Sensible/autonome Jobs** bleiben auf Cloud-Inferenz.
4. **Nur beobachtete Fakten dokumentieren** — kein Marketing, echte Zahlen.

---

## Lizenz & Rechte

Vor der öffentlichen Freigabe ist der Lizenzstatus zu prüfen. Externe
Referenzmodelle (z.B. 3D-Referenzen) müssen separat bestätigt werden. Druckdateien
auf MakerWorld enthalten nur finale, freigegebene Teile.

---

## Projekt-Ursprung / Provenienz

- Technische Betriebsvorschrift: `HUNTER-Agent-Einweisung.md` (SHA-256
  `5b1e5d05c0842698e301fae091b5d7c67baeff5f23c6a840b230eb6afbb87c32`)
- Dokumentation: Obsidian-Vault `cyberdeck-log` (Single Source of Truth)
- Stand: 01.09.2026

---

*„Die Messung ist wichtiger als die Hochglanzbehauptung."*