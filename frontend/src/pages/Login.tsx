/**
 * The `Login` component in TypeScript React handles user authentication with GitHub and displays a
 * themed sign-in interface with a constellation animation and a footer.
 * @returns The `Login` component is being returned. It contains JSX elements for a login page
 * interface, including a title, description, GitHub sign-in button, and a footer. The component also
 * includes conditional rendering based on the theme loading state and user authentication status.
 */
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Github } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import ConstellationAnimation from "@/components/ui/ConstellationAnimation";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";
import { Footer } from "@/components/ui/Footer";

// Login component for user authentication.
export default function Login() {
  const { signInWithGitHub } = useAuth();
  const { resolvedTheme } = useTheme(); // actual theme
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Use useEffect to set mounted to true once the component has rendered on the client.
  // This is a common pattern to avoid hydration mismatches with Next.js themes.
  useEffect(() => setMounted(true), []);

  // Use useEffect to check for user authentication status and redirect to the dashboard if logged in.
  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  // Determine if the current theme is dark to apply appropriate styling.
  const isDark = resolvedTheme === "dark";

  // Render a fallback while the component is mounting, authentication is loading, or a user is already logged in.
  if (!mounted || loading || user) {
    return <div className="h-full min-h-screen bg-background" />;
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        // Apply a gradient background based on the current theme.
        background: isDark
          ? "linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e293b 100%)"
          : "linear-gradient(135deg, #f8fafc 0%, #f8fafc 50%, #f8fafc 100%)",
      }}
    >
      {/* Helmet component for managing document head for SEO. */}
      <Helmet>
        <title>Sign In Algolog</title>
        <meta
          name="description"
          content="Sign in to your DSA submissions account."
        />
        <link rel="canonical" href="/login" />
      </Helmet>

      {/* Main container for the login card. */}
      <div className="relative flex-grow flex items-center justify-center p-[125px]">
        {/* The login card with a grid layout for two panels. */}
        <div
          className={`w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
            isDark
              ? "bg-slate-800/60 border border-slate-700/50 backdrop-blur-lg"
              : "bg-card border"
          }`}
        >
          {/* Left Panel: Login form content. */}
          <div className="p-8 md:p-12">
            <div className="flex items-center space-x-3 mb-8">
              <h1 className="text-2xl font-bold text-foreground">Algolog</h1>
            </div>
            <h2 className="text-3xl font-bold mb-2 text-foreground">
              Your coding journey awaits
            </h2>
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

          {/* Right Panel: Animation container, visible on medium screens and up. */}
          <div className="hidden md:block bg-card border-l">
            <ConstellationAnimation />
          </div>
        </div>
      </div>

      {/* Footer component. */}
      <Footer />
    </div>
  );
}
