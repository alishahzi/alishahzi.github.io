import { useMemo, useState } from "react";
import { keywordCloud } from "../lib/coauthors";

// Archimedean spiral packing — places each word so it doesn't overlap any
// previously placed word's axis-aligned bounding box. Largest words go first
// at the centre, smaller words spiral outward.

const W = 880;
const H = 380;

interface Placed {
  word: string;
  count: number;
  fontSize: number;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  rotation: number;
}

// A cyan/indigo/teal/violet palette that matches our dark theme
const PALETTE = ["#67e8f9", "#22d3ee", "#a5f3fc", "#a5b4fc", "#c4b5fd", "#6ee7b7", "#5eead4"];

function approxTextBox(word: string, fontSize: number): { w: number; h: number } {
  // Rough estimate, good enough for collision packing
  const w = word.length * fontSize * 0.58 + 6;
  const h = fontSize * 1.08;
  return { w, h };
}

function overlaps(a: Placed, b: { x: number; y: number; w: number; h: number }): boolean {
  return !(a.x + a.w / 2 < b.x - b.w / 2 ||
           a.x - a.w / 2 > b.x + b.w / 2 ||
           a.y + a.h / 2 < b.y - b.h / 2 ||
           a.y - a.h / 2 > b.y + b.h / 2);
}

function pack(words: { word: string; count: number }[]): Placed[] {
  if (!words.length) return [];
  const maxCount = words[0].count;
  const minCount = words[words.length - 1].count;
  const placed: Placed[] = [];

  for (let i = 0; i < words.length; i++) {
    const { word, count } = words[i];
    // Font size mapped from count to range; clamped
    const t = maxCount === minCount ? 0.5 : (count - minCount) / (maxCount - minCount);
    const fontSize = Math.round(13 + Math.pow(t, 0.85) * 36);  // 13..49
    const { w, h } = approxTextBox(word, fontSize);

    // Spiral search for a non-overlapping spot
    const cx = W / 2, cy = H / 2;
    let step = 0;
    let placedOk = false;
    let x = cx, y = cy;
    while (step < 4000) {
      const radius = 0.6 * step * 0.6;
      const angle = step * 0.6;
      x = cx + radius * Math.cos(angle);
      y = cy + radius * Math.sin(angle);

      // keep inside viewbox with margin
      if (x - w / 2 < 6 || x + w / 2 > W - 6 || y - h / 2 < 6 || y + h / 2 > H - 6) {
        step++;
        continue;
      }
      const candidate = { x, y, w, h };
      if (!placed.some(p => overlaps(p, candidate))) {
        placedOk = true;
        break;
      }
      step++;
    }
    if (!placedOk) continue;

    placed.push({
      word,
      count,
      fontSize,
      x, y, w, h,
      color: PALETTE[i % PALETTE.length],
      rotation: 0,  // horizontal only — easier to read
    });
  }
  return placed;
}

export default function KeywordCloud() {
  const placed = useMemo(() => pack(keywordCloud), []);
  const [hovered, setHovered] = useState<Placed | null>(null);

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(145deg,#040b18,#0a1428)",
        border: "1px solid rgba(100,116,139,.25)",
        boxShadow: "0 6px 30px rgba(0,0,0,.35)",
      }}
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="auto" style={{ display: "block" }}>
        {/* subtle radial vignette */}
        <defs>
          <radialGradient id="kc-vignette" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="rgba(6,182,212,.04)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill="url(#kc-vignette)" />

        {placed.map((p) => {
          const isHover = hovered?.word === p.word;
          return (
            <g
              key={p.word}
              transform={`translate(${p.x},${p.y}) rotate(${p.rotation})`}
              style={{ cursor: "pointer" }}
              onPointerEnter={() => setHovered(p)}
              onPointerLeave={() => setHovered(null)}
            >
              <text
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={p.fontSize}
                fontWeight={Math.min(800, 400 + Math.round(p.fontSize * 8))}
                fill={p.color}
                style={{
                  letterSpacing: "-0.02em",
                  fontFamily: "Space Grotesk, Inter, -apple-system, BlinkMacSystemFont, sans-serif",
                  transition: "opacity .15s ease, filter .15s ease",
                  opacity: hovered && !isHover ? 0.25 : 1,
                  filter: isHover ? `drop-shadow(0 0 14px ${p.color})` : `drop-shadow(0 1px 6px rgba(0,0,0,.6))`,
                }}
              >
                {p.word}
              </text>
            </g>
          );
        })}
      </svg>

      {hovered && (
        <div
          className="absolute top-3 right-3 px-3 py-2 rounded-lg"
          style={{
            background: "rgba(4,8,18,.92)",
            border: `1px solid ${hovered.color}`,
            color: "#f1f5f9",
            backdropFilter: "blur(6px)",
          }}
        >
          <p className="text-sm font-bold" style={{ color: hovered.color }}>{hovered.word}</p>
          <p className="text-[11px]" style={{ color: "rgba(203,213,225,.7)" }}>
            appears {hovered.count}× across publication titles
          </p>
        </div>
      )}

      <div className="absolute bottom-3 left-3 px-3 py-2 rounded-lg"
        style={{ background: "rgba(4,8,18,.7)", border: "1px solid rgba(100,116,139,.25)", backdropFilter: "blur(6px)" }}>
        <p className="text-[10px]" style={{ color: "rgba(203,213,225,.75)" }}>
          {placed.length} keywords from {keywordCloud.length} surface topics
        </p>
      </div>
    </div>
  );
}
