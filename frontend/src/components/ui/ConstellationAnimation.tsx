import React, { useRef, useEffect, useState } from 'react';

// --- data structures ---
interface Node {
  id: number;
  x: number;
  y: number;
  opacity: number; // for fade-in effect
}
interface Edge {
  from: number;
  to: number;
  progress: number; // for line-drawing animation
}
interface Constellation {
  nodes: Node[];
  edges: Edge[];
}

// function to create the initial state for a constellation
const createInitialConstellation = (data: { nodes: Omit<Node, 'opacity'>[], edges: Omit<Edge, 'progress'>[] }): Constellation => ({
  nodes: data.nodes.map(n => ({ ...n, opacity: 0 })),
  edges: data.edges.map(e => ({ ...e, progress: 0 })),
});

const constellationData = [
  {
    nodes: [
      { id: 1, x: 0.5, y: 0.15 }, { id: 2, x: 0.3, y: 0.35 },
      { id: 3, x: 0.7, y: 0.35 }, { id: 4, x: 0.2, y: 0.55 },
      { id: 5, x: 0.4, y: 0.55 }, { id: 6, x: 0.6, y: 0.55 },
      { id: 7, x: 0.8, y: 0.55 }, { id: 8, x: 0.35, y: 0.75 },
      { id: 9, x: 0.85, y: 0.75 },
    ],
    edges: [
      { from: 1, to: 2 }, { from: 1, to: 3 }, { from: 2, to: 4 },
      { from: 2, to: 5 }, { from: 3, to: 6 }, { from: 3, to: 7 },
      { from: 5, to: 8 }, { from: 7, to: 9 },
    ],
  },
  {
    nodes: [
        { id: 10, x: 0.5, y: 0.1 }, { id: 11, x: 0.85, y: 0.4 },
        { id: 12, x: 0.65, y: 0.8 }, { id: 13, x: 0.35, y: 0.8 },
        { id: 14, x: 0.15, y: 0.4 },
    ],
    edges: [
        { from: 10, to: 11 }, { from: 11, to: 12 }, { from: 12, to: 13 },
        { from: 13, to: 14 }, { from: 14, to: 10 }, { from: 10, to: 12 },
        { from: 10, to: 13 }, { from: 11, to: 14 }, { from: 11, to: 13 }
    ],
  }
];

const ConstellationAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [constellations, setConstellations] = useState<Constellation[]>(() => constellationData.map(createInitialConstellation));
  const [currentIndex, setCurrentIndex] = useState(0);
  const animationStateRef = useRef({ phase: 'FADING_IN', phaseStart: 0, currentEdge: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    const render = (timestamp: number) => {
      if (!ctx) return;
      
      // initialize phase start time
      if (animationStateRef.current.phaseStart === 0) {
        animationStateRef.current.phaseStart = timestamp;
      }
      const elapsedTime = timestamp - animationStateRef.current.phaseStart;

      // --- animation Logic ---
      const state = animationStateRef.current;
      const currentConstellation = constellations[currentIndex];
      
      // 1. FADE IN NODES
      if (state.phase === 'FADING_IN') {
        const duration = 1000; // 1 second to fade in
        const progress = Math.min(elapsedTime / duration, 1);
        currentConstellation.nodes.forEach(node => node.opacity = progress);
        if (progress >= 1) {
          state.phase = 'DRAWING_EDGES';
          state.phaseStart = timestamp;
          state.currentEdge = 0;
        }
      }
      
      // 2. DRAW EDGES
      else if (state.phase === 'DRAWING_EDGES') {
        const durationPerEdge = 300; // 0.3 seconds per edge
        const edgeIndex = Math.floor(elapsedTime / durationPerEdge);
        
        if (edgeIndex < currentConstellation.edges.length) {
            const edgeProgress = (elapsedTime % durationPerEdge) / durationPerEdge;
            currentConstellation.edges[edgeIndex].progress = edgeProgress;
            // Ensure previous edges are fully drawn
            for(let i=0; i<edgeIndex; i++) currentConstellation.edges[i].progress = 1;

        } else {
            currentConstellation.edges.forEach(edge => edge.progress = 1);
            state.phase = 'PAUSED';
            state.phaseStart = timestamp;
        }
      }

      // 3. PAUSE
      else if (state.phase === 'PAUSED') {
        const duration = 2000; // 2 second pause
        if (elapsedTime >= duration) {
          state.phase = 'FADING_OUT';
          state.phaseStart = timestamp;
        }
      }
      
      // 4. FADE OUT
      else if (state.phase === 'FADING_OUT') {
        const duration = 1000; // 1 second to fade out
        const progress = Math.min(elapsedTime / duration, 1);
        currentConstellation.nodes.forEach(node => node.opacity = 1 - progress);
        if (progress >= 1) {
          // Reset and move to next constellation
          const nextIndex = (currentIndex + 1) % constellations.length;
          setConstellations(prev => {
              const newConsts = [...prev];
              newConsts[currentIndex] = createInitialConstellation(constellationData[currentIndex]);
              return newConsts;
          });
          setCurrentIndex(nextIndex);
          state.phase = 'FADING_IN';
          state.phaseStart = timestamp;
        }
      }

      // --- Drawing Logic ---
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0D1117';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const nodesMap = new Map(currentConstellation.nodes.map(n => [n.id, n]));

      // Draw nodes with current opacity
      currentConstellation.nodes.forEach(node => {
        ctx.fillStyle = `rgba(240, 0, 255, ${node.opacity})`;
        ctx.shadowColor = `rgba(240, 0, 255, ${node.opacity})`;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(node.x * canvas.width, node.y * canvas.height, 4, 0, 2 * Math.PI);
        ctx.fill();
      });

      // Draw lines with current progress
      currentConstellation.edges.forEach(edge => {
        if (edge.progress > 0) {
          const fromNode = nodesMap.get(edge.from);
          const toNode = nodesMap.get(edge.to);
          if (fromNode && toNode) {
            const fromX = fromNode.x * canvas.width;
            const fromY = fromNode.y * canvas.height;
            const toX = toNode.x * canvas.width;
            const toY = toNode.y * canvas.height;

            ctx.strokeStyle = `rgba(240, 0, 255, ${fromNode.opacity * 0.7})`;
            ctx.lineWidth = 2;
            ctx.shadowBlur = 5;
            ctx.beginPath();
            ctx.moveTo(fromX, fromY);
            // Calculate the end point based on progress
            ctx.lineTo(fromX + (toX - fromX) * edge.progress, fromY + (toY - fromY) * edge.progress);
            ctx.stroke();
          }
        }
      });

      animationFrameId = window.requestAnimationFrame(render);
    };

    resizeCanvas();
    animationFrameId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [constellations, currentIndex]);

  return (
    <div className="w-full h-full bg-[#0D1117]">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default ConstellationAnimation;
