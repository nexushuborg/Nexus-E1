/**
 * The code defines a React component that showcases features of a DSA Tracker application, including
 * animations, user authentication, theme handling, and a 3D spinning wire visual effect.
 * @param  - The code you provided is a React component that serves as the main page of a web
 * application. Here's a breakdown of the key components and functionalities:
 * @returns The `Index` component is being returned, which contains the main content of the webpage. It
 * includes a header section with a title and description, a section showcasing features with
 * animations, a section explaining how the application works in steps, and a footer component. The
 * component also includes conditional rendering based on user authentication status and theme
 * settings.
 */
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

// Renders a 3D wireframe icosahedron that spins.
// It changes color based on the current theme (dark or light).
function SpinningWire({ isDark }: { isDark: boolean }) {
  const ref = useRef<any>();
  // Use the useFrame hook to animate the rotation of the mesh.
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.15;
      ref.current.rotation.x += delta * 0.07;
    }
  });
  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <icosahedronGeometry args={[4, 1]} />
      <meshStandardMaterial
        wireframe
        color={isDark ? "#ffffff" : "#ff0000"}
        opacity={0.7}
        transparent
      />
    </mesh>
  );
}

// Data for the features section, including title, icon, description, and an animated visual.
const features = [
  {
    title: "GitHub Integration",
    icon: GitBranch,
    description:
      "Your submissions live in a private repository you control. Never lose track of a solution again, with a full version history backed by Git.",
    animation: (
      // Animation for the GitHub Integration feature, simulating a Git branch.
      <div className="w-48 h-48 relative flex justify-center items-center">
        <div className="w-full h-1 bg-muted absolute top-1/2 left-0 -translate-y-1/2">
          <div className="h-full bg-[#253fac] animate-[draw-main-line_1s_ease-out_forwards]"></div>
        </div>
        <div className="w-1 h-24 bg-muted absolute top-1/2 left-1/2 -translate-x-1/2">
          <div className="h-full bg-[#253fac] animate-[draw-branch-line_1s_ease-out_1s_forwards] origin-top"></div>
        </div>
      </div>
    ),
  },
  {
    title: "AI Summaries",
    icon: Sparkles,
    description:
      "Gemini automatically analyzes your code, explains the logic, and calculates the time and space complexity, turning every solution into a learning opportunity.",
    animation: (
      // Animation for the AI Summaries feature, showing sparkling effects.
      <div className="w-48 h-48 relative flex justify-center items-center">
        <div className="w-32 h-20 bg-muted rounded-md relative">
          <Sparkles className="h-8 w-8 text-[#253fac] absolute -top-4 -right-4 animate-[sparkle-pulse_1.5s_ease-in-out_infinite]" />
          <Sparkles className="h-5 w-5 text-[#253fac] absolute top-1/2 left-4 animate-[sparkle-pulse_1.5s_ease-in-out_infinite_0.5s]" />
          <Sparkles className="h-6 w-6 text-[#253fac] absolute -bottom-3 right-8 animate-[sparkle-pulse_1.5s_ease-in-out_infinite_1s]" />
        </div>
      </div>
    ),
  },
  {
    title: "Revision Flashcards",
    icon: BookOpenCheck,
    description:
      "Turn tricky topics and forgotten solutions into quick, interactive drills. Reinforce your knowledge and prepare for interviews with targeted practice.",
    animation: (
      // Animation for the Revision Flashcards feature, simulating a 3D card flip.
      <div
        className="w-48 h-48 relative flex justify-center items-center"
        style={{ perspective: "1000px" }}
      >
        <div
          className="w-32 h-40 bg-card border rounded-lg shadow-lg relative animate-[card-flip_1.5s_ease-in-out_forwards]"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            className="absolute inset-0 bg-muted rounded-lg flex items-center justify-center"
            style={{ backfaceVisibility: "hidden" }}
          >
            <h3 className="font-bold text-lg text-foreground">Question?</h3>
          </div>
          <div
            className="absolute inset-0 bg-primary/20 rounded-lg flex items-center justify-center"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <BookOpenCheck className="h-12 w-12 text-[#253fac]" />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Built for Devs",
    icon: Github,
    description:
      "A clean, keyboard-friendly UI that gets out of your way. Focus on solving problems, not fighting your tools.",
    animation: (
      // Animation for the "Built for Devs" feature, showing a GitHub icon pop-in.
      <div className="w-48 h-48 relative flex justify-center items-center">
        <Github className="h-24 w-24 text-[#253fac] animate-[icon-pop-in_0.8s_ease-out_forwards]" />
      </div>
    ),
  },
];

// A component that displays a tab-based feature showcase with animations.
const FeatureShowcase = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="container py-16">
      <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-center text-foreground">
        Why you'll love it
      </h2>

      {/* Feature selection buttons (tabs) */}
      <div className="flex justify-center flex-wrap gap-2 md:gap-4 mb-8">
        {features.map((feature, index) => (
          <button
            key={feature.title}
            onClick={() => setActiveTab(index)}
            className={`
						px-4 py-2 text-sm md:text-base rounded-lg transition-colors duration-300
						${
              activeTab === index
                ? "bg-[#253fac] text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }
					`}
          >
            {feature.title}
          </button>
        ))}
      </div>

      {/* Display area for the active feature's animation and description */}
      <div className="bg-card border rounded-xl p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center min-h-[300px]">
        {features.map((feature, index) => (
          <React.Fragment key={feature.title}>
            {/* Conditional rendering for the feature animation based on active tab */}
            <div
              className={`justify-center items-center ${
                activeTab === index ? "flex" : "hidden"
              }`}
            >
              {feature.animation}
            </div>
            {/* Conditional rendering for the feature description based on active tab */}
            <div className={`${activeTab === index ? "block" : "hidden"}`}>
              <div className="flex items-center gap-3 mb-3">
                <feature.icon className="h-7 w-7 text-[#253fac]" />
                <h3 className="text-2xl font-semibold text-foreground">
                  {feature.title}
                </h3>
              </div>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

// Main component for the home page.
const Index = () => {
  const navigate = useNavigate();
  const { theme, systemTheme } = useTheme();
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Set mounted state to true once the component has mounted on the client side.
  useEffect(() => setMounted(true), []);

  // Redirect to dashboard if user is authenticated and not loading.
  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  // Add a fade-in animation class to the body on component mount.
  useEffect(() => {
    document.body.classList.add("animate-fade-in");
    return () => document.body.classList.remove("animate-fade-in");
  }, []);

  // Show a blank screen while the component is not mounted, or loading, or user is already logged in.
  if (!mounted || loading || user) {
    return <div className="min-h-screen bg-background"></div>;
  }

  // Determine the current theme to pass to the 3D spinning wire.
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <main
      className={
        // Apply a gradient background class based on the current theme.
        isDark ? "dark-gradient-background" : "light-gradient-background"
      }
    >
      {/* Helmet component for managing document head tags for SEO and page metadata. */}
      <Helmet>
        <title>DSA Tracker – Your DSA Journey, Organized</title>
        <meta
          name="description"
          content="Track LeetCode & GFG submissions with AI summaries and GitHub sync. Organize your DSA journey with ease."
        />
        <link rel="canonical" href="/" />
      </Helmet>

      {/* Hero section with a spinning 3D wireframe and main call to action. */}
      <section className="relative min-h-[72vh] grid place-items-center overflow-hidden">
        {/* Container for the 3D spinning wire background. */}
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-60">
          <Canvas camera={{ position: [0, 0, 8] }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <SpinningWire isDark={isDark} />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              enableRotate={false}
            />
          </Canvas>
        </div>
        {/* Main content of the hero section. */}
        <div className="container text-center max-w-3xl animate-enter">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-foreground">
            Your DSA Journey, Organized.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            A clean dashboard for competitive programmers. Auto-scraped code, AI
            summaries, and GitHub-backed history.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="glossy-button inline-flex items-center justify-center font-semibold py-2 px-4 rounded-lg bg-[#253fac] text-white hover:bg-[#3a52b4] hover:shadow-lg hover:shadow-[#253fac]/40 hover-scale"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Section showcasing the features of the application. */}
      <FeatureShowcase />

      {/* Section explaining the three-step process of how the application works. */}
      <section className="bg-secondary/50 py-16">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center text-foreground">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Step 1: Solve a problem. */}
            <article className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="text-sm font-bold mb-2 text-[#253fac]">
                Step 1
              </div>
              <h3 className="font-semibold mb-1 text-foreground">
                Solve a problem
              </h3>
              <p className="text-sm text-muted-foreground">
                On LeetCode, GFG, or your favorite platform.
              </p>
            </article>
            {/* Step 2: Extension captures details. */}
            <article className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="text-sm font-bold mb-2 text-[#253fac]">
                Step 2
              </div>
              <h3 className="font-semibold mb-1 text-foreground">
                Extension captures details
              </h3>
              <p className="text-sm text-muted-foreground">
                Code + question + AI summary sent to GitHub.
              </p>
            </article>
            {/* Step 3: Revise and track. */}
            <article className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="text-sm font-bold mb-2 text-[#253fac]">
                Step 3
              </div>
              <h3 className="font-semibold mb-1 text-foreground">
                Revise and track
              </h3>
              <p className="text-sm text-muted-foreground">
                Use the dashboard, filters, and flashcards.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Footer component. */}
      <Footer />
    </main>
  );
};

export default Index;
