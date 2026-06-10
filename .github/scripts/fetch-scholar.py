#!/usr/bin/env python3
"""
Fetch Google Scholar metrics for Shahzad Ali and write to
public/scholar-metrics.json. Run by .github/workflows/update-scholar-metrics.yml
on a daily cron.

Strategy:
  Hit the public profile page directly with `requests`, then pull the three
  citation/h-index/i10-index numbers out of the `gsc_rsb_std` table cells and
  the per-year histogram out of the `gsc_g_t` / `gsc_g_al` spans. No proxies,
  no `scholarly` library — both of those tend to hang.

Behaviour on failure:
  - If Scholar blocks us (rate limit, captcha) we exit non-zero. The workflow
    step is "failed" but the previous JSON stays committed and the website
    keeps showing the last good snapshot.
"""
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

SCHOLAR_ID = "n3XO81UAAAAJ"
URL = f"https://scholar.google.com/citations?user={SCHOLAR_ID}&hl=en"
OUT = Path("public/scholar-metrics.json")

HEADERS = {
    # Pretend to be a recent Chrome on macOS — Scholar is far more permissive
    # toward "browser-like" requests than empty-UA Python clients.
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/126.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}


def parse_metrics(html: str) -> dict:
    # The right-hand stat block has six <td class="gsc_rsb_std"> cells in this order:
    #   All citations, last-5y citations, h-index, last-5y h-index,
    #   i10-index, last-5y i10-index.
    cells = re.findall(r'<td class="gsc_rsb_std">(\d+)</td>', html)
    if len(cells) < 6:
        raise RuntimeError(
            f"Expected 6 gsc_rsb_std cells, found {len(cells)} — Scholar likely "
            "served a captcha or an empty profile."
        )
    citations, citations_5y, h, h_5y, i10, i10_5y = (int(x) for x in cells[:6])

    # Per-year histogram: years are in <span class="gsc_g_t" ...>YYYY</span>,
    # counts are in <span class="gsc_g_al">N</span>. They appear in matched order.
    years = re.findall(r'<span class="gsc_g_t"[^>]*>(\d{4})</span>', html)
    counts = re.findall(r'<span class="gsc_g_al">(\d+)</span>', html)
    cpy: dict[str, int] = {}
    for y, c in zip(years, counts):
        cpy[y] = int(c)

    # Optional name + affiliation if we can find them
    m_name = re.search(r'<div id="gsc_prf_in"[^>]*>([^<]+)</div>', html)
    m_aff = re.search(r'<div class="gsc_prf_il">([^<]+)</div>', html)

    return {
        "scholar_id": SCHOLAR_ID,
        "name": (m_name.group(1).strip() if m_name else None),
        "affiliation": (m_aff.group(1).strip() if m_aff else None),
        "citations": citations,
        "citations_5y": citations_5y,
        "h_index": h,
        "h_index_5y": h_5y,
        "i10_index": i10,
        "i10_index_5y": i10_5y,
        "cites_per_year": cpy,
        "last_updated": datetime.now(timezone.utc)
        .isoformat(timespec="seconds")
        .replace("+00:00", "Z"),
    }


def main() -> int:
    try:
        import requests  # imported lazily so a missing dep is a clearer error
    except ImportError:
        print("ERROR: requests not installed.", file=sys.stderr)
        return 1

    try:
        r = requests.get(URL, headers=HEADERS, timeout=20)
    except requests.RequestException as e:
        print(f"Scholar request failed: {e}", file=sys.stderr)
        return 2

    if r.status_code != 200:
        print(
            f"Scholar returned HTTP {r.status_code} — likely a rate-limit or captcha.",
            file=sys.stderr,
        )
        return 3

    try:
        metrics = parse_metrics(r.text)
    except Exception as e:
        print(f"Parse failed: {e}", file=sys.stderr)
        return 4

    OUT.parent.mkdir(parents=True, exist_ok=True)
    with OUT.open("w") as f:
        json.dump(metrics, f, indent=2, ensure_ascii=False)
    print(
        f"✓ Wrote {OUT}: {metrics['citations']} citations · "
        f"h={metrics['h_index']} · i10={metrics['i10_index']} · "
        f"{len(metrics['cites_per_year'])} years in histogram"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
