import { Helmet } from "react-helmet-async";
import { submissions, type Submission } from "@/data/mock";
import { useMemo, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Search, Filter, Tag, Calendar, Code, TrendingUp, BookOpen, Eye, ChevronDown } from "lucide-react";
import { getTagColor } from "@/lib/tagColors";

interface FilterState {
  query: string;
  difficulty: string;
  selectedTags: string[];
}

const STATS_CONFIG = {
  total: { icon: Code, label: "Total", colorClass: "from-slate-200 to-slate-300 dark:from-purple-900/30 dark:to-pink-900/30", hoverClass: "hover:shadow-slate-500/20 dark:hover:shadow-purple-400/20" },
  easy: { icon: TrendingUp, label: "Easy", colorClass: "from-emerald-200 to-emerald-300 dark:from-emerald-900/30 dark:to-emerald-800/30", hoverClass: "hover:shadow-emerald-500/20 dark:hover:shadow-emerald-400/20" },
  medium: { icon: TrendingUp, label: "Medium", colorClass: "from-amber-200 to-amber-300 dark:from-amber-900/30 dark:to-amber-800/30", hoverClass: "hover:shadow-amber-500/20 dark:hover:shadow-amber-400/20" },
  hard: { icon: TrendingUp, label: "Hard", colorClass: "from-rose-200 to-rose-300 dark:from-rose-900/30 dark:to-rose-800/30", hoverClass: "hover:shadow-rose-500/20 dark:hover:shadow-rose-400/20" }
} as const;

const StatCard = ({ icon: Icon, label, value, colorClass, hoverColorClass }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  colorClass: string;
  hoverColorClass: string;
}) => (
  <div className={`backdrop-blur-sm bg-white/80 dark:bg-slate-800/70 border border-white/40 dark:border-slate-700/50 rounded-lg p-3 shadow-lg hover:shadow-xl transition-shadow duration-200 will-change-transform ${hoverColorClass} group`}
       style={{ transform: 'translateZ(0)' }}
  >
    <div className="flex items-center gap-2 mb-1.5">
      <div className={`w-6 h-6 bg-gradient-to-br ${colorClass} rounded-md flex items-center justify-center shadow-sm`}>
        <Icon className="w-3 h-3 text-slate-700 dark:text-purple-400" />
      </div>
      <span className="text-xs font-medium text-slate-700 dark:text-slate-400">{label}</span>
    </div>
    <div className="text-lg font-bold text-slate-900 dark:text-slate-200">{value}</div>
  </div>
);

