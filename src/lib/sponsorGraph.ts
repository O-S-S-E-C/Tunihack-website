import type { Sponsor, Tier } from "@/data/sponsors";

export type GraphMode = "desktop" | "mobile";
export type GraphNode = Sponsor & {
  id: string;
  index: number;
  x: number;
  y: number;
  radius: number;
  depth: number;
};
export type GraphEdge = {
  id: string;
  source: string;
  target: string;
  kind: "tree" | "mesh";
  d: string;
  start: number;
  arrive: number;
};
export type SponsorGraph = {
  mode: GraphMode;
  width: number;
  height: number;
  center: { x: number; y: number };
  hubRadius: number;
  nodes: GraphNode[];
  edges: GraphEdge[];
  parents: Record<string, string>;
  arrivals: Record<string, number>;
  neighbors: Record<string, string[]>;
  meshStart: number;
  duration: number;
};

export const SPONSOR_GRAPH_STYLE = {
  colors: {
    background: "#040918",
    node: "#071126",
    cyan: "#22d3ee",
    blue: "#2563eb",
  },
  sizes: {
    desktop: { platinum: 96, gold: 84, partner: 72 },
    mobile: { platinum: 76, gold: 66, partner: 56 },
  },
  timing: {
    hub: 1,
    branchGap: 0.08,
    siblingGap: 0.12,
    edge: 0.8,
    mesh: 0.6,
  },
} as const;

type Point = { x: number; y: number };
type MutableNode = GraphNode & { vx: number; vy: number; targetRadius: number };
type RawEdge = { id: string; source: string; target: string; kind: "tree" | "mesh" };

const TARGET_RADIUS: Record<Tier, number> = { platinum: 145, gold: 250, partner: 350 };

