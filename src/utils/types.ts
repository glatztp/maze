export type NodeId = string;

export interface Edge {
  to: NodeId;
  weight: number;
}

export interface Graph {
  nodes: Set<NodeId>;
  edges: Map<NodeId, Edge[]>;
}

export interface PathResult {
  path: NodeId[];
  cost: number;
  visited: NodeId[];
  found: boolean;
}

export type AlgoName = "bfs" | "dfs" | "dijkstra" | "astar";

export interface GridCell {
  row: number;
  col: number;
}

export type CellType = "empty" | "wall" | "start" | "end" | "visited" | "path";

export interface Grid {
  rows: number;
  cols: number;
  cells: CellType[][];
  start: GridCell;
  end: GridCell;
}
