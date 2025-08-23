import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState, useMemo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { revisionTopics, type RevisionTopic, type RevisionStatus } from "@/data/revisionTopics";
import { Search, BookOpen, Filter, TrendingUp, Eye } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Button } from "@/components/ui/button";

const fetchTopics = async (): Promise<RevisionTopic[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return revisionTopics;
};

const StatusBadge = ({ status }: { status: RevisionStatus }) => {
  const getStatusColor = (status: RevisionStatus) => {
    switch (status) {
      case 'Completed':
        return 'text-emerald-600 dark:text-emerald-400';
      case 'In Progress':
        return 'text-amber-600 dark:text-amber-400';
      case 'Not Started':
        return 'text-rose-600 dark:text-rose-400';
      default:
        return 'text-slate-600 dark:text-slate-400';
    }
  };

  const getStatusBg = (status: RevisionStatus) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200/50 dark:border-emerald-800/30';
      case 'In Progress':
        return 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200/50 dark:border-amber-800/30';
      case 'Not Started':
        return 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-200/50 dark:border-rose-800/30';
      default:
        return 'bg-slate-50/80 dark:bg-slate-950/30 border-slate-200/50 dark:border-slate-800/30';
    }
  };

  return (
    <span className={`px-1.5 py-0.5 rounded-md text-xs font-medium border ${getStatusColor(status)} ${getStatusBg(status)} backdrop-blur-sm`}>
      {status}
    </span>
  );
};

const STATS_CONFIG = {
  total: { icon: BookOpen, label: "Total", colorClass: "from-slate-200 to-slate-300 dark:from-purple-900/30 dark:to-pink-900/30", hoverClass: "hover:shadow-slate-500/20 dark:hover:shadow-purple-400/20" },
  completed: { icon: TrendingUp, label: "Completed", colorClass: "from-emerald-200 to-emerald-300 dark:from-emerald-900/30 dark:to-emerald-800/30", hoverClass: "hover:shadow-emerald-500/20 dark:hover:shadow-emerald-400/20" },
  inProgress: { icon: TrendingUp, label: "In Progress", colorClass: "from-amber-200 to-amber-300 dark:from-amber-900/30 dark:to-amber-800/30", hoverClass: "hover:shadow-amber-500/20 dark:hover:shadow-amber-400/20" },
  notStarted: { icon: TrendingUp, label: "Not Started", colorClass: "from-rose-200 to-rose-300 dark:from-rose-900/30 dark:to-rose-800/30", hoverClass: "hover:shadow-rose-500/20 dark:hover:shadow-rose-400/20" }
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

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner': return 'text-emerald-600 dark:text-emerald-400';
    case 'Intermediate': return 'text-amber-600 dark:text-amber-400';
    case 'Advanced': return 'text-rose-600 dark:text-rose-400';
    default: return 'text-slate-600 dark:text-slate-400';
  }
};

const getDifficultyBg = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner': return 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200/50 dark:border-emerald-800/30';
    case 'Intermediate': return 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200/50 dark:border-amber-800/30';
    case 'Advanced': return 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-200/50 dark:border-rose-800/30';
    default: return 'bg-slate-50/80 dark:bg-slate-950/30 border-slate-200/50 dark:border-slate-800/30';
  }
};

const TopicCard = ({ topic, onClick }: { topic: RevisionTopic; onClick: () => void }) => (
  <div 
    onClick={onClick}
    className="backdrop-blur-sm bg-white/90 dark:bg-slate-800/80 border border-white/50 dark:border-slate-700/50 rounded-lg p-5 shadow-lg hover:shadow-xl transition-shadow duration-200 will-change-transform group overflow-hidden hover:bg-white/95 dark:hover:bg-slate-800/90 cursor-pointer block"
    style={{ transform: 'translateZ(0)' }}
    aria-label={`View topic: ${topic.name}`}
  >
    <div className="flex items-start justify-between mb-2">
      <h2 className="font-semibold text-sm text-slate-900 dark:text-slate-200 group-hover:text-slate-700 dark:group-hover:text-purple-400 transition-colors leading-tight line-clamp-2 flex-1 mr-2">
        {topic.name}
      </h2>
      <StatusBadge status={topic.status} />
    </div>
    
         <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mb-2">
       <span className="flex items-center gap-1">
         <div className="w-3 h-3 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-sm flex items-center justify-center shadow-sm">
           <BookOpen className="w-2 h-2 text-slate-700 dark:text-blue-400" />
         </div>
         Topic
       </span>
     </div>
  
    <p className="text-xs text-slate-700 dark:text-slate-400 line-clamp-2 mb-2 leading-relaxed">
      {topic.description}
    </p>
   
    <div className="flex flex-wrap gap-1">
      <span className={`px-1.5 py-0.5 rounded-md text-xs font-medium border ${getDifficultyColor(topic.difficulty)} ${getDifficultyBg(topic.difficulty)} backdrop-blur-sm`}>
        {topic.difficulty}
      </span>
      <div className="flex-1"></div>
    </div>
  </div>
);

