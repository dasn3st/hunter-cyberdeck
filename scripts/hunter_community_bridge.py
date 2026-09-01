#!/usr/bin/env python3
"""HUNTER community bridge for Hermes.

Reviews use the authenticated Supabase agent session. GitHub Discussions use a
separate fine-grained token kept on the Pixel (never in the website or DB).
"""

from __future__ import annotations

import argparse
import json
import os
import urllib.error
import urllib.request
from typing import Any

from hunter_agent_bridge import SUPABASE_KEY, SUPABASE_URL, authenticate, request_json


GITHUB_TOKEN = os.environ.get("HUNTER_GITHUB_TOKEN", "")
GITHUB_REPO = os.environ.get("HUNTER_GITHUB_REPO", "dasn3st/hunter-cyberdeck")


def github_graphql(query: str, variables: dict[str, Any]) -> dict[str, Any]:
    if not GITHUB_TOKEN:
        raise RuntimeError("HUNTER_GITHUB_TOKEN fehlt. Auf dem Pixel nur als Umgebungsvariable setzen.")
    payload = json.dumps({"query": query, "variables": variables}).encode()
    request = urllib.request.Request("https://api.github.com/graphql", data=payload, method="POST")
    request.add_header("Authorization", f"Bearer {GITHUB_TOKEN}")
    request.add_header("Accept", "application/vnd.github+json")
    request.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            result = json.loads(response.read().decode())
    except urllib.error.HTTPError as error:
        detail = error.read().decode(errors="replace")
        raise RuntimeError(f"GitHub API {error.code}: {detail}") from error
    if result.get("errors"):
        raise RuntimeError("GitHub GraphQL: " + "; ".join(str(item.get("message", "unbekannter Fehler")) for item in result["errors"]))
    return result["data"]


def repo_owner_name() -> tuple[str, str]:
    owner, separator, name = GITHUB_REPO.partition("/")
    if not separator or not owner or not name:
        raise RuntimeError("HUNTER_GITHUB_REPO muss owner/name sein")
    return owner, name


def moderate_review(review_id: int, status: str) -> dict[str, Any]:
    token = authenticate()
    return request_json(
        f"{SUPABASE_URL}/functions/v1/hunter-moderate-review",
        method="POST",
        body={"review_id": review_id, "status": status},
        headers={
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
    )


def list_discussions(limit: int) -> dict[str, Any]:
    owner, name = repo_owner_name()
    query = """
      query($owner:String!, $name:String!, $limit:Int!) {
        repository(owner:$owner, name:$name) {
          discussions(first:$limit, orderBy:{field:UPDATED_AT, direction:DESC}) {
            nodes { id title url category { name } isAnswered closed
              comments(first:20) { nodes { id url body createdAt author { login } } }
            }
          }
        }
      }
    """
    return github_graphql(query, {"owner": owner, "name": name, "limit": max(1, min(limit, 50))})


def discussion_comment(discussion_id: str, body: str) -> dict[str, Any]:
    query = """
      mutation($discussionId:ID!, $body:String!) {
        addDiscussionComment(input:{discussionId:$discussionId, body:$body}) {
          comment { id url }
        }
      }
    """
    return github_graphql(query, {"discussionId": discussion_id, "body": body[:5000]})


def close_discussion(discussion_id: str) -> dict[str, Any]:
    query = """
      mutation($discussionId:ID!) {
        updateDiscussion(input:{discussionId:$discussionId, closed:true}) {
          discussion { id url closed }
        }
      }
    """
    return github_graphql(query, {"discussionId": discussion_id})


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="HUNTER Reviews und GitHub Discussions verwalten")
    sub = parser.add_subparsers(dest="command", required=True)

    review = sub.add_parser("moderate-review", help="Supabase-Review freigeben oder ablehnen")
    review.add_argument("--review-id", type=int, required=True)
    review.add_argument("--status", choices=("approved", "rejected"), required=True)

    discussions = sub.add_parser("discussions", help="GitHub Discussions lesen oder moderieren")
    discussions.add_argument("--action", choices=("list", "comment", "close"), default="list")
    discussions.add_argument("--discussion-id", default="")
    discussions.add_argument("--body", default="")
    discussions.add_argument("--limit", type=int, default=20)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if args.command == "moderate-review":
        result = moderate_review(args.review_id, args.status)
    elif args.action == "list":
        result = list_discussions(args.limit)
    elif args.action == "comment":
        if not args.discussion_id or not args.body:
            raise RuntimeError("discussions --action comment braucht --discussion-id und --body")
        result = discussion_comment(args.discussion_id, args.body)
    else:
        if not args.discussion_id:
            raise RuntimeError("discussions --action close braucht --discussion-id")
        result = close_discussion(args.discussion_id)
    print(json.dumps(result, ensure_ascii=False))


if __name__ == "__main__":
    main()
