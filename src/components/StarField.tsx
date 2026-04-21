import { useEffect, useRef } from "react";

interface Star {
  x: number; y: number;
  vx: number; vy: number;
  ox: number; oy: number;
  size: number;
  baseOpacity: number;
  phase: number;
  twinkleSpeed: number;
  r: number; g: number; b: number;
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ── Constants ─────────────────────────────────────────────────────────
    const N_STARS        = 280;   // dense field
    const MAX_DIST       = 160;   // star↔star connection range (px)
    const REPEL_RADIUS   = 150;   // cursor pushes stars within this range
    const CONNECT_RADIUS = 220;   // cursor→star line range
    const MAX_SPEED      = 2.5;
    const LINE_ALPHA     = 0.45;  // max opacity of star↔star lines
    const CURSOR_ALPHA   = 0.75;  // max opacity of cursor→star lines

    let W = 0, H = 0;
    let stars: Star[] = [];
    const mouse = { x: -999, y: -999, active: false };
    let cx = -999, cy = -999;
    let raf: number;
    let t = 0;

    // ── Resize ────────────────────────────────────────────────────────────
    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    // ── Init stars ────────────────────────────────────────────────────────
    function initStars() {
      stars = Array.from({ length: N_STARS }, (_, i) => {
        // Mix of white, cyan, and blue-tinted stars
        const kind = i % 7;
        const r = kind === 0 ? 80  : kind === 1 ? 150 : 230;
        const g = kind === 0 ? 210 : kind === 1 ? 180 : 240;
        const b = 255;
        const vx = (Math.random() - 0.5) * 0.28;
        const vy = (Math.random() - 0.5) * 0.28;
        return {
          x: Math.random() * W,   y: Math.random() * H,
          vx, vy, ox: vx, oy: vy,
          size: Math.random() * 2.2 + 0.5,
          baseOpacity: Math.random() * 0.5 + 0.45,   // 0.45–0.95
          phase: Math.random() * Math.PI * 2,
          twinkleSpeed: Math.random() * 0.014 + 0.004,
          r, g, b,
        };
      });
    }

    // ── Cursor canvas (top layer) ─────────────────────────────────────────
    const cursorCanvas = document.createElement("canvas");
    cursorCanvas.style.cssText =
      "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:99999;";
    document.body.appendChild(cursorCanvas);
    const cc = cursorCanvas.getContext("2d")!;

    function resizeCursor() {
      cursorCanvas.width  = window.innerWidth;
      cursorCanvas.height = window.innerHeight;
    }

    // Hide OS cursor
    const styleEl = document.createElement("style");
    styleEl.id = "star-cursor-hide";
    styleEl.textContent = "html,body,*{cursor:none!important}";
    document.head.appendChild(styleEl);

    // ── Draw loop ─────────────────────────────────────────────────────────
    function draw() {
      t++;
      ctx.clearRect(0, 0, W, H);
      cc.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);

      // Smooth cursor lag
      if (mouse.active) {
        cx += (mouse.x - cx) * 0.13;
        cy += (mouse.y - cy) * 0.13;
      }

      // ── Move + repel ────────────────────────────────────────────────────
      for (const s of stars) {
        if (mouse.active) {
          const dx = s.x - mouse.x;
          const dy = s.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < REPEL_RADIUS * REPEL_RADIUS && d2 > 1) {
            const dist = Math.sqrt(d2);
            const str = ((REPEL_RADIUS - dist) / REPEL_RADIUS) * 0.55;
            s.vx += (dx / dist) * str;
            s.vy += (dy / dist) * str;
          }
        }
        // Damp + drift back to original velocity
        s.vx = s.vx * 0.96 + s.ox * 0.04;
        s.vy = s.vy * 0.96 + s.oy * 0.04;
        const spd = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
        if (spd > MAX_SPEED) { s.vx *= MAX_SPEED / spd; s.vy *= MAX_SPEED / spd; }

