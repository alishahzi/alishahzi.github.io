import { useEffect, useMemo, useRef, useState } from "react";
import { forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY, Simulation, SimulationLinkDatum, SimulationNodeDatum } from "d3-force";
import { coAuthorNodes, networkEdges, SHAHZAD_NODE, type Affiliation, type CoAuthorNode } from "../lib/coauthors";
import { publications } from "../data/content";

// Colour per affiliation group — same palette as Contact / About chips
const GROUP_COLOR: Record<Affiliation["group"], string> = {
  "italy-genoa":      "#67e8f9",  // cyan
  "italy-bologna":    "#a5b4fc",  // indigo
  "uk-sussex":        "#fca5a5",  // red-pink
  "pakistan-lahore":  "#fdba74",  // orange
  "pakistan-other":   "#fcd34d",  // amber
  "saudi-arabia":     "#6ee7b7",  // emerald
  "other":            "#cbd5e1",  // slate
};

const GROUP_LABEL: Record<Affiliation["group"], string> = {
  "italy-genoa":      "Genova · LISCOMP / MIDA / IRCCS San Martino",
  "italy-bologna":    "Bologna · UniBo",
  "uk-sussex":        "UK · Sussex / LILI Lab",
  "pakistan-lahore":  "Pakistan · Lahore (UET / COMSATS / partners)",
  "pakistan-other":   "Pakistan · other cities",
  "saudi-arabia":     "Saudi Arabia · King Saud / Taibah",
  "other":            "Other",
};

interface SimNode extends SimulationNodeDatum {
  id: string;
  display: string;
  count: number;
  affiliation: Affiliation;
  paperIds: string[];
  isShahzad?: boolean;
}

interface SimEdge extends SimulationLinkDatum<SimNode> {
  weight: number;
  paperIds: string[];
}

const ALL_PUBS = [
  ...((publications as { journalsPublished?: Array<{ id?: string; title: string; year?: number | string; venue?: string; doi?: string }> }).journalsPublished || []),
  ...((publications as { selectedConferences?: Array<{ id?: string; title: string; year?: number | string; venue?: string; doi?: string }> }).selectedConferences || []),
];

function papersFor(ids: string[]) {
  const set = new Set(ids);
  return ALL_PUBS.filter(p => p.id && set.has(p.id));
}

