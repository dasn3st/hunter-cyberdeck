#!/usr/bin/env python3
"""Authenticated content bridge for the HUNTER website.

Hermes uses this script instead of editing public HTML/CSS/JS. Payloads are
kept in local JSON files so long blog texts and images do not end up in shell
history or process listings.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

from hunter_agent_bridge import SUPABASE_KEY, SUPABASE_URL, authenticate, record_event, request_json


def read_json(path: str) -> dict[str, Any]:
    try:
        value = json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        raise RuntimeError(f"JSON-Datei konnte nicht gelesen werden: {error}") from error
    if not isinstance(value, dict):
        raise RuntimeError("Die JSON-Datei muss ein Objekt enthalten.")
    return value


def call(function_name: str, payload: dict[str, Any]) -> dict[str, Any]:
    token = authenticate()
    try:
        return request_json(
            f"{SUPABASE_URL}/functions/v1/{function_name}",
            method="POST",
            body=payload,
            headers={
                "apikey": SUPABASE_KEY,
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
            },
        )
    except RuntimeError as error:
        try:
            record_event(token, "error", f"{function_name} fehlgeschlagen: {error}", {"function": function_name})
        except RuntimeError:
            pass
        raise


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="HUNTER Blog- und Seiteninhalte verwalten")
    sub = parser.add_subparsers(dest="command", required=True)

    post = sub.add_parser("post", help="Blogbeitrag als Draft speichern oder veröffentlichen")
    post.add_argument("--payload-file", required=True, help="Lokale JSON-Datei mit dem vollständigen Publish-Payload")

    site = sub.add_parser("site", help="Text, Bild oder Sektion einer Seite aktualisieren")
    site.add_argument("--page-key", required=True, choices=("home", "blog", "tech", "github", "makerworld", "archive", "about"))
    site.add_argument("--slot-key", required=True, help="Slot aus der HUNTER-Einweisung, z. B. hero_lead oder sections")
    site.add_argument("--content-file", required=True, help="Lokale JSON-Datei mit dem content-Objekt")
    site.add_argument("--status", choices=("draft", "published"), default="published")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if args.command == "post":
        payload = read_json(args.payload_file)
        if payload.get("action") not in ("draft", "publish"):
            raise RuntimeError('Blog-Payload benötigt action: "draft" oder "publish".')
        result = call("hunter-publish-post", payload)
    else:
        content = read_json(args.content_file)
        result = call("hunter-update-site", {
            "page_key": args.page_key,
            "slot_key": args.slot_key,
            "content": content,
            "status": args.status,
        })
    print(json.dumps({"ok": bool(result.get("ok")), "result": result}, ensure_ascii=False))


if __name__ == "__main__":
    main()
