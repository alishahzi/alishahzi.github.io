#!/usr/bin/env python3
"""
Fetch Google Scholar metrics for Shahzad Ali and write to
public/scholar-metrics.json. Run by .github/workflows/update-scholar-metrics.yml
on a daily cron.

Scholar occasionally blocks scrapers. When that happens we exit non-zero so the
workflow step is "failed" but the previous JSON stays committed — the website
keeps showing the last good snapshot.
"""
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

SCHOLAR_ID = "n3XO81UAAAAJ"
OUT = Path("public/scholar-metrics.json")


def main() -> int:
    try:
        from scholarly import scholarly  # type: ignore
    except ImportError:
        print("ERROR: scholarly not installed. Workflow should install it.", file=sys.stderr)
        return 1

    try:
        author = scholarly.search_author_id(SCHOLAR_ID)
    except Exception as e:
        print(f"Scholar lookup failed: {e}", file=sys.stderr)
        return 2

    try:
        author = scholarly.fill(author, sections=["basics", "indices", "counts"])
    except Exception as e:
        print(f"Scholar fill failed: {e}", file=sys.stderr)
        return 3

    # Normalise cites_per_year (Scholar returns int keys; JSON needs strings)
    cpy_raw = author.get("cites_per_year", {}) or {}
    cpy = {str(year): int(count) for year, count in cpy_raw.items()}

    metrics = {
        "scholar_id":   SCHOLAR_ID,
        "name":         author.get("name"),
        "affiliation":  author.get("affiliation"),
        "interests":    author.get("interests", []),
        "citations":    int(author.get("citedby") or 0),
        "citations_5y": int(author.get("citedby5y") or 0),
        "h_index":      int(author.get("hindex") or 0),
        "h_index_5y":   int(author.get("hindex5y") or 0),
        "i10_index":    int(author.get("i10index") or 0),
        "i10_index_5y": int(author.get("i10index5y") or 0),
        "cites_per_year": cpy,
        "last_updated": datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z"),
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    with OUT.open("w") as f:
        json.dump(metrics, f, indent=2, ensure_ascii=False)
    print(
        f"✓ Updated: {metrics['citations']} citations · h={metrics['h_index']} · i10={metrics['i10_index']}"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
