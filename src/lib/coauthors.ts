// ─────────────────────────────────────────────────────────────────────────────
// CO-AUTHOR PARSING + AFFILIATION INFERENCE
//
// Reads `publications.journalsPublished` and `publications.selectedConferences`
// from src/data/content.ts, extracts every co-author (excluding Shahzad),
// normalises their name, attaches an inferred affiliation/city/coords (Option A —
// best educated guesses from public knowledge of the listed groups), and
// returns:
//
//   nodes  — one per unique co-author + Shahzad himself
//   edges  — one per publication shared with Shahzad
//   bins   — papers-per-year, split by journal vs conference
//   words  — keyword frequencies (from publication titles)
//   topCollaborators — sorted by joint paper count
//
// Edit AFFILIATIONS below to fix any mis-attribution.
// ─────────────────────────────────────────────────────────────────────────────

import { publications } from "../data/content";

// ── Affiliation registry — Option A best guesses ───────────────────────────
//
// Each entry: matching surname or full last+initial → affiliation
// Coordinates are approximate centroids.
//
export interface Affiliation {
  org: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  group: "italy-genoa" | "italy-bologna" | "italy-other" | "uk-sussex" |
         "pakistan-lahore" | "pakistan-other" | "saudi-arabia" | "cyprus" |
         "netherlands" | "usa" | "other";
}

