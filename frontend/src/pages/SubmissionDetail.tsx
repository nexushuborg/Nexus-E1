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
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "next-themes";
import { useToast } from "@/hooks/use-toast";

// Error Boundary Component
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

// Custom Resizable Splitter Component
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
  // Load saved split position from localStorage
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

  // Save split position to localStorage
  const saveSplitPosition = useCallback((width: number) => {
    localStorage.setItem('submission-split-width', width.toString());
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidth = e.clientX - containerRect.left;
      const containerWidth = containerRect.width;

      // Calculate percentage
      const percentage = (newLeftWidth / containerWidth) * 100;
      
      // Apply constraints - use percentage-based limits
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
      {/* Left Panel */}
      <div 
        className="h-full overflow-auto"
        style={{ width: `${leftWidth}%` }}
      >
        {leftPanel}
      </div>

      {/* Resizer Handle */}
      <div
        className="w-3 bg-border hover:bg-border/80 cursor-col-resize transition-colors relative z-10 flex items-center justify-center"
        onMouseDown={handleMouseDown}
        style={{ minWidth: '12px' }}
      >
        <div className="w-1 h-16 bg-muted-foreground/40 rounded-full opacity-60"></div>
      </div>

      {/* Right Panel */}
      <div 
        className="h-full overflow-auto"
        style={{ width: `${100 - leftWidth}%` }}
      >
        {rightPanel}
      </div>
    </div>
  );
};

// EditableTextarea Component
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
          className="w-full bg-background border border-border rounded-lg p-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#F000FF] focus:border-transparent resize-none"
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
            className="px-4 py-2 text-sm bg-gradient-to-r from-[#F000FF] to-[#FF0080] text-white rounded-lg hover:from-[#E000E0] hover:to-[#E60073] transition-all duration-300 shadow-lg hover:shadow-xl font-semibold border-0 transform hover:scale-105 active:scale-95"
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

  // Display mode - auto-size to content
  const getDisplayHeight = () => {
    if (!value || value.trim() === '') {
      return minHeight;
    }
    // Calculate approximate height based on content
    const lines = value.split('\n').length;
    const lineHeight = 24; // 1.5 * 16px
    const padding = 24; // 12px top + 12px bottom
    const calculatedHeight = Math.max(parseInt(minHeight), lines * lineHeight + padding);
    return Math.min(calculatedHeight, 200) + 'px';
  };

  return (
    <div className={`relative ${className}`}>
      <textarea
        value={value}
        readOnly
        className="w-full bg-background border border-border rounded-lg p-3 text-foreground resize-none cursor-pointer hover:border-[#F000FF]/50 transition-colors"
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
          <div className="px-2 py-1 text-xs bg-[#F000FF]/90 text-white rounded-md shadow-sm">
            Click to edit
          </div>
        </div>
      )}
    </div>
  );
};

