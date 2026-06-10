import { useEffect, useMemo, useRef, useState } from "react";
import { forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY, Simulation, SimulationLinkDatum, SimulationNodeDatum } from "d3-force";
import { coAuthorNodes, networkEdges, SHAHZAD_NODE, type Affiliation } from "../lib/coauthors";
import { publications } from "../data/content";

// ────────────────────────────────────────────────────────────────────────────
//  Dynamic clustered constellation
//
//  Instead of a force-directed clump around the centre, every affiliation
//  group has its own anchor point spread around the canvas. Nodes are pulled
//  toward their group anchor so we get visible *constellations* — Italy on
//  the left, Pakistan on the right, etc. — with Shahzad as the bright hub
//  edges pass through.
//
//  The simulation never fully settles: alphaMin is high so a low-energy
//  drift continues forever, giving the whole graph a gentle living motion.
// ────────────────────────────────────────────────────────────────────────────

const W_FALLBACK = 1100;
const H = 620;

const GROUP_COLOR: Record<Affiliation["group"], string> = {
  "italy-genoa":      "#67e8f9",
  "italy-bologna":    "#a5b4fc",
  "italy-other":      "#7dd3fc",  // sky blue
  "uk-sussex":        "#fca5a5",
  "pakistan-lahore":  "#fdba74",
  "pakistan-other":   "#fcd34d",
  "saudi-arabia":     "#6ee7b7",
  "cyprus":           "#f0abfc",  // pink-magenta
  "netherlands":      "#f97316",  // orange
  "usa":              "#34d399",  // emerald
  "other":            "#cbd5e1",
};

const GROUP_LABEL: Record<Affiliation["group"], string> = {
  "italy-genoa":      "Italy · LISCOMP / MIDA / IRCCS San Martino",
  "italy-bologna":    "Italy · UniBo",
  "italy-other":      "Italy · Pavia / Siena / Milano",
  "uk-sussex":        "UK · Sussex / LILI Lab",
  "pakistan-lahore":  "Pakistan · Lahore",
  "pakistan-other":   "Pakistan · other",
  "saudi-arabia":     "Saudi Arabia",
  "cyprus":           "Cyprus · CIU",
  "netherlands":      "Netherlands · Amsterdam UMC",
  "usa":              "USA · Harvard / Mass General",
  "other":            "Other",
};

