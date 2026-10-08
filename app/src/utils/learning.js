// Graph views and learning-path progress, both remembered in localStorage.
// Storage can be missing or throw (private windows, blocked site data), so
// every access falls back to the defaults.

export const VIEW_LEVELS = ['essentials', 'practical', 'everything'];
export const VIEW_LABELS = { essentials: 'Essentials', practical: 'Practical', everything: 'Everything' };
export const DEFAULT_VIEW = 'essentials';

const VIEW_KEY = 'fp_view';
const PROGRESS_KEY = 'fp_learning_v1';

export const levelRank = (level) => Math.max(0, VIEW_LEVELS.indexOf(level));

// Smallest view that shows a term of this level, given the current view
export const viewFor = (level, view) =>
  levelRank(level) > levelRank(view) ? level : view;

export function loadView() {
  try {
    const saved = localStorage.getItem(VIEW_KEY);
    if (VIEW_LEVELS.includes(saved)) return saved;
  } catch { /* fall through */ }
  return DEFAULT_VIEW;
}

export function saveView(view) {
  try { localStorage.setItem(VIEW_KEY, view); } catch { /* not persisted */ }
}

// Progress is stored by term id rather than step number, so it survives
// steps being added to or reordered in learning-paths.md:
//   { active: pathId | null,
//     paths: { [pathId]: { current: termId, seen: [termId], done: bool, at: ms } } }
const EMPTY = { active: null, paths: {} };

export function loadProgress(paths) {
  try {
    const raw = JSON.parse(localStorage.getItem(PROGRESS_KEY));
    if (!raw || typeof raw !== 'object') return EMPTY;
    const byId = Object.fromEntries(paths.map(p => [p.id, p]));
    const kept = {};
    for (const [id, entry] of Object.entries(raw.paths || {})) {
      const path = byId[id];
      if (!path || !entry) continue;
      const ids = new Set(path.steps.map(s => s.termId));
      kept[id] = {
        current: ids.has(entry.current) ? entry.current : path.steps[0].termId,
        seen: (entry.seen || []).filter(t => ids.has(t)),
        done: Boolean(entry.done),
        at: Number(entry.at) || 0
      };
    }
    return { active: kept[raw.active] ? raw.active : null, paths: kept };
  } catch {
    return EMPTY;
  }
}

export function saveProgress(progress) {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress)); } catch { /* not persisted */ }
}

export const stepIndexOf = (path, termId) =>
  path ? path.steps.findIndex(s => s.termId === termId) : -1;

// The most recently used path that's paused part-way, for "resume"
export function pausedPath(progress, paths) {
  return paths
    .filter(p => progress.paths[p.id] && !progress.paths[p.id].done && p.id !== progress.active)
    .sort((a, b) => progress.paths[b.id].at - progress.paths[a.id].at)[0] || null;
}
