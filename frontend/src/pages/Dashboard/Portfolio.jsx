import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { BadgeCheck } from "lucide-react";
import {
  SiGmail,
  SiGeeksforgeeks,
  SiLeetcode,
  SiLinkedin,
} from "react-icons/si";

export default function Portfolio() {
  const [dashboardData, setDashboardData] = useState(null);
  const [githubData, setGithubData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tags, setTags] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardResponse, githubResponse] = await Promise.all([
          fetch(
            "https://raw.githubusercontent.com/Always-Amulya7/DSA-Code-Tracker/main/dashboard.json"
          ),
          fetch("https://api.github.com/users/nexushuborg"),
        ]);
        if (!dashboardResponse.ok || !githubResponse.ok) {
          throw new Error("Network response was not ok");
        }
        const dashboardJson = await dashboardResponse.json();
        const githubJson = await githubResponse.json();
        setDashboardData(dashboardJson);
        setGithubData(githubJson);
        const uniqueLanguages = new Set(
          dashboardJson.problems.map((p) => p.language)
        );
        const dynamicTags = Array.from(uniqueLanguages).map(
          (lang) => `#${lang.toUpperCase()}`
        );
        setTags(dynamicTags);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  if (loading) {
    return (
      <Card className="rounded-3xl dark:bg-slate-800/45 text-foreground max-h-[80vh]">
        <CardContent className="flex flex-col items-center justify-center p-4 h-full">
          <p>Loading...</p>
        </CardContent>
      </Card>
    );
  }
  if (error) {
    return (
      <Card className="rounded-3xl dark:bg-slate-800/45 text-foreground max-h-[80vh]">
        <CardContent className="flex flex-col items-center justify-center p-4 h-full">
          <p>Error fetching data.</p>
        </CardContent>
      </Card>
    );
  }
  const getProblemCountForPlatform = (platform) => {
    return dashboardData?.metadata?.breakdown?.[platform]?.total || 0;
  };
  const totalSolved = Object.values(
    dashboardData?.metadata?.breakdown || {}
  ).reduce((sum, platform) => sum + platform.total, 0);
  const calculateActiveDays = () => {
    if (
      !dashboardData ||
      !dashboardData.metadata ||
      !dashboardData.metadata.lastUpdated
    ) {
      return 0;
    }
    const lastUpdatedDate = new Date(dashboardData.metadata.lastUpdated);
    const currentDate = new Date();
    if (lastUpdatedDate.toDateString() === currentDate.toDateString()) {
      return 1;
    }
    const differenceInTime = currentDate.getTime() - lastUpdatedDate.getTime();
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays + 1;
  };
  const activeDays = calculateActiveDays();
  const profileName = githubData?.name || githubData?.login || "Nexus Hub";
  const profileImage =
    githubData?.avatar_url ||
    "https://cdn-icons-png.flaticon.com/512/2815/2815428.png";
  const githubUsername = githubData?.login || "@NexusHub";
  return (
    <Card className="rounded-3xl dark:bg-slate-800/45 text-foreground max-h-[80vh]">
      <CardContent className="flex flex-col items-center text-center p-4 overflow-y-auto h-full">
        <div className="relative">
          <img
            src={profileImage}
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-primary object-cover"
          />
        </div>
        <h2 className="mt-4 text-xl font-extrabold flex items-center gap-2">
          {profileName}
          <BadgeCheck className="text-primary h-5 w-5" />
        </h2>
        <p className="text-muted-foreground text-sm">@{githubUsername}</p>
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
        <p className="mt-6 text-sm text-muted-foreground">
          You can find me on...
        </p>
        <div className="mt-2 w-full overflow-x-auto">
          <div className="flex gap-4 flex-nowrap justify-center">
            <SiGmail className="text-success cursor-pointer" title="Gmail" />
            <SiGeeksforgeeks
              className={`${
                getProblemCountForPlatform("Gfg") > 0
                  ? "text-success"
                  : "text-muted-foreground"
              } cursor-pointer`}
              title="GeeksforGeeks"
            />
            <SiLeetcode
              className={`${
                getProblemCountForPlatform("Leetcode") > 0
                  ? "text-warning"
                  : "text-muted-foreground"
              } cursor-pointer`}
              title="LeetCode"
            />
            <SiLinkedin
              className="text-success cursor-pointer"
              title="LinkedIn"
            />
          </div>
        </div>
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
