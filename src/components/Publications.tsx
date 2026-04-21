import { publications } from "../data/content";

interface Pub{id?:string;authors?:string;title:string;venue?:string;year?:number|string;doi?:string;if?:number|string;note?:string;vol?:string;location?:string;}

function PubCard({pub,index,badge,bc}:{pub:Pub;index:number;badge?:string;bc?:string}){
  return(
    <div className="rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5"
      style={{background:"rgba(12,20,38,0.75)",border:"1px solid rgba(100,116,139,.2)",boxShadow:"0 2px 16px rgba(0,0,0,.3)"}}>
      <div className="flex gap-4">
        <span className="font-black text-sm shrink-0 mt-0.5 w-7 text-center" style={{color:"#06b6d4"}}>[{index+1}]</span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm leading-snug mb-2 text-white">{pub.title}</p>
          {pub.authors && <p className="text-xs mb-2 leading-relaxed" style={{color:"#64748b"}}>{pub.authors}</p>}
          <div className="flex flex-wrap items-center gap-2">
            {pub.venue && <span className="text-xs italic" style={{color:"#94a3b8"}}>{pub.venue}</span>}
            {pub.year  && <span className="text-xs" style={{color:"#475569"}}>({pub.year})</span>}
            {pub.vol   && <span className="text-xs" style={{color:"#475569"}}>{pub.vol}</span>}
            {pub.location && <span className="text-xs" style={{color:"#475569"}}>{pub.location}</span>}
            {badge && <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${bc||""}`}>{badge}</span>}
            {pub.if && <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold" style={{background:"rgba(139,92,246,.15)",border:"1px solid rgba(139,92,246,.35)",color:"#c4b5fd"}}>IF {pub.if}</span>}
            {pub.doi && <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold transition-colors hover:text-cyan-300" style={{color:"#06b6d4"}}>DOI ↗</a>}
          </div>
          {pub.note && <p className="text-xs mt-2 italic" style={{color:"#475569"}}>{pub.note}</p>}
        </div>
      </div>
    </div>
  );
}

function Sec({title,pubs,badge,bc}:{title:string;pubs:Pub[];badge?:string;bc?:string}){
  if(!pubs||pubs.length===0)return null;
  return(
    <div className="mb-14">
      <div className="flex items-center gap-3 mb-6">
        <h3 className="text-xl font-black text-white" style={{letterSpacing:"-0.01em"}}>{title}</h3>
        <span className="text-xs px-3 py-1 rounded-full font-black"
          style={{background:"rgba(6,182,212,.15)",border:"1px solid rgba(6,182,212,.35)",color:"#06b6d4"}}>{pubs.length}</span>
      </div>
      <div className="space-y-3">{pubs.map((p,i)=><PubCard key={p.id||i} pub={p} index={i} badge={badge} bc={bc}/>)}</div>
    </div>
  );
}

export default function Publications(){
  const jp = publications.journalsPublished    || [];
  const jr = publications.journalsUnderReview  || [];
  const sc = publications.selectedConferences  || [];
  const wp = publications.workingPapers        || [];
  const bc = publications.bookChapters         || [];
  const total = jp.length + jr.length + sc.length + wp.length + bc.length;

  return(
    <section id="publications" className="py-24" style={{background:"rgba(4,8,18,0.72)"}}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-[.3em] uppercase mb-3" style={{color:"#06b6d4"}}>Scholarly output</p>
          <h2 className="text-4xl font-black text-white mb-4" style={{letterSpacing:"-0.02em"}}>Publications</h2>
          <div className="w-16 h-1 rounded-full mx-auto mb-4" style={{background:"linear-gradient(90deg,#06b6d4,#3b82f6)"}}/>
          <p className="text-sm max-w-md mx-auto mb-8" style={{color:"#64748b"}}>
            {total} works spanning peer-reviewed journals, international conferences, and book contributions.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              {n:jp.length+bc.length, l:"Peer-Reviewed", c:"#06b6d4", bg:"rgba(6,182,212,.1)",  bo:"rgba(6,182,212,.3)"},
              {n:jr.length,           l:"Under Review",  c:"#f59e0b", bg:"rgba(245,158,11,.1)", bo:"rgba(245,158,11,.3)"},
              {n:sc.length,           l:"Conferences",   c:"#a855f7", bg:"rgba(168,85,247,.1)", bo:"rgba(168,85,247,.3)"},
              {n:wp.length,           l:"Working Papers",c:"#10b981", bg:"rgba(16,185,129,.1)", bo:"rgba(16,185,129,.3)"},
            ].map(s=>(
              <div key={s.l} className="px-6 py-4 rounded-2xl transition-all hover:-translate-y-0.5"
                style={{background:s.bg,border:`1px solid ${s.bo}`}}>
                <div className="text-2xl font-black mb-0.5" style={{color:s.c,letterSpacing:"-0.03em"}}>{s.n}</div>
                <p className="text-xs font-medium" style={{color:"#64748b"}}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
        <Sec title="Journal Articles — Published"  pubs={jp} badge="Published"    bc="bg-green-500/10 text-green-300 border border-green-500/25"/>
        <Sec title="Book Chapters"                 pubs={bc} badge="Book Chapter"  bc="bg-blue-500/10 text-blue-300 border border-blue-500/25"/>
        <Sec title="Under Review / In Press"       pubs={jr} badge="Under Review"  bc="bg-amber-500/10 text-amber-300 border border-amber-500/25"/>
        <Sec title="Conference Papers"             pubs={sc} badge="Conference"    bc="bg-purple-500/10 text-purple-300 border border-purple-500/25"/>
        <Sec title="Working Papers"                pubs={wp} badge="Working Paper" bc="bg-slate-600/30 text-slate-300 border border-slate-600/40"/>
      </div>
    </section>
  );
}
