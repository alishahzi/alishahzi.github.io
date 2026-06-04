import { publications } from "../data/content";

interface Pub{id?:string;authors?:string;title:string;venue?:string;year?:number|string;doi?:string;if?:number|string;note?:string;vol?:string;location?:string;}

function PubCard({pub,index}:{pub:Pub;index:number}){
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
            {pub.vol   && <span className="text-xs" style={{color:"#475569"}}>{pub.vol}</span>}
            {pub.year  && <span className="text-xs" style={{color:"#475569"}}>({pub.year})</span>}
            {pub.location && <span className="text-xs" style={{color:"#475569"}}>{pub.location}</span>}
            {pub.if && <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
              style={{background:"rgba(139,92,246,.15)",border:"1px solid rgba(139,92,246,.35)",color:"#c4b5fd"}}>IF {pub.if}</span>}
            {pub.doi && (
              <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer"
                className="text-xs font-semibold inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full transition-all hover:brightness-125"
                style={{background:"rgba(6,182,212,.12)",border:"1px solid rgba(6,182,212,.4)",color:"#06b6d4"}}>
                DOI: {pub.doi} <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
          {pub.note && <p className="text-xs mt-2 italic" style={{color:"#475569"}}>{pub.note}</p>}
        </div>
      </div>
    </div>
  );
}

function Sec({title,pubs}:{title:string;pubs:Pub[]}){
  if(!pubs||pubs.length===0)return null;
  return(
    <div className="mb-14">
      <div className="flex items-center gap-3 mb-6">
        <h3 className="text-xl font-black text-white" style={{letterSpacing:"-0.01em"}}>{title}</h3>
        <span className="text-xs px-3 py-1 rounded-full font-black"
          style={{background:"rgba(6,182,212,.15)",border:"1px solid rgba(6,182,212,.35)",color:"#06b6d4"}}>{pubs.length}</span>
      </div>
      <div className="space-y-3">{pubs.map((p,i)=><PubCard key={p.id||i} pub={p} index={i}/>)}</div>
    </div>
  );
}

export default function Publications(){
  const jp = publications.journalsPublished    || [];
  const sc = publications.selectedConferences  || [];
  const total = jp.length + sc.length;

  return(
    <section id="publications" className="py-24" style={{background:"rgba(4,8,18,0.72)"}}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-[.3em] uppercase mb-3" style={{color:"#06b6d4"}}>Scholarly output</p>
          <h2 className="text-4xl font-black text-white mb-4" style={{letterSpacing:"-0.02em"}}>Research &amp; Publications</h2>
          <div className="w-16 h-1 rounded-full mx-auto mb-4" style={{background:"linear-gradient(90deg,#06b6d4,#3b82f6)"}}/>
          <p className="text-sm max-w-md mx-auto mb-8" style={{color:"#64748b"}}>
            {total} peer-reviewed works across international journals and conferences.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              {n:jp.length, l:"Journal Articles",   c:"#06b6d4", bg:"rgba(6,182,212,.1)",  bo:"rgba(6,182,212,.3)"},
              {n:sc.length, l:"Conference Papers",  c:"#a855f7", bg:"rgba(168,85,247,.1)", bo:"rgba(168,85,247,.3)"},
            ].map(s=>(
              <div key={s.l} className="px-6 py-4 rounded-2xl transition-all hover:-translate-y-0.5"
                style={{background:s.bg,border:`1px solid ${s.bo}`}}>
                <div className="text-2xl font-black mb-0.5" style={{color:s.c,letterSpacing:"-0.03em"}}>{s.n}</div>
                <p className="text-xs font-medium" style={{color:"#64748b"}}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
        <Sec title="Journal Articles"   pubs={jp}/>
        <Sec title="Conference Papers"  pubs={sc}/>
      </div>
    </section>
  );
}
