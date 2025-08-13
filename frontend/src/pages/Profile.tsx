import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

export default function Profile() {
  const { user } = useAuth();
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

  return (
    <main className="container py-8">
      <Helmet>
        <title>Profile – DSA Tracker</title>
        <meta name="description" content="Manage your profile and integration settings." />
        <link rel="canonical" href="/profile" />
      </Helmet>

      <h1 className="text-3xl font-semibold mb-6">Profile</h1>

      <section className="rounded-xl border bg-card p-6 shadow-sm mb-6 flex items-center gap-4">
        <Avatar>
          <AvatarImage src={user?.user_metadata?.avatar_url} alt="GitHub avatar" />
          <AvatarFallback>GH</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-semibold">{user?.user_metadata?.name ?? 'GitHub User'}</div>
          <div className="text-sm text-muted-foreground">{user?.user_metadata?.user_name ?? 'username'}</div>
        </div>
      </section>

      <section className="rounded-xl border bg-card p-6 shadow-sm grid gap-4">
        <div>
          <label className="text-sm block mb-2">Connected GitHub Repository</label>
          <Input placeholder="username/repository" value={repo} onChange={(e) => setRepo(e.target.value)} />
          <p className="text-xs text-muted-foreground mt-1">The extension will commit files to this repo.</p>
        </div>
        <div>
          <label className="text-sm block mb-2">Gemini API Key</label>
          <Input placeholder="Paste your key" value={gemini} onChange={(e) => setGemini(e.target.value)} />
          <p className="text-xs text-muted-foreground mt-1">Used by the extension to generate summaries.</p>
        </div>
        <div>
          <Button variant="hero" onClick={save}>Save Settings</Button>
        </div>
      </section>
    </main>
  );
}
