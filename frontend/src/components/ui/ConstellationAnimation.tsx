import React, { useRef, useEffect, useState } from 'react';

// --- Define the data structures ---
interface Node {
  id: number;
  x: number; 
  y: number;
}

interface Edge {
  from: number; 
  to: number;   
}

interface Constellation {
  nodes: Node[];
  edges: Edge[];
}

// Create an array of constellations to animate through
const constellations: Constellation[] = [
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
        { id: 10, x: 0.5, y: 0.1 }, { id: 11, x: 0.8, y: 0.4 },
        { id: 12, x: 0.65, y: 0.8 }, { id: 13, x: 0.35, y: 0.8 },
        { id: 14, x: 0.2, y: 0.4 },
    ],
    edges: [
        { from: 10, to: 11 }, { from: 11, to: 12 }, { from: 12, to: 13 },
        { from: 13, to: 14 }, { from: 14, to: 10 }, { from: 10, to: 12 },
        { from: 10, to: 13 },
    ],
  }
];

const ConstellationAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentConstellationIndex, setCurrentConstellationIndex] = useState(0);
  // add state for line animation ---
  const [currentEdgeIndex, setCurrentEdgeIndex] = useState(0);
  const [animationPhase, setAnimationPhase] = useState('DRAWING'); // DRAWING, PAUSED, FADING
  
  useEffect(() => {
    // timer handles the animation sequence
    if (animationPhase === 'DRAWING') {
      const interval = setInterval(() => {
        setCurrentEdgeIndex(prev => {
          const nextIndex = prev + 1;
          const currentConstellation = constellations[currentConstellationIndex];
          if (nextIndex >= currentConstellation.edges.length) {
            clearInterval(interval);
            setAnimationPhase('PAUSED');
          }
          return nextIndex;
        });
      }, 300); // draw a new line every 300ms
      return () => clearInterval(interval);
    } else if (animationPhase === 'PAUSED') {
      const timeout = setTimeout(() => {
        setAnimationPhase('FADING');
      }, 2000); // pause for 2 seconds
      return () => clearTimeout(timeout);
    } else if (animationPhase === 'FADING') {
       const timeout = setTimeout(() => {
        // switch to the next constellation
        setCurrentConstellationIndex(prev => (prev + 1) % constellations.length);
        setCurrentEdgeIndex(0);
        setAnimationPhase('DRAWING');
      }, 500); // fade duration
      return () => clearTimeout(timeout);
    }
  }, [animationPhase, currentConstellationIndex]);


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
      
      // Handle fading effect
      let opacity = 1;
      if (animationPhase === 'FADING') {
        opacity = 0;
      }
      ctx.globalAlpha = opacity;

      ctx.fillStyle = '#0D1117'; //clear canvas
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const currentConstellation = constellations[currentConstellationIndex];
      const nodesMap = new Map(currentConstellation.nodes.map(n => [n.id, n]));

      // --- draw all nodes ---
      ctx.fillStyle = '#F000FF';
      ctx.shadowColor = '#F000FF';
      ctx.shadowBlur = 10;
      currentConstellation.nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x * canvas.width, node.y * canvas.height, 4, 0, 2 * Math.PI);
        ctx.fill();
      });

      // --- draw the animated lines ---
      ctx.strokeStyle = 'rgba(240, 0, 255, 0.6)'; 
      ctx.lineWidth = 2;
      ctx.shadowBlur = 5;

      for (let i = 0; i < currentEdgeIndex; i++) {
        const edge = currentConstellation.edges[i];
        const fromNode = nodesMap.get(edge.from);
        const toNode = nodesMap.get(edge.to);

        if (fromNode && toNode) {
          ctx.beginPath();
          ctx.moveTo(fromNode.x * canvas.width, fromNode.y * canvas.height);
          ctx.lineTo(toNode.x * canvas.width, toNode.y * canvas.height);
          ctx.stroke();
        }
      }
      
      animationFrameId = window.requestAnimationFrame(render);
    };

    resizeCanvas();
    render(0);
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [currentConstellationIndex, currentEdgeIndex, animationPhase]);

  return (
    <div className="w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default ConstellationAnimation;
