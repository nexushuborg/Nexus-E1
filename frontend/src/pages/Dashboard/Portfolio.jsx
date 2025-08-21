import React from "react";
import { Card, CardContent } from "../../components/ui/card";
import { BadgeCheck } from "lucide-react";
import {
  SiGmail,
  SiGeeksforgeeks,
  SiLeetcode,
  SiLinkedin,
} from "react-icons/si";

export default function Portfolio() {
  return (
    <Card className="rounded-3xl w-full max-w-full sm:max-w-md mx-auto dark:bg-slate-800/45 text-foreground max-h-[80vh]">
      <CardContent className="flex flex-col items-center text-center p-4 overflow-y-auto h-full">
        <div className="relative">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2815/2815428.png"
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-primary object-cover dark:invert"
          />
        </div>
        <h2 className="mt-4 text-xl font-extrabold flex items-center gap-2">
          Nexus Hub
          <BadgeCheck className="text-primary h-5 w-5" />
        </h2>
        <p className="text-muted-foreground text-sm">@NexusHub</p>
        <div className="grid grid-cols-2 gap-4 mt-6 w-full">
          <div className="p-3 rounded-xl flex flex-col items-center justify-center bg-secondary">
            <p className="text-2xl font-bold text-success">1010</p>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              Questions Solved
            </p>
          </div>
          <div className="p-3 rounded-xl flex flex-col items-center justify-center bg-secondary">
            <p className="text-2xl font-bold text-primary">348</p>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              Active Days
            </p>
          </div>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          You can find me on...
        </p>
        <div className="mt-2 w-full overflow-x-auto">
          <div className="flex gap-4 flex-nowrap justify-center">
            <SiGmail className="text-success cursor-pointer" title="Gmail" />
            <SiGeeksforgeeks
              className="text-success cursor-pointer"
              title="GeeksforGeeks"
            />
            <SiLeetcode
              className="text-warning cursor-pointer"
              title="LeetCode"
            />
            <SiLinkedin
              className="text-success cursor-pointer"
              title="LinkedIn"
            />
          </div>
        </div>
        <div className="mt-6 w-full flex flex-wrap justify-center gap-2 select-none">
          {["#JAVA", "#Python", "#C", "#DSA", "#AI", "#ML"].map((tag, i) => (
            <span
              key={i}
              className="bg-secondary text-muted-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-md"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
