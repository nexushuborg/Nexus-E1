import { Helmet } from "react-helmet-async";
import { useMemo, useState, useCallback, useEffect } from "react";

// Local type definitions (no longer dependent on mock.ts)
type Difficulty = "Easy" | "Medium" | "Hard";

interface Submission {
  id: string;
  title: string;
  platform: "LeetCode" | "GFG" | "CodeStudio";
  difficulty: Difficulty;
  date: string; // ISO
  tags: string[];
  description: string;
  code: string;
  language: string;
  summary: string;
}
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
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
  const [dataSubmissions, setDataSubmissions] = useState<Submission[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [repo, setRepo] = useState<string>("");
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => { setHasMounted(true); }, []);

  useEffect(() => {
    // Split a concatenated/capitalized string into tokens (e.g., "ArrayHashTable" -> ["Array","Hash","Table"]).
    const tokenizeCapitalized = (text: string): string[] => {
      return text.match(/[A-Z]?[a-z]+|[A-Z]+(?![a-z])/g) || [];
    };

    // Recombine tokenized LeetCode topic words into known multi-word tags (preferring 3-word > 2-word > single).
    const mapLeetCodeTokensToTags = (tokens: string[]): string[] => {
      const twoWordCombos: Record<string, string> = {
        "Hash Table": "Hash Table",
        "Two Pointers": "Two Pointers",
        "Binary Search": "Binary Search",
        "Linked List": "Linked List",
        "Dynamic Programming": "Dynamic Programming",
        "Sliding Window": "Sliding Window",
        "Bit Manipulation": "Bit Manipulation",
        "Greedy Algorithm": "Greedy",
        "Breadth First": "Breadth First",
        "Depth First": "Depth First",
      };
      const threeWordCombos: Record<string, string> = {
        "Breadth First Search": "Breadth First Search",
        "Depth First Search": "Depth First Search",
        "Divide And Conquer": "Divide and Conquer",
      };

      const normalizeSingle = (t: string): string => {
        const dict: Record<string, string> = {
          Array: "Array",
          String: "String",
          Strings: "String",
          Stack: "Stack",
          Queue: "Queue",
          Graph: "Graph",
          Tree: "Tree",
          Trees: "Tree",
          Trie: "Trie",
          Heaps: "Heap",
          Heap: "Heap",
          Math: "Math",
          Number: "Math",
          Greedy: "Greedy",
          DP: "Dynamic Programming",
          Bit: "Bit",
          Manipulation: "Manipulation",
          Binary: "Binary",
          Search: "Search",
          Sliding: "Sliding",
          Window: "Window",
          Two: "Two",
          Pointers: "Pointers",
          Linked: "Linked",
          List: "List",
          Dynamic: "Dynamic",
          Programming: "Programming",
          Breadth: "Breadth",
          Depth: "Depth",
          First: "First",
          Divide: "Divide",
          And: "And",
          Conquer: "Conquer",
        };
        return dict[t] || (t.length <= 3 ? t.toUpperCase() : (t[0].toUpperCase() + t.slice(1)));
      };

      const result: string[] = [];
      for (let i = 0; i < tokens.length; ) {
        // Try 3-token combos first
        if (i + 2 < tokens.length) {
          const tri = `${tokens[i]} ${tokens[i + 1]} ${tokens[i + 2]}`;
          if (threeWordCombos[tri]) {
            result.push(threeWordCombos[tri]);
            i += 3;
            continue;
          }
        }
        // Then try 2-token combos
        if (i + 1 < tokens.length) {
          const duo = `${tokens[i]} ${tokens[i + 1]}`;
          if (twoWordCombos[duo]) {
            result.push(twoWordCombos[duo]);
            i += 2;
            continue;
          }
        }
        // Fallback to normalized single token
        result.push(normalizeSingle(tokens[i]));
        i += 1;
      }
      return Array.from(new Set(result));
    };

    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        const configuredRepo = (localStorage.getItem("github-repo") || "").trim();
        // Normalize repo: accept either "owner/repo" or full GitHub URL and convert to "owner/repo".
        let repoSlug = configuredRepo;
        const ghMatch = configuredRepo.match(/^https?:\/\/github\.com\/(?<owner>[^\/#\s]+)\/(?<name>[^\/#\s]+)(?:\.git)?\/?/i);
        if (ghMatch && ghMatch.groups) {
          repoSlug = `${ghMatch.groups.owner}/${ghMatch.groups.name.replace(/\.git$/i, "")}`;
        }
        repoSlug = repoSlug.replace(/^\/+|\/+$/g, "");
        setRepo(repoSlug);
        if (!repoSlug || !/^[-A-Za-z0-9_.]+\/[-A-Za-z0-9_.]+$/.test(repoSlug)) {
          setLoadError("GitHub repository not configured. Set it in Profile.");
          toast({ title: "Repo missing", description: "Set your GitHub repo in Profile to load your submissions." });
          return;
        }
        const cacheBuster = new Date().getTime();
        // Fallback strategy: attempt common branches and locations for dashboard.json.
        const branches = ["main", "master"];
        const paths = ["dashboard.json", "data/dashboard.json"];
        const tried: string[] = [];
        let data: any | null = null;
        for (const branch of branches) {
          for (const path of paths) {
            const url = `https://raw.githubusercontent.com/${repoSlug}/${branch}/${path}?_t=${cacheBuster}`;
            tried.push(url);
            try {
              const res = await fetch(url);
              if (!res.ok) continue;
              data = await res.json();
              if (data) break;
            } catch (_) {
              // ignore and try next
            }
          }
          if (data) break;
        }
        if (!data) {
          throw new Error(`Could not find dashboard.json in ${repoSlug}.`);
        }
        if (Array.isArray(data?.problems)) {
          const mapped: Submission[] = data.problems.map((p: any, idx: number) => {
            const rawPlatform = (p.platform || "").toString();
            const platform: Submission["platform"] =
              rawPlatform.toLowerCase() === "leetcode" ? "LeetCode" :
              rawPlatform.toLowerCase() === "gfg" ? "GFG" :
              "CodeStudio";
            const difficulty = ((p.difficulty || "").toString().toLowerCase());
            const normalizedDifficulty = difficulty === "easy" ? "Easy" : difficulty === "medium" ? "Medium" : "Hard";
            const title = p.problemName || p.id || `Problem ${idx + 1}`;
            const code = p.files?.code || "";
            const readme = (p.files?.readme || "").toString();
            let descriptionText = readme;
            let summary = "";
            // Extract tags from explicit array or derive from README first line/paragraph.
            let tags: string[] = Array.isArray(p.tags) ? p.tags : [];
            if (tags.length === 0 && readme) {
              // Prefer the first paragraph's first line as the tag source.
              const firstBlock = readme.split(/\n\s*\n/)[0] || readme;
              const firstLine = (firstBlock.split(/\n/)[0] || "").trim();
              if (firstLine) {
                if (firstLine.includes(",")) {
                  tags = firstLine.split(",").map((t: string) => t.trim()).filter(Boolean);
                } else {
                  const camelParts = tokenizeCapitalized(firstLine).filter(Boolean).map((t) => t.trim());
                  if (platform === "LeetCode") {
                    tags = mapLeetCodeTokensToTags(camelParts);
                  } else {
                    tags = camelParts;
                  }
                }
                // Remove the first line used for tags from the description so tags don't appear in description
                if (tags.length > 0) {
                  const lines = readme.split(/\n/);
                  lines.shift();
                  descriptionText = lines.join("\n").replace(/^\s*\n/, "");
                }
              }
              // Cleanup and normalize tags (replace underscores/dashes, trim, and title-case).
              tags = tags
                .map((t) => t.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim())
                .filter((t) => t.length > 0)
                .map((t) => t.length <= 3 ? t.toUpperCase() : (t[0].toUpperCase() + t.slice(1)));
              // Deduplicate and limit to top N to keep UI tidy.
              tags = Array.from(new Set(tags)).slice(0, 8);
            }
            // Build summary from cleaned description (fallback to title)
            summary = (descriptionText || readme).slice(0, 220).replace(/\s+/g, " ").trim();
            return {
              id: p.id || `${platform}-${idx}`,
              title,
              platform,
              difficulty: normalizedDifficulty,
              date: p.lastUpdated || new Date().toISOString(),
              tags,
              description: descriptionText,
              code,
              language: (p.language || "javascript").toString().toLowerCase(),
              summary: summary || title,
            } as Submission;
          });
          setDataSubmissions(mapped);
        }
      } catch (e) {
        const hint = repo ? " Ensure the repo is public and contains 'dashboard.json' on main/master (root or data/)." : "";
        setLoadError((e instanceof Error ? e.message : "Failed to load dashboard.json") + hint);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const [filters, setFilters] = useState<FilterState>({
    query: "",
    difficulty: "All",
    selectedTags: []
  });

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    (dataSubmissions || []).forEach(submission => 
      submission.tags.forEach(tag => tagSet.add(tag))
    );
    return Array.from(tagSet).sort();
  }, [dataSubmissions]);

  const submissionStats = useMemo(() => ({
    total: (dataSubmissions || []).length,
    easy: (dataSubmissions || []).filter(s => s.difficulty === 'Easy').length,
    medium: (dataSubmissions || []).filter(s => s.difficulty === 'Medium').length,
    hard: (dataSubmissions || []).filter(s => s.difficulty === 'Hard').length,
  }), [dataSubmissions]);

  const filteredSubmissions = useMemo(() => {
    return (dataSubmissions || []).filter((submission) => {
      const matchesQuery = submission.title.toLowerCase().includes(filters.query.toLowerCase());
      const matchesDifficulty = filters.difficulty === "All" || submission.difficulty === filters.difficulty;
      const matchesTags = filters.selectedTags.length === 0 || 
        filters.selectedTags.some(tag => submission.tags.includes(tag));
      
      return matchesQuery && matchesDifficulty && matchesTags;
    });
  }, [filters.query, filters.difficulty, filters.selectedTags, dataSubmissions]);

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
      className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800/50 text-foreground relative"
    >
      
      <main className="flex-1 overflow-y-auto relative z-10 scroll-smooth">
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

                <DropdownMenu modal={false}>
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
              }`}>
                {(filters.difficulty !== "All" || filters.selectedTags.length > 0) && (
                  <div className="flex flex-wrap items-center gap-1">
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
                Showing {filteredSubmissions.length} of {(dataSubmissions || []).length} submissions
              </p>
              {isLoading && (
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Loading submissions{repo ? ` from ${repo}` : ""}...</p>
              )}
              {loadError && (
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{loadError}</p>
              )}
            </div>

            <div className="min-h-[600px] relative">
              {isLoading && (
                <p className="text-xs text-slate-500 mt-1">Loading submissions{repo ? ` from ${repo}` : ""}...</p>
              )}
              {loadError && (
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{loadError}</p>
              )}
              {dataSubmissions && !isLoading && !loadError && (
                <div 
                  className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 transition-all duration-300 ease-in-out ${hasMounted ? 'opacity-100 scale-100' : ''}`}
                >
                  {filteredSubmissions.map((submission: Submission) => (
                    <SubmissionCard
                      key={submission.id}
                      submission={submission}
                    />
                  ))}
                </div>
              )}
              {!isLoading && !loadError && (dataSubmissions?.length === 0) && (
                <div className="absolute inset-0 flex items-start justify-center pt-16">
                  <p className="text-xs text-slate-500">No submissions found</p>
                </div>
              )}
            </div>
          </div>
      </main>
    </div>
  );
}