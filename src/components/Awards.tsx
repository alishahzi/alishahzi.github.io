import { awards, peerReview, professionalDevelopment } from "../data/content";

interface Award {
  id?: string;
  title: string;
  org: string;
  year: string | number;
  description?: string;
  tier?: string;
}

interface PD {
  title: string;
  org: string;
  year: string | number;
}

const TIER_STYLE: Record<string, { bg: string; bo: string; c: string; label: string; icon: string }> = {
  major: { bg: "rgba(245,158,11,.12)",  bo: "rgba(245,158,11,.4)",  c: "#fcd34d", label: "Major award",   icon: "★" },
  grant: { bg: "rgba(168,85,247,.12)",  bo: "rgba(168,85,247,.4)",  c: "#c4b5fd", label: "Grant",         icon: "◆" },
  award: { bg: "rgba(6,182,212,.12)",   bo: "rgba(6,182,212,.4)",   c: "#67e8f9", label: "Award",         icon: "●" },
  fellowship: { bg: "rgba(99,102,241,.12)", bo: "rgba(99,102,241,.4)", c: "#a5b4fc", label: "Fellowship", icon: "▲" },
};
const DEFAULT_TIER = TIER_STYLE.award;

export default function Awards() {
  const all = awards as Award[];
  if (!all || all.length === 0) return null;

  return (
    <section id="awards" className="py-24" style={{ background: "rgba(4,8,18,0.72)" }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-[.3em] uppercase mb-3" style={{ color: "#06b6d4" }}>Recognition</p>
          <h2 className="text-4xl font-black text-white mb-4" style={{ letterSpacing: "-0.02em" }}>Awards &amp; Grants</h2>
          <div className="w-16 h-1 rounded-full mx-auto mb-4" style={{ background: "linear-gradient(90deg,#06b6d4,#3b82f6)" }} />
          <p className="text-sm max-w-md mx-auto" style={{ color: "#64748b" }}>
            Scholarships, fellowships, and research grants supporting my academic path.
          </p>
        </div>

        {/* Awards grid */}
        <div className="grid md:grid-cols-2 gap-5 mb-14">
          {all.map((a, i) => {
            const t = TIER_STYLE[a.tier || ""] || DEFAULT_TIER;
            return (
              <div
                key={a.id || i}
                className="rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: "rgba(12,20,38,0.78)",
                  border: "1px solid rgba(100,116,139,.22)",
                  borderTop: `2px solid ${t.bo}`,
                  boxShadow: "0 4px 24px rgba(0,0,0,.35)",
                }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-base font-black shrink-0"
                    style={{
                      background: t.bg,
                      border: `1px solid ${t.bo}`,
                      color: t.c,
                      textShadow: `0 0 10px ${t.c}40`,
                    }}
                  >
                    {t.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-white mb-1" style={{ letterSpacing: "-0.01em" }}>
                      {a.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-xs font-semibold" style={{ color: t.c }}>{a.org}</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full"
                        style={{ background: "rgba(15,23,42,.8)", border: "1px solid rgba(100,116,139,.3)", color: "#cbd5e1" }}>
                        {a.year}
                      </span>
                    </div>
                  </div>
                </div>
                {a.description && (
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(203,213,225,.7)" }}>
                    {a.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Peer review + Professional development */}
        <div className="grid md:grid-cols-2 gap-8">
          {peerReview && (peerReview as string[]).length > 0 && (
            <div
              className="rounded-2xl p-6"
              style={{ background: "rgba(12,20,38,0.7)", border: "1px solid rgba(100,116,139,.22)" }}
            >
              <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(6,182,212,.7)" }}>
                Peer review
              </p>
              <ul className="space-y-1.5">
                {(peerReview as string[]).map((j, i) => (
                  <li key={i} className="text-xs flex items-start gap-2" style={{ color: "rgba(203,213,225,.8)" }}>
                    <span style={{ color: "#06b6d4" }}>▸</span>
                    {j}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {professionalDevelopment && (professionalDevelopment as PD[]).length > 0 && (
            <div
              className="rounded-2xl p-6"
              style={{ background: "rgba(12,20,38,0.7)", border: "1px solid rgba(100,116,139,.22)" }}
            >
              <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(6,182,212,.7)" }}>
                Schools, workshops &amp; certifications
              </p>
              <ul className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {(professionalDevelopment as PD[]).map((p, i) => (
                  <li key={i} className="text-xs" style={{ color: "rgba(203,213,225,.8)", lineHeight: 1.55 }}>
                    <span className="font-semibold" style={{ color: "#cbd5e1" }}>{p.title}</span>
                    <span style={{ color: "rgba(148,163,184,.6)" }}> — {p.org} · {p.year}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
