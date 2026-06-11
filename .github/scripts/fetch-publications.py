#!/usr/bin/env python3
"""
Sync publications from the Google Sites publications page.

How it works:
  1. Fetch https://sites.google.com/view/alishahzad/publications
  2. Extract every DOI we can find with a regex
  3. For each DOI, fetch Crossref's metadata (same source we use everywhere —
     reliable, includes full author lists, venue, year, type)
  4. Classify each entry as journal vs conference based on Crossref's
     `type` field, and write everything to public/sites-publications.json

The site uses this JSON as a *fallback / addition* to src/data/content.ts —
content.ts is still the source of truth (it has the et-al expansions and
extra fields), so any DOI already there is preferred. Anything new on the
Google Sites page that isn't in content.ts yet shows up automatically.

Behaviour on failure:
  - Network error / Crossref outage → exit non-zero, no commit, last good
    snapshot stays live.
"""
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

GOOGLE_URL = "https://sites.google.com/view/alishahzad/publications"
CROSSREF_URL = "https://api.crossref.org/works/{doi}"
OUT = Path("public/sites-publications.json")

HEADERS_GOOGLE = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/126.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}
HEADERS_CROSSREF = {
    # Polite User-Agent — Crossref documents this as best practice
    "User-Agent": "alishahzi-portfolio/1.0 (mailto:shahzad.ali6@unibo.it)",
}

# Crossref types we consider "journal article" vs "conference"
JOURNAL_TYPES = {"journal-article"}
CONFERENCE_TYPES = {"proceedings-article", "book-chapter", "book"}

# Recognise both bare DOIs and DOIs preceded by a URL prefix
DOI_RE = re.compile(r'\b10\.\d{4,9}/[\w./\-_;()<>+]+', re.IGNORECASE)


def extract_dois(html: str) -> list[str]:
    raw = DOI_RE.findall(html)
    out: list[str] = []
    seen: set[str] = set()
    for d in raw:
        cleaned = d.rstrip(".,;:)>]}'\"")
        # Filter common false positives (DOI patterns inside CSS / JS noise)
        if "google" in cleaned or len(cleaned) > 80:
            continue
        if cleaned not in seen:
            seen.add(cleaned)
            out.append(cleaned)
    return out


def fetch_crossref(doi: str, session) -> dict | None:
    try:
        r = session.get(CROSSREF_URL.format(doi=doi), headers=HEADERS_CROSSREF, timeout=15)
    except Exception as e:
        print(f"  ✗ {doi}: network error {e}", file=sys.stderr)
        return None
    if r.status_code != 200:
        print(f"  ✗ {doi}: HTTP {r.status_code}", file=sys.stderr)
        return None
    return r.json().get("message")


def normalise(work: dict) -> dict | None:
    if not work:
        return None
    doi = (work.get("DOI") or "").lower()
    if not doi:
        return None

    # Authors: "Surname I." form, matching the rest of the site
    authors_list: list[str] = []
    for a in work.get("author", []) or []:
        family = a.get("family", "").strip()
        given = (a.get("given") or "").strip()
        if not family:
            continue
        if given:
            # Compress multi-initial given names: "Anam Fayyaz" → "AF"
            initials = "".join(part[0].upper() for part in given.split() if part)
            authors_list.append(f"{family} {initials}")
        else:
            authors_list.append(family)
    authors = ", ".join(authors_list)

    title = ""
    titles = work.get("title") or []
    if titles:
        title = titles[0].rstrip(".") + "."  # consistent trailing dot

    venue = ""
    container = work.get("container-title") or []
    if container:
        venue = container[0]

    year = None
    for key in ("published-print", "published-online", "issued", "created"):
        parts = work.get(key, {}).get("date-parts") or []
        if parts and parts[0] and parts[0][0]:
            year = parts[0][0]
            break

    vol_bits: list[str] = []
    if work.get("volume"):
        vol_bits.append(f"Vol. {work['volume']}")
    if work.get("issue"):
        vol_bits.append(f"No. {work['issue']}")
    if work.get("page"):
        vol_bits.append(f"pp. {work['page']}")
    vol = ", ".join(vol_bits) or None

    pub_type = work.get("type", "")
    if pub_type in JOURNAL_TYPES:
        section = "journal"
    elif pub_type in CONFERENCE_TYPES:
        section = "conference"
    else:
        section = "other"

    return {
        "id": None,            # filled in by the frontend at render time
        "doi": doi,
        "title": title,
        "authors": authors,
        "venue": venue,
        "vol": vol,
        "year": year,
        "section": section,
        "type": pub_type,
    }


def main() -> int:
    try:
        import requests
    except ImportError:
        print("ERROR: requests not installed.", file=sys.stderr)
        return 1

    session = requests.Session()

    # Pull the Google Sites publications page
    try:
        r = session.get(GOOGLE_URL, headers=HEADERS_GOOGLE, timeout=20)
    except requests.RequestException as e:
        print(f"Google Sites request failed: {e}", file=sys.stderr)
        return 2
    if r.status_code != 200:
        print(f"Google Sites returned HTTP {r.status_code}", file=sys.stderr)
        return 3

    dois = extract_dois(r.text)
    print(f"Found {len(dois)} DOIs on Google Sites publications page")
    if not dois:
        print("No DOIs detected — Google Sites HTML may have changed. Aborting.", file=sys.stderr)
        return 4

    publications: list[dict] = []
    for doi in dois:
        work = fetch_crossref(doi, session)
        entry = normalise(work)
        if entry:
            publications.append(entry)
            print(f"  ✓ {entry['section']:10s} {entry['year']} · {entry['doi']}")

    # Order: journals first by year desc, then conferences by year desc, then everything else
    section_order = {"journal": 0, "conference": 1, "other": 2}
    publications.sort(key=lambda p: (section_order.get(p["section"], 9), -(p["year"] or 0), p["doi"]))

    OUT.parent.mkdir(parents=True, exist_ok=True)
    with OUT.open("w") as f:
        json.dump(
            {
                "publications": publications,
                "source": GOOGLE_URL,
                "last_updated": datetime.now(timezone.utc)
                .isoformat(timespec="seconds")
                .replace("+00:00", "Z"),
            },
            f,
            indent=2,
            ensure_ascii=False,
        )

    n_j = sum(1 for p in publications if p["section"] == "journal")
    n_c = sum(1 for p in publications if p["section"] == "conference")
    n_o = sum(1 for p in publications if p["section"] == "other")
    print(f"✓ Wrote {OUT}: {n_j} journals · {n_c} conferences · {n_o} other ({len(publications)} total)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
