import type { Graph, NodeId, Edge } from "./types.js";

export function createGraph(): Graph {
  return {
    nodes: new Set(),
    edges: new Map(),
  };
}

export function addNode(graph: Graph, id: NodeId): void {
  graph.nodes.add(id);
  if (!graph.edges.has(id)) {
    graph.edges.set(id, []);
  }
}

export function addEdge(
  graph: Graph,
  from: NodeId,
  to: NodeId,
  weight: number = 1,
): void {
  if (!graph.nodes.has(from)) addNode(graph, from);
  if (!graph.nodes.has(to)) addNode(graph, to);

  const edges = graph.edges.get(from) || [];
  const existing = edges.find((e) => e.to === to);
  if (existing) {
    existing.weight = weight;
  } else {
    edges.push({ to, weight });
    graph.edges.set(from, edges);
  }
}

export function addBidirectionalEdge(
  graph: Graph,
  a: NodeId,
  b: NodeId,
  weight: number = 1,
): void {
  addEdge(graph, a, b, weight);
  addEdge(graph, b, a, weight);
}

export function neighbors(graph: Graph, nodeId: NodeId): Edge[] {
  return graph.edges.get(nodeId) || [];
}
