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
  group: "italy-genoa" | "italy-bologna" | "uk-sussex" | "pakistan-lahore" |
         "pakistan-other" | "saudi-arabia" | "other";
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
  gandoglia:    { org: "IRCCS San Martino · UniGe",           city: "Genova", country: "Italy",  lat: 44.40, lon:  8.93, group: "italy-genoa" },

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
  aslam:        { org: "COMSATS / Cyprus International University", city: "Lahore / Nicosia", country: "Pakistan / Cyprus", lat: 31.58, lon: 74.34, group: "pakistan-lahore" },
  kiran:        { org: "COMSATS Lahore",                      city: "Lahore", country: "Pakistan", lat: 31.58, lon: 74.34, group: "pakistan-lahore" },
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

function lookupAffiliation(displayName: string): Affiliation {
  const lower = displayName.toLowerCase();
  // Try matching by surname (first word in displayName) or full lowercased string
  const tokens = lower.split(/\s+/);
  for (const t of tokens) {
    if (AFFILIATIONS[t]) return AFFILIATIONS[t];
  }
  // Try two-word surnames like "cotta ramusino" / "ur rehman khan"
  if (tokens.length >= 2) {
    const last2 = tokens.slice(-2).join(" ");
    if (AFFILIATIONS[last2]) return AFFILIATIONS[last2];
    const first2 = tokens.slice(0, 2).join(" ");
    if (AFFILIATIONS[first2]) return AFFILIATIONS[first2];
  }
  if (tokens.length >= 3) {
    const last3 = tokens.slice(-3).join(" ");
    if (AFFILIATIONS[last3]) return AFFILIATIONS[last3];
  }
  return DEFAULT_AFFILIATION;
}

function canonicalDisplay(raw: string): string {
  // Convert "Shahbaz M" → "M. Shahbaz" stays as is for readability
  // Convert "Shahbaz, Muhammad" → "Muhammad Shahbaz"
  const parts = raw.split(/,/).map(s => s.trim()).filter(Boolean);
  if (parts.length === 2 && parts[1].length > 2 && parts[0].length > 2) {
    // "Surname, Forename(s)" → "Forename Surname"
    return `${parts[1]} ${parts[0]}`.replace(/\s+/g, " ").trim();
  }
  return raw;
}

function authorKey(displayName: string): string {
  // Match by last surname token, lowercase, plus initial of first token if available
  const norm = displayName.toLowerCase().replace(/[^a-z\s]/g, "").trim();
  const toks = norm.split(/\s+/);
  if (toks.length === 0) return norm;
  // The last token is usually the surname for "Forename Surname" forms
  const surname = toks[toks.length - 1];
  const firstInitial = toks[0]?.[0] || "";
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
  count: number;
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
  for (const raw of names) {
    if (isShahzad(raw)) continue;
    const display = canonicalDisplay(raw);
    const key = authorKey(display);
    if (!nodeMap.has(key)) {
      nodeMap.set(key, {
        id: key,
        display,
        count: 0,
        affiliation: lookupAffiliation(display),
        paperIds: [],
      });
    }
    const node = nodeMap.get(key)!;
    node.count += 1;
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

export const coAuthorNodes: CoAuthorNode[] = Array.from(nodeMap.values())
  .sort((a, b) => b.count - a.count);

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
