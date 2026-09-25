# Reference review and implementation decisions

Reviewed September 25, 2026.

## Reference project

Reference: https://tpspace.github.io/Algorithms-Visualizer/
Repository: https://github.com/tpSpace/Algorithms-Visualizer

The published project teaches sorting through alphabetically ordered library books and graph search through a drawable maze. Its README lists Bubble, Selection, Insertion, and Quick sort, plus BFS and DFS. It uses HTML, CSS, and TypeScript; its npm start script runs the TypeScript compiler in watch mode. The repository root includes source/output folders and a committed node_modules directory. The package metadata declares ISC.

The useful pattern to preserve is direct manipulation: change the dataset or obstacles, select an algorithm, and observe the result. The book metaphor makes ordering approachable; the grid makes search behavior spatial.

Sources: repository README; live sorting and graph pages; https://raw.githubusercontent.com/tpSpace/Algorithms-Visualizer/master/package.json

## Scope of analysis

This is a review of the live pages, README, repository root, and package metadata, not a line-by-line source-code or security audit. Fetching the GitHub source-directory page was restricted in the research environment. No claims about unreviewed internal source quality or undocumented original features are made.

## AlgoShelf: retained ideas, modest visible changes

| Area | Implementation choice |
|---|---|
| Core concepts | Keep a book-like sorting shelf and drawable pathfinding grid |
| Identity | New AlgoShelf name and forest-green / warm-paper visual design |
| Data | Use visible numbers instead of copied book titles/artwork |
| Algorithms | Retain four sorts and BFS/DFS; add Merge sort |
| Learning controls | Provide pause, replay, step forward/back, and timeline seek |
| Explanation | Present operation text, counters, complexity, and pseudocode |
| Inputs | Include validated custom arrays and several starting-order presets |
| Grid editing | Add keyboard operation, random walls, and explicit no-route feedback |
| Engineering | Independent vanilla JavaScript source, separated pure engines and UI |
| Repository | Include deterministic tests, local server, docs, MIT license, and ignore rules |

These are features of AlgoShelf, not assertions that every corresponding feature is absent from the reference project.

## Intentional differences

Although the visible concept remains similar, the source is independently authored rather than a minimally renamed fork. There is no TypeScript build step, external JavaScript dependency, copied author identity, or reused media. Upstream inspiration is credited in the footer and README. The goal is a maintainable educational repository that can be explained and extended, not an attempt to disguise the original authors' work.

## Good next extensions

- Add A* or Dijkstra only alongside a clear explanation of weighted edges/heuristics.
- Add a side-by-side comparison view with identical inputs.
- Export/import datasets and wall layouts.
- Add mobile touch and screen-reader testing across additional browsers.
