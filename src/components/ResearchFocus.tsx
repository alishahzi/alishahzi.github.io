const AREAS = [
  { icon:'RL', color:'#06b6d4', bg:'rgba(6,182,212,0.08)',   border:'rgba(6,182,212,0.25)',   title:'Deep Reinforcement Learning',  desc:'Multi-agent DRL for real-time energy dispatch, demand response, and autonomous grid control with deployment-grade performance.' },
  { icon:'FL', color:'#3b82f6', bg:'rgba(59,130,246,0.08)',  border:'rgba(59,130,246,0.25)',  title:'Federated Learning',            desc:'Privacy-preserving distributed intelligence for energy communities — collaborative model training without exposing sensitive data.' },
  { icon:'EC', color:'#8b5cf6', bg:'rgba(139,92,246,0.08)', border:'rgba(139,92,246,0.25)', title:'Energy Communities',            desc:'AI-driven frameworks for peer-to-peer energy trading, shared storage optimization, and collective self-consumption.' },
  { icon:'SG', color:'#10b981', bg:'rgba(16,185,129,0.08)', border:'rgba(16,185,129,0.25)', title:'Smart Grid Systems',            desc:'Intelligent EMS for prosumers, microgrids, and distribution networks with predictive analytics and real-world validation.' },
  { icon:'EV', color:'#f59e0b', bg:'rgba(245,158,11,0.08)', border:'rgba(245,158,11,0.25)', title:'EV Fleet Coordination',         desc:'Optimal RL-based scheduling and smart charging for electric vehicle fleets, supporting grid stability and renewable integration.' },
  { icon:'AI', color:'#ec4899', bg:'rgba(236,72,153,0.08)', border:'rgba(236,72,153,0.25)', title:'AI for Power Systems',          desc:'Transformer architectures, GNNs, and predictive models applied to power flow, fault detection, and energy forecasting.' },
];

export default function ResearchFocus() {
  return (
    <section className="py-24 border-t border-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <p className="section-label">Expertise</p>
          <h2 className="section-heading">Research Areas</h2>
          <p className="text-slate-500 text-sm mt-3">Spanning AI methodology, power engineering, and distributed systems — with a focus on practical energy transition solutions.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {AREAS.map(a => (
            <div key={a.title} className="card">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold mb-4"
                style={{ background: a.bg, border: '1px solid ' + a.border, color: a.color }}>
                {a.icon}
              </div>
              <h3 className="text-slate-200 font-semibold text-sm mb-2">{a.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}