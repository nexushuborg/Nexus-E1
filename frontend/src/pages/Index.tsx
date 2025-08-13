import React, { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Github, GitBranch, Sparkles, BookOpenCheck } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/contexts/AuthContext"; 
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

const features = [
  {
    title: "GitHub Integration",
    icon: GitBranch,
    description: "Your submissions live in a private repository you control. Never lose track of a solution again, with a full version history backed by Git.",
    animation: (
      <div className="w-48 h-48 relative flex justify-center items-center">
        <div className="w-full h-1 bg-muted absolute top-1/2 left-0 -translate-y-1/2">
          <div className="h-full bg-[#F000FF] animate-[draw-main-line_1s_ease-out_forwards]"></div>
        </div>
        <div className="w-1 h-24 bg-muted absolute top-1/2 left-1/2 -translate-x-1/2">
           <div className="h-full bg-[#F000FF] animate-[draw-branch-line_1s_ease-out_1s_forwards] origin-top"></div>
        </div>
      </div>
    )
  },
  {
    title: "AI Summaries",
    icon: Sparkles,
    description: "Gemini automatically analyzes your code, explains the logic, and calculates the time and space complexity, turning every solution into a learning opportunity.",
    animation: (
       <div className="w-48 h-48 relative flex justify-center items-center">
        <div className="w-32 h-20 bg-muted rounded-md relative">
            <Sparkles className="h-8 w-8 text-[#F000FF] absolute -top-4 -right-4 animate-[sparkle-pulse_1.5s_ease-in-out_infinite]" />
            <Sparkles className="h-5 w-5 text-[#F000FF] absolute top-1/2 left-4 animate-[sparkle-pulse_1.5s_ease-in-out_infinite_0.5s]" />
            <Sparkles className="h-6 w-6 text-[#F000FF] absolute -bottom-3 right-8 animate-[sparkle-pulse_1.5s_ease-in-out_infinite_1s]" />
        </div>
      </div>
    )
  },
  {
    title: "Revision Flashcards",
    icon: BookOpenCheck,
    description: "Turn tricky topics and forgotten solutions into quick, interactive drills. Reinforce your knowledge and prepare for interviews with targeted practice.",
    animation: (
      <div className="w-48 h-48 relative flex justify-center items-center" style={{ perspective: '1000px' }}>
        <div className="w-32 h-40 bg-card border rounded-lg shadow-lg relative animate-[card-flip_1.5s_ease-in-out_forwards]" style={{ transformStyle: 'preserve-3d' }}>
            <div className="absolute inset-0 bg-muted rounded-lg flex items-center justify-center" style={{ backfaceVisibility: 'hidden' }}>
                <h3 className="font-bold text-lg text-foreground">Question?</h3>
            </div>
            <div className="absolute inset-0 bg-primary/20 rounded-lg flex items-center justify-center" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)'}}>
                <BookOpenCheck className="h-12 w-12 text-[#F000FF]" />
            </div>
        </div>
      </div>
    )
  },
  {
    title: "Built for Devs",
    icon: Github,
    description: "A clean, keyboard-friendly UI that gets out of your way. Focus on solving problems, not fighting your tools.",
    animation: (
       <div className="w-48 h-48 relative flex justify-center items-center">
          <Github className="h-24 w-24 text-[#F000FF] animate-[icon-pop-in_0.8s_ease-out_forwards]" />
       </div>
    )
  }
];

const FeatureShowcase = () => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <section className="container py-16">
            <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-center text-foreground">Why you'll love it</h2>
            
            <div className="flex justify-center flex-wrap gap-2 md:gap-4 mb-8">
                {features.map((feature, index) => (
                    <button 
                        key={feature.title}
                        onClick={() => setActiveTab(index)}
                        className={`
                            px-4 py-2 text-sm md:text-base rounded-lg transition-colors duration-300
                            ${activeTab === index ? 'bg-[#F000FF] text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}
                        `}
                    >
                        {feature.title}
                    </button>
                ))}
            </div>

            <div className="bg-card border rounded-xl p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center min-h-[300px]">
                {features.map((feature, index) => (
                    <React.Fragment key={feature.title}>
                        <div className={`justify-center items-center ${activeTab === index ? 'flex' : 'hidden'}`}>
                            {feature.animation}
                        </div>
                        <div className={`${activeTab === index ? 'block' : 'hidden'}`}>
                            <div className="flex items-center gap-3 mb-3">
                                <feature.icon className="h-7 w-7 text-[#F000FF]" />
                                <h3 className="text-2xl font-semibold text-foreground">{feature.title}</h3>
                            </div>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </section>
    );
};


const Index = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  // *** THE FIX *** Get user and loading status
  const { user, loading } = useAuth();

  // *** THE FIX *** Add useEffect for redirection
  useEffect(() => {
    // When loading is finished and a user exists, redirect to dashboard
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);


  useEffect(() => {
    document.body.classList.add("animate-fade-in");
    return () => document.body.classList.remove("animate-fade-in");
  }, []);
  
  // While checking for a user, we can show a blank page or a loader
  if (loading || user) {
      return <div className="min-h-screen bg-background"></div>;
  }

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
            <Button variant="outline" onClick={() => navigate("/dashboard")} className="text-foreground hover:border-[#F000FF] hover:text-[#F000FF] hover:bg-transparent">View Demo</Button>
          </div>
        </div>
      </section>

      <FeatureShowcase />

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
