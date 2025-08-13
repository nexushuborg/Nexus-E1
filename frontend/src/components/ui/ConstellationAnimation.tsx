import React, { useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';

// Data structures and initial data remain the same
interface Node {
  id: number; x: number; y: number; opacity: number;
}
interface Edge {
  from: number; to: number; progress: number;
}
interface ConstellationData {
  nodes: Omit<Node, 'opacity'>[];
  edges: Omit<Edge, 'progress'>[];
}

const constellationData: ConstellationData[] = [
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
  const { theme } = useTheme();
  const animationControllerRef = useRef<any>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!animationControllerRef.current) {
      animationControllerRef.current = {
        currentIndex: 0,
        state: { phase: 'FADING_IN', phaseStart: 0 },
        constellation: {
          nodes: constellationData[0].nodes.map(n => ({ ...n, opacity: 0 })),
          edges: constellationData[0].edges.map(e => ({ ...e, progress: 0 })),
        },
        animationFrameId: 0,
        colors: { primary: '', card: '', line: '' },

        updateTheme(newTheme: string | undefined) {
          const isDark = newTheme === 'dark';
          if (isDark) {
            this.colors = { primary: '#F000FF', card: '#161B22', line: '#F000FF' };
          } else {
            // *** THE FIX *** Use magenta for nodes and lines in light mode
            this.colors = {
              primary: '#F000FF',
              card: '#FFFFFF', // White background
              line: '#F000FF', // Magenta lines
            };
          }
        },
        
        // *** THE FIX *** Bind 'this' to the render method here.
        start() {
          this.render = this.render.bind(this);
          this.animationFrameId = window.requestAnimationFrame(this.render);
        },

        stop() {
          window.cancelAnimationFrame(this.animationFrameId);
        },

        render(timestamp: number) {
          if (this.state.phaseStart === 0) this.state.phaseStart = timestamp;
          const elapsedTime = timestamp - this.state.phaseStart;

          // State machine logic
          if (this.state.phase === 'FADING_IN') {
            const progress = Math.min(elapsedTime / 1000, 1);
            this.constellation.nodes.forEach((node: Node) => node.opacity = progress);
            if (progress >= 1) { this.state = { phase: 'DRAWING_EDGES', phaseStart: timestamp }; }
          } else if (this.state.phase === 'DRAWING_EDGES') {
            const edgeIndex = Math.floor(elapsedTime / 300);
            if (edgeIndex < this.constellation.edges.length) {
                this.constellation.edges[edgeIndex].progress = (elapsedTime % 300) / 300;
                for(let i=0; i<edgeIndex; i++) this.constellation.edges[i].progress = 1;
            } else {
                this.constellation.edges.forEach((edge: Edge) => edge.progress = 1);
                this.state = { phase: 'PAUSED', phaseStart: timestamp };
            }
          } else if (this.state.phase === 'PAUSED') {
            if (elapsedTime >= 2000) { this.state = { phase: 'FADING_OUT', phaseStart: timestamp }; }
          } else if (this.state.phase === 'FADING_OUT') {
            const progress = Math.min(elapsedTime / 1000, 1);
            this.constellation.nodes.forEach((node: Node) => node.opacity = 1 - progress);
            if (progress >= 1) {
              this.currentIndex = (this.currentIndex + 1) % constellationData.length;
              this.constellation = {
                  nodes: constellationData[this.currentIndex].nodes.map(n => ({ ...n, opacity: 0 })),
                  edges: constellationData[this.currentIndex].edges.map(e => ({ ...e, progress: 0 })),
              };
              this.state = { phase: 'FADING_IN', phaseStart: timestamp };
            }
          }

          // Drawing logic
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = this.colors.card;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          const nodesMap = new Map(this.constellation.nodes.map((n: Node) => [n.id, n]));
          this.constellation.nodes.forEach((node: Node) => {
              const color = `rgba(240, 0, 255, ${node.opacity})`;
              ctx.fillStyle = color;
              ctx.shadowColor = color;
              ctx.shadowBlur = 10;
              ctx.beginPath();
              ctx.arc(node.x * canvas.width, node.y * canvas.height, 4, 0, 2 * Math.PI);
              ctx.fill();
          });

          this.constellation.edges.forEach((edge: Edge) => {
              if (edge.progress > 0) {
                  const fromNode = nodesMap.get(edge.from) as Node | undefined;
                  const toNode = nodesMap.get(edge.to) as Node | undefined;
                  if (fromNode && toNode) {
                      const fromX = fromNode.x * canvas.width, fromY = fromNode.y * canvas.height;
                      const toX = toNode.x * canvas.width, toY = toNode.y * canvas.height;
                      const lineColor = `rgba(240, 0, 255, ${fromNode.opacity * 0.7})`;
                      ctx.strokeStyle = lineColor;
                      ctx.lineWidth = 2;
                      ctx.shadowColor = lineColor;
                      ctx.shadowBlur = 5;
                      ctx.beginPath();
                      ctx.moveTo(fromX, fromY);
                      ctx.lineTo(fromX + (toX - fromX) * edge.progress, fromY + (toY - fromY) * edge.progress);
                      ctx.stroke();
                  }
              }
          });
          this.animationFrameId = window.requestAnimationFrame(this.render);
        }
      };
      
      animationControllerRef.current.start();
    }

    const controller = animationControllerRef.current;
    
    controller.updateTheme(theme);
    
    const resizeCanvas = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [theme]);

  useEffect(() => {
    const controller = animationControllerRef.current;
    return () => {
      controller?.stop();
    }
  }, []);

  return (
    <div className="w-full h-full bg-card">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default ConstellationAnimation;
