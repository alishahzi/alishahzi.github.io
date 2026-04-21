import { useEffect } from "react";
import { personal } from "../data/content";

const SOCIAL = [
  { label: "Scholar",      href: "https://scholar.google.com/citations?user=shahzadali",                     color: "#06b6d4", icon: "GS" },
  { label: "Scopus",       href: "https://www.scopus.com/authid/detail.uri?authorId=57202066536",            color: "#00ccbb", icon: "SC" },
  { label: "WoS",          href: "https://www.webofscience.com/wos/author/record/ODJ-8978-2025",             color: "#10b981", icon: "WS" },
  { label: "ORCID",        href: "https://orcid.org/0000-0002-0608-9515",                                    color: "#a6ce39", icon: "iD" },
  { label: "LinkedIn",     href: "https://www.linkedin.com/in/shahzadali21",                                 color: "#3b82f6", icon: "in" },
  { label: "GitHub",       href: "https://github.com/alishahzi",                                             color: "#8b5cf6", icon: "GH" },
  { label: "Email",        href: `mailto:${personal.email}`,                                                color: "#f59e0b", icon: "@"  },
];

const TAGS = [
  "Graph Neural Networks","Medical Imaging","Alzheimer's Disease",
  "Deep Learning","Interpretable AI","Neuroimaging",
];

