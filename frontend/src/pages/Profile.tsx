import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function Profile() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [repo, setRepo] = useState("");
  const [gemini, setGemini] = useState("");

  useEffect(() => {
    setRepo(localStorage.getItem("github-repo") ?? "");
    setGemini(localStorage.getItem("gemini-key") ?? "");
  }, []);

  const save = () => {
    localStorage.setItem("github-repo", repo);
    localStorage.setItem("gemini-key", gemini);
    toast({ title: "Saved", description: "Profile settings updated." });
  };

  const avatarFallback = user?.name ? user.name.charAt(0).toUpperCase() : "U";
  const avatarUrl = user?.name ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random` : "";


  return (
    <main className="container py-8">
      <Helmet>
        <title>Profile – DSA Tracker</title>
        <meta name="description" content="Manage your profile and integration settings." />
        <link rel="canonical" href="/profile" />
      </Helmet>

      {/* *** THE FIX *** Added text-foreground */}
      <h1 className="text-3xl font-semibold mb-6 text-foreground">Profile</h1>

      <section className="rounded-xl border bg-card p-6 shadow-sm mb-6 flex items-center gap-4">
        <Avatar>
          <AvatarImage src={avatarUrl} alt="User avatar" />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <div>
          {/* *** THE FIX *** Added text-foreground */}
          <div className="font-semibold text-foreground">{user?.name ?? 'GitHub User'}</div>
          <div className="text-sm text-muted-foreground">{user?.username ?? 'username'}</div>
        </div>
      </section>

      <section className="rounded-xl border bg-card p-6 shadow-sm grid gap-4">
        <div>
          {/* *** THE FIX *** Added text-foreground */}
          <label className="text-sm block mb-2 text-foreground">Connected GitHub Repository</label>
          <Input className="form-input-profile" placeholder="username/repository" value={repo} onChange={(e) => setRepo(e.target.value)} />
          <p className="text-xs text-muted-foreground mt-1">The extension will commit files to this repo.</p>
        </div>
        <div>
          {/* *** THE FIX *** Added text-foreground */}
          <label className="text-sm block mb-2 text-foreground">API Key</label>
          <Input className="form-input-profile" placeholder="Paste your key" value={gemini} onChange={(e) => setGemini(e.target.value)} />
          <p className="text-xs text-muted-foreground mt-1">Used by the extension to generate summaries.</p>
        </div>
        <div>
          <button
            onClick={save}
            className="glossy-button inline-flex items-center justify-center font-semibold py-1 px-2 rounded-lg bg-[#F000FF] text-white hover:bg-[#c100cc] hover:shadow-lg hover:shadow-[#F000FF]/40"
          >
            Save Settings
          </button>
        </div>
      </section>
    </main>
  );
}
