import React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TagInput } from '@/components/TagInput';
import { CodeBlock } from '@/components/CodeBlock';
import { Button } from '@/components/ui/button';

import { Save, AlertTriangle, Loader2, ArrowLeft, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  platform: string;
  language: string;
  solution: string;
  notes: string;
  tags: string[];
  description?: string;
  examples?: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
}

const mockProblems: Problem[] = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    platform: "LeetCode",
    language: "java",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    solution: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            
            map.put(nums[i], i);
        }
        
        return new int[] {};
    }
}`,
    notes: "Use HashMap to store numbers and their indices for O(n) time complexity.",
    tags: ["Array", "Hash Table", "Two Pointers"],
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "2 + 7 = 9"
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]"
      }
    ]
  },
  {
    id: "longest-substring",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    platform: "LeetCode",
    language: "python",
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    solution: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        char_set = set()
        left = 0
        max_length = 0
        
        for right in range(len(s)):
            while s[right] in char_set:
                char_set.remove(s[left])
                left += 1
            
            char_set.add(s[right])
            max_length = max(max_length, right - left + 1)
        
        return max_length`,
    notes: "Use sliding window technique with a set to track unique characters.",
    tags: ["String", "Sliding Window", "Hash Set"],
    examples: [
      {
        input: 's = "abcabcbb"',
        output: "3",
        explanation: "The answer is 'abc', with the length of 3."
      }
    ]
  }
];

const fetchProblemById = async (id: string): Promise<Problem | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockProblems.find(problem => problem.id === id) || null;
};

const EditableTextarea = ({ 
  value, 
  onChange, 
  placeholder = "Write your notes here...",
  className = "",
  minHeight = "6rem",
  maxHeight = "none",
  disabled = false
}: {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  maxHeight?: string;
  disabled?: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleClick = () => {
    if (disabled) return;
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.select();
    }, 0);
  };

  const handleSave = () => {
    setIsEditing(false);
    if (onChange && editValue !== value) {
      onChange(editValue);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    }
  };

  if (isEditing) {
    return (
      <div className={`relative ${className}`}>
        <textarea
          ref={textareaRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className="w-full bg-background border border-border rounded-lg p-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 focus:border-transparent resize-none"
          style={{ 
            minHeight,
            maxHeight: "200px",
            lineHeight: '1.5',
            overflowY: 'auto'
          }}
          placeholder={placeholder}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          aria-label="Notes editor"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm bg-slate-700 dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl font-semibold border-0 transform hover:scale-105 active:scale-95"
            aria-label="Save changes"
          >
            <Save className="w-4 h-4 mr-2 inline" />
            Save
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold border-0 transform hover:scale-105 active:scale-95"
            aria-label="Cancel editing"
          >
            <X className="w-4 h-4 mr-2 inline" />
            Cancel
          </button>
        </div>
      </div>
    );
  }

  const getDisplayHeight = () => {
    if (!value || value.trim() === '') {
      return minHeight;
    }
    const lines = value.split('\n').length;
    const lineHeight = 24;
    const padding = 24;
    const calculatedHeight = Math.max(parseInt(minHeight), lines * lineHeight + padding);
    return Math.min(calculatedHeight, 200) + 'px';
  };

  return (
    <div className={`relative ${className}`}>
      <textarea
        value={value}
        readOnly
        className="w-full bg-background border border-border rounded-lg p-3 text-foreground resize-none cursor-pointer hover:border-slate-500 dark:hover:border-slate-400 transition-colors"
        style={{ 
          height: getDisplayHeight(),
          lineHeight: '1.5',
          overflowY: 'hidden'
        }}
        placeholder={placeholder}
        disabled={false}
        onClick={handleClick}
        title={disabled ? "" : "Click to edit"}
      />
      {!disabled && (
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="px-2 py-1 text-xs bg-slate-700 dark:bg-slate-600 text-white rounded-md shadow-sm">
            Click to edit
          </div>
        </div>
      )}
    </div>
  );
};

