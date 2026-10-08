// Cluster geometry for the graph. Each category sits inside a ring whose
// radius grows with the square root of its node count, so every ring holds
// its nodes at about the same density. The rings are laid out around one big
// circle, each taking a share of the circumference in proportion to its size,
// so large and small neighbours keep the same gap between them.

// Clockwise order around the circle; related groups sit next to each other
export const CLUSTER_ORDER = [
  'core-functions',
  'lambda-calculus',
  'composition',
  'effects',
  'purity-state',
  'category-morphisms',
  'algebraic-structures',
  'types-data'
];

// A category with BASE_COUNT nodes gets a ring of BASE_RING
const BASE_RING = 400;
const BASE_COUNT = 12;
const MIN_SCALE = 1;
const MAX_SCALE = 1.7;
// Space between neighbouring rings, along the big circle
const GAP = 110;
const START_ANGLE = 0.1 * Math.PI;

// The extent the original seven-cluster layout was tuned for (centre circle
// plus ring); zoom levels are scaled relative to it
export const REFERENCE_EXTENT = 653 + 308;

export function clusterLayout(nodes, categoryIds = [], { baseRing = BASE_RING, baseCount = BASE_COUNT } = {}) {
  const counts = {};
  for (const n of nodes) counts[n.category] = (counts[n.category] || 0) + 1;

  const order = [
    ...CLUSTER_ORDER,
    ...categoryIds.filter(c => !CLUSTER_ORDER.includes(c)),
    ...Object.keys(counts).filter(c => !CLUSTER_ORDER.includes(c) && !categoryIds.includes(c))
  ].filter(c => counts[c]);

  const rings = {};
  for (const c of order) {
    const scale = Math.sqrt(counts[c] / baseCount);
    rings[c] = baseRing * Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));
  }

  // Arc length each cluster needs: its diameter plus the gap
  const arcs = order.map(c => 2 * rings[c] + GAP);
  const total = arcs.reduce((a, b) => a + b, 0);
  const radius = total / (2 * Math.PI);

  const centers = {};
  let cursor = START_ANGLE;
  order.forEach((c, i) => {
    const angle = cursor + arcs[i] / 2 / radius;
    centers[c] = { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
    cursor += arcs[i] / radius;
  });

  const extent = radius + Math.max(...order.map(c => rings[c]));
  return { centers, rings, radius, extent };
}
