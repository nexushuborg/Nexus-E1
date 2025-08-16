import React, { useState, useMemo, useEffect } from "react";
import { Categories } from "./Categories";
import { Difficulty } from "./Difficulty";
import { Tags } from "./Tags";
import { SavedCollections } from "./SavedCollections";
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

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulties, setSelectedDifficulties] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Disable full page scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    };
  }, []);

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const searchMatch = problem.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const difficultyMatch =
        selectedDifficulties.length === 0 ||
        selectedDifficulties.includes(problem.difficulty);
      const tagMatch =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => problem.tags.includes(tag));
      const categoryMatch =
        selectedCategories.length === 0 ||
        selectedCategories.includes(problem.source);

      console.log("FILTER DEBUG", {
        problem: problem.title,
        source: problem.source,
        selectedCategories,
        categoryMatch,
      });

      return searchMatch && difficultyMatch && tagMatch && categoryMatch;
    });
  }, [searchQuery, selectedDifficulties, selectedTags, selectedCategories]);

  const topicCounts = useMemo(() => {
    const map = new Map();
    (submissions || []).forEach((s) =>
      (s.tags || []).forEach((t) => map.set(t, (map.get(t) || 0) + 1))
    );
    return Array.from(map, ([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, []);

  const handleDifficultyChange = (difficulty) => {
    setSelectedDifficulties((prev) =>
      prev.includes(difficulty)
        ? prev.filter((d) => d !== difficulty)
        : [...prev, difficulty]
    );
  };

  const handleTagChange = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="flex flex-col h-screen w-full bg-background font-body">
      <div
        className="flex flex-1 max-w-[1300px] mx-auto w-full pt-4 px-6 pb-6 gap-6"
        style={{ height: "100%" }}
      >
        {/* Sidebar */}
        <aside
          className="hidden md:flex w-72 flex-col h-full overflow-y-auto"
          style={{
            scrollbarWidth: "none", // Firefox
          }}
        >
          <div className="flex flex-col gap-6 h-full">
            <Categories
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
            />
            <Difficulty
              selectedDifficulties={selectedDifficulties}
              onDifficultyChange={handleDifficultyChange}
            />
            <Tags selectedTags={selectedTags} onTagChange={handleTagChange} />
            {/* <SavedCollections /> */}
          </div>
          <style>
            {`
              aside::-webkit-scrollbar {
                display: none; /* Chrome, Safari */
              }
            `}
          </style>
        </aside>

        {/* Main Content with scroll */}
        <main
          className="flex-1 overflow-y-auto"
          style={{ height: "100%", scrollbarWidth: "none" }}
        >
          <style>
            {`
              main::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6 items-start">
            {/* Left content */}
            <div className="xl:col-span-2 flex flex-col gap-6">
              <Stats />
              <WeeklyActivity />
            </div>

            {/* Calendar */}
            <div className="xl:col-start-3 xl:row-start-1">
              <ActivityCalendar />
            </div>

            {/* Charts to be checked later */}
            {/* <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-fr">
              <Card className="rounded-2xl w-full h-full">
                <CardHeader className="py-5">
                  <CardTitle className="text-base">Last 30 Days</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 ml-[-10px]">
                  <ProgressChart data={last30Days} />
                </CardContent>
              </Card>

              <Card className="rounded-2xl w-full h-full">
                <CardHeader className="py-5">
                  <CardTitle className="text-base">Top Topics</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex items-start justify-start ml-[-45px]">
                  <TopicBarChart data={topicCounts} />
                </CardContent>
              </Card>
            </div> */}
          </div>
          <ProblemList problems={filteredProblems} />
        </main>
      </div>
    </div>
  );
}
