/* This code snippet is a React component named `ProblemList`. Here's a breakdown of what it does: */
import React, { useState, useEffect, useMemo } from "react";
import { ProblemCard } from "./ProblemCard";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";

// Component to display a list of recently solved problems.
export function ProblemList() {
  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Fetch the list of problems from the user's GitHub dashboard.json file.
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

        // Hardcoded tags for demonstration purposes.
        const hardcodedTags = [
          ["Array", "Binary Search"],
          ["String", "DP"],
          ["Math", "Hash Table"],
          ["Array", "Stack", "Greedy"],
          ["List", "Tree", "Red Black Tree"],
        ];

        // Map over fetched problems to add the hardcoded tags.
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

  // Filter and sort problems to get the 5 most recent ones that match the search query.
  const latestProblems = useMemo(() => {
    const sorted = [...problems].sort(
      (a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)
    );
    const filtered = sorted.filter((problem) =>
      problem.problemName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return filtered.slice(0, 5);
  }, [problems, searchQuery]);

  // Navigate to the full submissions page when "View All" is clicked.
  const handleViewAllClick = () => {
    navigate("/submissions");
  };

  // Display a loading message while data is being fetched.
  if (isLoading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Loading problems...
      </div>
    );
  }

  // Display an error message if data fetching fails.
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

      {/* Render the list of problem cards or a "no problems" message. */}
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

      {/* "View All" button to navigate to the full list of submissions. */}
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