interface FilterState {
  query: string;
  difficulty: string;
  status: string;
}

export default function TopicsPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterState>({
    query: "",
    difficulty: "All",
    status: "All"
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-emerald-600 dark:text-emerald-400';
      case 'Intermediate': return 'text-amber-600 dark:text-amber-400';
      case 'Advanced': return 'text-rose-600 dark:text-rose-400';
      default: return 'text-slate-600 dark:text-slate-400';
    }
  };

  const getDifficultyBg = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200/50 dark:border-emerald-800/30';
      case 'Intermediate': return 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200/50 dark:border-amber-800/30';
      case 'Advanced': return 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-200/50 dark:border-rose-800/30';
      default: return 'bg-slate-50/80 dark:bg-slate-950/30 border-slate-200/50 dark:border-slate-800/30';
    }
  };

  const { data: topics = [], isLoading, error } = useQuery({
    queryKey: ['revision-topics'],
    queryFn: fetchTopics,
  });

  const topicStats = useMemo(() => ({
    total: topics.length,
    completed: topics.filter(t => t.status === 'Completed').length,
    inProgress: topics.filter(t => t.status === 'In Progress').length,
    notStarted: topics.filter(t => t.status === 'Not Started').length,
  }), [topics]);

  const filteredTopics = useMemo(() => {
    return topics.filter(topic => {
      const matchQ = topic.name.toLowerCase().includes(filters.query.toLowerCase());
      const matchD = filters.difficulty === "All" ? true : topic.difficulty === filters.difficulty;
      const matchS = filters.status === "All" ? true : topic.status === filters.status;
      return matchQ && matchD && matchS;
    });
  }, [topics, filters.query, filters.difficulty, filters.status]);

  const updateFilter = useCallback(<K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ query: "", difficulty: "All", status: "All" });
  }, []);

  const handleTopicClick = useCallback((topic: RevisionTopic) => {
    navigate(`/topics/${topic.id}`);
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-gradient-to-br from-slate-50 via-white to-slate-100/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800/50 text-foreground relative overflow-hidden">
        <main className="flex-1 overflow-hidden relative z-10">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="flex items-center justify-center h-64">
              <div className="text-lg">Loading topics...</div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-gradient-to-br from-slate-50 via-white to-slate-100/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800/50 text-foreground relative overflow-hidden">
        <main className="flex-1 overflow-hidden relative z-10">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-destructive">Error loading topics</div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col min-h-[100dvh] bg-gradient-to-br from-slate-50 via-white to-slate-100/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800/50 text-foreground relative overflow-hidden"
    >
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
            <title>Topics for Revision – DSA Tracker</title>
            <meta name="description" content="Study DSA topics with interactive flashcards." />
            <link rel="canonical" href="/topics" />
          </Helmet>

          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <header className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl mb-4 shadow-lg shadow-slate-200/50 dark:shadow-purple-900/20">
                <BookOpen className="w-6 h-6 text-slate-700 dark:text-purple-400" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-slate-200 dark:via-purple-200 dark:to-slate-200 bg-clip-text text-transparent mb-3">
                Revision Topics
              </h1>
              <p className="text-base text-slate-700 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Track your progress, review topics, and master algorithms with your personalized revision journey
              </p>
            </header>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <StatCard
                icon={STATS_CONFIG.total.icon}
                label={STATS_CONFIG.total.label}
                value={topicStats.total}
                colorClass={STATS_CONFIG.total.colorClass}
                hoverColorClass={STATS_CONFIG.total.hoverClass}
              />
              <StatCard
                icon={STATS_CONFIG.completed.icon}
                label={STATS_CONFIG.completed.label}
                value={topicStats.completed}
                colorClass={STATS_CONFIG.completed.colorClass}
                hoverColorClass={STATS_CONFIG.completed.hoverClass}
              />
              <StatCard
                icon={STATS_CONFIG.inProgress.icon}
                label={STATS_CONFIG.inProgress.label}
                value={topicStats.inProgress}
                colorClass={STATS_CONFIG.inProgress.colorClass}
                hoverColorClass={STATS_CONFIG.inProgress.hoverClass}
              />
              <StatCard
                icon={STATS_CONFIG.notStarted.icon}
                label={STATS_CONFIG.notStarted.label}
                value={topicStats.notStarted}
                colorClass={STATS_CONFIG.notStarted.colorClass}
                hoverColorClass={STATS_CONFIG.notStarted.hoverClass}
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
                    placeholder="Search topics..."
                    value={filters.query}
                    onChange={(e) => updateFilter('query', e.target.value)}
                    aria-label="Search topics by name"
                    className="pl-8 h-8 text-sm bg-white/70 dark:bg-slate-700/50 border-slate-300/70 dark:border-slate-600/50 focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 rounded-md w-full shadow-sm"
                  />
                </div>
                
                <Select value={filters.difficulty} onValueChange={(value) => updateFilter('difficulty', value)}>
                  <SelectTrigger aria-label="Filter by difficulty" className="h-8 text-sm bg-white/70 dark:bg-slate-700/50 border-slate-300/70 dark:border-slate-600/50 focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 rounded-md w-full shadow-sm hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-purple-50/80 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 hover:shadow-lg hover:shadow-blue-200/50 dark:hover:shadow-blue-900/20 transition-all duration-300">
                    <SelectValue placeholder="Difficulty"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Difficulties</SelectItem>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
                  <SelectTrigger aria-label="Filter by status" className="h-8 text-sm bg-white/70 dark:bg-slate-700/50 border-slate-300/70 dark:border-slate-600/50 focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 rounded-md w-full shadow-sm hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-purple-50/80 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 hover:shadow-lg hover:shadow-blue-200/50 dark:hover:shadow-blue-900/20 transition-all duration-300">
                    <SelectValue placeholder="Status"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Status</SelectItem>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className={`mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-700/50 transition-all duration-300 ease-in-out ${
                (filters.difficulty !== "All" || filters.status !== "All") ? 'opacity-100 max-h-32' : 'opacity-0 max-h-0 overflow-hidden'
              }`}
              style={{ 
                contain: 'layout style paint',
                transform: 'translateZ(0)'
              }}>
                {(filters.difficulty !== "All" || filters.status !== "All") && (
                  <div className="flex flex-wrap items-center gap-1" style={{ transform: 'translateZ(0)' }}>
                    {filters.difficulty !== "All" && (
                      <span className={`px-1.5 py-0.5 rounded-md text-xs font-medium border ${getDifficultyColor(filters.difficulty)} ${getDifficultyBg(filters.difficulty)} backdrop-blur-sm flex items-center gap-1`}>
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
                    {filters.status !== "All" && (
                      <span className="px-1.5 py-0.5 rounded-md text-xs font-medium bg-slate-100/80 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm flex items-center gap-1">
                        {filters.status}
                        <button
                          onClick={() => updateFilter('status', 'All')}
                          className="hover:bg-white/20 dark:hover:bg-slate-700/20 rounded-full p-0.5 transition-colors duration-200 ml-0.5"
                          aria-label={`Remove ${filters.status} filter`}
                        >
                          ×
                        </button>
                      </span>
                    )}
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
                Showing {filteredTopics.length} of {topics.length} topics
              </p>
            </div>

            <div className="min-h-[600px] relative">
              <div 
                className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 transition-all duration-300 ease-in-out ${
                  filteredTopics.length === 0 ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}
                style={{ 
                  contain: 'layout style paint',
                  transform: 'translateZ(0)'
                }}
              >
                {filteredTopics.map((topic) => (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    onClick={() => handleTopicClick(topic)}
                  />
                ))}
              </div>

              <div 
                className={`absolute inset-0 flex items-start justify-center pt-16 transition-all duration-300 ease-in-out ${
                  filteredTopics.length === 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                }`}
              >
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-slate-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">No topics found</h3>
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
