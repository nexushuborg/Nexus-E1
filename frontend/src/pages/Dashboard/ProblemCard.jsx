/* This code snippet defines a React component called `ProblemCard` that represents a card displaying
information about a programming problem. Here's a breakdown of what the code is doing: */
import React from "react";
import { Badge } from "../../components/ui/badge";
import { format, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";

// Mapping of tag categories to Tailwind CSS classes for styling.
const tagCategories = {
  "Array|String|Hash Table|Hash Set|Vector|List|Tree|DSA|DP|Binary Tree|Graph|BST|AVL|Red Black Tree|B Tree|Stack|Queue|Linked List|Deque|Priority Queue|Circular Queue|Heap|Trie|Union Find|Disjoint Set|Segment Tree|Fenwick Tree|Dynamic Programming|Greedy|Backtracking|Memoization|Tabulation|Binary Search|Sorting|Topological Sort|Quick Sort|Merge Sort|Heap Sort|DFS|BFS|Dijkstra|Floyd Warshall|Bellman Ford|Kruskal|Prim|Recursion|Divide and Conquer|Branch and Bound|Two Pointers|Sliding Window|Fast and Slow Pointers|Bit Manipulation|Prefix Sum|Suffix Sum|Difference Array|Monotonic Stack|Monotonic Queue|Kadane|KMP|Rabin Karp|Math|Geometry|Number Theory|Combinatorics|Probability|Design|Simulation|System Design|OOP|Design Patterns|Game Theory|Minimax|Alpha Beta Pruning|Machine Learning|AI|Neural Networks|Deep Learning|ML|Architecture|Microservices|Distributed Systems|Database|SQL|NoSQL|MongoDB|PostgreSQL|MySQL|Redis|Web Development|Frontend|Backend|API|REST|GraphQL|Mobile Development|iOS|Android|React Native|Flutter|DevOps|Docker|Kubernetes|CI/CD|AWS|Azure|GCP|Cybersecurity|Cryptography|Encryption|Hashing|Security|Algorithm|Data Structure|DS|Algo|Pattern|Technique|Method|Approach":
    "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30",
  "Easy|Beginner|Basic":
    "bg-emerald-50 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-400 border border-emerald-400 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900",
  "Medium|Intermediate|Moderate":
    "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-400 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-950",
  "Hard|Advanced|Expert":
    "bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border border-rose-400 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-950",
};

// Mapping of problem source platforms to their text colors.
const sourceColors = {
  Leetcode: "text-blue-500",
  Codechef: "text-red-500",
  Gfg: "text-green-500",
  Hackerrank: "text-teal-500",
};

// Function to get the appropriate CSS class for a tag based on its category.
const getTagClass = (tag) => {
  for (const key in tagCategories) {
    const pattern = key.split("|");
    if (pattern.includes(tag)) return tagCategories[key];
  }
  // Default class if no category matches.
  return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800";
};

// ProblemCard component displays information about a single problem.
export function ProblemCard({ problem }) {
  const navigate = useNavigate();
  // Handle navigation to the specific submission details page.
  const handleRedirect = () => navigate(`/submissions/${problem.id}`);

  return (
    <div
      className="
        flex flex-col gap-3 
        sm:flex-row sm:items-center sm:justify-between
        px-4 py-3 border border-gray-300 dark:border-gray-700 
        rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 
        transition cursor-pointer dark:bg-slate-800/45
      "
      onClick={handleRedirect}
    >
      {/* Problem title and platform. */}
      <div className="flex flex-col flex-1 min-w-[150px]">
        <div className="flex items-center justify-between sm:justify-start">
          <span className="font-medium text-sm text-foreground">
            {problem.problemName}
          </span>
          {/* Difficulty badge for mobile view. */}
          <div className="sm:hidden">
            <Badge
              className={`${getTagClass(
                problem.difficulty
              )} rounded-md px-2 font-semibold cursor-default`}
            >
              {problem.difficulty}
            </Badge>
          </div>
        </div>
        <span
          className={`text-xs font-semibold ${
            sourceColors[problem.platform] || ""
          }`}
        >
          {problem.platform}
        </span>
      </div>

      {/* Difficulty badge for desktop view. */}
      <div className="hidden sm:flex sm:flex-1 justify-center">
        <Badge
          className={`${getTagClass(
            problem.difficulty
          )} rounded-md px-2 font-semibold cursor-default`}
        >
          {problem.difficulty}
        </Badge>
      </div>

      {/* Last updated date. */}
      <div className="sm:flex-1 text-xs text-muted-foreground text-left sm:text-center">
        <div>{format(parseISO(problem.lastUpdated), "MMM d, yyyy")}</div>
      </div>

      {/* Tags for the problem. */}
      <div className="sm:flex-1 flex gap-1 justify-start sm:justify-end flex-wrap">
        {(problem.tags || []).map((tag) => (
          <Badge
            key={tag}
            className={`${getTagClass(
              tag
            )} rounded-md text-[0.65rem] cursor-default`}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}
