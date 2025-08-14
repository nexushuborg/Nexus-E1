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
      document.documentElement.classList.toggle("dark", newIsDarkMode);
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
    document.documentElement.classList.toggle("dark", newIsDarkMode);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-30 h-14 border-b bg-background shadow-sm",
        isDarkMode && "dark:shadow-sm"
      )}
    >
      <div className="flex h-full items-center justify-between px-4 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img
            src="/images/Algolog Logo.jpg"
            alt="AlgoLog Logo"
            className="w-8 h-8 object-contain rounded-full"
          />
          <h1
            className="text-lg md:text-xl font-bold tracking-wide font-headline cursor-pointer"
            onClick={() => (window.location.href = "/")}
          >
            AlgoLog
          </h1>
        </div>

        {/* Search */}
        <div className="hidden md:flex flex-1 justify-center px-4">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
          />
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="rounded-full h-8 w-8 border"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle dark mode</span>
          </Button>

          <div className="flex items-center gap-1 text-sm font-medium">
            <Flame className="h-4 w-4 text-orange-500" />
            <span>25</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-8 w-8"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="https://placehold.co/80x80.png"
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
              className="rounded-md border border-border shadow-lg text-sm"
            >
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/")}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/")}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
