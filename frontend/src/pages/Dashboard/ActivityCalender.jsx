/* The above code is a React component that creates an Activity Calendar. Here's a summary of what the
code does: */
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import { format, getDay, isSameDay, isToday } from "date-fns";

// A custom calendar component that displays a month view.
const CustomCalendar = ({
  selectedDate,
  onDateChange,
  solvedDays,
  currentMonth,
  onMonthChange,
}) => {
  // Calculate the days to display for the current month.
  const startDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );
  const endDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  );
  const daysInMonth = [];
  const startDayOfWeek = getDay(startDay);
  // Fill in null values for leading empty days.
  for (let i = 0; i < startDayOfWeek; i++) daysInMonth.push(null);
  // Push all days of the month into the array.
  for (let i = 1; i <= endDay.getDate(); i++)
    daysInMonth.push(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i)
    );

  // Handle a day cell click event.
  const handleDayClick = (day) => {
    if (day) onDateChange(day);
  };

  // Check if a given day is in the solvedDays array.
  const isSolved = (day) =>
    solvedDays.some((solvedDay) => isSameDay(solvedDay, day));

  // Component for a single day cell in the calendar.
  const DayCell = ({ day }) => {
    if (!day) return <div className="h-8 w-8"></div>;
    const today = isToday(day);
    const solved = isSolved(day);
    const isSelected = selectedDate && isSameDay(selectedDate, day);

    // Dynamic classes based on day state.
    let cellClasses =
      "h-8 w-8 flex items-center justify-center text-sm rounded-full duration-200 hover:text-foreground";
    if (isSelected) cellClasses += " text-foreground";
    else if (solved) cellClasses += " bg-purple-100 text-purple-600";
    else if (today) cellClasses += " text-accent-foreground";
    else cellClasses += " bg-transparent text-inherit";
    const noHoverFocus = "hover:bg-transparent focus:ring-0";

    return (
      <Button
        variant="ghost"
        className={`${cellClasses} ${noHoverFocus}`}
        onClick={() => handleDayClick(day)}
      >
        {solved ? (
          <CheckCircle2 className="h-5 w-5 text-purple-600" />
        ) : (
          day.getDate()
        )}
      </Button>
    );
  };

  return (
    <div className="w-full">
      {/* Calendar header with month navigation. */}
      <div className="flex justify-between items-center relative px-4 sm:px-8 mb-2 mt-4">
        <Button
          variant="ghost"
          className="h-7 w-7 p-0 absolute left-0"
          onClick={() =>
            onMonthChange(
              new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() - 1,
                1
              )
            )
          }
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="flex-1 text-center text-base font-semibold">
          {format(currentMonth, "MMMM yyyy")}
        </span>
        <Button
          variant="ghost"
          className="h-7 w-7 p-0 absolute right-0"
          onClick={() =>
            onMonthChange(
              new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() + 1,
                1
              )
            )
          }
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      {/* Weekday headers. */}
      <div className="grid grid-cols-7 place-items-center mt-4 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div
            key={day}
            className="text-muted-foreground w-8 font-normal text-xs text-center"
          >
            {day}
          </div>
        ))}
      </div>
      {/* Grid for day cells. */}
      <div className="grid grid-cols-7 gap-2 justify-items-center">
        {daysInMonth.map((day, index) => (
          <DayCell key={index} day={day} />
        ))}
      </div>
    </div>
  );
};

// Main component for the activity calendar dashboard card.
export function ActivityCalendar() {
  const [date, setDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [timeLeft, setTimeLeft] = useState("00:00:00");
  const [solvedDays, setSolvedDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch solved problems data from a GitHub dashboard.json file.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const repoUrl = localStorage.getItem("github-repo") ?? "";
        if (!repoUrl) throw new Error("GitHub repo not found in localStorage");
        const match = repoUrl.match(/https:\/\/github\.com\/([^/]+)\/([^/]+)/);
        if (!match) throw new Error("Invalid GitHub repo URL");
        const username = match[1];
        const reponame = match[2];
        const response = await fetch(
          `https://raw.githubusercontent.com/${username}/${reponame}/main/dashboard.json`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const jsonData = await response.json();
        const dates = jsonData.problems.map((p) => new Date(p.lastUpdated));
        setSolvedDays(dates);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Set up a timer to countdown the time remaining until the end of the day.
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      const diff = endOfDay.getTime() - now.getTime();
      const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(
        2,
        "0"
      );
      const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(
        2,
        "0"
      );
      const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");
      setTimeLeft(`${hours}:${minutes}:${seconds}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Show a loading message while data is being fetched.
  if (loading)
    return (
      <Card className="rounded-2xl p-1 h-full relative overflow-hidden card dark:bg-slate-800/45">
        <CardContent className="flex items-center justify-center h-full">
          <p>Loading calendar data...</p>
        </CardContent>
      </Card>
    );

  // Show an error message if data fetching fails.
  if (error)
    return (
      <Card className="rounded-2xl p-1 h-full relative overflow-hidden card dark:bg-slate-800/45">
        <CardContent className="flex items-center justify-center h-full py-2">
          <p>Error loading calendar data.</p>
        </CardContent>
      </Card>
    );

  const today = new Date();

  return (
    <Card className="rounded-2xl p-1 h-full relative overflow-hidden card dark:bg-slate-800/45">
      {/* Hexagon-shaped date display for today, hidden on small screens. */}
      <div className="absolute top-4 right-4 z-10 hidden sm:block">
        <div className="relative w-16 h-20">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 80 90">
            <path
              d="M40 0 L80 22.5 L80 67.5 L40 90 L0 67.5 L0 22.5 Z"
              fill="hsl(var(--muted))"
              stroke="hsl(var(--border))"
              strokeWidth="1"
            />
          </svg>
          <div className="relative z-10 mb-4 flex flex-col items-center justify-center h-full text-foreground">
            <div className="text-2xl font-bold">{format(today, "d")}</div>
            <div className="text-xs font-medium uppercase">
              {format(today, "MMM")}
            </div>
          </div>
        </div>
      </div>
      {/* Card header with day and countdown information. */}
      <CardHeader className="pt-2 pb-2">
        <div className="flex items-center justify-between sm:justify-start gap-2">
          <div className="flex flex-col">
            <span className="text-lg font-semibold">Day {today.getDate()}</span>
            <span className="text-xs text-muted-foreground">
              {timeLeft} left
            </span>
          </div>
          <div className="sm:hidden text-center text-sm font-semibold p-2 bg-muted rounded-full">
            {format(today, "d MMM")}
          </div>
        </div>
      </CardHeader>
      {/* Card content containing the custom calendar component. */}
      <CardContent className="p-4 pt-0 sm:p-4 sm:h-[345px]">
        <CustomCalendar
          selectedDate={date}
          onDateChange={setDate}
          solvedDays={solvedDays}
          currentMonth={currentMonth}
          onMonthChange={setCurrentMonth}
        />
      </CardContent>
    </Card>
  );
}
