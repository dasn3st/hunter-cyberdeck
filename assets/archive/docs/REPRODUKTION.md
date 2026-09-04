# Reproduktion der parametrischen Modelle

## Umgebung

Die Übergabe wurde zuletzt mit Python 3.14.0 und den Versionen aus
`requirements.txt` geprüft. Python 3.11 oder neuer sollte grundsätzlich genügen,
sofern `trimesh` und `manifold3d` miteinander kompatibel sind.

## Installation

```bash
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install -r requirements.txt
```

## Hauptmodelle erzeugen

```bash
python3 design/cyberdeck_v1.py
python3 design/sliding_powerbank_box_v6.py
python3 design/render_sliding_powerbank_box_v6.py
python3 design/elegant_ringstand_module_v2.py
python3 design/render_elegant_ringstand_module_v2.py
python3 design/v6_mount_clips_plus1mm.py
```

Die kanonischen Skripte unter `design/` wurden in dieser Übergabe auf relative Pfade
zu den mitgelieferten Referenzen umgestellt. Historische Quellkopien innerhalb des
Versionsarchivs bleiben unverändert und dienen der Dokumentation.

## Aktueller Drucksatz

Für das direkte Drucken nicht neu generieren, sondern die geprüften Dateien unter
`01_FINAL_RELEASE/` verwenden.

