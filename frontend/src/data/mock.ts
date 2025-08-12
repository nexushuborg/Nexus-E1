export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Submission {
  id: string;
  title: string;
  platform: "LeetCode" | "GFG" | "CodeStudio";
  difficulty: Difficulty;
  date: string; // ISO
  tags: string[];
  description: string;
  code: string;
  language: string;
  summary: string;
  examples?: { input: string; output: string; explanation?: string }[];
  constraints?: string[];
}

export const submissions: Submission[] = [
  {
    id: "two-sum",
    title: "Two Sum",
    platform: "LeetCode",
    difficulty: "Easy",
    date: new Date().toISOString(),
    tags: ["Arrays", "Hash Map"],
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    code: `function twoSum(nums, target){\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++){\n    const need = target - nums[i];\n    if (map.has(need)) return [map.get(need), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
    language: "javascript",
    summary:
      "Use a hash map to store seen numbers and check if complement exists in O(n).",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "2 + 7 = 9",
      },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists",
    ],
  },
  {
    id: "longest-substring-no-repeat",
    title: "Longest Substring Without Repeating Characters",
    platform: "LeetCode",
    difficulty: "Medium",
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    tags: ["Strings", "Sliding Window"],
    description:
      "Given a string s, find the length of the longest substring without repeating characters.",
    code: `function lengthOfLongestSubstring(s){\n  let l = 0, ans = 0;\n  const set = new Set();\n  for (let r = 0; r < s.length; r++){\n    while (set.has(s[r])) set.delete(s[l++]);\n    set.add(s[r]);\n    ans = Math.max(ans, r - l + 1);\n  }\n  return ans;\n}`,
    language: "javascript",
    summary:
      "Sliding window expands and contracts while maintaining a set of unique chars.",
  },
  {
    id: "merge-k-lists",
    title: "Merge k Sorted Lists",
    platform: "LeetCode",
    difficulty: "Hard",
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    tags: ["Linked List", "Heap"],
    description:
      "You are given an array of k linked-lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
    code: `class MinHeap{\n  constructor(){ this.a = []; }\n  push(x){ this.a.push(x); this._up(this.a.length-1);}\n  pop(){ const r = this.a[0]; const x = this.a.pop(); if(this.a.length) { this.a[0]=x; this._down(0);} return r;}\n  _up(i){ while(i){ const p=(i-1>>1); if(this.a[p].val<=this.a[i].val) break; [this.a[p],this.a[i]]=[this.a[i],this.a[p]]; i=p;} }\n  _down(i){ for(;;){ let l=i*2+1, r=l+1, s=i; if(l<this.a.length&&this.a[l].val<this.a[s].val) s=l; if(r<this.a.length&&this.a[r].val<this.a[s].val) s=r; if(s===i) break; [this.a[s],this.a[i]]=[this.a[i],this.a[s]]; i=s;} }\n}\nfunction mergeKLists(lists){\n  const h = new MinHeap();\n  for (const node of lists) if (node) h.push(node);\n  const dummy = { val:0, next:null }; let cur = dummy;\n  while(h.a.length){ const n=h.pop(); cur.next=n; cur = cur.next; if(n.next) h.push(n.next);}\n  return dummy.next;\n}`,
    language: "javascript",
    summary:
      "Use a min-heap to always pick the smallest head across lists; O(n log k).",
  },
];

export const topics: string[] = [
  "Arrays",
  "Strings",
  "Linked Lists",
  "Stacks & Queues",
  "Trees",
  "Graphs",
  "Dynamic Programming",
  "Sliding Window",
];

export const flashcards: Record<
  string,
  { question: string; answer: string }[]
> = {
  Arrays: [
    {
      question: "What is two-pointer technique?",
      answer:
        "Use two indexes to traverse array optimizing time or space, often for sorted data.",
    },
    {
      question: "Kadane's algorithm?",
      answer:
        "O(n) to find maximum subarray sum by tracking local and global maxima.",
    },
    {
      question: "What is prefix sum array?",
      answer:
        "An array where each element stores the sum of all previous elements for fast range queries.",
    },
    {
      question: "How to reverse an array in-place?",
      answer: "Swap elements from both ends moving towards the center.",
    },
    {
      question:
        "What is the difference between shallow copy and deep copy in arrays?",
      answer:
        "Shallow copy copies only references for nested objects, deep copy creates new independent copies of all nested elements.",
    },
  ],

  "Linked Lists": [
    {
      question:
        "What is the main difference between an array and a linked list?",
      answer:
        "Arrays store elements in contiguous memory; linked lists store elements as nodes connected by pointers.",
    },
    {
      question:
        "What is the time complexity of inserting at the head of a singly linked list?",
      answer: "O(1) because you only update the head pointer.",
    },
    {
      question: "How do you detect a cycle in a linked list?",
      answer: "Use Floyd's cycle-finding algorithm (tortoise and hare).",
    },
    {
      question:
        "What is the advantage of a doubly linked list over a singly linked list?",
      answer:
        "It allows traversal in both directions and easier deletion of a node when given a pointer to it.",
    },
    {
      question: "Why is random access not possible in linked lists?",
      answer:
        "Because elements are not stored in contiguous memory; you must traverse nodes sequentially to reach an index.",
    },
  ],
  Strings: [
    {
      question:
        "What is the difference between a character array and a string in most languages?",
      answer:
        "A string is typically a sequence of characters ending with a null terminator (in C) or a higher-level object with length metadata, while a char array is just raw characters.",
    },
    {
      question: "What is the time complexity of reversing a string?",
      answer: "O(n), where n is the length of the string.",
    },
    {
      question: "What is a palindrome string?",
      answer: "A string that reads the same forward and backward.",
    },
    {
      question: "What is the difference between immutable and mutable strings?",
      answer:
        "Immutable strings cannot be changed after creation (like in Java, Python), while mutable strings can be modified directly (like StringBuilder in Java).",
    },
    {
      question: "What is an anagram?",
      answer: "Two strings containing the same characters in different orders.",
    },
  ],
  "Stacks & Queues": [
    {
      question: "What is the main principle of a stack?",
      answer: "LIFO – Last In, First Out.",
    },
    {
      question: "What is the time complexity of push and pop in a stack?",
      answer: "O(1) for both operations.",
    },
    {
      question: "How can you implement a stack?",
      answer: "Using arrays, linked lists, or dynamic lists.",
    },
    {
      question: "What is stack overflow?",
      answer:
        "An error that occurs when pushing onto a full stack without dynamic resizing.",
    },
    {
      question: "Give one real-world example of a stack.",
      answer:
        "Browser back button history or undo functionality in text editors.",
    },
    {
      question: "What is the main principle of a queue?",
      answer: "FIFO – First In, First Out.",
    },
    {
      question:
        "What is the time complexity of enqueue and dequeue in a queue?",
      answer: "O(1) for both operations in an optimal implementation.",
    },
    {
      question: "What is a circular queue?",
      answer:
        "A queue that connects the end back to the front to reuse freed space.",
    },
    {
      question: "What is the difference between a queue and a deque?",
      answer:
        "A queue allows insertion at the rear and deletion at the front, while a deque allows both at both ends.",
    },
    {
      question: "Give one real-world example of a queue.",
      answer: "People waiting in line for a ticket counter.",
    },
  ],

  Trees: [
    {
      question: "What is a binary tree?",
      answer:
        "A tree data structure in which each node has at most two children: left and right.",
    },
    {
      question: "What is the height of a tree?",
      answer:
        "The number of edges on the longest path from the root to a leaf.",
    },
    {
      question:
        "What is the difference between a binary tree and a binary search tree (BST)?",
      answer:
        "In a BST, the left subtree of a node contains only smaller values, and the right subtree contains only larger values.",
    },
    {
      question: "What is tree traversal?",
      answer:
        "Visiting all nodes in a tree in a specific order, such as inorder, preorder, or postorder.",
    },
    {
      question: "What is a complete binary tree?",
      answer:
        "A binary tree in which all levels are completely filled except possibly the last, which is filled from left to right.",
    },
  ],
  Graphs: [
    {
      question: "What is a graph in data structures?",
      answer:
        "A collection of vertices (nodes) and edges that connect pairs of vertices.",
    },
    {
      question:
        "What is the difference between a directed and an undirected graph?",
      answer:
        "In a directed graph, edges have a direction; in an undirected graph, edges do not.",
    },
    {
      question: "What is a weighted graph?",
      answer:
        "A graph where each edge has an associated numerical value (weight or cost).",
    },
    {
      question: "What is the time complexity of BFS and DFS?",
      answer: "O(V + E), where V is vertices and E is edges.",
    },
    {
      question: "What is a connected graph?",
      answer:
        "A graph in which there is a path between every pair of vertices.",
    },
  ],
  "Dynamic Programming": [
    {
      question: "What is dynamic programming?",
      answer:
        "A technique to solve problems by breaking them into overlapping subproblems and storing their solutions to avoid recomputation.",
    },
    {
      question: "What is the difference between top-down and bottom-up DP?",
      answer:
        "Top-down uses recursion with memoization; bottom-up builds solutions iteratively starting from base cases.",
    },
    {
      question: "What is memoization?",
      answer:
        "Caching the results of expensive function calls and returning the cached result when the same inputs occur again.",
    },
    {
      question: "Name a classic DP problem.",
      answer:
        "0/1 Knapsack Problem, Fibonacci sequence, Longest Common Subsequence.",
    },
    {
      question: "What is the time complexity of solving Fibonacci with DP?",
      answer: "O(n) using either memoization or tabulation.",
    },
  ],
  "Sliding Window": [
    {
      question: "When to use sliding window?",
      answer:
        "When dealing with contiguous subarrays or substrings where the window can expand or shrink to meet conditions.",
    },
    {
      question: "Typical complexity of sliding window?",
      answer: "O(n) because each pointer moves forward at most n times.",
    },
    {
      question:
        "Difference between fixed-size and variable-size sliding window?",
      answer:
        "Fixed-size maintains a constant length; variable-size expands or shrinks based on conditions.",
    },
    {
      question: "Example of a sliding window problem?",
      answer: "Finding the longest substring without repeating characters.",
    },
    {
      question: "Why is sliding window more efficient than nested loops?",
      answer:
        "It avoids reprocessing elements by reusing previous computations as the window moves.",
    },
  ],
};

export const last30Days = Array.from({ length: 30 }, (_, i) => {
  const day = new Date(Date.now() - (29 - i) * 86400000);
  return {
    day: day.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    solved: Math.max(0, Math.round(Math.sin(i / 5) * 3 + 4)),
  };
});

// Generate last year activity mock (365 days)
export const lastYearActivity: { date: string; count: number }[] = (() => {
  const end = new Date();
  end.setHours(0, 0, 0, 0);
  const start = new Date(end);
  start.setDate(end.getDate() - 364);
  const out: { date: string; count: number }[] = [];
  for (
    let d = new Date(start), i = 0;
    d <= end;
    d.setDate(d.getDate() + 1), i++
  ) {
    const base = Math.max(
      0,
      Math.round(Math.sin(i / 10) * 2 + Math.random() * 3)
    );
    out.push({ date: d.toISOString().slice(0, 10), count: base });
  }
  return out;
})();
