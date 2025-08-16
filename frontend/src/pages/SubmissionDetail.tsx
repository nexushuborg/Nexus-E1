import React from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Tag, AlertCircle, Clock, RotateCcw, Save, AlertTriangle, X } from "lucide-react";
import { submissions, type Submission } from "@/data/mock";
import { CodeBlock } from "@/components/CodeBlock";
import { TagInput } from "@/components/TagInput";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useToast } from "@/hooks/use-toast";

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
    console.error('SubmissionDetail Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4">Failed to load submission details</p>
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
  defaultLeftWidth = 50,
  minLeftWidth = 30,
  maxLeftWidth = 80 
}: {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  defaultLeftWidth?: number;
  minLeftWidth?: number;
  maxLeftWidth?: number;
}) => {
  const savedWidth = localStorage.getItem('submission-split-width');
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
    localStorage.setItem('submission-split-width', width.toString());
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
      className="flex h-full relative"
      style={{ cursor: isDragging ? 'col-resize' : 'default' }}
    >
      <div 
        className="h-full overflow-auto"
        style={{ width: `${leftWidth}%` }}
      >
        {leftPanel}
      </div>

      <div
        className="w-3 bg-border hover:bg-border/80 cursor-col-resize transition-colors relative z-10 flex items-center justify-center"
        onMouseDown={handleMouseDown}
        style={{ minWidth: '12px' }}
      >
        <div className="w-1 h-16 bg-muted-foreground/40 rounded-full opacity-60"></div>
      </div>

      <div 
        className="h-full overflow-auto"
        style={{ width: `${100 - leftWidth}%` }}
      >
        {rightPanel}
      </div>
    </div>
  );
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
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);
      }
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
      return '4rem';
    }
    const lines = value.split('\n').length;
    const lineHeight = 24;
    const padding = 24;
    const calculatedHeight = Math.max(64, lines * lineHeight + padding);
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

const validateLanguageCode = (submissionId: string, language: string, savedCode: string | null, originalCode: string) => {
  if (savedCode && savedCode !== originalCode) {
    const hasJavaScriptSyntax = savedCode.includes('function') || savedCode.includes('const ') || savedCode.includes('let ');
    const hasPythonSyntax = savedCode.includes('def ') || savedCode.includes('class ') || savedCode.includes('import ');
    const hasJavaSyntax = savedCode.includes('public class') || savedCode.includes('public void') || savedCode.includes('public static');
    const hasCppSyntax = savedCode.includes('#include') || savedCode.includes('std::') || savedCode.includes('class Solution {');
    
    let shouldClear = false;
    
    if (language === 'python' && hasJavaScriptSyntax) shouldClear = true;
    if (language === 'javascript' && hasPythonSyntax) shouldClear = true;
    if (language === 'java' && (hasJavaScriptSyntax || hasPythonSyntax)) shouldClear = true;
    if (language === 'cpp' && (hasJavaScriptSyntax || hasPythonSyntax)) shouldClear = true;
    if (language === 'typescript' && (hasPythonSyntax || hasJavaSyntax || hasCppSyntax)) shouldClear = true;
    
    if (shouldClear) {
      localStorage.removeItem(`code-${submissionId}`);
      return originalCode;
    }
  }
  
  return savedCode || originalCode;
};

