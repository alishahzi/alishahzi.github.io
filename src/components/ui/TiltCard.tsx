import { useRef, ReactNode } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  scale?: number;
  glowColor?: string;
}

export default function TiltCard({
  children,
  className = '',
  maxTilt = 6,
  scale = 1.02,
  glowColor = 'rgba(6,182,212,0.15)',
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-300, 300], [maxTilt, -maxTilt]);
  const rotateY = useTransform(mouseX, [-300, 300], [-maxTilt, maxTilt]);

  const springRotateX = useSpring(rotateX, {
    stiffness: 100,
    damping: 30,
  });
  const springRotateY = useSpring(rotateY, {
    stiffness: 100,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    // Check for mobile
    if (window.innerWidth < 1024) {
      mouseX.set(0);
      mouseY.set(0);
      return;
    }

    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale, boxShadow: `0 0 30px ${glowColor}` }}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: 'preserve-3d',
        perspective: '1200px',
      }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
