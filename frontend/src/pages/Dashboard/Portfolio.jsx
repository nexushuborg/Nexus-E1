/* The above code is a React functional component named `Portfolio`. It fetches data from a GitHub
repository and the GitHub API, then displays the fetched data in a card format. Here is a breakdown
of what the code is doing: */
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { BadgeCheck } from "lucide-react";
import {
  SiGmail,
  SiGeeksforgeeks,
  SiLeetcode,
  SiLinkedin,
} from "react-icons/si";

// Portfolio component that displays user profile information and coding stats.
export default function Portfolio() {
  const [dashboardData, setDashboardData] = useState(null);
  const [githubData, setGithubData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tags, setTags] = useState([]);
  const [links, setLinks] = useState({
    gmail: "",
    gfg: "",
    leetcode: "",
    linkedin: "",
  });

  // Fetch data from GitHub repository and GitHub API on component mount.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const repoUrl = localStorage.getItem("github-repo") || "";
        if (!repoUrl) throw new Error("GitHub repo not set in localStorage");
        const match = repoUrl.match(/https:\/\/github\.com\/([^/]+)\/([^/]+)/);
        if (!match) throw new Error("Invalid GitHub repo URL");
        const username = match[1];
        const reponame = match[2];

        // Set up links from local storage.
        setLinks({
          gmail: localStorage.getItem("gmail-link") || "",
          gfg: localStorage.getItem("gfg-link") || "",
          leetcode: localStorage.getItem("leetcode-link") || "",
          linkedin: localStorage.getItem("linkedin-link") || "",
        });

        // Fetch data from both the user's dashboard.json file and the GitHub API in parallel.
        const [dashboardResponse, githubResponse] = await Promise.all([
          fetch(`https://raw.githubusercontent.com/${username}/${reponame}/main/dashboard.json`),
          fetch(`https://api.github.com/users/${username}`),
        ]);

        if (!dashboardResponse.ok || !githubResponse.ok)
          throw new Error("Network response was not ok");

        const dashboardJson = await dashboardResponse.json();
        const githubJson = await githubResponse.json();
        setDashboardData(dashboardJson);
        setGithubData(githubJson);

        // Extract unique languages from solved problems to create tags.
        const uniqueLanguages = new Set(
          dashboardJson.problems.map((p) => p.language)
        );
        const dynamicTags = Array.from(uniqueLanguages).map(
          (lang) => `#${lang.toUpperCase()}`
        );
        setTags(dynamicTags);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Show a loading message while data is being fetched.
  if (loading) {
    return (
      <Card className="rounded-3xl dark:bg-slate-800/45 text-foreground max-h-[80vh]">
        <CardContent className="flex flex-col items-center justify-center p-4 h-full">
          <p>Loading...</p>
        </CardContent>
      </Card>
    );
  }

  // Show an error message if data fetching fails.
  if (error) {
    return (
      <Card className="rounded-3xl dark:bg-slate-800/45 text-foreground max-h-[80vh]">
        <CardContent className="flex flex-col items-center justify-center p-4 h-full">
          <p>Error fetching data.</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate the total number of problems solved from the fetched data.
  const totalSolved = Object.values(
    dashboardData?.metadata?.breakdown || {}
  ).reduce((sum, platform) => sum + (platform.total || 0), 0);

  // Calculate the number of active days since the last update.
  const calculateActiveDays = () => {
    if (!dashboardData?.metadata?.lastUpdated) return 0;
    const lastUpdatedDate = new Date(dashboardData.metadata.lastUpdated);
    const currentDate = new Date();
    if (lastUpdatedDate.toDateString() === currentDate.toDateString()) return 1;
    const differenceInTime = currentDate.getTime() - lastUpdatedDate.getTime();
    return Math.floor(differenceInTime / (1000 * 3600 * 24)) + 1;
  };
  const activeDays = calculateActiveDays();

  // Use GitHub data for profile information with fallbacks.
  const profileName = githubData?.name || githubData?.login || "Nexus Hub";
  const profileImage =
    githubData?.avatar_url ||
    "https://cdn-icons-png.flaticon.com/512/2815/2815428.png";
  const githubUsername = githubData?.login || "@NexusHub";

  return (
    <Card className="rounded-3xl dark:bg-slate-800/45 text-foreground max-h-[80vh]">
      <CardContent className="flex flex-col items-center text-center p-4 overflow-y-auto h-full">
        {/* Profile picture with a primary color border. */}
        <div className="relative">
          <img
            src={profileImage}
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-primary object-cover"
          />
        </div>
        {/* User name and verified badge. */}
        <h2 className="mt-4 text-xl font-extrabold flex items-center gap-2">
          {profileName}
          <BadgeCheck className="text-primary h-5 w-5" />
        </h2>
        <p className="text-muted-foreground text-sm">@{githubUsername}</p>

        {/* Solved questions and active days stats. */}
        <div className="grid grid-cols-2 gap-4 mt-6 w-full">
          <div className="p-3 rounded-xl flex flex-col items-center justify-center bg-secondary">
            <p className="text-2xl font-bold text-success">{totalSolved}</p>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              Questions Solved
            </p>
          </div>
          <div className="p-3 rounded-xl flex flex-col items-center justify-center bg-secondary">
            <p className="text-2xl font-bold text-primary">{activeDays}</p>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              Active Days
            </p>
          </div>
        </div>

        {/* Links to other platforms. */}
        <p className="mt-6 text-sm text-muted-foreground">
          You can find me on...
        </p>
        <div className="mt-2 w-full overflow-x-auto">
          <div className="flex gap-4 flex-nowrap justify-center">
            {links.gmail && (
              <a
                href={`mailto:${links.gmail}`}
                target="_blank"
                rel="noreferrer"
              >
                <SiGmail
                  className="text-success cursor-pointer"
                  title="Gmail"
                />
              </a>
            )}
            {links.gfg && (
              <a href={links.gfg} target="_blank" rel="noreferrer">
                <SiGeeksforgeeks
                  className="text-success cursor-pointer"
                  title="GeeksforGeeks"
                />
              </a>
            )}
            {links.leetcode && (
              <a href={links.leetcode} target="_blank" rel="noreferrer">
                <SiLeetcode
                  className="text-warning cursor-pointer"
                  title="LeetCode"
                />
              </a>
            )}
            {links.linkedin && (
              <a href={links.linkedin} target="_blank" rel="noreferrer">
                <SiLinkedin
                  className="text-success cursor-pointer"
                  title="LinkedIn"
                />
              </a>
            )}
          </div>
        </div>

        {/* Dynamic tags based on languages used. */}
        <div className="mt-6 w-full flex flex-wrap justify-center gap-2 select-none">
          {tags.length > 0 ? (
            tags.map((tag, i) => (
              <span
                key={i}
                className="bg-secondary text-muted-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-md"
              >
                {tag}
              </span>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">
              No tags available.
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
