import { useMemo, useState } from "react";
import { coAuthorNodes, SHAHZAD_NODE, type Affiliation } from "../lib/coauthors";

// ────────────────────────────────────────────────────────────────────────────
//  Equirectangular world map  —  catchy edition
//
//   • Higher-resolution stylised continent outlines (~6 KB of path data)
//   • Subtle constellation in the ocean (twinkling stars over water)
//   • Pulsing rings on every collaborator city
//   • Animated particles flow along every arc from Genova outward
//   • Continent labels for context
// ────────────────────────────────────────────────────────────────────────────

const MAP_W = 1100;
const MAP_H = 540;

function proj(lon: number, lat: number): [number, number] {
  const x = ((lon + 180) / 360) * MAP_W;
  const y = ((90 - lat) / 180) * MAP_H;
  return [x, y];
}

const GROUP_COLOR: Record<Affiliation["group"], string> = {
  "italy-genoa":      "#67e8f9",
  "italy-bologna":    "#a5b4fc",
  "uk-sussex":        "#fca5a5",
  "pakistan-lahore":  "#fdba74",
  "pakistan-other":   "#fcd34d",
  "saudi-arabia":     "#6ee7b7",
  "cyprus":           "#f0abfc",
  "other":            "#cbd5e1",
};

// ── Continent outlines (hand-traced, more detail than v1) ──────────────────
//
//   Each entry is an array of (lon, lat) pairs forming a closed polygon.
//   Stylised — not survey-grade — but accurate enough to read as a real
//   world map at a glance.

