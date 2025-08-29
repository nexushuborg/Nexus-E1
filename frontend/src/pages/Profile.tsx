import { Helmet } from "react-helmet-async";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";

export default function Profile() {
  const { theme } = useTheme();
  const [repo, setRepo] = useState("");
  const [gemini, setGemini] = useState("");
  const [gmailLink, setGmailLink] = useState("");
  const [gfgLink, setGfgLink] = useState("");
  const [leetcodeLink, setLeetcodeLink] = useState("");
  const [linkedinLink, setLinkedinLink] = useState("");
  const [username, setUsername] = useState("username");
  const [name, setName] = useState("GitHub User");
  const [avatarUrl, setAvatarUrl] = useState("");
  const autoSaveRef = useRef(false);
  useEffect(() => {
    (async () => {
      const repoData: any = await fetchRepoConfig();
      let finalRepo = "";

      if (repoData && repoData.config) {
        finalRepo = `${repoData.config.owner}/${repoData.config.repo}`;
      } else {
        const stored = localStorage.getItem("github-repo") ?? "";
        const match = stored.match(/https:\/\/github\.com\/(.+)/);
        finalRepo = match ? match[1] : stored;
      }
      setRepo(finalRepo);
      setGemini(localStorage.getItem("gemini-key") ?? "");
      const userId = finalRepo.split("/")[0];
      setUsername(userId);
      if (userId) {
        try {
          const res = await fetch(`https://api.github.com/users/${userId}`);
          if (res.ok) {
            const data = await res.json();
            setName(data.name || userId);
            setAvatarUrl(data.avatar_url || "");
          } else {
            setName(userId);
            setAvatarUrl("");
          }
        } catch {
          setName(userId);
          setAvatarUrl("");
        }
      }
    })();

    const stored = localStorage.getItem("github-repo") ?? "";
    const match = stored.match(/https:\/\/github\.com\/(.+)/);
    setRepo(match ? match[1] : stored);
    setGemini(localStorage.getItem("gemini-key") ?? "");
    setGmailLink(localStorage.getItem("gmail-link") ?? "");
    setGfgLink(localStorage.getItem("gfg-link") ?? "");
    setLeetcodeLink(localStorage.getItem("leetcode-link") ?? "");
    setLinkedinLink(localStorage.getItem("linkedin-link") ?? "");
  }, []);

  const save = (showToast: boolean = true) => {
    if (!repo.trim()) {
      if (showToast) {
        toast({
          title: "Error",
          description: "GitHub Repository is required.",
        });
      }
      return;
    }
    localStorage.setItem("github-repo", `https://github.com/${repo}`);
    localStorage.setItem("gemini-key", gemini);
    localStorage.setItem("gmail-link", gmailLink);
    localStorage.setItem("gfg-link", gfgLink);
    localStorage.setItem("leetcode-link", leetcodeLink);
    localStorage.setItem("linkedin-link", linkedinLink);

    if (showToast) {
      toast({ title: "Saved", description: "Profile settings updated." });
    }
  };

  useEffect(() => {
    autoSaveRef.current = true;
    const initialTimeout = setTimeout(() => {
      save(false);
      const hourlyInterval = setInterval(() => save(false), 3600 * 1000);
      return () => clearInterval(hourlyInterval);
    }, 100);
    return () => clearTimeout(initialTimeout);
  }, [repo, gemini, gmailLink, gfgLink, leetcodeLink, linkedinLink]);

  const avatarFallback = name.charAt(0).toUpperCase() ?? "U";

  const EXT_ID = "gbbandjbhbpeconaajmannidinjimebk"; // Replace with actual ID

  function fetchRepoConfig() {
    return new Promise((resolve, reject) => {
      if (!chrome || !chrome.runtime) {
        console.warn("Chrome extension API not available in this context");
        resolve(null);
        return;
      }

      chrome.runtime.sendMessage(
        EXT_ID,
        { action: "getRepoConfig" },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
            reject(chrome.runtime.lastError);
          } else {
            resolve(response);
          }
        }
      );
    });
  }

  return (
    <div className="bg-gradient-main">
      <main className="container py-8">
        <Helmet>
          <title>Profile – DSA Tracker</title>
          <meta
            name="description"
            content="Manage your profile and integration settings."
          />
          <link rel="canonical" href="/profile" />
        </Helmet>
        <h1 className="text-3xl font-semibold mb-6 text-foreground">Profile</h1>
        <section className="rounded-xl border bg-card p-6 shadow-sm mb-6 flex items-center gap-4">
          <Avatar>
            <AvatarImage src={avatarUrl} alt="User avatar" />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-foreground">{name}</div>
            <div className="text-sm text-muted-foreground">{username}</div>
          </div>
        </section>
        <section className="rounded-xl border bg-card p-6 shadow-sm grid gap-4">
          <div>
            <label className="text-sm block mb-2 text-foreground">
              Connected GitHub Repository *
            </label>
            <Input
              className="form-input-profile"
              placeholder="username/repository"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              The repo link is fetched from the extension as{" "}
              <code>https://github.com/username/reponame</code>
            </p>
          </div>
          <div>
            <label className="text-sm block mb-2 text-foreground">
              API Key
            </label>
            <Input
              className="form-input-profile"
              placeholder="Paste your key"
              value={gemini}
              onChange={(e) => setGemini(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Used by the extension to generate summaries.
            </p>
          </div>
          <div className="border-t pt-4 mt-2">
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Social & Platform Links
            </h3>
            <div className="grid gap-4">
              <div>
                <label className="text-sm block mb-2 text-foreground">
                  Gmail Address
                </label>
                <Input
                  className="form-input-profile"
                  placeholder="username@gmail.com"
                  value={gmailLink}
                  onChange={(e) => setGmailLink(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm block mb-2 text-foreground">
                  GeeksforGeeks Profile
                </label>
                <Input
                  className="form-input-profile"
                  placeholder="https://auth.geeksforgeeks.org/user/username"
                  value={gfgLink}
                  onChange={(e) => setGfgLink(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm block mb-2 text-foreground">
                  LeetCode Profile
                </label>
                <Input
                  className="form-input-profile"
                  placeholder="https://leetcode.com/username"
                  value={leetcodeLink}
                  onChange={(e) => setLeetcodeLink(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm block mb-2 text-foreground">
                  LinkedIn Profile
                </label>
                <Input
                  className="form-input-profile"
                  placeholder="https://linkedin.com/in/username"
                  value={linkedinLink}
                  onChange={(e) => setLinkedinLink(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div>
            <button
              onClick={() => save(true)}
              className="glossy-button inline-flex items-center justify-center font-semibold py-1 px-2 rounded-lg bg-[#253fac] text-white hover:bg-[#3a52b4] hover:shadow-lg hover:shadow-[#253fac]/40"
            >
              Save Settings
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