function mulberry32(seed: number) {
  return () => {
    seed += 0x6d2b79f5;
    let value = seed;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function makePath(start: Point, end: Point, startRadius: number, endRadius: number) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.max(1, Math.hypot(dx, dy));
  const ux = dx / length;
  const uy = dy / length;
  const x1 = start.x + ux * startRadius;
  const y1 = start.y + uy * startRadius;
  const x2 = end.x - ux * endRadius;
  const y2 = end.y - uy * endRadius;
  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

function buildLayout(sponsors: Sponsor[], mode: GraphMode) {
  const mobile = mode === "mobile";
  const width = mobile ? 600 : 1000;
  const height = mobile ? 650 : 500;
  const center = { x: width / 2, y: height / 2 };
  const hubRadius = mobile ? 42 : 48;
  const sizes = SPONSOR_GRAPH_STYLE.sizes[mode];
  const random = mulberry32(0x51f15e);
  const tierGroups: Record<Tier, MutableNode[]> = { platinum: [], gold: [], partner: [] };
  const nodes: MutableNode[] = sponsors.map((sponsor, index) => {
    const angle = random() * Math.PI * 2;
    const targetRadius = (mobile ? { platinum: 130, gold: 238, partner: 330 } : TARGET_RADIUS)[sponsor.tier];
    const radius = sizes[sponsor.tier] / 2;
    const spread = (random() - 0.5) * 34;
    const verticalBias = mobile ? 0.88 : 0.68;
    const horizontalBias = mobile ? 0.52 : 1;
    const node: MutableNode = {
      ...sponsor,
      id: `${sponsor.tier}:${index}:${sponsor.name}`,
      index,
      x: center.x + Math.cos(angle) * (targetRadius + spread) * horizontalBias,
      y: center.y + Math.sin(angle) * (targetRadius + spread) * verticalBias,
      radius,
      depth: 0,
      vx: 0,
      vy: 0,
      targetRadius,
    };
    tierGroups[sponsor.tier].push(node);
    return node;
  });

  const hubId = "hub";
  const parents: Record<string, string> = {};
  const depths: Record<string, number> = {};
  const treeEdges: RawEdge[] = [];
  for (const node of nodes) {
    parents[node.id] = hubId;
    depths[node.id] = 1;
    node.depth = 1;
    treeEdges.push({ id: `tree:${hubId}:${node.id}`, source: hubId, target: node.id, kind: "tree" });
  }

  const meshEdges: RawEdge[] = [];

  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const allRawEdges = [...treeEdges, ...meshEdges];
  const allWithHub = allRawEdges.map((edge) => ({
    edge,
    source: edge.source === hubId ? center : nodeById.get(edge.source)!,
    target: edge.target === hubId ? center : nodeById.get(edge.target)!,
  }));

  for (let iteration = 0; iteration < 320; iteration += 1) {
    const fx = new Array<number>(nodes.length).fill(0);
    const fy = new Array<number>(nodes.length).fill(0);

    for (let first = 0; first < nodes.length; first += 1) {
      const a = nodes[first];
      for (let second = first + 1; second < nodes.length; second += 1) {
        const b = nodes[second];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const length = Math.max(0.1, Math.hypot(dx, dy));
        const minimum = a.radius + b.radius + 18;
        const reach = minimum + (mobile ? 38 : 48);
        if (length < reach) {
          const strength = (reach - length) * (length < minimum ? 0.065 : 0.018);
          const pushX = (dx / length) * strength;
          const pushY = (dy / length) * strength;
          fx[first] += pushX;
          fy[first] += pushY;
          fx[second] -= pushX;
          fy[second] -= pushY;
        }
      }
    }

    for (const node of nodes) {
      const dx = node.x - center.x;
      const dy = node.y - center.y;
      const radial = Math.max(0.1, Math.hypot(dx, dy));
      const minimum = hubRadius + node.radius + 18;
      const reach = minimum + 48;
      if (radial < reach) {
        const strength = (reach - radial) * (radial < minimum ? 0.075 : 0.02);
        fx[node.index] += (dx / radial) * strength;
        fy[node.index] += (dy / radial) * strength;
      }
    }

    for (const { edge, source, target } of allWithHub) {
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const length = Math.max(0.1, Math.hypot(dx, dy));
      const rest = edge.source === hubId ? nodeById.get(edge.target)!.targetRadius : edge.kind === "mesh" ? (mobile ? 170 : 190) : (mobile ? 165 : 180);
      const strength = (length - rest) * 0.0024;
      const pushX = (dx / length) * strength;
      const pushY = (dy / length) * strength;
      if (edge.source !== hubId) {
        const sourceIndex = nodeById.get(edge.source)!.index;
        fx[sourceIndex] += pushX;
        fy[sourceIndex] += pushY;
      }
      if (edge.target !== hubId) {
        const targetIndex = nodeById.get(edge.target)!.index;
        fx[targetIndex] -= pushX;
        fy[targetIndex] -= pushY;
      }

      for (const node of nodes) {
        if (node.id === edge.source || node.id === edge.target) continue;
        const segX = target.x - source.x;
        const segY = target.y - source.y;
        const segLength = Math.max(1, segX * segX + segY * segY);
        const projection = Math.max(0, Math.min(1, ((node.x - source.x) * segX + (node.y - source.y) * segY) / segLength));
        const closestX = source.x + projection * segX;
        const closestY = source.y + projection * segY;
        const offX = node.x - closestX;
        const offY = node.y - closestY;
        const offLength = Math.max(0.1, Math.hypot(offX, offY));
        const clearance = node.radius + 13;
        if (projection > 0.08 && projection < 0.92 && offLength < clearance) {
          const push = (clearance - offLength) * 0.035;
          fx[node.index] += (offX / offLength) * push;
          fy[node.index] += (offY / offLength) * push;
        }
      }
    }

    for (const node of nodes) {
      const dx = node.x - center.x;
      const dy = node.y - center.y;
      const radial = Math.max(0.1, Math.hypot(dx, dy));
      const radialPull = (node.targetRadius - radial) * 0.0012;
      fx[node.index] += (dx / radial) * radialPull;
      fy[node.index] += (dy / radial) * radialPull;
      node.vx = (node.vx + fx[node.index]) * 0.72;
      node.vy = (node.vy + fy[node.index]) * 0.72;
      node.x = Math.max(60 + node.radius, Math.min(width - 60 - node.radius, node.x + node.vx));
      node.y = Math.max(60 + node.radius, Math.min(height - 60 - node.radius, node.y + node.vy));
    }
  }

  const finalNodes: GraphNode[] = nodes.map((node) => ({
    name: node.name,
    tier: node.tier,
    logo: node.logo,
    url: node.url,
    invert: node.invert,
    id: node.id,
    index: node.index,
    radius: node.radius,
    depth: node.depth,
    x: Math.round(node.x * 10) / 10,
    y: Math.round(node.y * 10) / 10,
  }));
  const finalById = new Map(finalNodes.map((node) => [node.id, node]));
  const rawEdges = [...treeEdges, ...meshEdges];
  const neighbors: Record<string, string[]> = Object.fromEntries(finalNodes.map((node) => [node.id, []]));
  for (const edge of rawEdges) {
    if (edge.source !== hubId) neighbors[edge.source].push(edge.target);
    if (edge.target !== hubId) neighbors[edge.target].push(edge.source);
  }

  return { width, height, center, hubRadius, nodes: finalNodes, parents, neighbors, rawEdges, finalById };
}

export function buildSponsorGraph(sponsors: Sponsor[], mode: GraphMode): SponsorGraph {
  const layout = buildLayout(sponsors, mode);
  const arrivals: Record<string, number> = { hub: SPONSOR_GRAPH_STYLE.timing.hub };
  const edgeTimes = new Map<string, { start: number; arrive: number }>();
  const maxDepth = layout.nodes.reduce((maximum, node) => Math.max(maximum, node.depth), 0);

  for (let depth = 1; depth <= maxDepth; depth += 1) {
    const siblings = layout.nodes.filter((node) => node.depth === depth).sort((a, b) => a.index - b.index);
    const siblingCount: Record<string, number> = {};
    for (const node of siblings) {
      const parent = layout.parents[node.id];
      const siblingIndex = siblingCount[parent] ?? 0;
      siblingCount[parent] = siblingIndex + 1;
      const start = arrivals[parent] + SPONSOR_GRAPH_STYLE.timing.branchGap + siblingIndex * SPONSOR_GRAPH_STYLE.timing.siblingGap;
      const arrive = start + SPONSOR_GRAPH_STYLE.timing.edge;
      arrivals[node.id] = arrive;
      edgeTimes.set(`tree:${parent}:${node.id}`, { start, arrive });
    }
  }

  const meshStart = Math.max(SPONSOR_GRAPH_STYLE.timing.hub, ...Object.values(arrivals)) + 0.08;
  const duration = meshStart + SPONSOR_GRAPH_STYLE.timing.mesh;
  const edges: GraphEdge[] = layout.rawEdges.map((edge) => {
    const source = edge.source === "hub" ? layout.center : layout.finalById.get(edge.source)!;
    const target = edge.target === "hub" ? layout.center : layout.finalById.get(edge.target)!;
    const sourceRadius = edge.source === "hub" ? layout.hubRadius : layout.finalById.get(edge.source)!.radius;
    const targetRadius = edge.target === "hub" ? layout.hubRadius : layout.finalById.get(edge.target)!.radius;
    const timing = edge.kind === "tree" ? edgeTimes.get(edge.id)! : { start: meshStart, arrive: duration };
    return {
      ...edge,
      d: makePath(source, target, sourceRadius, targetRadius),
      start: timing.start,
      arrive: timing.arrive,
    };
  });

  return {
    mode,
    width: layout.width,
    height: layout.height,
    center: layout.center,
    hubRadius: layout.hubRadius,
    nodes: layout.nodes,
    edges,
    parents: layout.parents,
    arrivals,
    neighbors: layout.neighbors,
    meshStart,
    duration,
  };
}