const CONTINENTS: { name: string; rings: [number, number][][] }[] = [
  {
    name: "Eurasia",
    rings: [[
      [-9, 71], [-2, 69], [5, 64], [12, 60], [22, 58], [30, 60], [40, 64], [55, 67], [68, 70],
      [80, 73], [100, 75], [120, 75], [140, 73], [160, 70], [170, 68], [178, 64],
      [178, 55], [165, 51], [150, 48], [140, 45], [135, 40], [128, 35], [122, 28],
      [118, 22], [110, 18], [108, 13], [106, 10], [104, 6], [101, 2], [98, 7],
      [100, 13], [99, 17], [95, 18], [90, 21], [85, 21], [80, 15], [76, 11],
      [73, 16], [68, 24], [60, 25], [55, 17], [52, 12], [50, 14], [48, 24],
      [44, 30], [38, 31], [34, 34], [28, 36], [22, 38], [16, 41], [12, 38],
      [8, 39], [3, 43], [-3, 35], [-6, 36], [-9, 38], [-9, 44], [-2, 49],
      [4, 51], [8, 55], [12, 57], [14, 60], [11, 63], [4, 64], [-1, 64],
      [-3, 67], [-7, 69], [-9, 71]
    ]]
  },
  {
    name: "Africa",
    rings: [[
      [-17, 21], [-12, 22], [-5, 24], [3, 23], [11, 24], [17, 28], [25, 31], [32, 31],
      [36, 28], [40, 21], [43, 12], [49, 12], [51, 11], [50, 8], [44, 4],
      [42, 0], [42, -3], [40, -8], [40, -15], [40, -22], [36, -25], [33, -28],
      [29, -30], [23, -34], [19, -34], [16, -28], [14, -22], [13, -15], [11, -8],
      [9, 1], [4, 4], [-3, 5], [-9, 5], [-13, 7], [-15, 11], [-16, 14],
      [-17, 18], [-17, 21]
    ]]
  },
  {
    name: "North America",
    rings: [[
      [-168, 67], [-160, 69], [-150, 70], [-140, 71], [-128, 71], [-115, 72],
      [-100, 73], [-85, 75], [-72, 73], [-60, 70], [-55, 60], [-58, 51],
      [-65, 47], [-69, 44], [-72, 40], [-76, 35], [-80, 28], [-82, 24],
      [-86, 22], [-92, 19], [-97, 16], [-103, 18], [-108, 24], [-114, 30],
      [-119, 33], [-122, 37], [-124, 40], [-124, 46], [-126, 49], [-130, 55],
      [-136, 58], [-145, 61], [-153, 60], [-160, 60], [-165, 63], [-168, 67]
    ]]
  },
  {
    name: "South America",
    rings: [[
      [-81, 12], [-76, 11], [-71, 12], [-66, 11], [-60, 9], [-54, 5], [-50, 1],
      [-46, -1], [-40, -5], [-35, -8], [-34, -13], [-37, -22], [-43, -23],
      [-50, -28], [-56, -32], [-60, -36], [-65, -41], [-70, -49], [-73, -54],
      [-71, -55], [-68, -49], [-66, -42], [-67, -32], [-71, -25], [-71, -17],
      [-74, -13], [-78, -8], [-80, -4], [-80, 1], [-79, 5], [-81, 8], [-81, 12]
    ]]
  },
  {
    name: "Australia",
    rings: [[
      [113, -22], [119, -19], [125, -16], [131, -12], [138, -16], [142, -10],
      [144, -12], [146, -19], [150, -22], [153, -27], [152, -33], [149, -37],
      [144, -38], [140, -38], [135, -34], [129, -32], [120, -34], [115, -33],
      [113, -27], [113, -22]
    ]]
  },
  {
    name: "Antarctica",
    rings: [[
      [-180, -65], [-150, -71], [-110, -73], [-70, -71], [-30, -70], [10, -69],
      [50, -68], [90, -67], [130, -66], [160, -67], [178, -68], [178, -90],
      [-180, -90], [-180, -65]
    ]]
  },
  {
    name: "Greenland",
    rings: [[
      [-45, 83], [-30, 84], [-22, 82], [-20, 76], [-25, 70], [-40, 60],
      [-50, 60], [-54, 63], [-53, 69], [-50, 75], [-45, 83]
    ]]
  },
  {
    name: "British Isles",
    rings: [[
      [-10, 58], [-7, 59], [-5, 58], [-2, 56], [1, 54], [2, 52], [-1, 50],
      [-5, 50], [-7, 53], [-9, 55], [-10, 58]
    ]]
  },
  {
    name: "Japan",
    rings: [[
      [128, 33], [131, 31], [134, 33], [139, 35], [141, 38], [143, 41],
      [145, 44], [142, 45], [139, 42], [136, 36], [131, 34], [128, 33]
    ]]
  },
  {
    name: "Madagascar",
    rings: [[
      [43, -12], [47, -13], [50, -16], [50, -22], [47, -25], [44, -24],
      [43, -19], [43, -12]
    ]]
  },
  {
    name: "Italy",
    rings: [[
      [7, 46], [11, 46], [13, 46], [14, 44], [17, 42], [18, 40], [17, 38],
      [15, 38], [13, 38], [11, 42], [9, 44], [7, 46]
    ]]
  },
  {
    name: "Iberia",
    rings: [[
      [-9, 44], [-5, 44], [0, 43], [3, 42], [2, 38], [-3, 36], [-7, 36],
      [-9, 38], [-9, 44]
    ]]
  },
  {
    name: "Sumatra",
    rings: [[
      [95, 5], [101, 3], [104, -2], [105, -5], [102, -5], [98, -3], [95, 2], [95, 5]
    ]]
  },
  {
    name: "Java + Borneo cluster",
    rings: [[
      [105, -6], [115, -8], [120, -10], [115, -3], [112, 0], [115, 4],
      [118, 7], [114, 4], [108, 1], [105, -2], [105, -6]
    ]]
  },
  {
    name: "New Zealand",
    rings: [[
      [165, -41], [170, -41], [175, -44], [178, -47], [175, -47], [170, -45], [165, -41]
    ]]
  },
];

