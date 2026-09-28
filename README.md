# AlgoShelf

Link : https://vaibhavk5228.github.io/Algo-Shelf/

**A little order. A lot of understanding.**

An interactive algorithm learning lab: sort a shelf of numbers, draw obstacles on a grid, and follow each operation rather than watching an unexplained animation.

## Features

- **Five sorting algorithms:** Bubble, Selection, Insertion, Quick, and Merge.
- **Two graph searches:** Breadth-first search (BFS) and Depth-first search (DFS).
- Visualize, pause/resume, step forward/back, reset, replay, and scrub the timeline.
- Numeric book visualization with active, pivot, and final-position states.
- Custom arrays of 2–40 integers between 1 and 99.
- Random, reversed, sorted, nearly sorted, and few-unique input patterns.
- Comparison and array-write counters; algorithm explanations and highlighted pseudocode.
- Editable 15 × 25 grid: draw/erase walls, reposition start/goal, randomize or clear walls.
- Visited-cell and route-length counters; explicit no-route feedback.
- Responsive layout, labeled controls, keyboard-editable grid, reduced-motion support.
- No build step, framework, package downloads, or runtime JavaScript dependencies.

## Quick start

Open `index.html` in a modern browser. Or, with Node.js 18 or later:

```sh
npm start
```

Then open `http://localhost:8080`. No `npm install` is needed: all scripts use built-in Node modules.

The Google Fonts stylesheet is optional. Without internet access, fallback fonts are used; visualization logic remains local. There is no service worker or claim of installable/offline-cache support.

## Run the tests

```sh
npm test
```

Tests exercise all sorting engines on fixed and seeded inputs, input immutability, trace consistency, counters, BFS shortest paths, DFS reachability, obstructed grids, blocked endpoints, invalid inputs, and start-equals-goal.

## Publish on GitHub Pages

1. Extract this archive. Put the **contents of the `algoshelf` folder** at your repository root, with `index.html` at the top level.
2. Create your own GitHub repository, for example `algoshelf`, and upload/commit these files. Include the hidden `.gitignore` and `.nojekyll` files when using Git.
3. In repository **Settings → Pages**, choose **Deploy from a branch**, then **main** and **/(root)** (or whichever branch you actually used).
4. Save. Once deployment completes, GitHub displays the live site address in Pages settings.

Official guide: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

Suggested description: `An interactive sorting and pathfinding lab with step-by-step playback, book visualizations, and editable mazes.`

Suggested topics: `algorithm-visualizer`, `sorting-algorithms`, `pathfinding`, `javascript`, `data-structures`, `github-pages`.

## Repository layout

```text
algoshelf/
├── index.html              # Semantic interface
├── styles.css              # Responsive forest / cream theme
├── algorithms.js           # Pure sorting traces and grid searches
├── app.js                  # DOM, playback, controls, grid interaction
├── server.cjs              # Local static server (Node built-ins only)
├── package.json            # start and test scripts; no dependencies
├── tests/
│   └── algorithms.test.cjs  # Deterministic algorithm regression suite
├── README.md
├── ANALYSIS.md             # Reference-project review and changes
├── LICENSE
├── .gitignore
└── .nojekyll
```

## Controls

### Sorting

Select an algorithm, number of books, pace, and starting order. **Shuffle** rearranges the current values; changing size/order generates a fresh dataset. **Reset** returns playback to the start of the same dataset. A custom array replaces it after validation. Compare algorithms on the same values by changing only the algorithm selector.

**Array writes** counts assignments into the working array (a swap counts as two). It does not count temporary-variable or auxiliary-buffer writes. Insertion and merge can display duplicate values temporarily while a key is held or a buffer is being merged; the event text explains that intermediate state.

### Pathfinder

Select **Draw walls**, **Erase**, **Place S**, or **Place G**, then click/touch a cell. Drag across the grid to paint walls or erase. Tab into the grid, use arrow keys to move, and press Enter/Space to apply the selected tool. On small screens, scroll the grid horizontally using its container. Editing resets the previous trace. The two endpoints cannot occupy the same cell in the UI or be painted over with walls.

BFS guarantees a shortest route on this unweighted, four-neighbor grid. DFS finds a route if one exists, but not necessarily a shortest route. Random walls do not guarantee connectivity: a no-route result is expected for some layouts. Route length counts edges, not cells.

## Architecture and limitations

- `algorithms.js` exposes `globalThis.AlgoShelf`: `META`, `sortTrace`, and `searchGrid`.
- `sortTrace(values, algorithm)` returns immutable snapshots for reversible playback without mutating caller input.
- `searchGrid(rows, cols, walls, start, goal, algorithm)` returns visitation order and reconstructed path.
- `app.js` owns a single playback timer and clears it on reset, editing, mode changes, and hidden-tab pauses.
- Algorithm complexity shown in the UI describes the algorithm, **not** trace storage or DOM rendering. Sorting snapshots require additional memory proportional to array length times operation count; the UI caps input at 40 values. This is an educational visualizer, not a performance benchmark.
- Quick sort uses the last element as pivot and can degrade to quadratic time. No claim of optimized production sorting is made.
- No backend, authentication, analytics, persistence, account system, or remote data API.
- The release was checked in headless Chromium; cross-browser and assistive-technology testing should continue before claiming full accessibility conformance. See release validation output for the checks actually run.

## Customization

Change the brand/title in `index.html`, palette variables in `styles.css`, or the initial dataset in `app.js`. Add an algorithm by implementing its trace engine, metadata, selector option, and tests. Keep `algorithms.js` before `app.js` in the HTML script order.

## Inspiration and attribution

The library-sorting and drawable-maze concepts were inspired by [tpSpace/Algorithms-Visualizer](https://github.com/tpSpace/Algorithms-Visualizer) and its [live demo](https://tpspace.github.io/Algorithms-Visualizer/). AlgoShelf is a newly authored implementation with different styling, numeric data, and additional learning controls. No upstream source code, images, or videos are bundled. The reference project's authors retain credit for their work; do not describe it as your original project.

## License

MIT — see `LICENSE`. This license covers the newly authored files in this repository, not the referenced project or externally hosted fonts. Update contributor details as appropriate before publication.
