import { useMemo, useState } from "react";
import { yearBins } from "../lib/coauthors";

const W = 880;
const H = 360;
const PAD_L = 50;
const PAD_R = 24;
const PAD_T = 24;
const PAD_B = 50;

export default function PublicationsByYear() {
  const [hovered, setHovered] = useState<number | null>(null);

  const { bins, maxTotal, journalTotal, conferenceTotal } = useMemo(() => {
    // Fill in any missing years between min and max so the timeline reads cleanly
    if (yearBins.length === 0) {
      return { bins: [], maxTotal: 0, journalTotal: 0, conferenceTotal: 0 };
    }
    const minY = yearBins[0].year;
    const maxY = yearBins[yearBins.length - 1].year;
    const filled: { year: number; journal: number; conference: number }[] = [];
    const found = new Map(yearBins.map(b => [b.year, b]));
    for (let y = minY; y <= maxY; y++) {
      filled.push(found.get(y) || { year: y, journal: 0, conference: 0 });
    }
    const maxTotal = Math.max(...filled.map(b => b.journal + b.conference), 1);
    const journalTotal = filled.reduce((s, b) => s + b.journal, 0);
    const conferenceTotal = filled.reduce((s, b) => s + b.conference, 0);
    return { bins: filled, maxTotal, journalTotal, conferenceTotal };
  }, []);

  if (bins.length === 0) return null;

  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;
  const slot = plotW / bins.length;
  const barW = Math.min(slot * 0.66, 56);

  const yScale = (n: number) => PAD_T + plotH - (n / maxTotal) * plotH;
  const yTicks = Array.from({ length: maxTotal + 1 }, (_, i) => i);

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
        {/* gridlines */}
        <g>
          {yTicks.map(t => {
            const y = yScale(t);
            return (
              <g key={t}>
                <line x1={PAD_L} y1={y} x2={W - PAD_R} y2={y} stroke="rgba(148,163,184,.12)" strokeWidth={0.7} />
                <text x={PAD_L - 8} y={y + 4} textAnchor="end" fill="rgba(148,163,184,.6)" fontSize={10}>{t}</text>
              </g>
            );
          })}
        </g>

        {/* bars */}
        <g>
          {bins.map((b, i) => {
            const cx = PAD_L + slot * (i + 0.5);
            const total = b.journal + b.conference;
            const jH = (b.journal / maxTotal) * plotH;
            const cH = (b.conference / maxTotal) * plotH;
            const jY = yScale(b.journal);
            const cY = yScale(total);
            const isActive = hovered === b.year;
            const dim = hovered !== null && !isActive;

            return (
              <g
                key={b.year}
                onPointerEnter={() => setHovered(b.year)}
                onPointerLeave={() => setHovered(null)}
                style={{ cursor: total > 0 ? "pointer" : "default", transition: "opacity .15s ease" }}
                opacity={dim ? 0.35 : 1}
              >
                {/* conference (on top of journal) */}
                {b.conference > 0 && (
                  <rect
                    x={cx - barW / 2}
                    y={cY}
                    width={barW}
                    height={cH}
                    rx={4}
                    fill="#a855f7"
                    style={{
                      filter: isActive ? "drop-shadow(0 0 10px rgba(168,85,247,.6))" : "none",
                    }}
                  />
                )}
                {/* journal */}
                {b.journal > 0 && (
                  <rect
                    x={cx - barW / 2}
                    y={jY}
                    width={barW}
                    height={jH}
                    rx={4}
                    fill="#06b6d4"
                    style={{
                      filter: isActive ? "drop-shadow(0 0 10px rgba(6,182,212,.6))" : "none",
                    }}
                  />
                )}
                {/* count label above bar */}
                {total > 0 && (
                  <text
                    x={cx}
                    y={cY - 6}
                    textAnchor="middle"
                    fill="rgba(241,245,249,.85)"
                    fontSize={11}
                    fontWeight={700}
                    style={{ textShadow: "0 1px 4px rgba(0,0,0,.9)" }}
                  >
                    {total}
                  </text>
                )}
                {/* year label */}
                <text
                  x={cx}
                  y={H - PAD_B + 18}
                  textAnchor="middle"
                  fill={isActive ? "#67e8f9" : "rgba(148,163,184,.85)"}
                  fontSize={11}
                  fontWeight={isActive ? 700 : 500}
                >
                  {b.year}
                </text>
              </g>
            );
          })}
        </g>

        {/* axes */}
        <line x1={PAD_L} y1={H - PAD_B} x2={W - PAD_R} y2={H - PAD_B} stroke="rgba(148,163,184,.35)" strokeWidth={1} />
      </svg>

      {/* hovered details */}
      {hovered !== null && (() => {
        const b = bins.find(x => x.year === hovered)!;
        return (
          <div
            className="absolute top-3 right-3 px-4 py-3 rounded-lg"
            style={{
              background: "rgba(4,8,18,.94)",
              border: "1px solid rgba(6,182,212,.4)",
              color: "#f1f5f9",
              backdropFilter: "blur(8px)",
            }}
          >
            <p className="text-sm font-bold mb-1.5">{b.year}</p>
            <p className="text-[11px]" style={{ color: "#67e8f9" }}>● {b.journal} journal article{b.journal === 1 ? "" : "s"}</p>
            <p className="text-[11px]" style={{ color: "#c4b5fd" }}>● {b.conference} conference paper{b.conference === 1 ? "" : "s"}</p>
            <p className="text-[11px] mt-1.5 pt-1.5" style={{ color: "rgba(203,213,225,.8)", borderTop: "1px solid rgba(100,116,139,.25)" }}>
              {b.journal + b.conference} total
            </p>
          </div>
        );
      })()}

      {/* legend */}
      <div className="absolute bottom-3 left-3 px-3 py-2 rounded-lg flex gap-4"
        style={{ background: "rgba(4,8,18,.7)", border: "1px solid rgba(100,116,139,.25)", backdropFilter: "blur(6px)" }}>
        <span className="flex items-center gap-1.5 text-[11px]" style={{ color: "rgba(203,213,225,.85)" }}>
          <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: "#06b6d4" }} />
          {journalTotal} journal articles
        </span>
        <span className="flex items-center gap-1.5 text-[11px]" style={{ color: "rgba(203,213,225,.85)" }}>
          <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: "#a855f7" }} />
          {conferenceTotal} conference papers
        </span>
      </div>
    </div>
  );
}