const useProblemData = (problemId: string | undefined) => {
  const [localProblem, setLocalProblem] = useState<Problem | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loadedProblemId, setLoadedProblemId] = useState<string | null>(null);

  const { data: problem, isLoading, error } = useQuery({
    queryKey: ['problem', problemId],
    queryFn: () => fetchProblemById(problemId!),
    enabled: !!problemId,
  });

  useEffect(() => {
    if (problem && loadedProblemId !== problem.id) {
      const savedNotes = localStorage.getItem(`problem-notes-${problem.id}`) || problem.notes;
      const savedTags = localStorage.getItem(`problem-tags-${problem.id}`);
      const savedSolution = localStorage.getItem(`problem-solution-${problem.id}`) || problem.solution;
      
      setLocalProblem({
        ...problem,
        notes: savedNotes,
        tags: savedTags ? JSON.parse(savedTags) : problem.tags,
        solution: savedSolution
      });
      setHasUnsavedChanges(false);
      setLoadedProblemId(problem.id);
    }
  }, [problem, loadedProblemId]);

  const updateProblemField = useCallback((field: keyof Problem, value: string | string[]) => {    setLocalProblem(prev => {
      if (!prev) return null;
      return { ...prev, [field]: value };
    });
    setHasUnsavedChanges(true);
  }, []);

  const saveProblem = useCallback(async () => {
    setIsSaving(true);
    try {
      const currentProblem = localProblem;
      if (!currentProblem) return;
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      localStorage.setItem(`problem-notes-${currentProblem.id}`, currentProblem.notes);
      localStorage.setItem(`problem-tags-${currentProblem.id}`, JSON.stringify(currentProblem.tags));
      localStorage.setItem(`problem-solution-${currentProblem.id}`, currentProblem.solution);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to save problem:', error);
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    problem: localProblem,
    isLoading,
    error,
    hasUnsavedChanges,
    isSaving,
    updateProblemField,
    saveProblem
  };
};

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('CodeView Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4">Failed to load problem details</p>
            <Button onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const ResizableSplitter = ({ 
  leftPanel, 
  rightPanel, 
  defaultLeftWidth = 40,
  minLeftWidth = 50,
  maxLeftWidth = 80 
}: {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  defaultLeftWidth?: number;
  minLeftWidth?: number;
  maxLeftWidth?: number;
}) => {
  const savedWidth = localStorage.getItem('codeview-split-width');
  const initialWidth = savedWidth ? parseFloat(savedWidth) : defaultLeftWidth;
  
  const [leftWidth, setLeftWidth] = useState(initialWidth);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const saveSplitPosition = useCallback((width: number) => {
    localStorage.setItem('codeview-split-width', width.toString());
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidth = e.clientX - containerRect.left;
      const containerWidth = containerRect.width;

      const percentage = (newLeftWidth / containerWidth) * 100;
      
      const constrainedPercentage = Math.max(minLeftWidth, Math.min(maxLeftWidth, percentage));

      setLeftWidth(constrainedPercentage);
      saveSplitPosition(constrainedPercentage);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, minLeftWidth, maxLeftWidth]);

  return (
    <div 
      ref={containerRef}
      className={`
        dark:bg-[#0D1117] bg-white
        dark:text-[#E0E0E0] text-gray-900
        flex h-full relative
      `}
      style={{ cursor: isDragging ? 'col-resize' : 'default' }}
    >
      <div 
        className="h-full overflow-auto dark:border-[#30363D] border-gray-200"
        style={{ width: `${leftWidth}%` }}
      >
        {leftPanel}
      </div>

      <div
        className="w-3 bg-border hover:bg-border/80 cursor-col-resize transition-colors relative z-10 flex items-center justify-center"
        onMouseDown={handleMouseDown}
        style={{ minWidth: '12px' }}
      >
        <div className="w-1 h-16 bg-muted-foreground/30 rounded-full opacity-70"></div>
      </div>

      <div 
        className="h-full overflow-auto dark:bg-[#161B22] bg-gray-50"
        style={{ width: `${100 - leftWidth}%` }}
      >
        {rightPanel}
      </div>
    </div>
  );
};

const LoadingState = () => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
      <div className="text-lg">Loading problem...</div>
    </div>
  </div>
);

const ErrorState = () => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
      <div className="text-lg text-destructive mb-4">Problem not found</div>
      <div className="text-muted-foreground mb-4">The requested problem could not be loaded.</div>
      <Link to="/problems">
        <Button variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Problems
        </Button>
      </Link>
    </div>
  </div>
);

