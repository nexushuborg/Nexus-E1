import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Github } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import ConstellationAnimation from "@/components/ui/ConstellationAnimation";

const Footer = () => (
  <footer className="w-full text-center p-4 text-gray-500 text-sm">
    © 2025 Nexus-Hub. All Rights Reserved.
  </footer>
);

export default function Login() {
  const { signInWithEmail, signInWithGitHub } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      signInWithEmail(email);
    } else {
      console.error("Please enter an email address.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0D1117] overflow-hidden">
      <Helmet>
        <title>Sign In – Nexus-E1</title>
        <meta name="description" content="Sign in to your Nexus-E1 account." />
        <link rel="canonical" href="/login" />
      </Helmet>

      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <div
          className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[#7c1779] rounded-full opacity-20"
          style={{ filter: 'blur(150px)' }}>
        </div>
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-[#F000FF] rounded-full opacity-20"
          style={{ filter: 'blur(150px)' }}>
        </div>
      </div>

      <main className="flex-grow flex items-center justify-center p-4 relative z-10">
        <div
          className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl shadow-black/50"
          style={{
            backgroundColor: 'rgba(22, 27, 34, 0.65)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="p-8 md:p-12">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M30 15 L30 85 L70 85 M30 50 L60 50 M30 15 L70 15" stroke="#EAEAEA" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M30 50 L60 50" stroke="#F000FF" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-[#EAEAEA]">Nexus-E1</h1>
            </div>

            <h2 className="text-3xl font-bold mb-2">Sign in to your account</h2>
            <p className="text-gray-400 mb-8">
              Or <a href="#" className="text-[#F000FF] hover:underline">create a new account</a>
            </p>

            <form className="space-y-6" onSubmit={handleFormSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email address</label>
                <input
                  type="email" id="email" name="email"
                  placeholder="you@example.com"
                  className="form-input w-full px-4 py-3 rounded-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                <input
                  type="password" id="password" name="password"
                  placeholder="••••••••"
                  className="form-input w-full px-4 py-3 rounded-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded border-gray-500 text-[#F000FF] focus:ring-[#F000FF]/50" style={{ backgroundColor: '#30363d' }} />
                  <label htmlFor="remember-me" className="ml-2 block text-gray-300">Remember me</label>
                </div>
                <a href="#" className="font-medium text-[#F000FF] hover:underline">Forgot your password?</a>
              </div>

              <div>
                <button
                  type="submit"
                  className="glossy-button w-full font-semibold py-3 px-4 rounded-lg bg-[#F000FF] text-white hover:bg-[#c100cc] hover:shadow-lg hover:shadow-[#F000FF]/40"
                >
                  Sign In
                </button>
              </div>
            </form>

            <div className="mt-8 relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-600/50"></div></div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2" style={{ backgroundColor: 'rgba(22, 27, 34, 0.65)' }}>Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button onClick={signInWithGitHub} className="w-full flex items-center justify-center py-3 px-4 rounded-lg border border-gray-600/50 text-gray-300 transition-all duration-300 hover:border-[#F000FF] hover:text-[#F000FF]">
                <Github className="w-5 h-5 mr-2" />
                Sign In with GitHub
              </button>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center p-0 overflow-hidden">
            <ConstellationAnimation />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
