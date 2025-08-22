import { useTheme } from "next-themes";
import { Highlight } from "prism-react-renderer";
import { useState, useRef, useEffect, useMemo } from "react";

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

// Map common language names to Prism language identifiers
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

// Atom One Dark theme (official colors)
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

// Light theme (consistent with application)
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

  // Determine the actual theme to use
  const isDark = resolvedTheme === 'dark' || theme === 'dark';
  const currentTheme = isDark ? atomOneDarkTheme : lightTheme;

  // Map language to Prism language identifier
  const prismLanguage = languageMap[language.toLowerCase()] || language.toLowerCase();

  useEffect(() => {
    setEditValue(code);
  }, [code]);

  const handleEdit = () => {
    if (!editable) return;
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.select();
    }, 0);
  };

  const handleDoubleClick = () => {
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
      <div className={`relative ${className}`}>
        <textarea
          ref={textareaRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}

          className="w-full bg-background border border-border rounded-lg p-4 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 focus:border-transparent resize-none font-mono text-sm leading-relaxed"
          style={{ 
            minHeight: '200px',
            maxHeight: maxHeight === "none" ? "400px" : maxHeight,
            lineHeight: '1.6',
            overflowY: 'auto'
          }}
          placeholder={placeholder}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          aria-label="Code editor"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={handleSave}
            className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium"
            aria-label="Save changes"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="px-3 py-1.5 text-xs bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors font-medium"
            aria-label="Cancel editing"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative group ${className}`}>
      <div 
        className="rounded-lg border border-border overflow-hidden bg-background"
        style={{ maxHeight }}
        onDoubleClick={handleDoubleClick}
        title={editable ? "Double-click to edit" : ""}
        role={editable ? "button" : undefined}
        tabIndex={editable ? 0 : undefined}
        onKeyDown={(e) => {
          if (editable && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            handleDoubleClick();
          }
        }}
      >
        <Highlight
          theme={currentTheme}
          code={code}
          language={prismLanguage}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre 
              className={`${className} p-4 overflow-auto font-mono text-sm leading-relaxed`}
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
                    <span className="table-cell text-right pr-4 select-none text-muted-foreground/60 text-xs">
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
      
      {editable && (
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="px-2 py-1 text-xs bg-slate-700 dark:bg-slate-600 text-white rounded-md shadow-sm font-medium">
            Double-click to edit
          </div>
        </div>
      )}
    </div>
  );
}
