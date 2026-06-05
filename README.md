# Pathfinding Playground

A TypeScript-based interactive visualization of pathfinding algorithms. Explore how different graph traversal and shortest-path algorithms work through a maze solver and interactive web interface.

## Features

- **4 Pathfinding Algorithms**: BFS, DFS, Dijkstra, A\*
- **Terminal Maze Solver**: Real-time animated maze generation and solving
- **Interactive Web Visualizer**: Draw walls, place start/end points, run algorithms
- **Real-time Animation**: Watch the algorithm explore and find paths
- **Cross-Platform**: Works on Windows, macOS, and Linux

## Algorithms

### BFS (Breadth-First Search)

- Explores all nodes at the current depth before moving deeper
- Guarantees shortest path in unweighted graphs
- Uses a queue-based approach

### DFS (Depth-First Search)

- Explores as far as possible along each branch before backtracking
- Uses a stack-based approach
- Memory efficient but doesn't guarantee shortest path

### Dijkstra's Algorithm

- Finds the shortest path in weighted graphs
- Uses a priority queue (min-heap)
- Optimal for graphs with non-negative weights

### A\* Pathfinding

- Combines actual cost with heuristic estimates
- Uses Manhattan distance heuristic for maze solving
- More efficient than Dijkstra for informed searches

## Project Structure

```
src/
├── algorithms/
│   ├── bfs.ts
│   ├── dfs.ts
│   ├── dijkstra.ts
│   ├── astar.ts
│   └── index.ts
├── utils/
│   ├── types.ts
│   ├── graph.ts
│   ├── heap.ts
│   └── index.ts
└── scenarios/
    └── maze.ts

index.html          # Interactive web visualizer
```

## Installation

```bash
npm install
# or
pnpm install
# or
yarn install
```

## Usage

### Terminal Maze Solver

Run all algorithms:

```bash
pnpm maze
```

Run specific algorithm:

```bash
pnpm maze:bfs
pnpm maze:dfs
pnpm maze:dijkstra
pnpm maze:astar
```

### Web Visualizer

Open `index.html` in your browser to:

- Draw walls on the grid
- Move start and end points
- Select algorithm
- Control animation speed
- See real-time statistics

## Technologies

- **Language**: TypeScript 5.4.0
- **Runtime**: Node.js with tsx 4.7.0
- **Module System**: ES Modules (ESM)
- **Build Target**: ES2022
- **Cross-Platform**: cross-env 7.0.3
- **Type Safety**: Strict TypeScript configuration

## Key Data Structures

### Graph Representation

- Adjacency list using Map and Set
- Node IDs as strings
- Weighted edges with cost values

### Priority Queue (Min-Heap)

- Custom implementation for Dijkstra and A\*
- O(log n) insertion and extraction
- Efficient node selection in weighted algorithms

### Maze Generation

- Recursive backtracking algorithm
- Depth-first search based carving
- Random direction selection for variety

## Performance Characteristics

| Algorithm | Time Complexity  | Space Complexity | Guarantee                      |
| --------- | ---------------- | ---------------- | ------------------------------ |
| BFS       | O(V + E)         | O(V)             | Shortest path (unweighted)     |
| DFS       | O(V + E)         | O(h)             | Not optimal                    |
| Dijkstra  | O((V + E) log V) | O(V)             | Shortest path (weighted)       |
| A\*       | O((V + E) log V) | O(V)             | Shortest path (with heuristic) |

## Terminal Animation

The terminal maze visualization shows:

- `██` - Walls
- `S` - Start position
- `E` - End position
- `#` - Visited cells
- `*` - Solution path
- Color-coded output for each algorithm
- Real-time statistics (visited count, path length)

## Configuration

- **Maze Size**: 21 rows × 51 columns (customizable)
- **Animation Speed**: 8ms per visited cell, 18ms per path cell
- **Canvas Size** (web): 60×34 cells with 16px per cell

## Development

Build project:

```bash
pnpm exec tsc
```

Run tests:

```bash
pnpm exec tsx src/scenarios/maze.ts
```

## License

MIT

## Author

Created as a learning project for exploring graph algorithms and their visualizations.
