#!/usr/bin/env python3
"""Secure HUNTER bridge for Termux/Python.

The script authenticates with the dedicated Supabase Auth user, caches only
the short-lived session in a 0600 file, refreshes it when possible, and sends
the complete agent status to the hunter-status Edge Function.
"""

from __future__ import annotations

import argparse
import json
import os
import stat
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any


SUPABASE_URL = os.environ.get("HUNTER_SUPABASE_URL", "https://ocgirjlfdugiaieynbnl.supabase.co").rstrip("/")
SUPABASE_KEY = os.environ.get("HUNTER_SUPABASE_KEY", "")
AGENT_EMAIL = os.environ.get("HUNTER_AGENT_EMAIL", "")
AGENT_PASSWORD = os.environ.get("HUNTER_AGENT_PASSWORD", "")
AUTH_FILE = Path(os.environ.get("HUNTER_AUTH_FILE", "/data/data/com.termux/files/home/.hunter-auth.json"))


def request_json(url: str, method: str = "GET", body: dict[str, Any] | None = None,
                headers: dict[str, str] | None = None) -> dict[str, Any]:
    payload = json.dumps(body).encode() if body is not None else None
    request = urllib.request.Request(url, data=payload, method=method)
    for key, value in (headers or {}).items():
        request.add_header(key, value)
    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            return json.loads(response.read().decode())
    except urllib.error.HTTPError as error:
        detail = error.read().decode(errors="replace")
        raise RuntimeError(f"HUNTER API {error.code}: {detail}") from error


def require_config() -> None:
    missing = [name for name, value in {
        "HUNTER_SUPABASE_KEY": SUPABASE_KEY,
        "HUNTER_AGENT_EMAIL": AGENT_EMAIL,
        "HUNTER_AGENT_PASSWORD": AGENT_PASSWORD,
    }.items() if not value]
    if missing:
        raise RuntimeError("Fehlende Umgebungsvariablen: " + ", ".join(missing))


def save_session(session: dict[str, Any]) -> None:
    AUTH_FILE.parent.mkdir(parents=True, exist_ok=True)
    AUTH_FILE.write_text(json.dumps(session), encoding="utf-8")
    AUTH_FILE.chmod(stat.S_IRUSR | stat.S_IWUSR)


def load_session() -> dict[str, Any] | None:
    try:
        return json.loads(AUTH_FILE.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError):
        return None


def authenticate() -> str:
    require_config()
    session = load_session() or {}
    expires_at = float(session.get("expires_at", 0))
    if session.get("access_token") and expires_at > time.time() + 60:
        return str(session["access_token"])

    refresh_token = session.get("refresh_token")
    if refresh_token:
        try:
            refreshed = request_json(
                f"{SUPABASE_URL}/auth/v1/token?grant_type=refresh_token",
                method="POST",
                body={"refresh_token": refresh_token},
                headers={"apikey": SUPABASE_KEY, "Content-Type": "application/json"},
            )
            refreshed["expires_at"] = time.time() + int(refreshed.get("expires_in", 3600))
            save_session(refreshed)
            return str(refreshed["access_token"])
        except RuntimeError:
            pass

    logged_in = request_json(
        f"{SUPABASE_URL}/auth/v1/token?grant_type=password",
        method="POST",
        body={"email": AGENT_EMAIL, "password": AGENT_PASSWORD},
        headers={"apikey": SUPABASE_KEY, "Content-Type": "application/json"},
    )
    logged_in["expires_at"] = time.time() + int(logged_in.get("expires_in", 3600))
    save_session(logged_in)
    return str(logged_in["access_token"])


def send_status(values: dict[str, Any]) -> dict[str, Any]:
    token = authenticate()
    try:
        return request_json(
            f"{SUPABASE_URL}/functions/v1/hunter-status",
            method="POST",
            body=values,
            headers={
                "apikey": SUPABASE_KEY,
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
            },
        )
    except RuntimeError as error:
        # Keep API failures visible without overwriting the current status.
        # If authentication itself failed there is no valid token to log with.
        try:
            record_event(token, "error", f"hunter-status fehlgeschlagen: {error}")
        except RuntimeError:
            pass
        raise


def record_event(token: str, event_type: str, message: str,
                 metadata: dict[str, Any] | None = None) -> dict[str, Any]:
    """Write a sanitized diagnostic event directly to the protected table."""
    return request_json(
        f"{SUPABASE_URL}/rest/v1/agent_events",
        method="POST",
        body={
            "event_type": event_type[:32],
            "message": message[:500],
            "metadata": metadata if isinstance(metadata, dict) else {},
        },
        headers={
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "Prefer": "return=minimal",
        },
    )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="HUNTER Agentenstatus an Supabase senden")
    parser.add_argument("--state", choices=("online", "degraded", "offline"), default="online")
    parser.add_argument("--uptime-seconds", type=int, required=True)
    parser.add_argument("--record-uptime", default="", help="Nur bei einem neuen Bestwert angeben")
    parser.add_argument("--cron-jobs-total", type=int, required=True)
    parser.add_argument("--cron-jobs-ok", type=int, required=True)
    parser.add_argument("--cron-jobs-failed", type=int, required=True)
    parser.add_argument("--oom-kills", type=int, required=True)
    parser.add_argument("--ram-free-mb", type=int, required=True)
    parser.add_argument("--prompt", required=True)
    parser.add_argument("--ollama-plan", default="Pro")
    parser.add_argument("--chatgpt-plan", default="Pro")
    parser.add_argument("--last-test-emoji", default="")
    parser.add_argument("--event-type", choices=("heartbeat", "cron_test", "restart", "oom_kill", "interruption", "deploy", "error"), default="")
    parser.add_argument("--event-message", default="")
    parser.add_argument("--installed-agents-json", default="", help="JSON-Liste der installierten Agenten (ändert die Liste nur bei Angabe)")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    payload = {
        "state": args.state,
        "device_model": "Google Pixel 6a",
        "runtime": "Hunter Agent",
        "uptime_seconds": max(0, args.uptime_seconds),
        "cron_jobs_total": max(0, args.cron_jobs_total),
        "cron_jobs_ok": max(0, args.cron_jobs_ok),
        "cron_jobs_failed": max(0, args.cron_jobs_failed),
        "oom_kills": max(0, args.oom_kills),
        "ram_free_mb": max(0, args.ram_free_mb),
        "ollama_plan": args.ollama_plan,
        "chatgpt_plan": args.chatgpt_plan,
        "prompt": args.prompt,
    }
    if args.last_test_emoji:
        payload["last_test_emoji"] = args.last_test_emoji
    if args.event_type:
        payload["event_type"] = args.event_type
    if args.record_uptime.strip():
        payload["record_uptime"] = args.record_uptime.strip()[:200]
    if args.event_message:
        payload["event_message"] = args.event_message
    if args.installed_agents_json:
        try:
            installed_agents = json.loads(args.installed_agents_json)
        except json.JSONDecodeError as error:
            raise RuntimeError(f"--installed-agents-json ist ungültiges JSON: {error.msg}") from error
        if not isinstance(installed_agents, list):
            raise RuntimeError("--installed-agents-json muss eine JSON-Liste sein")
        payload["installed_agents"] = installed_agents
    result = send_status(payload)
    print(json.dumps({"ok": result.get("ok", False), "state": result.get("status", {}).get("state")}, ensure_ascii=False))


if __name__ == "__main__":
    main()
