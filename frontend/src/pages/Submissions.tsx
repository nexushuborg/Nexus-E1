import { Helmet } from "react-helmet-async";
import { submissions, type Submission } from "@/data/mock";
import { useMemo, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTheme } from "next-themes";
import { Search, Filter, Tag, Calendar, Code, TrendingUp } from "lucide-react";

export default function Submissions() {
  const { theme, resolvedTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<string>("All");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Check if we're in light mode
  const isLightMode = resolvedTheme === 'light' || theme === 'light';

  // Reset scroll position when filters change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [query, difficulty, selectedTags]);

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
      case 'Easy': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getDifficultyBg = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-400/10 border-green-400/20';
      case 'Medium': return 'bg-yellow-400/10 border-yellow-400/20';
      case 'Hard': return 'bg-red-400/10 border-red-400/20';
      default: return 'bg-gray-400/10 border-gray-400/20';
    }
  };

  const tagColors = useMemo(() => {
    const colors = [
      { bg: 'bg-blue-500/10', text: 'text-blue-600', border: 'border-blue-500/20' },
      { bg: 'bg-green-500/10', text: 'text-green-600', border: 'border-green-500/20' },
      { bg: 'bg-purple-500/10', text: 'text-purple-600', border: 'border-purple-500/20' },
      { bg: 'bg-orange-500/10', text: 'text-orange-600', border: 'border-orange-500/20' },
      { bg: 'bg-pink-500/10', text: 'text-pink-600', border: 'border-pink-500/20' },
      { bg: 'bg-indigo-500/10', text: 'text-indigo-600', border: 'border-indigo-500/20' },
      { bg: 'bg-teal-500/10', text: 'text-teal-600', border: 'border-teal-500/20' },
      { bg: 'bg-cyan-500/10', text: 'text-cyan-600', border: 'border-cyan-500/20' },
      { bg: 'bg-emerald-500/10', text: 'text-emerald-600', border: 'border-emerald-500/20' },
      { bg: 'bg-violet-500/10', text: 'text-violet-600', border: 'border-violet-500/20' },
    ];
    
    return (tag: string) => {
      const hash = tag.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      return colors[Math.abs(hash) % colors.length];
    };
  }, []);

  return (
    <div 
      className="flex flex-col min-h-[100dvh] bg-background text-foreground"
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: 'hsl(var(--muted-foreground)) hsl(var(--muted))',
        // Webkit styles
        '--scrollbar-track': 'hsl(var(--muted))',
        '--scrollbar-thumb': 'hsl(var(--muted-foreground))',
        '--scrollbar-thumb-hover': 'hsl(var(--primary))',
      } as React.CSSProperties}
    >
      <main className="flex-1 overflow-hidden">
        <div 
          className="h-full overflow-y-auto [@media(pointer:coarse)]:scrollbar-hide"
          style={{ scrollbarGutter: 'stable' }}
        >
          <Helmet>
            <title>All Submissions – DSA Tracker</title>
            <meta name="description" content="Browse and filter all your coding submissions and solutions." />
            <link rel="canonical" href="/submissions" />
          </Helmet>

          <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header Section */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-[#F000FF] mb-2">
            All Submissions
          </h1>
          <p className="text-muted-foreground">
            Browse and filter your coding submissions and solutions
          </p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white dark:bg-[#0D1117] border-gray-200 dark:border-[#30363D] rounded-lg border p-3">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-[#F000FF]" />
              <span className="text-xs font-medium text-muted-foreground">Total</span>
            </div>
            <div className="text-xl font-bold text-foreground mt-1">{submissions.length}</div>
          </div>
          
          <div className="bg-white dark:bg-[#0D1117] border-gray-200 dark:border-[#30363D] rounded-lg border p-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-xs font-medium text-muted-foreground">Easy</span>
            </div>
            <div className="text-xl font-bold text-green-400 mt-1">
              {submissions.filter(s => s.difficulty === 'Easy').length}
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#0D1117] border-gray-200 dark:border-[#30363D] rounded-lg border p-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-yellow-400" />
              <span className="text-xs font-medium text-muted-foreground">Medium</span>
            </div>
            <div className="text-xl font-bold text-yellow-400 mt-1">
              {submissions.filter(s => s.difficulty === 'Medium').length}
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#0D1117] border-gray-200 dark:border-[#30363D] rounded-lg border p-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-400" />
              <span className="text-xs font-medium text-muted-foreground">Hard</span>
            </div>
            <div className="text-xl font-bold text-red-400 mt-1">
              {submissions.filter(s => s.difficulty === 'Hard').length}
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white dark:bg-[#0D1117] border-gray-200 dark:border-[#30363D] rounded-lg border p-4 mb-6">
          <h2 className="text-base font-semibold mb-3 text-foreground flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#F000FF]" />
            Filters
          </h2>
          
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search by title…" 
                value={query} 
                onChange={e => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Difficulty"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full md:w-48 justify-between">
                  <Tag className="w-4 h-4 mr-2" />
                  Tags 
                  {selectedTags.length > 0 && (
                    <span className="ml-2 text-xs bg-[#F000FF] text-white px-2 py-1 rounded-full">
                      {selectedTags.length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 max-h-64 overflow-y-auto">
                {allTags.map(tag => (
                  <DropdownMenuCheckboxItem
                    key={tag}
                    checked={selectedTags.includes(tag)}
                    onCheckedChange={(v) => {
                      setSelectedTags(prev => v ? [...prev, tag] : prev.filter(t => t !== tag));
                    }}
                  >
                    {tag}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Active Filters Display */}
          {(selectedTags.length > 0 || difficulty !== "All") && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex flex-wrap gap-2">
                {difficulty !== "All" && (
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(difficulty)} ${getDifficultyBg(difficulty)}`}>
                    {difficulty}
                  </span>
                )}
                {selectedTags.map(tag => {
                  const color = tagColors(tag);
                  return (
                    <span 
                      key={tag}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${color.bg} ${color.text} ${color.border} flex items-center gap-1`}
                    >
                      {tag}
                      <button
                        onClick={() => setSelectedTags(prev => prev.filter(t => t !== tag))}
                        className={`hover:${color.bg.replace('/10', '/20')} rounded-full p-0.5`}
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
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear all
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {filtered.length} of {submissions.length} submissions
          </p>
        </div>

        {/* Submissions Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s: Submission) => (
            <article 
              key={s.id} 
              className="
                bg-white dark:bg-[#0D1117] 
                border-gray-200 dark:border-[#30363D]
                rounded-lg border p-4 shadow-sm 
                hover:shadow-lg transition-all duration-300 
                transform-gpu hover:scale-[1.02] origin-center
                group overflow-hidden
              "
            >
              <div className="flex items-start justify-between mb-2">
                <h2 className="font-semibold text-base text-foreground group-hover:text-[#F000FF] transition-colors">
                  <Link to={`/submissions/${s.id}`} className="hover:underline">
                    {s.title}
                  </Link>
                </h2>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(s.difficulty)} ${getDifficultyBg(s.difficulty)}`}>
                  {s.difficulty}
                </span>
              </div>
              
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                <span className="flex items-center gap-1">
                  <Code className="w-3 h-3" />
                  {s.platform}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(s.date).toLocaleDateString()}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-3 mb-3 leading-relaxed">
                {s.summary}
              </p>
              
              <div className="flex flex-wrap gap-1">
                {s.tags.map(tag => {
                  const color = tagColors(tag);
                  return (
                    <span 
                      key={tag}
                      className={`px-2 py-1 ${color.bg} ${color.text} ${color.border} rounded text-xs font-medium`}
                    >
                      {tag}
                    </span>
                  );
                })}
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-[#F000FF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-[#F000FF]" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No submissions found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or filters
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setQuery("");
                setDifficulty("All");
                setSelectedTags([]);
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  </main>
</div>
);
}