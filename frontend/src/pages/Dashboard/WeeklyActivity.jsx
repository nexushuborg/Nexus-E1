import { useState, useEffect } from "react";
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
    const generatedDays = Array.from({ length: 365 }, (_, i) => ({
      date: `2024-01-${(i % 31) + 1}`,
      count: Math.floor(Math.random() * 5),
    }));
    setDays(generatedDays);
  }, []);
  return (
    <Card className="rounded-2xl h-full card">
      <CardHeader>
        <CardTitle className="text-base">Weekly Activity</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {days.length > 0 ? (
          <div className="overflow-x-auto md:overflow-x-hidden">
            <div className="flex flex-col gap-1 w-max pr-4">
              {Array.from({ length: 7 }).map((_, weekIndex) => (
                <div key={weekIndex} className="flex gap-1">
                  {Array.from({ length: 52 }).map((_, dayIndex) => {
                    const index = weekIndex * 52 + dayIndex;
                    if (index >= 365) return null;
                    const day = days[index];
                    if (!day) {
                      return (
                        <div
                          key={index}
                          className="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800"
                        />
                      );
                    }
                    const level = day.count;
                    const colors = [
                      "bg-green-100 dark:bg-green-800",
                      "bg-green-200 dark:bg-green-900",
                      "bg-green-400 dark:bg-green-700",
                      "bg-green-600 dark:bg-green-500",
                      "bg-green-800 dark:bg-green-300",
                    ];
                    return (
                      <div
                        key={index}
                        title={`${level} contributions`}
                        className={`h-3 w-3 rounded-sm ${colors[level]}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1 w-full">
            {Array.from({ length: 7 }).map((_, weekIndex) => (
              <div key={weekIndex} className="flex gap-1">
                {Array.from({ length: 52 }).map((_, dayIndex) => (
                  <Skeleton key={dayIndex} className="h-3 w-3 rounded-sm" />
                ))}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
