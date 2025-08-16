const tagCategories = {
  'Array|String|Hash Table|Hash Set|Vector|List': 'bg-slate-100/50 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-600/40',
  'Tree|Binary Tree|Graph|BST|AVL|Red Black Tree|B Tree': 'bg-slate-100/50 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-600/40',
  'Stack|Queue|Linked List|Deque|Priority Queue|Circular Queue': 'bg-slate-100/50 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-600/40',
  'Heap|Trie|Union Find|Disjoint Set|Segment Tree|Fenwick Tree': 'bg-slate-100/50 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-600/40',

  'Dynamic Programming|Greedy|Backtracking|Memoization|Tabulation': 'bg-gray-100/50 text-gray-700 dark:text-gray-300 border-gray-200/60 dark:border-gray-600/40',
  'Binary Search|Sorting|Topological Sort|Quick Sort|Merge Sort|Heap Sort': 'bg-gray-100/50 text-gray-700 dark:text-gray-300 border-gray-200/60 dark:border-gray-600/40',
  'DFS|BFS|Dijkstra|Floyd Warshall|Bellman Ford|Kruskal|Prim': 'bg-gray-100/50 text-gray-700 dark:text-gray-300 border-gray-200/60 dark:border-gray-600/40',
  'Recursion|Divide and Conquer|Branch and Bound': 'bg-gray-100/50 text-gray-700 dark:text-gray-300 border-gray-200/60 dark:border-gray-600/40',

  'Two Pointers|Sliding Window|Fast and Slow Pointers': 'bg-stone-100/50 text-stone-700 dark:text-stone-300 border-stone-200/60 dark:border-stone-600/40',
  'Bit Manipulation|Prefix Sum|Suffix Sum|Difference Array': 'bg-stone-100/50 text-stone-700 dark:text-stone-300 border-stone-200/60 dark:border-stone-600/40',
  'Monotonic Stack|Monotonic Queue|Kadane|KMP|Rabin Karp': 'bg-stone-100/50 text-stone-700 dark:text-stone-300 border-stone-200/60 dark:border-stone-600/40',

  'Math|Geometry|Number Theory|Combinatorics|Probability': 'bg-neutral-100/50 text-neutral-700 dark:text-neutral-300 border-neutral-200/60 dark:border-neutral-600/40',
  'Design|Simulation|System Design|OOP|Design Patterns': 'bg-neutral-100/50 text-neutral-700 dark:text-neutral-300 border-neutral-200/60 dark:border-neutral-600/40',
  'Game Theory|Minimax|Alpha Beta Pruning': 'bg-neutral-100/50 text-neutral-700 dark:text-neutral-300 border-neutral-200/60 dark:border-neutral-600/40',

  'Easy|Beginner|Basic': 'bg-green-100/60 text-green-700 dark:text-green-300 border-green-200/70 dark:border-green-600/50',
  'Medium|Intermediate|Moderate': 'bg-yellow-100/60 text-yellow-700 dark:text-yellow-300 border-yellow-200/70 dark:border-yellow-600/50',
  'Hard|Advanced|Expert': 'bg-red-100/60 text-red-700 dark:text-red-300 border-red-200/70 dark:border-red-600/50',

  'Machine Learning|AI|Neural Networks|Deep Learning|ML': 'bg-slate-100/50 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-600/40',
  'System Design|Architecture|Microservices|Distributed Systems': 'bg-slate-100/50 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-600/40',
  'Database|SQL|NoSQL|MongoDB|PostgreSQL|MySQL|Redis': 'bg-slate-100/50 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-600/40',
  'Web Development|Frontend|Backend|API|REST|GraphQL': 'bg-slate-100/50 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-600/40',
  'Mobile Development|iOS|Android|React Native|Flutter': 'bg-slate-100/50 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-600/40',
  'DevOps|Docker|Kubernetes|CI/CD|AWS|Azure|GCP': 'bg-slate-100/50 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-600/40',
  'Cybersecurity|Cryptography|Encryption|Hashing|Security': 'bg-slate-100/50 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-600/40',

  'Algorithm|Data Structure|DS|Algo': 'bg-gray-100/50 text-gray-700 dark:text-gray-300 border-gray-200/60 dark:border-gray-600/40',
  'Pattern|Technique|Method|Approach': 'bg-gray-100/50 text-gray-700 dark:text-gray-300 border-gray-200/60 dark:border-gray-600/40'
};