export default function Hero() {
  useEffect(() => {
    const id = "hero-anims";
    if (!document.getElementById(id)) {
      const s = document.createElement("style");
      s.id = id;
      s.textContent = `
        @keyframes float-hero { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes glow-ring  { 0%,100%{box-shadow:0 0 30px rgba(6,182,212,.45),0 0 60px rgba(6,182,212,.15)} 50%{box-shadow:0 0 60px rgba(6,182,212,.85),0 0 100px rgba(6,182,212,.35)} }
        @keyframes fade-up    { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        .hero-line{animation:fade-up .6s ease both}
        .hero-line:nth-child(1){animation-delay:.05s}
        .hero-line:nth-child(2){animation-delay:.15s}
        .hero-line:nth-child(3){animation-delay:.25s}
        .hero-line:nth-child(4){animation-delay:.35s}
        .hero-line:nth-child(5){animation-delay:.45s}
        .hero-line:nth-child(6){animation-delay:.55s}
        .hero-line:nth-child(7){animation-delay:.65s}
      `;
      document.head.appendChild(s);
    }
    return () => document.getElementById("hero-anims")?.remove();
  }, []);

  const rawTitle = personal.title || "";
  const parts = rawTitle.split(/[··——––|]/);
  const role = parts[0]?.trim() || rawTitle;
  const affiliation = parts[1]?.trim() || "";

  const summaryParas = (personal.summary || "").split(/\n+/).filter(Boolean);
  const heroSummary = summaryParas[0] || "";

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute rounded-full" style={{width:600,height:600,background:"radial-gradient(circle,rgba(6,182,212,.08) 0%,transparent 70%)",top:"-15%",right:"0%"}}/>
        <div className="absolute rounded-full" style={{width:400,height:400,background:"radial-gradient(circle,rgba(99,102,241,.06) 0%,transparent 70%)",bottom:"10%",left:"-5%"}}/>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-28 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div className="order-2 lg:order-1">
            <div className="hero-line flex flex-wrap gap-2 mb-6">
              {[
                {l:"PhD Researcher",           bg:"rgba(6,182,212,.12)",  bo:"rgba(6,182,212,.45)",  c:"#67e8f9"},
                {l:"Università di Bologna",   bg:"rgba(59,130,246,.12)", bo:"rgba(59,130,246,.45)", c:"#93c5fd"},
                {l:"IRCCS San Martino",       bg:"rgba(139,92,246,.12)", bo:"rgba(139,92,246,.45)", c:"#c4b5fd"},
                {l:"Medical Imaging AI",      bg:"rgba(16,185,129,.12)", bo:"rgba(16,185,129,.45)", c:"#6ee7b7"},
              ].map(b=>(
                <span key={b.l} className="text-xs px-3 py-1.5 rounded-full font-semibold tracking-wide"
                  style={{background:b.bg,border:`1px solid ${b.bo}`,color:b.c}}>{b.l}</span>
              ))}
            </div>

            <div className="hero-line">
              <p className="text-xs font-bold tracking-[.35em] uppercase mb-2" style={{color:"#06b6d4"}}>Hello, I am</p>
              <h1 className="font-black text-white leading-[1.05] mb-3"
                style={{fontSize:"clamp(2.6rem,5.5vw,4rem)",letterSpacing:"-0.02em"}}>
                {personal.name}
              </h1>
            </div>

            <div className="hero-line mb-5">
              <p className="font-bold mb-1" style={{fontSize:"1.2rem",color:"#22d3ee",letterSpacing:"-0.01em"}}>{role}</p>
              {affiliation && <p className="text-sm font-medium" style={{color:"#475569"}}>{affiliation}</p>}
            </div>

            {heroSummary && (
              <div className="hero-line mb-6">
                <p className="text-[0.93rem] leading-[1.75] max-w-xl" style={{color:"#94a3b8"}}>
                  {heroSummary.length > 260 ? heroSummary.slice(0,260)+"..." : heroSummary}
                </p>
              </div>
            )}

            <div className="hero-line flex flex-wrap gap-2 mb-7">
              {TAGS.map(t=>(
                <span key={t} className="text-xs px-3 py-1.5 rounded-full font-medium"
                  style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.12)",color:"#94a3b8"}}>{t}</span>
              ))}
            </div>

            <div className="hero-line flex flex-wrap gap-2 mb-8">
              {SOCIAL.map(s=>(
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold transition-all duration-200 hover:scale-105"
                  style={{background:s.color+"18",border:`1px solid ${s.color}50`,color:s.color}}>
                  <span style={{fontWeight:900,fontSize:"10px"}}>{s.icon}</span>{s.label}
                </a>
              ))}
            </div>

            <div className="hero-line flex flex-wrap gap-3">
              <a href="#research"
                className="px-8 py-3 rounded-xl font-bold text-sm text-slate-900 transition-all duration-200 hover:scale-105 hover:brightness-110"
                style={{background:"linear-gradient(135deg,#06b6d4,#3b82f6)",boxShadow:"0 4px 30px rgba(6,182,212,.4)"}}>
                View Research
              </a>
              <a href="#about"
                className="px-8 py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-105"
                style={{border:"1px solid rgba(6,182,212,.4)",color:"#22d3ee",background:"rgba(6,182,212,.05)"}}>
                About Me
              </a>
              {personal.cvUrl && (
                <a href={personal.cvUrl} target="_blank" rel="noopener noreferrer"
                  className="px-8 py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-105"
                  style={{border:"1px solid rgba(148,163,184,.25)",color:"#cbd5e1",background:"rgba(255,255,255,.03)"}}>
                  Download CV
                </a>
              )}
            </div>
          </div>

          {/* RIGHT — Avatar */}
          <div className="order-1 lg:order-2 flex flex-col items-center gap-5">
            <div style={{animation:"float-hero 7s ease-in-out infinite"}}>
              <div className="relative">
                <div className="absolute inset-0 rounded-full scale-125 blur-3xl"
                  style={{background:"radial-gradient(circle,rgba(6,182,212,.3) 0%,rgba(59,130,246,.15) 55%,transparent 80%)"}}/>
                <div className="relative overflow-hidden rounded-full"
                  style={{width:"clamp(255px,30vw,320px)",height:"clamp(255px,30vw,320px)",
                    border:"3px solid rgba(6,182,212,.8)",animation:"glow-ring 5s ease-in-out infinite"}}>
                  <div className="absolute inset-0" style={{background:"linear-gradient(145deg,#060d1e,#0b1a30)"}}>
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <g stroke="rgba(6,182,212,.18)" strokeWidth="0.5" fill="none">
                        <line x1="15" y1="25" x2="55" y2="8"/>  <line x1="55" y1="8"  x2="88" y2="35"/>
                        <line x1="15" y1="25" x2="45" y2="58"/> <line x1="45" y1="58" x2="78" y2="78"/>
                        <line x1="78" y1="78" x2="88" y2="35"/> <line x1="45" y1="58" x2="88" y2="35"/>
                        <line x1="8"  y1="68" x2="45" y2="58"/> <line x1="15" y1="25" x2="8"  y2="68"/>
                        <line x1="35" y1="12" x2="55" y2="8"/>  <line x1="68" y1="52" x2="78" y2="78"/>
                        <line x1="55" y1="8"  x2="68" y2="52"/> <line x1="8"  y1="68" x2="25" y2="88"/>
                        <line x1="25" y1="88" x2="45" y2="58"/> <line x1="35" y1="12" x2="15" y2="25"/>
                      </g>
                      <g fill="rgba(6,182,212,.9)">
                        <circle cx="15" cy="25" r="1.6"/><circle cx="55" cy="8"  r="1.6"/>
                        <circle cx="88" cy="35" r="1.6"/><circle cx="45" cy="58" r="1.6"/>
                        <circle cx="78" cy="78" r="1.6"/><circle cx="8"  cy="68" r="1.6"/>
                        <circle cx="35" cy="12" r="1.6"/><circle cx="68" cy="52" r="1.6"/>
                        <circle cx="25" cy="88" r="1.6"/>
                      </g>
                    </svg>
                  </div>
                  {personal.image ? (
                    <img src={personal.image} alt={personal.name}
                      className="absolute inset-0 w-full h-full object-cover object-top"
                      onError={(e)=>{(e.target as HTMLImageElement).style.display="none";}}/>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center"
                      style={{fontSize:"5rem",fontWeight:900,color:"#06b6d4"}}>
                      {personal.initials || "SA"}
                    </div>
                  )}
                </div>
                <div className="absolute w-3.5 h-3.5 rounded-full"
                  style={{background:"#06b6d4",top:"-5px",left:"50%",transform:"translateX(-50%)",boxShadow:"0 0 12px #06b6d4"}}/>
                <div className="absolute w-2.5 h-2.5 rounded-full"
                  style={{background:"#3b82f6",bottom:"12px",right:"-5px",boxShadow:"0 0 8px #3b82f6"}}/>
                <div className="absolute w-2.5 h-2.5 rounded-full"
                  style={{background:"#8b5cf6",bottom:"12px",left:"-5px",boxShadow:"0 0 8px #8b5cf6"}}/>
              </div>
            </div>

            {personal.location && (
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium"
                style={{background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",color:"#94a3b8"}}>
                <span className="w-2 h-2 rounded-full animate-pulse shrink-0"
                  style={{background:"#06b6d4",boxShadow:"0 0 8px #06b6d4"}}/>
                {personal.location}
              </div>
            )}

            <div className="w-full max-w-xs px-5 py-4 rounded-2xl text-center"
              style={{background:"rgba(6,182,212,.06)",border:"1px solid rgba(6,182,212,.2)"}}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{color:"rgba(6,182,212,.6)"}}>Current Focus</p>
              <p className="text-xs leading-relaxed" style={{color:"#94a3b8"}}>
                Graph Neural Networks and multimodal neuroimaging for{" "}
                <span style={{color:"#67e8f9",fontWeight:600}}>Alzheimer&rsquo;s disease diagnosis</span>
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
