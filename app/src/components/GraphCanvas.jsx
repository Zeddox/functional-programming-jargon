import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { soundEffects } from '../utils/audio';
import { clusterLayout, REFERENCE_EXTENT, CLUSTER_ORDER } from '../utils/clusterLayout';
import { VIEW_LEVELS, VIEW_LABELS } from '../utils/learning';

// Colour of the active learning path's route and step badges
const PATH_COLOR = '#f59e0b';


// Category emblems (math/FP symbols)
const CATEGORY_SYMBOLS = {
  'core-functions': 'λ',
  'composition': '∘',
  'purity-state': '≡',
  'category-morphisms': '→',
  'algebraic-structures': '★',
  'effects': '↯',
  'types-data': '∑',
  'lambda-calculus': 'β'
};

export default function GraphCanvas({
  graphData,
  categories,
  selectedNodeId,
  onSelectNode,
  searchQuery,
  useCategoryColors,
  soundEnabled,
  isDark,
  isPanelOpen,
  panelWidth = 560,
  onPointerMove,
  pathSteps = null,
  pathIndex = -1,
  pathSeen = null,
  view,
  viewCounts = {},
  topicCounts = {},
  onViewChange
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  // Topic (category) the camera frames instead of the whole graph; '' for all
  const [topic, setTopic] = useState('');

  // Simulation and camera state refs (mutable for 60fps render loop)
  const stateRef = useRef({
    nodes: [],
    links: [],
    nodeMap: new Map(),
    camera: { x: 0, y: 0, scale: 0.95, targetX: 0, targetY: 0, targetScale: 0.95 },
    panStart: { x: 0, y: 0, camX: 0, camY: 0 },
    isPanning: false,
    dragNode: null,
    animId: null,
    clusterCenters: {},
    clusterRings: {},
    clusterExtent: REFERENCE_EXTENT,
    // Keeps re-fitting the overview while the layout settles, until the user
    // moves the camera or selects something
    followOverview: false,
    overviewTarget: null
  });

  // Touch gesture state ref
  const touchRef = useRef({
    isPinching: false,
    startDist: 0,
    startScale: 1,
    startX: 0,
    startY: 0,
    hasMoved: false,
    lastTapTime: 0
  });

  // Camera target that fits every node (with room for its label) into the
  // space left between the header, the bottom controls and an open drawer.
  // With a topic picked, it fits that topic's ring (and its name pill) instead.
  const overviewTarget = () => {
    const winW = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const winH = typeof window !== 'undefined' ? window.innerHeight : 800;
    const isMobile = winW < 640;
    const PAD = 50;
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    const { topic: framed, clusterCenters, clusterRings } = stateRef.current;
    const center = framed && clusterCenters[framed];
    if (center) {
      const ring = clusterRings[framed] + 20;
      x0 = center.x - ring; x1 = center.x + ring;
      y0 = center.y - ring - 30; y1 = center.y + ring;
    } else {
      for (const n of stateRef.current.nodes) {
        x0 = Math.min(x0, n.x - PAD); x1 = Math.max(x1, n.x + PAD);
        y0 = Math.min(y0, n.y - PAD); y1 = Math.max(y1, n.y + PAD);
      }
    }
    if (!Number.isFinite(x0)) return { x: 0, y: 0, scale: 0.5 };

    // Work in the canvas's own box (the camera centres on it), keeping clear
    // of the floating header above and the controls below
    const rect = containerRef.current?.getBoundingClientRect() ?? { top: 0, width: winW, height: winH };
    // With nothing selected the footer also holds the empty-state card
    const HEADER = 96, FOOTER = selectedNodeId ? 56 : isMobile ? 200 : 140;
    const drawerW = isPanelOpen && !isMobile ? panelWidth : 0;
    const sheetH = isPanelOpen && isMobile ? winH * 0.46 : 0;
    const top = Math.max(0, HEADER - rect.top);
    const visW = rect.width - drawerW;
    const visH = rect.height - top - Math.max(FOOTER, sheetH);
    const scale = Math.min(visW / (x1 - x0), visH / (y1 - y0)) * 0.96;

    // World point that should sit in the middle of the visible area
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    const shiftX = (rect.width / 2 - visW / 2) / scale;
    const shiftY = (rect.height / 2 - (top + visH / 2)) / scale;
    return { x: -cx - shiftX, y: -cy - shiftY, scale };
  };
  stateRef.current.overviewTarget = overviewTarget;
  stateRef.current.topic = topic;
  // The render loop reads the active path from here, so it never sees stale props
  stateRef.current.path = pathSteps
    ? { steps: pathSteps, index: pathIndex, seen: new Set(pathSeen || []), ids: new Set(pathSteps) }
    : null;

  const showOverview = (snap = false) => {
    const { camera } = stateRef.current;
    const view = overviewTarget();
    camera.targetX = view.x;
    camera.targetY = view.y;
    camera.targetScale = view.scale;
    if (snap) {
      camera.x = view.x;
      camera.y = view.y;
      camera.scale = view.scale;
    }
    stateRef.current.followOverview = true;
  };

  // Initialize nodes and clusters
  useEffect(() => {
    if (!graphData || !graphData.nodes) return;

    const { centers: clusterCenters, rings: clusterRings, extent } =
      clusterLayout(graphData.nodes, Object.keys(categories || {}));
    stateRef.current.clusterCenters = clusterCenters;
    stateRef.current.clusterRings = clusterRings;
    stateRef.current.clusterExtent = extent;

    // Build node map and initial positions. Nodes already on screen (when
    // the view changes) keep where they are and drift to their new cluster.
    const previous = stateRef.current.nodeMap;
    const isFirstLayout = previous.size === 0;
    const nodeMap = new Map();
    const nodes = graphData.nodes.map((n, idx) => {
      const old = previous.get(n.id);
      if (old) {
        const node = { ...old, ...n };
        nodeMap.set(node.id, node);
        return node;
      }
      const cluster = clusterCenters[n.category] || { x: 0, y: 0 };
      const spreadAngle = (idx / graphData.nodes.length) * Math.PI * 2;
      const spreadDist = (50 + Math.random() * 140) * ((clusterRings[n.category] || 308) / 220);
      
      const node = {
        ...n,
        x: cluster.x + Math.cos(spreadAngle) * spreadDist + (Math.random() - 0.5) * 40,
        y: cluster.y + Math.sin(spreadAngle) * spreadDist + (Math.random() - 0.5) * 40,
        vx: 0,
        vy: 0,
        radius: Math.max(18, Math.min(36, 16 + (n.val || 3) * 2.2)),
        mass: Math.max(1, (n.val || 2) * 0.85)
      };
      nodeMap.set(node.id, node);
      return node;
    });

    // Build links with node references
    const links = graphData.links.map(l => ({
      source: typeof l.source === 'object' ? l.source : nodeMap.get(l.source) || l.source,
      target: typeof l.target === 'object' ? l.target : nodeMap.get(l.target) || l.target,
      type: l.type
    })).filter(l => l.source && l.target && l.source.id && l.target.id);

    stateRef.current.nodes = nodes;
    stateRef.current.links = links;
    stateRef.current.nodeMap = nodeMap;

    // Start on the selected node from the URL, or on the overview; after a
    // view change, re-fit the overview if nothing is selected
    if (!isFirstLayout) {
      if (!selectedNodeId) showOverview();
      return;
    }
    const { camera } = stateRef.current;
    const selNode = selectedNodeId && nodeMap.get(selectedNodeId);
    if (selNode) {
      camera.x = camera.targetX = -selNode.x;
      camera.y = camera.targetY = -selNode.y;
      camera.scale = camera.targetScale = 0.95;
    } else {
      showOverview(true);
    }
  }, [graphData]);

  // Center on selected node when selection changes or panel opens/closes
  // Calculates optimal zoom scale so the selected node AND all its connected neighbor nodes fit comfortably in the visible viewport
  // Clearing the selection pulls back to the overview
  useEffect(() => {
    if (!selectedNodeId) {
      showOverview();
      return;
    }
    stateRef.current.followOverview = false;
    const node = stateRef.current.nodeMap?.get(selectedNodeId);
    if (node) {
      const links = stateRef.current.links || [];
      const neighborNodes = [];
      links.forEach(l => {
        if (l.source.id === node.id && l.target) neighborNodes.push(l.target);
        if (l.target.id === node.id && l.source) neighborNodes.push(l.source);
      });

      let maxDist = 0;
      neighborNodes.forEach(n => {
        const d = Math.hypot(n.x - node.x, n.y - node.y);
        if (d > maxDist) maxDist = d;
      });

      const winW = typeof window !== 'undefined' ? window.innerWidth : 1280;
      const winH = typeof window !== 'undefined' ? window.innerHeight : 800;
      const isMobile = winW < 640;
      const sidebarWidth = (isPanelOpen && !isMobile) ? panelWidth : 0;
      const sheetHeight = (isPanelOpen && isMobile) ? winH * 0.46 : 0;
      const visibleWidth = winW - sidebarWidth;
      const visibleHeight = winH - sheetHeight;

      // Ensure all neighbors fit with breathing room for node badges and labels
      const safeRadius = Math.max(160, maxDist + 80);
      const idealScaleX = (visibleWidth * 0.82) / (safeRadius * 2);
      const idealScaleY = (visibleHeight * 0.82) / (safeRadius * 2);
      const idealScale = Math.min(idealScaleX, idealScaleY);

      // Clamp scale
      const minScale = isMobile ? 0.55 : 0.65;
      const maxScale = isMobile ? 0.88 : 0.95;
      const targetScale = Math.max(minScale, Math.min(maxScale, idealScale));

      let offsetX = 0;
      if (sidebarWidth > 0) {
        offsetX = (sidebarWidth / 2) / targetScale;
      }

      let offsetY = 0;
      if (sheetHeight > 0) {
        offsetY = (sheetHeight / 2) / targetScale;
      }

      stateRef.current.camera.targetX = -node.x - offsetX;
      stateRef.current.camera.targetY = -node.y - offsetY;
      stateRef.current.camera.targetScale = targetScale;
    }
  }, [selectedNodeId, isPanelOpen, panelWidth]);

  // Simulation & rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let running = true;

    function resize() {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = parent.clientWidth * dpr;
      canvas.height = parent.clientHeight * dpr;
      canvas.style.width = `${parent.clientWidth}px`;
      canvas.style.height = `${parent.clientHeight}px`;
    }
    resize();
    window.addEventListener('resize', resize);

    let pulseTime = 0;

    function loop() {
      if (!running) return;
      pulseTime += 0.025;

      const { nodes, links, nodeMap, camera, clusterCenters, clusterRings, dragNode } = stateRef.current;
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      // Smooth camera interpolation
      camera.x += (camera.targetX - camera.x) * 0.08;
      camera.y += (camera.targetY - camera.y) * 0.08;
      camera.scale += (camera.targetScale - camera.scale) * 0.08;
      if (stateRef.current.followOverview && Math.round(pulseTime / 0.025) % 15 === 0) {
        const view = stateRef.current.overviewTarget();
        camera.targetX = view.x;
        camera.targetY = view.y;
        camera.targetScale = view.scale;
      }

      // Force-directed physics calculation
      const kRepel = 4000;
      const kSpring = 0.0035;
      const springLength = 130;
      const kCenter = 0.0005;
      // Nodes move freely in the inner part of their ring (so they have room to
      // spread out) and are pulled back only as they near its edge. Links that
      // cross categories pull at 15% strength so they don't drag nodes out.
      const kCluster = 0.05;
      const clusterFreeShare = 0.6;
      const kCrossSpring = kSpring * 0.15;

      // 1. Repulsion between nodes
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          let dx = b.x - a.x;
          let dy = b.y - a.y;
          let distSq = dx * dx + dy * dy;
          if (distSq < 1) distSq = 1;
          const dist = Math.sqrt(distSq);
          if (dist < 460) {
            const force = (kRepel * (a.radius + b.radius)) / distSq;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            if (a !== dragNode) { a.vx -= fx / a.mass; a.vy -= fy / a.mass; }
            if (b !== dragNode) { b.vx += fx / b.mass; b.vy += fy / b.mass; }
          }
        }
      }

      // 2. Link springs
      for (let i = 0; i < links.length; i++) {
        const { source, target } = links[i];
        if (!source || !target) continue;
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const displacement = dist - springLength;
        const force = displacement * (source.category === target.category ? kSpring : kCrossSpring);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        if (source !== dragNode) { source.vx += fx; source.vy += fy; }
        if (target !== dragNode) { target.vx -= fx; target.vy -= fy; }
      }

      // 3. Cluster pull and global centering
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (n === dragNode) continue;

        // Cluster center gravity
        const center = clusterCenters[n.category] || { x: 0, y: 0 };
        const cdx = center.x - n.x;
        const cdy = center.y - n.y;
        const cdist = Math.sqrt(cdx * cdx + cdy * cdy) || 1;
        const slack = Math.max(0, cdist - (clusterRings[n.category] || 308) * clusterFreeShare);
        n.vx += (cdx / cdist) * slack * kCluster;
        n.vy += (cdy / cdist) * slack * kCluster;

        // Gentle central gravity
        n.vx -= n.x * kCenter;
        n.vy -= n.y * kCenter;

        // Velocity damping
        n.vx *= 0.88;
        n.vy *= 0.88;

        n.x += n.vx;
        n.y += n.vy;
      }

      // Clear Canvas (transparent so vgpu background shows through!)
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Camera transformation
      ctx.translate(width / 2, height / 2);
      ctx.scale(camera.scale, camera.scale);
      ctx.translate(camera.x, camera.y);

      // Identify active/highlighted set
      const activeId = hoveredNodeId || selectedNodeId;
      let connectedIds = new Set();
      if (activeId) {
        connectedIds.add(activeId);
        links.forEach(l => {
          if (l.source.id === activeId) connectedIds.add(l.target.id);
          if (l.target.id === activeId) connectedIds.add(l.source.id);
        });
      }

      // Search match set
      let searchMatchedIds = null;
      if (searchQuery && searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        searchMatchedIds = new Set();
        nodes.forEach(n => {
          if (
            n.name.toLowerCase().includes(q) ||
            n.id.includes(q) ||
            (n.summary && n.summary.toLowerCase().includes(q))
          ) {
            searchMatchedIds.add(n.id);
          }
        });
      }

      // Render Cluster Backdrop Glows and Constellation Rings
      Object.keys(clusterCenters).forEach(catId => {
        const cat = categories[catId];
        const center = clusterCenters[catId];
        if (!cat || !center) return;
        const ring = clusterRings[catId];
        const color = useCategoryColors ? cat.color : (isDark ? '#38bdf8' : '#0284c7');
        
        // Radial ambient glow
        const grad = ctx.createRadialGradient(center.x, center.y, 20, center.x, center.y, ring + 40);
        grad.addColorStop(0, isDark ? `${color}20` : `${color}15`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(center.x, center.y, ring + 40, 0, Math.PI * 2);
        ctx.fill();

        // Constellation boundary dashed ring
        ctx.save();
        ctx.setLineDash([4, 6]);
        ctx.strokeStyle = isDark ? `${color}30` : `${color}40`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(center.x, center.y, ring, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // Cluster Header Pill
        ctx.save();
        ctx.font = '600 11px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        const label = cat.name.toUpperCase();
        const metrics = ctx.measureText(label);
        const pillW = metrics.width + 16;
        const pillH = 22;
        const pillY = center.y - ring - 10;

        ctx.fillStyle = isDark ? 'rgba(26, 26, 25, 0.9)' : 'rgba(226, 226, 223, 0.92)';
        ctx.strokeStyle = isDark ? 'rgba(240, 240, 238, 0.15)' : 'rgba(26, 26, 25, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(center.x - pillW / 2, pillY - pillH / 2, pillW, pillH, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isDark ? '#f0f0ee' : '#1a1a19';
        ctx.fillText(label, center.x, pillY + 4);
        ctx.restore();
      });

      // Helper to draw curved link with arrow
      const drawCurvedLink = (l, isHighlight, isDimmed, isSearchDimmed) => {
        const sx = l.source.x;
        const sy = l.source.y;
        const tx = l.target.x;
        const ty = l.target.y;

        const dx = tx - sx;
        const dy = ty - sy;
        const dist = Math.hypot(dx, dy) || 1;

        // Slight curve offset
        const midX = (sx + tx) / 2 + (-dy / dist) * 16;
        const midY = (sy + ty) / 2 + (dx / dist) * 16;

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.quadraticCurveTo(midX, midY, tx, ty);

        if (isHighlight) {
          const cat = categories[l.source.category];
          const strokeColor = useCategoryColors && cat ? cat.color : (isDark ? '#93c5fd' : '#2563eb');
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 2.8;
          ctx.stroke();

          // Flowing energy particle
          const t = (pulseTime * 1.6) % 1;
          const px = (1 - t) * (1 - t) * sx + 2 * (1 - t) * t * midX + t * t * tx;
          const py = (1 - t) * (1 - t) * sy + 2 * (1 - t) * t * midY + t * t * ty;
          ctx.beginPath();
          ctx.arc(px, py, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = strokeColor;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Arrowhead pointing to target
          const angle = Math.atan2(ty - midY, tx - midX);
          const arrowDist = l.target.radius + 6;
          const ax = tx - Math.cos(angle) * arrowDist;
          const ay = ty - Math.sin(angle) * arrowDist;
          ctx.save();
          ctx.translate(ax, ay);
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(-7, -4);
          ctx.lineTo(-7, 4);
          ctx.closePath();
          ctx.fillStyle = strokeColor;
          ctx.fill();
          ctx.restore();
        } else {
          let alpha = isDark ? 0.22 : 0.28;
          if (isDimmed || isSearchDimmed) alpha = 0.04;
          ctx.strokeStyle = isDark ? `rgba(255, 255, 255, ${alpha})` : `rgba(15, 23, 42, ${alpha})`;
          ctx.lineWidth = l.type === 'reference' ? 1.0 : 1.4;
          if (l.type === 'reference') {
            ctx.setLineDash([3, 4]);
          } else {
            ctx.setLineDash([]);
          }
          ctx.stroke();
          ctx.setLineDash([]);
        }
      };

      // On a learning path, everything off the path recedes
      const path = stateRef.current.path;
      const offPath = (id) => path && !path.ids.has(id);

      // Render Links
      links.forEach(l => {
        const isHighlight = activeId && (l.source.id === activeId || l.target.id === activeId);
        const isDimmed = (activeId && !isHighlight) || (path && !isHighlight);
        const isSearchDimmed = searchMatchedIds && (!searchMatchedIds.has(l.source.id) || !searchMatchedIds.has(l.target.id));
        drawCurvedLink(l, isHighlight, isDimmed, isSearchDimmed);
      });

      // The path's route: walked legs solid, the rest dashed, in step order
      if (path) {
        ctx.save();
        ctx.lineCap = 'round';
        for (let i = 0; i < path.steps.length - 1; i++) {
          const a = nodeMap.get(path.steps[i]);
          const b = nodeMap.get(path.steps[i + 1]);
          if (!a || !b) continue;
          const walked = i < path.index;
          ctx.setLineDash(walked ? [] : [6, 7]);
          ctx.strokeStyle = walked ? PATH_COLOR : `${PATH_COLOR}80`;
          ctx.lineWidth = walked ? 3.2 : 2;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Render Nodes
      nodes.forEach(n => {
        const isSelected = n.id === selectedNodeId;
        const isHovered = n.id === hoveredNodeId;
        const isConnected = connectedIds.has(n.id);
        // On a path, path nodes stay lit and the rest dim unless they're linked
        // to the node being looked at
        const isDimmed = path
          ? offPath(n.id) && !isConnected
          : activeId && !isConnected;
        const isSearchMatched = !searchMatchedIds || searchMatchedIds.has(n.id);

        const cat = categories[n.category] || {};
        const baseColor = useCategoryColors ? (cat.color || '#3b82f6') : (isDark ? '#93c5fd' : '#2563eb');
        const symbol = CATEGORY_SYMBOLS[n.category] || 'λ';

        ctx.save();
        
        let opacity = 1;
        if (isDimmed || !isSearchMatched) opacity = 0.16;
        ctx.globalAlpha = opacity;

        // Selected halo pulse & beacon animation (invitation to click)
        if (isSelected) {
          const haloPulse = 6 + Math.sin(pulseTime * 3) * 4;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius + haloPulse + 4, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? `${baseColor}35` : `${baseColor}20`;
          ctx.fill();

          // Expanding beacon ripple
          const ripplePhase = (pulseTime * 0.75) % 1;
          const rippleR = n.radius + 6 + ripplePhase * 24;
          const rippleAlpha = (1 - ripplePhase) * 0.65;
          ctx.beginPath();
          ctx.arc(n.x, n.y, rippleR, 0, Math.PI * 2);
          ctx.strokeStyle = isDark ? `rgba(240, 240, 238, ${rippleAlpha})` : `rgba(26, 26, 25, ${rippleAlpha})`;
          ctx.lineWidth = 1.4;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius + 4, 0, Math.PI * 2);
          ctx.strokeStyle = baseColor;
          ctx.lineWidth = 2.4;
          ctx.stroke();
        } else if (isHovered) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius + 6, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.08)';
          ctx.fill();
        }

        // Search match highlight ring
        if (searchMatchedIds && searchMatchedIds.has(n.id) && !isSelected) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius + 4, 0, Math.PI * 2);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }

        // Node Body
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        
        if (useCategoryColors) {
          ctx.fillStyle = isDark ? '#111827' : '#ffffff';
          ctx.fill();
          ctx.strokeStyle = baseColor;
          ctx.lineWidth = isSelected || isHovered ? 3.5 : 2.2;
          ctx.stroke();

          // Symbol in center
          ctx.fillStyle = baseColor;
          ctx.font = `700 ${Math.max(11, n.radius * 0.55)}px "JetBrains Mono", monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(symbol, n.x, n.y);
        } else {
          // Minimalist / Blueprint theme
          ctx.fillStyle = isDark ? (isSelected ? '#f8fafc' : '#1e293b') : (isSelected ? '#0f172a' : '#ffffff');
          ctx.fill();
          ctx.strokeStyle = isDark ? (isSelected ? '#93c5fd' : '#64748b') : (isSelected ? '#2563eb' : '#94a3b8');
          ctx.lineWidth = isSelected ? 3 : 1.8;
          ctx.stroke();

          // Center symbol
          ctx.fillStyle = isDark ? (isSelected ? '#0f172a' : '#cbd5e1') : (isSelected ? '#ffffff' : '#334155');
          ctx.font = `700 ${Math.max(11, n.radius * 0.55)}px "JetBrains Mono", monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(symbol, n.x, n.y);
        }

        // Label below node
        ctx.save();
        ctx.font = `${isSelected || isHovered ? '600' : '500'} ${Math.max(10.5, Math.min(12.5, 9.5 + n.radius * 0.1))}px "JetBrains Mono", monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        const labelY = n.y + n.radius + 6;
        const text = n.name;
        
        // High contrast backing pill for flawless text legibility
        const metrics = ctx.measureText(text);
        const padX = 6;
        const padY = 2;

        ctx.fillStyle = isDark
          ? (isSelected ? '#f0f0ee' : 'rgba(26, 26, 25, 0.92)')
          : (isSelected ? '#1a1a19' : 'rgba(234, 234, 232, 0.94)');
        ctx.strokeStyle = isDark ? 'rgba(240, 240, 238, 0.15)' : 'rgba(26, 26, 25, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(
          n.x - metrics.width / 2 - padX,
          labelY - padY,
          metrics.width + padX * 2,
          16 + padY * 2,
          3
        );
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isDark
          ? (isSelected ? '#121212' : '#f0f0ee')
          : (isSelected ? '#eaeae8' : (isHovered ? '#000000' : '#1a1a19'));
        ctx.fillText(text, n.x, labelY + 1);
        ctx.restore();

        // Step number badge on the active path's nodes
        const step = path ? path.steps.indexOf(n.id) : -1;
        if (step >= 0) {
          const bx = n.x + n.radius * 0.78;
          const by = n.y - n.radius * 0.78;
          const isCurrent = step === path.index;
          const isSeen = path.seen.has(n.id);
          ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.arc(bx, by, isCurrent ? 11 : 9.5, 0, Math.PI * 2);
          ctx.fillStyle = isCurrent || isSeen ? PATH_COLOR : (isDark ? '#1a1a19' : '#ffffff');
          ctx.fill();
          ctx.strokeStyle = PATH_COLOR;
          ctx.lineWidth = 1.6;
          ctx.stroke();
          ctx.fillStyle = isCurrent || isSeen ? '#1a1a19' : PATH_COLOR;
          ctx.font = `700 ${isCurrent ? 11 : 10}px "JetBrains Mono", monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(String(step + 1), bx, by + 0.5);
        }

        ctx.restore();
      });

      ctx.restore();
      stateRef.current.animId = requestAnimationFrame(loop);
    }

    stateRef.current.animId = requestAnimationFrame(loop);

    return () => {
      running = false;
      window.removeEventListener('resize', resize);
      if (stateRef.current.animId) {
        cancelAnimationFrame(stateRef.current.animId);
      }
    };
  }, [categories, selectedNodeId, hoveredNodeId, searchQuery, useCategoryColors, isDark]);

  // Convert client mouse coordinate to world coordinates
  const clientToWorld = useCallback((clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const xScreen = clientX - rect.left - rect.width / 2;
    const yScreen = clientY - rect.top - rect.height / 2;
    const { camera } = stateRef.current;
    return {
      x: xScreen / camera.scale - camera.x,
      y: yScreen / camera.scale - camera.y
    };
  }, []);

  // Find node under world coordinates
  const getNodeAt = useCallback((worldX, worldY) => {
    const { nodes } = stateRef.current;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      const dist = Math.hypot(n.x - worldX, n.y - worldY);
      if (dist <= n.radius + 8) {
        return n;
      }
    }
    return null;
  }, []);

  // Mouse / Touch Interaction Handlers
  const handleMouseDown = (e) => {
    // Clicks on the floating controls aren't canvas clicks
    if (e.button !== 0 || e.target !== canvasRef.current) return;
    const pos = clientToWorld(e.clientX, e.clientY);
    const hitNode = getNodeAt(pos.x, pos.y);

    if (hitNode) {
      stateRef.current.dragNode = hitNode;
      hitNode.vx = 0;
      hitNode.vy = 0;
    } else {
      stateRef.current.isPanning = true;
      stateRef.current.panStart = {
        x: e.clientX,
        y: e.clientY,
        camX: stateRef.current.camera.x,
        camY: stateRef.current.camera.y
      };
    }
  };

  const handleMouseMove = (e) => {
    const { isPanning, panStart, dragNode, camera } = stateRef.current;
    const pos = clientToWorld(e.clientX, e.clientY);

    // Notify parent of normalized pointer position for WebGPU shader
    const canvas = canvasRef.current;
    if (canvas && onPointerMove) {
      const rect = canvas.getBoundingClientRect();
      const normX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const normY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      onPointerMove({ x: normX, y: normY });
    }

    if (dragNode) {
      dragNode.x = pos.x;
      dragNode.y = pos.y;
      dragNode.vx = 0;
      dragNode.vy = 0;
      return;
    }

    if (isPanning) {
      const dx = (e.clientX - panStart.x) / camera.scale;
      const dy = (e.clientY - panStart.y) / camera.scale;
      camera.x = panStart.camX + dx;
      camera.y = panStart.camY + dy;
      if (Math.abs(dx) + Math.abs(dy) > 2) stateRef.current.followOverview = false;
      camera.targetX = camera.x;
      camera.targetY = camera.y;
      return;
    }

    // Check hover
    const hitNode = getNodeAt(pos.x, pos.y);
    if (hitNode) {
      if (hoveredNodeId !== hitNode.id) {
        setHoveredNodeId(hitNode.id);
        soundEffects.hover(soundEnabled);
      }
      const rect = canvas.getBoundingClientRect();
      setTooltip({
        node: hitNode,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    } else {
      if (hoveredNodeId !== null) {
        setHoveredNodeId(null);
        setTooltip(null);
      }
    }
  };

  const handleMouseUp = (e) => {
    const { dragNode, isPanning, panStart } = stateRef.current;
    
    if (isPanning && selectedNodeId &&
        Math.hypot(e.clientX - panStart.x, e.clientY - panStart.y) < 4) {
      onSelectNode(null);
    } else if (dragNode) {
      onSelectNode(dragNode.id);
      soundEffects.select(soundEnabled);
      stateRef.current.dragNode = null;
    } else if (!isPanning) {
      const pos = clientToWorld(e.clientX, e.clientY);
      const hit = getNodeAt(pos.x, pos.y);
      if (hit) {
        onSelectNode(hit.id);
        soundEffects.select(soundEnabled);
      }
    }

    stateRef.current.isPanning = false;
  };

  // Touch Handlers for Mobile
  const handleTouchStart = (e) => {
    if (e.target !== canvasRef.current) return;
    if (e.touches.length === 1) {
      const t = e.touches[0];
      const pos = clientToWorld(t.clientX, t.clientY);
      const hitNode = getNodeAt(pos.x, pos.y);

      // Double-tap check (< 300ms) to reset view
      const now = Date.now();
      if (now - touchRef.current.lastTapTime < 300) {
        handleResetCamera();
        touchRef.current.lastTapTime = 0;
        return;
      }
      touchRef.current.lastTapTime = now;

      touchRef.current.startX = t.clientX;
      touchRef.current.startY = t.clientY;
      touchRef.current.hasMoved = false;

      if (hitNode) {
        stateRef.current.dragNode = hitNode;
        hitNode.vx = 0;
        hitNode.vy = 0;
      } else {
        stateRef.current.isPanning = true;
        stateRef.current.panStart = {
          x: t.clientX,
          y: t.clientY,
          camX: stateRef.current.camera.x,
          camY: stateRef.current.camera.y
        };
      }
    } else if (e.touches.length === 2) {
      // 2-finger pinch gesture
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      touchRef.current.isPinching = true;
      touchRef.current.startDist = dist;
      touchRef.current.startScale = stateRef.current.camera.scale;
      stateRef.current.dragNode = null;
      stateRef.current.isPanning = false;
    }
  };

  const handleTouchMove = (e) => {
    if (touchRef.current.isPinching && e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      if (touchRef.current.startDist > 0) {
        const factor = dist / touchRef.current.startDist;
        const newScale = Math.max(0.15, Math.min(3.5, touchRef.current.startScale * factor));
        stateRef.current.camera.scale = newScale;
        stateRef.current.camera.targetScale = newScale;
        stateRef.current.followOverview = false;
      }
      return;
    }

    if (e.touches.length === 1) {
      const t = e.touches[0];
      const moveDist = Math.hypot(t.clientX - touchRef.current.startX, t.clientY - touchRef.current.startY);
      if (moveDist > 6) {
        touchRef.current.hasMoved = true;
      }

      if (stateRef.current.dragNode) {
        const pos = clientToWorld(t.clientX, t.clientY);
        stateRef.current.dragNode.x = pos.x;
        stateRef.current.dragNode.y = pos.y;
        stateRef.current.dragNode.vx = 0;
        stateRef.current.dragNode.vy = 0;
        return;
      }

      if (stateRef.current.isPanning) {
        const dx = (t.clientX - stateRef.current.panStart.x) / stateRef.current.camera.scale;
        const dy = (t.clientY - stateRef.current.panStart.y) / stateRef.current.camera.scale;
        stateRef.current.camera.x = stateRef.current.panStart.camX + dx;
        stateRef.current.camera.y = stateRef.current.panStart.camY + dy;
        stateRef.current.camera.targetX = stateRef.current.camera.x;
        stateRef.current.camera.targetY = stateRef.current.camera.y;
        stateRef.current.followOverview = false;
      }
    }
  };

  const handleTouchEnd = (e) => {
    if (e.target !== canvasRef.current) return;
    if (touchRef.current.isPinching) {
      if (e.touches.length < 2) {
        touchRef.current.isPinching = false;
      }
      return;
    }

    if (!touchRef.current.hasMoved) {
      // Tap on node
      const pos = clientToWorld(touchRef.current.startX, touchRef.current.startY);
      const hit = getNodeAt(pos.x, pos.y);
      if (hit) {
        onSelectNode(hit.id);
        soundEffects.select(soundEnabled);
      } else if (selectedNodeId) {
        onSelectNode(null);
      }
    }

    stateRef.current.dragNode = null;
    stateRef.current.isPanning = false;
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88;
    const { camera } = stateRef.current;
    const newScale = Math.max(0.15, Math.min(3.5, camera.targetScale * zoomFactor));
    camera.targetScale = newScale;
    stateRef.current.followOverview = false;
  };

  const handleResetCamera = () => {
    stateRef.current.topic = '';
    setTopic('');
    showOverview();
    soundEffects.toggle(soundEnabled);
  };

  // Topics in ring order, each with how many of its terms the current view shows
  const shownByTopic = useMemo(() => {
    const counts = {};
    for (const n of graphData?.nodes ?? []) counts[n.category] = (counts[n.category] || 0) + 1;
    return counts;
  }, [graphData]);
  const topicIds = useMemo(() => [
    ...CLUSTER_ORDER.filter(id => categories?.[id]),
    ...Object.keys(categories || {}).filter(id => !CLUSTER_ORDER.includes(id))
  ], [categories]);
  // The first broader view that has some of this topic's terms
  const viewWithTopic = (id) => VIEW_LEVELS.slice(VIEW_LEVELS.indexOf(view) + 1).find(level => topicCounts[id]?.[level] > 0);

  // Picking a topic frames its ring; a topic the view hides widens the view first
  const handlePickTopic = (id) => {
    if (id && !shownByTopic[id]) {
      const wider = viewWithTopic(id);
      if (wider) onViewChange?.(wider);
    }
    stateRef.current.topic = id;
    setTopic(id);
    showOverview();
    soundEffects.toggle(soundEnabled);
  };

  // A view that no longer shows the framed topic drops it
  useEffect(() => {
    if (topic && graphData && !shownByTopic[topic]) setTopic('');
  }, [shownByTopic]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none cursor-grab active:cursor-grabbing touch-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <canvas ref={canvasRef} className="block w-full h-full relative z-10" />

      {/* Floating Hover Tooltip */}
      {tooltip && (
        <div
          className={`absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 px-3 py-2 shadow-2xl backdrop-blur-md border max-w-xs transition-opacity duration-150 font-mono ${
            isDark
              ? 'bg-[#1a1a19]/95 text-[#f0f0ee] border-[rgba(240,240,238,0.2)]'
              : 'bg-[#eaeae8]/95 text-[#1a1a19] border-[rgba(26,26,25,0.2)]'
          }`}
          style={{ left: `${tooltip.x}px`, top: `${tooltip.y - 12}px` }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-2 h-2"
              style={{ backgroundColor: categories[tooltip.node.category]?.color || '#3b82f6' }}
            />
            <span className={`text-[10px] tracking-wider uppercase opacity-75`}>
              {categories[tooltip.node.category]?.name}
            </span>
          </div>
          <div className="font-semibold text-xs tracking-tight mb-1">
            {tooltip.node.name}
          </div>
          <p className="text-[11px] line-clamp-2 leading-relaxed opacity-80">
            {tooltip.node.summary}
          </p>
        </div>
      )}

      {/* Frame one topic (a dashed ring): top left, clear of the bottom controls */}
      {topicIds.length > 0 && (
        <div className="absolute top-16 left-4 sm:left-6 z-20 font-mono">
          <select
            aria-label="Topic"
            data-testid="topic-picker"
            value={topic}
            onChange={e => handlePickTopic(e.target.value)}
            className={`max-w-[15rem] truncate px-1.5 py-1 text-[11px] border backdrop-blur-md cursor-pointer ${
              isDark
                ? 'bg-[#1a1a19]/90 text-[#f0f0ee] border-[rgba(240,240,238,0.18)]'
                : 'bg-[#eaeae8]/90 text-[#1a1a19] border-[rgba(26,26,25,0.18)]'
            }`}
          >
            <option value="">All topics</option>
            {topicIds.map(id => {
              const shown = shownByTopic[id] || 0;
              const wider = shown ? null : viewWithTopic(id);
              return (
                <option key={id} value={id}>
                  {categories[id].name} · {shown ? shown : wider ? `in ${VIEW_LABELS[wider]}` : 0}
                </option>
              );
            })}
          </select>
        </div>
      )}

      {/* Canvas Floating Controls (Adapts dynamically to mobile bottom sheet) */}
      <div className={`absolute ${
        isPanelOpen ? 'bottom-[calc(46vh+14px)] sm:bottom-6' : 'bottom-6'
      } left-4 sm:left-6 flex items-center gap-2 z-20 font-mono transition-all duration-300`}>
        <button
          onClick={handleResetCamera}
          className={`px-2.5 py-1 text-xs border backdrop-blur-md transition flex items-center gap-1.5 ${
            isDark
              ? 'bg-[#1a1a19]/90 hover:bg-[#242422] text-[#f0f0ee] border-[rgba(240,240,238,0.18)]'
              : 'bg-[#eaeae8]/90 hover:bg-[#dcdcd9] text-[#1a1a19] border-[rgba(26,26,25,0.18)]'
          }`}
          title="Reset canvas view"
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          <span>[ Reset ]</span>
        </button>
        {/* How much of the jargon to show */}
        {onViewChange && (
          <div
            role="radiogroup"
            aria-label="Graph view"
            className={`flex border backdrop-blur-md text-[11px] ${
              isDark ? 'bg-[#1a1a19]/90 border-[rgba(240,240,238,0.18)]' : 'bg-[#eaeae8]/90 border-[rgba(26,26,25,0.18)]'
            }`}
          >
            {VIEW_LEVELS.map(level => {
              const isActive = level === view;
              return (
                <button
                  key={level}
                  role="radio"
                  aria-checked={isActive}
                  onClick={() => !isActive && onViewChange(level)}
                  title={`${VIEW_LABELS[level]}: ${viewCounts[level] ?? ''} concepts`}
                  className={`px-2 py-1 transition ${
                    isActive
                      ? (isDark ? 'bg-[#f0f0ee] text-[#121212]' : 'bg-[#1a1a19] text-[#eaeae8]')
                      : (isDark ? 'text-[#f0f0ee]/70 hover:bg-[#242422]' : 'text-[#1a1a19]/70 hover:bg-[#dcdcd9]')
                  }`}
                >
                  {VIEW_LABELS[level]}
                  <span className="hidden md:inline opacity-60"> {viewCounts[level]}</span>
                </button>
              );
            })}
          </div>
        )}
        <div className={`hidden 2xl:block text-[11px] px-2.5 py-1 border backdrop-blur-md ${
          isDark
            ? 'text-[#f0f0ee]/60 bg-[#1a1a19]/70 border-[rgba(240,240,238,0.12)]'
            : 'text-[#1a1a19]/60 bg-[#eaeae8]/80 border-[rgba(26,26,25,0.12)]'
        }`}>
          drag: pan · scroll: zoom
        </div>
      </div>
    </div>
  );
}
