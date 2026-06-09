import { useMemo, useState } from "react";
import { coAuthorNodes, SHAHZAD_NODE, type Affiliation } from "../lib/coauthors";

// ────────────────────────────────────────────────────────────────────────────
//  Equirectangular world map
//
//  Continent outlines are a deliberately stylised low-poly SVG path approximation
//  — accurate enough to feel like a real world map, ~3 KB of path data instead
//  of ~50 KB of TopoJSON. Coordinates use longitude (-180..180) → x (0..360)
//  and latitude (-90..90) → y (180..0). Then we scale onto the viewBox.
// ────────────────────────────────────────────────────────────────────────────

const MAP_W = 1000;
const MAP_H = 500;

function proj(lon: number, lat: number): [number, number] {
  // equirectangular
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
  "other":            "#cbd5e1",
};

// — Continent outlines (stylised) ───────────────────────────────────────────
// These are hand-crafted low-poly approximations.
// Source coordinates traced in lon/lat then projected via proj() at runtime.
//
// Each entry: array of (lon, lat) pairs forming a closed polygon.
//
const CONTINENTS: { name: string; rings: [number, number][][] }[] = [
  {
    name: "Eurasia",
    rings: [[
      [-9, 71], [10, 71], [33, 70], [55, 73], [80, 73], [110, 73], [140, 73], [165, 70],
      [178, 65], [178, 55], [165, 48], [155, 43], [140, 45], [128, 39], [123, 33],
      [115, 22], [110, 18], [105, 10], [101, 2], [99, 6], [101, 14], [100, 21],
      [96, 16], [90, 22], [88, 21], [80, 8], [77, 8], [73, 17], [68, 23],
      [60, 25], [52, 12], [50, 13], [48, 28], [44, 30], [36, 30], [34, 36],
      [28, 36], [20, 39], [12, 38], [9, 43], [3, 43], [-3, 36], [-9, 38],
      [-9, 44], [-2, 50], [4, 51], [8, 56], [12, 58], [4, 60], [-1, 62],
      [-6, 60], [-7, 63], [-9, 71]
    ]]
  },
  {
    name: "Africa",
    rings: [[
      [-17, 21], [-10, 27], [-1, 35], [10, 35], [22, 32], [33, 32], [36, 25],
      [43, 12], [51, 12], [50, 5], [40, -1], [40, -10], [40, -22], [33, -27],
      [25, -34], [20, -34], [16, -28], [13, -20], [10, -7], [9, 4],
      [3, 4], [-7, 4], [-14, 11], [-17, 16], [-17, 21]
    ]]
  },
  {
    name: "North America",
    rings: [[
      [-168, 67], [-150, 70], [-135, 70], [-115, 72], [-95, 76], [-80, 75],
      [-65, 70], [-55, 51], [-65, 44], [-76, 35], [-82, 24], [-80, 22],
      [-90, 18], [-98, 15], [-105, 23], [-114, 30], [-120, 34], [-124, 40],
      [-126, 49], [-132, 56], [-138, 59], [-148, 60], [-160, 60], [-168, 67]
    ]]
  },
  {
    name: "South America",
    rings: [[
      [-81, 12], [-74, 12], [-62, 9], [-56, 5], [-50, -1], [-38, -7],
      [-37, -22], [-43, -23], [-58, -34], [-70, -53], [-73, -55], [-72, -42],
      [-77, -22], [-77, -15], [-81, -6], [-80, 0], [-81, 12]
    ]]
  },
  {
    name: "Australia",
    rings: [[
      [113, -22], [123, -17], [131, -12], [138, -16], [146, -19], [153, -25],
      [152, -34], [144, -38], [135, -37], [122, -34], [115, -34], [113, -27], [113, -22]
    ]]
  },
  {
    name: "British Isles",
    rings: [[
      [-10, 58], [-5, 58], [-2, 56], [2, 53], [0, 50], [-6, 50], [-10, 53], [-10, 58]
    ]]
  },
  {
    name: "Japan",
    rings: [[
      [128, 33], [133, 34], [140, 36], [142, 40], [145, 43], [140, 45], [134, 35], [128, 33]
    ]]
  },
  {
    name: "Madagascar",
    rings: [[
      [43, -12], [50, -16], [50, -22], [45, -25], [43, -22], [43, -12]
    ]]
  },
  {
    name: "Italy boot",
    rings: [[
      [8, 46], [13, 46], [18, 43], [17, 39], [15, 38], [13, 39], [11, 42], [8, 44], [8, 46]
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

// — Aggregate co-authors by city ────────────────────────────────────────────

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
  for (const n of coAuthorNodes) {
    if (n.affiliation.lat === 0 && n.affiliation.lon === 0) continue;  // skip "Other"
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
  const [hovered, setHovered] = useState<CityMarker | null>(null);

  const [originX, originY] = proj(SHAHZAD_NODE.affiliation.lon, SHAHZAD_NODE.affiliation.lat);

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(145deg,#040b18,#0a1428)",
        border: "1px solid rgba(100,116,139,.25)",
        boxShadow: "0 6px 30px rgba(0,0,0,.35)",
      }}
    >
      <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} width="100%" height="auto" style={{ display: "block" }}>
        {/* subtle grid */}
        <g opacity={0.08}>
          {[-60, -30, 0, 30, 60].map(lat => {
            const [, y] = proj(0, lat);
            return <line key={lat} x1={0} y1={y} x2={MAP_W} y2={y} stroke="#94a3b8" strokeWidth={0.5} />;
          })}
          {[-120, -60, 0, 60, 120].map(lon => {
            const [x] = proj(lon, 0);
            return <line key={lon} x1={x} y1={0} x2={x} y2={MAP_H} stroke="#94a3b8" strokeWidth={0.5} />;
          })}
        </g>

        {/* continents */}
        <g>
          {CONTINENTS.map((c, i) => (
            <path
              key={i}
              d={pathFromRings(c.rings)}
              fill="rgba(30,41,59,.6)"
              stroke="rgba(100,116,139,.4)"
              strokeWidth={0.7}
            />
          ))}
        </g>

        {/* arcs from Genova to every city */}
        <g>
          {cities.map(c => {
            const [x, y] = proj(c.lon, c.lat);
            const mx = (originX + x) / 2;
            const my = (originY + y) / 2 - Math.min(120, Math.abs(originX - x) * 0.4);
            const isActive = hovered?.key === c.key;
            return (
              <path
                key={c.key}
                d={`M${originX},${originY} Q${mx},${my} ${x},${y}`}
                fill="none"
                stroke={isActive ? "#67e8f9" : "rgba(6,182,212,.45)"}
                strokeWidth={isActive ? 2 : 0.8 + Math.min(c.totalPapers * 0.18, 1.6)}
                opacity={hovered && !isActive ? 0.15 : 0.85}
                style={{ transition: "opacity .2s ease, stroke .2s ease, stroke-width .2s ease" }}
              />
            );
          })}
        </g>

        {/* origin (Genova) */}
        <g>
          <circle cx={originX} cy={originY} r={10} fill="none" stroke="#06b6d4" strokeWidth={1} opacity={0.4}>
            <animate attributeName="r" values="10;22;10" dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0;0.6" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx={originX} cy={originY} r={6} fill="#06b6d4" stroke="#a5f3fc" strokeWidth={1.5} />
          <text
            x={originX + 10}
            y={originY + 4}
            fill="#f1f5f9"
            fontSize={11}
            fontWeight={700}
            style={{ textShadow: "0 1px 4px rgba(0,0,0,.95)" }}
          >
            Genova · Shahzad
          </text>
        </g>

        {/* city markers */}
        <g>
          {cities.map(c => {
            const [x, y] = proj(c.lon, c.lat);
            const r = 3.5 + Math.min(c.totalPapers * 0.7, 8);
            const color = GROUP_COLOR[c.group];
            const isActive = hovered?.key === c.key;
            return (
              <g
                key={c.key}
                onPointerEnter={() => setHovered(c)}
                onPointerLeave={() => setHovered(null)}
                style={{ cursor: "pointer" }}
              >
                <circle
                  cx={x} cy={y}
                  r={r + 4}
                  fill="none"
                  stroke={color}
                  strokeWidth={1}
                  opacity={isActive ? 0.85 : 0.35}
                />
                <circle
                  cx={x} cy={y}
                  r={r}
                  fill={color}
                  stroke="#0a1428"
                  strokeWidth={1.5}
                  style={{ filter: isActive ? `drop-shadow(0 0 8px ${color})` : "none" }}
                />
                {(c.totalPapers >= 3 || isActive) && (
                  <text
                    x={x + r + 4}
                    y={y + 3}
                    fill={color}
                    fontSize={10}
                    fontWeight={600}
                    style={{ textShadow: "0 1px 3px rgba(0,0,0,.95)", pointerEvents: "none" }}
                  >
                    {c.city}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* hover panel */}
      {hovered && (
        <div
          className="absolute top-3 right-3 px-4 py-3 rounded-lg max-w-[280px]"
          style={{
            background: "rgba(4,8,18,.94)",
            border: `1px solid ${GROUP_COLOR[hovered.group]}`,
            color: "#f1f5f9",
            backdropFilter: "blur(8px)",
          }}
        >
          <p className="text-sm font-bold mb-0.5">{hovered.city}, {hovered.country}</p>
          <p className="text-[11px] mb-2" style={{ color: "rgba(203,213,225,.7)" }}>{hovered.org}</p>
          <p className="text-[11px] mb-2" style={{ color: "#67e8f9" }}>
            {hovered.totalPapers} co-author appearance{hovered.totalPapers === 1 ? "" : "s"} across {hovered.people.length} collaborator{hovered.people.length === 1 ? "" : "s"}
          </p>
          <div className="space-y-0.5">
            {hovered.people.map((p, i) => (
              <p key={i} className="text-[10px]" style={{ color: "rgba(203,213,225,.6)" }}>
                · {p.display} ({p.count})
              </p>
            ))}
          </div>
        </div>
      )}

      {/* legend */}
      <div className="absolute bottom-3 left-3 px-3 py-2 rounded-lg"
        style={{ background: "rgba(4,8,18,.7)", border: "1px solid rgba(100,116,139,.25)", backdropFilter: "blur(6px)" }}>
        <p className="text-[10px]" style={{ color: "rgba(203,213,225,.75)" }}>
          {cities.length} collaborating cities across {new Set(cities.map(c => c.country)).size} countries
        </p>
      </div>
    </div>
  );
}
