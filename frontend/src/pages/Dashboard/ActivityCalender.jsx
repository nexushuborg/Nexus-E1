import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { solvedDays } from "../../lib/data";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import { format, getDay, isSameDay, isToday } from "date-fns";

const CustomCalendar = ({
  selectedDate,
  onDateChange,
  solvedDays,
  currentMonth,
  onMonthChange,
}) => {
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
  for (let i = 0; i < startDayOfWeek; i++) {
    daysInMonth.push(null);
  }
  for (let i = 1; i <= endDay.getDate(); i++) {
    daysInMonth.push(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i)
    );
  }
  const handleDayClick = (day) => {
    if (day) onDateChange(day);
  };
  const isSolved = (day) =>
    solvedDays.some((solvedDay) => isSameDay(solvedDay, day));
  const DayCell = ({ day }) => {
    if (!day) return <div className="h-8 w-8"></div>;
    const today = isToday(day);
    const solved = isSolved(day);
    const isSelected = selectedDate && isSameDay(selectedDate, day);
    let cellClasses =
      "h-8 w-8 flex items-center justify-center text-sm rounded-full transition-colors duration-200 hover:text-foreground";
    if (isSelected) {
      cellClasses += "text-primary-foreground";
    } else if (solved) {
      cellClasses += " bg-purple-100 text-purple-600";
    } else if (today) {
      cellClasses += " bg-accent text-accent-foreground";
    } else {
      cellClasses += " bg-transparent text-inherit";
    }
    const noHoverFocus =
      "hover:bg-transparent focus:bg-transparent focus:ring-0";
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
      <div className="flex justify-between items-center relative px-8 mb-2 mt-4">
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
      <div className="flex justify-around mt-4 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div
            key={day}
            className="text-muted-foreground w-8 font-normal text-xs text-center"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2 hover:text-foreground">
        {daysInMonth.map((day, index) => (
          <DayCell key={index} day={day} />
        ))}
      </div>
    </div>
  );
};

export function ActivityCalendar() {
  const [date, setDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [timeLeft, setTimeLeft] = useState("00:00:00");
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
  return (
    <Card className="rounded-2xl h-full relative overflow-hidden p-2 card">
      <div className="absolute top-4 right-4 z-10">
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
            <div className="text-2xl font-bold">{format(new Date(), "d")}</div>
            <div className="text-xs font-medium uppercase">
              {format(new Date(), "MMM")}
            </div>
          </div>
        </div>
      </div>
      <CardHeader className="pt-2 pb-2">
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <span className="text-lg font-semibold">Day 11</span>
            <span className="text-xs text-muted-foreground">
              {timeLeft} left
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
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
