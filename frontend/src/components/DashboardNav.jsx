import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Flame, Moon, Sun } from "lucide-react";
import { cn } from "../lib/utils";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";

export default function Navbar({ searchQuery, onSearchChange }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      const newIsDarkMode = e.matches;
      setIsDarkMode(newIsDarkMode);
      if (newIsDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("problem-search")?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const toggleDarkMode = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    if (newIsDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-30 h-18 border-b bg-background shadow-lg",
        isDarkMode && "dark:shadow-md dark:shadow-blue-900"
      )}
    >
      <div className="flex h-full items-center justify-between px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <img
            src="/images/Algolog Logo.jpg"
            alt="AlgoLog Logo"
            className="w-10 h-10 object-contain rounded-full"
          />
          <h1
            className="text-xl md:text-2xl font-bold tracking-wider font-headline cursor-pointer"
            onClick={() => (window.location.href = "/")}
          >
            AlgoLog
          </h1>
        </div>
        <div className="hidden md:flex flex-1 justify-center px-8">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
          />
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="rounded-full h-10 w-10 background border-2"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle dark mode</span>
          </Button>
          <div className="flex items-center gap-2 text-base font-medium">
            <Flame className="h-6 w-6 text-orange-500" />
            <span>25</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-10 w-10"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src="https://placehold.co/100x100.png"
                    alt="User"
                  />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              style={{
                backgroundColor: "hsl(var(--popover))",
                color: "hsl(var(--popover-foreground))",
              }}
              className="rounded-md border border-border shadow-lg"
            >
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => alert("Logout clicked")}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
