import { Helmet } from "react-helmet-async";
import { submissions, type Submission } from "@/data/mock";
import { useMemo, useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTheme } from "next-themes";
import { Search, Filter, Tag, Calendar, Code, TrendingUp, BookOpen, Eye, Clock, ChevronDown } from "lucide-react";
import { getTagColor } from "@/lib/tagColors";

export default function Submissions() {
  const { theme, resolvedTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<string>("All");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isNavigatingBack, setIsNavigatingBack] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const isLightMode = resolvedTheme === 'light' || theme === 'light';

  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem('submissions-scroll-position');
    if (savedScrollPosition) {
      setIsNavigatingBack(true);
      const scrollY = parseInt(savedScrollPosition, 10);
      
      const restoreScroll = () => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = scrollY;
          sessionStorage.removeItem('submissions-scroll-position');
          setIsNavigatingBack(false);
        } else {
          setTimeout(restoreScroll, 50);
        }
      };
      
      requestAnimationFrame(restoreScroll);
    }
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      const scrollY = scrollContainerRef.current?.scrollTop || window.scrollY;
      sessionStorage.setItem('submissions-scroll-position', scrollY.toString());
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const scrollY = scrollContainerRef.current?.scrollTop || window.scrollY;
        sessionStorage.setItem('submissions-scroll-position', scrollY.toString());
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!isNavigatingBack && (difficulty !== "All" || selectedTags.length > 0)) {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      } else {
        window.scrollTo(0, 0);
      }
    }
  }, [difficulty, selectedTags, isNavigatingBack]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    submissions.forEach(s => s.tags.forEach(t => set.add(t)));
    return Array.from(set).sort();
  }, []);

  const filtered = useMemo(() => {
    return submissions.filter((s) => {
      const matchQ = s.title.toLowerCase().includes(query.toLowerCase());
      const matchD = difficulty === "All" ? true : s.difficulty === difficulty;
      const matchTags = selectedTags.length === 0 ? true : selectedTags.some(t => s.tags.includes(t));
      return matchQ && matchD && matchTags;
    });
  }, [query, difficulty, selectedTags]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-emerald-600 dark:text-emerald-400';
      case 'Medium': return 'text-amber-600 dark:text-amber-400';
      case 'Hard': return 'text-rose-600 dark:text-rose-400';
      default: return 'text-slate-600 dark:text-slate-400';
    }
  };

  const getDifficultyBg = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200/50 dark:border-emerald-800/30';
      case 'Medium': return 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200/50 dark:border-amber-800/30';
      case 'Hard': return 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-200/50 dark:border-rose-800/30';
      default: return 'bg-slate-50/80 dark:bg-slate-950/30 border-slate-200/50 dark:border-slate-800/30';
    }
  };

  return (
    <div 
      className="flex flex-col min-h-[100dvh] bg-gradient-to-br from-slate-50 via-white to-slate-100/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800/50 text-foreground relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-slate-200/40 to-slate-300/40 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-slate-200/40 to-slate-300/40 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-transparent to-transparent dark:from-emerald-900/10 dark:to-teal-900/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-transparent to-transparent dark:from-amber-900/15 dark:to-orange-900/15 rounded-full blur-2xl"></div>
      </div>

      <main className="flex-1 overflow-hidden relative z-10">
        <div 
          ref={scrollContainerRef}
          className="h-full overflow-y-auto"
        >
          <Helmet>
            <title>All Submissions – DSA Tracker</title>
            <meta name="description" content="Browse and filter all your coding submissions and solutions." />
            <link rel="canonical" href="/submissions" />
          </Helmet>

          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <header className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl mb-4 shadow-lg shadow-slate-200/50 dark:shadow-purple-900/20">
                <BookOpen className="w-6 h-6 text-slate-700 dark:text-purple-400" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-slate-200 dark:via-purple-200 dark:to-slate-200 bg-clip-text text-transparent mb-3">
                My Code Solutions
              </h1>
              <p className="text-base text-slate-700 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Track your progress, review solutions, and master algorithms with your personalized coding journey
              </p>
            </header>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="backdrop-blur-sm bg-white/80 dark:bg-slate-800/70 border border-white/40 dark:border-slate-700/50 rounded-lg p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-slate-500/20 dark:hover:shadow-purple-400/20 group">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-purple-900/30 dark:to-pink-900/30 rounded-md flex items-center justify-center shadow-sm">
                    <Code className="w-3 h-3 text-slate-700 dark:text-purple-400" />
                  </div>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-400">Total</span>
                </div>
                <div className="text-lg font-bold text-slate-900 dark:text-slate-200">{submissions.length}</div>
              </div>
              
              <div className="backdrop-blur-sm bg-white/80 dark:bg-slate-800/70 border border-white/40 dark:border-slate-700/50 rounded-lg p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/20 dark:hover:shadow-emerald-400/20 group">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 bg-gradient-to-br from-emerald-200 to-emerald-300 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-md flex items-center justify-center shadow-sm">
                    <TrendingUp className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
                  </div>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-400">Easy</span>
                </div>
                <div className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                  {submissions.filter(s => s.difficulty === 'Easy').length}
                </div>
              </div>
              
              <div className="backdrop-blur-sm bg-white/80 dark:bg-slate-800/70 border border-white/40 dark:border-slate-700/50 rounded-lg p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-amber-500/20 dark:hover:shadow-amber-400/20 group">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 bg-gradient-to-br from-amber-200 to-amber-300 dark:from-amber-900/30 dark:to-amber-800/30 rounded-md flex items-center justify-center shadow-sm">
                    <TrendingUp className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                  </div>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-400">Medium</span>
                </div>
                <div className="text-lg font-bold text-amber-700 dark:text-amber-400">
                  {submissions.filter(s => s.difficulty === 'Medium').length}
                </div>
              </div>
              
              <div className="backdrop-blur-sm bg-white/80 dark:bg-slate-800/70 border border-white/40 dark:border-slate-700/50 rounded-lg p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-rose-500/20 dark:hover:shadow-rose-400/20 group">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 bg-gradient-to-br from-rose-200 to-rose-300 dark:from-rose-900/30 dark:to-rose-800/30 rounded-md flex items-center justify-center shadow-sm">
                    <TrendingUp className="w-3 h-3 text-rose-700 dark:text-rose-400" />
                  </div>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-400">Hard</span>
                </div>
                <div className="text-lg font-bold text-rose-700 dark:text-rose-400">
                  {submissions.filter(s => s.difficulty === 'Hard').length}
                </div>
              </div>
            </div>

            <div className="backdrop-blur-sm bg-white/90 dark:bg-slate-800/80 border border-white/50 dark:border-slate-700/50 rounded-lg p-3 mb-6 shadow-lg">
              <h2 className="text-sm font-semibold mb-3 text-slate-900 dark:text-slate-200 flex items-center gap-2">
                <div className="w-5 h-5 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-md flex items-center justify-center shadow-sm">
                  <Filter className="w-2.5 h-2.5 text-slate-700 dark:text-blue-400" />
                </div>
                Study Filters
              </h2>
          
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
                  <Input 
                    placeholder="Search submissions..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    aria-label="Search submissions by title"
                    className="pl-8 h-8 text-sm bg-white/70 dark:bg-slate-700/50 border-slate-300/70 dark:border-slate-600/50 focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 rounded-md w-full shadow-sm"
                  />
                </div>
                
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger aria-label="Filter by difficulty" className="h-8 text-sm bg-white/70 dark:bg-slate-700/50 border-slate-300/70 dark:border-slate-600/50 focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 rounded-md w-full shadow-sm hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-purple-50/80 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 hover:shadow-lg hover:shadow-blue-200/50 dark:hover:shadow-blue-900/20 transition-all duration-300">
                    <SelectValue placeholder="Difficulty"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Difficulties</SelectItem>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-8 text-sm justify-between bg-white/70 dark:bg-slate-700/50 border-slate-300/70 dark:border-slate-600/50 hover:bg-gradient-to-r hover:from-purple-50/80 hover:to-pink-50/80 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 hover:border-purple-300/70 dark:hover:border-purple-500/70 rounded-md w-full shadow-sm text-slate-900 dark:text-slate-200 hover:text-slate-900 dark:hover:text-slate-200 hover:shadow-lg hover:shadow-purple-200/50 dark:hover:shadow-purple-900/20 transition-all duration-300">
                      <div className="flex items-center gap-1.5">
                        <Tag className="w-3 h-3" />
                        <span>Topics</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {selectedTags.length > 0 && (
                          <span className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-1 py-0.5 rounded-full">
                            {selectedTags.length}
                          </span>
                        )}
                        <ChevronDown className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full max-h-64 overflow-y-auto bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-xl">
                    {allTags.map(tag => (
                      <DropdownMenuCheckboxItem
                        key={tag}
                        checked={selectedTags.includes(tag)}
                        onCheckedChange={(v) => {
                          setSelectedTags(prev => v ? [...prev, tag] : prev.filter(t => t !== tag));
                        }}
                        className="hover:bg-slate-100/50 dark:hover:bg-slate-700/50"
                      >
                        {tag}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {(selectedTags.length > 0 || difficulty !== "All") && (
                <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
                  <div className="flex flex-wrap items-center gap-1">
                    {difficulty !== "All" && (
                      <span className={`px-1.5 py-0.5 rounded-md text-xs font-medium border ${getDifficultyColor(difficulty)} ${getDifficultyBg(difficulty)} backdrop-blur-sm flex items-center`}>
                        {difficulty}
                      </span>
                    )}
                    {selectedTags.map(tag => {
                      const colorClass = getTagColor(tag);
                      return (
                        <span 
                          key={tag}
                          className={`px-1.5 py-0.5 rounded-md text-xs font-medium ${colorClass} backdrop-blur-sm flex items-center gap-1 hover:scale-105 transition-transform`}
                        >
                          {tag}
                          <button
                            onClick={() => setSelectedTags(prev => prev.filter(t => t !== tag))}
                            className="hover:bg-white/20 dark:hover:bg-slate-700/20 rounded-full p-0.5 transition-colors ml-0.5"
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedTags([]);
                        setDifficulty("All");
                        sessionStorage.removeItem('submissions-scroll-position');
                      }}
                      className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 h-6 px-2 py-0"
                    >
                      Clear all filters
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-4">
              <p className="text-xs text-slate-700 dark:text-slate-400 flex items-center gap-2">
                <Eye className="w-3.5 h-3.5" />
                Showing {filtered.length} of {submissions.length} submissions
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((s: Submission) => (
                <Link 
                  key={s.id} 
                  to={`/submissions/${s.id}`}
                  onClick={() => {
                    const scrollY = scrollContainerRef.current?.scrollTop || window.scrollY;
                    sessionStorage.setItem('submissions-scroll-position', scrollY.toString());
                  }}
                  className="
                    backdrop-blur-sm bg-white/90 dark:bg-slate-800/80 
                    border border-white/50 dark:border-slate-700/50
                    rounded-lg p-3 shadow-lg 
                    hover:shadow-2xl transition-all duration-300 
                    transform-gpu hover:scale-[1.02] origin-center
                    group overflow-hidden hover:bg-white/95 dark:hover:bg-slate-800/90
                    cursor-pointer block
                    hover:shadow-slate-500/20 dark:hover:shadow-purple-400/20
                  "
                >
                  <div className="flex items-start justify-between mb-2">
                    <h2 className="font-semibold text-sm text-slate-900 dark:text-slate-200 group-hover:text-slate-700 dark:group-hover:text-purple-400 transition-colors leading-tight line-clamp-2 flex-1 mr-2">
                      {s.title}
                    </h2>
                    <span className={`px-1.5 py-0.5 rounded-md text-xs font-medium border ${getDifficultyColor(s.difficulty)} ${getDifficultyBg(s.difficulty)} backdrop-blur-sm flex-shrink-0`}>
                      {s.difficulty}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mb-2">
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-sm flex items-center justify-center shadow-sm">
                        <Code className="w-2 h-2 text-slate-700 dark:text-blue-400" />
                      </div>
                      {s.platform}
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-sm flex items-center justify-center shadow-sm">
                        <Calendar className="w-2 h-2 text-slate-700 dark:text-emerald-400" />
                      </div>
                      {new Date(s.date).toLocaleDateString()}
                    </span>
                  </div>
                
                  <p className="text-xs text-slate-700 dark:text-slate-400 line-clamp-2 mb-2 leading-relaxed">
                    {s.summary}
                  </p>
                 
                  <div className="flex flex-wrap gap-1">
                    {s.tags.slice(0, 3).map(tag => {
                      const colorClass = getTagColor(tag);
                      return (
                        <span 
                          key={tag}
                          className={`px-1.5 py-0.5 ${colorClass} rounded-md text-xs font-medium backdrop-blur-sm`}
                        >
                          {tag}
                        </span>
                      );
                    })}
                    {s.tags.length > 3 && (
                      <span className="px-1.5 py-0.5 bg-slate-100/80 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50 rounded-md text-xs font-medium backdrop-blur-sm">
                        +{s.tags.length - 3}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">No submissions found</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 max-w-md mx-auto leading-relaxed">
                  Try adjusting your search criteria or filters to find what you're looking for
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuery("");
                    setDifficulty("All");
                    setSelectedTags([]);
                    sessionStorage.removeItem('submissions-scroll-position');
                  }}
                  className="bg-white/50 dark:bg-slate-700/50 border-slate-200/50 dark:border-slate-600/50 hover:bg-white/70 dark:hover:bg-slate-700/70 rounded-lg"
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}