function pathFromRings(rings: [number, number][][]): string {
  return rings.map(ring =>
    ring.map(([lon, lat], i) => {
      const [x, y] = proj(lon, lat);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ") + " Z"
  ).join(" ");
}

// ── Continent labels (centroid approximations) ──────────────────────────────
const CONTINENT_LABELS: { name: string; lon: number; lat: number; size: number }[] = [
  { name: "NORTH AMERICA", lon: -100, lat: 45, size: 11 },
  { name: "SOUTH AMERICA", lon: -60,  lat: -18, size: 10 },
  { name: "EUROPE",        lon: 18,   lat: 53, size: 9 },
  { name: "AFRICA",        lon: 22,   lat: 5, size: 11 },
  { name: "ASIA",          lon: 90,   lat: 50, size: 11 },
  { name: "OCEANIA",       lon: 135,  lat: -28, size: 9 },
];

// ── Stable random number generator for stars (deterministic across renders) ─
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Crude inside-polygon test for the starfield — skips stars that land on
// any continent so the constellation only shows in the ocean.
function pointInRing(x: number, y: number, ring: [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [lon1, lat1] = ring[i];
    const [lon2, lat2] = ring[j];
    const [xi, yi] = proj(lon1, lat1);
    const [xj, yj] = proj(lon2, lat2);
    const intersect = ((yi > y) !== (yj > y)) &&
                      (x < ((xj - xi) * (y - yi)) / (yj - yi + 1e-9) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function isLand(x: number, y: number): boolean {
  for (const c of CONTINENTS) {
    for (const ring of c.rings) {
      if (pointInRing(x, y, ring)) return true;
    }
  }
  return false;
}

interface Star { x: number; y: number; r: number; delay: number; opacity: number; }

function generateStars(count: number, seed: number): Star[] {
  const rnd = mulberry32(seed);
  const stars: Star[] = [];
  let tries = 0;
  while (stars.length < count && tries < count * 8) {
    tries++;
    const x = rnd() * MAP_W;
    const y = rnd() * MAP_H;
    if (isLand(x, y)) continue;
    stars.push({
      x, y,
      r: 0.5 + rnd() * 1.0,
      delay: rnd() * 6,
      opacity: 0.35 + rnd() * 0.5,
    });
  }
  return stars;
}

// ── Aggregate co-authors by city ───────────────────────────────────────────

interface CityMarker {
  key: string;
  city: string;
  country: string;
  group: Affiliation["group"];
  org: string;
  lat: number;
  lon: number;
  people: { display: string; count: number }[];
  totalPapers: number;
}

function aggregate(): CityMarker[] {
  const map = new Map<string, CityMarker>();
  // Don't draw a separate pin for Genova — it's already represented by the
  // origin marker (Shahzad's location). Their labels were overlapping.
  const isOrigin = (lat: number, lon: number) =>
    Math.abs(lat - SHAHZAD_NODE.affiliation.lat) < 0.1 &&
    Math.abs(lon - SHAHZAD_NODE.affiliation.lon) < 0.1;

  for (const n of coAuthorNodes) {
    if (n.affiliation.lat === 0 && n.affiliation.lon === 0) continue;
    if (isOrigin(n.affiliation.lat, n.affiliation.lon)) continue;
    const key = `${n.affiliation.city}|${n.affiliation.country}`;
    if (!map.has(key)) {
      map.set(key, {
        key,
        city: n.affiliation.city,
        country: n.affiliation.country,
        group: n.affiliation.group,
        org: n.affiliation.org,
        lat: n.affiliation.lat,
        lon: n.affiliation.lon,
        people: [],
        totalPapers: 0,
      });
    }
    const m = map.get(key)!;
    m.people.push({ display: n.display, count: n.count });
    m.totalPapers += n.count;
  }
  return Array.from(map.values()).sort((a, b) => b.totalPapers - a.totalPapers);
}

export default function CollaborationMap() {
  const cities = useMemo(aggregate, []);
  const stars = useMemo(() => generateStars(160, 137), []);
  const [hovered, setHovered] = useState<CityMarker | null>(null);

  const [originX, originY] = proj(SHAHZAD_NODE.affiliation.lon, SHAHZAD_NODE.affiliation.lat);

  // Pre-compute each arc as a quadratic Bezier; we'll attach an <animateMotion>
  // to a small particle traveling along that same path.
  const arcs = cities.map(c => {
    const [x, y] = proj(c.lon, c.lat);
    const dx = x - originX;
    const dy = y - originY;
    const dist = Math.hypot(dx, dy);
    const mx = (originX + x) / 2;
    const my = (originY + y) / 2 - Math.min(180, dist * 0.45);
    return {
      city: c,
      d: `M${originX.toFixed(1)},${originY.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}`,
      destX: x,
      destY: y,
      dist,
    };
  });

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 50% 40%, #0a1f3a 0%, #040b18 70%, #02060e 100%)",
        border: "1px solid rgba(100,116,139,.25)",
        boxShadow: "0 8px 40px rgba(0,0,0,.45)",
      }}
    >
      <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} width="100%" height="auto" style={{ display: "block" }}>
        <defs>
          <radialGradient id="oceanGlow" cx="50%" cy="40%" r="60%">
            <stop offset="0%"  stopColor="rgba(6,182,212,.06)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
          <radialGradient id="originGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(6,182,212,.6)" />
            <stop offset="100%" stopColor="rgba(6,182,212,0)" />
          </radialGradient>
          {/* Arc fade gradient — fade in from origin, full bright in the middle, fade out at destination */}
          <linearGradient id="arcFade" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="rgba(6,182,212,.05)" />
            <stop offset="50%"  stopColor="rgba(6,182,212,.55)" />
            <stop offset="100%" stopColor="rgba(6,182,212,.95)" />
          </linearGradient>
        </defs>

        {/* Ocean glow */}
        <rect width={MAP_W} height={MAP_H} fill="url(#oceanGlow)" />

        {/* ── Constellation in the ocean ───────────────────────────────── */}
        <g>
          {stars.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#cbd5e1" opacity={s.opacity}>
              <animate
                attributeName="opacity"
                values={`${s.opacity};${s.opacity * 0.25};${s.opacity}`}
                dur={`${4 + (i % 5)}s`}
                begin={`${s.delay}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </g>

        {/* ── Subtle grid ──────────────────────────────────────────────── */}
        <g opacity={0.06}>
          {[-60, -30, 0, 30, 60].map(lat => {
            const [, y] = proj(0, lat);
            return <line key={lat} x1={0} y1={y} x2={MAP_W} y2={y} stroke="#94a3b8" strokeWidth={0.5} />;
          })}
          {[-120, -60, 0, 60, 120].map(lon => {
            const [x] = proj(lon, 0);
            return <line key={lon} x1={x} y1={0} x2={x} y2={MAP_H} stroke="#94a3b8" strokeWidth={0.5} />;
          })}
        </g>

        {/* ── Continents ──────────────────────────────────────────────── */}
        <g>
          {CONTINENTS.map((c, i) => (
            <path
              key={i}
              d={pathFromRings(c.rings)}
              fill="rgba(30,41,59,.7)"
              stroke="rgba(100,116,139,.45)"
              strokeWidth={0.7}
              strokeLinejoin="round"
            />
          ))}
        </g>

        {/* ── Continent labels ──────────────────────────────────────── */}
        <g>
          {CONTINENT_LABELS.map((l, i) => {
            const [x, y] = proj(l.lon, l.lat);
            return (
              <text
                key={i}
                x={x}
                y={y}
                textAnchor="middle"
                fontSize={l.size}
                fontWeight={700}
                letterSpacing="3"
                fill="rgba(148,163,184,.22)"
              >
                {l.name}
              </text>
            );
          })}
        </g>

        {/* ── Arcs (static path, then a flowing particle per arc) ────── */}
        <g>
          {arcs.map((a, i) => {
            const isActive = hovered?.key === a.city.key;
            const dim = hovered && !isActive;
            const baseWeight = 0.6 + Math.min(a.city.totalPapers * 0.22, 1.8);
            // Slower, calmer flow — particles cruise rather than race
            const animDur = Math.max(6, Math.min(a.dist / 70, 12));
            const particleDelay = (i * 0.72) % animDur;
            return (
              <g key={a.city.key} style={{ transition: "opacity .2s ease", opacity: dim ? 0.18 : 1 }}>
                <path
                  id={`arc-${i}`}
                  d={a.d}
                  fill="none"
                  stroke="url(#arcFade)"
                  strokeWidth={isActive ? 2.4 : baseWeight}
                  strokeLinecap="round"
                  opacity={isActive ? 1 : 0.85}
                  style={{ transition: "stroke-width .2s ease, opacity .2s ease" }}
                />
                {/* Flowing particle */}
                <circle
                  r={isActive ? 3.5 : 2.4}
                  fill="#a5f3fc"
                  style={{ filter: "drop-shadow(0 0 6px rgba(167,243,252,.95))" }}
                >
                  <animateMotion
                    dur={`${animDur}s`}
                    repeatCount="indefinite"
                    rotate="auto"
                    begin={`${-particleDelay}s`}
                  >
                    <mpath href={`#arc-${i}`} />
                  </animateMotion>
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    keyTimes="0;0.2;0.8;1"
                    dur={`${animDur}s`}
                    repeatCount="indefinite"
                    begin={`${-particleDelay}s`}
                  />
                </circle>
              </g>
            );
          })}
        </g>

        {/* ── Origin (Genova) ────────────────────────────────────────── */}
        <g>
          <circle cx={originX} cy={originY} r={36} fill="url(#originGlow)" opacity={0.6} />
          <circle cx={originX} cy={originY} r={10} fill="none" stroke="#06b6d4" strokeWidth={1.5}>
            <animate attributeName="r" values="10;30;10" dur="3.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.95;0;0.95" dur="3.2s" repeatCount="indefinite" />
          </circle>
          <circle cx={originX} cy={originY} r={18} fill="none" stroke="#67e8f9" strokeWidth={1}>
            <animate attributeName="r" values="18;36;18" dur="3.2s" begin="1s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.7;0;0.7" dur="3.2s" begin="1s" repeatCount="indefinite" />
          </circle>
          <circle cx={originX} cy={originY} r={7} fill="#06b6d4" stroke="#a5f3fc" strokeWidth={2} />
          <text
            x={originX + 12}
            y={originY + 5}
            fill="#f1f5f9"
            fontSize={12}
            fontWeight={800}
            style={{ textShadow: "0 1px 4px rgba(0,0,0,.95)", letterSpacing: ".02em" }}
          >
            Genova · Shahzad
          </text>
        </g>

        {/* ── City markers ───────────────────────────────────────────── */}
        <g>
          {cities.map((c, i) => {
            const [x, y] = proj(c.lon, c.lat);
            const r = 3.5 + Math.min(c.totalPapers * 0.8, 8);
            const color = GROUP_COLOR[c.group];
            const isActive = hovered?.key === c.key;
            const dim = hovered && !isActive;
            const pulseDur = 2.4 + (i % 4) * 0.35;
            const pulseDelay = (i * 0.41) % pulseDur;
            return (
              <g
                key={c.key}
                onPointerEnter={() => setHovered(c)}
                onPointerLeave={() => setHovered(null)}
                style={{ cursor: "pointer", opacity: dim ? 0.35 : 1, transition: "opacity .2s ease" }}
              >
                {/* Pulse rings */}
                <circle cx={x} cy={y} r={r + 4} fill="none" stroke={color} strokeWidth={1.2} opacity={0.6}>
                  <animate
                    attributeName="r"
                    values={`${r + 4};${r + 22};${r + 4}`}
                    dur={`${pulseDur}s`}
                    begin={`${pulseDelay}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.6;0;0.6"
                    dur={`${pulseDur}s`}
                    begin={`${pulseDelay}s`}
                    repeatCount="indefinite"
                  />
                </circle>
                <circle cx={x} cy={y} r={r + 2} fill="none" stroke={color} strokeWidth={1} opacity={0.4}>
                  <animate
                    attributeName="r"
                    values={`${r + 2};${r + 12};${r + 2}`}
                    dur={`${pulseDur}s`}
                    begin={`${pulseDelay + 0.6}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.7;0;0.7"
                    dur={`${pulseDur}s`}
                    begin={`${pulseDelay + 0.6}s`}
                    repeatCount="indefinite"
                  />
                </circle>
                {/* Solid pin */}
                <circle
                  cx={x} cy={y}
                  r={r}
                  fill={color}
                  stroke="#040b18"
                  strokeWidth={1.5}
                  style={{ filter: isActive ? `drop-shadow(0 0 12px ${color})` : `drop-shadow(0 0 5px ${color}88)` }}
                />
                {(c.totalPapers >= 2 || isActive) && (
                  <text
                    x={x + r + 5}
                    y={y + 3.5}
                    fill={color}
                    fontSize={10.5}
                    fontWeight={700}
                    style={{
                      textShadow: "0 1px 4px rgba(0,0,0,.95)",
                      pointerEvents: "none",
                      letterSpacing: ".01em",
                    }}
                  >
                    {c.city}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Hover panel */}
      {hovered && (
        <div
          className="absolute top-3 right-3 px-4 py-3 rounded-lg max-w-[280px]"
          style={{
            background: "rgba(4,8,18,.94)",
            border: `1px solid ${GROUP_COLOR[hovered.group]}`,
            color: "#f1f5f9",
            backdropFilter: "blur(8px)",
            boxShadow: `0 8px 30px ${GROUP_COLOR[hovered.group]}40`,
          }}
        >
          <p className="text-sm font-bold mb-0.5">{hovered.city}, {hovered.country}</p>
          <p className="text-[11px] mb-2" style={{ color: "rgba(203,213,225,.7)" }}>{hovered.org}</p>
          <p className="text-[11px] mb-2" style={{ color: "#67e8f9" }}>
            {hovered.totalPapers} co-author appearance{hovered.totalPapers === 1 ? "" : "s"} across {hovered.people.length} collaborator{hovered.people.length === 1 ? "" : "s"}
          </p>
          <div className="space-y-0.5">
            {hovered.people.map((p, i) => (
              <p key={i} className="text-[10px]" style={{ color: "rgba(203,213,225,.65)" }}>
                · {p.display} ({p.count})
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-3 left-3 px-3 py-2 rounded-lg flex flex-col gap-1"
        style={{ background: "rgba(4,8,18,.7)", border: "1px solid rgba(100,116,139,.25)", backdropFilter: "blur(6px)" }}>
        <p className="text-[10px]" style={{ color: "rgba(203,213,225,.85)" }}>
          {cities.length} cities · {new Set(cities.map(c => c.country)).size} countries
        </p>
        <p className="text-[10px]" style={{ color: "rgba(148,163,184,.6)" }}>
          Particles flow from Genova outward, one per collaborating city.
        </p>
      </div>
    </div>
  );
}
