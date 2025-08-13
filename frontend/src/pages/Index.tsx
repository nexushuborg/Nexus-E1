import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Github, GitBranch, Sparkles, BookOpenCheck } from "lucide-react";
import { useTheme } from "next-themes";
import { Footer } from "@/components/ui/Footer";

function SpinningWire({ isDark }: { isDark: boolean }) {
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
      <meshStandardMaterial wireframe color={'#F000FF'} opacity={isDark ? 0.25 : 0.5} transparent />
    </mesh>
  );
}

const Index = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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
            <SpinningWire isDark={isDark} />
            <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
          </Canvas>
        </div>
        <div className="container text-center max-w-3xl animate-enter">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-foreground">Your DSA Journey, Organized.</h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            A clean dashboard for competitive programmers. Auto‑scraped code, AI summaries, and GitHub‑backed history.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => navigate("/login")} className="glossy-button inline-flex items-center justify-center font-semibold py-2 px-4 rounded-lg bg-[#F000FF] text-white hover:bg-[#c100cc] hover:shadow-lg hover:shadow-[#F000FF]/40 hover-scale">
                Get Started
            </button>
            {/* *** THE FIX *** Added text-foreground for visibility in light mode */}
            <Button variant="outline" onClick={() => navigate("/dashboard")} className="text-foreground hover:border-[#F000FF] hover:text-[#F000FF] hover:bg-transparent">View Demo</Button>
          </div>
        </div>
      </section>

      <section className="container py-16">
        <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center text-foreground">Why you'll love it</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {/* *** THE FIX *** Removed dark: prefix from hover effects */}
          <article className="rounded-xl border bg-card p-6 shadow-sm hover-scale transition-all duration-300 hover:border-[#F000FF]/50 hover:shadow-[0_0_20px_rgba(240,0,255,0.2)]">
            <GitBranch className="h-6 w-6 mb-3 text-[#F000FF]" />
            <h3 className="font-semibold mb-1 text-foreground">GitHub Integration</h3>
            <p className="text-sm text-muted-foreground">Your submissions live in a repo you control.</p>
          </article>
          <article className="rounded-xl border bg-card p-6 shadow-sm hover-scale transition-all duration-300 hover:border-[#F000FF]/50 hover:shadow-[0_0_20px_rgba(240,0,255,0.2)]">
            <Sparkles className="h-6 w-6 mb-3 text-[#F000FF]" />
            <h3 className="font-semibold mb-1 text-foreground">AI Summaries</h3>
            <p className="text-sm text-muted-foreground">Gemini turns code into concise explanations.</p>
          </article>
          <article className="rounded-xl border bg-card p-6 shadow-sm hover-scale transition-all duration-300 hover:border-[#F000FF]/50 hover:shadow-[0_0_20px_rgba(240,0,255,0.2)]">
            <BookOpenCheck className="h-6 w-6 mb-3 text-[#F000FF]" />
            <h3 className="font-semibold mb-1 text-foreground">Revision Flashcards</h3>
            <p className="text-sm text-muted-foreground">Turn tricky topics into quick drills.</p>
          </article>
          <article className="rounded-xl border bg-card p-6 shadow-sm hover-scale transition-all duration-300 hover:border-[#F000FF]/50 hover:shadow-[0_0_20px_rgba(240,0,255,0.2)]">
            <Github className="h-6 w-6 mb-3 text-[#F000FF]" />
            <h3 className="font-semibold mb-1 text-foreground">Built for Devs</h3>
            <p className="text-sm text-muted-foreground">Clean UI, keyboard friendly, fast.</p>
          </article>
        </div>
      </section>

      <section className="bg-secondary/50 py-16">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center text-foreground">How it works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <article className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="text-sm font-semibold mb-2 text-[#F000FF]">Step 1</div>
              <h3 className="font-semibold mb-1 text-foreground">Solve a problem</h3>
              <p className="text-sm text-muted-foreground">On LeetCode, GFG, or your favorite platform.</p>
            </article>
            <article className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="text-sm font-semibold mb-2 text-[#F000FF]">Step 2</div>
              <h3 className="font-semibold mb-1 text-foreground">Extension captures details</h3>
              <p className="text-sm text-muted-foreground">Code + question + AI summary sent to GitHub.</p>
            </article>
            <article className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="text-sm font-semibold mb-2 text-[#F000FF]">Step 3</div>
              <h3 className="font-semibold mb-1 text-foreground">Revise and track</h3>
              <p className="text-sm text-muted-foreground">Use the dashboard, filters, and flashcards.</p>
            </article>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Index;
