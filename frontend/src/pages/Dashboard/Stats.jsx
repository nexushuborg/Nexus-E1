/**
 * The `Stats` function fetches data from a GitHub repository, displays the total number of solved
 * problems and a donut chart showing the breakdown of problem difficulties.
 * @returns The `Stats` component is being returned. It contains conditional rendering based on the
 * `loading` state. If `loading` is true, it displays a loading message inside a Card component. Once
 * the data is fetched and `loading` becomes false, it displays the total problems solved and a
 * DonutChart component with difficulty data inside two separate Card components.
 */
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Check } from "lucide-react";
import DonutChart from "../../components/DonutChart";

// Stats component to display key performance indicators and a difficulty breakdown.
export function Stats() {
  const [totalSolved, setTotalSolved] = useState(0);
  const [difficultyData, setDifficultyData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from the user's GitHub dashboard.json file.
  useEffect(() => {
    const fetchData = async () => {
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
          throw new Error("Network response was not ok");
        }
        const jsonData = await response.json();
        setTotalSolved(jsonData.metadata.totalProblems);

        // Aggregate problem counts by difficulty (Easy, Medium, Hard).
        const totals = { Easy: 0, Medium: 0, Hard: 0 };
        if (jsonData.metadata.breakdown) {
          Object.values(jsonData.metadata.breakdown).forEach((platform) => {
            totals.Easy += platform.Easy || 0;
            totals.Medium += platform.Medium || 0;
            totals.Hard += platform.Hard || 0;
          });
        }

        // Prepare data for the donut chart.
        const chartData = [
          { name: "Easy", value: totals.Easy, color: "#22c55e" },
          { name: "Medium", value: totals.Medium, color: "#eab308" },
          { name: "Hard", value: totals.Hard, color: "#ef4444" },
        ].filter((d) => d.value > 0);
        setDifficultyData(chartData);
      } catch (e) {
        console.error("Error fetching data:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Display a loading message while data is being fetched.
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-6">
        <Card className="rounded-2xl card dark:bg-slate-800/45">
          <CardContent className="flex flex-col items-center justify-center h-full p-6">
            <p>Loading stats...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Card displaying the total number of problems solved. */}
      <Card className="rounded-2xl card dark:bg-slate-800/45">
        <CardContent className="flex flex-col items-center justify-center h-full p-6">
          <div className="bg-green-500 rounded-full p-2">
            <Check className="h-6 w-6 text-white" />
          </div>
          <div className="text-center mt-2">
            <p className="text-1xl text-muted-foreground">Total Solved</p>
            <p className="text-2xl font-bold">
              {totalSolved}
              <span className="text-lg font-normal text-muted-foreground ml-1">
                /5500
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
      {/* Card displaying the donut chart with difficulty breakdown. */}
      <Card className="rounded-2xl card dark:bg-slate-800/45">
        <CardContent className="flex flex-col items-center justify-center h-full p-1">
          <DonutChart data={difficultyData} />
        </CardContent>
      </Card>
    </div>
  );
}
