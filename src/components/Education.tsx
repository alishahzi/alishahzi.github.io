import { education } from "../data/content";

export default function Education() {
  if (!education || education.length === 0) return null;
  return (
    <section id="education" className="py-24" style={{background:"rgba(4,8,18,0.72)"}}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-[.3em] uppercase mb-3" style={{color:"#06b6d4"}}>Academic background</p>
          <h2 className="text-4xl font-black text-white mb-4" style={{letterSpacing:"-0.02em"}}>Education</h2>
          <div className="w-16 h-1 rounded-full mx-auto mb-4" style={{background:"linear-gradient(90deg,#06b6d4,#3b82f6)"}}/>
          <p className="text-sm max-w-md mx-auto" style={{color:"#64748b"}}>Formal training in data science, machine learning, and computer science across Italy and Pakistan.</p>
        </div>
        <div className="space-y-6">
          {education.map((d, i) => (
            <div key={d.id || i}
              className="rounded-2xl p-7 transition-all duration-300 hover:-translate-y-0.5"
              style={{background:"rgba(12,20,38,0.8)",border:"1px solid rgba(100,116,139,.2)",boxShadow:"0 4px 24px rgba(0,0,0,.4)"}}>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
                <div className="flex-1">
                  <h3 className="text-lg font-black text-white mb-1" style={{letterSpacing:"-0.01em"}}>{d.degree}</h3>
                  {d.specialization && <p className="text-sm font-bold mb-1" style={{color:"#22d3ee"}}>{d.specialization}</p>}
                  <p className="text-sm font-semibold text-slate-200 mb-0.5">{d.institution}</p>
                  {d.department && <p className="text-xs" style={{color:"#64748b"}}>{d.department}</p>}
                  {d.location && <p className="flex items-center gap-1 text-xs mt-1" style={{color:"#64748b"}}><span>📍</span>{d.location}</p>}
                </div>
                <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
                  <span className="text-xs px-3 py-1.5 rounded-full font-semibold"
                    style={{background:"rgba(15,23,42,.9)",border:"1px solid rgba(100,116,139,.35)",color:"#cbd5e1"}}>{d.period}</span>
                  {d.gpa && (
                    <span className="text-xs px-3 py-1.5 rounded-full font-bold"
                      style={{background:"rgba(6,182,212,.15)",border:"1px solid rgba(6,182,212,.4)",color:"#67e8f9"}}>GPA {d.gpa}</span>
                  )}
                </div>
              </div>
              {d.thesis && (
                <div className="mb-5 p-4 rounded-xl" style={{background:"rgba(6,182,212,.05)",borderLeft:"3px solid rgba(6,182,212,.5)"}}>
                  <p className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{color:"rgba(6,182,212,.7)"}}>Thesis</p>
                  <p className="text-sm italic leading-relaxed" style={{color:"#cbd5e1"}}>"{d.thesis}"</p>
                </div>
              )}
              {d.scholarship && (
                <div className="mb-4">
                  <span className="inline-flex items-center gap-2 text-xs px-4 py-2 rounded-full font-bold"
                    style={{background:"rgba(245,158,11,.12)",border:"1px solid rgba(245,158,11,.35)",color:"#fcd34d"}}>
                    🏆 {d.scholarship}
                  </span>
                </div>
              )}
              {d.highlights && d.highlights.length > 0 && (
                <ul className="space-y-2.5">
                  {d.highlights.map((h, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm" style={{color:"#94a3b8"}}>
                      <span className="text-xs shrink-0 mt-1 font-black" style={{color:"#06b6d4"}}>▸</span>
                      <span className="leading-relaxed">{h}</span>
                    </li>
                  ))}
                </ul>
              )}
              {d.pecReg && <p className="mt-4 text-xs" style={{color:"#475569"}}>PEC Registration: {d.pecReg}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
