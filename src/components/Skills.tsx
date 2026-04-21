import { Code2, Brain, Zap, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { skills } from '../data/content';
import SectionTitle from './ui/SectionTitle';
import AnimatedSection, { StaggerContainer, StaggerItem } from './ui/AnimatedSection';
import TiltCard from './ui/TiltCard';

function SkillBar({ name, level, detail }: { name: string; level: number; detail: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px 0px' });

  return (
    <div ref={ref} className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-200 font-medium">{name}</span>
        <span className="text-xs font-mono text-slate-500">{level}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400"
          initial={{ width: 0 }}
          animate={isInView ? { width: `${level}%` } : {}}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
      <p className="text-[11px] text-slate-500 leading-tight">{detail}</p>
    </div>
  );
}

const groups = [
  {
    id:    'prog',
    label: 'Programming & Simulation',
    icon:  Code2,
    color: 'cyan',
    items: skills.programming,
  },
  {
    id:    'aiml',
    label: 'AI / Machine Learning',
    icon:  Brain,
    color: 'indigo',
    items: skills.aiml,
  },
  {
    id:    'power',
    label: 'Power & Energy Tools',
    icon:  Zap,
    color: 'amber',
    items: skills.powerEnergy,
  },
];

const colorConf: Record<string, { iconBg: string; icon: string; border: string; glow: string }> = {
  cyan:   { iconBg: 'bg-cyan-500/10',   icon: 'text-cyan-400',   border: 'border-cyan-500/20', glow: 'rgba(6,182,212,0.2)' },
  indigo: { iconBg: 'bg-indigo-500/10', icon: 'text-indigo-400', border: 'border-indigo-500/20', glow: 'rgba(129,140,248,0.2)' },
  amber:  { iconBg: 'bg-amber-500/10',  icon: 'text-amber-400',  border: 'border-amber-500/20', glow: 'rgba(251,191,36,0.2)' },
};

export default function Skills() {
  return (
    <section id="skills" className="relative py-24 overflow-hidden" style={{ background: 'rgba(10,22,40,0.90)' }}>
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 40% 50% at 60% 50%, rgba(129,140,248,0.03) 0%, transparent 70%)',
        }}
      />

      <div className="section-container relative z-10">
        <div className="flex flex-col gap-12">
          <SectionTitle
            eyebrow="Skills & Tools"
            title="Technical Toolkit"
            subtitle="Spanning ML frameworks, power engineering software, and programming environments."
            accentWord="Technical"
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {groups.map((group, gi) => {
              const Icon = group.icon;
              const c = colorConf[group.color];
              return (
                <AnimatedSection key={group.id} delay={gi * 0.1}>
                  <TiltCard glowColor={c.glow}>
                    <div className="glass-card p-6 h-full flex flex-col gap-5">
                      {/* Group header */}
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg ${c.iconBg} border ${c.border} flex items-center justify-center`}>
                          <Icon className={`w-4.5 h-4.5 ${c.icon}`} />
                        </div>
                        <h3 className="font-display font-semibold text-slate-100 text-sm">{group.label}</h3>
                      </div>

                      {/* Skill bars */}
                      <div className="flex flex-col gap-4">
                        {group.items.map((item) => (
                          <SkillBar key={item.name} name={item.name} level={item.level} detail={item.detail} />
                        ))}
                      </div>
                    </div>
                  </TiltCard>
                </AnimatedSection>
              );
            })}
          </div>

          {/* Domain expertise grid */}
          <AnimatedSection delay={0.3}>
            <TiltCard>
              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                    <Layers className="w-4 h-4 text-violet-400" />
                  </div>
                  <h3 className="font-display font-semibold text-slate-100 text-sm">Power & Energy Domain Expertise</h3>
                </div>
                <StaggerContainer className="flex flex-wrap gap-2" staggerDelay={0.04}>
                  {skills.domains.map((domain) => (
                    <StaggerItem key={domain}>
                      <motion.span
                        className="inline-flex px-3 py-1.5 rounded-lg border border-slate-700/60 bg-slate-800/40 text-xs text-slate-300 font-medium hover:border-cyan-500/30 hover:text-cyan-400 hover:bg-cyan-500/5 transition-all duration-200 cursor-default"
                        whileHover={{ scale: 1.05, y: -2 }}
                      >
                        {domain}
                      </motion.span>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </TiltCard>
          </AnimatedSection>

          {/* Languages */}
          <AnimatedSection delay={0.35}>
            <TiltCard>
              <div className="glass-card p-6">
                <p className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-4">Languages</p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { lang: 'English',          level: 'Fluent', color: 'cyan' },
                    { lang: 'Urdu',             level: 'Native', color: 'emerald' },
                    { lang: 'Mandarin Chinese', level: 'Basic',  color: 'amber' },
                    { lang: 'Italian',          level: 'Basic',  color: 'indigo' },
                  ].map(({ lang, level, color }) => (
                    <motion.div
                      key={lang}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/40 hover:border-slate-600 transition-colors"
                      whileHover={{ y: -2 }}
                    >
                      <span className="text-sm text-slate-200 font-medium">{lang}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        color === 'cyan' ? 'bg-cyan-500/10 text-cyan-400' :
                        color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400' :
                        color === 'amber' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-indigo-500/10 text-indigo-400'
                      }`}>{level}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TiltCard>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
