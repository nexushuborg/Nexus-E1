import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Defines the props for our reusable TagInput component.
interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

// Tag categories with color mapping
const tagCategories = {
  // Data Structures
  'Array': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-700',
  'String': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-700',
  'Hash Table': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 border-purple-200 dark:border-purple-700',
  'Hash Set': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700',
  'Tree': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700',
  'Binary Tree': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700',
  'Graph': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300 border-cyan-200 dark:border-cyan-700',
  'Stack': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-700',
  'Queue': 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-300 border-lime-200 dark:border-lime-700',
  'Linked List': 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300 border-sky-200 dark:border-sky-700',
  'Heap': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 border-orange-200 dark:border-orange-700',
  'Trie': 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300 border-violet-200 dark:border-violet-700',
  'Union Find': 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300 border-rose-200 dark:border-rose-700',
  
  // Algorithms
  'Dynamic Programming': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-700',
  'Binary Search': 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300 border-rose-200 dark:border-rose-700',
  'Greedy': 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300 border-violet-200 dark:border-violet-700',
  'Backtracking': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300 border-teal-200 dark:border-teal-700',
  'Sorting': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700',
  'Recursion': 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-300 border-fuchsia-200 dark:border-fuchsia-700',
  'DFS': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300 border-cyan-200 dark:border-cyan-700',
  'BFS': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-700',
  'Dijkstra': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 border-purple-200 dark:border-purple-700',
  'Topological Sort': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700',
  
  // Techniques
  'Two Pointers': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 border-orange-200 dark:border-orange-700',
  'Sliding Window': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300 border-pink-200 dark:border-pink-700',
  'Bit Manipulation': 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  'Prefix Sum': 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-300 border-lime-200 dark:border-lime-700',
  'Monotonic Stack': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-700',
  'Monotonic Queue': 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-300 border-lime-200 dark:border-lime-700',
  'Kadane': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-700',
  
  // Problem Types
  'Math': 'bg-stone-100 text-stone-800 dark:bg-stone-900 dark:text-stone-300 border-stone-200 dark:border-stone-700',
  'Design': 'bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700',
  'Simulation': 'bg-neutral-100 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700',
  'Game Theory': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700',
  'Geometry': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300 border-cyan-200 dark:border-cyan-700',
  
  // Difficulty Levels
  'Easy': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-700',
  'Medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700',
  'Hard': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-700',
};

// Default color for uncategorized tags
const defaultTagColor = 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 border-gray-200 dark:border-gray-700';

// Function to get tag color based on category
const getTagColor = (tag: string): string => {
  // Check for exact match first
  if (tagCategories[tag as keyof typeof tagCategories]) {
    return tagCategories[tag as keyof typeof tagCategories];
  }
  
  // Check for partial matches (case-insensitive)
  const lowerTag = tag.toLowerCase();
  for (const [category, color] of Object.entries(tagCategories)) {
    if (lowerTag.includes(category.toLowerCase()) || category.toLowerCase().includes(lowerTag)) {
      return color;
    }
  }
  
  return defaultTagColor;
};

/**
 * A controlled component for creating and managing a list of tags.
 */
export const TagInput = ({
  tags,
  onChange,
  placeholder = "Add a tag...",
  maxTags = 10
}: TagInputProps) => {
  const [inputValue, setInputValue] = useState('');

  // Adds a new tag if it's valid and doesn't already exist.
  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < maxTags) {
      onChange([...tags, trimmedTag]);
      setInputValue('');
    }
  };

  // Removes a specific tag from the list.
  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  // Handles keyboard events for adding on 'Enter' or ',' and removing on 'Backspace'.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } 
    // UX enhancement: remove the last tag on backspace when the input is empty.
    else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Display the current list of tags */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <div
            key={tag}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-sm rounded-full border transition-colors hover:opacity-80 ${getTagColor(tag)}`}
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-black/10 dark:hover:bg-white/10"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
      
      {/* Show the input field only if the tag limit hasn't been reached */}
      {tags.length < maxTags && (
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 bg-background border-border focus:ring-primary"
          />
          <Button
            type="button"
            size="icon"
            onClick={() => addTag(inputValue)}
            disabled={!inputValue.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {/* Show a message when the tag limit is reached */}
      {tags.length >= maxTags && (
        <p className="text-xs text-muted-foreground">
          Maximum {maxTags} tags reached
        </p>
      )}
    </div>
  );
};
