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

  if (!data || data.citations <= 0) return null;

  const lastUpdated = new Date(data.last_updated);
  const lastUpdatedStr = lastUpdated.toLocaleDateString(undefined, {
    year: "numeric", month: "short", day: "numeric",
  });

  return (
    <div className="mb-14">
      {/* Section header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-black text-white" style={{ letterSpacing: "-0.01em" }}>
            Citation Metrics
          </h3>
          {/* Live auto-update pill */}
          <span
            className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(16,185,129,.08)",
              border: "1px solid rgba(16,185,129,.35)",
              color: "#6ee7b7",
            }}
            title={`Auto-updated daily from Google Scholar · last refresh: ${lastUpdatedStr}`}
          >
            <span className="relative inline-flex w-1.5 h-1.5">
              <span
                className="absolute inline-flex w-full h-full rounded-full"
                style={{ background: "#10b981", animation: "scholarPing 2s cubic-bezier(0,0,.2,1) infinite", opacity: 0.65 }}
              />
              <span className="relative inline-flex rounded-full w-1.5 h-1.5" style={{ background: "#10b981" }} />
            </span>
            Live · {lastUpdatedStr}
          </span>
        </div>
        <a
          href={personal.scholar}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-semibold inline-flex items-center gap-1 px-3 py-1.5 rounded-full transition-all hover:brightness-125"
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
        <StatCard
          label="Citations"
          value={data.citations}
          sub={data.citations_5y ? `${data.citations_5y} in last 5 years` : undefined}
          color="#06b6d4"
          accent="📈"
        />
        <StatCard
          label="h-index"
          value={data.h_index}
          sub={data.h_index_5y ? `${data.h_index_5y} in last 5 years` : undefined}
          color="#a5b4fc"
          accent="h"
        />
        <StatCard
          label="i10-index"
          value={data.i10_index}
          sub={data.i10_index_5y ? `${data.i10_index_5y} in last 5 years` : undefined}
          color="#fcd34d"
          accent="i10"
        />
      </div>

      {/* Cites-per-year bar chart */}
      <CitesPerYearChart data={data.cites_per_year} total={data.citations} />

      {/* Keyframes injected once for the live pulse */}
      <style>{`
        @keyframes scholarPing {
          0%   { transform: scale(1);   opacity: 0.65; }
          75%, 100% { transform: scale(2.6); opacity: 0;   }
        }
      `}</style>
    </div>
  );
}

function StatCard({
  label, value, sub, color, accent,
}: { label: string; value: number; sub?: string; color: string; accent: string }) {
  return (
    <div
      className="relative rounded-2xl p-5 text-center transition-all duration-200 hover:-translate-y-0.5 overflow-hidden group"
      style={{
        background: "rgba(12,20,38,.7)",
        border: `1px solid ${color}33`,
        boxShadow: "0 4px 24px rgba(0,0,0,.3)",
      }}
    >
      {/* Faint corner watermark */}
      <span
        aria-hidden
        className="absolute top-1 right-2 text-xs font-black opacity-25 select-none"
        style={{ color, letterSpacing: "-0.02em" }}
      >
        {accent}
      </span>
      {/* Soft accent glow on hover */}
      <span
        aria-hidden
        className="absolute inset-x-0 -bottom-12 h-24 rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 50%, ${color}33, transparent 70%)`, filter: "blur(20px)" }}
      />
      <div className="text-3xl font-black mb-1" style={{ color, letterSpacing: "-0.03em", textShadow: `0 0 14px ${color}33` }}>
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
const H = 240;
const PAD_L = 40;
const PAD_R = 16;
const PAD_T = 16;
const PAD_B = 36;

function CitesPerYearChart({ data, total }: { data: Record<string, number>; total: number }) {
  const bins = useMemo(
    () =>
      Object.entries(data)
        .map(([y, c]) => ({ year: Number(y), count: c }))
        .filter(b => Number.isFinite(b.year))
        .sort((a, b) => a.year - b.year),
    [data]
  );
  const [hovered, setHovered] = useState<number | null>(null);

  if (bins.length === 0) return null;

  const maxC = Math.max(...bins.map(b => b.count), 1);
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;
  const slot = plotW / bins.length;
  const barW = Math.min(slot * 0.62, 56);
  const yScale = (n: number) => PAD_T + plotH - (n / maxC) * plotH;
  const tickStep = Math.max(1, Math.ceil(maxC / 5));
  const yTicks = Array.from({ length: Math.ceil(maxC / tickStep) + 1 }, (_, i) => i * tickStep);

  const yearRange = bins.length > 1 ? `${bins[0].year}–${bins[bins.length - 1].year}` : `${bins[0].year}`;
  const hoveredBin = hovered !== null ? bins.find(b => b.year === hovered) : null;

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(145deg,#040b18,#0a1428)",
        border: "1px solid rgba(100,116,139,.25)",
        boxShadow: "0 4px 24px rgba(0,0,0,.3)",
      }}
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="auto" style={{ display: "block" }}>
        <defs>
          {/* Cyan-to-blue gradient for the bars — gives them depth */}
          <linearGradient id="scholarBar" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#a5f3fc" />
            <stop offset="45%"  stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0e7490" />
          </linearGradient>
          <linearGradient id="scholarBarActive" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#ecfeff" />
            <stop offset="45%"  stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
        </defs>

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
                opacity={dim ? 0.4 : 1}
              >
                <rect
                  x={cx - barW / 2}
                  y={by}
                  width={barW}
                  height={bh}
                  rx={4}
                  fill={isActive ? "url(#scholarBarActive)" : "url(#scholarBar)"}
                  style={{
                    filter: isActive
                      ? "drop-shadow(0 0 14px rgba(6,182,212,.65))"
                      : "drop-shadow(0 4px 8px rgba(6,182,212,.18))",
                    transition: "filter .15s ease",
                  }}
                />
                <text
                  x={cx}
                  y={by - 6}
                  textAnchor="middle"
                  fill={isActive ? "#a5f3fc" : "rgba(241,245,249,.85)"}
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

      {/* Bottom-left summary chip */}
      <div
        className="absolute bottom-3 left-3 px-3 py-1.5 rounded-md flex items-center gap-2"
        style={{ background: "rgba(4,8,18,.65)", border: "1px solid rgba(100,116,139,.25)", backdropFilter: "blur(6px)" }}
      >
        <span className="text-[10px]" style={{ color: "rgba(203,213,225,.7)" }}>
          Citations per year · {yearRange}
        </span>
        <span className="text-[10px]" style={{ color: "rgba(148,163,184,.5)" }}>·</span>
        <span className="text-[10px] font-semibold" style={{ color: "#67e8f9" }}>
          {total} total
        </span>
      </div>

      {/* Hover tooltip */}
      {hoveredBin && (
        <div
          className="absolute top-3 right-3 px-3 py-2 rounded-lg"
          style={{
            background: "rgba(4,8,18,.94)",
            border: "1px solid rgba(6,182,212,.45)",
            color: "#f1f5f9",
            backdropFilter: "blur(8px)",
            boxShadow: "0 8px 20px rgba(6,182,212,.18)",
          }}
        >
          <p className="text-xs font-bold" style={{ color: "#67e8f9" }}>{hoveredBin.year}</p>
          <p className="text-[11px]" style={{ color: "rgba(241,245,249,.92)" }}>
            <span className="text-base font-bold">{hoveredBin.count}</span>{" "}
            <span style={{ color: "rgba(148,163,184,.7)" }}>
              citation{hoveredBin.count === 1 ? "" : "s"}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
