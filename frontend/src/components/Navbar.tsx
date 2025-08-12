import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "next-themes";
import { Moon, Sun, LogOut, LogIn, Menu } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";

export function Navbar() {
  const { user, signOut } = useAuth(); // We no longer need signInWithGitHub here
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
          {/* Show nav links only if user is logged in */}
          {user && <NavLinks />}
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile menu trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <nav className="mt-6 grid gap-4 text-sm">
                <NavLink to="/" className={({isActive}) => isActive ? "text-primary" : "hover:text-foreground/80"}>Home</NavLink>
                {/* Show protected links only if user is logged in */}
                {user && (
                  <>
                    <NavLink to="/dashboard" className={({isActive}) => isActive ? "text-primary" : "hover:text-foreground/80"}>Dashboard</NavLink>
                    <NavLink to="/submissions" className={({isActive}) => isActive ? "text-primary" : "hover:text-foreground/80"}>All Submissions</NavLink>
                    <NavLink to="/topics" className={({isActive}) => isActive ? "text-primary" : "hover:text-foreground/80"}>Topics for Revision</NavLink>
                    <NavLink to="/profile" className={({isActive}) => isActive ? "text-primary" : "hover:text-foreground/80"}>Profile</NavLink>
                  </>
                )}
                <div className="pt-2">
                  <Button variant="outline" onClick={() => setTheme(isDark ? "light" : "dark")} aria-label="Toggle theme" className="w-full justify-start">
                    {isDark ? <Sun className="h-4 w-4 mr-2"/> : <Moon className="h-4 w-4 mr-2"/>}
                    Toggle Theme
                  </Button>
                </div>
                {user ? (
                  <Button variant="secondary" onClick={signOut} className="w-full justify-start">
                    <LogOut className="h-4 w-4 mr-2"/> Logout
                  </Button>
                ) : (
                  // *** FIXED MOBILE BUTTON ***
                  // This now links to the login page instead of calling the function
                  <NavLink to="/login">
                    <Button variant="default" className="w-full justify-start">
                      <LogIn className="h-4 w-4 mr-2"/> Sign In
                    </Button>
                  </NavLink>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Desktop theme + auth */}
          <Button variant="outline" size="icon" onClick={() => setTheme(isDark ? "light" : "dark")} aria-label="Toggle theme" className="hidden md:inline-flex">
            {isDark ? <Sun className="h-4 w-4"/> : <Moon className="h-4 w-4"/>}
          </Button>
          {user ? (
            <Button variant="secondary" onClick={signOut} className="hidden md:inline-flex items-center gap-2">
              <LogOut className="h-4 w-4"/> Logout
            </Button>
          ) : (
            // *** FIXED DESKTOP BUTTON ***
            // This now links to the login page instead of calling the function
            <NavLink to="/login">
                <Button variant="default" className="hidden md:inline-flex items-center gap-2">
                    <LogIn className="h-4 w-4"/> Sign In
                </Button>
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
}
