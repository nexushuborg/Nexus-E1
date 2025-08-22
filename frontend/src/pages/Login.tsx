import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Github } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import ConstellationAnimation from "@/components/ui/ConstellationAnimation";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";
import { Footer } from "@/components/ui/Footer"

export default function Login() {
  const { signInWithGitHub } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Add useEffect for redirection
  useEffect(() => {
    // When loading is finished and a user exists, redirect to dashboard
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  // While checking for a user, we can show a blank page or a loader
  if (loading || user) {
    return <div className="h-full bg-background"></div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div 
        className="relative flex-grow flex items-center justify-center p-[125px]"
        style={{
          background: isDark 
            ? 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e293b 100%)' 
            : 'linear-gradient(135deg, #f8fafc 0%, #f8fafc 50%, #f8fafc 100%)',
        }}
      >
        <Helmet>
          <title>Sign In Algolog</title>
          <meta name="description" content="Sign in to your DSA submissions account." />
          <link rel="canonical" href="/login" />
        </Helmet>

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
              <h1 className="text-2xl font-bold text-foreground">Algolog</h1>
            </div>

            <h2 className="text-3xl font-bold mb-2 text-foreground">Your coding journey awaits</h2>
            <p className="text-muted-foreground mb-8">
              Connect your GitHub account to continue.
            </p>

            <div className="mt-6">
              <button
                onClick={signInWithGitHub}
                className="glossy-button w-full flex items-center justify-center font-semibold py-3 px-4 rounded-lg bg-[#253fac] text-white hover:bg-[#3a52b4] hover:shadow-lg hover:shadow-[#253fac]/40"
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
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}