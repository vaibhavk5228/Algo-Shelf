'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
require(path.join(__dirname, '..', 'algorithms.js'));
const { sortTrace, searchGrid } = globalThis.AlgoShelf;
let seed = 2049;
const rand = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
const arrays = [[], [1], [2, 1], [1, 2], [5, 5, 5], [9, 1, 9, 1, 9], [99, 75, 50, 25, 1], [-3, 0, 2, -7, 2], [1.2, -0.5, 2.7]];
for (let i = 0; i < 80; i++) arrays.push(Array.from({ length: 2 + Math.floor(rand() * 39) }, () => 1 + Math.floor(rand() * 99)));
for (const algorithm of ['bubble', 'selection', 'insertion', 'quick', 'merge']) {
  test(`${algorithm}: sorted output, immutable input and consistent traces on ${arrays.length} cases`, () => {
    for (const input of arrays) {
      const before = input.slice();
      const trace = sortTrace(input, algorithm);
      const last = trace.at(-1);
      assert.deepEqual(last.values, before.slice().sort((a, b) => a - b));
      assert.deepEqual(input, before);
      assert.deepEqual(trace[0].values, before);
      assert.equal(last.fixed.length, input.length);
      assert.equal(new Set(last.fixed).size, input.length);
      assert.ok(trace.length >= 2);
      let compares = 0, writes = 0;
      for (const frame of trace) {
        assert.equal(frame.values.length, input.length);
        assert.ok(frame.comparisons >= compares && frame.writes >= writes);
        assert.ok(frame.active.every(i => i >= 0 && i < input.length));
        assert.ok(frame.fixed.every(i => i >= 0 && i < input.length));
        assert.ok(frame.values.every(Number.isFinite));
        compares = frame.comparisons; writes = frame.writes;
      }
      if (input.length) { last.values[0] = 9999; assert.deepEqual(trace[0].values, before); }
    }
  });
}
test('exact comparison/write counts for a two-value bubble swap', () => {
  const last = sortTrace([2, 1], 'bubble').at(-1);
  assert.equal(last.comparisons, 1); assert.equal(last.writes, 2);
});
test('bubble early exit on already sorted values', () => {
  const last = sortTrace([1, 2, 3, 4, 5], 'bubble').at(-1);
  assert.equal(last.comparisons, 4); assert.equal(last.writes, 0);
});
test('sorting rejects invalid engine inputs', () => {
  assert.throws(() => sortTrace([1], 'unknown'));
  assert.throws(() => sortTrace([NaN], 'bubble'));
  assert.throws(() => sortTrace([Infinity], 'bubble'));
  assert.throws(() => sortTrace([1, '2'], 'bubble'));
  assert.throws(() => sortTrace(Array(101).fill(1), 'bubble'));
  assert.throws(() => sortTrace(null, 'bubble'));
});
function referenceDistance(rows, cols, walls, start, goal) {
  const distance = Array(rows * cols).fill(Infinity); distance[start] = 0;
  for (let pass = 0; pass < rows * cols; pass++) {
    let changed = false;
    for (let i = 0; i < rows * cols; i++) if (!walls.has(i) && Number.isFinite(distance[i])) {
      for (let j = 0; j < rows * cols; j++) {
        if (walls.has(j)) continue;
        const adjacent = Math.abs(Math.floor(i / cols) - Math.floor(j / cols)) + Math.abs(i % cols - j % cols) === 1;
        if (adjacent && distance[j] > distance[i] + 1) { distance[j] = distance[i] + 1; changed = true; }
      }
    }
    if (!changed) break;
  }
  return distance[goal];
}
function validRoute(result, rows, cols, walls, start, goal) {
  assert.equal(new Set(result.visited).size, result.visited.length);
  assert.ok(result.visited.every(i => i >= 0 && i < rows * cols && !walls.has(i)));
  if (!result.found) { assert.deepEqual(result.path, []); return; }
  assert.equal(result.path[0], start); assert.equal(result.path.at(-1), goal);
  assert.equal(new Set(result.path).size, result.path.length);
  result.path.forEach((i, p) => {
    assert.ok(!walls.has(i) && result.visited.includes(i));
    if (p) { const j = result.path[p - 1]; assert.equal(Math.abs(Math.floor(i / cols) - Math.floor(j / cols)) + Math.abs(i % cols - j % cols), 1); }
  });
}
for (const algorithm of ['bfs', 'dfs']) {
  test(`${algorithm}: empty grid and legal route`, () => {
    const result = searchGrid(15, 25, new Set(), 176, 198, algorithm);
    assert.equal(result.found, true); validRoute(result, 15, 25, new Set(), 176, 198);
    if (algorithm === 'bfs') assert.equal(result.path.length - 1, 22);
  });
  test(`${algorithm}: no route through a separating wall`, () => {
    const walls = new Set([3, 4, 5]); const result = searchGrid(3, 3, walls, 0, 8, algorithm);
    assert.equal(result.found, false); validRoute(result, 3, 3, walls, 0, 8);
  });
  test(`${algorithm}: start equals goal`, () => {
    const result = searchGrid(1, 1, new Set(), 0, 0, algorithm);
    assert.equal(result.found, true); assert.deepEqual(result.path, [0]);
  });
  test(`${algorithm}: blocked endpoints are unreachable`, () => {
    assert.equal(searchGrid(3, 3, new Set([0]), 0, 8, algorithm).found, false);
    assert.equal(searchGrid(3, 3, new Set([8]), 0, 8, algorithm).found, false);
  });
  test(`${algorithm}: 60 seeded mazes match independent reachability and distance oracle`, () => {
    for (let t = 0; t < 60; t++) {
      const walls = new Set(); for (let i = 1; i < 35; i++) if (rand() < 0.28) walls.add(i);
      const before = [...walls]; const result = searchGrid(6, 6, walls, 0, 35, algorithm);
      const distance = referenceDistance(6, 6, walls, 0, 35);
      assert.equal(result.found, Number.isFinite(distance));
      if (algorithm === 'bfs' && result.found) assert.equal(result.path.length - 1, distance);
      validRoute(result, 6, 6, walls, 0, 35); assert.deepEqual([...walls], before);
    }
  });
}
test('invalid graph inputs are rejected', () => {
  assert.throws(() => searchGrid(0, 3, [], 0, 1, 'bfs'));
  assert.throws(() => searchGrid(3, 3, [], -1, 1, 'bfs'));
  assert.throws(() => searchGrid(3, 3, [], 0, 9, 'dfs'));
  assert.throws(() => searchGrid(3, 3, [], 0, 1, 'unknown'));
});
