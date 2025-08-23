import { Helmet } from "react-helmet-async";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getTopicById, updateTopicStatus, type RevisionTopic, type RevisionStatus } from "@/data/revisionTopics";
import { submissions } from "@/data/mock";
import { getTagColor } from "@/lib/tagColors";
import { getFlashcardsForTopic, type Flashcard } from "@/data/flashcards";
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, Code, Calendar } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const fetchTopicDetail = async (id: string): Promise<RevisionTopic | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return getTopicById(id) || null;
};

export default function TopicDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [topicStatus, setTopicStatus] = useState<RevisionStatus>('Not Started');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data: topic, isLoading, error } = useQuery({
    queryKey: ['topic-detail', id],
    queryFn: () => fetchTopicDetail(id!),
    enabled: !!id,
  });

  const flashcards = topic ? getFlashcardsForTopic(topic.id) : [];
  const currentCard = flashcards[currentCardIndex];

  useEffect(() => {
    if (topic) {
      setTopicStatus(topic.status);
    }
  }, [topic]);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }

    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    });
  }, [topic?.id]);

  useEffect(() => {
    history.scrollRestoration = 'manual';

    window.scrollTo(0, 0);

    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }

    const resetScroll = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    };

    resetScroll();

    setTimeout(resetScroll, 50);
    setTimeout(resetScroll, 150);
    setTimeout(resetScroll, 300);

    requestAnimationFrame(resetScroll);

    return () => {
      history.scrollRestoration = 'auto';
    };
  }, []);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCurrentCardIndex(prev => prev > 0 ? prev - 1 : prev);
      } else if (e.key === 'ArrowRight') {
        setCurrentCardIndex(prev => prev < flashcards.length - 1 ? prev + 1 : prev);
      }
    };

    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    };

    const handleSwipe = () => {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          setCurrentCardIndex(prev => prev < flashcards.length - 1 ? prev + 1 : prev);
        } else {
          setCurrentCardIndex(prev => prev > 0 ? prev - 1 : prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
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
          <div
            ref={scrollContainerRef}
            className="h-full overflow-y-auto"
            style={{
              scrollBehavior: 'auto',
              transform: 'translateZ(0)',
              willChange: 'scroll-position'
            }}
          >
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

    return submissions.filter(sub =>
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

    setTopicStatus(newStatus);

    updateTopicStatus(topic.id, newStatus);

    queryClient.invalidateQueries({ queryKey: ['revision-topics'] });

    queryClient.invalidateQueries({
      predicate: (query) =>
        query.queryKey[0] === 'revision-topics' ||
        query.queryKey[0] === 'topic-detail'
    });

    queryClient.setQueryData(['topic-detail', topic.id], {
      ...topic,
      status: newStatus
    });

    const selectTrigger = document.querySelector('[data-status-select]');
    if (selectTrigger) {
      selectTrigger.classList.add('animate-pulse');
      setTimeout(() => {
        selectTrigger.classList.remove('animate-pulse');
      }, 1000);
    }
  };



  return (
    <div className="flex flex-col min-h-[100dvh] bg-gradient-to-br from-slate-50 via-white to-slate-100/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800/50 text-foreground relative overflow-hidden">
      <main className="flex-1 overflow-hidden relative z-10">
        <div
          ref={scrollContainerRef}
          className="h-full overflow-y-auto"
          style={{
            scrollBehavior: 'auto',
            transform: 'translateZ(0)',
            willChange: 'scroll-position'
          }}
        >
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
                    <Select value={topicStatus} onValueChange={handleStatusChange}>
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
                    <div className="bg-white/95 dark:bg-slate-800/95 border border-slate-200/50 dark:border-slate-700/50 rounded-xl p-6 h-[550px] flex flex-col shadow-lg hover:shadow-xl transition-all duration-300">
                      {currentCard ? (
                        <>
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
                              Card {currentCardIndex + 1}
                            </div>
                          </div>

                          <div className="text-slate-900 dark:text-slate-100 font-bold text-lg mb-2">
                            {currentCard.type}
                          </div>

                          <div className="flex-1 overflow-y-auto">
                            <div className="text-slate-700 dark:text-slate-300 leading-relaxed text-base font-medium pr-2">
                              {(() => {
                                const lines = currentCard.content.split('\n');
                                const result = [];
                                let currentNumber = null;

                                for (let i = 0; i < lines.length; i++) {
                                  const line = lines[i];
                                  const trimmedLine = line.trim();
                                  if (!trimmedLine) continue;

                                  const numberMatch = trimmedLine.match(/^(\d+)\.\s*(.*)/);
                                  if (numberMatch) {
                                    currentNumber = numberMatch[1];
                                    result.push(
                                      <div key={i} className="mb-1">
                                        <div className="flex-1">
                                          <span className="font-bold">{numberMatch[1]}.</span> {numberMatch[2]}
                                        </div>
                                      </div>
                                    );
                                  } else {
                                    const cleanLine = trimmedLine.replace(/^-\s*/, '');
                                    result.push(
                                      <div key={i} className="mb-1">
                                        <div className="flex-1 ml-4">{cleanLine}</div>
                                      </div>
                                    );
                                  }
                                }

                                return result;
                              })()}
                            </div>
                          </div>

                          <div className="mt-4 p-2 bg-slate-50/80 dark:bg-slate-800/50 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
                              <div className="w-3 h-3 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                                <span className="text-xs">💡</span>
                              </div>
                              {currentCard.studyTip || 'Study Tip: Take a moment to understand this concept before moving to the next card'}
                            </div>
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
                    </div>
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
                  {relatedSubmissions.length > 0 ? (
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
                  ) : (
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
