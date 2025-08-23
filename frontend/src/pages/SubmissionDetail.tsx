import React from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Tag,
  AlertCircle,
  Clock,
  RotateCcw,
  Save,
  AlertTriangle,
} from "lucide-react";
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
    console.error("SubmissionDetail Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4">
              Failed to load submission details
            </p>
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
  maxLeftWidth = 80,
}: {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  defaultLeftWidth?: number;
  minLeftWidth?: number;
  maxLeftWidth?: number;
}) => {
  const initialWidth = defaultLeftWidth;

  const [leftWidth, setLeftWidth] = useState(initialWidth);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const saveSplitPosition = useCallback((width: number) => {
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidth = e.clientX - containerRect.left;
      const containerWidth = containerRect.width;

      const percentage = (newLeftWidth / containerWidth) * 100;

      const minRightPanelWidth = 300; 
      const minRightPanelPercentage = (minRightPanelWidth / containerWidth) * 100;
      const maxLeftPanelPercentage = 100 - minRightPanelPercentage;

      const minLeftPanelWidth = 400; 
      const minLeftPanelPercentage = (minLeftPanelWidth / containerWidth) * 100;

      const constrainedPercentage = Math.max(
        Math.max(minLeftWidth, minLeftPanelPercentage),
        Math.min(Math.min(maxLeftWidth, maxLeftPanelPercentage), percentage)
      );

      setLeftWidth(constrainedPercentage);
      saveSplitPosition(constrainedPercentage);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !containerRef.current) return;

      e.preventDefault(); 
      const touch = e.touches[0];
      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidth = touch.clientX - containerRect.left;
      const containerWidth = containerRect.width;

      const percentage = (newLeftWidth / containerWidth) * 100;

      const minRightPanelWidth = 300; 
      const minRightPanelPercentage = (minRightPanelWidth / containerWidth) * 100;
      const maxLeftPanelPercentage = 100 - minRightPanelPercentage;

      const minLeftPanelWidth = 400; 
      const minLeftPanelPercentage = (minLeftPanelWidth / containerWidth) * 100;

      const constrainedPercentage = Math.max(
        Math.max(minLeftWidth, minLeftPanelPercentage),
        Math.min(Math.min(maxLeftWidth, maxLeftPanelPercentage), percentage)
      );

      setLeftWidth(constrainedPercentage);
      saveSplitPosition(constrainedPercentage);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove, { passive: false });
      document.addEventListener("touchend", handleTouchEnd);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging, minLeftWidth, maxLeftWidth, saveSplitPosition]);

  return (
    <div
      ref={containerRef}
      className="flex h-full relative"
      style={{ cursor: isDragging ? "col-resize" : "default" }}
    >
      <div className="h-full flex flex-col flex-shrink-0" style={{ width: `${leftWidth}%` }}>
        {leftPanel}
      </div>

      <div
        className="w-3 bg-border hover:bg-border/80 cursor-col-resize transition-colors relative z-10 flex items-center justify-center flex-shrink-0"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{ minWidth: "12px" }}
      >
        <div className="w-1 h-16 bg-muted-foreground/40 rounded-full opacity-60"></div>
        <div className="absolute inset-0 w-6 -left-1.5" />
      </div>

      <div
        className="h-full flex flex-col flex-1 min-w-0"
      >
        {rightPanel}
      </div>
    </div>
  );
};