export const AFFILIATIONS: Record<string, Affiliation> = {
  // — LISCOMP / MIDA / IRCCS San Martino (Genoa, Italy) ──────────────────────
  garbarino:    { org: "IRCCS San Martino · UniGe (LISCOMP)", city: "Genova", country: "Italy",  lat: 44.40, lon:  8.93, group: "italy-genoa" },
  piana:        { org: "Università di Genova (MIDA)",         city: "Genova", country: "Italy",  lat: 44.40, lon:  8.93, group: "italy-genoa" },
  pardini:      { org: "IRCCS San Martino · UniGe",           city: "Genova", country: "Italy",  lat: 44.40, lon:  8.93, group: "italy-genoa" },
  kreshpa:      { org: "IRCCS San Martino",                   city: "Genova", country: "Italy",  lat: 44.40, lon:  8.93, group: "italy-genoa" },
  rosso:        { org: "IRCCS San Martino (LISCOMP)",         city: "Genova", country: "Italy",  lat: 44.40, lon:  8.93, group: "italy-genoa" },
  roccatagliata:{ org: "IRCCS San Martino · UniGe",           city: "Genova", country: "Italy",  lat: 44.40, lon:  8.93, group: "italy-genoa" },
  cirone:       { org: "IRCCS San Martino",                   city: "Genova", country: "Italy",  lat: 44.40, lon:  8.93, group: "italy-genoa" },
  lorenzini:    { org: "IRCCS San Martino",                   city: "Genova", country: "Italy",  lat: 44.40, lon:  8.93, group: "italy-genoa" },
  campi:        { org: "Università di Genova (MIDA)",         city: "Genova", country: "Italy",  lat: 44.40, lon:  8.93, group: "italy-genoa" },
  argenti:      { org: "IRCCS San Martino · UniGe",           city: "Genova", country: "Italy",  lat: 44.40, lon:  8.93, group: "italy-genoa" },
  massa:        { org: "IRCCS San Martino · UniGe",           city: "Genova", country: "Italy",  lat: 44.40, lon:  8.93, group: "italy-genoa" },
  losa:         { org: "IRCCS San Martino · UniGe",           city: "Genova", country: "Italy",  lat: 44.40, lon:  8.93, group: "italy-genoa" },
  lombardo:     { org: "IRCCS San Martino · UniGe",           city: "Genova", country: "Italy",  lat: 44.40, lon:  8.93, group: "italy-genoa" },
  peira:        { org: "IRCCS San Martino · UniGe",           city: "Genova", country: "Italy",  lat: 44.40, lon:  8.93, group: "italy-genoa" },
  sofia:        { org: "IRCCS San Martino · UniGe",           city: "Genova", country: "Italy",  lat: 44.40, lon:  8.93, group: "italy-genoa" },
  donniaquio:   { org: "IRCCS San Martino · UniGe",           city: "Genova", country: "Italy",  lat: 44.40, lon:  8.93, group: "italy-genoa" },
  "cotta ramusino": { org: "IRCCS Mondino · UniGe",           city: "Pavia / Genova", country: "Italy", lat: 45.18, lon:  9.16, group: "italy-genoa" },
  cama:         { org: "Università di Genova (MIDA)",         city: "Genova", country: "Italy",  lat: 44.40, lon:  8.93, group: "italy-genoa" },
  gualco:       { org: "IRCCS San Martino · UniGe",           city: "Genova", country: "Italy",  lat: 44.40, lon:  8.93, group: "italy-genoa" },
  gandoglia:    { org: "IRCCS San Martino",                   city: "Genova", country: "Italy",  lat: 44.40, lon:  8.93, group: "italy-genoa" },

  // — UniGe / IRCCS San Martino — Neurology, PET, Connectomics team ─────────
  raffa:        { org: "IRCCS San Martino · UniGe (PET)",         city: "Genova", country: "Italy",  lat: 44.40, lon:  8.93, group: "italy-genoa" },
  sambuceti:    { org: "IRCCS San Martino · UniGe (Nuclear Med.)", city: "Genova", country: "Italy",  lat: 44.40, lon:  8.93, group: "italy-genoa" },
  bozzo:        { org: "Università di Genova",                    city: "Genova", country: "Italy",  lat: 44.40, lon:  8.93, group: "italy-genoa" },
  pelagotti:    { org: "Università di Genova",                    city: "Genova", country: "Italy",  lat: 44.40, lon:  8.93, group: "italy-genoa" },
  pulze:        { org: "Università di Genova",                    city: "Genova", country: "Italy",  lat: 44.40, lon:  8.93, group: "italy-genoa" },
  hamedani:     { org: "Università di Genova",                    city: "Genova", country: "Italy",  lat: 44.40, lon:  8.93, group: "italy-genoa" },
  francia:      { org: "IRCCS San Martino · UniGe",               city: "Genova", country: "Italy",  lat: 44.40, lon:  8.93, group: "italy-genoa" },
  brugnolo:     { org: "IRCCS San Martino · UniGe (Neurology)",   city: "Genova", country: "Italy",  lat: 44.40, lon:  8.93, group: "italy-genoa" },
  girtler:      { org: "IRCCS San Martino · UniGe (Neurology)",   city: "Genova", country: "Italy",  lat: 44.40, lon:  8.93, group: "italy-genoa" },
  caneva:       { org: "IRCCS San Martino · UniGe",               city: "Genova", country: "Italy",  lat: 44.40, lon:  8.93, group: "italy-genoa" },
  mattioli:     { org: "IRCCS San Martino · UniGe",               city: "Genova", country: "Italy",  lat: 44.40, lon:  8.93, group: "italy-genoa" },
  morbelli:     { org: "IRCCS San Martino · UniGe (Nuclear Med.)", city: "Genova", country: "Italy",  lat: 44.40, lon:  8.93, group: "italy-genoa" },
  serrati:      { org: "IRCCS San Martino (Neurology)",           city: "Genova", country: "Italy",  lat: 44.40, lon:  8.93, group: "italy-genoa" },
  uccelli:      { org: "IRCCS San Martino · UniGe",               city: "Genova", country: "Italy",  lat: 44.40, lon:  8.93, group: "italy-genoa" },
  chincarini:   { org: "INFN · UniGe",                            city: "Genova", country: "Italy",  lat: 44.40, lon:  8.93, group: "italy-genoa" },
  arnaldi:      { org: "IRCCS San Martino · UniGe (Neurology)",   city: "Genova", country: "Italy",  lat: 44.40, lon:  8.93, group: "italy-genoa" },
  orso:         { org: "IRCCS San Martino · UniGe",               city: "Genova", country: "Italy",  lat: 44.40, lon:  8.93, group: "italy-genoa" },
  schenone:     { org: "IRCCS San Martino · UniGe (Neurology)",   city: "Genova", country: "Italy",  lat: 44.40, lon:  8.93, group: "italy-genoa" },
  "del sette":  { org: "IRCCS San Martino (Neurology)",           city: "Genova", country: "Italy",  lat: 44.40, lon:  8.93, group: "italy-genoa" },
  castellan:    { org: "IRCCS San Martino (Neuroradiology)",      city: "Genova", country: "Italy",  lat: 44.40, lon:  8.93, group: "italy-genoa" },
  mortola:      { org: "Università di Genova",                    city: "Genova", country: "Italy",  lat: 44.40, lon:  8.93, group: "italy-genoa" },
  falcitano:    { org: "IRCCS San Martino",                       city: "Genova", country: "Italy",  lat: 44.40, lon:  8.93, group: "italy-genoa" },

  // — IRCCS Mondino Foundation, Pavia ──────────────────────────────────────
  mazzacane:    { org: "IRCCS Mondino Foundation",  city: "Pavia",  country: "Italy", lat: 45.18, lon:  9.16, group: "italy-other" },
  perini:       { org: "IRCCS Mondino Foundation",  city: "Pavia",  country: "Italy", lat: 45.18, lon:  9.16, group: "italy-other" },
  costa:        { org: "IRCCS Mondino Foundation",  city: "Pavia",  country: "Italy", lat: 45.18, lon:  9.16, group: "italy-other" },
  farina:       { org: "IRCCS Mondino Foundation",  city: "Pavia",  country: "Italy", lat: 45.18, lon:  9.16, group: "italy-other" },

  // — Other Italian institutions ───────────────────────────────────────────
  plantone:     { org: "University of Siena",            city: "Siena", country: "Italy", lat: 43.32, lon: 11.33, group: "italy-other" },
  piazza:       { org: "University of Milano-Bicocca",   city: "Monza", country: "Italy", lat: 45.58, lon:  9.27, group: "italy-other" },

  // — Amsterdam UMC, Netherlands (Lorenzini L) ─────────────────────────────
  lorenzini:    { org: "Amsterdam UMC, Vrije Universiteit",  city: "Amsterdam", country: "Netherlands", lat: 52.37, lon:  4.90, group: "netherlands" },

  // — USA (Mariel Kozberg, Harvard / Mass General) ─────────────────────────
  kozberg:      { org: "Massachusetts General Hospital · Harvard Medical School", city: "Boston", country: "USA", lat: 42.36, lon: -71.06, group: "usa" },

  // — UET Lahore (Pakistan) ─────────────────────────────────────────────────
  shahbaz:      { org: "UET Lahore (CSE)",                    city: "Lahore", country: "Pakistan", lat: 31.58, lon: 74.34, group: "pakistan-lahore" },
  guergachi:    { org: "Visiting (UET / Toronto Metropolitan U.)", city: "Toronto", country: "Canada", lat: 43.66, lon: -79.39, group: "other" },
  niazi:        { org: "UET Lahore (CSE)",                    city: "Lahore", country: "Pakistan", lat: 31.58, lon: 74.34, group: "pakistan-lahore" },
  umer:         { org: "UET Lahore (CSE)",                    city: "Lahore", country: "Pakistan", lat: 31.58, lon: 74.34, group: "pakistan-lahore" },
  jamil:        { org: "UET Lahore (CSE)",                    city: "Lahore", country: "Pakistan", lat: 31.58, lon: 74.34, group: "pakistan-lahore" },

  // — King Saud University (Riyadh, Saudi Arabia) ───────────────────────────
  alhussein:    { org: "King Saud University",                city: "Riyadh", country: "Saudi Arabia", lat: 24.71, lon: 46.68, group: "saudi-arabia" },
  aurangzeb:    { org: "King Saud University",                city: "Riyadh", country: "Saudi Arabia", lat: 24.71, lon: 46.68, group: "saudi-arabia" },

  // — COMSATS / Pakistan general ────────────────────────────────────────────
  // Surname-only fallback for any Aslam not matched by the surname-initial keys below
  aslam:        { org: "Pakistani research partners",                  city: "Lahore",   country: "Pakistan", lat: 31.58, lon: 74.34, group: "pakistan-lahore" },
  // Surname+initial precise entries
  "aslam-s":    { org: "Cyprus International University · COMSATS",    city: "Nicosia",  country: "Cyprus",   lat: 35.17, lon: 33.36, group: "cyprus" },
  "aslam-m":    { org: "Pakistani research partners",                  city: "Lahore",   country: "Pakistan", lat: 31.58, lon: 74.34, group: "pakistan-lahore" },
  kiran:        { org: "COMSATS Lahore",                               city: "Lahore",   country: "Pakistan", lat: 31.58, lon: 74.34, group: "pakistan-lahore" },
  "rehman khan":{ org: "COMSATS / Sahiwal partners",          city: "Sahiwal", country: "Pakistan", lat: 30.66, lon: 73.10, group: "pakistan-other" },
  "ur rehman khan":{ org: "COMSATS / Sahiwal partners",       city: "Sahiwal", country: "Pakistan", lat: 30.66, lon: 73.10, group: "pakistan-other" },

  // — Dental / endodontics research (Pakistan) ──────────────────────────────
  bashir:       { org: "University of Health Sciences, Lahore",  city: "Lahore", country: "Pakistan", lat: 31.58, lon: 74.34, group: "pakistan-lahore" },
  jatala:       { org: "University of Health Sciences, Lahore",  city: "Lahore", country: "Pakistan", lat: 31.58, lon: 74.34, group: "pakistan-lahore" },
  fareed:       { org: "Riphah International University",        city: "Islamabad", country: "Pakistan", lat: 33.69, lon: 73.05, group: "pakistan-other" },
  sheryar:      { org: "Dental research, Pakistan",              city: "Lahore", country: "Pakistan", lat: 31.58, lon: 74.34, group: "pakistan-lahore" },
  chattha:      { org: "Dental research, Pakistan",              city: "Lahore", country: "Pakistan", lat: 31.58, lon: 74.34, group: "pakistan-lahore" },
  khan:         { org: "Dental research, Pakistan",              city: "Lahore", country: "Pakistan", lat: 31.58, lon: 74.34, group: "pakistan-lahore" },
  ahmad:        { org: "Dental research, Pakistan",              city: "Lahore", country: "Pakistan", lat: 31.58, lon: 74.34, group: "pakistan-lahore" },
  iqbal:        { org: "Dental research, Pakistan",              city: "Lahore", country: "Pakistan", lat: 31.58, lon: 74.34, group: "pakistan-lahore" },
  zafar:        { org: "Taibah University, KSA",                 city: "Madinah", country: "Saudi Arabia", lat: 24.47, lon: 39.61, group: "saudi-arabia" },
  manji:        { org: "Dental research, Pakistan",              city: "Karachi", country: "Pakistan", lat: 24.86, lon: 67.00, group: "pakistan-other" },
  imtiaz:       { org: "Dental research, Pakistan",              city: "Karachi", country: "Pakistan", lat: 24.86, lon: 67.00, group: "pakistan-other" },
  ehsan:        { org: "Dental research, Pakistan",              city: "Karachi", country: "Pakistan", lat: 24.86, lon: 67.00, group: "pakistan-other" },
  mehmood:      { org: "Dental research, Pakistan",              city: "Karachi", country: "Pakistan", lat: 24.86, lon: 67.00, group: "pakistan-other" },
  zaheer:       { org: "Dental research, Pakistan",              city: "Karachi", country: "Pakistan", lat: 24.86, lon: 67.00, group: "pakistan-other" },

  // — Wind power / forecasting paper (Pakistan) ─────────────────────────────
  sufyan:       { org: "Pakistani research partners",            city: "Lahore", country: "Pakistan", lat: 31.58, lon: 74.34, group: "pakistan-lahore" },
  raza:         { org: "Pakistani research partners",            city: "Lahore", country: "Pakistan", lat: 31.58, lon: 74.34, group: "pakistan-lahore" },
  sultana:      { org: "Pakistani research partners",            city: "Lahore", country: "Pakistan", lat: 31.58, lon: 74.34, group: "pakistan-lahore" },
  habib:        { org: "Pakistani research partners",            city: "Lahore", country: "Pakistan", lat: 31.58, lon: 74.34, group: "pakistan-lahore" },

  // — ISBM 2025 / Springer LNNS Pakistani ML researchers ────────────────────
  usman:        { org: "Pakistani research partners",            city: "Lahore", country: "Pakistan", lat: 31.58, lon: 74.34, group: "pakistan-lahore" },
  shahid:       { org: "Pakistani research partners",            city: "Lahore", country: "Pakistan", lat: 31.58, lon: 74.34, group: "pakistan-lahore" },
  mustafa:      { org: "Pakistani research partners",            city: "Lahore", country: "Pakistan", lat: 31.58, lon: 74.34, group: "pakistan-lahore" },
  hussain:      { org: "Pakistani research partners",            city: "Lahore", country: "Pakistan", lat: 31.58, lon: 74.34, group: "pakistan-lahore" },
  akbar:        { org: "Pakistani research partners",            city: "Lahore", country: "Pakistan", lat: 31.58, lon: 74.34, group: "pakistan-lahore" },

  // — Diabetes paper (Al Yamamah Engineering Forum) ─────────────────────────
  saddique:     { org: "Pakistani research partners",            city: "Lahore", country: "Pakistan", lat: 31.58, lon: 74.34, group: "pakistan-lahore" },
  ejaz:         { org: "Pakistani research partners",            city: "Lahore", country: "Pakistan", lat: 31.58, lon: 74.34, group: "pakistan-lahore" },
};

