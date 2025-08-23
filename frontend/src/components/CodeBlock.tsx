import { useTheme } from "next-themes";
import { Highlight } from "prism-react-renderer";
import { useState, useRef, useEffect } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
  editable?: boolean;
  onChange?: (code: string) => void;
  placeholder?: string;
  className?: string;
  showLineNumbers?: boolean;
  maxHeight?: string;
}

const languageMap: Record<string, string> = {
  'javascript': 'javascript',
  'js': 'javascript',
  'typescript': 'typescript',
  'ts': 'typescript',
  'python': 'python',
  'py': 'python',
  'java': 'java',
  'cpp': 'cpp',
  'c++': 'cpp',
  'c': 'c',
  'csharp': 'csharp',
  'cs': 'csharp',
  'go': 'go',
  'rust': 'rust',
  'php': 'php',
  'ruby': 'ruby',
  'swift': 'swift',
  'kotlin': 'kotlin',
  'scala': 'scala',
  'r': 'r',
  'matlab': 'matlab',
  'sql': 'sql',
  'html': 'markup',
  'css': 'css',
  'scss': 'scss',
  'sass': 'sass',
  'json': 'json',
  'yaml': 'yaml',
  'yml': 'yaml',
  'xml': 'markup',
  'bash': 'bash',
  'shell': 'bash',
  'sh': 'bash',
  'powershell': 'powershell',
  'ps1': 'powershell',
  'dockerfile': 'docker',
  'docker': 'docker',
  'markdown': 'markdown',
  'md': 'markdown',
};

// Atom One Dark theme 
const atomOneDarkTheme = {
  plain: {
    backgroundColor: '#282c34',
    color: '#abb2bf',
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: {
        color: '#5c6370',
        fontStyle: 'italic' as const,
      },
    },
    {
      types: ['punctuation'],
      style: {
        color: '#abb2bf',
      },
    },
    {
      types: ['property', 'tag', 'boolean', 'number', 'constant', 'symbol', 'deleted'],
      style: {
        color: '#d19a66',
      },
    },
    {
      types: ['selector', 'attr-name', 'string', 'char', 'builtin', 'inserted'],
      style: {
        color: '#98c379',
      },
    },
    {
      types: ['operator', 'entity', 'url'],
      style: {
        color: '#56b6c2',
      },
    },
    {
      types: ['atrule', 'attr-value', 'keyword'],
      style: {
        color: '#c678dd',
      },
    },
    {
      types: ['function', 'class-name'],
      style: {
        color: '#61afef',
      },
    },
    {
      types: ['regex', 'important', 'variable'],
      style: {
        color: '#e06c75',
      },
    },
    {
      types: ['important', 'bold'],
      style: {
        fontWeight: 'bold' as const,
      },
    },
    {
      types: ['italic'],
      style: {
        fontStyle: 'italic' as const,
      },
    },
    {
      types: ['entity'],
      style: {
        cursor: 'help',
      },
    },
  ],
};

// Light theme
const lightTheme = {
  plain: {
    backgroundColor: '#f8f9fa',
    color: '#24292e',
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: {
        color: '#6a737d',
        fontStyle: 'italic' as const,
      },
    },
    {
      types: ['punctuation'],
      style: {
        color: '#24292e',
      },
    },
    {
      types: ['property', 'tag', 'boolean', 'number', 'constant', 'symbol', 'deleted'],
      style: {
        color: '#e36209',
      },
    },
    {
      types: ['selector', 'attr-name', 'string', 'char', 'builtin', 'inserted'],
      style: {
        color: '#22863a',
      },
    },
    {
      types: ['operator', 'entity', 'url'],
      style: {
        color: '#005cc5',
      },
    },
    {
      types: ['atrule', 'attr-value', 'keyword'],
      style: {
        color: '#d73a49',
      },
    },
    {
      types: ['function', 'class-name'],
      style: {
        color: '#6f42c1',
      },
    },
    {
      types: ['regex', 'important', 'variable'],
      style: {
        color: '#e36209',
      },
    },
    {
      types: ['important', 'bold'],
      style: {
        fontWeight: 'bold' as const,
      },
    },
    {
      types: ['italic'],
      style: {
        fontStyle: 'italic' as const,
      },
    },
    {
      types: ['entity'],
      style: {
        cursor: 'help',
      },
    },
  ],
};

