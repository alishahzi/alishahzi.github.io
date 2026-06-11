import { useEffect, useMemo, useState } from "react";
import { publications } from "../data/content";
import ScholarMetrics from "./ScholarMetrics";

interface SitesPub {
  doi: string;
  title: string;
  authors: string;
  venue: string;
  vol?: string | null;
  year: number | null;
  section: "journal" | "conference" | "other";
}
interface SitesPayload {
  publications: SitesPub[];
  last_updated: string;
}

/**
 * Hook: merge the manually-curated `publications` from content.ts with the
 * auto-synced sites-publications.json (Google Sites → Crossref).
 *
 *   - content.ts entries win on DOI (they have richer data — full author
 *     lists with et al. expansions, abstracts categorisation, etc.)
 *   - Anything in the JSON whose DOI isn't in content.ts gets appended to
 *     the appropriate section so newly-added Google Sites papers show up
 *     automatically.
 */
function useMergedPublications() {
  const [sites, setSites] = useState<SitesPayload | null>(null);
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}sites-publications.json`)
      .then(r => (r.ok ? r.json() : null))
      .then(setSites)
      .catch(() => setSites(null));
  }, []);

  return useMemo(() => {
    const jp = publications.journalsPublished    || [];
    const sc = publications.selectedConferences  || [];

    const norm = (x: string | undefined) => (x || "").toLowerCase().replace(/\.$/, "");
    const knownDois = new Set<string>(
      [...jp, ...sc]
        .map(p => norm((p as { doi?: string }).doi))
        .filter(Boolean)
    );

    const extraJ: typeof jp = [];
    const extraC: typeof sc = [];
    let autoCount = 0;

    for (const p of sites?.publications || []) {
      const d = norm(p.doi);
      if (!d || knownDois.has(d)) continue;
      autoCount += 1;
      const stub = {
        id: `Auto-${d}`,
        authors: p.authors,
        title: p.title,
        venue: p.venue,
        year: p.year || undefined,
        vol: p.vol || undefined,
        doi: p.doi,
      };
      if (p.section === "journal") extraJ.push(stub);
      else extraC.push(stub);
    }

    // Sort newest first within each section
    const byYearDesc = (a: { year?: number | string }, b: { year?: number | string }) =>
      Number(b.year || 0) - Number(a.year || 0);

    return {
      jp: [...jp, ...extraJ].sort(byYearDesc),
      sc: [...sc, ...extraC].sort(byYearDesc),
      autoCount,
      lastSynced: sites?.last_updated,
    };
  }, [sites]);
}

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

interface AbstractPub {
  id?: string;
  authors?: string;
  title: string;
  venue?: string;
  location?: string;
  year?: number | string;
  type?: string;
  url?: string;
}

function AbstractCard({pub,index}:{pub:AbstractPub;index:number}){
  return(
    <div className="rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5"
      style={{background:"rgba(12,20,38,0.75)",border:"1px solid rgba(100,116,139,.2)",borderLeft:"3px solid rgba(245,158,11,.6)",boxShadow:"0 2px 16px rgba(0,0,0,.3)"}}>
      <div className="flex gap-4">
        <span className="font-black text-sm shrink-0 mt-0.5 w-7 text-center" style={{color:"#fcd34d"}}>[{index+1}]</span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm leading-snug mb-2 text-white">{pub.title}</p>
          {pub.authors && <p className="text-xs mb-2 leading-relaxed" style={{color:"#64748b"}}>{pub.authors}</p>}
          <div className="flex flex-wrap items-center gap-2">
            {pub.venue && <span className="text-xs italic" style={{color:"#94a3b8"}}>{pub.venue}</span>}
            {pub.year  && <span className="text-xs" style={{color:"#475569"}}>({pub.year})</span>}
            {pub.location && <span className="text-xs" style={{color:"#475569"}}>{pub.location}</span>}
            {pub.type && <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
              style={{background:"rgba(245,158,11,.15)",border:"1px solid rgba(245,158,11,.35)",color:"#fcd34d"}}>{pub.type}</span>}
            {pub.url && (
              <a href={pub.url} target="_blank" rel="noopener noreferrer"
                className="text-xs font-semibold inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full transition-all hover:brightness-125"
                style={{background:"rgba(6,182,212,.12)",border:"1px solid rgba(6,182,212,.4)",color:"#06b6d4"}}>
                Venue ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AbstractsSec({pubs}:{pubs:AbstractPub[]}){
  if(!pubs||pubs.length===0)return null;
  return(
    <div className="mb-14">
      <div className="flex items-center gap-3 mb-6">
        <h3 className="text-xl font-black text-white" style={{letterSpacing:"-0.01em"}}>Conference Abstracts &amp; Posters</h3>
        <span className="text-xs px-3 py-1 rounded-full font-black"
          style={{background:"rgba(245,158,11,.15)",border:"1px solid rgba(245,158,11,.35)",color:"#fcd34d"}}>{pubs.length}</span>
      </div>
      <div className="space-y-3">{pubs.map((p,i)=><AbstractCard key={p.id||i} pub={p} index={i}/>)}</div>
    </div>
  );
}

export default function Publications(){
  const { jp, sc, autoCount, lastSynced } = useMergedPublications();
  const ab = ((publications as { abstracts?: AbstractPub[] }).abstracts) || [];
  const total = jp.length + sc.length + ab.length;

  return(
    <section id="publications" className="py-24" style={{background:"rgba(4,8,18,0.72)"}}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-[.3em] uppercase mb-3" style={{color:"#06b6d4"}}>Scholarly output</p>
          <h2 className="text-4xl font-black text-white mb-4" style={{letterSpacing:"-0.02em"}}>Research &amp; Publications</h2>
          <div className="w-16 h-1 rounded-full mx-auto mb-4" style={{background:"linear-gradient(90deg,#06b6d4,#3b82f6)"}}/>
          <p className="text-sm max-w-md mx-auto mb-3" style={{color:"#64748b"}}>
            {total} peer-reviewed works across international journals, conferences, and accepted abstracts.
          </p>
          {lastSynced && (
            <p className="text-[10px] mb-5 flex items-center justify-center gap-1.5" style={{color:"rgba(148,163,184,.55)"}}>
              <span className="relative inline-flex w-1.5 h-1.5">
                <span className="absolute inline-flex w-full h-full rounded-full" style={{background:"#10b981", animation:"pubsPing 2s cubic-bezier(0,0,.2,1) infinite", opacity:0.65}}/>
                <span className="relative inline-flex rounded-full w-1.5 h-1.5" style={{background:"#10b981"}}/>
              </span>
              Auto-synced daily from{" "}
              <a href="https://sites.google.com/view/alishahzad/publications" target="_blank" rel="noopener noreferrer" style={{color:"#67e8f9"}} className="hover:brightness-125">
                Google Sites
              </a>
              {autoCount > 0 && <span style={{color:"rgba(148,163,184,.4)"}}>· {autoCount} entr{autoCount===1?"y":"ies"} fetched automatically</span>}
            </p>
          )}
          <style>{`@keyframes pubsPing { 0%{transform:scale(1);opacity:.65} 75%,100%{transform:scale(2.6);opacity:0} }`}</style>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              {n:jp.length, l:"Journal Articles",        c:"#06b6d4", bg:"rgba(6,182,212,.1)",  bo:"rgba(6,182,212,.3)"},
              {n:sc.length, l:"Conference Papers",       c:"#a855f7", bg:"rgba(168,85,247,.1)", bo:"rgba(168,85,247,.3)"},
              {n:ab.length, l:"Conference Abstracts",    c:"#fcd34d", bg:"rgba(245,158,11,.1)", bo:"rgba(245,158,11,.35)"},
            ].map(s=>(
              <div key={s.l} className="px-6 py-4 rounded-2xl transition-all hover:-translate-y-0.5"
                style={{background:s.bg,border:`1px solid ${s.bo}`}}>
                <div className="text-2xl font-black mb-0.5" style={{color:s.c,letterSpacing:"-0.03em"}}>{s.n}</div>
                <p className="text-xs font-medium" style={{color:"#64748b"}}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scholar citation metrics card (auto-updated daily) */}
        <ScholarMetrics />

        <Sec title="Journal Articles"   pubs={jp}/>
        <Sec title="Conference Papers"  pubs={sc}/>
        <AbstractsSec pubs={ab}/>
      </div>
    </section>
  );
}
