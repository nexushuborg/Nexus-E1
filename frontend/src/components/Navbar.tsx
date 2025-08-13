import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "next-themes";
import { Moon, Sun, LogOut, LogIn, Menu } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";

export function Navbar() {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const NavLinks = () => (
    <div className="hidden md:flex items-center gap-4 text-sm">
      <NavLink to="/dashboard" className={({isActive}) => isActive ? (isDark ? "text-[#F000FF]" : "text-primary") : "hover:text-foreground/80"}>Dashboard</NavLink>
      <NavLink to="/submissions" className={({isActive}) => isActive ? (isDark ? "text-[#F000FF]" : "text-primary") : "hover:text-foreground/80"}>All Submissions</NavLink>
      <NavLink to="/topics" className={({isActive}) => isActive ? (isDark ? "text-[#F000FF]" : "text-primary") : "hover:text-foreground/80"}>Topics for Revision</NavLink>
      <NavLink to="/profile" className={({isActive}) => isActive ? (isDark ? "text-[#F000FF]" : "text-primary") : "hover:text-foreground/80"}>Profile</NavLink>
    </div>
  );

  return (
    <header className={`
      sticky top-0 z-40 w-full border-b transition-colors duration-300
      ${isDark ? 'bg-slate-900/60 border-slate-700/50 backdrop-blur-lg' : 'bg-background/80 backdrop-blur'}
    `}>
      <nav className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          {/* *** THE FIX *** Changed brand name */}
          <NavLink to="/" className="font-semibold story-link text-foreground">Algolog</NavLink>
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
                <NavLink to="/" className={({isActive}) => isActive ? (isDark ? "text-[#F000FF]" : "text-primary") : "hover:text-foreground/80"}>Home</NavLink>
                {user && (
                  <>
                    <NavLink to="/dashboard" className={({isActive}) => isActive ? (isDark ? "text-[#F000FF]" : "text-primary") : "hover:text-foreground/80"}>Dashboard</NavLink>
                    <NavLink to="/submissions" className={({isActive}) => isActive ? (isDark ? "text-[#F000FF]" : "text-primary") : "hover:text-foreground/80"}>All Submissions</NavLink>
                    <NavLink to="/topics" className={({isActive}) => isActive ? (isDark ? "text-[#F000FF]" : "text-primary") : "hover:text-foreground/80"}>Topics for Revision</NavLink>
                    <NavLink to="/profile" className={({isActive}) => isActive ? (isDark ? "text-[#F000FF]" : "text-primary") : "hover:text-foreground/80"}>Profile</NavLink>
                  </>
                )}
                <div className="pt-2">
                  <Button 
                    variant={isDark ? "outline" : "secondary"} 
                    onClick={() => setTheme(isDark ? "light" : "dark")} 
                    aria-label="Toggle theme" 
                    className="w-full justify-start hover:text-[#F000FF] hover:border-[#F000FF] dark:hover:bg-transparent"
                  >
                    {isDark ? <Sun className="h-4 w-4 mr-2"/> : <Moon className="h-4 w-4 mr-2"/>}
                    Toggle Theme
                  </Button>
                </div>
                {user ? (
                  <Button variant="secondary" onClick={signOut} className="w-full justify-start">
                    <LogOut className="h-4 w-4 mr-2"/> Logout
                  </Button>
                ) : (
                  <NavLink to="/login">
                    <button className="glossy-button w-full flex items-center justify-start font-semibold py-2 px-4 rounded-lg bg-[#F000FF] text-white">
                        <LogIn className="h-4 w-4 mr-2"/> Sign In
                    </button>
                  </NavLink>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Desktop theme + auth */}
          <Button 
            variant={isDark ? "outline" : "secondary"} 
            size="icon" 
            onClick={() => setTheme(isDark ? "light" : "dark")} 
            aria-label="Toggle theme" 
            className="hidden md:inline-flex hover:border-[#F000FF] hover:text-[#F000FF] dark:hover:bg-transparent"
          >
            {isDark ? <Sun className="h-4 w-4"/> : <Moon className="h-4 w-4"/>}
          </Button>
          {user ? (
            <Button variant="secondary" onClick={signOut} className="hidden md:inline-flex items-center gap-2">
              <LogOut className="h-4 w-4"/> Logout
            </Button>
          ) : (
            <NavLink to="/login">
                <button className="glossy-button hidden md:inline-flex items-center justify-center font-semibold py-2 px-4 rounded-lg bg-[#F000FF] text-white">
                    <LogIn className="h-4 w-4 mr-2"/> Sign In
                </button>
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
}
