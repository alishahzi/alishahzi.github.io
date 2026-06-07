import { useState } from "react";
import { news, newsGallery } from "../data/content";
import { inlineLinks } from "../lib/inlineLinks";
import Slideshow from "./Slideshow";

const INITIAL_VISIBLE = 6;

export default function News() {
  const [expanded, setExpanded] = useState(false);
  if (!news || news.length === 0) return null;

  const visible = expanded ? news : news.slice(0, INITIAL_VISIBLE);
  const hidden = news.length - INITIAL_VISIBLE;

  return (
    <section id="news" className="py-24" style={{ background: "rgba(10,15,30,0.7)" }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-[.3em] uppercase mb-3" style={{ color: "#06b6d4" }}>Recent activity</p>
          <h2 className="text-4xl font-black text-white mb-4" style={{ letterSpacing: "-0.02em" }}>News &amp; Updates</h2>
          <div className="w-16 h-1 rounded-full mx-auto mb-4" style={{ background: "linear-gradient(90deg,#06b6d4,#3b82f6)" }} />
          <p className="text-sm max-w-md mx-auto" style={{ color: "#64748b" }}>
            Conferences, talks, training, and milestones — what I've been up to recently.
          </p>
        </div>

        {newsGallery && newsGallery.length > 0 && (
          <Slideshow slides={newsGallery} />
        )}

        <div className="relative">
          {/* timeline rail */}
          <div className="absolute left-7 top-0 bottom-0 w-px hidden md:block"
            style={{ background: "linear-gradient(to bottom,transparent,rgba(6,182,212,.35) 6%,rgba(6,182,212,.35) 94%,transparent)" }} />

          <ul className="space-y-5">
            {visible.map((n, i) => (
              <li key={n.id || i} className="relative md:pl-20">
                {/* timeline dot */}
                <div className="absolute left-4 top-6 w-6 h-6 rounded-full hidden md:flex items-center justify-center"
                  style={{ border: "2px solid rgba(6,182,212,.7)", background: "#04080f", boxShadow: "0 0 14px rgba(6,182,212,.35)" }}>
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#06b6d4" }} />
                </div>

                <div className="rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: "rgba(12,20,38,0.8)", border: "1px solid rgba(100,116,139,.2)", boxShadow: "0 4px 24px rgba(0,0,0,.35)" }}>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:gap-5">
                    <span className="text-xs font-bold tracking-wide px-3 py-1.5 rounded-full shrink-0 self-start mb-2 sm:mb-0"
                      style={{
                        background: "rgba(6,182,212,.12)",
                        border: "1px solid rgba(6,182,212,.35)",
                        color: "#67e8f9",
                        whiteSpace: "nowrap",
                      }}>
                      {n.date}
                    </span>
                    <p className="text-sm leading-[1.75] flex-1" style={{ color: "#cbd5e1" }}>
                      {inlineLinks(n.body)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {hidden > 0 && (
            <div className="text-center mt-10">
              <button
                onClick={() => setExpanded(v => !v)}
                className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105"
                style={{
                  border: "1px solid rgba(6,182,212,.4)",
                  color: "#22d3ee",
                  background: "rgba(6,182,212,.06)",
                }}
              >
                {expanded
                  ? "Show fewer"
                  : `Show all ${news.length} updates`}
                <span aria-hidden="true">{expanded ? "↑" : "↓"}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
