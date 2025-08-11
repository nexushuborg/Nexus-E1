import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "next-themes";
import { Moon, Sun, LogOut, LogIn, Menu } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";

export function Navbar() {
  const { user, signOut, signInWithGitHub } = useAuth();
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const NavLinks = () => (
    <div className="hidden md:flex items-center gap-4 text-sm">
      <NavLink to="/dashboard" className={({isActive}) => isActive ? "text-primary" : "hover:text-foreground/80"}>Dashboard</NavLink>
      <NavLink to="/submissions" className={({isActive}) => isActive ? "text-primary" : "hover:text-foreground/80"}>All Submissions</NavLink>
      <NavLink to="/topics" className={({isActive}) => isActive ? "text-primary" : "hover:text-foreground/80"}>Topics for Revision</NavLink>
      <NavLink to="/profile" className={({isActive}) => isActive ? "text-primary" : "hover:text-foreground/80"}>Profile</NavLink>
    </div>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <NavLink to="/" className="font-semibold story-link">DSA Tracker</NavLink>
          <NavLinks />
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile menu trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden" aria-label="Open menu">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <nav className="mt-6 grid gap-4 text-sm">
                <NavLink to="/" className={({isActive}) => isActive ? "text-primary" : "hover:text-foreground/80"}>Home</NavLink>
                <NavLink to="/dashboard" className={({isActive}) => isActive ? "text-primary" : "hover:text-foreground/80"}>Dashboard</NavLink>
                <NavLink to="/submissions" className={({isActive}) => isActive ? "text-primary" : "hover:text-foreground/80"}>All Submissions</NavLink>
                <NavLink to="/topics" className={({isActive}) => isActive ? "text-primary" : "hover:text-foreground/80"}>Topics for Revision</NavLink>
                <NavLink to="/profile" className={({isActive}) => isActive ? "text-primary" : "hover:text-foreground/80"}>Profile</NavLink>
                <div className="pt-2">
                  <Button variant="outline" onClick={() => setTheme(isDark ? "light" : "dark")} aria-label="Toggle theme" className="w-full">
                    {isDark ? <Sun className="h-4 w-4"/> : <Moon className="h-4 w-4"/>}
                    <span className="ml-2">Toggle Theme</span>
                  </Button>
                </div>
                {user ? (
                  <Button variant="secondary" onClick={signOut} className="w-full">
                    <LogOut className="h-4 w-4"/> Logout
                  </Button>
                ) : (
                  <Button variant="default" onClick={signInWithGitHub} className="w-full">
                    <LogIn className="h-4 w-4"/> Sign In
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Desktop theme + auth */}
          <Button variant="outline" onClick={() => setTheme(isDark ? "light" : "dark")} aria-label="Toggle theme" className="hidden md:inline-flex">
            {isDark ? <Sun className="h-4 w-4"/> : <Moon className="h-4 w-4"/>}
          </Button>
          {user ? (
            <Button variant="secondary" onClick={signOut} className="hidden md:inline-flex">
              <LogOut className="h-4 w-4"/> Logout
            </Button>
          ) : (
            <Button variant="default" onClick={signInWithGitHub} className="hidden md:inline-flex">
              <LogIn className="h-4 w-4"/> Sign In
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
