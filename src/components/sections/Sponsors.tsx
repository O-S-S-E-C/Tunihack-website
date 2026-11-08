"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, MouseEvent } from "react";
import { SPONSORS, type Sponsor, type Tier } from "@/data/sponsors";
import { buildSponsorGraph, SPONSOR_GRAPH_STYLE, type GraphEdge, type GraphMode, type GraphNode, type SponsorGraph } from "@/lib/sponsorGraph";

const EMAIL = "ossec@ensi-uma.tn";
const TIERS: Tier[] = ["platinum", "gold", "partner"];

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return parts.length > 1 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : name.slice(0, 3).toUpperCase();
}

function useHighlight(graph: SponsorGraph, hoveredId: string | null) {
  return useMemo(() => {
    const nodeIds = new Set<string>();
    const edgeIds = new Set<string>();
    const neighborIds = new Set<string>();
    if (!hoveredId) return { nodeIds, edgeIds, neighborIds };

    let current = hoveredId;
    nodeIds.add(current);
    while (graph.parents[current]) {
      const parentId: string = graph.parents[current];
      edgeIds.add(`tree:${parentId}:${current}`);
      if (parentId === "hub") break;
      current = parentId;
      nodeIds.add(current);
    }

    for (const neighbor of graph.neighbors[hoveredId] ?? []) {
      neighborIds.add(neighbor);
      nodeIds.add(neighbor);
      const key = [hoveredId, neighbor].sort().join("|");
      edgeIds.add(`mesh:${key}`);
      const parentId: string | undefined = graph.parents[hoveredId];
      if (parentId === neighbor) edgeIds.add(`tree:${neighbor}:${hoveredId}`);
      if (graph.parents[neighbor] === hoveredId) edgeIds.add(`tree:${hoveredId}:${neighbor}`);
    }
    return { nodeIds, edgeIds, neighborIds };
  }, [graph, hoveredId]);
}

