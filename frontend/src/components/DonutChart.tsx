import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface DonutChartProps {
  data: { name: string; value: number; color: string }[];
}

const isTouchDevice = () => {
  return (
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0)
  );
};

export function DonutChart({ data }: DonutChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const activeData =
    activeIndex !== null
      ? data[activeIndex]
      : { name: "Difficulty", value: total };
  const handleInteraction = (index: number) => {
    if (isMobile) {
      setActiveIndex(activeIndex === index ? null : index);
    } else {
      setActiveIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setActiveIndex(null);
    }
  };

  return (
    <div className="relative w-40 h-40">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="60%"
            outerRadius="80%"
            paddingAngle={3}
            onMouseLeave={handleMouseLeave}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                onMouseEnter={() => handleInteraction(index)}
                onClick={() => handleInteraction(index)}
                cursor="pointer"
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-sm font-semibold text-center">
          {activeData.name}
        </span>
        <span className="text-xs text-muted-foreground text-center">
          {activeData.name !== "Difficulty" && activeData.value}
        </span>
      </div>
    </div>
  );
}

export default function DifficultyChartContainer() {
  const [chartData, setChartData] = useState<
    { name: string; value: number; color: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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
        if (!response.ok) throw new Error("Network response was not ok");
        const jsonData = await response.json();
        const difficultyTotals = { Easy: 0, Medium: 0, Hard: 0 };
        if (jsonData.metadata && jsonData.metadata.breakdown) {
          Object.values(jsonData.metadata.breakdown).forEach((platform) => {
            const p = platform as {
              Easy?: number;
              Medium?: number;
              Hard?: number;
            };
            difficultyTotals.Easy += p.Easy || 0;
            difficultyTotals.Medium += p.Medium || 0;
            difficultyTotals.Hard += p.Hard || 0;
          });
        }
        const data = [
          { name: "Easy", value: difficultyTotals.Easy, color: "#16a34a" },
          { name: "Medium", value: difficultyTotals.Medium, color: "#f59e0b" },
          { name: "Hard", value: difficultyTotals.Hard, color: "#ef4444" },
        ].filter((d) => d.value > 0);
        setChartData(data);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  if (loading) return <div>Loading chart...</div>;
  if (error) return <div>Error loading data.</div>;
  return <DonutChart data={chartData} />;
}
