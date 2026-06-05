import type { Graph, NodeId, PathResult } from "../utils/types.js";
import { neighbors } from "../utils/graph.js";
import { MinHeap } from "../utils/heap.js";

export function dijkstra(graph: Graph, start: NodeId, end: NodeId): PathResult {
  const dist = new Map<NodeId, number>();
  const parent = new Map<NodeId, NodeId | null>();
  const visited: NodeId[] = [];
  const heap = new MinHeap<NodeId>();

  for (const node of graph.nodes) dist.set(node, Infinity);
  dist.set(start, 0);
  parent.set(start, null);
  heap.push(start, 0);

  while (heap.size > 0) {
    const current = heap.pop()!;

    if (visited.includes(current)) continue;
    visited.push(current);

    if (current === end) {
      return {
        path: buildPath(parent, end),
        cost: dist.get(end)!,
        visited,
        found: true,
      };
    }

    for (const { to, weight } of neighbors(graph, current)) {
      const newDist = dist.get(current)! + weight;
      if (newDist < (dist.get(to) ?? Infinity)) {
        dist.set(to, newDist);
        parent.set(to, current);
        heap.push(to, newDist);
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