        s.x += s.vx;  s.y += s.vy;
        if (s.x < -8) s.x = W + 8; else if (s.x > W + 8) s.x = -8;
        if (s.y < -8) s.y = H + 8; else if (s.y > H + 8) s.y = -8;
        s.phase += s.twinkleSpeed;
      }

      // ── Star ↔ star lines ───────────────────────────────────────────────
      for (let i = 0; i < stars.length - 1; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < MAX_DIST * MAX_DIST) {
            const dist = Math.sqrt(d2);
            const alpha = (1 - dist / MAX_DIST) * LINE_ALPHA;
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.strokeStyle = `rgba(6,182,212,${alpha.toFixed(3)})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      // ── Cursor → star lines ─────────────────────────────────────────────
      if (mouse.active) {
        for (const s of stars) {
          const dx = cx - s.x;
          const dy = cy - s.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < CONNECT_RADIUS * CONNECT_RADIUS) {
            const dist = Math.sqrt(d2);
            const alpha = (1 - dist / CONNECT_RADIUS) * CURSOR_ALPHA;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(s.x, s.y);
            ctx.strokeStyle = `rgba(6,182,212,${alpha.toFixed(3)})`;
            ctx.lineWidth = 1.0;
            ctx.stroke();
          }
        }
      }

      // ── Draw stars ───────────────────────────────────────────────────────
      for (const s of stars) {
        const a = s.baseOpacity * (0.4 + 0.6 * Math.abs(Math.sin(s.phase)));

        // Large outer glow for bigger stars
        if (s.size > 1.4) {
          const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 5);
          grad.addColorStop(0, `rgba(${s.r},${s.g},${s.b},${(a * 0.25).toFixed(3)})`);
          grad.addColorStop(1, `rgba(${s.r},${s.g},${s.b},0)`);
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 5, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }

        // Inner glow halo
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.r},${s.g},${s.b},${(a * 0.18).toFixed(3)})`;
        ctx.fill();

        // Star dot
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.r},${s.g},${s.b},${a.toFixed(3)})`;
        ctx.fill();
      }

      // ── Custom cursor (top canvas) ────────────────────────────────────────
      if (mouse.active) {
        const pulse   = 1 + 0.08 * Math.sin(t * 0.08);
        const R_OUTER = 16 * pulse;

        // Bloom glow
        const bloom = cc.createRadialGradient(cx, cy, 0, cx, cy, R_OUTER * 3);
        bloom.addColorStop(0,   "rgba(6,182,212,0.22)");
        bloom.addColorStop(0.4, "rgba(6,182,212,0.10)");
        bloom.addColorStop(1,   "rgba(6,182,212,0)");
        cc.beginPath();
        cc.arc(cx, cy, R_OUTER * 3, 0, Math.PI * 2);
        cc.fillStyle = bloom;
        cc.fill();

        // Outer ring
        cc.beginPath();
        cc.arc(cx, cy, R_OUTER, 0, Math.PI * 2);
        cc.strokeStyle = "rgba(6,182,212,0.95)";
        cc.lineWidth = 1.5;
        cc.stroke();

        // Tick marks
        const GAP = R_OUTER + 4, TICK = 5;
        cc.strokeStyle = "rgba(6,182,212,0.65)";
        cc.lineWidth = 1.2;
        [[0,-1],[0,1],[-1,0],[1,0]].forEach(([dx,dy]) => {
          cc.beginPath();
          cc.moveTo(cx + dx * GAP,          cy + dy * GAP);
          cc.lineTo(cx + dx * (GAP + TICK), cy + dy * (GAP + TICK));
          cc.stroke();
        });

        // Centre dot
        cc.beginPath();
        cc.arc(cx, cy, 3.5, 0, Math.PI * 2);
        cc.fillStyle = "rgba(6,182,212,1)";
        cc.fill();

        // Centre glow
        cc.beginPath();
        cc.arc(cx, cy, 9, 0, Math.PI * 2);
        cc.fillStyle = "rgba(6,182,212,0.2)";
        cc.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    // ── Bootstrap ────────────────────────────────────────────────────────
    resize();
    resizeCursor();
    initStars();
    draw();

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX; mouse.y = e.clientY;
      if (!mouse.active) { cx = e.clientX; cy = e.clientY; }
      mouse.active = true;
    };
    const onLeave  = () => { mouse.active = false; };
    const onResize = () => { resize(); resizeCursor(); };

    window.addEventListener("mousemove",  onMove);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize",     onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove",  onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize",     onResize);
      cursorCanvas.remove();
      styleEl.remove();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed", top: 0, left: 0,
        width: "100%", height: "100%",
        pointerEvents: "none", zIndex: 0,
      }}
    />
  );
}
