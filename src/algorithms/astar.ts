import type { Graph, NodeId, PathResult } from "../utils/types.js";
import { neighbors } from "../utils/graph.js";
import { MinHeap } from "../utils/heap.js";

type Heuristic = (a: NodeId, b: NodeId) => number;

export function astar(
  graph: Graph,
  start: NodeId,
  end: NodeId,
  heuristic: Heuristic,
): PathResult {
  const g = new Map<NodeId, number>();
  const parent = new Map<NodeId, NodeId | null>();
  const visited: NodeId[] = [];
  const heap = new MinHeap<NodeId>();

  for (const node of graph.nodes) g.set(node, Infinity);
  g.set(start, 0);
  parent.set(start, null);
  heap.push(start, heuristic(start, end));

  while (heap.size > 0) {
    const current = heap.pop()!;

    if (visited.includes(current)) continue;
    visited.push(current);

    if (current === end) {
      return {
        path: buildPath(parent, end),
        cost: g.get(end)!,
        visited,
        found: true,
      };
    }

    for (const { to, weight } of neighbors(graph, current)) {
      const tentative = g.get(current)! + weight;
      if (tentative < (g.get(to) ?? Infinity)) {
        g.set(to, tentative);
        parent.set(to, current);
        heap.push(to, tentative + heuristic(to, end));
      }
    }
  }

  return { path: [], cost: 0, visited, found: false };
}

function buildPath(parent: Map<NodeId, NodeId | null>, end: NodeId): NodeId[] {
  const path: NodeId[] = [];
  let current: NodeId | null = end;
  while (current !== null) {
    path.unshift(current);
    current = parent.get(current) ?? null;
  }
  return path;
}
