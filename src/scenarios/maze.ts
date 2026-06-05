import { createGraph, addBidirectionalEdge } from "../utils/graph.js";
import { bfs, dfs, dijkstra, astar } from "../algorithms/index.js";
import type { AlgoName, PathResult } from "../utils/types.js";

const ROWS = 21;
const COLS = 51;

const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const FG_GREEN = "\x1b[32m";

const WALL = "██";
const EMPTY = "  ";
const START = "S ";
const END = "E ";
const VISITED = "# ";
const PATH = "* ";

type Cell = "wall" | "empty" | "start" | "end";
type MazeGrid = Cell[][];

function key(r: number, c: number) {
  return `${r},${c}`;
}

function parseKey(k: string): [number, number] {
  const [r, c] = k.split(",").map(Number);
  return [r, c];
}

function generateMaze(rows: number, cols: number): MazeGrid {
  const grid: MazeGrid = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => "wall" as Cell),
  );

  function carve(r: number, c: number) {
    grid[r][c] = "empty";
    const dirs = [
      [-2, 0],
      [2, 0],
      [0, -2],
      [0, 2],
    ].sort(() => Math.random() - 0.5);

    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (
        nr > 0 &&
        nr < rows - 1 &&
        nc > 0 &&
        nc < cols - 1 &&
        grid[nr][nc] === "wall"
      ) {
        grid[r + dr / 2][c + dc / 2] = "empty";
        carve(nr, nc);
      }
    }
  }

  carve(1, 1);

  grid[1][1] = "start";
  grid[rows - 2][cols - 2] = "end";

  return grid;
}

function buildGraphFromMaze(grid: MazeGrid) {
  const graph = createGraph();
  const rows = grid.length;
  const cols = grid[0].length;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === "wall") continue;
      const dirs = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ];
      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (
          nr >= 0 &&
          nr < rows &&
          nc >= 0 &&
          nc < cols &&
          grid[nr][nc] !== "wall"
        ) {
          addBidirectionalEdge(graph, key(r, c), key(nr, nc));
        }
      }
    }
  }

  return graph;
}

function manhattanHeuristic(endKey: string) {
  const [er, ec] = parseKey(endKey);
  return (a: string) => {
    const [ar, ac] = parseKey(a);
    return Math.abs(ar - er) + Math.abs(ac - ec);
  };
}

function render(
  grid: MazeGrid,
  visited: Set<string>,
  path: Set<string>,
  start: string,
  end: string,
): string {
  const lines: string[] = [];

  lines.push("----" + "-".repeat(COLS * 2 - 4) + "----");

  for (let r = 0; r < grid.length; r++) {
    let line = "| ";
    for (let c = 0; c < grid[0].length; c++) {
      const k = key(r, c);
      if (k === start) line += START;
      else if (k === end) line += START;
      else if (path.has(k)) line += FG_GREEN + PATH + RESET;
      else if (visited.has(k)) line += VISITED;
      else if (grid[r][c] === "wall") line += WALL;
      else line += EMPTY;
    }
    line += " |";
    lines.push(line);
  }

  lines.push("----" + "-".repeat(COLS * 2 - 4) + "----");

  return lines.join("\n");
}

function clearLines(n: number) {
  process.stdout.write(`\x1b[${n}A\x1b[0J`);
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

const ALGO_LABELS: Record<AlgoName, string> = {
  bfs: "BFS",
  dfs: "DFS",
  dijkstra: "Dijkstra",
  astar: "A*",
};

async function runMaze(algoName: AlgoName) {
  const grid = generateMaze(ROWS, COLS);
  const graph = buildGraphFromMaze(grid);
  const startKey = key(1, 1);
  const endKey = key(ROWS - 2, COLS - 2);

  let result: PathResult;

  if (algoName === "bfs") result = bfs(graph, startKey, endKey);
  else if (algoName === "dfs") result = dfs(graph, startKey, endKey);
  else if (algoName === "dijkstra") result = dijkstra(graph, startKey, endKey);
  else {
    const h = manhattanHeuristic(endKey);
    result = astar(graph, startKey, endKey, h);
  }

  const label = ALGO_LABELS[algoName];

  console.log(`\n> ${label}\n`);

  const visitedSet = new Set<string>();
  const pathSet = new Set<string>();

  const header = `Visited: 0   Path: 0\n`;
  process.stdout.write(header);

  const initialFrame = render(grid, visitedSet, pathSet, startKey, endKey);
  process.stdout.write(initialFrame);
  const totalLines = ROWS + 3;

  for (let i = 0; i < result.visited.length; i++) {
    visitedSet.add(result.visited[i]);
    if (i % 3 === 0 || i === result.visited.length - 1) {
      clearLines(totalLines);
      process.stdout.write(`Visited: ${visitedSet.size}   Path: 0\n`);
      process.stdout.write(render(grid, visitedSet, pathSet, startKey, endKey));
      await sleep(8);
    }
  }

  for (const node of result.path) {
    pathSet.add(node);
    clearLines(totalLines);
    process.stdout.write(
      `Visited: ${visitedSet.size}   Path: ${pathSet.size}\n`,
    );
    process.stdout.write(render(grid, visitedSet, pathSet, startKey, endKey));
    await sleep(18);
  }

  console.log(`\nResult: ${result.found ? "+ Found" : "x Not found"}`);
  console.log(`Path length: ${result.path.length} steps`);
  console.log(`Explored: ${result.visited.length} nodes\n`);
}

async function runAll() {
  const algos: AlgoName[] = ["bfs", "dfs", "dijkstra", "astar"];
  const algoArg = process.env.ALGO as AlgoName | undefined;

  if (algoArg && algos.includes(algoArg)) {
    await runMaze(algoArg);
  } else {
    for (const algo of algos) {
      await runMaze(algo);
      await sleep(600);
    }
  }
}

runAll();
