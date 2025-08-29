import React, { useState, useEffect, useMemo } from "react";
import { ProblemCard } from "./ProblemCard";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";

export function ProblemList() {
  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const repoUrl = localStorage.getItem("github-repo") || "";
        if (!repoUrl) throw new Error("GitHub repo not set in localStorage");
        const match = repoUrl.match(/https:\/\/github\.com\/([^/]+)\/([^/]+)/);
        if (!match) throw new Error("Invalid GitHub repo URL");
        const username = match[1];
        const reponame = match[2];
        const response = await fetch(
          `https://raw.githubusercontent.com/${username}/${reponame}/main/dashboard.json`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const hardcodedTags = [
          ["Array", "Binary Search"],
          ["String", "DP"],
          ["Math", "Hash Table"],
          ["Array", "Stack", "Greedy"],
          ["List", "Tree", "Red Black Tree"],
        ];

        const updatedProblems = data.problems.map((problem, index) => ({
          ...problem,
          tags: hardcodedTags[index] || ["DSA"], // fallback
        }));

        setProblems(updatedProblems);
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProblems();
  }, []);

  const latestProblems = useMemo(() => {
    const sorted = [...problems].sort(
      (a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)
    );
    const filtered = sorted.filter((problem) =>
      problem.problemName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return filtered.slice(0, 5);
  }, [problems, searchQuery]);

  const handleViewAllClick = () => {
    navigate("/submissions");
  };

  if (isLoading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Loading problems...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-foreground">
        Error fetching data: {error}
      </div>
    );
  }

  return (
    <div className="pb-1">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-0">
        <h2 className="text-lg sm:text-xl font-bold text-foreground pl-1">
          Recent Activity
        </h2>
      </div>
      {latestProblems.length > 0 ? (
        <div className="space-y-3">
          {latestProblems.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          No problems match your current filters.
        </div>
      )}
      <div className="flex justify-center mt-6">
        <Button
          onClick={handleViewAllClick}
          variant="outline"
          className="rounded-full text-foreground px-6"
        >
          View All
        </Button>
      </div>
    </div>
  );
}
