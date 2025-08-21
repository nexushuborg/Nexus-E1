import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";

export function WeeklyActivity() {
  const [days, setDays] = useState([]);

  useEffect(() => {
    const totalDays = 220;
    const extraBlanks = 100;
    const end = new Date();
    end.setHours(0, 0, 0, 0);
    const start = new Date(end);
    start.setDate(end.getDate() - (totalDays - 1));

    const generated = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      generated.push({
        date: d.toISOString().slice(0, 10),
        count: Math.floor(Math.random() * 5),
      });
    }

    for (let i = 0; i < extraBlanks; i++) {
      generated.push({ date: `blank-${i}`, count: -1 });
    }

    setDays(generated);
  }, []);

  const weeks = [];
  let week = [];

  if (days.length > 0) {
    const startDay = new Date(days[0].date).getDay();

    for (let i = 0; i < startDay; i++) {
      week.push({ date: `pad-${i}`, count: -1 });
    }

    days.forEach((day) => {
      week.push(day);
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    });

    if (week.length) {
      while (week.length < 7) {
        week.push({ date: `pad-${week.length}`, count: -1 });
      }
      weeks.push(week);
    }
  }

  const colors = [
    "bg-gray-100 dark:bg-gray-800",
    "bg-green-300 dark:bg-green-900",
    "bg-green-500 dark:bg-green-700",
    "bg-green-600 dark:bg-green-500",
    "bg-green-700 dark:bg-green-400",
  ];

  return (
    <Card className="rounded-2xl h-full card pb-3.5 dark:bg-slate-800/70">
      <CardHeader>
        <CardTitle className="text-base">Weekly Activity</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {days.length > 0 ? (
          <div className="flex gap-1 w-max pr-4">
            {weeks.map((w, wi) => (
              <div key={wi} className="grid grid-rows-7 gap-1">
                {w.map((day, di) => {
                  if (day.count < 0) {
                    return (
                      <div
                        key={di}
                        className="h-3 w-3 rounded-sm bg-transparent"
                      />
                    );
                  }
                  const level = Math.min(day.count, 4);
                  const title = `${day.count} contributions on ${new Date(
                    day.date
                  ).toLocaleDateString()}`;
                  return (
                    <div
                      key={di}
                      title={title}
                      className={`h-3 w-3 rounded-sm ${colors[level]}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-1 w-full">
            {Array.from({ length: 46 }).map((_, wi) => (
              <div key={wi} className="grid grid-rows-7 gap-1">
                {Array.from({ length: 7 }).map((_, di) => (
                  <Skeleton key={di} className="h-3 w-3 rounded-sm" />
                ))}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
