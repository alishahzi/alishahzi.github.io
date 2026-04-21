import { experience } from "../data/content";

export default function Experience() {
  if (!experience || experience.length === 0) return null;
  return (
    <section id="experience" className="py-24" style={{background:"rgba(10,15,30,0.7)"}}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-[.3em] uppercase mb-3" style={{color:"#06b6d4"}}>Professional journey</p>
          <h2 className="text-4xl font-black text-white mb-4" style={{letterSpacing:"-0.02em"}}>Experience</h2>
          <div className="w-16 h-1 rounded-full mx-auto mb-4" style={{background:"linear-gradient(90deg,#06b6d4,#3b82f6)"}}/>
          <p className="text-sm max-w-md mx-auto" style={{color:"#64748b"}}>From teaching and research assistance to clinical AI research — a career built on bridging theory with real-world healthcare impact.</p>
        </div>
        <div className="relative">
          <div className="absolute left-7 top-0 bottom-0 w-px hidden md:block"
            style={{background:"linear-gradient(to bottom,transparent,rgba(6,182,212,.35) 8%,rgba(6,182,212,.35) 92%,transparent)"}}/>
          <div className="space-y-8">
            {experience.map((e, i) => (
              <div key={e.id || i} className="relative md:pl-20">
                <div className="absolute left-4 top-8 w-6 h-6 rounded-full hidden md:flex items-center justify-center"
                  style={{border:"2px solid rgba(6,182,212,.7)",background:"#04080f",boxShadow:"0 0 14px rgba(6,182,212,.35)"}}>
                  <div className="w-2.5 h-2.5 rounded-full" style={{background:"#06b6d4"}}/>
                </div>
                <div className="rounded-2xl p-7 transition-all duration-300 hover:-translate-y-0.5"
                  style={{background:"rgba(12,20,38,0.8)",border:"1px solid rgba(100,116,139,.2)",boxShadow:"0 4px 24px rgba(0,0,0,.35)"}}>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-5">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-base font-black text-white" style={{letterSpacing:"-0.01em"}}>{e.role}</h3>
                        {e.current && (
                          <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold"
                            style={{background:"rgba(16,185,129,.18)",border:"1px solid rgba(16,185,129,.4)",color:"#6ee7b7"}}>
                            ● Current
                          </span>
                        )}
                      </div>
                      <p className="font-bold text-sm mb-0.5" style={{color:"#22d3ee"}}>{e.org}</p>
                      {e.department && <p className="text-xs" style={{color:"#64748b"}}>{e.department}</p>}
                      {e.location && <p className="flex items-center gap-1 text-xs mt-0.5" style={{color:"#64748b"}}>📍 {e.location}</p>}
                    </div>
                    <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
                      <span className="text-xs px-3 py-1.5 rounded-full font-semibold"
                        style={{background:"rgba(15,23,42,.9)",border:"1px solid rgba(100,116,139,.35)",color:"#cbd5e1"}}>{e.period}</span>
                      {e.type && (
                        <span className="text-xs px-3 py-1.5 rounded-full font-medium"
                          style={{background:"rgba(59,130,246,.12)",border:"1px solid rgba(59,130,246,.35)",color:"#93c5fd"}}>{e.type}</span>
                      )}
                    </div>
                  </div>
                  {e.highlights && e.highlights.length > 0 && (
                    <ul className="space-y-2.5 mb-4">
                      {e.highlights.map((h, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm" style={{color:"#94a3b8"}}>
                          <span className="text-xs shrink-0 mt-0.5 font-black" style={{color:"#06b6d4"}}>▸</span>
                          <span className="leading-[1.7]">{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {e.tags && e.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {e.tags.map((t, j) => (
                        <span key={j} className="text-xs px-2.5 py-1 rounded-lg"
                          style={{background:"rgba(15,23,42,.8)",border:"1px solid rgba(100,116,139,.25)",color:"#64748b"}}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