export function CodeBlock({
  code,
  language = "javascript",
  editable = false,
  onChange,
  placeholder = "Enter your code here...",
  className = "",
  showLineNumbers = true,
  maxHeight = "none",
}: CodeBlockProps) {
  const { theme, resolvedTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(code);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isDark = resolvedTheme === 'dark' || theme === 'dark';
  const currentTheme = isDark ? atomOneDarkTheme : lightTheme;

  const prismLanguage = languageMap[language.toLowerCase()] || language.toLowerCase();

  useEffect(() => {
    setEditValue(code);
  }, [code]);

  const handleEdit = () => {
    if (!editable) return;
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  const handleSingleClick = () => {
    if (!editable) return;
    handleEdit();
  };

  const handleSave = () => {
    setIsEditing(false);
    if (onChange && editValue !== code) {
      onChange(editValue);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(code);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className={`relative group code-editor ${className}`}>
          <div
            className="rounded-lg border border-border overflow-hidden bg-background"
            style={{ height: maxHeight === "none" ? "auto" : maxHeight }}
          >
            <div className="flex h-full">
              <div className="flex-1 relative">
                <Highlight
                  theme={currentTheme}
                  code={editValue}
                  language={prismLanguage}
                >
                  {({ className, style, tokens, getLineProps, getTokenProps }) => (
                    <pre
                      className={`${className} overflow-auto font-mono text-sm leading-relaxed h-full`}
                      style={{
                        ...style,
                        margin: 0,
                        backgroundColor: 'transparent',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        padding: '8px',
                        letterSpacing: 'normal',
                        whiteSpace: 'pre',
                        wordSpacing: 'normal',
                        tabSize: 2,
                      }}
                    >
                      {tokens.map((line, i) => (
                        <div key={i} {...getLineProps({ line })} className="table-row">
                          {showLineNumbers && (
                            <span className="table-cell text-right pr-4 select-none text-muted-foreground/60 text-xs line-numbers">
                              {i + 1}
                            </span>
                          )}
                          <span className="table-cell">
                            {line.map((token, key) => (
                              <span key={key} {...getTokenProps({ token })} />
                            ))}
                          </span>
                        </div>
                      ))}
                    </pre>
                  )}
                </Highlight>
                <textarea
                  ref={textareaRef}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onScroll={(e) => {
                    const highlightedPre = e.currentTarget.parentElement?.querySelector('pre') as HTMLElement;
                    if (highlightedPre) {
                      highlightedPre.scrollTop = e.currentTarget.scrollTop;
                      highlightedPre.scrollLeft = e.currentTarget.scrollLeft;
                    }
                  }}
                  className="absolute inset-0 w-full h-full bg-transparent border-0 text-transparent caret-foreground placeholder-transparent focus:outline-none focus:ring-0 resize-none font-mono text-sm leading-relaxed"
                  style={{
                    paddingLeft: showLineNumbers ? 'calc(2.2em + 8px)' : '8px',
                    paddingTop: '8px',
                    paddingRight: '8px',
                    paddingBottom: '8px',
                    lineHeight: '1.6',
                    overflowY: 'auto',
                    fontSize: '14px',
                    whiteSpace: 'pre',
                    wordSpacing: 'normal',
                    tabSize: 2,
                  }}
                  placeholder={placeholder}
                  spellCheck={false}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  aria-label="Code editor"
                />
              </div>
            </div>
          </div>
          <div className="absolute bottom-4 right-4 flex gap-2 z-10">
            <button
              onClick={handleSave}
              className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium shadow-lg"
              aria-label="Save changes"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1.5 text-xs bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors font-medium shadow-lg"
              aria-label="Cancel editing"
            >
              Cancel
            </button>
          </div>
        </div>
    );
  }

  return (
    <div className={`relative group code-editor ${className}`}>
      <div
        className="rounded-lg border border-border overflow-hidden bg-background"
        style={{ height: maxHeight === "none" ? "auto" : maxHeight }}
        onClick={handleSingleClick}
        title={editable ? "Click to edit" : ""}
        role={editable ? "button" : undefined}
        tabIndex={editable ? 0 : undefined}
        onKeyDown={(e) => {
          if (editable && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            handleSingleClick();
          }
        }}
      >
        <div className="h-full overflow-hidden">
          <Highlight
            theme={currentTheme}
            code={code}
            language={prismLanguage}
          >
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre
                className={`${className} p-2 overflow-auto font-mono text-sm leading-relaxed h-full`}
                style={{
                  ...style,
                  margin: 0,
                  backgroundColor: 'transparent',
                  fontSize: '14px',
                  lineHeight: '1.6',
                }}
              >
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })} className="table-row">
                    {showLineNumbers && (
                      <span className="table-cell text-right pr-4 select-none text-muted-foreground/60 text-xs line-numbers">
                        {i + 1}
                      </span>
                    )}
                    <span className="table-cell">
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </span>
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
        </div>
      </div>

      {editable && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="px-2 py-1 text-xs bg-slate-700 dark:bg-slate-600 text-white rounded-md shadow-sm font-medium">
            Click to edit
          </div>
        </div>
      )}
    </div>
  );
}
