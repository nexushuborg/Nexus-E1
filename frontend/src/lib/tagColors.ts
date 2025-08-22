const blue = 'bg-blue-100/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300/60 dark:border-blue-700/40';
const green = 'bg-emerald-50/80 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/30';
const yellow = 'bg-amber-50/80 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/30';
const red = 'bg-rose-50/80 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-200/50 dark:border-rose-800/30';

const allTags = [
  'Array', 'String', 'Hash Table', 'Hash Set', 'Vector', 'List', 'Tree',
  'Binary Tree', 'Graph', 'BST', 'Stack', 'Queue', 'Linked List', 'Deque',
  'Priority Queue', 'Heap', 'Trie', 'Union Find', 'Dynamic Programming',
  'Greedy', 'Backtracking', 'Binary Search', 'Sorting', 'DFS', 'BFS',
  'Recursion', 'Two Pointers', 'Sliding Window', 'Bit Manipulation', 'Math',
  'Easy', 'Medium', 'Hard', 'Beginner', 'Basic', 'Intermediate', 'Moderate', 'Advanced', 'Expert'
];

const tagColorsMap: Record<string, string> = {};

allTags.forEach(tag => {
  if (['Easy', 'Beginner', 'Basic'].includes(tag)) {
    tagColorsMap[tag] = green;
  } else if (['Medium', 'Intermediate', 'Moderate'].includes(tag)) {
    tagColorsMap[tag] = yellow;
  } else if (['Hard', 'Advanced', 'Expert'].includes(tag)) {
    tagColorsMap[tag] = red;
  } else {
    tagColorsMap[tag] = blue;
  }
});

const synonyms: Record<string, string> = {
  'arrays': 'Array',
  'vector': 'Array',
  'list': 'Array',
  'strings': 'String',
  'hashtable': 'Hash Table',
  'hashset': 'Hash Set',
  'trees': 'Tree',
  'binarytree': 'Binary Tree',
  'graphs': 'Graph',
  'stacks': 'Stack',
  'queues': 'Queue',
  'linkedlist': 'Linked List',
  'priorityqueue': 'Priority Queue',
  'heaps': 'Heap',
  'dp': 'Dynamic Programming',
  'dynamicprogramming': 'Dynamic Programming',
  'binarysearch': 'Binary Search',
  'sort': 'Sorting',
  'depth first search': 'DFS',
  'depthfirstsearch': 'DFS',
  'breadth first search': 'BFS',
  'breadthfirstsearch': 'BFS',
  'recursive': 'Recursion',
  'twopointers': 'Two Pointers',
  'slidingwindow': 'Sliding Window',
  'bitmanipulation': 'Bit Manipulation',
  'mathematics': 'Math',
  'beginner': 'Easy',
  'basic': 'Easy',
  'intermediate': 'Medium',
  'moderate': 'Medium',
  'advanced': 'Hard',
  'expert': 'Hard'
};

const cleanTag = (tag: string): string => {
  return tag.toLowerCase().trim();
};

export const getTagColor = (tag: string): string => {
  const clean = cleanTag(tag);
  const mainTag = synonyms[clean] || tag;
  return tagColorsMap[mainTag] || blue;
};

export const getSuggestions = (input: string, currentTags: string[] = []): string[] => {
  if (!input.trim()) return [];
  
  const cleanInput = cleanTag(input);
  const currentSet = new Set(currentTags.map(cleanTag));
  
  return allTags
    .filter(tag => {
      const cleanTagValue = cleanTag(tag);
      return (cleanTagValue.includes(cleanInput) || cleanInput.includes(cleanTagValue)) && 
             !currentSet.has(cleanTagValue);
    })
    .slice(0, 5);
};

export const checkTag = (tag: string): { ok: boolean; error?: string } => {
  const clean = tag.trim();
  
  if (!clean) return { ok: false, error: 'Tag cannot be empty' };
  if (clean.length > 30) return { ok: false, error: 'Tag must be 30 characters or less' };
  if (!/^[a-zA-Z0-9\s\-_]+$/.test(clean)) return { ok: false, error: 'Tag can only contain letters, numbers, spaces, hyphens, and underscores' };
  
  return { ok: true };
};

export const getCategory = (tag: string): string => {
  const clean = cleanTag(tag);
  const mainTag = synonyms[clean] || tag;
  
  if (['Easy', 'Beginner', 'Basic'].includes(mainTag)) return 'Difficulty';
  if (['Medium', 'Intermediate', 'Moderate'].includes(mainTag)) return 'Difficulty';
  if (['Hard', 'Advanced', 'Expert'].includes(mainTag)) return 'Difficulty';
  
  return 'Algorithm';
};