function SponsorNode({
  node,
  arrive,
  mode,
  active,
  focused,
  tooltip,
  onFocusNode,
  onBlurNode,
  onClickNode,
}: {
  node: GraphNode;
  arrive: number;
  mode: GraphMode;
  active: boolean;
  focused: boolean;
  tooltip: { x: number; y: number };
  onFocusNode: (id: string) => void;
  onBlurNode: () => void;
  onClickNode: (event: MouseEvent<HTMLAnchorElement>, node: GraphNode) => void;
}) {
  const [logoFailed, setLogoFailed] = useState(!node.logo);
  const diameter = node.radius * 2;
  const logoPadding = mode === "mobile" ? 10 : 14;
  const logoSize = diameter - logoPadding * 2;
  const floatDelay = `${(node.index % 5) * 0.7}s`;
  const style = {
    "--arrive": `${arrive}s`,
    "--float-delay": floatDelay,
    "--float-duration": `${6 + (node.index % 4)}s`,
  } as CSSProperties;
  const shape = (
    <>
      <g className="sponsors-node-pop">
        <g className="sponsors-node-body">
          <circle cx={node.x} cy={node.y} r={node.radius} pathLength="1" className="sponsors-node-ring" />
          <circle cx={node.x} cy={node.y} r={node.radius + 3} className="sponsors-node-ripple" />
          <circle cx={node.x} cy={node.y} r={node.radius - 1} className="sponsors-node-float" />
          {node.logo && !logoFailed && (
            <image
              href={node.logo}
              x={node.x - logoSize / 2}
              y={node.y - logoSize / 2}
              width={logoSize}
              height={logoSize}
              preserveAspectRatio="xMidYMid meet"
              className={`sponsors-node-logo${node.invert ? " sponsors-node-logo-invert" : ""}`}
              onError={() => setLogoFailed(true)}
              aria-hidden="true"
            />
          )}
          {logoFailed && <text x={node.x} y={node.y + 5} textAnchor="middle" className="sponsors-node-fallback">{initials(node.name)}</text>}
        </g>
      </g>
      {focused && (
        <g className="sponsors-tooltip" transform={`translate(${tooltip.x} ${tooltip.y})`} aria-hidden="true">
          <rect width="184" height="30" rx="4" />
          <text x="9" y="19">{node.name}{" // "}{node.tier.toUpperCase()}</text>
        </g>
      )}
    </>
  );

  const onEnter = () => onFocusNode(node.id);
  const onLeave = () => onBlurNode();

  return node.url ? (
    <a
      href={node.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${node.name} (opens in a new tab)`}
      className={`sponsors-node${active ? " sponsors-node-active" : " sponsors-node-dim"}${focused ? " sponsors-node-focused" : ""}`}
      style={style}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      onClick={(event) => onClickNode(event, node)}
    >
      {shape}
    </a>
  ) : (
    <g
      tabIndex={0}
      role="group"
      aria-label={node.name}
      className={`sponsors-node${active ? " sponsors-node-active" : " sponsors-node-dim"}${focused ? " sponsors-node-focused" : ""}`}
      style={style}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
    >
      <title>{node.name}</title>
      {shape}
    </g>
  );
}

function GraphEdgeView({ edge, active, dimmed, graph }: {
  edge: GraphEdge;
  active: boolean;
  dimmed: boolean;
  graph: SponsorGraph;
}) {
  const style = { "--start": `${edge.start}s` } as CSSProperties;
  const edgeClass = `sponsors-edge sponsors-edge-${edge.kind}${active ? " sponsors-edge-active" : ""}${dimmed ? " sponsors-edge-dim" : ""}`;
  const source = graph.nodes.find((node) => node.id === edge.source);
  const packetDuration = `${3 + ((source?.index ?? 0) % 4) * 0.7}s`;
  const packetStart = graph.duration + (source?.index ?? 0) * 0.14;

  return (
    <g key={edge.id}>
      <path d={edge.d} pathLength="1" className={edgeClass} style={style} />
      {edge.kind === "tree" && (
        <circle r="4" className="sponsors-signal-head" style={style} aria-hidden="true">
          <animateMotion path={edge.d} dur=".8s" fill="freeze" begin="indefinite" data-sequence-start={edge.start} />
          <animate attributeName="opacity" values="0;1;0" keyTimes="0;.12;1" dur=".8s" fill="freeze" begin="indefinite" data-sequence-start={edge.start} />
        </circle>
      )}
      <circle r="2.4" className="sponsors-packet" aria-hidden="true">
        <animate attributeName="opacity" values="0;1" dur="100ms" fill="freeze" begin="indefinite" data-sequence-start={packetStart} />
        <animateMotion
          path={edge.d}
          dur={packetDuration}
          keyPoints="0;1;0"
          keyTimes="0;.5;1"
          calcMode="linear"
          repeatCount="indefinite"
          begin="indefinite"
          data-sequence-start={packetStart}
        />
      </circle>
    </g>
  );
}

function SponsorsSvg({
  graph,
  hoveredId,
  activeNodeIds,
  activeEdgeIds,
  neighborIds,
  onFocusNode,
  onBlurNode,
  onClickNode,
  svgRef,
}: {
  graph: SponsorGraph;
  hoveredId: string | null;
  activeNodeIds: Set<string>;
  activeEdgeIds: Set<string>;
  neighborIds: Set<string>;
  onFocusNode: (id: string) => void;
  onBlurNode: () => void;
  onClickNode: (event: MouseEvent<HTMLAnchorElement>, node: GraphNode) => void;
  svgRef: (node: SVGSVGElement | null) => void;
}) {
  const hubStyle = { "--arrive": `${SPONSOR_GRAPH_STYLE.timing.hub}s` } as CSSProperties;
  const edges = graph.edges;

  return (
    <svg ref={svgRef} className={`sponsors-svg sponsors-svg-${graph.mode}`} viewBox={`0 0 ${graph.width} ${graph.height}`} role="group" aria-label="Sponsor network connected to OSSEC">
      <g className="sponsors-svg-content">
        {edges.map((edge) => (
          <GraphEdgeView key={edge.id} edge={edge} active={activeEdgeIds.has(edge.id)} dimmed={hoveredId !== null && !activeEdgeIds.has(edge.id)} graph={graph} />
        ))}

        <g className="sponsors-hub" style={hubStyle} role="img" aria-label="OSSEC logo">
          <circle cx={graph.center.x} cy={graph.center.y} r={graph.hubRadius + 3} className="sponsors-hub-ring" pathLength="1" />
          <circle cx={graph.center.x} cy={graph.center.y} r={graph.hubRadius + 10} className="sponsors-sonar sponsors-sonar-one" />
          <circle cx={graph.center.x} cy={graph.center.y} r={graph.hubRadius + 10} className="sponsors-sonar sponsors-sonar-two" />
          <image href="/logo/logo.png" x={graph.center.x - graph.hubRadius} y={graph.center.y - graph.hubRadius} width={graph.hubRadius * 2} height={graph.hubRadius * 2} className="sponsors-hub-logo" aria-hidden="true" />
          <text x={graph.center.x} y={graph.center.y + graph.hubRadius + 27} textAnchor="middle" className="sponsors-hub-caption">OSSEC{" // THE CLUB"}</text>
        </g>

        {graph.nodes.map((node) => {
          const tooltipX = Math.max(8, Math.min(graph.width - 192, node.x - 92));
          const tooltipY = Math.max(8, node.y - node.radius - 42);
          const active = hoveredId === null || activeNodeIds.has(node.id) || neighborIds.has(node.id);
          return (
            <SponsorNode
              key={node.id}
              node={node}
              arrive={graph.arrivals[node.id]}
              mode={graph.mode}
              active={active}
              focused={hoveredId === node.id}
              tooltip={{ x: tooltipX, y: tooltipY }}
              onFocusNode={onFocusNode}
              onBlurNode={onBlurNode}
              onClickNode={onClickNode}
            />
          );
        })}
      </g>
    </svg>
  );
}

export default function Sponsors() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const svgRefs = useRef<Array<SVGSVGElement | null>>([null, null]);
  const activeRef = useRef(false);
  const [visible, setVisible] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [replayKey, setReplayKey] = useState(0);
  const desktopGraph = useMemo(() => buildSponsorGraph(SPONSORS, "desktop"), []);
  const mobileGraph = useMemo(() => buildSponsorGraph(SPONSORS, "mobile"), []);
  const desktopHighlight = useHighlight(desktopGraph, hoveredId);
  const mobileHighlight = useHighlight(mobileGraph, hoveredId);

  const setDesktopSvg = useCallback((node: SVGSVGElement | null) => { svgRefs.current[0] = node; }, []);
  const setMobileSvg = useCallback((node: SVGSVGElement | null) => { svgRefs.current[1] = node; }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const wrapper = wrapperRef.current;
    if (!section || !wrapper) return;
    if (!("IntersectionObserver" in window)) {
      activeRef.current = true;
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    const revealObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        revealObserver.disconnect();
      }
    }, { threshold: 0.3 });
    const activityObserver = new IntersectionObserver(([entry]) => {
      activeRef.current = entry.isIntersecting;
      wrapper.classList.toggle("sponsors-offscreen", !entry.isIntersecting);
      for (const svg of svgRefs.current) {
        if (!svg) continue;
        if (entry.isIntersecting) svg.unpauseAnimations();
        else svg.pauseAnimations();
      }
    }, { threshold: 0.01 });
    revealObserver.observe(section);
    activityObserver.observe(wrapper);

    return () => {
      revealObserver.disconnect();
      activityObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!visible || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    for (const svg of svgRefs.current) {
      if (!svg) continue;
      const animations = svg.querySelectorAll<SVGAnimationElement>("[data-sequence-start]");
      animations.forEach((animation) => {
        const start = Number(animation.getAttribute("data-sequence-start"));
        animation.beginElementAt(start);
      });
      if (!activeRef.current) svg.pauseAnimations();
    }
  }, [visible, replayKey]);

  const onClickNode = useCallback((event: MouseEvent<HTMLAnchorElement>, node: GraphNode) => {
    if (window.matchMedia("(max-width: 767px)").matches && hoveredId !== node.id) {
      event.preventDefault();
      setHoveredId(node.id);
    }
  }, [hoveredId]);

  const onBlurNode = useCallback(() => setHoveredId(null), []);
  const grouped = useMemo(() => Object.fromEntries(TIERS.map((tier) => [tier, SPONSORS.filter((sponsor) => sponsor.tier === tier)])) as Record<Tier, Sponsor[]>, []);
  const graphStyle = {
    "--mesh-start": `${Math.max(desktopGraph.meshStart, mobileGraph.meshStart)}s`,
    "--sponsor-cyan": SPONSOR_GRAPH_STYLE.colors.cyan,
    "--sponsor-blue": SPONSOR_GRAPH_STYLE.colors.blue,
    "--sponsor-background": SPONSOR_GRAPH_STYLE.colors.background,
    "--sponsor-node-fill": SPONSOR_GRAPH_STYLE.colors.node,
  } as CSSProperties;

  return (
    <section id="sponsors" ref={sectionRef} className="sponsors-section">
      <div className="sponsors-heading-wrap">
        <p className="about-eyebrow">{"// POWERED BY"}</p>
        <h2 className="about-heading">MEET OUR SPONSORS</h2>
        <div className="about-heading-rule" aria-hidden="true" />
        <p className="text-muted leading-relaxed mt-7 max-w-2xl">The network behind the builders, ideas, and challenges shaping this edition of TuniHack.</p>
      </div>

      <div ref={wrapperRef} className={`sponsors-graph-wrap${visible ? " sponsors-visible" : ""}${hoveredId ? " sponsors-has-hover" : ""}`} style={graphStyle}>
        <div className="sponsors-dot-grid" aria-hidden="true" />
        <div className="sponsors-graph-desktop" inert={!visible}>
          <SponsorsSvg key={`desktop-${replayKey}`} graph={desktopGraph} hoveredId={hoveredId} activeNodeIds={desktopHighlight.nodeIds} activeEdgeIds={desktopHighlight.edgeIds} neighborIds={desktopHighlight.neighborIds} onFocusNode={setHoveredId} onBlurNode={onBlurNode} onClickNode={onClickNode} svgRef={setDesktopSvg} />
        </div>
        <div className="sponsors-graph-mobile" inert={!visible}>
          <SponsorsSvg key={`mobile-${replayKey}`} graph={mobileGraph} hoveredId={hoveredId} activeNodeIds={mobileHighlight.nodeIds} activeEdgeIds={mobileHighlight.edgeIds} neighborIds={mobileHighlight.neighborIds} onFocusNode={setHoveredId} onBlurNode={onBlurNode} onClickNode={onClickNode} svgRef={setMobileSvg} />
        </div>
        <button type="button" className="sponsors-replay" aria-label="Replay network animation" disabled={!visible} onClick={() => setReplayKey((key) => key + 1)}>↻ REPLAY</button>
        <span className="sponsors-online-flash" style={graphStyle} aria-hidden="true" />
      </div>

      <ul className="sr-only" aria-label="Sponsors by tier">
        {TIERS.map((tier) => <li key={tier}>{tier}<ul>{grouped[tier].map((sponsor) => <li key={sponsor.name}>{sponsor.name}</li>)}</ul></li>)}
      </ul>
      <div className="sponsors-cta"><p>Want your brand on the network?</p><a href={`mailto:${EMAIL}`} className="outline-button rounded-md px-5 py-3 text-sm font-semibold">Become a sponsor →</a></div>
    </section>
  );
}
