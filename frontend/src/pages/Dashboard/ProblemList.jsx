import React, { useState, useMemo } from "react";
import { ProblemCard } from "./ProblemCard";
import { Button } from "../../components/ui/button";
import { UploadCodeDialog } from "./UploadPopup";
import SearchBar from "../../components/SearchBar";
import { useNavigate } from "react-router-dom";
export function ProblemList({ problems }) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filteredProblems = useMemo(() => {
    if (!searchQuery) return problems;
    return problems.filter((problem) =>
      problem.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [problems, searchQuery]);

  const handleViewAllClick = () => {
    navigate("/submissions");
  };

  return (
    <div className="pb-1">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-0">
        <h2 className="text-lg sm:text-xl font-bold text-foreground pl-1">
          Recent Activity
        </h2>
        {/* Future buttons (commented for now) */}
        {/* <div className="flex gap-2">
          <Button variant="outline" className="rounded-lg text-foreground">
            Start Session
          </Button>
          <UploadCodeDialog />
        </div> */}
      </div>
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
      <div className="flex justify-center mt-6">
        <Button
          onClick={handleViewAllClick}
          variant="outline"
          className="rounded-full text-foreground px-6"
        >
          View All
        </Button>
      </div>
    </div>
  );
}
