import { useEffect, useMemo, useState } from "react";
import { personal } from "../data/content";

interface ScholarData {
  citations: number;
  citations_5y?: number;
  h_index: number;
  h_index_5y?: number;
  i10_index: number;
  i10_index_5y?: number;
  cites_per_year: Record<string, number>;
  last_updated: string;
}

export default function ScholarMetrics() {
  const [data, setData] = useState<ScholarData | null>(null);
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}scholar-metrics.json`)
      .then(r => (r.ok ? r.json() : null))
      .then(setData)
      .catch(() => setData(null));
  }, []);

  // Hide entirely if either the file is missing or the citations are still 0
  // (placeholder JSON before the first workflow run).
  if (!data || data.citations <= 0) return null;

  return (
    <div className="mb-14">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <h3 className="text-xl font-black text-white" style={{ letterSpacing: "-0.01em" }}>
          Citation Metrics
        </h3>
        <a
          href={personal.scholar}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-semibold inline-flex items-center gap-1 px-3 py-1 rounded-full transition-all hover:brightness-125"
          style={{
            background: "rgba(6,182,212,.1)",
            border: "1px solid rgba(6,182,212,.35)",
            color: "#06b6d4",
          }}
        >
          Open Google Scholar profile ↗
        </a>
      </div>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-5">
        <StatCard label="Citations" value={data.citations} sub={data.citations_5y ? `${data.citations_5y} in last 5 years` : undefined} color="#06b6d4" />
        <StatCard label="h-index"   value={data.h_index}   sub={data.h_index_5y ? `${data.h_index_5y} in last 5 years` : undefined} color="#a5b4fc" />
        <StatCard label="i10-index" value={data.i10_index} sub={data.i10_index_5y ? `${data.i10_index_5y} in last 5 years` : undefined} color="#fcd34d" />
      </div>

      {/* Cites-per-year bar chart */}
      <CitesPerYearChart data={data.cites_per_year} />

      <p className="text-[10px] mt-3 text-right" style={{ color: "rgba(148,163,184,.55)" }}>
        Auto-updated daily from Google Scholar · last refresh:{" "}
        {new Date(data.last_updated).toLocaleDateString(undefined, {
          year: "numeric", month: "short", day: "numeric",
        })}
      </p>
    </div>
  );
}

function StatCard({ label, value, sub, color }: { label: string; value: number; sub?: string; color: string }) {
  return (
    <div
      className="rounded-2xl p-5 text-center transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: "rgba(12,20,38,.7)",
        border: `1px solid ${color}33`,
        boxShadow: "0 4px 24px rgba(0,0,0,.3)",
      }}
    >
      <div className="text-3xl font-black mb-1" style={{ color, letterSpacing: "-0.03em" }}>
        {value}
      </div>
      <p className="text-xs font-semibold mb-1" style={{ color: "rgba(241,245,249,.85)" }}>
        {label}
      </p>
      {sub && (
        <p className="text-[10px]" style={{ color: "rgba(148,163,184,.7)" }}>
          {sub}
        </p>
      )}
    </div>
  );
}

const W = 880;
const H = 220;
const PAD_L = 40;
const PAD_R = 16;
const PAD_T = 16;
const PAD_B = 34;

function CitesPerYearChart({ data }: { data: Record<string, number> }) {
  const bins = useMemo(() => {
    const entries = Object.entries(data)
      .map(([y, c]) => ({ year: Number(y), count: c }))
      .filter(b => Number.isFinite(b.year))
      .sort((a, b) => a.year - b.year);
    return entries;
  }, [data]);

  const [hovered, setHovered] = useState<number | null>(null);

  if (bins.length === 0) return null;

  const maxC = Math.max(...bins.map(b => b.count), 1);
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;
  const slot = plotW / bins.length;
  const barW = Math.min(slot * 0.66, 56);
  const yScale = (n: number) => PAD_T + plotH - (n / maxC) * plotH;
  const tickStep = Math.max(1, Math.ceil(maxC / 5));
  const yTicks = Array.from({ length: Math.ceil(maxC / tickStep) + 1 }, (_, i) => i * tickStep);

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(145deg,#040b18,#0a1428)",
        border: "1px solid rgba(100,116,139,.25)",
      }}
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="auto" style={{ display: "block" }}>
        {/* gridlines */}
        <g>
          {yTicks.map(t => {
            const y = yScale(t);
            return (
              <g key={t}>
                <line x1={PAD_L} y1={y} x2={W - PAD_R} y2={y} stroke="rgba(148,163,184,.1)" strokeWidth={0.6} />
                <text x={PAD_L - 6} y={y + 4} textAnchor="end" fill="rgba(148,163,184,.6)" fontSize={9}>{t}</text>
              </g>
            );
          })}
        </g>
        {/* bars */}
        <g>
          {bins.map((b, i) => {
            const cx = PAD_L + slot * (i + 0.5);
            const bh = (b.count / maxC) * plotH;
            const by = yScale(b.count);
            const isActive = hovered === b.year;
            const dim = hovered !== null && !isActive;
            return (
              <g
                key={b.year}
                onPointerEnter={() => setHovered(b.year)}
                onPointerLeave={() => setHovered(null)}
                style={{ cursor: "pointer", transition: "opacity .15s ease" }}
                opacity={dim ? 0.35 : 1}
              >
                <rect
                  x={cx - barW / 2}
                  y={by}
                  width={barW}
                  height={bh}
                  rx={3}
                  fill="#06b6d4"
                  style={{ filter: isActive ? "drop-shadow(0 0 10px rgba(6,182,212,.6))" : "none" }}
                />
                <text
                  x={cx}
                  y={by - 5}
                  textAnchor="middle"
                  fill="rgba(241,245,249,.85)"
                  fontSize={10}
                  fontWeight={700}
                  style={{ textShadow: "0 1px 4px rgba(0,0,0,.9)" }}
                >
                  {b.count}
                </text>
                <text
                  x={cx}
                  y={H - PAD_B + 16}
                  textAnchor="middle"
                  fill={isActive ? "#67e8f9" : "rgba(148,163,184,.85)"}
                  fontSize={10}
                  fontWeight={isActive ? 700 : 500}
                >
                  {b.year}
                </text>
              </g>
            );
          })}
        </g>
        <line x1={PAD_L} y1={H - PAD_B} x2={W - PAD_R} y2={H - PAD_B} stroke="rgba(148,163,184,.35)" strokeWidth={1} />
      </svg>

      <div
        className="absolute bottom-2 left-3 px-2 py-1 rounded-md"
        style={{ background: "rgba(4,8,18,.6)", border: "1px solid rgba(100,116,139,.2)" }}
      >
        <p className="text-[10px]" style={{ color: "rgba(203,213,225,.7)" }}>
          Citations per year
        </p>
      </div>
    </div>
  );
}