// Custom hook for submission data management
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
    
    // Load saved data
    const savedNotes = localStorage.getItem(`notes-${sub.id}`) || "";
    const savedTags = localStorage.getItem(`tags-${sub.id}`);
    const savedCode = localStorage.getItem(`code-${sub.id}`) || sub.code;
    
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
      // Simulate API call delay
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
    // Reset to the original submission code, not the saved code
    const originalSubmissionCode = sub?.code || "";
    console.log('Resetting code to original:', originalSubmissionCode);
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

  // Check if we're in light mode
  const isLightMode = resolvedTheme === 'light' || theme === 'light';
  
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

  // Helper function to get code section classes based on theme
  const getCodeSectionClasses = () => {
    if (isLightMode) {
      return "bg-white border-gray-200";
    }
    return "bg-background border-border";
  };

  // Desktop Layout with Resizable Panels
  const DesktopLayout = () => (
    <div className="h-full">
      <ResizableSplitter
        leftPanel={
          <div className="h-full flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-border bg-card">
              <button 
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'description' 
                    ? 'text-[#F000FF] border-[#F000FF]' 
                    : 'text-muted-foreground border-transparent hover:text-foreground'
                }`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button 
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'analysis' 
                    ? 'text-[#F000FF] border-[#F000FF]' 
                    : 'text-gray-400 border-transparent hover:text-[#F000FF]'
                }`}
                onClick={() => setActiveTab('analysis')}
              >
                AI Analysis ✨
              </button>
            </div>

            {/* Tab Content */}
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
                                <code className="text-[#F000FF] bg-background px-2 py-1 rounded text-sm">
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
                  {/* AI Summary */}
                  <div className={`
                    dark:bg-[#0D1117] dark:border-[#30363D] 
                    bg-white border-gray-200
                    rounded-lg border p-4
                  `}>
                    <h3 className="text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-[#F000FF]" />
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
            {/* Code Header with Tabs */}
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
                        ? 'text-[#F000FF] border-[#F000FF]' 
                        : `${isLightMode ? 'text-gray-600' : 'text-muted-foreground'} border-transparent hover:${isLightMode ? 'text-gray-900' : 'text-foreground'}`
                    }`}
                    onClick={() => setActiveCodeTab('code')}
                  >
                    Code
                  </button>
                  <button 
                    className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                      activeCodeTab === 'notes' 
                        ? 'text-[#F000FF] border-[#F000FF]' 
                        : `${isLightMode ? 'text-gray-600' : 'text-muted-foreground'} border-transparent hover:${isLightMode ? 'text-gray-900' : 'text-foreground'}`
                    }`}
                    onClick={() => setActiveCodeTab('notes')}
                  >
                    Notes
                  </button>
                </div>
                {activeCodeTab === 'code' && (
                  <span className="px-2 py-1 bg-[#F000FF]/10 text-[#F000FF] border border-[#F000FF]/20 rounded text-xs font-medium">
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
                      if (hasUnsavedChanges) {
                        if (window.confirm('Are you sure you want to reset the code to the original? This will discard all unsaved changes.')) {
                          resetCode();
                          toast({
                            title: "Code Reset",
                            description: "Code has been reset to the original version.",
                          });
                        }
                      } else {
                        resetCode();
                        toast({
                          title: "Code Reset",
                          description: "Code has been reset to the original version.",
                        });
                      }
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
                    className={`transition-all duration-300 ease-in-out ${
                      hasUnsavedChanges && !isSaving
                        ? 'dark:bg-[#F000FF] dark:hover:bg-[#F000FF]/90 bg-purple-600 hover:bg-purple-700 dark:text-white text-white shadow-lg shadow-[#F000FF]/25 scale-100' 
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

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto">
              {activeCodeTab === 'code' && (
                <div className="h-full flex flex-col">
                  {/* Code Editor */}
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
                  {/* Personal Notes */}
                  <div className={`
                    dark:bg-[#0D1117] dark:border-[#30363D] 
                    bg-white border-gray-200
                    rounded-lg border p-3
                  `}>
                    <h3 className="text-lg font-semibold mb-2 text-foreground flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#F000FF]" />
                      Personal Notes
                    </h3>
                    <EditableTextarea
                      value={notes}
                      onChange={handleNotesChange}
                      placeholder="Write notes for future revision..."
                      minHeight="6rem"
                    />
                  </div>

                  {/* Tags Section - Below notes */}
                  <div className={`
                    dark:bg-[#0D1117] dark:border-[#30363D] 
                    bg-white border-gray-200
                    rounded-lg border p-3
                  `}>
                    <h3 className="text-lg font-semibold mb-2 text-foreground flex items-center gap-2">
                      <Tag className="w-5 h-5 text-[#F000FF]" />
                      Tags
                    </h3>
                    <TagInput tags={tags} onChange={handleTagsChange} />
                  </div>

                  {/* Save Button - Floating Style */}
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={saveData}
                      disabled={!hasUnsavedChanges || isSaving}
                      className={`px-6 py-3 rounded-full transition-all duration-300 font-medium text-sm shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center ${
                        hasUnsavedChanges && !isSaving
                          ? 'bg-gradient-to-r from-[#F000FF] to-[#FF0080] hover:from-[#E000E0] hover:to-[#E60073] text-white border-0' 
                          : 'bg-gradient-to-r from-gray-400 to-gray-500 text-gray-200 cursor-not-allowed border-0'
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



  // Mobile Layout with Tabs
  const MobileLayout = () => (
    <div className="space-y-4 p-3">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="analysis">AI Analysis ✨</TabsTrigger>
        </TabsList>

        {/* Description Tab */}
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
                        <code className="text-[#F000FF] bg-background px-2 py-1 rounded text-sm">
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

        {/* Code Tab */}
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
              <span className="px-2 py-1 bg-[#F000FF]/10 text-[#F000FF] border border-[#F000FF]/20 rounded text-xs font-medium">
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

        {/* Notes Tab */}
        <TabsContent value="notes" className="space-y-4">
          {/* Personal Notes */}
          <div className={`
            dark:bg-[#0D1117] dark:border-[#30363D] 
            bg-white border-gray-200
            rounded-lg border p-3
          `}>
            <h3 className="text-lg font-semibold mb-2 text-foreground flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#F000FF]" />
              Personal Notes
            </h3>
            <EditableTextarea
              value={notes}
              onChange={handleNotesChange}
              placeholder="Write notes for future revision..."
              minHeight="6rem"
            />
          </div>

          {/* Tags Section - Below notes */}
          <div className={`
            dark:bg-[#0D1117] dark:border-[#30363D] 
            bg-white border-gray-200
            rounded-lg border p-3
          `}>
            <h3 className="text-lg font-semibold mb-2 text-foreground flex items-center gap-2">
              <Tag className="w-5 h-5 text-[#F000FF]" />
              Tags
            </h3>
            <TagInput tags={tags} onChange={handleTagsChange} />
          </div>

          {/* Save Button - Floating Style */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={saveData}
              disabled={!hasUnsavedChanges || isSaving}
              className={`px-6 py-3 rounded-full transition-all duration-300 font-medium text-sm shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center ${
                hasUnsavedChanges && !isSaving
                  ? 'bg-gradient-to-r from-[#F000FF] to-[#FF0080] hover:from-[#E000E0] hover:to-[#E60073] text-white border-0' 
                  : 'bg-gradient-to-r from-gray-400 to-gray-500 text-gray-200 cursor-not-allowed border-0'
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

        {/* AI Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          {/* AI Summary */}
          <div className={`
            dark:bg-[#0D1117] dark:border-[#30363D] 
            bg-white border-gray-200
            rounded-lg border p-4
          `}>
            <h3 className="text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#F000FF]" />
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

        {/* Header */}
        <div className="h-12 bg-card border-b border-border flex items-center px-4">
          {/* Empty header - Run/Submit buttons removed */}
        </div>

        {/* Problem Header */}
        <div className="p-4 border-b border-border bg-background">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-foreground">{sub.title}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(sub.difficulty)} ${getDifficultyBg(sub.difficulty)}`}>
              {sub.difficulty}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#F000FF]/10 text-[#F000FF] border border-[#F000FF]/20">
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

        {/* Main Content - Conditional Layout */}
        <div className="flex-1">
          {isDesktop ? <DesktopLayout /> : <MobileLayout />}
        </div>
      </div>
    </ErrorBoundary>
  );
}