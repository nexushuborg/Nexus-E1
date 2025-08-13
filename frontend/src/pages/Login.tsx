import { Helmet } from "react-helmet-async";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const { signInWithGitHub } = useAuth();
  return (
    <main className="container min-h-[70vh] grid place-items-center">
      <Helmet>
        <title>Sign In – DSA Tracker</title>
        <meta name="description" content="Sign in with GitHub to sync your DSA submissions." />
        <link rel="canonical" href="/login" />
      </Helmet>
      <section className="max-w-md w-full text-center animate-enter">
        <div className="rounded-2xl border bg-card p-10 shadow-sm">
          <div className="text-3xl font-bold mb-2">DSA Tracker</div>
          <p className="text-muted-foreground mb-8">Sign in to continue</p>
          <Button onClick={signInWithGitHub} size="lg" className="w-full" variant="hero" aria-label="Sign in with GitHub">
            <Github className="h-5 w-5" /> Sign In with GitHub
          </Button>
        </div>
      </section>
    </main>
  );
}
