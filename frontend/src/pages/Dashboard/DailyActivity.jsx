import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";

export function DailyActivity() {
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define levels and colors
  const levels = [0, 1, 3, 5, 8];
  const colors = [
    "bg-gray-300 dark:bg-gray-700",
    "bg-green-200 dark:bg-green-900",
    "bg-green-400 dark:bg-green-700",
    "bg-green-500 dark:bg-green-500",
    "bg-green-600 dark:bg-green-400",
  ];

  const getLevel = (count) => {
    for (let i = levels.length - 1; i >= 0; i--) {
      if (count >= levels[i]) return i;
    }
    return 0;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cacheBuster = new Date().getTime();
        const url = `https://raw.githubusercontent.com/Always-Amulya7/DSA-Code-Tracker/main/dashboard.json?_t=${cacheBuster}`;
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
  const weeks = [];
  let week = [];
  if (days.length > 0) {
    const startDay = new Date(days[0].date).getDay();
    for (let i = 0; i < startDay; i++)
      week.push({ date: `pad-${i}`, count: -1 });
    days.forEach((day) => {
      week.push(day);
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    });
    if (week.length) {
      while (week.length < 7)
        week.push({ date: `pad-${week.length}`, count: -1 });
      weeks.push(week);
    }
  }

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

  if (error)
    return (
      <Card className="rounded-2xl h-full card pb-3.5 dark:bg-slate-800/70">
        <CardHeader>
          <CardTitle className="text-base">Daily Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-red-500">
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
                      <div
                        key={di}
                        className="h-3 w-3 rounded-sm bg-transparent"
                      />
                    ) : (
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
            <div className="text-center py-12 text-muted-foreground">
              No activity to display.
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
}