const useSubmissionData = (submissionId: string | undefined) => {
  const [notes, setNotes] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [code, setCode] = useState<string>("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalCode, setOriginalCode] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [loadedSubmissionId, setLoadedSubmissionId] = useState<string | null>(null);
  const [resetCounter, setResetCounter] = useState(0);

  const sub = submissions.find(s => s.id === submissionId);

  useEffect(() => {
    if (!sub || loadedSubmissionId === sub.id) return;
    
    const savedNotes = localStorage.getItem(`notes-${sub.id}`) || "";
    const savedTags = localStorage.getItem(`tags-${sub.id}`);
    
    const savedCode = validateLanguageCode(sub.id, sub.language, localStorage.getItem(`code-${sub.id}`), sub.code);
    
    setNotes(savedNotes);
    setTags(savedTags ? JSON.parse(savedTags) : (sub.tags || []));
    setCode(savedCode);
    setOriginalCode(savedCode);
    setHasUnsavedChanges(false);
    setLoadedSubmissionId(sub.id);
  }, [submissionId, sub?.id, loadedSubmissionId]);

  const saveData = useCallback(async () => {
    if (!sub) return;
    
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      localStorage.setItem(`notes-${sub.id}`, notes);
      localStorage.setItem(`tags-${sub.id}`, JSON.stringify(tags));
      localStorage.setItem(`code-${sub.id}`, code);
      setOriginalCode(code);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to save data:', error);
    } finally {
      setIsSaving(false);
    }
  }, [sub, notes, tags, code]);

  const resetCode = useCallback(() => {
    const originalSubmissionCode = sub?.code || "";
    setCode(originalSubmissionCode);
    setOriginalCode(originalSubmissionCode);
    setHasUnsavedChanges(false);
    setResetCounter(prev => prev + 1);
  }, [sub?.code]);

  return {
    sub,
    notes,
    setNotes,
    tags,
    setTags,
    code,
    setCode,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    isSaving,
    saveData,
    resetCode,
    resetCounter
  };
};

