/**
 * CustomCursor — premium academic cursor.
 * - Cyan dot that follows instantly
 * - Larger spring ring that follows with lag (depth effect)
 * - Ring expands on interactive elements (magnetic feel)
 * - Ring changes to an outline square on cards
 * - Fades out on touch devices
 */
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [onCard, setOnCard] = useState(false);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Dot follows instantly
  const dotX = useSpring(mouseX, { damping: 30, stiffness: 800, mass: 0.2 });
  const dotY = useSpring(mouseY, { damping: 30, stiffness: 800, mass: 0.2 });

  // Ring follows with pleasant lag
  const ringX = useSpring(mouseX, { damping: 26, stiffness: 320, mass: 0.8 });
  const ringY = useSpring(mouseY, { damping: 26, stiffness: 320, mass: 0.8 });

  useEffect(() => {
    // Disable on touch
    const isTouch = () =>
      (window.navigator.maxTouchPoints ?? 0) > 2 ||
      window.matchMedia('(pointer: coarse)').matches;
    if (isTouch()) return;

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const onEnter = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const interactive = t.closest('a, button, [data-cursor="button"], [data-cursor="portrait"], label, input, select');
      const card = t.closest('.glass-card, [data-cursor="card"], .tilt-card');
      setHovering(!!interactive);
      setOnCard(!!card && !interactive);
    };

    const onLeave = () => {
      setVisible(false);
      setHovering(false);
      setOnCard(false);
    };

    document.addEventListener('mousemove', onMove,  { passive: true });
    document.addEventListener('mouseover', onEnter, { passive: true });
    document.addEventListener('mouseleave', onLeave, { passive: true });

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onEnter);
      document.removeEventListener('mouseleave', onLeave);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      {/* Dot — snappy */}
      <motion.div
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: visible ? 1 : 0,
        }}
        animate={{
          scale: hovering ? 0 : 1,
          opacity: visible ? 1 : 0,
        }}
        transition={{ scale: { duration: 0.18 }, opacity: { duration: 0.2 } }}
        className="cursor-dot"
        aria-hidden="true"
      />

      {/* Ring — laggy follow */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: visible ? 1 : 0,
        }}
        animate={{
          width:  hovering ? 48 : onCard ? 38 : 32,
          height: hovering ? 48 : onCard ? 38 : 32,
          borderRadius: onCard ? '6px' : '50%',
          borderColor: hovering
            ? 'rgba(6,182,212,1)'
            : onCard
            ? 'rgba(6,182,212,0.55)'
            : 'rgba(6,182,212,0.7)',
          opacity: visible ? 1 : 0,
          scale: hovering ? 1.1 : 1,
        }}
        transition={{
          width:       { type: 'spring', stiffness: 300, damping: 28 },
          height:      { type: 'spring', stiffness: 300, damping: 28 },
          borderRadius:{ duration: 0.2 },
          scale:       { type: 'spring', stiffness: 400, damping: 30 },
          opacity:     { duration: 0.25 },
        }}
        className="cursor-ring"
        aria-hidden="true"
      />
    </>
  );
}
