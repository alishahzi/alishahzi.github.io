import { useEffect, useRef, useState } from 'react';

interface EnergyNode {
  id: string;
  label: string;
  sublabel: string;
  color: string;
  angle: number;
}

const ENERGY_NODES: EnergyNode[] = [
  { id: 'solar',     label: 'Solar PV',    sublabel: 'Generation',  color: '#f59e0b', angle: 270 },
  { id: 'wind',      label: 'Wind',        sublabel: 'Generation',  color: '#06b6d4', angle: 330 },
  { id: 'storage',   label: 'Storage',     sublabel: 'Battery',     color: '#10b981', angle: 30  },
  { id: 'grid',      label: 'Grid',        sublabel: 'Network',     color: '#3b82f6', angle: 90  },
  { id: 'ev',        label: 'EV Fleet',    sublabel: 'Transport',   color: '#f97316', angle: 150 },
  { id: 'community', label: 'Community',   sublabel: 'Prosumer',    color: '#8b5cf6', angle: 210 },
];

const NODE_ICONS: Record<string, string> = {
  solar:     'SUN',
  wind:      'WIND',
  storage:   'BAT',
  grid:      'GRID',
  ev:        'EV',
  community: 'COM',
};

interface Particle {
  fromAngle: number;
  toAngle: number;
  progress: number;
  speed: number;
  color: string;
  size: number;
}

function toRad(deg: number) { return (deg * Math.PI) / 180; }

export default function EnergyParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const [size, setSize] = useState({ w: 500, h: 500 });

  useEffect(() => {
    const container = canvasRef.current?.parentElement;
    if (!container) return;
    const obs = new ResizeObserver(entries => {
      const { width } = entries[0].contentRect;
      const s = Math.min(width, 520);
      setSize({ w: s, h: s });
    });
    obs.observe(container);
    const { width } = container.getBoundingClientRect();
    const s = Math.min(width, 520);
    setSize({ w: s, h: s });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cx = size.w / 2;
    const cy = size.h / 2;
    const R = Math.min(cx, cy) * 0.62;
    const nodeR = Math.min(cx, cy) * 0.11;

    function nodePos(angle: number) {
      return {
        x: cx + R * Math.cos(toRad(angle)),
        y: cy + R * Math.sin(toRad(angle)),
      };
    }

    // Initialize particles
    if (particlesRef.current.length === 0) {
      for (let i = 0; i < 20; i++) {
        const from = ENERGY_NODES[Math.floor(Math.random() * ENERGY_NODES.length)];
        const to = ENERGY_NODES[Math.floor(Math.random() * ENERGY_NODES.length)];
        if (from.id === to.id) continue;
        particlesRef.current.push({
          fromAngle: from.angle,
          toAngle: to.angle,
          progress: Math.random(),
          speed: 0.003 + Math.random() * 0.004,
          color: from.color,
          size: 2 + Math.random() * 2,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, size.w, size.h);

      // Draw connection lines
      ENERGY_NODES.forEach(nodeA => {
        ENERGY_NODES.forEach(nodeB => {
          if (nodeA.angle >= nodeB.angle) return;
          const a = nodePos(nodeA.angle);
          const b = nodePos(nodeB.angle);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = 'rgba(255,255,255,0.04)';
          ctx.lineWidth = 1;
          ctx.stroke();
        });
      });

      // Draw center ring
      ctx.beginPath();
      ctx.arc(cx, cy, nodeR * 1.2, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(6,182,212,0.3)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.02, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(6,182,212,0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Update + draw particles
      particlesRef.current.forEach(p => {
        p.progress += p.speed;
        if (p.progress >= 1) {
          p.progress = 0;
          const from = ENERGY_NODES[Math.floor(Math.random() * ENERGY_NODES.length)];
          const to = ENERGY_NODES[Math.floor(Math.random() * ENERGY_NODES.length)];
          p.fromAngle = from.angle;
          p.toAngle = to.angle;
          p.color = from.color;
        }

        const from = nodePos(p.fromAngle);
        const to = nodePos(p.toAngle);
        const t = p.progress;
        const px = from.x + (to.x - from.x) * t;
        const py = from.y + (to.y - from.y) * t;

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + 'cc';
        ctx.fill();

        // Trail
        const t2 = Math.max(0, t - 0.05);
        const tx = from.x + (to.x - from.x) * t2;
        const ty = from.y + (to.y - from.y) * t2;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(tx, ty);
        ctx.strokeStyle = p.color + '44';
        ctx.lineWidth = p.size * 0.7;
        ctx.stroke();
      });

      // Draw nodes
      ENERGY_NODES.forEach(node => {
        const { x, y } = nodePos(node.angle);

        // Glow
        const grd = ctx.createRadialGradient(x, y, 0, x, y, nodeR * 1.6);
        grd.addColorStop(0, node.color + '33');
        grd.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(x, y, nodeR * 1.6, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Circle background
        ctx.beginPath();
        ctx.arc(x, y, nodeR, 0, Math.PI * 2);
        ctx.fillStyle = '#0d1f35';
        ctx.fill();
        ctx.strokeStyle = node.color + 'aa';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Icon text (short ASCII label)
        ctx.fillStyle = node.color;
        ctx.font = `bold ${nodeR * 0.38}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(NODE_ICONS[node.id] || '?', x, y - nodeR * 0.1);

        // Node label below circle
        ctx.fillStyle = '#c9d1d9';
        ctx.font = `${nodeR * 0.32}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(node.label, x, y + nodeR + 5);

        ctx.fillStyle = node.color + 'aa';
        ctx.font = `${nodeR * 0.26}px sans-serif`;
        ctx.fillText(node.sublabel, x, y + nodeR + 5 + nodeR * 0.36);
      });

      // Center label
      ctx.fillStyle = '#06b6d4';
      ctx.font = `bold ${nodeR * 0.55}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('AI', cx, cy - nodeR * 0.15);
      ctx.fillStyle = '#8b949e';
      ctx.font = `${nodeR * 0.3}px sans-serif`;
      ctx.fillText('Energy', cx, cy + nodeR * 0.3);

      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [size]);

  return (
    <div style={{ width: '100%', maxWidth: '520px', margin: '0 auto', position: 'relative' }}>
      <canvas
        ref={canvasRef}
        width={size.w}
        height={size.h}
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />
    </div>
  );
}
