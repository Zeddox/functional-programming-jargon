import React, { useState, useEffect, useMemo } from 'react';
import jargonsData from './data/jargons.json';
import GraphCanvas from './components/GraphCanvas';
import SearchHUD from './components/SearchHUD';
import NodeDetailPanel from './components/NodeDetailPanel';
import CombinatorsModal from './components/CombinatorsModal';
import PathsModal from './components/PathsModal';
import { soundEffects } from './utils/audio';
import {
  VIEW_LEVELS, levelRank, viewFor, loadView, saveView,
  loadProgress, saveProgress, stepIndexOf, pausedPath
} from './utils/learning';
import {
  Search,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Shuffle,
  Route
} from 'lucide-react';
import { GithubIcon } from './components/Icons';

// Desktop drawer sizing
const MIN_PANEL_WIDTH = 360;
const MIN_CANVAS_WIDTH = 520; // room for the header's logo and toolbar beside the drawer

const defaultPanelWidth = (winW) => (winW >= 1024 ? 560 : 500);

const clampPanelWidth = (width, winW) =>
  Math.max(MIN_PANEL_WIDTH, Math.min(width, winW - MIN_CANVAS_WIDTH));

export default function App() {
  const { meta, categories, terms, graph, combinators, paths = [] } = jargonsData;

  // Graph view: how much of the jargon to show. A link or search result for a
  // term outside the view widens the view to include it.
  const [view, setViewState] = useState(() => {
    const saved = loadView();
    const hash = typeof window !== 'undefined' ? window.location.hash.replace(/^#/, '') : '';
    const term = terms.find(t => t.id === hash);
    return term ? viewFor(term.level, saved) : saved;
  });
  const setView = setViewState;
  // Remember whichever view is showing, including one widened by a link
  useEffect(() => saveView(view), [view]);

  // Learning-path progress (see utils/learning.js for the stored shape)
  const [progress, setProgressState] = useState(() => loadProgress(paths));
  const updateProgress = (fn) => setProgressState(prev => {
    const next = fn(prev);
    saveProgress(next);
    return next;
  });
  const [isPathsOpen, setIsPathsOpen] = useState(false);
  const activePath = paths.find(p => p.id === progress.active) || null;
  const activeStepIndex = activePath ? stepIndexOf(activePath, progress.paths[activePath.id]?.current) : -1;

  
  // Highlighted node on the graph (from the initial URL hash); null shows the overview
  // Topic (category) the graph frames; GraphCanvas owns it and reports changes
  const [framedTopic, setFramedTopic] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash && terms.some(t => t.id === hash)) {
        return hash;
      }
    }
    return null;
  });

  // Sidebar detail panel: open if valid hash in URL on initial load, otherwise closed
  const [isPanelOpen, setIsPanelOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace(/^#/, '');
      return Boolean(hash && terms.some(t => t.id === hash));
    }
    return false;
  });

  // Terms on the graph: everything up to the view's level, plus the steps of
  // the active path wherever they sit, plus the term being read
  const viewIds = useMemo(() => {
    const rank = levelRank(view);
    const ids = new Set(terms.filter(t => levelRank(t.level) <= rank).map(t => t.id));
    activePath?.steps.forEach(step => ids.add(step.termId));
    return ids;
  }, [terms, view, activePath]);
  // Only depends on the selection when it's outside the view, so ordinary
  // clicks don't re-lay out the graph
  const extraId = selectedNodeId && !viewIds.has(selectedNodeId) ? selectedNodeId : null;
  const visibleIds = useMemo(
    () => (extraId ? new Set([...viewIds, extraId]) : viewIds),
    [viewIds, extraId]
  );

  // Memoised so the canvas only re-lays out when the visible set changes
  const visibleGraph = useMemo(() => ({
    nodes: graph.nodes.filter(n => visibleIds.has(n.id)),
    links: graph.links.filter(l => visibleIds.has(l.source) && visibleIds.has(l.target))
  }), [graph, visibleIds]);

  const viewCounts = useMemo(() => Object.fromEntries(VIEW_LEVELS.map(v =>
    [v, terms.filter(t => levelRank(t.level) <= levelRank(v)).length])), [terms]);
  // Per topic (category), how many terms each view shows: { [category]: { [view]: n } }
  const topicCounts = useMemo(() => Object.fromEntries(Object.keys(categories).map(id =>
    [id, Object.fromEntries(VIEW_LEVELS.map(v =>
      [v, terms.filter(t => t.category === id && levelRank(t.level) <= levelRank(v)).length]))])), [terms, categories]);

  const pathSteps = useMemo(() => activePath?.steps.map(s => s.termId) ?? null, [activePath]);

  // Command palette search modal
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // C# function combinator reference popup (also reachable via #combinators)
  const [isCombinatorsOpen, setIsCombinatorsOpen] = useState(
    () => typeof window !== 'undefined' && window.location.hash === '#combinators'
  );
  const [combinatorFocus, setCombinatorFocus] = useState(null);

  const handleOpenCombinators = (letter = null) => {
    setCombinatorFocus(letter);
    setIsCombinatorsOpen(true);
  };
  
  // Customization toggles
  const [useCategoryColors] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Initialize theme: check explicit preference or default to dark mode
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const explicit = localStorage.getItem('fp_theme_explicit');
      if (explicit) return explicit === 'dark';
    }
    return true; // Default to dark mode
  });

  // Track viewport width: the drawer is a bottom sheet below the sm breakpoint
  const [windowWidth, setWindowWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1280
  );
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const isMobile = windowWidth < 640;

  // Desktop drawer width: user-resizable and remembered across visits
  const [preferredPanelWidth, setPreferredPanelWidth] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = Number(localStorage.getItem('fp_panel_width'));
      if (saved) return saved;
    }
    return null; // null = responsive default
  });
  const [isResizingPanel, setIsResizingPanel] = useState(false);
  const panelWidth = clampPanelWidth(
    preferredPanelWidth ?? defaultPanelWidth(windowWidth),
    windowWidth
  );

  const handlePanelResize = (width) => {
    const next = width === null ? null : clampPanelWidth(width, window.innerWidth);
    setPreferredPanelWidth(next);
    if (next === null) localStorage.removeItem('fp_panel_width');
    else localStorage.setItem('fp_panel_width', String(Math.round(next)));
  };

  // Width the drawer actually covers on the right edge of the screen
  const panelInset = isPanelOpen && !isMobile ? panelWidth : 0;
  // On narrow screens even the smallest drawer leaves no room for the logo
  const isHeaderCramped = panelInset > 0 && windowWidth - panelInset < MIN_CANVAS_WIDTH;

  // Map of terms by id for instant lookup
  const allTermsMap = useMemo(() => {
    const map = {};
    terms.forEach(t => { map[t.id] = t; });
    return map;
  }, [terms]);

  // Handle URL hash navigation on mount and on hash changes
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash === 'combinators') {
        setIsCombinatorsOpen(true);
      } else if (hash && allTermsMap[hash]) {
        revealTerm(hash);
        setSelectedNodeId(hash);
        setIsPanelOpen(true);
        setSearchQuery('');
      } else if (!hash) {
        setIsPanelOpen(false);
        setSelectedNodeId(null);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [allTermsMap]);

  // Widen the view if a term is outside it (and not on the active path)
  function revealTerm(termId) {
    const term = allTermsMap[termId];
    if (!term || (activePath && stepIndexOf(activePath, termId) >= 0)) return;
    setViewState(current => viewFor(term.level, current));
  }

  // Move a path's bookmark to one of its steps
  const markStep = (pathId, termId, extra = {}) => updateProgress(prev => {
    const entry = prev.paths[pathId] || { seen: [], done: false };
    return {
      ...prev,
      ...extra,
      paths: {
        ...prev.paths,
        [pathId]: {
          ...entry,
          current: termId,
          seen: entry.seen.includes(termId) ? entry.seen : [...entry.seen, termId],
          at: Date.now()
        }
      }
    };
  });

  const showTerm = (termId) => {
    setSelectedNodeId(termId);
    setSearchQuery('');
    setIsPanelOpen(true);
    window.history.replaceState(null, '', `#${termId}`);
  };

  // Begin (or continue) a path at a step: its first step by default
  const handleStartPath = (pathId, termId = null, { restart = false } = {}) => {
    const path = paths.find(p => p.id === pathId);
    if (!path) return;
    const target = termId || path.steps[0].termId;
    updateProgress(prev => ({
      ...prev,
      active: pathId,
      paths: {
        ...prev.paths,
        [pathId]: {
          current: target,
          seen: [...new Set([...(restart ? [] : prev.paths[pathId]?.seen || []), target])],
          done: false,
          at: Date.now()
        }
      }
    }));
    setIsPathsOpen(false);
    showTerm(target);
  };

  const handleResumePath = (pathId) => {
    const entry = progress.paths[pathId];
    handleStartPath(pathId, entry?.current);
  };

  const handleGoToStep = (index) => {
    if (!activePath) return;
    const step = activePath.steps[Math.max(0, Math.min(index, activePath.steps.length - 1))];
    markStep(activePath.id, step.termId);
    showTerm(step.termId);
  };

  // Pausing keeps the bookmark; the empty-state card offers to resume
  const handlePausePath = () => updateProgress(prev => ({ ...prev, active: null }));

  const handleFinishPath = () => {
    if (!activePath) return;
    const id = activePath.id;
    updateProgress(prev => ({
      ...prev,
      active: null,
      paths: { ...prev.paths, [id]: { ...prev.paths[id], done: true, at: Date.now() } }
    }));
  };

  // Update hash and reset search filter when a node is selected
  const handleSelectNode = (nodeId) => {
    if (nodeId) {
      revealTerm(nodeId);
      // Picking another step of the active path moves the bookmark there
      if (activePath && stepIndexOf(activePath, nodeId) >= 0) markStep(activePath.id, nodeId);
    }
    setSelectedNodeId(nodeId);
    setSearchQuery('');
    if (nodeId) {
      setIsPanelOpen(true);
      window.history.replaceState(null, '', `#${nodeId}`);
    } else {
      if (activePath) handlePausePath();
      setIsPanelOpen(false);
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  // Close drawer and clear the selection (on a path, closing pauses it)
  const handleClosePanel = () => {
    if (activePath) handlePausePath();
    setIsPanelOpen(false);
    setSelectedNodeId(null);
    window.history.replaceState(null, '', window.location.pathname);
  };

  // Pick a random term from the current view
  const handleRandomTerm = () => {
    const pool = terms.filter(t => visibleIds.has(t.id));
    const randomTerm = pool[Math.floor(Math.random() * pool.length)];
    if (randomTerm) {
      handleSelectNode(randomTerm.id);
      soundEffects.select(soundEnabled);
    }
  };

  // Sync dark class on document root and update meta theme-color
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', isDark ? '#121212' : '#eaeae8');
    }
  }, [isDark]);

  const handleCloseCombinators = () => {
    setIsCombinatorsOpen(false);
    if (window.location.hash === '#combinators') {
      window.history.replaceState(null, '', isPanelOpen && selectedNodeId ? `#${selectedNodeId}` : window.location.pathname);
    }
  };

  // Keyboard shortcut: Esc to close combinators popup, search modal or panel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isCombinatorsOpen) {
          handleCloseCombinators();
        } else if (isPathsOpen) {
          setIsPathsOpen(false);
        } else if (isSearchOpen) {
          setIsSearchOpen(false);
          setSearchQuery('');
        } else if (isPanelOpen) {
          handleClosePanel();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, isPanelOpen, isCombinatorsOpen, isPathsOpen, progress.active]);

  const activeTerm = (selectedNodeId && isPanelOpen) ? allTermsMap[selectedNodeId] : null;
  const resumable = pausedPath(progress, paths);

  // The tab title names the selected term and its topic, e.g. "Functor · Category & Morphisms — FP Jargon",
  // or with nothing selected the topic the graph frames, e.g. "Effects — FP Jargon"
  useEffect(() => {
    const term = selectedNodeId && allTermsMap[selectedNodeId];
    const topic = term ? categories[term.category]?.name : categories[framedTopic]?.name;
    document.title = term
      ? `${term.title}${topic ? ` · ${topic}` : ''} — FP Jargon`
      : topic
        ? `${topic} — FP Jargon`
        : 'FP Jargon — Interactive Functional Programming Knowledge Graph';
  }, [selectedNodeId, framedTopic]);

  return (
    <div className={`relative w-screen h-screen overflow-hidden flex flex-col font-mono transition-colors duration-200 ${
      isDark ? 'bg-[#121212] text-[#f0f0ee]' : 'bg-[#eaeae8] text-[#1a1a19]'
    }`}>
      {/* Subtle Background Grid */}
      <div className={`absolute inset-0 pointer-events-none ${
        isDark ? 'bg-grid-dark opacity-60' : 'bg-grid-light opacity-70'
      }`} />

      {/* Floating Transparent Header (No solid bar, fully transparent background & borderless) */}
      {/* The right padding tracks the open drawer so the toolbar slides over with it */}
      <header
        className={`relative z-30 px-4 sm:px-6 py-3 bg-transparent border-none flex items-center justify-between gap-4 pointer-events-auto ${
          isResizingPanel ? '' : 'transition-[padding] duration-300 ease-[var(--ease-out-expo)]'
        }`}
        style={panelInset ? { paddingRight: panelInset + 24 } : undefined}
      >
        {/* Logo / Brand */}
        <div className={`items-center gap-3 ${isHeaderCramped ? 'hidden' : 'flex'}`}>
          <div className={`w-7 h-7 border flex items-center justify-center font-mono font-bold text-sm shadow-sm ${
            isDark
              ? 'bg-[#1a1a19] border-[rgba(240,240,238,0.2)] text-[#f0f0ee]'
              : 'bg-[#eaeae8] border-[rgba(26,26,25,0.2)] text-[#1a1a19]'
          }`}>
            λ
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xs sm:text-sm font-bold tracking-tight">
                FP Jargon
              </h1>
              <span className={`hidden md:inline-block text-[9px] uppercase tracking-wider px-1.5 py-0.2 border ${
                isDark
                  ? 'bg-[#1a1a19] text-[#f0f0ee]/70 border-[rgba(240,240,238,0.15)]'
                  : 'bg-[#eaeae8] text-[#1a1a19]/70 border-[rgba(26,26,25,0.15)]'
              }`}>
                {meta.totalTerms} Terms
              </span>
            </div>
            <p className="hidden sm:block text-[10px] opacity-60">
              {meta.totalTerms} concepts · {meta.totalRelationships} relationships
            </p>
          </div>
        </div>

        {/* Right Toolbar Controls */}
        <div className="ml-auto flex items-center gap-1.5 text-xs">
          {/* Tiny Search Button */}
          <button
            onClick={() => {
              setIsSearchOpen(true);
              soundEffects.toggle(soundEnabled);
            }}
            title="Search concepts [/ or ⌘K]"
            aria-label="Search concepts"
            className={`flex items-center gap-1 px-2 py-1 border backdrop-blur-md transition ${
              isDark
                ? 'bg-[#1a1a19]/90 hover:bg-[#222220] text-[#f0f0ee]/80 hover:text-[#f0f0ee] border-[rgba(240,240,238,0.15)]'
                : 'bg-[#eaeae8]/95 hover:bg-[#dededb] text-[#1a1a19]/80 hover:text-[#1a1a19] border-[rgba(26,26,25,0.15)]'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[10px] opacity-50 font-mono">/</span>
          </button>

          {/* Learning paths */}
          <button
            onClick={() => {
              setIsPathsOpen(true);
              soundEffects.toggle(soundEnabled);
            }}
            title="Learning paths"
            aria-label="Learning paths"
            className={`flex items-center gap-1.5 px-2 py-1 border backdrop-blur-md transition ${
              activePath
                ? (isDark ? 'bg-amber-400/15 text-amber-300 border-amber-400/40' : 'bg-amber-500/15 text-amber-800 border-amber-600/40')
                : isDark
                  ? 'bg-[#1a1a19]/90 hover:bg-[#222220] text-[#f0f0ee]/80 hover:text-[#f0f0ee] border-[rgba(240,240,238,0.15)]'
                  : 'bg-[#eaeae8]/95 hover:bg-[#dededb] text-[#1a1a19]/80 hover:text-[#1a1a19] border-[rgba(26,26,25,0.15)]'
            }`}
          >
            <Route className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Paths</span>
          </button>

          {/* Random / Surprise Me */}
          <button
            onClick={handleRandomTerm}
            title="Pick a random concept"
            aria-label="Pick a random concept"
            className={`p-1.5 border backdrop-blur-md transition ${
              isDark
                ? 'bg-[#1a1a19]/90 hover:bg-[#222220] text-[#f0f0ee]/80 hover:text-[#f0f0ee] border-[rgba(240,240,238,0.15)]'
                : 'bg-[#eaeae8]/95 hover:bg-[#dededb] text-[#1a1a19]/80 hover:text-[#1a1a19] border-[rgba(26,26,25,0.15)]'
            }`}
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              setSoundEnabled(prev => !prev);
              soundEffects.toggle(!soundEnabled);
            }}
            title={soundEnabled ? "Mute sound" : "Enable sound"}
            aria-label={soundEnabled ? "Mute sound" : "Enable sound"}
            className={`p-1.5 border backdrop-blur-md transition ${
              isDark
                ? 'bg-[#1a1a19]/90 hover:bg-[#222220] text-[#f0f0ee]/80 hover:text-[#f0f0ee] border-[rgba(240,240,238,0.15)]'
                : 'bg-[#eaeae8]/95 hover:bg-[#dededb] text-[#1a1a19]/80 hover:text-[#1a1a19] border-[rgba(26,26,25,0.15)]'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 opacity-40" />}
          </button>

          {/* Prominent Light & Dark Toggle */}
          <button
            onClick={() => {
              setIsDark(prev => {
                const next = !prev;
                localStorage.setItem('fp_theme_explicit', next ? 'dark' : 'light');
                return next;
              });
              soundEffects.toggle(soundEnabled);
            }}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className={`flex items-center gap-1.5 px-2.5 py-1 border backdrop-blur-md transition ${
              isDark
                ? 'bg-[#1a1a19]/90 hover:bg-[#222220] text-amber-300 border-[rgba(240,240,238,0.15)]'
                : 'bg-[#eaeae8]/95 hover:bg-[#dededb] text-indigo-700 border-[rgba(26,26,25,0.15)]'
            }`}
          >
            {isDark ? (
              <>
                <Sun className="w-3 h-3" />
                <span className="hidden sm:inline text-[11px]">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3 h-3" />
                <span className="hidden sm:inline text-[11px]">Dark</span>
              </>
            )}
          </button>

          {/* GitHub Repo Link */}
          <a
            href="https://github.com/hemanth/functional-programming-jargon"
            target="_blank"
            rel="noopener noreferrer"
            title="View on GitHub"
            aria-label="View on GitHub"
            className={`p-1.5 border backdrop-blur-md transition ${
              isDark
                ? 'bg-[#1a1a19]/90 hover:bg-[#222220] text-[#f0f0ee]/80 hover:text-[#f0f0ee] border-[rgba(240,240,238,0.15)]'
                : 'bg-[#eaeae8]/95 hover:bg-[#dededb] text-[#1a1a19]/80 hover:text-[#1a1a19] border-[rgba(26,26,25,0.15)]'
            }`}
          >
            <GithubIcon className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* Main Experience: Interactive Knowledge Graph */}
      <main className="relative flex-1 w-full h-full overflow-hidden">
        <GraphCanvas
          graphData={visibleGraph}
          pathSteps={pathSteps}
          pathIndex={activeStepIndex}
          pathSeen={activePath ? progress.paths[activePath.id]?.seen : null}
          view={view}
          viewCounts={viewCounts}
          topicCounts={topicCounts}
          onTopicChange={setFramedTopic}
          onViewChange={(next) => {
            setView(next);
            soundEffects.toggle(soundEnabled);
          }}
          categories={categories}
          selectedNodeId={selectedNodeId}
          onSelectNode={handleSelectNode}
          searchQuery={searchQuery}
          useCategoryColors={useCategoryColors}
          soundEnabled={soundEnabled}
          isDark={isDark}
          isPanelOpen={isPanelOpen}
          panelWidth={panelWidth}
        />
        {/* Empty state: shown on the overview when nothing is selected */}
        {!selectedNodeId && !isSearchOpen && (
          <div
            data-testid="empty-state"
            className={`absolute z-20 bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 w-[min(22rem,calc(100vw-2rem))] px-4 py-3 border backdrop-blur-md text-center ${
              isDark
                ? 'bg-[#1a1a19]/85 text-[#f0f0ee] border-[rgba(240,240,238,0.15)]'
                : 'bg-[#eaeae8]/90 text-[#1a1a19] border-[rgba(26,26,25,0.15)]'
            }`}
          >
            <p className="text-[11px] leading-relaxed opacity-75">
              {visibleIds.size} of {meta.totalTerms} concepts shown.
              Pick a node to read about it, or:
            </p>
            {resumable && (
              <button
                onClick={() => handleResumePath(resumable.id)}
                className={`mt-2 w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 border text-[11px] transition ${
                  isDark
                    ? 'bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border-amber-400/40'
                    : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 border-amber-600/40'
                }`}
              >
                <Route className="w-3 h-3" />
                Resume {resumable.title} · step {stepIndexOf(resumable, progress.paths[resumable.id].current) + 1}/{resumable.steps.length}
              </button>
            )}
            <div className="mt-2 flex items-center justify-center gap-2 text-[11px]">
              <button
                onClick={() => { setIsSearchOpen(true); soundEffects.toggle(soundEnabled); }}
                className={`flex items-center gap-1.5 px-2.5 py-1 border transition ${
                  isDark
                    ? 'hover:bg-[#242422] border-[rgba(240,240,238,0.18)]'
                    : 'hover:bg-[#dcdcd9] border-[rgba(26,26,25,0.18)]'
                }`}
              >
                <Search className="w-3 h-3" /> Search
              </button>
              <button
                onClick={() => { setIsPathsOpen(true); soundEffects.toggle(soundEnabled); }}
                className={`flex items-center gap-1.5 px-2.5 py-1 border transition ${
                  isDark
                    ? 'hover:bg-[#242422] border-[rgba(240,240,238,0.18)]'
                    : 'hover:bg-[#dcdcd9] border-[rgba(26,26,25,0.18)]'
                }`}
              >
                <Route className="w-3 h-3" /> Paths
              </button>
              <button
                onClick={handleRandomTerm}
                className={`flex items-center gap-1.5 px-2.5 py-1 border transition ${
                  isDark
                    ? 'hover:bg-[#242422] border-[rgba(240,240,238,0.18)]'
                    : 'hover:bg-[#dcdcd9] border-[rgba(26,26,25,0.18)]'
                }`}
              >
                <Shuffle className="w-3 h-3" /> Random
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Slideover Detail Drawer */}
      {activeTerm && (
        <NodeDetailPanel
          term={activeTerm}
          categories={categories}
          allTermsMap={allTermsMap}
          onSelectTerm={handleSelectNode}
          onClose={handleClosePanel}
          onOpenCombinators={() => handleOpenCombinators()}
          paths={paths}
          progress={progress}
          activePath={activePath}
          activeStepIndex={activeStepIndex}
          onStartPath={handleStartPath}
          onResumePath={handleResumePath}
          onGoToStep={handleGoToStep}
          onPausePath={handlePausePath}
          onFinishPath={handleFinishPath}
          soundEnabled={soundEnabled}
          useCategoryColors={useCategoryColors}
          isDark={isDark}
          width={panelWidth}
          onResize={handlePanelResize}
          isResizing={isResizingPanel}
          onResizingChange={setIsResizingPanel}
        />
      )}

      {/* C# Function Combinator Reference */}
      <CombinatorsModal
        isOpen={isCombinatorsOpen}
        focusLetter={combinatorFocus}
        combinators={combinators}
        onClose={handleCloseCombinators}
        onSelectTerm={handleSelectNode}
        soundEnabled={soundEnabled}
        isDark={isDark}
      />

      {/* Learning path picker */}
      <PathsModal
        isOpen={isPathsOpen}
        paths={paths}
        progress={progress}
        allTermsMap={allTermsMap}
        onStartPath={handleStartPath}
        onResumePath={handleResumePath}
        onClose={() => setIsPathsOpen(false)}
        soundEnabled={soundEnabled}
        isDark={isDark}
      />

      {/* Command Palette Search Modal */}
      <SearchHUD
        isOpen={isSearchOpen}
        onOpen={() => setIsSearchOpen(true)}
        onClose={() => {
          setIsSearchOpen(false);
          setSearchQuery('');
        }}
        terms={terms}
        categories={categories}
        combinators={combinators?.entries || []}
        onSelectCombinator={(letter) => {
          setIsSearchOpen(false);
          setSearchQuery('');
          handleOpenCombinators(letter);
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectTerm={(termId) => {
          handleSelectNode(termId);
          setIsSearchOpen(false);
          setSearchQuery('');
        }}
        soundEnabled={soundEnabled}
        isDark={isDark}
      />
    </div>
  );
}
