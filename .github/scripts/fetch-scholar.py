#!/usr/bin/env python3
"""
Fetch Google Scholar metrics for Shahzad Ali and write to
public/scholar-metrics.json.

Resilience strategy:
  - Up to 3 attempts per run, with exponential backoff
  - Rotates User-Agent between attempts (different Chrome/Firefox versions)
  - Tolerant regexes — `gsc_rsb_std` is matched as a class fragment so Google
    adding sibling classes can't break the parser
  - If all attempts fail we exit code 75 (EX_TEMPFAIL). The workflow treats
    that as success-no-change, so we don't get a noisy failure email for
    a transient Scholar block. A permanent break (parse always wrong) shows
    up as repeated stale `last_updated` on the website — visible signal
    without paging.
"""
import json
import random
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

SCHOLAR_ID = "n3XO81UAAAAJ"
URL = f"https://scholar.google.com/citations?user={SCHOLAR_ID}&hl=en"
OUT = Path("public/scholar-metrics.json")
EX_TEMPFAIL = 75   # POSIX convention: temporary failure, retry later

# Several recent browser User-Agents — Scholar is more permissive when these
# rotate. The list is hand-picked from real Chrome/Firefox/Safari releases.
USER_AGENTS = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14.4; rv:127.0) Gecko/20100101 Firefox/127.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
]

# Tolerant regexes — class may be combined with siblings like
# "gsc_rsb_std foo" or "foo gsc_rsb_std bar" without breaking the match.
RE_STAT_CELL  = re.compile(r'<td[^>]*class="[^"]*\bgsc_rsb_std\b[^"]*"[^>]*>\s*(\d+)\s*</td>')
RE_HIST_YEAR  = re.compile(r'<span[^>]*class="[^"]*\bgsc_g_t\b[^"]*"[^>]*>\s*(\d{4})\s*</span>')
RE_HIST_COUNT = re.compile(r'<span[^>]*class="[^"]*\bgsc_g_al\b[^"]*"[^>]*>\s*(\d+)\s*</span>')
RE_NAME       = re.compile(r'<div[^>]*id="gsc_prf_in"[^>]*>([^<]+)</div>')
RE_AFF        = re.compile(r'<div[^>]*class="[^"]*\bgsc_prf_il\b[^"]*"[^>]*>([^<]+)</div>')


def headers_for(ua: str) -> dict:
    return {
        "User-Agent": ua,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
    }


def parse_metrics(html: str) -> dict:
    cells = RE_STAT_CELL.findall(html)
    if len(cells) < 6:
        raise RuntimeError(
            f"Expected 6 gsc_rsb_std cells, found {len(cells)} — likely a captcha "
            "or modified profile page."
        )
    citations, citations_5y, h, h_5y, i10, i10_5y = (int(x) for x in cells[:6])

    years  = RE_HIST_YEAR.findall(html)
    counts = RE_HIST_COUNT.findall(html)
    cpy = {y: int(c) for y, c in zip(years, counts)}

    m_name = RE_NAME.search(html)
    m_aff  = RE_AFF.search(html)
    return {
        "scholar_id":   SCHOLAR_ID,
        "name":         (m_name.group(1).strip() if m_name else None),
        "affiliation":  (m_aff.group(1).strip() if m_aff else None),
        "citations":    citations,
        "citations_5y": citations_5y,
        "h_index":      h,
        "h_index_5y":   h_5y,
        "i10_index":    i10,
        "i10_index_5y": i10_5y,
        "cites_per_year": cpy,
        "last_updated": datetime.now(timezone.utc)
        .isoformat(timespec="seconds")
        .replace("+00:00", "Z"),
    }


def attempt_fetch(requests_mod, ua: str):
    r = requests_mod.get(URL, headers=headers_for(ua), timeout=20)
    if r.status_code != 200:
        return None, f"HTTP {r.status_code}"
    try:
        return parse_metrics(r.text), None
    except Exception as e:
        return None, f"parse failed: {e}"


def main() -> int:
    try:
        import requests
    except ImportError:
        print("ERROR: requests not installed.", file=sys.stderr)
        return 1

    attempts = 3
    delays = [4, 12, 30]  # seconds — leave plenty of time between retries

    last_err = "unknown"
    for i in range(attempts):
        ua = USER_AGENTS[i % len(USER_AGENTS)]
        # tiny jitter so we don't look perfectly periodic
        time.sleep(random.uniform(0, 1.5) if i == 0 else delays[i - 1])
        print(f"Attempt {i+1}/{attempts} (UA: …{ua[-40:]})", file=sys.stderr)
        try:
            metrics, err = attempt_fetch(requests, ua)
        except requests.RequestException as e:
            metrics, err = None, f"network error: {e}"
        if metrics:
            OUT.parent.mkdir(parents=True, exist_ok=True)
            with OUT.open("w") as f:
                json.dump(metrics, f, indent=2, ensure_ascii=False)
            print(
                f"✓ Wrote {OUT}: {metrics['citations']} citations · "
                f"h={metrics['h_index']} · i10={metrics['i10_index']} · "
                f"{len(metrics['cites_per_year'])} years in histogram"
            )
            return 0
        last_err = err or "unknown"
        print(f"  ✗ {last_err}", file=sys.stderr)

    print(
        f"Scholar fetch failed after {attempts} attempts. Last error: {last_err}",
        file=sys.stderr,
    )
    print("This is treated as a temporary failure — the website keeps showing the last good snapshot.")
    return EX_TEMPFAIL


if __name__ == "__main__":
    sys.exit(main())
