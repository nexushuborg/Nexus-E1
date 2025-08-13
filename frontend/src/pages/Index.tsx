import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Github, GitBranch, Sparkles, BookOpenCheck } from "lucide-react";

function SpinningWire() {
  const ref = useRef<any>();
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.15;
      ref.current.rotation.x += delta * 0.07;
    }
  });
  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <icosahedronGeometry args={[3, 1]} />
      <meshStandardMaterial wireframe color={`hsl(var(--primary))`} opacity={0.25} transparent />
    </mesh>
  );
}

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("animate-fade-in");
    return () => document.body.classList.remove("animate-fade-in");
  }, []);

  return (
    <main>
      <Helmet>
        <title>DSA Tracker – Your DSA Journey, Organized</title>
        <meta name="description" content="Track LeetCode & GFG submissions with AI summaries and GitHub sync. Organize your DSA journey with ease." />
        <link rel="canonical" href="/" />
      </Helmet>

      <section className="relative min-h-[72vh] grid place-items-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-60">
          <Canvas camera={{ position: [0, 0, 8] }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <SpinningWire />
            <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
          </Canvas>
        </div>
        <div className="container text-center max-w-3xl animate-enter">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">Your DSA Journey, Organized.</h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            A clean dashboard for competitive programmers. Auto‑scraped code, AI summaries, and GitHub‑backed history.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button variant="hero" className="hover-scale" onClick={() => navigate("/login")}>Get Started</Button>
            <Button variant="outline" onClick={() => navigate("/dashboard")}>View Demo</Button>
          </div>
        </div>
      </section>

      <section className="container py-16">
        <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center">Why you'll love it</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <article className="rounded-xl border bg-card p-6 shadow-sm hover-scale">
            <GitBranch className="h-6 w-6 text-primary mb-3" />
            <h3 className="font-semibold mb-1">GitHub Integration</h3>
            <p className="text-sm text-muted-foreground">Your submissions live in a repo you control.</p>
          </article>
          <article className="rounded-xl border bg-card p-6 shadow-sm hover-scale">
            <Sparkles className="h-6 w-6 text-primary mb-3" />
            <h3 className="font-semibold mb-1">AI Summaries</h3>
            <p className="text-sm text-muted-foreground">Gemini turns code into concise explanations.</p>
          </article>
          <article className="rounded-xl border bg-card p-6 shadow-sm hover-scale">
            <BookOpenCheck className="h-6 w-6 text-primary mb-3" />
            <h3 className="font-semibold mb-1">Revision Flashcards</h3>
            <p className="text-sm text-muted-foreground">Turn tricky topics into quick drills.</p>
          </article>
          <article className="rounded-xl border bg-card p-6 shadow-sm hover-scale">
            <Github className="h-6 w-6 text-primary mb-3" />
            <h3 className="font-semibold mb-1">Built for Devs</h3>
            <p className="text-sm text-muted-foreground">Clean UI, keyboard friendly, fast.</p>
          </article>
        </div>
      </section>

      <section className="bg-secondary/50 py-16">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center">How it works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <article className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="text-sm text-muted-foreground mb-2">Step 1</div>
              <h3 className="font-semibold mb-1">Solve a problem</h3>
              <p className="text-sm text-muted-foreground">On LeetCode, GFG, or your favorite platform.</p>
            </article>
            <article className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="text-sm text-muted-foreground mb-2">Step 2</div>
              <h3 className="font-semibold mb-1">Extension captures details</h3>
              <p className="text-sm text-muted-foreground">Code + question + AI summary sent to GitHub.</p>
            </article>
            <article className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="text-sm text-muted-foreground mb-2">Step 3</div>
              <h3 className="font-semibold mb-1">Revise and track</h3>
              <p className="text-sm text-muted-foreground">Use the dashboard, filters, and flashcards.</p>
            </article>
          </div>
        </div>
      </section>

      <footer className="border-t">
        <div className="container py-8 text-center text-sm text-muted-foreground">
          <div>© {new Date().getFullYear()} DSA Tracker</div>
          <div className="mt-2">Contact: support@dsatracker.dev</div>
        </div>
      </footer>
    </main>
  );
};

export default Index;
