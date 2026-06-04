import { personal } from '../data/content';

const LINKS = [
  { icon:'@',  label:'Email',         value:'shahzad.ali6@unibo.it',                href:'mailto:shahzad.ali6@unibo.it' },
  { icon:'GH', label:'GitHub',        value:'github.com/alishahzi',                 href:'https://github.com/alishahzi' },
  { icon:'GS', label:'Google Scholar',value:'Scholar profile',                      href:'https://scholar.google.com/citations?user=n3XO81UAAAAJ&hl=en' },
  { icon:'IN', label:'LinkedIn',      value:'linkedin.com/in/alishahzi',            href:'https://linkedin.com/in/alishahzi' },
  { icon:'LP', label:'Loop',          value:'Frontiers Loop',                       href:'https://loop.frontiersin.org/people/3051308/overview' },
  { icon:'iD', label:'ORCID',         value:'0000-0002-0608-9515',                  href:'https://orcid.org/0000-0002-0608-9515' },
  { icon:'RG', label:'ResearchGate',  value:'Shahzad-Ali-56',                       href:'https://www.researchgate.net/profile/Shahzad-Ali-56' },
  { icon:'SC', label:'Scopus',        value:'AuthorID 57202066536',                 href:'https://www.scopus.com/authid/detail.uri?authorId=57202066536' },
  { icon:'WS', label:'Web of Science',value:'ODJ-8978-2025',                        href:'https://www.webofscience.com/wos/author/record/ODJ-8978-2025' },
  { icon:'X',  label:'X / Twitter',   value:'@shahzadali039',                       href:'https://x.com/shahzadali039' },
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
              className="card flex flex-col items-center text-center gap-2 hover:border-cyan-500/40 group" style={{padding:'1.25rem 1rem'}}>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-xs font-bold group-hover:bg-cyan-500/20 transition-colors">
                {c.icon}
              </div>
              <div className="min-w-0 w-full">
                <div className="text-slate-300 text-xs font-semibold">{c.label}</div>
                <div className="text-slate-600 text-[11px] mt-0.5 truncate max-w-full">{c.value}</div>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-10">
          <a href={personal.cvUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-cyan-500/30 text-cyan-400 font-medium text-sm hover:bg-cyan-500/10 transition-all">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download Full CV
          </a>
        </div>
      </div>
    </section>
  );
}
