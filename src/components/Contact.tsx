import { personal } from '../data/content';

const LINKS = [
  { icon:'@',  label:'Email',         value:'shahzad.ali6@unibo.it',                href:'mailto:shahzad.ali6@unibo.it',                                              c:'#fcd34d', bg:'rgba(245,158,11,.12)',  bo:'rgba(245,158,11,.4)'  },
  { icon:'GH', label:'GitHub',        value:'github.com/alishahzi',                 href:'https://github.com/alishahzi',                                              c:'#c4b5fd', bg:'rgba(139,92,246,.12)',  bo:'rgba(139,92,246,.4)'  },
  { icon:'GS', label:'Google Scholar',value:'Scholar profile',                      href:'https://scholar.google.com/citations?user=n3XO81UAAAAJ&hl=en',              c:'#67e8f9', bg:'rgba(6,182,212,.12)',   bo:'rgba(6,182,212,.4)'   },
  { icon:'IN', label:'LinkedIn',      value:'linkedin.com/in/alishahzi',            href:'https://linkedin.com/in/alishahzi',                                         c:'#93c5fd', bg:'rgba(59,130,246,.12)',  bo:'rgba(59,130,246,.4)'  },
  { icon:'LP', label:'Loop',          value:'Frontiers Loop',                       href:'https://loop.frontiersin.org/people/3051308/overview',                      c:'#fca5a5', bg:'rgba(239,68,68,.12)',   bo:'rgba(239,68,68,.4)'   },
  { icon:'iD', label:'ORCID',         value:'0000-0002-0608-9515',                  href:'https://orcid.org/0000-0002-0608-9515',                                     c:'#d4ed6e', bg:'rgba(166,206,57,.14)',  bo:'rgba(166,206,57,.45)' },
  { icon:'RG', label:'ResearchGate',  value:'Shahzad-Ali-56',                       href:'https://www.researchgate.net/profile/Shahzad-Ali-56',                       c:'#5eead4', bg:'rgba(0,204,187,.12)',   bo:'rgba(0,204,187,.4)'   },
  { icon:'SC', label:'Scopus',        value:'AuthorID 57202066536',                 href:'https://www.scopus.com/authid/detail.uri?authorId=57202066536',             c:'#fdba74', bg:'rgba(249,115,22,.12)',  bo:'rgba(249,115,22,.4)'  },
  { icon:'WS', label:'Web of Science',value:'ODJ-8978-2025',                        href:'https://www.webofscience.com/wos/author/record/ODJ-8978-2025',              c:'#6ee7b7', bg:'rgba(16,185,129,.12)',  bo:'rgba(16,185,129,.4)'  },
  { icon:'X',  label:'X / Twitter',   value:'@shahzadali039',                       href:'https://x.com/shahzadali039',                                               c:'#cbd5e1', bg:'rgba(148,163,184,.12)', bo:'rgba(148,163,184,.4)' },
];

export default function Contact() {
  return (
    <section className="py-24 border-t border-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center mb-12">
          <p className="section-label">Get in touch</p>
          <h2 className="section-heading">Contacts</h2>
          <p className="text-slate-500 text-sm mt-3 leading-relaxed">
            Open to research collaborations, speaking invitations, and discussions about graph learning and AI for healthcare.
          </p>
          {personal.office && (
            <p className="text-slate-400 text-xs mt-4 leading-relaxed">
              <span className="font-semibold text-cyan-400">Office</span> · {personal.office}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-w-4xl mx-auto">
          {LINKS.map(c => (
            <a key={c.label} href={c.href}
              target={c.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="flex flex-col items-center text-center gap-2 rounded-2xl transition-all duration-200 hover:-translate-y-0.5 group"
              style={{
                padding: '1.25rem 1rem',
                background: c.bg,
                border: `1px solid ${c.bo}`,
                boxShadow: '0 2px 16px rgba(0,0,0,.25)',
              }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black transition-transform group-hover:scale-110"
                style={{
                  background: c.bg,
                  border: `1px solid ${c.bo}`,
                  color: c.c,
                  textShadow: `0 0 12px ${c.c}40`,
                }}>
                {c.icon}
              </div>
              <div className="min-w-0 w-full">
                <div className="text-xs font-bold" style={{color: c.c}}>{c.label}</div>
                <div className="text-[11px] mt-0.5 truncate max-w-full" style={{color: 'rgba(203,213,225,.6)'}}>{c.value}</div>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-10">
          <a href={personal.cvUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-cyan-500/30 text-cyan-400 font-medium text-sm hover:bg-cyan-500/10 transition-all">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            View CV
          </a>
        </div>
      </div>
    </section>
  );
}
