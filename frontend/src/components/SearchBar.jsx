import React from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

export default function SearchBar({ searchQuery, onSearchChange }) {
  return (
    <div className="relative w-full max-w-xl">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        id="problem-search"
        type="search"
        placeholder="Search problems... (⌘K)"
        className="w-full rounded-lg bg-secondary pl-10 h-10 focus:outline-none focus:ring-0"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}