// Default for anyone unmatched
const DEFAULT_AFFILIATION: Affiliation = {
  org: "International collaborator",
  city: "Other",
  country: "Other",
  lat: 0, lon: 0,
  group: "other",
};

// ── Author parsing ─────────────────────────────────────────────────────────
//
// Each publication's `authors` string uses one of two main forms:
//   "Ali S, Kreshpa W, Rosso N, ..."                  (PubMed-style)
//   "Ali, Shahzad, Michele Piana, Matteo Pardini..."  (full-name style)
//
// We split on commas, strip surrounding "et al." / spaces, and try to
// normalise to "Surname Initial" form for matching purposes.

const SHAHZAD_KEYS = new Set([
  "ali s", "ali shahzad", "shahzad ali",
]);

function normaliseName(raw: string): string {
  return raw
    .replace(/et\s+al\.?/gi, "")
    .replace(/[.]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function namesFromAuthorString(s: string): string[] {
  if (!s) return [];
  // Split on commas — handles both styles cleanly
  return s.split(/,/)
    .map(p => normaliseName(p))
    .filter(p => p.length > 0 && !/^and$/i.test(p));
}

function isShahzad(name: string): boolean {
  const lower = name.toLowerCase().replace(/[^a-z\s]/g, "").trim();
  if (SHAHZAD_KEYS.has(lower)) return true;
  // Forms like "Ali S" / "Ali, S" / "S Ali"
  if (/^ali\s+s$/.test(lower)) return true;
  if (/^s\s+ali$/.test(lower)) return true;
  if (/(?:^|\s)shahzad\s+ali(?:$|\s)/.test(lower)) return true;
  if (/(?:^|\s)ali\s+shahzad(?:$|\s)/.test(lower)) return true;
  return false;
}

function lookupAffiliation(surname: string, firstInitial: string): Affiliation {
  // Most precise: surname-initial (lets us distinguish "Aslam S" from "Aslam M")
  const preciseKey = firstInitial ? `${surname}-${firstInitial}` : "";
  if (preciseKey && AFFILIATIONS[preciseKey]) return AFFILIATIONS[preciseKey];
  // Surname only
  if (AFFILIATIONS[surname]) return AFFILIATIONS[surname];
  // Last word of multi-word surname
  const toks = surname.split(/\s+/);
  if (toks.length > 1 && AFFILIATIONS[toks[toks.length - 1]]) return AFFILIATIONS[toks[toks.length - 1]];
  return DEFAULT_AFFILIATION;
}

// Returns true if a token looks like an "initial(s) only" string:
//   "M"   "S"   "MM"   "AF"   "MS"   are initials
//   "Ali" "Sara" "Piana" are not
function looksLikeInitials(tok: string): boolean {
  const clean = tok.replace(/[.]/g, "");
  // 1–4 chars, ALL uppercase (handles single, double, triple initials)
  return /^[A-Z]{1,4}$/.test(clean);
}

/**
 * Parse a raw author string into a normalised { surname, firstInitial, display } triple.
 *
 *   "Piana M"             → { surname: "piana",         firstInitial: "m", display: "M. Piana" }
 *   "Michele Piana"       → { surname: "piana",         firstInitial: "m", display: "Michele Piana" }
 *   "Piana, Michele"      → { surname: "piana",         firstInitial: "m", display: "Michele Piana" }
 *   "Cotta Ramusino M"    → { surname: "cotta ramusino", firstInitial: "m", display: "M. Cotta Ramusino" }
 *   "Bashir AF"           → { surname: "bashir",        firstInitial: "a", display: "AF. Bashir" }
 *   "Misbah"              → { surname: "misbah",        firstInitial: "", display: "Misbah" }
 *
 * Same person under any of these forms ends up with the same surname + firstInitial,
 * so the key   `${surname}-${firstInitial}`   correctly de-duplicates them.
 */
function parseAuthor(raw: string): { surname: string; firstInitial: string; display: string } {
  const cleaned = raw.replace(/\s+/g, " ").trim();
  // Comma form: "Surname, Forename(s)"
  if (cleaned.includes(",")) {
    const [s, f] = cleaned.split(",").map(p => p.trim());
    const surname = (s || "").toLowerCase();
    const firstInitial = (f || "").replace(/[^A-Za-z]/g, "")[0]?.toLowerCase() || "";
    const display = f ? `${f} ${s}` : (s || raw);
    return { surname, firstInitial, display };
  }

  const tokens = cleaned.split(" ").filter(Boolean);
  if (tokens.length === 0) return { surname: "", firstInitial: "", display: raw };
  if (tokens.length === 1) {
    return {
      surname: tokens[0].toLowerCase().replace(/[^a-z]/g, ""),
      firstInitial: "",
      display: tokens[0],
    };
  }

  // Is the last token initials only?
  const lastTok = tokens[tokens.length - 1];
  if (looksLikeInitials(lastTok) && tokens.length >= 2) {
    // "Surname (possibly multi-word) Initial(s)"
    const surname = tokens.slice(0, -1).join(" ").toLowerCase();
    const firstInitial = lastTok.replace(/[^A-Za-z]/g, "")[0]?.toLowerCase() || "";
    const initialsDot = lastTok.replace(/[.]/g, "").split("").join(".") + ".";
    const display = `${initialsDot} ${tokens.slice(0, -1).join(" ")}`;
    return { surname, firstInitial, display };
  }

  // "Forename(s) Surname"
  const surname = lastTok.toLowerCase().replace(/[^a-z]/g, "");
  const firstInitial = tokens[0].replace(/[^A-Za-z]/g, "")[0]?.toLowerCase() || "";
  return { surname, firstInitial, display: tokens.join(" ") };
}

function canonicalDisplay(raw: string): string {
  return parseAuthor(raw).display;
}

function authorKey(raw: string): string {
  const { surname, firstInitial } = parseAuthor(raw);
  return `${surname}-${firstInitial}`;
}

// ── Public types ────────────────────────────────────────────────────────────

export interface PubLite {
  id?: string;
  title: string;
  venue?: string;
  year?: number | string;
  doi?: string;
  kind: "journal" | "conference";
  authors: string;
}

export interface CoAuthorNode {
  id: string;
  display: string;
  count: number;          // total joint papers
  journalCount: number;   // journal-only count (used as a tiebreaker on sort)
  affiliation: Affiliation;
  paperIds: string[];
}

export interface NetworkEdge {
  source: string;     // always Shahzad's id
  target: string;     // co-author id
  weight: number;     // joint paper count
  paperIds: string[];
}

export interface YearBin {
  year: number;
  journal: number;
  conference: number;
}

export interface WordItem {
  word: string;
  count: number;
}

// ── Build everything ───────────────────────────────────────────────────────

const SHAHZAD_ID = "shahzad-ali";

const ALL_PUBS: PubLite[] = [
  ...((publications as { journalsPublished?: PubLite[] }).journalsPublished || []).map(p => ({ ...p, kind: "journal" as const })),
  ...((publications as { selectedConferences?: PubLite[] }).selectedConferences || []).map(p => ({ ...p, kind: "conference" as const })),
];

// ── Co-author nodes + edges ────────────────────────────────────────────────

const nodeMap = new Map<string, CoAuthorNode>();
const edgeMap = new Map<string, NetworkEdge>();

for (const pub of ALL_PUBS) {
  const names = namesFromAuthorString(pub.authors);
  // De-dup any same-person-twice within a single paper (paranoia)
  const seenInThisPub = new Set<string>();
  for (const raw of names) {
    if (isShahzad(raw)) continue;
    const parsed = parseAuthor(raw);
    const key = `${parsed.surname}-${parsed.firstInitial}`;
    if (!key || key === "-" || seenInThisPub.has(key)) continue;
    seenInThisPub.add(key);

    if (!nodeMap.has(key)) {
      nodeMap.set(key, {
        id: key,
        display: parsed.display,
        count: 0,
        journalCount: 0,
        affiliation: lookupAffiliation(parsed.surname, parsed.firstInitial),
        paperIds: [],
      });
    }
    const node = nodeMap.get(key)!;
    node.count += 1;
    if (pub.kind === "journal") node.journalCount += 1;
    if (pub.id) node.paperIds.push(pub.id);

    const edgeKey = `${SHAHZAD_ID}--${key}`;
    if (!edgeMap.has(edgeKey)) {
      edgeMap.set(edgeKey, { source: SHAHZAD_ID, target: key, weight: 0, paperIds: [] });
    }
    const edge = edgeMap.get(edgeKey)!;
    edge.weight += 1;
    if (pub.id) edge.paperIds.push(pub.id);
  }
}

export const SHAHZAD_NODE = {
  id: SHAHZAD_ID,
  display: "Shahzad Ali",
  count: ALL_PUBS.length,
  affiliation: {
    org: "IRCCS San Martino · UniGe (LISCOMP) · UniBo",
    city: "Genova",
    country: "Italy",
    lat: 44.40, lon: 8.93,
    group: "italy-genoa" as const,
  },
  paperIds: ALL_PUBS.map(p => p.id || ""),
  isShahzad: true,
};

// Sort by total joint papers (desc). When tied, prefer the collaborator with
// more *journal* articles — journals carry more weight than conference papers,
// so this surfaces the most academically substantial collaborations first.
export const coAuthorNodes: CoAuthorNode[] = Array.from(nodeMap.values())
  .sort((a, b) => b.count - a.count || b.journalCount - a.journalCount);

export const networkEdges: NetworkEdge[] = Array.from(edgeMap.values())
  .sort((a, b) => b.weight - a.weight);

// ── Top collaborators ──────────────────────────────────────────────────────

export const topCollaborators = coAuthorNodes.slice(0, 6);

// ── Year bins (journal / conference per year) ──────────────────────────────

const yearMap = new Map<number, YearBin>();
for (const pub of ALL_PUBS) {
  const y = Number(pub.year);
  if (!Number.isFinite(y)) continue;
  if (!yearMap.has(y)) yearMap.set(y, { year: y, journal: 0, conference: 0 });
  const bin = yearMap.get(y)!;
  if (pub.kind === "journal") bin.journal += 1;
  else bin.conference += 1;
}
export const yearBins: YearBin[] = Array.from(yearMap.values()).sort((a, b) => a.year - b.year);

// ── Keyword cloud (titles) ────────────────────────────────────────────────

const STOPWORDS = new Set<string>([
  "a","an","the","of","for","in","on","with","and","or","to","is","are",
  "using","based","by","through","into","from","that","this","its","at",
  "between","as","under","over","new","novel","approach","approaches",
  "study","analysis","model","models","method","methods","technique","techniques",
  "framework","systems","system","via","both","et","al","towards","its",
  "case","cases","across","including","incorporating","integration"
]);

const wordCounts = new Map<string, number>();
const BOOSTS: Record<string, number> = {
  // Surface "topic" words that are spread across many papers
  alzheimer: 3,
  alzheimers: 3,
  graph: 3,
  neural: 2,
  network: 2,
  networks: 2,
  learning: 2,
  machine: 2,
  deep: 2,
  forecasting: 2,
  diabetes: 1,
  detection: 1,
  classification: 2,
  diagnosis: 2,
  prediction: 2,
  data: 1,
  artificial: 1,
  intelligence: 2,
  imaging: 2,
  multimodal: 2,
  microstructural: 2,
  brain: 2,
  cognitive: 2,
  decline: 2,
  cerebrospinal: 1,
  amyloid: 1,
  cardiovascular: 2,
  risk: 1,
  interpretability: 2,
  transparency: 1,
  phishing: 1,
  cryotherapy: 1,
  endodontic: 1,
  endodontics: 1,
  rainfall: 1,
  streamflow: 1,
  wind: 1,
  power: 1,
  socioeconomic: 1,
  crime: 1,
  autism: 1,
  spectrum: 1,
  hybrid: 1,
  svm: 1,
  boosting: 1,
  unimodal: 1,
};

for (const pub of ALL_PUBS) {
  const title = (pub.title || "").toLowerCase().replace(/[^a-z\s'-]/g, " ");
  for (const tokRaw of title.split(/\s+/)) {
    const tok = tokRaw.replace(/^['-]+|['-]+$/g, "");
    if (!tok || tok.length < 3) continue;
    if (STOPWORDS.has(tok)) continue;
    const w = BOOSTS[tok] || 1;
    wordCounts.set(tok, (wordCounts.get(tok) || 0) + w);
  }
}

export const keywordCloud: WordItem[] = Array.from(wordCounts.entries())
  .map(([word, count]) => ({ word, count }))
  .sort((a, b) => b.count - a.count)
  .slice(0, 50);

// ── Stats summary ──────────────────────────────────────────────────────────

export const networkStats = {
  totalPapers: ALL_PUBS.length,
  totalCoAuthors: coAuthorNodes.length,
  countries: new Set(coAuthorNodes.map(n => n.affiliation.country)).size,
  groups: Array.from(new Set(coAuthorNodes.map(n => n.affiliation.group))),
};
