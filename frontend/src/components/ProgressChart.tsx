"use client";

import React, { useState, useEffect } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Props {
  data: { day: string; solved: number }[];
}

export function ProgressChart({ data }: Props) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={`hsl(var(--primary))`} stopOpacity={0.7} />
              <stop offset="95%" stopColor={`hsl(var(--primary))`} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="day" hide />
          <YAxis allowDecimals={false} width={28} />
          <Tooltip labelClassName="text-xs" contentStyle={{ borderRadius: 8 }} />
          <Area type="monotone" dataKey="solved" stroke={`hsl(var(--primary))`} fillOpacity={1} fill="url(#colorPrimary)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function ProgressChartContainer() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://raw.githubusercontent.com/Always-Amulya7/DSA-Code-Tracker/main/dashboard.json");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonData = await response.json();

        // Count daily submissions
        const dailyCounts = {};
        if (jsonData.problems && Array.isArray(jsonData.problems)) {
          jsonData.problems.forEach(problem => {
            if (problem.lastUpdated) {
              const date = new Date(problem.lastUpdated).toISOString().split('T')[0];
              dailyCounts[date] = (dailyCounts[date] || 0) + 1;
            }
          });
        }

        // Sort dates to ensure chronological order
        const sortedDates = Object.keys(dailyCounts).sort();

        // Build cumulative data
        let cumulativeSolved = 0;
        const cumulativeData = sortedDates.map(date => {
          cumulativeSolved += dailyCounts[date];
          return {
            day: date,
            solved: cumulativeSolved
          };
        });
        
        setChartData(cumulativeData);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading chart...</div>;
  }

  if (error) {
    return <div>Error loading chart data.</div>;
  }
  
  return <ProgressChart data={chartData} />;
}