import React from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Check } from "lucide-react";
import DonutChart from "../../components/DonutChart";

const difficultyData = [
  { name: "Easy", value: 4, color: "#22c55e" },
  { name: "Medium", value: 3, color: "#eab308" },
  { name: "Hard", value: 1, color: "#ef4444" },
];

export function Stats() {
  return (
    <div className="grid grid-cols-2 gap-6">
      <Card className="rounded-2xl card dark:bg-slate-800/45">
        <CardContent className="flex flex-col items-center justify-center h-full p-6">
          <div className="bg-green-500 rounded-full p-2">
            <Check className="h-6 w-6 text-white" />
          </div>
          <div className="text-center mt-2">
            <p className="text-1xl text-muted-foreground">Total Solved</p>
            <p className="text-2xl font-bold">
              1010
              <span className="text-lg font-normal text-muted-foreground ml-1">
                /5578
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-2xl card dark:bg-slate-800/45">
        <CardContent className="flex flex-col items-center justify-center h-full p-1">
          <DonutChart data={difficultyData} />
        </CardContent>
      </Card>
    </div>
  );
}