const fallbackColors = [
  { bg: 'bg-slate-100/50', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-200/60 dark:border-slate-600/40' },
  { bg: 'bg-gray-100/50', text: 'text-gray-700 dark:text-gray-300', border: 'border-gray-200/60 dark:border-gray-600/40' },
  { bg: 'bg-stone-100/50', text: 'text-stone-700 dark:text-stone-300', border: 'border-stone-200/60 dark:border-stone-600/40' },
  { bg: 'bg-neutral-100/50', text: 'text-neutral-700 dark:text-neutral-300', border: 'border-neutral-200/60 dark:border-neutral-600/40' }
];

const defaultTagColor = 'bg-slate-100/50 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-600/40';

const tagSynonyms: Record<string, string[]> = {
  'array': ['arrays', 'vector', 'list'],
  'string': ['strings', 'text'],
  'tree': ['trees', 'binary tree', 'binarytree', 'bst'],
  'graph': ['graphs', 'network'],
  'stack': ['stacks'],
  'queue': ['queues'],
  'linked list': ['linkedlist', 'linked lists'],
  'heap': ['heaps', 'priority queue', 'priorityqueue'],
  'dynamic programming': ['dp', 'dynamicprogramming', 'memoization'],
  'binary search': ['binarysearch', 'bisection'],
  'sorting': ['sort'],
  'dfs': ['depth first search', 'depthfirstsearch'],
  'bfs': ['breadth first search', 'breadthfirstsearch'],
  'recursion': ['recursive', 'recursively'],
  'two pointers': ['twopointers', 'two pointer'],
  'sliding window': ['slidingwindow', 'window'],
  'bit manipulation': ['bitmanipulation', 'bitwise'],
  'prefix sum': ['prefixsum', 'cumulative sum'],
  'math': ['mathematics', 'mathematical'],
  'design': ['system design', 'systemdesign'],
  'machine learning': ['ml', 'ai', 'artificial intelligence'],
  'database': ['db', 'databases'],
  'web development': ['webdev', 'web dev'],
  'mobile development': ['mobiledev', 'mobile dev'],
  'devops': ['dev ops', 'deployment'],
  'security': ['cybersecurity', 'cyber security']
};

const normalizeTag = (tag: string): string => {
  return tag.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const areTagsSimilar = (tag1: string, tag2: string): boolean => {
  const normalized1 = normalizeTag(tag1);
  const normalized2 = normalizeTag(tag2);
  
  if (normalized1 === normalized2) return true;
  
  if (tagSynonyms[normalized1]?.includes(normalized2) || 
      tagSynonyms[normalized2]?.includes(normalized1)) return true;
  
  if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) return true;
  
  const distance = levenshteinDistance(normalized1, normalized2);
  const maxLength = Math.max(normalized1.length, normalized2.length);
  return distance <= Math.floor(maxLength * 0.3);
};

const levenshteinDistance = (str1: string, str2: string): number => {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }
  
  return matrix[str2.length][str1.length];
};

export const getTagColor = (tag: string): string => {
  const lowerTag = tag.toLowerCase();
  
  for (const [group, color] of Object.entries(tagCategories)) {
    if (group.split('|').some(t => t === tag)) return color;
  }

  for (const [group, color] of Object.entries(tagCategories)) {
    if (group.split('|').some(t => t.toLowerCase() === lowerTag)) return color;
  }

  for (const [group, color] of Object.entries(tagCategories)) {
    if (group.split('|').some(category => areTagsSimilar(tag, category))) {
      return color;
    }
  }

  const normalizedTag = lowerTag.replace(/s$/, '');
  const pluralizedTag = lowerTag + (lowerTag.endsWith('s') ? '' : 's');
  
  for (const [group, color] of Object.entries(tagCategories)) {
    if (group.split('|').some(category => {
      const lowerCat = category.toLowerCase();
      return lowerTag === lowerCat || 
             normalizedTag === lowerCat.replace(/s$/, '') || 
             pluralizedTag === (lowerCat.endsWith('s') ? lowerCat : lowerCat + 's');
    })) return color;
  }

  return defaultTagColor;
};

export const getFallbackTagColor = (tag: string) => {
  const hash = tag.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) & a, 0);
  return fallbackColors[Math.abs(hash) % fallbackColors.length];
};

export const getTagSuggestions = (input: string, existingTags: string[] = []): string[] => {
  if (!input.trim()) return [];
  
  const normalizedInput = normalizeTag(input);
  const suggestions: string[] = [];
  
  const allPossibleTags = Object.keys(tagCategories).flatMap(group => 
    group.split('|').map(tag => tag.trim())
  );
  
  const rankedSuggestions = allPossibleTags
    .filter(tag => {
      const normalizedTag = normalizeTag(tag);
      return normalizedTag.includes(normalizedInput) || 
             normalizedInput.includes(normalizedTag) ||
             areTagsSimilar(normalizedInput, normalizedTag);
    })
    .filter(tag => !existingTags.includes(tag))
    .map(tag => ({
      tag,
      score: calculateSuggestionScore(normalizedInput, normalizeTag(tag))
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(item => item.tag);
  
  return rankedSuggestions;
};

const calculateSuggestionScore = (input: string, tag: string): number => {
  let score = 0;
  
  if (input === tag) score += 100;
  
  if (tag.startsWith(input)) score += 50;
  
  if (tag.includes(input)) score += 30;
  
  const lengthDiff = Math.abs(input.length - tag.length);
  score += Math.max(0, 20 - lengthDiff);
  
  if (tagSynonyms[input]?.includes(tag) || tagSynonyms[tag]?.includes(input)) {
    score += 40;
  }
  
  return score;
};

export const getTagCategory = (tag: string): string => {
  for (const [group] of Object.entries(tagCategories)) {
    if (group.split('|').some(t => areTagsSimilar(tag, t))) {
      return group.split('|')[0];
    }
  }
  return 'Other';
};

export const isValidTag = (tag: string): { isValid: boolean; error?: string } => {
  const trimmedTag = tag.trim();
  
  if (!trimmedTag) {
    return { isValid: false, error: 'Tag cannot be empty' };
  }
  
  if (trimmedTag.length > 30) {
    return { isValid: false, error: 'Tag must be 30 characters or less' };
  }
  
  if (!/^[a-zA-Z0-9\s\-_]+$/.test(trimmedTag)) {
    return { isValid: false, error: 'Tag can only contain letters, numbers, spaces, hyphens, and underscores' };
  }
  
  const reservedWords = ['admin', 'system', 'root', 'null', 'undefined', 'true', 'false'];
  if (reservedWords.includes(trimmedTag.toLowerCase())) {
    return { isValid: false, error: 'Tag contains reserved words' };
  }
  
  return { isValid: true };
};