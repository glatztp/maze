import type { Graph, NodeId, PathResult } from "../utils/types.js";
import { neighbors } from "../utils/graph.js";

export function dfs(graph: Graph, start: NodeId, end: NodeId): PathResult {
  const visited: NodeId[] = [];
  const parent = new Map<NodeId, NodeId | null>();
  const stack: NodeId[] = [start];

  parent.set(start, null);

  while (stack.length > 0) {
    const current = stack.pop()!;

    if (visited.includes(current)) continue;
    visited.push(current);

    if (current === end) {
      return {
        path: buildPath(parent, end),
        cost: visited.length,
        visited,
        found: true,
      };
    }

    for (const { to } of neighbors(graph, current)) {
      if (!parent.has(to)) {
        parent.set(to, current);
        stack.push(to);
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
