import { useState, lazy, Suspense } from "react";
import { topCollaborators, networkStats } from "../lib/coauthors";

// Lazy-load the heavy visualizations so the initial page bundle stays light;
// each tab is fetched only when selected.
const CoAuthorNetwork    = lazy(() => import("./CoAuthorNetwork"));
const CollaborationMap   = lazy(() => import("./CollaborationMap"));
const KeywordCloud       = lazy(() => import("./KeywordCloud"));
const PublicationsByYear = lazy(() => import("./PublicationsByYear"));

type TabId = "network" | "map" | "keywords" | "years";

const TABS: { id: TabId; label: string; sub: string }[] = [
  { id: "network",  label: "Co-author Network", sub: "Force-directed graph" },
  { id: "map",      label: "Collaboration Map",  sub: "World view" },
  { id: "keywords", label: "Keywords",           sub: "Topic fingerprint" },
  { id: "years",    label: "By Year",            sub: "Publication timeline" },
];

const GROUP_COLOR: Record<string, string> = {
  "italy-genoa":      "#67e8f9",
  "italy-bologna":    "#a5b4fc",
  "uk-sussex":        "#fca5a5",
  "pakistan-lahore":  "#fdba74",
  "pakistan-other":   "#fcd34d",
  "saudi-arabia":     "#6ee7b7",
  "cyprus":           "#f0abfc",
  "other":            "#cbd5e1",
};

function PanelFallback() {
  return (
    <div
      className="w-full rounded-2xl flex items-center justify-center"
      style={{
        height: 480,
        background: "linear-gradient(145deg,#040b18,#0a1428)",
        border: "1px solid rgba(100,116,139,.25)",
        color: "rgba(148,163,184,.6)",
        fontSize: 12,
      }}
    >
      Loading visualization…
    </div>
  );
}

export default function NetworkImpact() {
  const [active, setActive] = useState<TabId>("network");

  return (
    <section id="network" className="py-24" style={{ background: "rgba(10,15,30,0.65)" }}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-[.3em] uppercase mb-3" style={{ color: "#06b6d4" }}>
            Research footprint
          </p>
          <h2 className="text-4xl font-black text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
            Network &amp; Impact
          </h2>
          <div className="w-16 h-1 rounded-full mx-auto mb-4" style={{ background: "linear-gradient(90deg,#06b6d4,#3b82f6)" }} />
          <p className="text-sm max-w-2xl mx-auto" style={{ color: "#64748b" }}>
            Built automatically from {networkStats.totalPapers} peer-reviewed publications.{" "}
            {networkStats.totalCoAuthors} co-authors across {networkStats.countries} countries.
            Switch tabs to explore the network, the geography, the topics, and the timeline.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {TABS.map(t => {
            const isActive = active === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-[1.03]"
                style={{
                  background: isActive ? "linear-gradient(135deg,rgba(6,182,212,.18),rgba(59,130,246,.18))" : "rgba(12,20,38,.6)",
                  border: `1px solid ${isActive ? "rgba(6,182,212,.55)" : "rgba(100,116,139,.3)"}`,
                  color: isActive ? "#67e8f9" : "#cbd5e1",
                  boxShadow: isActive ? "0 0 18px rgba(6,182,212,.2)" : "none",
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Active panel */}
        <div className="mb-10">
          <Suspense fallback={<PanelFallback />}>
            {active === "network"  && <CoAuthorNetwork />}
            {active === "map"      && <CollaborationMap />}
            {active === "keywords" && <KeywordCloud />}
            {active === "years"    && <PublicationsByYear />}
          </Suspense>
        </div>

        {/* Top collaborators chips */}
        <div>
          <p className="text-xs font-bold tracking-widest uppercase text-center mb-4" style={{ color: "rgba(6,182,212,.7)" }}>
            Most frequent collaborators
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {topCollaborators.map(n => {
              const c = GROUP_COLOR[n.affiliation.group] || "#cbd5e1";
              return (
                <div
                  key={n.id}
                  className="px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2"
                  style={{
                    background: "rgba(12,20,38,.7)",
                    border: `1px solid ${c}55`,
                    color: c,
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: c }} />
                  {n.display}
                  <span style={{ color: "rgba(148,163,184,.7)", fontWeight: 500 }}>
                    · {n.count} paper{n.count === 1 ? "" : "s"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
