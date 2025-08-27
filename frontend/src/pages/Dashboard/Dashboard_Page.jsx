import React, { useState, useMemo, useEffect } from "react";
import { Stats } from "./Stats";
import { ActivityCalendar } from "./ActivityCalender";
import { WeeklyActivity } from "./WeeklyActivity";
import { ProblemList } from "./ProblemList";
import { problems } from "../../lib/data";
import ProgressChart from "../../components/ProgressChart";
import TopicBarChart from "../../components/TopicBarChart";
import { submissions, last30Days } from "../../data/mock";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import Portfolio from "./Portfolio";
import ConnectCard from "./ConnectCard";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    };
  }, []);
  const filteredProblems = useMemo(() => {
    return problems.filter((problem) =>
      problem.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);
  const topicCounts = useMemo(() => {
    const map = new Map();
    (submissions || []).forEach((s) =>
      (s.tags || []).forEach((t) => map.set(t, (map.get(t) || 0) + 1))
    );
    return Array.from(map, ([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, []);
  return (
    <div className="flex h-screen bg-gradient-main font-body overflow-hidden relative">
      <div className="gradient-orb-center"></div>
      <div className="flex flex-1 max-w-[1300px] w-full mx-auto gap-6 px-6 py-4 h-full overflow-hidden">
        <aside className="hidden md:flex w-72 flex-col h-full flex-shrink-0">
          <Portfolio />
        </aside>
        <main
          className="flex-1 h-full overflow-y-auto pb-6 overflow-x-hidden md:overflow-x-visible"
          style={{ scrollbarWidth: "none" }}
        >
          <style>
            {`
              main::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>
          <div className="block md:hidden mb-6">
            <Portfolio />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6 items-start">
            <div className="xl:col-span-2 flex flex-col gap-6">
              <Stats />
              <WeeklyActivity />
            </div>
            <div className="xl:col-start-3 xl:row-start-1">
              <ActivityCalendar />
            </div>
          </div>
          <ProblemList problems={filteredProblems} />
          <h2 className="text-lg font-semibold text-foreground mb-4 tracking-tight">
            Last 30 Days Activity Overview
          </h2>
          <div className="grid grid-cols-1 gap-6 auto-rows-fr">
            <Card className="rounded-2xl w-full h-full dark:bg-slate-800/70">
              <CardHeader className="py-5"></CardHeader>
              <CardContent className="w-full h-[300px]">
                <ProgressChart data={last30Days} className="w-full h-full" />
              </CardContent>
            </Card>
            {/* 2nd Graph removed */}
            {/* <Card className="rounded-2xl w-full h-full dark:bg-slate-800/70">
              <CardHeader className="py-5">
                <CardTitle className="text-base">
                  Top Topics You Worked On...
                </CardTitle>
              </CardHeader>
              <CardContent className="w-full h-[400px]">
                <TopicBarChart data={topicCounts} className="w-full h-full" />
              </CardContent>
            </Card> */}
          </div>
          <div className="mt-6">
            <ConnectCard />
          </div>
        </main>
      </div>
    </div>
  );
}
