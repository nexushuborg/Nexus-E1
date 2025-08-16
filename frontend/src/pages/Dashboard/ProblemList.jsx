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
    <div className="pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-0">
        <h2 className="text-lg sm:text-xl font-bold text-foreground pl-1">
          Problems ({filteredProblems.length})
        </h2>

        {/* Future buttons (commented for now) */}
        {/* <div className="flex gap-2">
          <Button variant="outline" className="rounded-lg text-foreground">
            Start Session
          </Button>
          <UploadCodeDialog />
        </div> */}
      </div>

      {/* Search */}
      <div className="mb-6 pl-1 sm:pl-1 pr-2 w-full sm:w-1/2">
        <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      </div>

      {/* Problem List */}
      {filteredProblems.length > 0 ? (
        <div className="space-y-3">
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
