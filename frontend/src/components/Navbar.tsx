/* The above code is a TypeScript React component for a Navbar. It includes functionality for user
authentication, theme toggling (light/dark mode), navigation links, and a responsive menu for
smaller screens. Here's a breakdown of the key features: */
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "next-themes";
import { Moon, Sun, LogOut, LogIn, Menu } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";

// Navbar component for site-wide navigation and user actions.
export function Navbar() {
  const { user, signOut } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  // Determine if the current theme is dark.
  const isDark = resolvedTheme === "dark";

  // A helper component to render the navigation links.
  const NavLinks = () => (
    <div className="hidden md:flex items-center gap-4 text-sm">
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          isActive
            ? isDark
              ? "text-[#5065bc]"
              : "text-primary"
            : isDark
            ? "text-foreground hover:text-foreground/80"
            : "text-foreground/80 hover:text-foreground"
        }
      >
        Dashboard
      </NavLink>
      <NavLink
        to="/submissions"
        className={({ isActive }) =>
          isActive
            ? isDark
              ? "text-[#5065bc]"
              : "text-primary"
            : isDark
            ? "text-foreground hover:text-foreground/80"
            : "text-foreground/80 hover:text-foreground"
        }
      >
        All Submissions
      </NavLink>
      <NavLink
        to="/topics"
        className={({ isActive }) =>
          isActive
            ? isDark
              ? "text-[#5065bc]"
              : "text-primary"
            : isDark
            ? "text-foreground hover:text-foreground/80"
            : "text-foreground/80 hover:text-foreground"
        }
      >
        Topics for Revision
      </NavLink>
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          isActive
            ? isDark
              ? "text-[#5065bc]"
              : "text-primary"
            : isDark
            ? "text-foreground hover:text-foreground/80"
            : "text-foreground/80 hover:text-foreground"
        }
      >
        Profile
      </NavLink>
    </div>
  );

  return (
    <header
      className={`
      sticky top-0 z-40 w-full border-b transition-colors duration-300
      ${
        isDark
          ? "bg-slate-900/60 border-slate-700/50 backdrop-blur-lg"
          : "bg-background/80 backdrop-blur"
      }
    `}
    >
      <nav className="container flex h-14 items-center justify-between">
        {/* Left section of the Navbar: Logo and desktop navigation links. */}
        <div className="flex items-center gap-6">
          <NavLink
            to="/"
            className="font-semibold story-link text-foreground font-brand text-xl"
          >
            Algolog
          </NavLink>
          {user && <NavLinks />}
        </div>

        {/* Right section of the Navbar: Buttons for mobile menu, theme toggle, and auth. */}
        <div className="flex items-center gap-2">
          {/* Mobile menu sheet. */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <nav className="mt-6 grid gap-4 text-sm">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive
                      ? isDark
                        ? "text-[#5065bc]"
                        : "text-primary"
                      : "hover:text-foreground/80"
                  }
                >
                  Home
                </NavLink>
                {user && (
                  <>
                    <NavLink
                      to="/dashboard"
                      className={({ isActive }) =>
                        isActive
                          ? isDark
                            ? "text-[#5065bc]"
                            : "text-primary"
                          : "hover:text-foreground/80"
                      }
                    >
                      Dashboard
                    </NavLink>
                    <NavLink
                      to="/submissions"
                      className={({ isActive }) =>
                        isActive
                          ? isDark
                            ? "text-[#5065bc]"
                            : "text-primary"
                          : "hover:text-foreground/80"
                      }
                    >
                      All Submissions
                    </NavLink>
                    <NavLink
                      to="/topics"
                      className={({ isActive }) =>
                        isActive
                          ? isDark
                            ? "text-[#5065bc]"
                            : "text-primary"
                          : "hover:text-foreground/80"
                      }
                    >
                      Topics for Revision
                    </NavLink>
                    <NavLink
                      to="/profile"
                      className={({ isActive }) =>
                        isActive
                          ? isDark
                            ? "text-[#5065bc]"
                            : "text-primary"
                          : "hover:text-foreground/80"
                      }
                    >
                      Profile
                    </NavLink>
                  </>
                )}
                <div className="pt-2">
                  <Button
                    variant={isDark ? "outline" : "secondary"}
                    onClick={() => setTheme(isDark ? "light" : "dark")}
                    aria-label="Toggle theme"
                    className="w-full justify-start hover:text-[#5065bc] hover:border-[#5065bc] dark:hover:bg-transparent"
                  >
                    {isDark ? (
                      <Sun className="h-4 w-4 mr-2" />
                    ) : (
                      <Moon className="h-4 w-4 mr-2" />
                    )}
                    Toggle Theme
                  </Button>
                </div>
                {user ? (
                  <Button
                    variant="secondary"
                    onClick={signOut}
                    className="w-full justify-start"
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </Button>
                ) : (
                  <NavLink to="/login">
                    <button className="glossy-button w-full flex items-center justify-start font-semibold py-2 px-4 rounded-lg bg-[#5065bc] text-white">
                      <LogIn className="h-4 w-4 mr-2" /> Sign In
                    </button>
                  </NavLink>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Desktop theme toggle button. */}
          <Button
            variant={isDark ? "outline" : "secondary"}
            size="icon"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label="Toggle theme"
            className="hidden md:inline-flex hover:border-[#5065bc] hover:text-[#5065bc] dark:hover:bg-transparent"
          >
            {isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {/* Desktop Sign In/Logout button. */}
          {user ? (
            <Button
              variant="secondary"
              onClick={signOut}
              className="hidden md:inline-flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          ) : (
            <NavLink to="/login">
              <button className="glossy-button hidden md:inline-flex items-center justify-center font-semibold py-2 px-4 rounded-lg bg-[#253fac] text-white">
                <LogIn className="h-4 w-4 mr-2" /> Sign In
              </button>
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
}
