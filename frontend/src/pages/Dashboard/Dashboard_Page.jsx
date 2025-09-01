/* This code snippet is a React functional component named `Dashboard`. Here's a breakdown of what it
does: */
import React, { useState, useMemo, useEffect } from "react";
import { Stats } from "./Stats";
import { ActivityCalendar } from "./ActivityCalender";
import { DailyActivity } from "./DailyActivity";
import { ProblemList } from "./ProblemList";
import { problems } from "../../lib/data";
import ProgressChart from "../../components/ProgressChart";
import { last30Days } from "../../data/mock";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import Portfolio from "./Portfolio";
import ConnectCard from "./ConnectCard";
import Profile from "../Profile";

// Main dashboard component that displays a comprehensive overview for the user.
export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showContent, setShowContent] = useState(false);

  // Lock scrolling on the body and document to prevent background scrolling.
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    // Cleanup function to re-enable scrolling when the component unmounts.
    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    };
  }, []);

  // Delay the rendering of the main content to allow for initial animations or a loading state.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowContent(true);
    }, 200);
    return () => clearTimeout(timeout);
  }, []);

  // Memoize the filtered problems to avoid unnecessary re-renders.
  const filteredProblems = useMemo(() => {
    return problems.filter((problem) =>
      problem.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="flex h-screen bg-gradient-main font-body overflow-hidden relative">
      {/* Visual background effect. */}
      <div className="gradient-orb-center"></div>
      {/* A hidden Profile component. */}
      <div
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          overflow: "hidden",
        }}
      >
        <Profile />
      </div>

      {/* Conditionally render the main dashboard content after a delay. */}
      {showContent && (
        <div className="flex flex-1 max-w-[1300px] w-full mx-auto gap-6 px-6 py-4 h-full overflow-hidden">
          {/* Left sidebar, hidden on smaller screens. */}
          <aside className="hidden md:flex w-72 flex-col h-full flex-shrink-0">
            <Portfolio />
          </aside>

          {/* Main content area with a scrollable list of components. */}
          <main
            className="flex-1 h-full overflow-y-auto pb-6 overflow-x-hidden md:overflow-x-visible"
            style={{ scrollbarWidth: "none" }}
          >
            {/* CSS to hide the scrollbar for Webkit browsers. */}
            <style>
              {`
                main::-webkit-scrollbar {
                  display: none;
                }
              `}
            </style>

            {/* Mobile-only portfolio display. */}
            <div className="block md:hidden mb-6">
              <Portfolio />
            </div>

            {/* Grid for key dashboard statistics and calendars. */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6 items-start">
              <div className="xl:col-span-2 flex flex-col gap-6">
                <Stats />
                <DailyActivity />
              </div>
              <div className="xl:col-start-3 xl:row-start-1">
                <ActivityCalendar />
              </div>
            </div>

            {/* Component for displaying a list of problems. */}
            <ProblemList problems={filteredProblems} />

            {/* Progress chart section. */}
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
            </div>

            {/* Connecting Roadmaps section. */}
            <div className="mt-6">
              <ConnectCard />
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