const EditableTextarea = ({
  value,
  onSave,
  onFinalSave,
  placeholder = "Write your notes here...",
  className = "",
  minHeight = "6rem",
  maxHeight = "none",
  disabled = false,
}: {
  value: string;
  onSave?: (value: string) => void;
  onFinalSave?: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  maxHeight?: string;
  disabled?: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debounceTimeoutRef = useRef<number>();
  const currentValueRef = useRef(value);

  useEffect(() => {
    if (!isEditing && !isTransitioning) {
      setEditValue(value);
      currentValueRef.current = value;
    }
  }, [value, isEditing, isTransitioning]);

  const debouncedSave = useCallback(
    (val: string) => {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = window.setTimeout(() => {
        onSave?.(val);
      }, 500);
    },
    [onSave]
  );

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    };
  }, []);

  const handleClick = () => {
    if (disabled) return;
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus({ preventScroll: true });
      textareaRef.current?.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length
      );
    }, 10);
  };

  const handleFinalSave = () => {
    const finalValue = editValue;
    currentValueRef.current = finalValue;

    onFinalSave?.(finalValue);

    setTimeout(() => {
      setIsEditing(false);
      setIsTransitioning(false);
    }, 150);
  };

  const handleCancel = () => {
    setIsTransitioning(true);
    setEditValue(value);
    currentValueRef.current = value;

    setTimeout(() => {
      setIsEditing(false);
      setIsTransitioning(false);
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleCancel();
    } else if (e.key === "Enter" && e.ctrlKey) {
      handleFinalSave();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <textarea
        ref={textareaRef}
        value={
          isEditing || isTransitioning ? editValue : currentValueRef.current
        }
        readOnly={!isEditing}
        onChange={
          isEditing
            ? (e) => {
                const newVal = e.target.value;
                setEditValue(newVal);
                currentValueRef.current = newVal;
                debouncedSave(newVal); 
              }
            : undefined
        }
        onKeyDown={isEditing ? handleKeyDown : undefined}
        onBlur={isEditing ? handleFinalSave : undefined}
        onClick={!isEditing && !isTransitioning ? handleClick : undefined}
        className={`w-full bg-background border border-border rounded-lg p-3 text-foreground resize-none transition-all duration-300 ease-in-out ${
          isEditing
            ? "placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400"
            : isTransitioning
            ? "placeholder-muted-foreground"
            : "cursor-pointer hover:border-slate-500 dark:hover:border-slate-400"
        }`}
        style={{
          minHeight,
          maxHeight: isEditing || isTransitioning ? "200px" : "120px",
          lineHeight: "1.5",
          overflowY: "auto",
          opacity: isTransitioning ? 0.9 : 1,
        }}
        placeholder={placeholder}
        spellCheck={false}
      />
    </div>
  );
};

const validateLanguageCode = (
  submissionId: string,
  language: string,
  savedCode: string | null,
  originalCode: string
) => {
  if (savedCode && savedCode !== originalCode) {
    const hasJavaScriptSyntax =
      savedCode.includes("function") ||
      savedCode.includes("const ") ||
      savedCode.includes("let ");
    const hasPythonSyntax =
      savedCode.includes("def ") ||
      savedCode.includes("class ") ||
      savedCode.includes("import ");
    const hasJavaSyntax =
      savedCode.includes("public class") ||
      savedCode.includes("public void") ||
      savedCode.includes("public static");
    const hasCppSyntax =
      savedCode.includes("#include") ||
      savedCode.includes("std::") ||
      savedCode.includes("class Solution {");

    let shouldClear = false;

    if (language === "python" && hasJavaScriptSyntax) shouldClear = true;
    if (language === "javascript" && hasPythonSyntax) shouldClear = true;
    if (language === "java" && (hasJavaScriptSyntax || hasPythonSyntax))
      shouldClear = true;
    if (language === "cpp" && (hasJavaScriptSyntax || hasPythonSyntax))
      shouldClear = true;
    if (
      language === "typescript" &&
      (hasPythonSyntax || hasJavaSyntax || hasCppSyntax)
    )
      shouldClear = true;

    if (shouldClear) {
      return originalCode;
    }
  }

  return savedCode || originalCode;
};

const createPersistentStorage = () => {
  const isLocalStorageAvailable = () => {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  };

  return {
    get: (key: string) => {
      if (isLocalStorageAvailable()) {
        try {
          const item = localStorage.getItem(key);
          return item ? JSON.parse(item) : null;
        } catch {
          return null;
        }
      }
      return null;
    },
    
    set: (key: string, value: any) => {
      if (isLocalStorageAvailable()) {
        try {
          localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
          console.warn('Failed to save to localStorage:', error);
        }
      }
    }
  };
};

const persistentStorage = createPersistentStorage();

const useSubmissionData = (submissionId: string | undefined) => {
  const [notes, setNotes] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [code, setCode] = useState<string>("");
  const [hasUnsavedCodeChanges, setHasUnsavedCodeChanges] = useState(false);
  const [originalCode, setOriginalCode] = useState<string>("");
  const [originalNotes, setOriginalNotes] = useState<string>("");
  const [originalTags, setOriginalTags] = useState<string[]>([]);
  const [isSavingCode, setIsSavingCode] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [loadedSubmissionId, setLoadedSubmissionId] = useState<string | null>(
    null
  );
  const [resetCounter, setResetCounter] = useState(0);

  const sub = submissions.find((s) => s.id === submissionId);

  useEffect(() => {
    if (!sub || loadedSubmissionId === sub.id) return;

    const savedNotes = persistentStorage.get(`notes-${sub.id}`) || "";
    const savedTags = persistentStorage.get(`tags-${sub.id}`);

    const savedCode = validateLanguageCode(
      sub.id,
      sub.language,
      persistentStorage.get(`code-${sub.id}`),
      sub.code
    );

    setNotes(savedNotes);
    setTags(savedTags || sub.tags || []);
    setCode(savedCode);
    setOriginalCode(savedCode);
    setOriginalNotes(savedNotes);
    setOriginalTags(savedTags || sub.tags || []);
    setHasUnsavedCodeChanges(false);
    setLoadedSubmissionId(sub.id);
  }, [submissionId, sub?.id, loadedSubmissionId]);

  const saveCode = useCallback(async () => {
    if (!sub) return;

    setIsSavingCode(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      persistentStorage.set(`code-${sub.id}`, code);
      setOriginalCode(code);
      setHasUnsavedCodeChanges(false);
    } catch (error) {
      console.error("Failed to save code:", error);
    } finally {
      setIsSavingCode(false);
    }
  }, [sub, code]);

  const saveNotesPersist = useCallback(
    async (currentNotes?: string, currentTags?: string[]) => {
      if (!sub) return;

      const notesToSave = currentNotes ?? notes;
      const tagsToSave = currentTags ?? tags;

      try {
        persistentStorage.set(`notes-${sub.id}`, notesToSave);
        persistentStorage.set(`tags-${sub.id}`, tagsToSave);
      } catch (error) {
        console.error("Failed to save notes:", error);
      }
    },
    [sub, notes, tags]
  );

  const saveNotesFinal = useCallback(
    async (currentNotes?: string, currentTags?: string[]) => {
      if (!sub) return;

      const notesToSave = currentNotes ?? notes;
      const tagsToSave = currentTags ?? tags;

      setIsSavingNotes(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        persistentStorage.set(`notes-${sub.id}`, notesToSave);
        persistentStorage.set(`tags-${sub.id}`, tagsToSave);
        setOriginalNotes(notesToSave);
        setOriginalTags(tagsToSave);
        setNotes(notesToSave); 
      } catch (error) {
        console.error("Failed to save notes:", error);
      } finally {
        setIsSavingNotes(false);
      }
    },
    [sub, notes, tags, setNotes]
  );

  const resetCode = useCallback(() => {
    const originalSubmissionCode = sub?.code || "";
    setCode(originalSubmissionCode);
    setOriginalCode(originalSubmissionCode);
    setHasUnsavedCodeChanges(false);
    setResetCounter((prev) => prev + 1);
  }, [sub?.code]);

  return {
    sub,
    notes,
    setNotes,
    tags,
    setTags,
    code,
    setCode,
    hasUnsavedCodeChanges,
    setHasUnsavedCodeChanges,
    originalNotes,
    isSavingCode,
    isSavingNotes,
    saveCode,
    saveNotesPersist,
    saveNotesFinal,
    resetCode,
    resetCounter,
  };
};

const DescriptionContent = ({ sub }: { sub: Submission }) => (
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
            <div
              key={i}
              className="dark:bg-[#0D1117] dark:border-[#30363D] bg-white border-gray-200 rounded-lg border p-4"
            >
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
);

const NotesContent = ({ 
  notes, 
  tags, 
  isSavingNotes, 
  saveNotesPersist, 
  saveNotesFinal, 
  handleTagsChange 
}: {
  notes: string;
  tags: string[];
  isSavingNotes: boolean;
  saveNotesPersist: (val: string, tags: string[]) => void;
  saveNotesFinal: (val: string, tags: string[]) => void;
  handleTagsChange: (newTags: string[]) => void;
}) => (
  <div className="space-y-4">
    <div className="dark:bg-[#0D1117] dark:border-[#30363D] bg-white border-gray-200 rounded-lg border p-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <FileText className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          Personal Notes
        </h3>
        <button
          onClick={() => saveNotesFinal(notes, tags)}
          disabled={isSavingNotes}
          className={`p-2 rounded transition-colors ${
            isSavingNotes
              ? "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-not-allowed"
              : "hover:bg-gray-100 dark:hover:bg-gray-800 text-muted-foreground hover:text-foreground"
          }`}
          title="Save notes"
        >
          <Save className="w-4 h-4" />
        </button>
      </div>
      <EditableTextarea
        value={notes}
        onSave={(val) => saveNotesPersist(val, tags)}
        onFinalSave={(val) => saveNotesFinal(val, tags)}
        placeholder="Write notes for future revision..."
        minHeight="4rem"
      />
    </div>
    
    <div className="bg-card border-border rounded-lg border p-3">
      <h3 className="text-lg font-semibold mb-2 text-foreground flex items-center gap-2">
        <Tag className="w-5 h-5 text-slate-700 dark:text-slate-300" />
        Tags
      </h3>
      <TagInput tags={tags} onChange={handleTagsChange} />
    </div>
  </div>
);

const AnalysisContent = ({ sub }: { sub: Submission }) => (
  <div className="space-y-4">
    <div className="dark:bg-[#0D1117] dark:border-[#30363D] bg-white border-gray-200 rounded-lg border p-4">
      <h3 className="text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-slate-700 dark:text-slate-300" />
        AI Analysis
      </h3>
      <p className="text-foreground leading-relaxed mb-4">
        Get detailed AI-powered analysis of your code solution, including
        time complexity, space complexity, and optimization suggestions.
      </p>
      <Button className="bg-slate-700 dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-700 text-white transition-colors">
        <AlertCircle className="w-4 h-4 mr-2" />
        Analyze Code
      </Button>
    </div>
    <div className="dark:bg-[#0D1117] dark:border-[#30363D] bg-white border-gray-200 rounded-lg border p-4">
      <h3 className="text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-slate-700 dark:text-slate-300" />
        AI Summary
      </h3>
      <p className="text-foreground leading-relaxed">{sub.summary}</p>
    </div>
  </div>
);

const CodeContent = ({ 
  sub, 
  code, 
  hasUnsavedCodeChanges, 
  isSavingCode, 
  resetCounter,
  handleCodeChange, 
  saveCode, 
  resetCode, 
  toast, 
  isLightMode,
  getLanguageBadgeStyle 
}: {
  sub: Submission;
  code: string;
  hasUnsavedCodeChanges: boolean;
  isSavingCode: boolean;
  resetCounter: number;
  handleCodeChange: (newCode: string) => void;
  saveCode: () => void;
  resetCode: () => void;
  toast: any;
  isLightMode: boolean;
  getLanguageBadgeStyle: (language: string) => string;
}) => (
  <div className="space-y-4">
    <div className={`rounded-lg border p-3 ${isLightMode ? "bg-white border-gray-200" : "bg-card border-border"}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-lg font-semibold ${isLightMode ? "text-gray-900" : "text-foreground"}`}>
          Your Code
        </h3>
        <span className={`px-2 py-1 border rounded text-xs font-medium ${getLanguageBadgeStyle(sub.language)}`}>
          {sub.language}
        </span>
      </div>
      <div className={`rounded-lg border ${isLightMode ? "bg-gray-50 border-gray-200" : "bg-background border-border"}`}>
        <CodeBlock
          key={`${sub.id}-${resetCounter}`}
          code={code}
          onChange={handleCodeChange}
          language={sub.language}
          editable={true}
          maxHeight="360px"
        />
      </div>
      <div className="flex items-center gap-2 mt-3 justify-end">
        <button
          className={`relative p-2 rounded transition-colors ${
            isLightMode ? "hover:bg-gray-100 text-gray-500" : "hover:bg-muted text-muted-foreground"
          } ${
            hasUnsavedCodeChanges
              ? "text-orange-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20"
              : ""
          } border border-transparent hover:border-current`}
          onClick={() => {
            resetCode();
            toast({
              title: "Code Reset",
              description: "Code has been reset to the original version.",
            });
          }}
          title={
            hasUnsavedCodeChanges
              ? "Reset code to original (discards unsaved changes)"
              : "Reset code to original"
          }
        >
          <RotateCcw className={`w-4 h-4 ${hasUnsavedCodeChanges ? "animate-pulse" : ""}`} />
          {hasUnsavedCodeChanges && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
          )}
        </button>
        <button
          onClick={saveCode}
          disabled={!hasUnsavedCodeChanges || isSavingCode}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-1.5 ${
            hasUnsavedCodeChanges && !isSavingCode
              ? "bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-not-allowed"
          }`}
        >
          <Save className="w-3.5 h-3.5" />
          {isSavingCode ? "Saving..." : hasUnsavedCodeChanges ? "Save" : "Saved"}
        </button>
      </div>
    </div>
  </div>
);

export default function SubmissionDetail() {
  const { id } = useParams<{ id: string }>();
  const { theme, resolvedTheme } = useTheme();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("description");
  const [activeCodeTab, setActiveCodeTab] = useState("code");

  const {
    sub,
    notes,
    setNotes,
    tags,
    setTags,
    code,
    setCode,
    hasUnsavedCodeChanges,
    setHasUnsavedCodeChanges,
    originalNotes,
    isSavingCode,
    isSavingNotes,
    saveCode,
    saveNotesPersist,
    saveNotesFinal,
    resetCode,
    resetCounter,
  } = useSubmissionData(id);

  const isLightMode = resolvedTheme === "light" || theme === "light";

  useEffect(() => {
    sessionStorage.removeItem("submissions-scroll-position");
    
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [id]);

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
    setHasUnsavedCodeChanges(true);
  }, []);



  const handleTagsChange = useCallback(
    (newTags: string[]) => {
      setTags(newTags);
      if (sub) {
        persistentStorage.set(`tags-${sub.id}`, newTags);
      }
    },
    [sub]
  );

  if (!sub) {
    return (
      <main className="container py-12">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-semibold mb-2">Submission not found</h1>
          <p className="text-muted-foreground">
            The requested submission could not be loaded.
          </p>
        </div>
      </main>
    );
  }

  const getLanguageBadgeStyle = (language: string) => {
    switch (language.toLowerCase()) {
      case "javascript":
      case "js":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700";
      case "python":
      case "py":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700";
      case "java":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-700";
      case "cpp":
      case "c++":
      case "c":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-700";
      case "typescript":
      case "ts":
        return "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-200 border-cyan-200 dark:border-cyan-700";
      default:
        return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    }
  };

  return (
    <ErrorBoundary>
      <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
        <Helmet>
          <title>{sub.title} – Submission</title>
          <meta
            name="description"
            content={`Details and summary for ${sub.title}.`}
          />
        </Helmet>

        <div className="p-4 border-b border-border bg-background flex-shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-foreground">{sub.title}</h1>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${
                sub.difficulty === "Easy"
                  ? "text-green-400 bg-green-400/10 border-green-400/20"
                  : sub.difficulty === "Medium"
                  ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
                  : "text-red-400 bg-red-400/10 border-red-400/20"
              }`}
            >
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

        <div className="flex-1 min-h-0 overflow-hidden">
          <div className="lg:hidden h-full overflow-hidden">
            <div className="h-full flex flex-col p-3">
              <Tabs defaultValue="description" className="w-full h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-4 gap-1 p-1 bg-muted rounded-lg flex-shrink-0">
                  <TabsTrigger
                    value="description"
                    className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    Description
                  </TabsTrigger>
                  <TabsTrigger
                    value="notes"
                    className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    Notes
                  </TabsTrigger>
                  <TabsTrigger
                    value="code"
                    className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    Code
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

                <TabsContent value="description" className="space-y-4 flex-1 overflow-y-auto pb-14">
                  <DescriptionContent sub={sub} />
                </TabsContent>

                <TabsContent value="notes" className="space-y-4 flex-1 overflow-y-auto pb-14">
                  <NotesContent 
                    notes={notes}
                    tags={tags}
                    isSavingNotes={isSavingNotes}
                    saveNotesPersist={saveNotesPersist}
                    saveNotesFinal={saveNotesFinal}
                    handleTagsChange={handleTagsChange}
                  />
                </TabsContent>

                <TabsContent value="code" className="space-y-4 flex-1 overflow-y-auto pb-4">
                  <CodeContent 
                    sub={sub}
                    code={code}
                    hasUnsavedCodeChanges={hasUnsavedCodeChanges}
                    isSavingCode={isSavingCode}
                    resetCounter={resetCounter}
                    handleCodeChange={handleCodeChange}
                    saveCode={saveCode}
                    resetCode={resetCode}
                    toast={toast}
                    isLightMode={isLightMode}
                    getLanguageBadgeStyle={getLanguageBadgeStyle}
                  />
                </TabsContent>

                <TabsContent value="analysis" className="space-y-6 flex-1 overflow-y-auto pb-4">
                  <AnalysisContent sub={sub} />
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="hidden lg:block h-full overflow-hidden">
            <ResizableSplitter
              leftPanel={
                <div className="h-full flex flex-col">
                  <div className="flex border-b border-border bg-card">
                    <button
                      className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === "description"
                          ? "text-slate-700 dark:text-slate-300 border-slate-700 dark:border-slate-300"
                          : "text-muted-foreground border-transparent hover:text-foreground"
                      }`}
                      onClick={() => setActiveTab("description")}
                    >
                      Description
                    </button>
                    <button
                      className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === "notes"
                          ? "text-slate-700 dark:text-slate-300 border-slate-700 dark:border-slate-300"
                          : "text-muted-foreground border-transparent hover:text-foreground"
                      }`}
                      onClick={() => setActiveTab("notes")}
                    >
                      Notes
                    </button>
                    <button
                      className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === "analysis"
                          ? "text-slate-700 dark:text-slate-300 border-slate-700 dark:border-slate-300"
                          : "text-gray-400 border-transparent hover:text-slate-700 dark:hover:text-slate-300"
                      }`}
                      onClick={() => setActiveTab("analysis")}
                    >
                      AI Analysis ✨
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    <div className="p-4 pb-20">
                      {activeTab === "description" && <DescriptionContent sub={sub} />}

                      {activeTab === "analysis" && <AnalysisContent sub={sub} />}

                      {activeTab === "notes" && (
                        <NotesContent 
                          notes={notes}
                          tags={tags}
                          isSavingNotes={isSavingNotes}
                          saveNotesPersist={saveNotesPersist}
                          saveNotesFinal={saveNotesFinal}
                          handleTagsChange={handleTagsChange}
                        />
                      )}
                    </div>
                  </div>
                </div>
              }
              rightPanel={
                <div className="h-full flex flex-col">
                  <div
                    className={`h-12 border-b flex items-center justify-between px-4 ${
                      isLightMode
                        ? "bg-white border-gray-200"
                        : "bg-card border-border"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex border-b ${
                          isLightMode ? "border-gray-200" : "border-border"
                        }`}
                      >
                        <button
                          className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                            activeCodeTab === "code"
                              ? "text-slate-700 dark:text-slate-300 border-slate-700 dark:border-slate-300"
                              : `${
                                  isLightMode
                                    ? "text-gray-600"
                                    : "text-muted-foreground"
                                } border-transparent hover:${
                                  isLightMode ? "text-gray-900" : "text-foreground"
                                }`
                          }`}
                          onClick={() => setActiveCodeTab("code")}
                        >
                          Code
                        </button>
                      </div>
                      {activeCodeTab === "code" && (
                        <span
                          className={`px-2 py-1 border rounded text-xs font-medium ${getLanguageBadgeStyle(
                            sub.language
                          )}`}
                        >
                          {sub.language}
                        </span>
                      )}
                    </div>
                    {activeCodeTab === "code" && (
                      <div className="flex items-center gap-2">
                        <button
                          className={`relative p-2 rounded transition-colors ${
                            isLightMode
                              ? "hover:bg-gray-100 text-gray-500"
                              : "hover:bg-muted text-muted-foreground"
                          } ${
                            hasUnsavedCodeChanges
                              ? "text-orange-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20"
                              : ""
                          } border border-transparent hover:border-current`}
                          onClick={() => {
                            resetCode();
                            toast({
                              title: "Code Reset",
                              description:
                                "Code has been reset to the original version.",
                            });
                          }}
                          title={
                            hasUnsavedCodeChanges
                              ? "Reset code to original (discards unsaved changes)"
                              : "Reset code to original"
                          }
                        >
                          <RotateCcw
                            className={`w-4 h-4 ${
                              hasUnsavedCodeChanges ? "animate-pulse" : ""
                            }`}
                          />
                          {hasUnsavedCodeChanges && (
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                          )}
                        </button>
                        <button
                          onClick={saveCode}
                          disabled={!hasUnsavedCodeChanges || isSavingCode}
                          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-1.5 ${
                            hasUnsavedCodeChanges && !isSavingCode
                              ? "bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white"
                              : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-not-allowed"
                          }`}
                        >
                          <Save className="w-3.5 h-3.5" />
                          {isSavingCode
                            ? "Saving..."
                            : hasUnsavedCodeChanges
                            ? "Save"
                            : "Saved"}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    {activeCodeTab === "code" && (
                      <div className="p-3">
                        <div
                          className={`rounded-lg border ${
                            isLightMode
                              ? "bg-gray-50 border-gray-200"
                              : "bg-card border-border"
                          }`}
                        >
                          <CodeBlock
                            key={`${sub.id}-${resetCounter}`}
                            code={code}
                            onChange={handleCodeChange}
                            language={sub.language}
                            editable={true}
                            maxHeight="360px"
                          />
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
        </div>
      </div>
    </ErrorBoundary>
  );
}