const CodeViewPage = () => {
  const { id } = useParams<{ id: string }>();

  const [isMobile, setIsMobile] = useState(false);
  
  const {
    problem,
    isLoading,
    error,
    hasUnsavedChanges,
    isSaving,
    updateProblemField,
    saveProblem
  } = useProblemData(id);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getDifficultyVariant = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
    if (difficulty === 'Easy') return 'default';
    if (difficulty === 'Medium') return 'secondary';
    return 'destructive';
  };

  const getLanguageBadgeStyle = (language: string) => {
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'js':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700';
      case 'python':
      case 'py':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700';
      case 'java':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-700';
      case 'cpp':
      case 'c++':
      case 'c':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-700';
      case 'typescript':
      case 'ts':
        return 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-200 border-cyan-200 dark:border-cyan-700';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !problem) {
    return <ErrorState />;
  }

  if (isMobile) {
    return (
      <ErrorBoundary>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Link to="/problems">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
            </div>
            <h1 className="text-4xl font-bold text-primary mb-4">{problem.title}</h1>
            <div className="flex flex-wrap gap-3 items-center">
              <Badge variant={getDifficultyVariant(problem.difficulty)} className="text-sm px-3 py-1">
                {problem.difficulty}
              </Badge>
              <Badge variant="outline" className="text-sm px-3 py-1">
                {problem.platform}
              </Badge>
            </div>
          </div>

          <div className="space-y-8">
            <Card className="bg-card border-border rounded-xl shadow-lg">
              <CardHeader className="border-b border-border/50">
                <CardTitle className="text-card-foreground text-xl font-semibold">Problem Description</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Problem Statement</h3>
                    <p className="text-muted-foreground">
                      {problem.description}
                    </p>
                  </div>
                  {problem.examples && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Examples</h3>
                      <div className="space-y-3">
                        {problem.examples.map((example, i) => (
                          <div key={i} className="bg-muted/50 p-3 rounded-lg">
                            <p className="font-medium">Example {i + 1}:</p>
                            <p className="text-sm text-muted-foreground">Input: {example.input}</p>
                            <p className="text-sm text-muted-foreground">Output: {example.output}</p>
                            {example.explanation && (
                              <p className="text-sm text-muted-foreground">Explanation: {example.explanation}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border rounded-xl shadow-lg">
              <CardHeader className="border-b border-border/50">
                <CardTitle className="flex items-center justify-between text-card-foreground">
                  <span className="text-xl font-semibold">Solution</span>
                  <span className={`px-2 py-1 border rounded text-xs font-medium ${getLanguageBadgeStyle(problem.language)}`}>
                    {problem.language}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="bg-background rounded-b-lg overflow-hidden">
                  <CodeBlock 
                    code={problem.solution} 
                    language={problem.language}
                    editable={true}
                    onChange={(code) => updateProblemField('solution', code)}
                    maxHeight="400px"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border rounded-xl shadow-lg">
              <CardHeader className="border-b border-border/50">
                <CardTitle className="text-card-foreground text-lg font-semibold">Notes</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <EditableTextarea
                  value={problem.notes}
                  onChange={(value) => updateProblemField('notes', value)}
                  placeholder="Add your notes about this problem..."
                  minHeight="120px"
                />
              </CardContent>
            </Card>

            <Card className="bg-card border-border rounded-xl shadow-lg">
              <CardHeader className="border-b border-border/50">
                <CardTitle className="text-card-foreground text-lg font-semibold">Tags</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <TagInput
                  tags={problem.tags}
                  onChange={(tags) => updateProblemField('tags', tags)}
                  placeholder="Add problem tags..."
                  maxTags={8}
                />
              </CardContent>
            </Card>

            <Button
              onClick={saveProblem}
              disabled={!hasUnsavedChanges || isSaving}
              className="w-full"
              size="lg"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="h-screen flex flex-col">
        <div className="flex-shrink-0 p-6 border-b border-border/50 bg-background">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Link to="/problems">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
            </div>
            <Button
              onClick={saveProblem}
              disabled={!hasUnsavedChanges || isSaving}
              size="sm"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-primary mb-3">{problem.title}</h1>
          <div className="flex flex-wrap gap-3 items-center">
            <Badge variant={getDifficultyVariant(problem.difficulty)} className="text-sm px-3 py-1">
              {problem.difficulty}
            </Badge>
            <Badge variant="outline" className="text-sm px-3 py-1">
              {problem.platform}
            </Badge>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <ResizableSplitter
            leftPanel={
              <div className="h-full p-4">
                <Card className="bg-card border-border rounded-xl shadow-lg h-full">
                  <CardHeader className="border-b border-border/50">
                    <CardTitle className="text-card-foreground text-xl font-semibold">Problem Description</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Problem Statement</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {problem.description}
                        </p>
                      </div>
                      {problem.examples && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Examples</h3>
                          <div className="space-y-4">
                            {problem.examples.map((example, i) => (
                              <div key={i} className="bg-muted/50 p-4 rounded-lg">
                                <p className="font-medium mb-2">Example {i + 1}:</p>
                                <p className="text-sm text-muted-foreground mb-1">Input: {example.input}</p>
                                <p className="text-sm text-muted-foreground mb-1">Output: {example.output}</p>
                                {example.explanation && (
                                  <p className="text-sm text-muted-foreground">Explanation: {example.explanation}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            }
            rightPanel={
              <div className="h-full p-4">
                <div className="space-y-6">
                  <Card className="bg-card border-border rounded-xl shadow-lg">
                    <CardHeader className="border-b border-border/50">
                      <CardTitle className="flex items-center justify-between text-card-foreground">
                        <span className="text-xl font-semibold">Solution</span>
                        <span className={`px-2 py-1 border rounded text-xs font-medium ${getLanguageBadgeStyle(problem.language)}`}>
                          {problem.language}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="bg-background rounded-b-lg overflow-hidden">
                        <CodeBlock 
                          code={problem.solution} 
                          language={problem.language}
                          editable={true}
                          onChange={(code) => updateProblemField('solution', code)}
                          maxHeight="400px"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border rounded-xl shadow-lg">
                    <CardHeader className="border-b border-border/50">
                      <CardTitle className="text-card-foreground text-lg font-semibold">Notes</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <EditableTextarea
                        value={problem.notes}
                        onChange={(value) => updateProblemField('notes', value)}
                        placeholder="Add your notes about this problem..."
                        minHeight="120px"
                      />
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border rounded-xl shadow-lg">
                    <CardHeader className="border-b border-border/50">
                      <CardTitle className="text-card-foreground text-lg font-semibold">Tags</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <TagInput
                        tags={problem.tags}
                        onChange={(tags) => updateProblemField('tags', tags)}
                        placeholder="Add problem tags..."
                        maxTags={8}
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            }
            defaultLeftWidth={40}
            minLeftWidth={50}
            maxLeftWidth={80}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default CodeViewPage;