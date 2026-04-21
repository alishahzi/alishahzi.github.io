import type { ElementType } from 'react';
import { Award, Star, Gift, GraduationCap } from 'lucide-react';
import { awards, peerReview, professionalDevelopment } from '../data/content';
import SectionTitle from './ui/SectionTitle';
import { StaggerContainer, StaggerItem } from './ui/AnimatedSection';
import AnimatedSection from './ui/AnimatedSection';
import TiltCard from './ui/TiltCard';

const tierConfig: Record<string, {
  icon: ElementType; iconColor: string; iconBg: string; border: string; label: string; glow: string;
}> = {
  major: { icon: Star,         iconColor: 'text-amber-400',   iconBg: 'bg-amber-500/10 border-amber-500/20',  border: 'border-amber-500/20',  label: 'Major Award',   glow: 'rgba(251,191,36,0.2)' },
  award: { icon: Award,        iconColor: 'text-cyan-400',    iconBg: 'bg-cyan-500/10 border-cyan-500/20',    border: 'border-cyan-500/20',   label: 'Award',        glow: 'rgba(6,182,212,0.2)' },
  grant: { icon: Gift,         iconColor: 'text-violet-400',  iconBg: 'bg-violet-500/10 border-violet-500/20',border: 'border-violet-500/20', label: 'Research Grant', glow: 'rgba(139,92,246,0.2)' },
};

export default function Awards() {
  return (
    <section id="awards" className="relative py-24 overflow-hidden" style={{ background: 'rgba(11,21,37,0.88)' }}>
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 50% 40% at 50% 20%, rgba(251,191,36,0.03) 0%, transparent 70%)',
        }}
      />

      <div className="section-container relative z-10">
        <div className="flex flex-col gap-12">
          <SectionTitle
            eyebrow="Recognition"
            title="Awards, Grants & Honors"
            subtitle="Competitive fellowships, research grants, and academic distinctions."
            accentWord="Awards"
          />

          {/* Award cards */}
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4" staggerDelay={0.1}>
            {awards.map((award) => {
              const tc = tierConfig[award.tier] ?? tierConfig['award'];
              const Icon = tc.icon;
              return (
                <StaggerItem key={award.id}>
                  <TiltCard glowColor={tc.glow}>
                    <div className={`glass-card p-6 h-full flex flex-col gap-4 border ${tc.border} hover:-translate-y-0.5 transition-transform duration-200`}>
                      <div className="flex items-start gap-4">
                        <div className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center border ${tc.iconBg}`}>
                          <Icon className={`w-5 h-5 ${tc.iconColor}`} />
                        </div>
                        <div className="flex flex-col gap-1 flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <h3 className="font-display font-semibold text-slate-100 text-sm leading-snug">
                              {award.title}
                            </h3>
                            <span className="shrink-0 font-mono text-xs text-slate-500 bg-slate-800/60 px-2 py-0.5 rounded">
                              {award.year}
                            </span>
                          </div>
                          <p className="text-xs font-medium text-slate-400">{award.org}</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{award.description}</p>
                    </div>
                  </TiltCard>
                </StaggerItem>
              );
            })}
          </StaggerContainer>

          {/* Professional Development */}
          <AnimatedSection delay={0.2}>
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-indigo-400" />
                </div>
                <h3 className="font-display font-semibold text-slate-100 text-sm">Professional Development & Summer Schools</h3>
              </div>
              <div className="flex flex-col gap-3">
                {professionalDevelopment.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 pb-3 border-b border-slate-800/50 last:border-0 last:pb-0 hover:bg-slate-800/30 -mx-6 px-6 py-2 rounded transition-colors">
                    <span className="shrink-0 mt-1.5 w-1 h-1 rounded-full bg-indigo-400/60" />
                    <div>
                      <p className="text-xs text-slate-200 font-medium">{item.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.org} · {item.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
