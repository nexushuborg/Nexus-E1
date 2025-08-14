import React, { useState, useMemo } from "react";
import { ProblemCard } from "./ProblemCard";
import { Button } from "../../components/ui/button";
import { UploadCodeDialog } from "./UploadPopup";
import SearchBar from "../../components/SearchBar";

export function ProblemList({ problems }) {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredProblems = useMemo(() => {
    if (!searchQuery) return problems;
    return problems.filter((problem) =>
      problem.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [problems, searchQuery]);
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2 sm:gap-0">
        <h2 className="text-xl font-bold">
          Code Cards ({filteredProblems.length})
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-lg">
            Start Session
          </Button>
          <UploadCodeDialog />
        </div>
      </div>
      <div className="block md:hidden mb-4">
        <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      </div>
      {filteredProblems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProblems.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          No problems match your current filters.
        </div>
      )}
    </div>
  );
}