export default function SubmissionDetail() {
  const { id } = useParams<{ id: string }>();
  const { theme, resolvedTheme } = useTheme();
  const { toast } = useToast();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [activeTab, setActiveTab] = useState('description');
  const [activeCodeTab, setActiveCodeTab] = useState('code');
  
  const {
    sub,
    notes,
    setNotes,
    tags,
    setTags,
    code,
    setCode,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    isSaving,
    saveData,
    resetCode,
    resetCounter
  } = useSubmissionData(id);

  const isLightMode = resolvedTheme === 'light' || theme === 'light';
  
  useEffect(() => {
    sessionStorage.removeItem('submissions-scroll-position');
    
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, [id]);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
    setHasUnsavedChanges(true);
  }, []);

  const handleNotesChange = useCallback((value: string) => {
    setNotes(value);
    setHasUnsavedChanges(true);
  }, []);

  const handleTagsChange = useCallback((newTags: string[]) => {
    setTags(newTags);
    setHasUnsavedChanges(true);
  }, []);

  if (!sub) {
    return (
      <main className="container py-12">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-semibold mb-2">Submission not found</h1>
          <p className="text-muted-foreground">The requested submission could not be loaded.</p>
        </div>
      </main>
    );
  }

  const getDifficultyVariant = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
    if (difficulty === 'Easy') return 'default';
    if (difficulty === 'Medium') return 'secondary';
    return 'destructive';
  };

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

  const getCodeSectionClasses = () => {
    if (isLightMode) {
      return "bg-white border-gray-200";
    }
    return "bg-background border-border";
  };

  const DesktopLayout = () => (
    <div className="h-full">
      <ResizableSplitter
        leftPanel={
          <div className="h-full flex flex-col">
            <div className="flex border-b border-border bg-card">
              <button 
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'description' 
                    ? 'text-slate-700 dark:text-slate-300 border-slate-700 dark:border-slate-300' 
                    : 'text-muted-foreground border-transparent hover:text-foreground'
                }`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button 
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'analysis' 
                    ? 'text-slate-700 dark:text-slate-300 border-slate-700 dark:border-slate-300' 
                    : 'text-gray-400 border-transparent hover:text-slate-700 dark:hover:text-slate-300'
                }`}
                onClick={() => setActiveTab('analysis')}
              >
                AI Analysis ✨
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'description' && (
                <div className="space-y-4">
                  <div className="prose prose-invert max-w-none">
                    <p className="text-foreground leading-relaxed whitespace-pre-line">
                      {sub.description}
                    </p>
                  </div>

                  {sub.examples && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-foreground">Examples</h3>
                      <div className="space-y-4">
                        {sub.examples.map((example, i) => (
                          <div key={i} className={`
                            dark:bg-[#0D1117] dark:border-[#30363D] 
                            bg-white border-gray-200
                            rounded-lg border p-4
                          `}>
                            <div className="space-y-2">
                              <div>
                                <span className="text-muted-foreground text-sm font-medium">Input: </span>
                                <code className="text-slate-700 dark:text-slate-300 bg-background px-2 py-1 rounded text-sm">
                                  {example.input}
                                </code>
                              </div>
                              <div>
                                <span className="text-muted-foreground text-sm font-medium">Output: </span>
                                <code className="text-green-400 bg-background px-2 py-1 rounded text-sm">
                                  {example.output}
                                </code>
                              </div>
                              {example.explanation && (
                                <div>
                                  <span className="text-muted-foreground text-sm font-medium">Explanation: </span>
                                  <span className="text-foreground text-sm">{example.explanation}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'analysis' && (
                <div className="space-y-4">
                  <div className={`
                    dark:bg-[#0D1117] dark:border-[#30363D] 
                    bg-white border-gray-200
                    rounded-lg border p-4
                  `}>
                    <h3 className="text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                      AI Analysis
                    </h3>
                    <p className="text-foreground leading-relaxed mb-4">
                      Get detailed AI-powered analysis of your code solution, including time complexity, space complexity, and optimization suggestions.
                    </p>
                    <Button 
                      className="bg-slate-700 dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                      onClick={() => {
                        console.log('AI Analysis triggered for:', sub.title);
                      }}
                    >
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Analyze Code
                    </Button>
                  </div>

                  <div className={`
                    dark:bg-[#0D1117] dark:border-[#30363D] 
                    bg-white border-gray-200
                    rounded-lg border p-4
                  `}>
                    <h3 className="text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                      AI Summary
                    </h3>
                    <p className="text-foreground leading-relaxed">
                      {sub.summary}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        }
        rightPanel={
          <div className="h-full flex flex-col">
            <div className={`h-12 border-b flex items-center justify-between px-4 ${
              isLightMode 
                ? 'bg-white border-gray-200' 
                : 'bg-card border-border'
            }`}>
              <div className="flex items-center gap-2">
                <div className={`flex border-b ${isLightMode ? 'border-gray-200' : 'border-border'}`}>
                  <button 
                    className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                      activeCodeTab === 'code' 
                        ? 'text-slate-700 dark:text-slate-300 border-slate-700 dark:border-slate-300' 
                        : `${isLightMode ? 'text-gray-600' : 'text-muted-foreground'} border-transparent hover:${isLightMode ? 'text-gray-900' : 'text-foreground'}`
                    }`}
                    onClick={() => setActiveCodeTab('code')}
                  >
                    Code
                  </button>
                  <button 
                    className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                      activeCodeTab === 'notes' 
                        ? 'text-slate-700 dark:text-slate-300 border-slate-700 dark:border-slate-300' 
                        : `${isLightMode ? 'text-gray-600' : 'text-muted-foreground'} border-transparent hover:${isLightMode ? 'text-gray-900' : 'text-foreground'}`
                    }`}
                    onClick={() => setActiveCodeTab('notes')}
                  >
                    Notes
                  </button>
                </div>
                {activeCodeTab === 'code' && (
                  <span className={`px-2 py-1 border rounded text-xs font-medium ${getLanguageBadgeStyle(sub.language)}`}>
                    {sub.language}
                  </span>
                )}
              </div>
              {activeCodeTab === 'code' && (
                <div className="flex items-center gap-2">
                  <button 
                    className={`relative p-2 rounded transition-colors ${
                      isLightMode 
                        ? 'hover:bg-gray-100 text-gray-500' 
                        : 'hover:bg-muted text-muted-foreground'
                    } ${hasUnsavedChanges ? 'text-orange-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20' : ''} border border-transparent hover:border-current`}
                    onClick={() => {
                      resetCode();
                      toast({
                        title: "Code Reset",
                        description: "Code has been reset to the original version.",
                      });
                    }}
                    title={hasUnsavedChanges ? "Reset code to original (discards unsaved changes)" : "Reset code to original"}
                  >
                    <RotateCcw className={`w-4 h-4 ${hasUnsavedChanges ? 'animate-pulse' : ''}`} />
                    {hasUnsavedChanges && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                    )}
                  </button>
                  <Button 
                    size="sm"
                    onClick={saveData}
                    disabled={!hasUnsavedChanges || isSaving}
                    className={`transition-all duration-300 ease-in-out font-semibold ${
                        hasUnsavedChanges && !isSaving
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl scale-100 transform hover:scale-105 active:scale-95 border-0' 
                          : `${isLightMode ? 'bg-gray-200 text-gray-500' : 'bg-muted text-muted-foreground'} cursor-not-allowed scale-95`
                      }`}
                   >
                    {isSaving ? (
                      <>
                        <Save className="w-4 h-4 mr-2 animate-pulse" />
                        Saving...
                      </>
                    ) : hasUnsavedChanges ? (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    ) : (
                      'Saved'
                    )}
                  </Button>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto">
              {activeCodeTab === 'code' && (
                <div className="h-full flex flex-col">
                  <div className={`flex-1 overflow-y-auto ${
                    isLightMode ? 'bg-white' : 'bg-background'
                  }`}>
                    <div className="p-3">
                      <div className={`rounded-lg border ${
                        isLightMode 
                          ? 'bg-gray-50 border-gray-200' 
                          : 'bg-card border-border'
                      }`}>
                        <CodeBlock
                          key={`${sub.id}-${resetCounter}`}
                          code={code}
                          onChange={handleCodeChange}
                          language={sub.language}
                          editable={true}
                          maxHeight="400px"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeCodeTab === 'notes' && (
                <div className="h-full overflow-y-auto p-3">
                  <div className="space-y-4">
                  <div className={`
                    dark:bg-[#0D1117] dark:border-[#30363D] 
                    bg-white border-gray-200
                    rounded-lg border p-3
                  `}>
                    <h3 className="text-lg font-semibold mb-2 text-foreground flex items-center gap-2">
                      <FileText className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                      Personal Notes
                    </h3>
                    <EditableTextarea
                      value={notes}
                      onChange={handleNotesChange}
                      placeholder="Write notes for future revision..."
                      minHeight="4rem"
                    />
                  </div>

                  <div className={`
                    dark:bg-[#0D1117] dark:border-[#30363D] 
                    bg-white border-gray-200
                    rounded-lg border p-3
                  `}>
                    <h3 className="text-lg font-semibold mb-2 text-foreground flex items-center gap-2">
                      <Tag className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                      Tags
                    </h3>
                    <TagInput tags={tags} onChange={handleTagsChange} />
                  </div>

                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={saveData}
                      disabled={!hasUnsavedChanges || isSaving}
                      className={`px-6 py-3 rounded-full transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center ${
                        hasUnsavedChanges && !isSaving
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-xl hover:shadow-2xl' 
                          : 'bg-gray-400 text-gray-200 cursor-not-allowed border-0'
                      }`}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {isSaving ? (
                        <>
                          <Save className="w-4 h-4 mr-2 animate-pulse" />
                          Saving...
                        </>
                      ) : hasUnsavedChanges ? (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Saved
                        </>
                      )}
                    </button>
                  </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        }
        defaultLeftWidth={50}
        minLeftWidth={30}
        maxLeftWidth={80}
      />
    </div>
  );

  const MobileLayout = () => (
    <div className="space-y-4 p-3">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-4 gap-1 p-1 bg-muted rounded-lg">
          <TabsTrigger 
            value="description" 
            className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Description
          </TabsTrigger>
          <TabsTrigger 
            value="code" 
            className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Code
          </TabsTrigger>
          <TabsTrigger 
            value="notes" 
            className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Notes
          </TabsTrigger>
          <TabsTrigger 
            value="analysis" 
            className="text-xs sm:text-sm px-1 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <span className="hidden sm:inline">AI Analysis</span>
            <span className="sm:hidden">AI</span>
            <span className="ml-1">✨</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="space-y-4">
          <div className="prose prose-invert max-w-none">
            <p className="text-foreground leading-relaxed whitespace-pre-line">
              {sub.description}
            </p>
          </div>

          {sub.examples && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">Examples</h3>
              <div className="space-y-4">
                {sub.examples.map((example, i) => (
                  <div key={i} className={`
                    dark:bg-[#0D1117] dark:border-[#30363D] 
                    bg-white border-gray-200
                    rounded-lg border p-4
                  `}>
                    <div className="space-y-2">
                      <div>
                        <span className="text-muted-foreground text-sm font-medium">Input: </span>
                        <code className="text-slate-700 dark:text-slate-300 bg-background px-2 py-1 rounded text-sm">
                          {example.input}
                        </code>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-sm font-medium">Output: </span>
                        <code className="text-green-400 bg-background px-2 py-1 rounded text-sm">
                          {example.output}
                        </code>
                      </div>
                      {example.explanation && (
                        <div>
                          <span className="text-muted-foreground text-sm font-medium">Explanation: </span>
                          <span className="text-foreground text-sm">{example.explanation}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="code" className="space-y-4">
          <div className={`rounded-lg border p-3 ${
            isLightMode 
              ? 'bg-white border-gray-200' 
              : 'bg-card border-border'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-lg font-semibold ${
                isLightMode ? 'text-gray-900' : 'text-foreground'
              }`}>Your Code</h3>
              <span className={`px-2 py-1 border rounded text-xs font-medium ${getLanguageBadgeStyle(sub.language)}`}>
                {sub.language}
              </span>
            </div>
            <div className={`rounded-lg border ${
              isLightMode 
                ? 'bg-gray-50 border-gray-200' 
                : 'bg-background border-border'
            }`}>
              <CodeBlock
                code={code}
                onChange={handleCodeChange}
                language={sub.language}
                editable={true}
                maxHeight="400px"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <div className={`
            dark:bg-[#0D1117] dark:border-[#30363D] 
            bg-white border-gray-200
            rounded-lg border p-3
          `}>
            <h3 className="text-lg font-semibold mb-2 text-foreground flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              Personal Notes
            </h3>
            <EditableTextarea
              value={notes}
              onChange={handleNotesChange}
              placeholder="Write notes for future revision..."
              minHeight="4rem"
            />
          </div>

          <div className={`
            dark:bg-[#0D1117] dark:border-[#30363D] 
            bg-white border-gray-200
            rounded-lg border p-3
          `}>
            <h3 className="text-lg font-semibold mb-2 text-foreground flex items-center gap-2">
              <Tag className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              Tags
            </h3>
            <TagInput tags={tags} onChange={handleTagsChange} />
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={saveData}
              disabled={!hasUnsavedChanges || isSaving}
              className={`px-6 py-3 rounded-full transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center ${
                hasUnsavedChanges && !isSaving
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-xl hover:shadow-2xl' 
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed border-0'
              }`}
              onMouseDown={(e) => e.preventDefault()}
            >
              {isSaving ? (
                <>
                  <Save className="w-4 h-4 mr-2 animate-pulse" />
                  Saving...
                </>
              ) : hasUnsavedChanges ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Saved
                </>
              )}
            </button>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className={`
            dark:bg-[#0D1117] dark:border-[#30363D] 
            bg-white border-gray-200
            rounded-lg border p-4
          `}>
            <h3 className="text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              AI Analysis
            </h3>
            <p className="text-foreground leading-relaxed mb-4">
              Get detailed AI-powered analysis of your code solution, including time complexity, space complexity, and optimization suggestions.
            </p>
            <Button 
              className="bg-slate-700 dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              onClick={() => {
                console.log('AI Analysis triggered for:', sub.title);
              }}
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              Analyze Code
            </Button>
          </div>

          <div className={`
            dark:bg-[#0D1117] dark:border-[#30363D] 
            bg-white border-gray-200
            rounded-lg border p-4
          `}>
            <h3 className="text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              AI Summary
            </h3>
            <p className="text-foreground leading-relaxed">
              {sub.summary}
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <ErrorBoundary>
      <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
        <Helmet>
          <title>{sub.title} – Submission</title>
          <meta name="description" content={`Details and summary for ${sub.title}.`} />
        </Helmet>

        <div className="p-4 border-b border-border bg-background">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-foreground">{sub.title}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(sub.difficulty)} ${getDifficultyBg(sub.difficulty)}`}>
              {sub.difficulty}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {sub.platform}
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {new Date(sub.date).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex-1">
          {isDesktop ? <DesktopLayout /> : <MobileLayout />}
        </div>
      </div>
    </ErrorBoundary>
  );
}