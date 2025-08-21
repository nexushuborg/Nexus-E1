import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { X, Plus, Tag as TagIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getTagColor, getSuggestions, checkTag, getCategory } from '@/lib/tagColors';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  disabled?: boolean;
  maxTagLength?: number;
  showSuggestions?: boolean;
  allowDuplicates?: boolean;
  showCategories?: boolean;
  className?: string;
}

interface TagItemProps {
  tag: string;
  onRemove: (tag: string) => void;
}

const TagItem = React.memo(({ 
  tag, 
  onRemove
}: TagItemProps) => {
  const category = getCategory(tag);
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={`
              inline-flex items-center gap-1.5 px-2.5 py-1 text-sm rounded-full border 
              transition-all duration-200
              hover:opacity-80 hover:scale-105 ${getTagColor(tag)}
            `}
          >
            <span className="flex items-center gap-1">
              <TagIcon className="h-3 w-3 opacity-60" />
              {tag}
            </span>
            <button
              type="button"
              onClick={() => onRemove(tag)}
              className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              aria-label={`Remove tag ${tag}`}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-xs">
            <div className="font-medium">{tag}</div>
            <div className="text-muted-foreground">Category: {category}</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

TagItem.displayName = 'TagItem';

export const TagInput = ({
  tags,
  onChange,
  placeholder = "Add a tag...",
  maxTags = 10,
  disabled = false,
  maxTagLength = 30,
  showSuggestions = true,
  allowDuplicates = false,
  showCategories = true,
  className = ""
}: TagInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestionsPopover, setShowSuggestionsPopover] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showSuggestions || !inputValue.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      const newSuggestions = getSuggestions(inputValue, allowDuplicates ? [] : tags);
      setSuggestions(newSuggestions);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, tags, showSuggestions, allowDuplicates]);

  const addTag = useCallback((tag: string) => {
    setError(null);
    const trimmedTag = tag.trim();
    
    const validation = checkTag(trimmedTag);
    if (!validation.ok) {
      setError(validation.error || 'Invalid tag');
      return;
    }
    
    if (!allowDuplicates && tags.includes(trimmedTag)) {
      setError('Tag already exists');
      return;
    }
    
    if (tags.length >= maxTags) {
      setError(`Maximum ${maxTags} tags allowed`);
      return;
    }
    
    onChange([...tags, trimmedTag]);
    setInputValue('');
    setShowSuggestionsPopover(false);
    inputRef.current?.focus();
  }, [tags, onChange, maxTags, allowDuplicates]);

  const removeTag = useCallback((tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
    setError(null);
  }, [tags, onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === ',' && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      e.preventDefault();
      removeTag(tags[tags.length - 1]);
    } else if (e.key === 'ArrowDown' && suggestions.length > 0) {
      e.preventDefault();
      setShowSuggestionsPopover(true);
    }
  }, [inputValue, addTag, tags, removeTag, suggestions]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    const newTags = pasteData.split(/[\s,;]+/).filter(t => t.trim());
    
    if (newTags.length > 1) {
      const validTags = newTags
        .map(t => t.trim())
        .filter(t => {
          const validation = checkTag(t);
          return validation.ok && (allowDuplicates || !tags.includes(t)) && t.length <= maxTagLength;
        })
        .slice(0, maxTags - tags.length);
      
      if (validTags.length) {
        onChange([...tags, ...validTags]);
        setError(null);
      } else {
        setError('No valid tags found in pasted content');
      }
    } else {
      setInputValue(pasteData.trim());
    }
  }, [tags, onChange, maxTags, maxTagLength, allowDuplicates]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.startsWith(' ')) return;
    if (value.length <= maxTagLength) {
      setInputValue(value);
      setError(null);
      if (value.trim()) {
        setShowSuggestionsPopover(true);
      } else {
        setShowSuggestionsPopover(false);
      }
    }
  }, [maxTagLength]);

  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addTag(inputValue);
    }
  }, [inputValue, addTag]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(target) &&
        inputRef.current &&
        !inputRef.current.contains(target)
      ) {
        setShowSuggestionsPopover(false);
      }
    };

    if (showSuggestionsPopover) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showSuggestionsPopover]);

  const tagItems = useMemo(() => 
    tags.map((tag) => (
      <TagItem 
        key={tag} 
        tag={tag} 
        onRemove={removeTag}
      />
    )), [tags, removeTag]
  );

  const isDisabled = disabled || tags.length >= maxTags;

  return (
    <div className={`space-y-4 ${className}`} role="region" aria-live="polite" aria-label="Tag input field">
      <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-1 border border-border rounded-lg bg-background">
        {tagItems}
        {tags.length === 0 && (
          <div className="text-muted-foreground text-sm flex items-center gap-2 px-2">
            <TagIcon className="h-4 w-4" />
            No tags added yet
          </div>
        )}
      </div>
      
      {tags.length > 0 && tags.length < maxTags && (
        <div className="border-t border-border/50 my-2"></div>
      )}
      
      {!isDisabled && (
        <div className="space-y-3 relative">
          <form onSubmit={handleFormSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                placeholder={placeholder}
                className="flex-1 bg-background border-border focus:ring-[#4C1D95] focus:border-[#4C1D95] pr-10"
                aria-label="Add new tag"
                maxLength={maxTagLength}
                disabled={disabled}
              />
              {inputValue && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                  {inputValue.length}/{maxTagLength}
                </div>
              )}
            </div>
            
            <Button
              type="submit"
              size="icon"
              disabled={!inputValue.trim() || disabled}
              className="bg-[#4C1D95] hover:bg-[#4C1D95]/80 text-white disabled:bg-muted disabled:text-muted-foreground"
              aria-label="Add tag"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </form>

          {showSuggestions && suggestions.length > 0 && showSuggestionsPopover && (
            <div 
              ref={suggestionsRef} 
              className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-md shadow-lg max-h-48 overflow-y-auto"
            >
              <div className="p-1">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => addTag(suggestion)}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground outline-none"
                  >
                    <div className={`w-3 h-3 rounded-full ${getTagColor(suggestion).split(' ')[0]}`}></div>
                    <span className="flex-1 text-left">{suggestion}</span>
                    {showCategories && (
                      <Badge variant="outline" className="text-xs">
                        {getCategory(suggestion)}
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {tags.length >= maxTags && (
        <div className="border-t border-border/50 my-2"></div>
      )}
      
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
      
      {tags.length >= maxTags && (
        <p className="text-xs text-muted-foreground">
          Maximum {maxTags} tags reached
        </p>
      )}
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{tags.length} of {maxTags} tags used</span>
        {showCategories && tags.length > 0 && (
          <span>
            Categories: {Array.from(new Set(tags.map(getCategory))).join(', ')}
          </span>
        )}
      </div>
    </div>
  );
};