const SubmissionCard = ({ submission }: { submission: Submission }) => (
  <Link 
    to={`/submissions/${submission.id}`}
    className="backdrop-blur-sm bg-white/90 dark:bg-slate-800/80 border border-white/50 dark:border-slate-700/50 rounded-lg p-5 shadow-lg hover:shadow-xl transition-shadow duration-200 will-change-transform group overflow-hidden hover:bg-white/95 dark:hover:bg-slate-800/90 cursor-pointer block"
    style={{ transform: 'translateZ(0)' }}
    aria-label={`View submission: ${submission.title}`}
  >
    <div className="flex items-start justify-between mb-2">
      <h2 className="font-semibold text-sm text-slate-900 dark:text-slate-200 group-hover:text-slate-700 dark:group-hover:text-purple-400 transition-colors leading-tight line-clamp-2 flex-1 mr-2">
        {submission.title}
      </h2>
      <span className={`px-1.5 py-0.5 rounded-md text-xs font-medium border ${getTagColor(submission.difficulty)} backdrop-blur-sm flex-shrink-0`}>
        {submission.difficulty}
      </span>
    </div>
    
    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mb-2">
      <span className="flex items-center gap-1">
        <div className="w-3 h-3 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-sm flex items-center justify-center shadow-sm">
          <Code className="w-2 h-2 text-slate-700 dark:text-blue-400" />
        </div>
        {submission.platform}
      </span>
      <span className="flex items-center gap-1">
        <div className="w-3 h-3 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-sm flex items-center justify-center shadow-sm">
          <Calendar className="w-2 h-2 text-slate-700 dark:text-emerald-400" />
        </div>
        {new Date(submission.date).toLocaleDateString()}
      </span>
    </div>
  
    <p className="text-xs text-slate-700 dark:text-slate-400 line-clamp-2 mb-2 leading-relaxed">
      {submission.summary}
    </p>
   
    <div className="flex flex-wrap gap-1">
      {submission.tags.slice(0, 3).map(tag => {
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
      {submission.tags.length > 3 && (
        <span className="px-1.5 py-0.5 bg-slate-100/80 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50 rounded-md text-xs font-medium backdrop-blur-sm">
          +{submission.tags.length - 3}
        </span>
      )}
    </div>
  </Link>
);

export default function Submissions() {
  const [filters, setFilters] = useState<FilterState>({
    query: "",
    difficulty: "All",
    selectedTags: []
  });

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    submissions.forEach(submission => 
      submission.tags.forEach(tag => tagSet.add(tag))
    );
    return Array.from(tagSet).sort();
  }, []);

  const submissionStats = useMemo(() => ({
    total: submissions.length,
    easy: submissions.filter(s => s.difficulty === 'Easy').length,
    medium: submissions.filter(s => s.difficulty === 'Medium').length,
    hard: submissions.filter(s => s.difficulty === 'Hard').length,
  }), []);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((submission) => {
      const matchesQuery = submission.title.toLowerCase().includes(filters.query.toLowerCase());
      const matchesDifficulty = filters.difficulty === "All" || submission.difficulty === filters.difficulty;
      const matchesTags = filters.selectedTags.length === 0 || 
        filters.selectedTags.some(tag => submission.tags.includes(tag));
      
      return matchesQuery && matchesDifficulty && matchesTags;
    });
  }, [filters.query, filters.difficulty, filters.selectedTags]);

  const updateFilter = useCallback(<K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ query: "", difficulty: "All", selectedTags: [] });
  }, []);

  const toggleTag = useCallback((tag: string) => {
    setFilters(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter(t => t !== tag)
        : [...prev.selectedTags, tag]
    }));
  }, []);

  const removeTag = useCallback((tag: string) => {
    setFilters(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.filter(t => t !== tag)
    }));
  }, []);

  return (
    <div 
      className="flex flex-col min-h-[100dvh] bg-gradient-to-br from-slate-50 via-white to-slate-100/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800/50 text-foreground relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none will-change-transform" style={{ transform: 'translateZ(0)' }}>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-slate-200/30 to-slate-300/30 dark:from-blue-900/15 dark:to-cyan-900/15 rounded-full blur-2xl opacity-60"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-transparent to-transparent dark:from-emerald-900/8 dark:to-teal-900/8 rounded-full blur-2xl opacity-70"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-transparent to-transparent dark:from-amber-900/10 dark:to-orange-900/10 rounded-full blur-xl opacity-50"></div>
      </div>

      <main className="flex-1 overflow-hidden relative z-10">
        <div 
          className="h-full overflow-y-auto"
          style={{ 
            scrollBehavior: 'smooth',
            transform: 'translateZ(0)',
            willChange: 'scroll-position'
          }}
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
              <StatCard
                icon={STATS_CONFIG.total.icon}
                label={STATS_CONFIG.total.label}
                value={submissionStats.total}
                colorClass={STATS_CONFIG.total.colorClass}
                hoverColorClass={STATS_CONFIG.total.hoverClass}
              />
              <StatCard
                icon={STATS_CONFIG.easy.icon}
                label={STATS_CONFIG.easy.label}
                value={submissionStats.easy}
                colorClass={STATS_CONFIG.easy.colorClass}
                hoverColorClass={STATS_CONFIG.easy.hoverClass}
              />
              <StatCard
                icon={STATS_CONFIG.medium.icon}
                label={STATS_CONFIG.medium.label}
                value={submissionStats.medium}
                colorClass={STATS_CONFIG.medium.colorClass}
                hoverColorClass={STATS_CONFIG.medium.hoverClass}
              />
              <StatCard
                icon={STATS_CONFIG.hard.icon}
                label={STATS_CONFIG.hard.label}
                value={submissionStats.hard}
                colorClass={STATS_CONFIG.hard.colorClass}
                hoverColorClass={STATS_CONFIG.hard.hoverClass}
              />
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
                    value={filters.query}
                    onChange={(e) => updateFilter('query', e.target.value)}
                    aria-label="Search submissions by title"
                    className="pl-8 h-8 text-sm bg-white/70 dark:bg-slate-700/50 border-slate-300/70 dark:border-slate-600/50 focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 rounded-md w-full shadow-sm"
                  />
                </div>
                
                <Select value={filters.difficulty} onValueChange={(value) => updateFilter('difficulty', value)}>
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
                    <Button variant="outline" className="h-8 text-sm justify-between bg-white/70 dark:bg-slate-700/50 border-slate-300/70 dark:border-slate-600/50 focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 rounded-md w-full shadow-sm hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-purple-50/80 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 hover:shadow-lg hover:shadow-blue-200/50 dark:hover:shadow-blue-900/20 transition-all duration-300">
                      <div className="flex items-center gap-1.5">
                        <Tag className="w-3 h-3" />
                        <span>Topics</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {filters.selectedTags.length > 0 && (
                          <span className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white px-1 py-0.5 rounded-full">
                            {filters.selectedTags.length}
                          </span>
                        )}
                        <ChevronDown className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full max-h-64 overflow-y-auto" side="bottom" align="start" sideOffset={4} avoidCollisions={false}>
                    {allTags.map(tag => (
                      <DropdownMenuCheckboxItem
                        key={tag}
                        checked={filters.selectedTags.includes(tag)}
                        onCheckedChange={() => toggleTag(tag)}
                        className="hover:bg-slate-100/50 dark:hover:bg-slate-700/50 text-sm"
                      >
                        {tag}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className={`mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-700/50 transition-all duration-300 ease-in-out ${
                (filters.difficulty !== "All" || filters.selectedTags.length > 0) ? 'opacity-100 max-h-32' : 'opacity-0 max-h-0 overflow-hidden'
              }`}
              style={{ 
                contain: 'layout style paint',
                transform: 'translateZ(0)'
              }}>
                {(filters.difficulty !== "All" || filters.selectedTags.length > 0) && (
                  <div className="flex flex-wrap items-center gap-1" style={{ transform: 'translateZ(0)' }}>
                    {filters.difficulty !== "All" && (
                      <span className={`px-1.5 py-0.5 rounded-md text-xs font-medium border ${getTagColor(filters.difficulty)} backdrop-blur-sm flex items-center gap-1`}>
                        {filters.difficulty}
                        <button
                          onClick={() => updateFilter('difficulty', 'All')}
                          className="hover:bg-white/20 dark:hover:bg-slate-700/20 rounded-full p-0.5 transition-colors duration-200 ml-0.5"
                          aria-label={`Remove ${filters.difficulty} filter`}
                        >
                          ×
                        </button>
                      </span>
                    )}

                    {filters.selectedTags.map(tag => {
                      const colorClass = getTagColor(tag);
                      return (
                        <span 
                          key={tag}
                          className={`px-1.5 py-0.5 rounded-md text-xs font-medium ${colorClass} backdrop-blur-sm flex items-center gap-1`}
                        >
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="hover:bg-white/20 dark:hover:bg-slate-700/20 rounded-full p-0.5 transition-colors duration-200 ml-0.5"
                            aria-label={`Remove ${tag} filter`}
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 h-6 px-2 py-0"
                    >
                      Clear all filters
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs text-slate-700 dark:text-slate-400 flex items-center gap-2">
                <Eye className="w-3.5 h-3.5" />
                Showing {filteredSubmissions.length} of {submissions.length} submissions
              </p>
            </div>

            <div className="min-h-[600px] relative">
              <div 
                className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 transition-all duration-300 ease-in-out ${
                  filteredSubmissions.length === 0 ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}
                style={{ 
                  contain: 'layout style paint',
                  transform: 'translateZ(0)'
                }}
              >
                {filteredSubmissions.map((submission: Submission) => (
                  <SubmissionCard
                    key={submission.id}
                    submission={submission}
                  />
                ))}
              </div>

              <div 
                className={`absolute inset-0 flex items-start justify-center pt-16 transition-all duration-300 ease-in-out ${
                  filteredSubmissions.length === 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                }`}
              >
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-slate-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">No submissions found</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 max-w-md mx-auto leading-relaxed">
                    Try adjusting your search criteria or filters to find what you're looking for
                  </p>
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="bg-white/50 dark:bg-slate-700/50 border-slate-200/50 dark:border-slate-600/50 hover:bg-white/70 dark:hover:bg-slate-700/70 rounded-lg"
                  >
                    Clear all filters
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}