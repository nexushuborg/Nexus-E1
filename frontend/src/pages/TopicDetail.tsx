import { Helmet } from "react-helmet-async";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getTopicById, updateTopicStatus, type RevisionTopic, type RevisionStatus } from "@/data/revisionTopics";
import { getTagColor } from "@/lib/tagColors";
import { getFlashcardsForTopic, type Flashcard } from "@/data/flashcards";
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, Code, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

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

const fetchTopicDetail = async (id: string): Promise<RevisionTopic | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return getTopicById(id) || null;
};

export default function TopicDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [dataSubmissions, setDataSubmissions] = useState<Submission[] | null>(null);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [repo, setRepo] = useState<string>("");

  const { data: topic, isLoading, error } = useQuery({
    queryKey: ['topic-detail', id],
    queryFn: () => fetchTopicDetail(id!),
    enabled: !!id,
  });

  const flashcards = topic ? getFlashcardsForTopic(topic.id) : [];
  const currentCard = flashcards[currentCardIndex];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [topic?.id]);

  // Fetch submissions from GitHub repository
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setIsLoadingSubmissions(true);
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
        let data: any | null = null;
        
        for (const branch of branches) {
          for (const path of paths) {
            const url = `https://raw.githubusercontent.com/${repoSlug}/${branch}/${path}?_t=${cacheBuster}`;
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

                  if (platform === "LeetCode") {
                    const camelParts = tokenizeCapitalized(firstLine).filter(Boolean).map((t) => t.trim());
                    tags = mapLeetCodeTokensToTags(camelParts);
                  } else {
                    // Simple tokenization for non-LeetCode platforms
                    const words = firstLine.split(/\s+/).filter(Boolean);
                    tags = words.slice(0, 5); // Limit to 5 tags
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
        setIsLoadingSubmissions(false);
      }
    };

    fetchSubmissions();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCurrentCardIndex(prev => prev > 0 ? prev - 1 : prev);
      } else if (e.key === 'ArrowRight') {
        setCurrentCardIndex(prev => prev < flashcards.length - 1 ? prev + 1 : prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [flashcards.length]);

  const handlePrevious = () => {
    setCurrentCardIndex(prev => prev > 0 ? prev - 1 : prev);
  };

  const handleNext = () => {
    setCurrentCardIndex(prev => prev < flashcards.length - 1 ? prev + 1 : prev);
  };

  const handleDotClick = (index: number) => {
    setCurrentCardIndex(index);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-gradient-to-br from-slate-50 via-white to-slate-100/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800/50">
        <main className="flex-1 overflow-hidden relative z-10">
          <div className="h-full overflow-y-auto">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <BookOpen className="h-10 w-10 text-slate-600 dark:text-purple-400" />
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                      Loading Topic
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                      Preparing your revision materials...
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-32 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-slate-400 to-slate-600 dark:from-purple-400 dark:to-pink-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <main className="container py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-lg text-destructive mb-4">Topic not found</div>
            <Button onClick={() => navigate('/topics')}>Back to Topics</Button>
          </div>
        </div>
      </main>
    );
  }

  const getRelatedSubmissions = (topicName: string) => {
    if (!dataSubmissions) return [];
    
    const topicTagMap: { [key: string]: string[] } = {
      'Dynamic Programming': ['Dynamic Programming', 'DP', 'Memoization', 'Tabulation'],
      'Arrays': ['Arrays', 'Array'],
      'Strings': ['Strings', 'String', 'String Manipulation'],
      'Linked Lists': ['Linked List', 'Linked Lists'],
      'Trees': ['Trees', 'Tree', 'Binary Tree', 'Binary Search Tree', 'BST'],
      'Graphs': ['Graphs', 'Graph', 'DFS', 'BFS', 'Topological Sort'],
      'Sliding Window': ['Sliding Window'],
      'Two Pointers': ['Two Pointers'],
      'Stack': ['Stack']
    };

    const topicTags = topicTagMap[topicName] || [];

    return dataSubmissions.filter(sub =>
      sub.tags.some(tag =>
        topicTags.some(topicTag =>
          tag.toLowerCase().includes(topicTag.toLowerCase()) ||
          topicTag.toLowerCase().includes(tag.toLowerCase())
        )
      )
    );
  };

  const relatedSubmissions = getRelatedSubmissions(topic.name);

  const handleStatusChange = (newStatus: RevisionStatus) => {
    if (!topic) return;

    updateTopicStatus(topic.id, newStatus);
    queryClient.invalidateQueries({ queryKey: ['revision-topics'] });
  };



  return (
    <div className="flex flex-col min-h-[100dvh] bg-gradient-to-br from-slate-50 via-white to-slate-100/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800/50 text-foreground relative overflow-hidden">
      <main className="flex-1 overflow-hidden relative z-10">
        <div className="h-full overflow-y-auto">
          <Helmet>
            <title>{topic.name} – Topic Detail</title>
            <meta name="description" content={`Details for ${topic.name} revision topic.`} />
          </Helmet>

          <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Header */}
            <header className="mb-8">
              <Button
                variant="ghost"
                onClick={() => navigate('/topics')}
                className="mb-4 hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Topics
              </Button>

              <div className="backdrop-blur-sm bg-white/90 dark:bg-slate-800/80 border border-white/50 dark:border-slate-700/50 rounded-lg p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-slate-200 dark:via-purple-200 dark:to-slate-200 bg-clip-text text-transparent mb-2">
                      {topic.name}
                    </h1>
                    <p className="text-base text-slate-700 dark:text-slate-400 mb-3 leading-relaxed">
                      {topic.description}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-3 ml-4 -mt-1">
                    <Badge className={`${getTagColor(topic.difficulty)} text-sm px-2 py-1 font-medium mt-0`}>
                      {topic.difficulty}
                    </Badge>
                    <Select value={topic.status} onValueChange={handleStatusChange}>
                      <SelectTrigger className="w-40 bg-white/70 dark:bg-slate-700/50 border-slate-300/70 dark:border-slate-600/50" data-status-select>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Not Started">Not Started</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </header>

            <div className="space-y-8">
              <Card className="backdrop-blur-sm bg-white/90 dark:bg-slate-800/80 border border-white/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between text-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-slate-700 dark:text-purple-400" />
                      </div>
                      Topic Revision Cards
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <span className="bg-slate-100/80 dark:bg-slate-800/50 px-3 py-1 rounded-full">
                        {flashcards.length} cards
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pb-2">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">Study Progress</div>
                      <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        {currentCardIndex + 1} of {flashcards.length}
                      </div>
                    </div>
                    <div className="bg-slate-200/50 dark:bg-slate-700/50 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-slate-600 dark:bg-slate-400 h-2 rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: `${((currentCardIndex + 1) / flashcards.length) * 100}%`
                        }}
                      />
                    </div>
                  </div>

                  <div className="group relative">
                    <Card className="w-full min-h-[430px] max-h-[430px] flex flex-col overflow-hidden bg-white/95 dark:bg-slate-800/95 border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                      {currentCard ? (
                        <>
                          {/* Header (fixed at top) */}
                          <CardHeader className="p-4 pb-2 flex-shrink-0">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                                  <BookOpen className="h-2.5 w-2.5 text-slate-600 dark:text-slate-400" />
                                </div>
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/50 px-2 py-0.5 rounded-full">
                                  {currentCard.category}
                                </span>
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                Card {currentCardIndex + 1} of {flashcards.length}
                              </div>
                            </div>
                            <CardTitle className="text-slate-900 dark:text-slate-100 font-bold text-lg">
                              {currentCard.type}
                            </CardTitle>
                          </CardHeader>

                          {/* 🔹 Scrollable content ONLY */}
                          <div className="flex-1 overflow-y-auto px-4 pb-2">
                            <div className="text-slate-700 dark:text-slate-300 leading-relaxed text-base font-medium whitespace-pre-line">
                              {currentCard.content}
                            </div>
                          </div>

                          {/* 🔹 Idea box pinned at bottom */}
                          <div className="p-3 bg-slate-50/80 dark:bg-slate-800/50 
                                          border-t border-slate-200/50 dark:border-slate-700/50 
                                          flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-medium flex-shrink-0">
                            <div className="w-3 h-3 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                              <span className="text-xs">💡</span>
                            </div>
                            {currentCard.studyTip ||
                              "Study Tip: Take a moment to understand this concept before moving to the next card"}
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center text-slate-500 dark:text-slate-400">
                            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No flashcards available for this topic</p>
                          </div>
                        </div>
                      )}
                    </Card>
                  </div>

                  <div className="space-y-1 mt-2">
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentCardIndex === 0}
                        className="mt-1 flex items-center gap-1 bg-white/80 dark:bg-slate-700/60 border-slate-300/70 dark:border-slate-600/50 hover:bg-white/95 dark:hover:bg-slate-700/80 transition-all duration-200 px-2 py-1 text-sm"
                      >
                        <ChevronLeft className="h-3 w-3" />
                        Previous
                      </Button>

                      <div className="flex items-center gap-1.5 mt-1">
                        {flashcards.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => handleDotClick(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 transform hover:scale-110 ${index === currentCardIndex
                                ? 'bg-slate-600 dark:bg-slate-400 shadow-md ring-2 ring-slate-300 dark:ring-slate-600'
                                : 'bg-slate-300/60 dark:bg-slate-600/60 hover:bg-slate-400/80 dark:hover:bg-slate-500/80'
                              }`}
                          />
                        ))}
                      </div>

                      <Button
                        variant="outline"
                        onClick={handleNext}
                        disabled={currentCardIndex === flashcards.length - 1}
                        className="mt-1 flex items-center gap-1 bg-white/80 dark:bg-slate-700/60 border-slate-300/70 dark:border-slate-600/50 hover:bg-white/95 dark:hover:bg-slate-700/80 transition-all duration-200 px-2 py-1 text-sm"
                      >
                        Next
                        <ChevronRight className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="text-center">
                      <div className="inline-flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-800/30 px-3 py-1.5 rounded-full">
                        <span>Use ← → keys</span>
                        <span>•</span>
                        <span>Click dots to jump</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/90 dark:bg-slate-800/80 border border-white/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between text-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg flex items-center justify-center">
                        <Code className="h-4 w-4 text-slate-700 dark:text-purple-400" />
                      </div>
                      Related Submissions
                    </div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/50 px-3 py-1 rounded-full">
                      {relatedSubmissions.length} found
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                                          <p className="text-xs text-slate-700 dark:text-slate-400 flex items-center gap-2">
                        <Code className="w-3.5 h-3.5" />
                        {isLoadingSubmissions && (
                          <span>Loading submissions...</span>
                        )}
                        {loadError && (
                          <span className="text-rose-600 dark:text-rose-400">{loadError}</span>
                        )}
                        {!isLoadingSubmissions && !loadError && (
                          <span>Showing {relatedSubmissions.length} related submissions</span>
                        )}
                      </p>
                  </div>

                  {isLoadingSubmissions && (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                        <Code className="h-10 w-10 text-slate-500 dark:text-slate-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Loading submissions{repo ? ` from ${repo}` : ""}...
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                        Fetching your coding solutions from GitHub
                      </p>
                    </div>
                  )}

                  {loadError && (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 bg-gradient-to-br from-rose-200 to-rose-300 dark:from-rose-900/20 dark:to-rose-800/20 rounded-full flex items-center justify-center mx-auto mb-8">
                        <Code className="h-10 w-10 text-rose-500 dark:text-rose-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-rose-700 dark:text-rose-300 mb-2">
                        Failed to load submissions
                      </h3>
                      <p className="text-rose-600 dark:text-rose-400 mb-4 max-w-sm mx-auto">
                        {loadError}
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => navigate('/profile')}
                        className="bg-white/70 dark:bg-slate-700/50 border-slate-300/70 dark:border-slate-600/50 hover:bg-white/90 dark:hover:bg-slate-700/70"
                      >
                        Configure Repository
                      </Button>
                    </div>
                  )}

                  {!isLoadingSubmissions && !loadError && relatedSubmissions.length > 0 && (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {relatedSubmissions.map((sub) => (
                        <div
                          key={sub.id}
                          className="backdrop-blur-sm bg-white/90 dark:bg-slate-800/80 border border-white/50 dark:border-slate-700/50 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-200 will-change-transform group overflow-hidden hover:bg-white/95 dark:hover:bg-slate-800/90 cursor-pointer block min-h-[180px]"
                          style={{ transform: 'translateZ(0)' }}
                          onClick={() => navigate(`/submissions/${sub.id}`)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-200 group-hover:text-slate-700 dark:group-hover:text-purple-400 transition-colors leading-tight line-clamp-2 flex-1 mr-2">
                              {sub.title}
                            </h3>
                            <span className={`px-1.5 py-0.5 rounded-md text-xs font-medium border ${getTagColor(sub.difficulty)} backdrop-blur-sm flex-shrink-0`}>
                              {sub.difficulty}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mb-2">
                            <span className="flex items-center gap-1">
                              <div className="w-3 h-3 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-sm flex items-center justify-center shadow-sm">
                                <Code className="w-2 h-2 text-slate-700 dark:text-blue-400" />
                              </div>
                              {sub.platform}
                            </span>
                            <span className="flex items-center gap-1">
                              <div className="w-3 h-3 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-sm flex items-center justify-center shadow-sm">
                                <Calendar className="w-2 h-2 text-slate-700 dark:text-emerald-400" />
                              </div>
                              {new Date(sub.date).toLocaleDateString()}
                            </span>
                          </div>

                          <p className="text-xs text-slate-700 dark:text-slate-400 line-clamp-2 mb-2 leading-relaxed">
                            {sub.summary || 'No summary available'}
                          </p>

                          <div className="flex flex-wrap gap-1">
                            {sub.tags.slice(0, 3).map((tag, index) => {
                              const colorClass = getTagColor(tag);
                              return (
                                <span
                                  key={index}
                                  className={`px-1.5 py-0.5 ${colorClass} rounded-md text-xs font-medium backdrop-blur-sm`}
                                >
                                  {tag}
                                </span>
                              );
                            })}
                            {sub.tags.length > 3 && (
                              <span className="px-1.5 py-0.5 bg-slate-100/80 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50 rounded-md text-xs font-medium backdrop-blur-sm">
                                +{sub.tags.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {!isLoadingSubmissions && !loadError && relatedSubmissions.length === 0 && (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full flex items-center justify-center mx-auto mb-8">
                        <Code className="h-10 w-10 text-slate-500 dark:text-slate-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        No related submissions yet
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-4 max-w-sm mx-auto">
                        Start solving problems related to this topic to see your submissions here
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => navigate('/submissions')}
                        className="bg-white/70 dark:bg-slate-700/50 border-slate-300/70 dark:border-slate-600/50 hover:bg-white/90 dark:hover:bg-slate-700/70"
                      >
                        Browse All Submissions
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
