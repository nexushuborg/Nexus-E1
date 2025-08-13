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
  'php': 'php',
  'ruby': 'ruby',
  'go': 'go',
  'rust': 'rust',
  'swift': 'swift',
  'kotlin': 'kotlin',
  'scala': 'scala',
  'html': 'markup',
  'css': 'css',
  'sql': 'sql',
  'bash': 'bash',
  'shell': 'bash',
  'json': 'json',
  'xml': 'markup',
  'yaml': 'yaml',
  'yml': 'yaml',
};

// Strict color definitions
const DARK_BG = '#0D1117';
const DARK_TEXT = '#E0E0E0';
const MAGENTA = '#F000FF';

// Dark Theme (Your exact specs)
const customDarkTheme = {
  plain: {
    backgroundColor: DARK_BG,
    color: DARK_TEXT,
  },
  styles: [
    {
      types: ['keyword', 'operator', 'punctuation'],
      style: { color: MAGENTA }, // Electric magenta
    },
    {
      types: ['string'],
      style: { color: '#34D399' }, // Complementary green
    },
    {
      types: ['function', 'method'],
      style: { color: '#3F88F2' }, // Blue for functions
    },
    {
      types: ['number', 'boolean'],
      style: { color: '#F59E0B' }, // Orange for numbers and booleans
    },
    {
      types: ['comment'],
      style: { 
        color: '#6B7280', // Gray for comments
        fontStyle: 'italic' as const,
      },
    },
  ],
};

// Light Theme (Optimized contrast)
const customLightTheme = {
  plain: {
    backgroundColor: '#F9FAFB',
    color: '#1F2937',
  },
  styles: [
    {
      types: ['keyword', 'operator'],
      style: { color: '#7C3AED' }, // Purple (softer alternative)
    },
    {
      types: ['string'],
      style: { color: '#059669' }, // Green for strings
    },
    {
      types: ['function', 'method'],
      style: { color: '#2563EB' }, // Blue for functions
    },
    {
      types: ['number', 'boolean'],
      style: { color: '#D97706' }, // Orange for numbers and booleans
    },
    {
      types: ['comment'],
      style: { 
        color: '#6B7280', // Gray for comments
        fontStyle: 'italic' as const,
      },
    },
  ],
};

// Editable CodeBlock component
const EditableCodeBlock = ({ code, language, onChange, placeholder, className, maxHeight }: CodeBlockProps) => {
  const { theme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark' || theme === 'dark';
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(code);
  const [hasError, setHasError] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Memoize normalized language for performance
  const normalizedLanguage = useMemo(() => 
    languageMap[language?.toLowerCase() || ''] || 'javascript', 
    [language]
  );

  useEffect(() => {
    setEditValue(code);
    setHasError(false);
  }, [code]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.select();
    }, 0);
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
    setHasError(false);
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
      <div className={`relative ${className || ''}`}>
        <textarea
          ref={textareaRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className={`w-full font-mono text-sm border border-input rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent leading-relaxed ${
            isDark ? 'bg-background text-foreground' : 'bg-background text-foreground'
          }`}
          style={{ 
            minHeight: '300px',
            maxHeight: maxHeight || '400px',
            lineHeight: '1.5',
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
          }}
          placeholder={placeholder || "Write your code here..."}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          aria-label="Code editor"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={handleSave}
            className="px-2 py-1 text-xs bg-[#F000FF] text-white rounded hover:bg-[#F000FF]/80 transition-colors"
            aria-label="Save changes"
          >
            Save (Ctrl+Enter)
          </button>
          <button
            onClick={handleCancel}
            className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            aria-label="Cancel editing"
          >
            Cancel (Esc)
          </button>
        </div>
      </div>
    );
  }

  // Display mode with syntax highlighting
  return (
    <div 
      className={`cursor-pointer group relative ${className || ''}`}
      onDoubleClick={handleDoubleClick}
      title="Double-click to edit"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleDoubleClick();
        }
      }}
      aria-label="Code block - double click to edit"
    >
      <Highlight
        theme={isDark ? customDarkTheme : customLightTheme}
        code={code}
        language={normalizedLanguage}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre 
            className={`${className} rounded-lg p-4 overflow-x-auto`} 
            style={{ ...style, maxHeight: maxHeight || 'none' }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="px-2 py-1 text-xs bg-[#F000FF]/80 text-white rounded">
          Double-click to edit
        </div>
      </div>
    </div>
  );
};

// Read-only CodeBlock component
const ReadOnlyCodeBlock = ({ code, language, className, showLineNumbers, maxHeight }: CodeBlockProps) => {
  const { theme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark' || theme === 'dark';
  
  // Memoize normalized language for performance
  const normalizedLanguage = useMemo(() => 
    languageMap[language?.toLowerCase() || ''] || 'javascript', 
    [language]
  );

  return (
    <div className={`${isDark ? "bg-[#0D1117]" : "bg-white"} ${className || ''}`}>
      <Highlight
        theme={isDark ? customDarkTheme : customLightTheme}
        code={code}
        language={normalizedLanguage}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre 
            className={`${className} rounded-lg p-4 overflow-x-auto`} 
            style={{ ...style, maxHeight: maxHeight || 'none' }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {showLineNumbers && (
                  <span className="inline-block w-8 text-muted-foreground text-xs select-none">
                    {i + 1}
                  </span>
                )}
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
};

export const CodeBlock = ({ 
  code, 
  language = "javascript", 
  editable = false, 
  onChange, 
  placeholder,
  className,
  showLineNumbers = false,
  maxHeight
}: CodeBlockProps) => {
  if (editable) {
    return (
      <EditableCodeBlock 
        code={code} 
        language={language} 
        onChange={onChange}
        placeholder={placeholder}
        className={className}
        maxHeight={maxHeight}
      />
    );
  }

  return (
    <ReadOnlyCodeBlock 
      code={code} 
      language={language} 
      className={className}
      showLineNumbers={showLineNumbers}
      maxHeight={maxHeight}
    />
  );
};
