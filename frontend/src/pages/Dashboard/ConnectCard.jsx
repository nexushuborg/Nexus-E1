import React from "react";
import { Card, CardContent } from "../../components/ui/card";

const roadmaps = [
  {
    letter: "A",
    title: "Data Structures",
    description: "Arrays, Strings, Stacks, Queues",
  },
  {
    letter: "B",
    title: "Algorithms",
    description: "Searching, Sorting, Graph Theory",
  },
  {
    letter: "C",
    title: "NeetCode 150",
    description: "150 Hand-Picked Questions",
  },
];

export default function ConnectCard() {
  return (
    <div className="w-full pb-10">
      <h2 className="text-lg font-semibold text-foreground mb-4 tracking-tight">
        Connecting Roadmaps
      </h2>
      <div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 pr-1 pb-1 overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        <style>
          {`
            div::-webkit-scrollbar {
              display: none; /* Chrome, Safari */
            }
          `}
        </style>
        {roadmaps.map((roadmap, index) => (
          <Card
            key={index}
            className="rounded-2xl transition-all duration-200 cursor-pointer bg-card dark:bg-slate-800/45"
          >
            <CardContent className="flex flex-col items-center justify-center text-center p-6">
              <div className="h-16 w-16 rounded-full border-2 border-foreground/50 flex items-center justify-center">
                <p className="text-3xl font-bold text-foreground">
                  {roadmap.letter}
                </p>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-foreground">
                  {roadmap.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {roadmap.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
