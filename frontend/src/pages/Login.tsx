import React from "react";
import { Helmet } from "react-helmet-async";
import { Github } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import ConstellationAnimation from "@/components/ui/ConstellationAnimation";
import { useTheme } from "next-themes";

// A simple placeholder for the Footer
const Footer = () => (
    <footer className="w-full text-center p-4 text-muted-foreground text-sm">
      © 2025 Nexus-Hub. All Rights Reserved.
    </footer>
);


export default function Login() {
  const { signInWithGitHub } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    // *** THE FIX *** Switched to a CSS Grid layout for robust positioning
    <div className="grid h-screen grid-rows-[1fr_auto] bg-background overflow-hidden transition-colors duration-300">
      <Helmet>
        <title>Sign In – DSA Tracker</title>
        <meta name="description" content="Sign in to your DSA submissions account." />
        <link rel="canonical" href="/login" />
      </Helmet>

      {/* Background Glows with smooth transition (Dark mode only) */}
      <div 
        className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none transition-opacity duration-500"
        style={{ opacity: isDark ? 1 : 0 }}
      >
        <div
          className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[#7c1779] rounded-full opacity-20"
          style={{ filter: 'blur(150px)' }}>
        </div>
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-[#F000FF] rounded-full opacity-20"
          style={{ filter: 'blur(150px)' }}>
        </div>
      </div>

      {/* Main content area - removed flex-grow as it's now a grid item */}
      <main className="flex items-center justify-center p-4 relative z-10">
        <div
          className={`
            w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl 
            transition-all duration-300
            ${isDark ? 'bg-slate-800/60 border border-slate-700/50 backdrop-blur-lg' : 'bg-card border'}
          `}
        >
          {/* Left Panel */}
          <div className="p-8 md:p-12">
             <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-all duration-300">
                  <path d="M30 15 L30 85 L70 85 M30 50 L60 50 M30 15 L70 15" stroke={isDark ? "#EAEAEA" : "hsl(var(--foreground))"} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M30 50 L60 50" stroke="#F000FF" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-foreground">Nexus-E1</h1>
            </div>

            <h2 className="text-3xl font-bold mb-2 text-foreground">Your coding journey awaits</h2>
            <p className="text-muted-foreground mb-8">
              Connect your GitHub account to continue.
            </p>

            <div className="mt-6">
              <button 
                onClick={signInWithGitHub} 
                className="glossy-button w-full flex items-center justify-center font-semibold py-3 px-4 rounded-lg bg-[#F000FF] text-white hover:bg-[#c100cc] hover:shadow-lg hover:shadow-[#F000FF]/40"
              >
                <Github className="w-5 h-5 mr-2" />
                Sign In with GitHub
              </button>
            </div>
             <p className="text-xs text-muted-foreground mt-4 text-center">
                By signing in, you agree to our Terms of Service.
            </p>
          </div>

          {/* Right Panel - Animation */}
          <div className="hidden md:block bg-card border-l">
            <ConstellationAnimation />
          </div>
        </div>
      </main>

      {/* The Footer is now the second row in our grid */}
      <Footer />
    </div>
  );
}