export default function CoAuthorNetwork() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [W, setW] = useState(900);
  const H = 540;
  const [tick, setTick] = useState(0);  // bump to trigger re-render
  const [hovered, setHovered] = useState<SimNode | null>(null);
  const [selected, setSelected] = useState<SimNode | null>(null);

  // Build sim nodes + links once
  const { simNodes, simLinks } = useMemo(() => {
    const nodes: SimNode[] = [
      { ...SHAHZAD_NODE },
      ...coAuthorNodes.map(n => ({ ...n })),
    ];
    const links: SimEdge[] = networkEdges.map(e => ({
      source: e.source,
      target: e.target,
      weight: e.weight,
      paperIds: e.paperIds,
    }));
    return { simNodes: nodes, simLinks: links };
  }, []);

  // Run the simulation
  useEffect(() => {
    if (!simNodes.length) return;
    const sim: Simulation<SimNode, SimEdge> = forceSimulation<SimNode, SimEdge>(simNodes)
      .force("link", forceLink<SimNode, SimEdge>(simLinks).id(d => d.id).distance(d => 120 - Math.min(d.weight * 10, 60)).strength(0.7))
      .force("charge", forceManyBody<SimNode>().strength(-180))
      .force("center", forceCenter(W / 2, H / 2))
      .force("collide", forceCollide<SimNode>().radius(d => 8 + (d.isShahzad ? 28 : 4 + d.count * 2.2)))
      .force("x", forceX(W / 2).strength(0.04))
      .force("y", forceY(H / 2).strength(0.06))
      .alphaDecay(0.02);

    sim.on("tick", () => setTick(t => t + 1));
    return () => { sim.stop(); };
  }, [simNodes, simLinks, W]);

  // Responsive width
  useEffect(() => {
    const update = () => {
      const w = svgRef.current?.parentElement?.clientWidth || 900;
      setW(Math.min(w, 1100));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Drag handling
  const dragRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent, node: SimNode) => {
    e.preventDefault();
    (e.target as Element).setPointerCapture(e.pointerId);
    dragRef.current = { id: node.id, offsetX: 0, offsetY: 0 };
    node.fx = node.x; node.fy = node.y;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const node = simNodes.find(n => n.id === dragRef.current!.id);
    if (!node) return;
    const rect = svgRef.current!.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    node.fx = (e.clientX - rect.left) * scaleX;
    node.fy = (e.clientY - rect.top) * scaleY;
    setTick(t => t + 1);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const node = simNodes.find(n => n.id === dragRef.current!.id);
    if (node) { node.fx = undefined; node.fy = undefined; }
    dragRef.current = null;
  };

  void tick;  // re-render marker

  return (
    <div className="relative w-full">
      <div className="grid lg:grid-cols-[1fr,280px] gap-6">
        <div
          className="relative w-full rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(145deg,#040b18,#0a1428)",
            border: "1px solid rgba(100,116,139,.25)",
            boxShadow: "0 6px 30px rgba(0,0,0,.35)",
          }}
        >
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            width="100%"
            height={H}
            style={{ touchAction: "none", cursor: dragRef.current ? "grabbing" : "default" }}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          >
            {/* edges */}
            <g>
              {simLinks.map((e, i) => {
                const s = (typeof e.source === "object" ? e.source : simNodes.find(n => n.id === e.source)) as SimNode | undefined;
                const t = (typeof e.target === "object" ? e.target : simNodes.find(n => n.id === e.target)) as SimNode | undefined;
                if (!s || !t) return null;
                const dim = hovered && hovered.id !== s.id && hovered.id !== t.id;
                const active = hovered && (hovered.id === s.id || hovered.id === t.id);
                return (
                  <line
                    key={i}
                    x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                    stroke={active ? "#67e8f9" : "rgba(148,163,184,.45)"}
                    strokeWidth={Math.max(0.6, Math.min(e.weight * 0.9, 3.5))}
                    opacity={dim ? 0.12 : (active ? 0.95 : 0.6)}
                    style={{ transition: "opacity .15s ease, stroke .15s ease" }}
                  />
                );
              })}
            </g>
            {/* nodes */}
            <g>
              {simNodes.map(n => {
                const radius = n.isShahzad ? 22 : 4 + Math.min(n.count, 6) * 2.6;
                const fill = n.isShahzad ? "#06b6d4" : GROUP_COLOR[n.affiliation.group];
                const stroke = n.isShahzad ? "#a5f3fc" : "#0a1428";
                const isHovered = hovered?.id === n.id;
                const isFaded = hovered && !isHovered &&
                  !(simLinks.some(e => {
                    const s = typeof e.source === "object" ? (e.source as SimNode).id : e.source;
                    const t = typeof e.target === "object" ? (e.target as SimNode).id : e.target;
                    return (s === hovered.id && t === n.id) || (t === hovered.id && s === n.id);
                  }));
                return (
                  <g
                    key={n.id}
                    transform={`translate(${n.x ?? 0},${n.y ?? 0})`}
                    style={{
                      cursor: "pointer",
                      opacity: isFaded ? 0.25 : 1,
                      transition: "opacity .15s ease",
                    }}
                    onPointerDown={e => onPointerDown(e, n)}
                    onPointerEnter={() => setHovered(n)}
                    onPointerLeave={() => setHovered(null)}
                    onClick={() => setSelected(n)}
                  >
                    {n.isShahzad && (
                      <circle r={radius + 10} fill="none" stroke="#06b6d4" strokeWidth={1} opacity={0.4} />
                    )}
                    <circle
                      r={radius}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={n.isShahzad ? 3 : 1.5}
                      style={{
                        filter: n.isShahzad ? "drop-shadow(0 0 12px rgba(6,182,212,.6))" : (isHovered ? `drop-shadow(0 0 8px ${fill})` : "none"),
                      }}
                    />
                    {(n.isShahzad || n.count >= 2 || isHovered) && (
                      <text
                        x={radius + 6}
                        y={4}
                        fill={n.isShahzad ? "#f1f5f9" : "rgba(241,245,249,.85)"}
                        fontSize={n.isShahzad ? 13 : 10}
                        fontWeight={n.isShahzad ? 700 : 500}
                        pointerEvents="none"
                        style={{ textShadow: "0 1px 4px rgba(0,0,0,.9)" }}
                      >
                        {n.display}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>

          {/* legend */}
          <div className="absolute bottom-3 left-3 px-3 py-2 rounded-lg flex flex-wrap gap-x-3 gap-y-1.5"
            style={{ background: "rgba(4,8,18,.7)", border: "1px solid rgba(100,116,139,.25)", backdropFilter: "blur(6px)" }}>
            {(Object.keys(GROUP_LABEL) as Affiliation["group"][])
              .filter(g => coAuthorNodes.some(n => n.affiliation.group === g))
              .map(g => (
                <span key={g} className="flex items-center gap-1.5 text-[10px]" style={{ color: "rgba(203,213,225,.75)" }}>
                  <span className="w-2 h-2 rounded-full inline-block" style={{ background: GROUP_COLOR[g] }} />
                  {GROUP_LABEL[g]}
                </span>
              ))}
          </div>

          {/* hover tooltip */}
          {hovered && !selected && (
            <div
              className="absolute top-3 left-3 px-3 py-2 rounded-lg max-w-[260px]"
              style={{
                background: "rgba(4,8,18,.92)",
                border: `1px solid ${hovered.isShahzad ? "#06b6d4" : GROUP_COLOR[hovered.affiliation.group]}`,
                color: "#f1f5f9",
                backdropFilter: "blur(6px)",
              }}
            >
              <p className="text-sm font-bold mb-0.5">{hovered.display}</p>
              <p className="text-[11px]" style={{ color: "rgba(203,213,225,.7)" }}>{hovered.affiliation.org}</p>
              <p className="text-[11px] mt-1" style={{ color: "#67e8f9" }}>
                {hovered.isShahzad ? `${hovered.count} publications total` : `${hovered.count} joint paper${hovered.count === 1 ? "" : "s"}`}
              </p>
            </div>
          )}
        </div>

        {/* side panel — selected co-author's joint papers */}
        <aside
          className="rounded-2xl p-4"
          style={{
            background: "rgba(12,20,38,.7)",
            border: "1px solid rgba(100,116,139,.25)",
            minHeight: H,
          }}
        >
          {!selected ? (
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "rgba(6,182,212,.7)" }}>How to read</p>
              <ul className="text-xs space-y-2" style={{ color: "rgba(203,213,225,.75)", lineHeight: 1.6 }}>
                <li>• Node size = joint paper count</li>
                <li>• Line thickness = number of shared papers</li>
                <li>• Colour = inferred affiliation group</li>
                <li>• Hover to highlight neighbours</li>
                <li>• Click a node to list joint papers</li>
                <li>• Drag any node to rearrange</li>
              </ul>
              <div className="mt-5 pt-4" style={{ borderTop: "1px solid rgba(100,116,139,.2)" }}>
                <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "rgba(6,182,212,.7)" }}>Network</p>
                <p className="text-[11px]" style={{ color: "rgba(203,213,225,.7)" }}>
                  {coAuthorNodes.length} unique co-authors · {networkEdges.length} collaboration edges across {ALL_PUBS.length} peer-reviewed works.
                </p>
              </div>
            </div>
          ) : (
            <div>
              <button
                onClick={() => setSelected(null)}
                className="text-xs mb-3 transition-colors"
                style={{ color: "rgba(6,182,212,.85)" }}
              >
                ‹ Back
              </button>
              <p className="text-sm font-bold text-white mb-0.5" style={{ letterSpacing: "-0.01em" }}>{selected.display}</p>
              <p className="text-[11px] mb-3" style={{ color: GROUP_COLOR[selected.affiliation.group] }}>{selected.affiliation.org}</p>
              <p className="text-xs mb-3" style={{ color: "rgba(203,213,225,.65)" }}>
                {selected.isShahzad
                  ? `${selected.count} publications total`
                  : `${selected.count} joint paper${selected.count === 1 ? "" : "s"} with Shahzad`}
              </p>
              <div className="space-y-2">
                {papersFor(selected.paperIds).map(p => (
                  <a
                    key={p.id}
                    href={p.doi ? `https://doi.org/${p.doi}` : "#"}
                    target={p.doi ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="block text-[11px] p-2 rounded-md transition-all hover:scale-[1.01]"
                    style={{
                      background: "rgba(6,182,212,.06)",
                      border: "1px solid rgba(6,182,212,.18)",
                      color: "#cbd5e1",
                      lineHeight: 1.45,
                    }}
                  >
                    <span style={{ color: "#67e8f9" }}>[{p.id}]</span>{" "}
                    <span>{p.title}</span>{" "}
                    {p.year && <span style={{ color: "rgba(148,163,184,.7)" }}>({p.year})</span>}
                  </a>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
