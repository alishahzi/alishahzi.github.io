import { projects } from "../data/content";

export default function Projects(){
  if(!projects||projects.length===0)return null;
  return(
    <section id="projects" className="py-24" style={{background:"rgba(10,15,30,0.7)"}}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-[.3em] uppercase mb-3" style={{color:"#06b6d4"}}>Research in action</p>
          <h2 className="text-4xl font-black text-white mb-4" style={{letterSpacing:"-0.02em"}}>Projects</h2>
          <div className="w-16 h-1 rounded-full mx-auto mb-4" style={{background:"linear-gradient(90deg,#06b6d4,#3b82f6)"}}/>
          <p className="text-sm max-w-md mx-auto" style={{color:"#64748b"}}>Applied research translating theoretical advances in machine and deep learning into tools for clinicians and researchers.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((p,i)=>{
            const accent = p.color || "#06b6d4";
            return(
              <div key={p.id||i}
                className="rounded-2xl p-7 flex flex-col transition-all duration-300 hover:-translate-y-1"
                style={{background:"rgba(12,20,38,0.8)",border:`1px solid rgba(100,116,139,.2)`,borderTop:`2px solid ${accent}60`,boxShadow:"0 4px 24px rgba(0,0,0,.35)"}}>
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div>
                    <h3 className="text-base font-black text-white leading-snug mb-0.5" style={{letterSpacing:"-0.01em"}}>{p.title}</h3>
                    {p.subtitle && <p className="text-xs font-bold" style={{color:accent}}>{p.subtitle}</p>}
                  </div>
                  {p.status && (
                    <span className="text-[11px] px-3 py-1 rounded-full shrink-0 font-bold"
                      style={
                        ["Completed","Published"].includes(p.status)
                          ?{background:"rgba(16,185,129,.15)",border:"1px solid rgba(16,185,129,.35)",color:"#6ee7b7"}
                        :["Ongoing","In Progress"].includes(p.status)
                          ?{background:"rgba(59,130,246,.15)",border:"1px solid rgba(59,130,246,.35)",color:"#93c5fd"}
                        :{background:"rgba(100,116,139,.15)",border:"1px solid rgba(100,116,139,.3)",color:"#94a3b8"}
                      }>{p.status}</span>
                  )}
                </div>
                <div className="space-y-3 flex-1">
                  {p.problem && (
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{color:"rgba(100,116,139,.8)"}}>Problem</p>
                      <p className="text-sm leading-relaxed" style={{color:"#94a3b8"}}>{p.problem}</p>
                    </div>
                  )}
                  {p.method && (
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{color:"rgba(100,116,139,.8)"}}>Approach</p>
                      <p className="text-sm leading-relaxed" style={{color:"#94a3b8"}}>{p.method}</p>
                    </div>
                  )}
                  {p.contribution && (
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{color:"rgba(100,116,139,.8)"}}>Outcome</p>
                      <p className="text-sm leading-relaxed" style={{color:"#94a3b8"}}>{p.contribution}</p>
                    </div>
                  )}
                </div>
                <div className="mt-5 pt-4 space-y-2" style={{borderTop:"1px solid rgba(100,116,139,.15)"}}>
                  {p.tools && p.tools.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {p.tools.map((t,j)=>(
                        <span key={j} className="text-[11px] px-2.5 py-1 rounded-lg font-semibold"
                          style={{background:`${accent}18`,border:`1px solid ${accent}35`,color:accent}}>{t}</span>
                      ))}
                    </div>
                  )}
                  {p.tags && p.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {p.tags.map((t,j)=>(
                        <span key={j} className="text-[11px] px-2.5 py-1 rounded-lg"
                          style={{background:"rgba(15,23,42,.8)",border:"1px solid rgba(100,116,139,.2)",color:"#64748b"}}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