// Cluster anchors as fractions of canvas so they're responsive
const GROUP_ANCHOR: Record<Affiliation["group"], { fx: number; fy: number }> = {
  "italy-genoa":      { fx: 0.22, fy: 0.42 },  // left
  "italy-bologna":    { fx: 0.34, fy: 0.18 },  // upper-left
  "italy-other":      { fx: 0.42, fy: 0.62 },  // lower-left-center
  "uk-sussex":        { fx: 0.48, fy: 0.10 },  // top
  "pakistan-lahore":  { fx: 0.80, fy: 0.42 },  // right
  "pakistan-other":   { fx: 0.80, fy: 0.78 },  // lower-right
  "saudi-arabia":     { fx: 0.58, fy: 0.85 },  // bottom
  "cyprus":           { fx: 0.66, fy: 0.28 },  // mid-upper-right
  "netherlands":      { fx: 0.10, fy: 0.20 },  // upper-left corner
  "usa":              { fx: 0.10, fy: 0.62 },  // lower-left
  "other":            { fx: 0.20, fy: 0.85 },  // bottom-left
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
  const [W, setW] = useState(W_FALLBACK);
  const [, setTick] = useState(0);  // re-render bump
  const [hovered, setHovered] = useState<SimNode | null>(null);
  const [selected, setSelected] = useState<SimNode | null>(null);

  // Build sim nodes + links once. Shahzad sits dead-centre.
  const { simNodes, simLinks } = useMemo(() => {
    const nodes: SimNode[] = [
      { ...SHAHZAD_NODE, fx: undefined, fy: undefined },
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

  // Responsive width
  useEffect(() => {
    const update = () => {
      const w = svgRef.current?.parentElement?.clientWidth || W_FALLBACK;
      setW(Math.min(w, 1200));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Simulation — clusters around per-group anchors, never fully settles
  useEffect(() => {
    if (!simNodes.length) return;
    const sim: Simulation<SimNode, SimEdge> = forceSimulation<SimNode, SimEdge>(simNodes)
      .force("link", forceLink<SimNode, SimEdge>(simLinks)
        .id(d => d.id)
        .distance(d => 90 + 70 / Math.max(1, d.weight))    // higher weight = closer
        .strength(d => 0.18 + Math.min(d.weight * 0.05, 0.25)))
      .force("charge", forceManyBody<SimNode>().strength(d => d.isShahzad ? -650 : -130 - Math.min(d.count * 24, 90)))
      .force("collide", forceCollide<SimNode>().radius(d => 6 + (d.isShahzad ? 30 : 6 + d.count * 2.6)).strength(0.85))
      // Cluster forces — pull each node toward its group anchor
      .force("groupX", forceX<SimNode>(d => {
        if (d.isShahzad) return W / 2;
        const a = GROUP_ANCHOR[d.affiliation.group];
        return a.fx * W;
      }).strength(d => d.isShahzad ? 0.25 : 0.22))
      .force("groupY", forceY<SimNode>(d => {
        if (d.isShahzad) return H / 2;
        const a = GROUP_ANCHOR[d.affiliation.group];
        return a.fy * H;
      }).strength(d => d.isShahzad ? 0.25 : 0.22))
      // Keep things gently moving forever
      .alphaMin(0.012)
      .alphaDecay(0.012)
      .velocityDecay(0.32);

    sim.on("tick", () => setTick(t => t + 1));

    // Re-energise periodically so nothing ever fully settles
    const heartbeat = window.setInterval(() => { sim.alpha(0.08).restart(); }, 4200);

    return () => {
      sim.stop();
      window.clearInterval(heartbeat);
    };
  }, [simNodes, simLinks, W]);

  // Drag handling — fix node position while dragging
  const dragRef = useRef<{ id: string } | null>(null);
  const onPointerDown = (e: React.PointerEvent, node: SimNode) => {
    e.preventDefault();
    (e.target as Element).setPointerCapture(e.pointerId);
    dragRef.current = { id: node.id };
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
  const onPointerUp = () => {
    if (!dragRef.current) return;
    const node = simNodes.find(n => n.id === dragRef.current!.id);
    if (node && !node.isShahzad) { node.fx = undefined; node.fy = undefined; }
    dragRef.current = null;
  };

  // Edge → curved path
  function edgePath(s: SimNode, t: SimNode): string {
    const sx = s.x ?? 0, sy = s.y ?? 0;
    const tx = t.x ?? 0, ty = t.y ?? 0;
    const mx = (sx + tx) / 2;
    const my = (sy + ty) / 2;
    const dx = tx - sx, dy = ty - sy;
    const dist = Math.hypot(dx, dy);
    // Perpendicular offset, scaled by distance
    const px = -dy / dist;
    const py = dx / dist;
    const curve = Math.min(dist * 0.22, 50);
    return `M${sx},${sy} Q${mx + px * curve},${my + py * curve} ${tx},${ty}`;
  }

  const visibleGroups = (Object.keys(GROUP_LABEL) as Affiliation["group"][])
    .filter(g => coAuthorNodes.some(n => n.affiliation.group === g));

  return (
    <div className="relative w-full">
      <div className="grid lg:grid-cols-[1fr,280px] gap-6">
        <div
          className="relative w-full rounded-2xl overflow-hidden"
          style={{
            background: "radial-gradient(ellipse at 50% 40%, #0a1f3a 0%, #040b18 70%, #02060e 100%)",
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
            <defs>
              <linearGradient id="edgeFade" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="rgba(6,182,212,.6)" />
                <stop offset="100%" stopColor="rgba(167,243,252,.85)" />
              </linearGradient>
              <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor="rgba(6,182,212,.55)" />
                <stop offset="100%" stopColor="rgba(6,182,212,0)" />
              </radialGradient>
            </defs>

            {/* Cluster halos + lasso ring around the active cluster */}
            <g>
              {(Object.keys(GROUP_ANCHOR) as Affiliation["group"][])
                .filter(g => coAuthorNodes.some(n => n.affiliation.group === g))
                .map(g => {
                  const a = GROUP_ANCHOR[g];
                  const cx = a.fx * W;
                  const cy = a.fy * H;
                  const isShahzadHovered = hovered?.isShahzad === true;
                  const hoveredGroup = (hovered && !hovered.isShahzad) ? hovered.affiliation.group : null;
                  const isActiveCluster = hoveredGroup === g;
                  const haloOpacity = isShahzadHovered ? 0.18      // hub hover → every halo brighter
                    : !hoveredGroup ? 0.05
                    : isActiveCluster ? 0.32
                    : 0.012;
                  return (
                    <g key={g}>
                      {/* big soft blurred halo */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={140}
                        fill={GROUP_COLOR[g]}
                        opacity={haloOpacity}
                        style={{ filter: "blur(44px)", transition: "opacity .35s ease" }}
                      />
                      {/* lasso ring — only on the active cluster, gives a
                          "this constellation" outline so the eye doesn't have to
                          piece it together from individual nodes */}
                      {isActiveCluster && (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={140}
                          fill="none"
                          stroke={GROUP_COLOR[g]}
                          strokeWidth={1.2}
                          strokeDasharray="6 8"
                          opacity={0.45}
                          style={{ transformOrigin: `${cx}px ${cy}px` }}
                        >
                          <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0"
                            to="360"
                            dur="60s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="r"
                            values="140;148;140"
                            dur="4s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}
                    </g>
                  );
                })}
            </g>

            {/* Edges (curved) */}
            <g>
              {simLinks.map((e, i) => {
                const s = (typeof e.source === "object" ? e.source : simNodes.find(n => n.id === e.source)) as SimNode | undefined;
                const t = (typeof e.target === "object" ? e.target : simNodes.find(n => n.id === e.target)) as SimNode | undefined;
                if (!s || !t || s.x == null || t.x == null) return null;
                const isShahzadHovered = hovered?.isShahzad === true;
                const hoveredGroup = (hovered && !hovered.isShahzad) ? hovered.affiliation.group : null;
                // The non-Shahzad endpoint determines which cluster the edge belongs to
                const coAuthor = s.isShahzad ? t : s;
                const isHoveredEdge = hovered && (hovered.id === s.id || hovered.id === t.id);
                const inHoveredCluster = hoveredGroup && coAuthor.affiliation.group === hoveredGroup;

                let edgeOpacity: number;
                if (isShahzadHovered)           edgeOpacity = 0.75;   // hub hover → all edges glow
                else if (!hoveredGroup)         edgeOpacity = 0.45;   // default dim
                else if (isHoveredEdge)         edgeOpacity = 0.95;   // edge to specifically hovered node
                else if (inHoveredCluster)      edgeOpacity = 0.45;   // sibling edges in active cluster
                else                            edgeOpacity = 0.05;   // other clusters

                const path = edgePath(s, t);
                const showParticle = e.weight >= 2 && (!hoveredGroup || isShahzadHovered || inHoveredCluster);

                return (
                  <g key={i}>
                    <path
                      id={`ne-${i}`}
                      d={path}
                      fill="none"
                      stroke={isHoveredEdge ? "#67e8f9" : "url(#edgeFade)"}
                      strokeWidth={Math.max(0.7, Math.min(e.weight * 1.1, 3.8))}
                      strokeLinecap="round"
                      opacity={edgeOpacity}
                      style={{ transition: "opacity .2s ease, stroke .2s ease" }}
                    />
                    {/* particle flow only on edges in the active cluster (or all when no hover) */}
                    {showParticle && (
                      <circle r={2} fill="#a5f3fc" style={{ filter: "drop-shadow(0 0 4px rgba(167,243,252,.9))" }}>
                        <animateMotion dur={`${3 + i * 0.3 % 2}s`} repeatCount="indefinite" begin={`${-i * 0.3 % 3}s`}>
                          <mpath href={`#ne-${i}`} />
                        </animateMotion>
                        <animate
                          attributeName="opacity"
                          values="0;1;1;0"
                          keyTimes="0;0.15;0.85;1"
                          dur={`${3 + i * 0.3 % 2}s`}
                          repeatCount="indefinite"
                          begin={`${-i * 0.3 % 3}s`}
                        />
                      </circle>
                    )}
                  </g>
                );
              })}
            </g>

            {/* Nodes — cluster-aware opacity:
                · no hover:           all clusters dim (Shahzad stays bright)
                · hover on Shahzad:   every cluster lights up (he's the hub)
                · hover on a co-author:
                    - that node          → 1.0  (full, plus scale + pulse)
                    - same-cluster peers → 0.7  (visible but clearly secondary)
                    - other clusters     → 0.15 (heavily dimmed)
            */}
            <g>
              {simNodes.map(n => {
                const radius = n.isShahzad ? 24 : 5 + Math.min(n.count, 6) * 2.8;
                const fill = n.isShahzad ? "#06b6d4" : GROUP_COLOR[n.affiliation.group];
                const isHovered = hovered?.id === n.id;
                const isShahzadHovered = hovered?.isShahzad === true;
                // Only narrow hovered group when hovering a co-author (not Shahzad)
                const hoveredGroup = (hovered && !hovered.isShahzad) ? hovered.affiliation.group : null;

                // Cluster-based opacity
                let nodeOpacity = 1;
                if (!n.isShahzad) {
                  if (isShahzadHovered)                           nodeOpacity = 1;     // hub hover → all bright
                  else if (!hoveredGroup)                         nodeOpacity = 0.5;
                  else if (isHovered)                             nodeOpacity = 1;     // the focused node
                  else if (n.affiliation.group === hoveredGroup)  nodeOpacity = 0.7;   // same-cluster siblings
                  else                                            nodeOpacity = 0.15;  // other clusters
                }

                // Subtle hover scale on the focused node
                const hoverScale = isHovered ? 1.18 : 1;

                return (
                  <g
                    key={n.id}
                    transform={`translate(${n.x ?? 0},${n.y ?? 0})`}
                    style={{
                      cursor: "pointer",
                      opacity: nodeOpacity,
                      transition: "opacity .25s ease",
                    }}
                    onPointerDown={e => onPointerDown(e, n)}
                    onPointerEnter={() => setHovered(n)}
                    onPointerLeave={() => setHovered(null)}
                    onClick={() => setSelected(n)}
                  >
                    {n.isShahzad && (
                      <>
                        <circle r={70} fill="url(#hubGlow)" />
                        <circle r={radius + 8} fill="none" stroke="#06b6d4" strokeWidth={1.2} opacity={0.5}>
                          <animate attributeName="r" values={`${radius + 8};${radius + 28};${radius + 8}`} dur="3.6s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.7;0;0.7" dur="3.6s" repeatCount="indefinite" />
                        </circle>
                      </>
                    )}
                    {/* Pulse ring ONLY on the hovered node — no more always-on
                        ring noise across every 2+ collaborator. */}
                    {!n.isShahzad && isHovered && (
                      <circle r={radius + 5} fill="none" stroke={fill} strokeWidth={1.2} opacity={0.7}>
                        <animate attributeName="r" values={`${radius + 5};${radius + 18};${radius + 5}`} dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite" />
                      </circle>
                    )}
                    <circle
                      r={radius * hoverScale}
                      fill={fill}
                      stroke={n.isShahzad ? "#a5f3fc" : (isHovered ? fill : "#04080f")}
                      strokeWidth={n.isShahzad ? 3 : (isHovered ? 2.2 : 1.5)}
                      style={{
                        filter: n.isShahzad
                          ? "drop-shadow(0 0 14px rgba(6,182,212,.7))"
                          : (isHovered ? `drop-shadow(0 0 14px ${fill})` : `drop-shadow(0 0 3px ${fill}55)`),
                        transition: "stroke .25s ease, stroke-width .25s ease",
                      }}
                    />
                    {/* Labels: Shahzad + top collaborators (count ≥ 3) only.
                        Everyone else shows their name on hover, so the canvas
                        doesn't get smothered in overlapping text. */}
                    {(n.isShahzad || n.count >= 3 || isHovered) && (
                      <text
                        x={radius + 6}
                        y={4}
                        fill={n.isShahzad ? "#f1f5f9" : "rgba(241,245,249,.92)"}
                        fontSize={n.isShahzad ? 14 : 11}
                        fontWeight={n.isShahzad ? 800 : 600}
                        pointerEvents="none"
                        style={{ textShadow: "0 1px 4px rgba(0,0,0,.92)", letterSpacing: ".01em" }}
                      >
                        {n.display}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>

          {/* hover tooltip */}
          {hovered && !selected && (
            <div
              className="absolute top-3 left-3 px-3 py-2 rounded-lg max-w-[260px]"
              style={{
                background: "rgba(4,8,18,.94)",
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

          {/* legend — sits below the SVG canvas, inside the same column,
              so it never overlaps any node */}
          <div
            className="px-4 py-3 mt-3 rounded-xl flex flex-wrap gap-x-4 gap-y-2"
            style={{
              background: "rgba(12,20,38,.65)",
              border: "1px solid rgba(100,116,139,.22)",
            }}
          >
            {visibleGroups.map(g => (
              <span
                key={g}
                className="flex items-center gap-1.5 text-[11px]"
                style={{ color: "rgba(203,213,225,.82)" }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ background: GROUP_COLOR[g], boxShadow: `0 0 6px ${GROUP_COLOR[g]}88` }}
                />
                {GROUP_LABEL[g]}
              </span>
            ))}
          </div>
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
                <li>· Co-authors cluster by affiliation, not orbit</li>
                <li>· Node size = joint paper count</li>
                <li>· Line thickness = number of shared papers</li>
                <li>· Particles flow along strong collaborations</li>
                <li>· Pulses ripple from frequent collaborators</li>
                <li>· Click any node to list joint papers</li>
                <li>· Drag a node to rearrange</li>
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
