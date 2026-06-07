import { useEffect, useRef, useState } from "react";

export interface Slide {
  src: string;            // path relative to /public, e.g. "/news/sussex.jpg"
  alt?: string;           // accessibility label
  caption?: string;       // short text overlay
  href?: string;          // optional click-through, e.g. anchor #news or external
}

interface Props {
  slides: Slide[];
  intervalMs?: number;    // auto-advance interval, default 5000
  height?: string;        // tailwind/css value for slide height, default responsive
}

/**
 * Auto-advancing image carousel.
 *
 *  • crossfade transitions
 *  • pause on hover / focus
 *  • prev/next arrows + dot indicators
 *  • caption banner at the bottom
 *  • renders nothing if `slides` is empty
 */
export default function Slideshow({ slides, intervalMs = 5000 }: Props) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    timer.current = window.setTimeout(() => {
      setIdx(i => (i + 1) % slides.length);
    }, intervalMs);
    return () => { if (timer.current) window.clearTimeout(timer.current); };
  }, [idx, paused, slides.length, intervalMs]);

  if (!slides || slides.length === 0) return null;

  const go = (delta: number) =>
    setIdx(i => (i + delta + slides.length) % slides.length);

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
      {slides.map((s, i) => {
        const isActive = i === idx;
        const img = (
          <img
            src={s.src}
            alt={s.alt || s.caption || `slide ${i + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
            loading={i === 0 ? "eager" : "lazy"}
            onError={e => {
              // hide broken images so the slideshow keeps working even if a
              // file is missing from public/news/
              (e.target as HTMLImageElement).style.opacity = "0";
            }}
          />
        );
        return (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{
              opacity: isActive ? 1 : 0,
              pointerEvents: isActive ? "auto" : "none",
            }}
            aria-hidden={!isActive}
          >
            {s.href
              ? <a href={s.href} target={s.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">{img}</a>
              : img}

            {s.caption && (
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
                  {s.caption}
                </p>
              </div>
            )}
          </div>
        );
      })}

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
                onClick={() => setIdx(i)}
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
