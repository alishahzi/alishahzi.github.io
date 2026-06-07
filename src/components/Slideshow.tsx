import { useEffect, useRef, useState } from "react";

export interface Slide {
  src: string;            // path relative to /public, e.g. "/news/sussex.jpg"
  alt?: string;           // accessibility label
  caption?: string;       // short text overlay
  href?: string;          // optional click-through, e.g. anchor #news or external
}

interface Props {
  slides: Slide[];
  intervalMs?: number;    // auto-advance interval, default 3500
}

/**
 * Auto-advancing image carousel — lightweight version.
 *
 *  • Only the current slide is rendered (plus an invisible preload of the next).
 *    Keeps memory + paint cost low so the cursor and StarField stay smooth.
 *  • Uses `object-contain` so portrait/landscape images both display fully,
 *    with the section's dark background acting as letterboxing.
 *  • Pauses auto-advance on hover / focus.
 *  • Manual arrows + dot indicators.
 *  • Renders nothing if `slides` is empty.
 */
export default function Slideshow({ slides, intervalMs = 3500 }: Props) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [animKey, setAnimKey] = useState(0);   // bumps to restart fade-in animation
  const timer = useRef<number | null>(null);

  // auto-advance
  useEffect(() => {
    if (paused || slides.length <= 1) return;
    timer.current = window.setTimeout(() => {
      setIdx(i => (i + 1) % slides.length);
      setAnimKey(k => k + 1);
    }, intervalMs);
    return () => { if (timer.current) window.clearTimeout(timer.current); };
  }, [idx, paused, slides.length, intervalMs]);

  if (!slides || slides.length === 0) return null;

  const go = (delta: number) => {
    setIdx(i => (i + delta + slides.length) % slides.length);
    setAnimKey(k => k + 1);
  };
  const jumpTo = (i: number) => {
    setIdx(i);
    setAnimKey(k => k + 1);
  };

  const current = slides[idx];
  const next = slides[(idx + 1) % slides.length];

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl mb-12"
      style={{
        border: "1px solid rgba(100,116,139,.25)",
        boxShadow: "0 8px 40px rgba(0,0,0,.4)",
        aspectRatio: "16 / 9",
        background: "linear-gradient(145deg,#060d1e,#0b1a30)",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* keyframes for fade-in (scoped — emitted once, browsers dedupe identical content) */}
      <style>{`
        @keyframes slideshow-fade-in {
          from { opacity: 0; transform: scale(1.012); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* active slide */}
      <div
        key={animKey}
        className="absolute inset-0"
        style={{ animation: "slideshow-fade-in 600ms ease-out both" }}
      >
        {current.href ? (
          <a href={current.href} target={current.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
            <img
              src={current.src}
              alt={current.alt || current.caption || `slide ${idx + 1}`}
              className="absolute inset-0 w-full h-full"
              style={{ objectFit: "contain" }}
              decoding="async"
              loading="eager"
              onError={e => { (e.target as HTMLImageElement).style.opacity = "0"; }}
            />
          </a>
        ) : (
          <img
            src={current.src}
            alt={current.alt || current.caption || `slide ${idx + 1}`}
            className="absolute inset-0 w-full h-full"
            style={{ objectFit: "contain" }}
            decoding="async"
            loading="eager"
            onError={e => { (e.target as HTMLImageElement).style.opacity = "0"; }}
          />
        )}

        {current.caption && (
          <div
            className="absolute left-0 right-0 bottom-0 px-6 py-4"
            style={{
              background: "linear-gradient(to top, rgba(4,8,15,.95) 0%, rgba(4,8,15,.7) 60%, transparent 100%)",
            }}
          >
            <p
              className="text-sm md:text-base font-semibold leading-snug max-w-3xl"
              style={{ color: "#f1f5f9", textShadow: "0 1px 8px rgba(0,0,0,.6)" }}
            >
              {current.caption}
            </p>
          </div>
        )}
      </div>

      {/* invisible preload of the next image — keeps transitions snappy without
          paying the cost of having every slide mounted at once */}
      {slides.length > 1 && (
        <img
          src={next.src}
          alt=""
          aria-hidden="true"
          decoding="async"
          loading="eager"
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            opacity: 0,
            pointerEvents: "none",
          }}
        />
      )}

      {slides.length > 1 && (
        <>
          {/* prev */}
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => go(-1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-200 hover:scale-110"
            style={{
              background: "rgba(4,8,15,.55)",
              border: "1px solid rgba(6,182,212,.4)",
              color: "#67e8f9",
              backdropFilter: "blur(6px)",
            }}
          >
            ‹
          </button>
          {/* next */}
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => go(1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-200 hover:scale-110"
            style={{
              background: "rgba(4,8,15,.55)",
              border: "1px solid rgba(6,182,212,.4)",
              color: "#67e8f9",
              backdropFilter: "blur(6px)",
            }}
          >
            ›
          </button>
          {/* dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === idx}
                onClick={() => jumpTo(i)}
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: i === idx ? 24 : 8,
                  background: i === idx ? "#06b6d4" : "rgba(255,255,255,.4)",
                  boxShadow: i === idx ? "0 0 10px rgba(6,182,212,.6)" : "none",
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
