import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  accentWord?: string; // word in title to highlight with gradient
}

export default function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  accentWord,
}: SectionTitleProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px 0px' });
  const alignClass = align === 'center' ? 'items-center text-center' : 'items-start';

  // Highlight accent word in title
  const renderTitle = () => {
    if (!accentWord) return title;
    const parts = title.split(accentWord);
    return (
      <>
        {parts[0]}
        <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          {accentWord}
        </span>
        {parts[1]}
      </>
    );
  };

  return (
    <motion.div
      ref={ref}
      className={`flex flex-col gap-3 ${alignClass}`}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number] }}
    >
      {eyebrow && (
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {align === 'left' && (
            <span className="w-8 h-px bg-cyan-500/60" />
          )}
          <span className="font-mono text-xs font-medium tracking-[0.2em] text-cyan-400 uppercase">
            {eyebrow}
          </span>
        </motion.div>
      )}

      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-100 leading-tight tracking-tight">
        {renderTitle()}
      </h2>

      {subtitle && (
        <motion.p
          className="text-base sm:text-lg text-slate-400 font-light max-w-2xl leading-relaxed"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          {subtitle}
        </motion.p>
      )}

      {/* Decorative underline with spring animation */}
      <motion.div
        className="flex items-center gap-1.5 mt-1"
        style={{ originX: align === 'center' ? 0.5 : 0 }}
        initial={{ width: 0 }}
        animate={isInView ? { width: 'auto' } : {}}
        transition={{ duration: 0.8, delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
      >
        <motion.span
          className="h-0.5 bg-cyan-500 rounded-full"
          initial={{ width: 0 }}
          animate={isInView ? { width: 48 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        />
        <motion.span
          className="h-0.5 bg-cyan-500/40 rounded-full"
          initial={{ width: 0 }}
          animate={isInView ? { width: 12 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        />
        <motion.span
          className="h-0.5 bg-cyan-500/20 rounded-full"
          initial={{ width: 0 }}
          animate={isInView ? { width: 6 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        />
      </motion.div>
    </motion.div>
  );
}
