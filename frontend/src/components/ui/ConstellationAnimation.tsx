/* The above code is a React component called `ConstellationAnimation` that creates an animated
constellation effect using HTML canvas. Here's a summary of what the code does: */
import React, { useRef, useEffect } from "react";
import { useTheme } from "next-themes";

// TypeScript interfaces for the data structures used in the animation.
interface Node {
  id: number;
  x: number;
  y: number;
  opacity: number;
}

interface Edge {
  from: number;
  to: number;
  progress: number;
}

interface ConstellationData {
  nodes: Omit<Node, "opacity">[];
  edges: Omit<Edge, "progress">[];
}

// Predefined constellation patterns with normalized coordinates.
const constellationData: ConstellationData[] = [
  // First constellation pattern.
  {
    nodes: [
      { id: 1, x: 0.5, y: 0.15 },
      { id: 2, x: 0.3, y: 0.35 },
      { id: 3, x: 0.7, y: 0.35 },
      { id: 4, x: 0.2, y: 0.55 },
      { id: 5, x: 0.4, y: 0.55 },
      { id: 6, x: 0.6, y: 0.55 },
      { id: 7, x: 0.8, y: 0.55 },
      { id: 8, x: 0.35, y: 0.75 },
      { id: 9, x: 0.85, y: 0.75 },
    ],
    edges: [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 4 },
      { from: 2, to: 5 },
      { from: 3, to: 6 },
      { from: 3, to: 7 },
      { from: 5, to: 8 },
      { from: 7, to: 9 },
    ],
  },
  // Second constellation pattern.
  {
    nodes: [
      { id: 10, x: 0.5, y: 0.1 },
      { id: 11, x: 0.85, y: 0.4 },
      { id: 12, x: 0.65, y: 0.8 },
      { id: 13, x: 0.35, y: 0.8 },
      { id: 14, x: 0.15, y: 0.4 },
    ],
    edges: [
      { from: 10, to: 11 },
      { from: 11, to: 12 },
      { from: 12, to: 13 },
      { from: 13, to: 14 },
      { from: 14, to: 10 },
      { from: 10, to: 12 },
      { from: 10, to: 13 },
      { from: 11, to: 14 },
      { from: 11, to: 13 },
    ],
  },
];

// React component for the constellation animation.
const ConstellationAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();
  const animationRef = useRef<any>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // The core logic and state management for the animation.
    const controller = {
      currentIndex: 0,
      state: { phase: "FADING_IN", phaseStart: 0 },
      constellation: {
        nodes: constellationData[0].nodes.map((n) => ({ ...n, opacity: 0 })),
        edges: constellationData[0].edges.map((e) => ({ ...e, progress: 0 })),
      },
      animationFrameId: 0,

      // Fixed colors for the nodes and lines, independent of theme.
      nodeColor: "rgba(37,63,172,0.8)",
      edgeColor: "rgba(37,63,172,0.6)",

      // Starts the animation loop.
      start() {
        this.render = this.render.bind(this);
        this.animationFrameId = window.requestAnimationFrame(this.render);
      },

      // Stops the animation loop.
      stop() {
        window.cancelAnimationFrame(this.animationFrameId);
      },

      // The main render loop for the animation.
      render(timestamp: number) {
        if (this.state.phaseStart === 0) this.state.phaseStart = timestamp;
        const elapsed = timestamp - this.state.phaseStart;

        // Update animation state based on current phase (fading in, drawing edges, pausing, fading out).
        if (this.state.phase === "FADING_IN") {
          const progress = Math.min(elapsed / 1000, 1);
          this.constellation.nodes.forEach((n: Node) => (n.opacity = progress));
          if (progress >= 1)
            this.state = { phase: "DRAWING_EDGES", phaseStart: timestamp };
        } else if (this.state.phase === "DRAWING_EDGES") {
          const edgeIndex = Math.floor(elapsed / 300);
          if (edgeIndex < this.constellation.edges.length) {
            this.constellation.edges[edgeIndex].progress =
              (elapsed % 300) / 300;
            for (let i = 0; i < edgeIndex; i++)
              this.constellation.edges[i].progress = 1;
          } else {
            this.constellation.edges.forEach((e: Edge) => (e.progress = 1));
            this.state = { phase: "PAUSED", phaseStart: timestamp };
          }
        } else if (this.state.phase === "PAUSED") {
          if (elapsed >= 2000)
            this.state = { phase: "FADING_OUT", phaseStart: timestamp };
        } else if (this.state.phase === "FADING_OUT") {
          const progress = Math.min(elapsed / 1000, 1);
          this.constellation.nodes.forEach(
            (n: Node) => (n.opacity = 1 - progress)
          );
          if (progress >= 1) {
            // Cycle to the next constellation pattern.
            this.currentIndex =
              (this.currentIndex + 1) % constellationData.length;
            this.constellation = {
              nodes: constellationData[this.currentIndex].nodes.map((n) => ({
                ...n,
                opacity: 0,
              })),
              edges: constellationData[this.currentIndex].edges.map((e) => ({
                ...e,
                progress: 0,
              })),
            };
            this.state = { phase: "FADING_IN", phaseStart: timestamp };
          }
        }

        // Clear the canvas.
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the edges of the constellation.
        const nodesMap = new Map(
          this.constellation.nodes.map((n) => [n.id, n])
        );
        this.constellation.edges.forEach((edge: Edge) => {
          if (edge.progress > 0) {
            const from = nodesMap.get(edge.from)!;
            const to = nodesMap.get(edge.to)!;
            ctx.strokeStyle = this.edgeColor.replace(
              /[\d.]+\)$/g,
              `${from.opacity})`
            );
            ctx.lineWidth = 2;
            ctx.shadowColor = ctx.strokeStyle;
            ctx.shadowBlur = 5;
            ctx.beginPath();
            ctx.moveTo(from.x * canvas.width, from.y * canvas.height);
            ctx.lineTo(
              from.x * canvas.width +
                (to.x - from.x) * canvas.width * edge.progress,
              from.y * canvas.height +
                (to.y - from.y) * canvas.height * edge.progress
            );
            ctx.stroke();
          }
        });

        // Draw the nodes (stars) of the constellation.
        this.constellation.nodes.forEach((node: Node) => {
          ctx.fillStyle = this.nodeColor.replace(
            /[\d.]+\)$/g,
            `${node.opacity})`
          );
          ctx.shadowColor = ctx.fillStyle;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(
            node.x * canvas.width,
            node.y * canvas.height,
            4,
            0,
            Math.PI * 2
          );
          ctx.fill();
        });

        // Request the next animation frame.
        this.animationFrameId = window.requestAnimationFrame(this.render);
      },
    };

    animationRef.current = controller;
    controller.start();

    // Resize the canvas to fit its parent container.
    const resizeCanvas = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Cleanup function to stop the animation and remove the event listener.
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      controller.stop();
    };
  }, [theme]); // Re-run effect when the theme changes.

  return (
    <div className="w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default ConstellationAnimation;
