/* This code defines a React functional component called `DailyActivity`. Here's a breakdown of what
the code does: */
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";

// Component to display a daily activity calendar similar to GitHub's contribution graph.
export function DailyActivity() {
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define the number of contributions required for each color level.
  const levels = [0, 1, 3, 5, 8];
  // Define the colors for each contribution level.
  const colors = [
    "bg-gray-300 dark:bg-gray-700",
    "bg-green-200 dark:bg-green-900",
    "bg-green-400 dark:bg-green-700",
    "bg-green-500 dark:bg-green-500",
    "bg-green-600 dark:bg-green-400",
  ];

  // Function to determine the color level based on the number of contributions.
  const getLevel = (count) => {
    for (let i = levels.length - 1; i >= 0; i--) {
      if (count >= levels[i]) return i;
    }
    return 0;
  };

  // Fetch daily activity data from a GitHub dashboard.json file.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const repoUrl = localStorage.getItem("github-repo") || "";
        if (!repoUrl) throw new Error("GitHub repo not set in localStorage");
        const match = repoUrl.match(/https:\/\/github\.com\/([^/]+)\/([^/]+)/);
        if (!match) throw new Error("Invalid GitHub repo URL");
        const username = match[1];
        const reponame = match[2];
        const cacheBuster = new Date().getTime();
        const url = `https://raw.githubusercontent.com/${username}/${reponame}/main/dashboard.json?_t=${cacheBuster}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");
        const jsonData = await response.json();
        const submissionsByDay = {};
        if (jsonData?.problems?.length > 0) {
          jsonData.problems.forEach((problem) => {
            if (problem?.lastUpdated) {
              const date = problem.lastUpdated.split("T")[0];
              submissionsByDay[date] = (submissionsByDay[date] || 0) + 1;
            }
          });
        }
        // Generate a data structure for the last 235 days.
        const totalDays = 235;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const start = new Date(today);
        start.setDate(today.getDate() - (totalDays - 1));
        const generatedDays = [];
        for (let i = 0; i < totalDays; i++) {
          const d = new Date(start);
          d.setDate(start.getDate() + i);
          const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
            2,
            "0"
          )}-${String(d.getDate()).padStart(2, "0")}`;
          generatedDays.push({ date: iso, count: submissionsByDay[iso] || 0 });
        }
        setDays(generatedDays);
      } catch (e) {
        console.error("Error fetching data:", e);
        setError(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Organize the daily data into an array of weeks for display.
  const weeks = [];
  let week = [];
  if (days.length > 0) {
    // Add padding at the start of the first week if the first day is not Sunday.
    const startDay = new Date(days[0].date).getDay();
    for (let i = 0; i < startDay; i++)
      week.push({ date: `pad-${i}`, count: -1 });
    // Push days into weeks, creating a new week every 7 days.
    days.forEach((day) => {
      week.push(day);
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    });
    // Add padding to the last week if it's not full.
    if (week.length) {
      while (week.length < 7)
        week.push({ date: `pad-${week.length}`, count: -1 });
      weeks.push(week);
    }
  }

  // Show a loading skeleton while data is being fetched.
  if (loading)
    return (
      <Card className="rounded-2xl h-full card pb-3.5 dark:bg-slate-800/70">
        <CardHeader>
          <CardTitle className="text-base">Daily Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-1 w-full">
            {Array.from({ length: 53 }).map((_, wi) => (
              <div key={wi} className="grid grid-rows-7 gap-1">
                {Array.from({ length: 7 }).map((_, di) => (
                  <Skeleton key={di} className="h-3 w-3 rounded-sm" />
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );

  // Show an error message if data fetching fails.
  if (error)
    return (
      <Card className="rounded-2xl h-full card pb-3.5 dark:bg-slate-800/70">
        <CardHeader>
          <CardTitle className="text-base">Daily Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-foreground">
            Error fetching data. Check your console for details.
          </div>
        </CardContent>
      </Card>
    );

  return (
    <Card className="rounded-2xl h-full card pb-3.5 dark:bg-slate-800/70">
      <CardHeader>
        <CardTitle className="text-base">Daily Activity</CardTitle>
      </CardHeader>
      <div className="mr-5 ml-5">
        <CardContent className="relative -left-2.5 overflow-x-auto">
          {days.length > 0 ? (
            <div className="flex gap-1">
              {weeks.map((w, wi) => (
                <div key={wi} className="grid grid-rows-7 gap-1">
                  {w.map((day, di) =>
                    day.count < 0 ? (
                      // Render an empty, transparent div for padding days.
                      <div
                        key={di}
                        className="h-3 w-3 rounded-sm bg-transparent"
                      />
                    ) : (
                      // Render a colored square based on contribution count.
                      <div
                        key={di}
                        title={`${day.count} contributions on ${new Date(
                          day.date
                        ).toLocaleDateString()}`}
                        className={`h-3 w-3 rounded-sm ${
                          colors[getLevel(day.count)]
                        }`}
                      />
                    )
                  )}
                </div>
              ))}
            </div>
          ) : (
            // Show a message if there is no activity data.
            <div className="text-center py-12 text-muted-foreground">
              No activity to display.
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
}
