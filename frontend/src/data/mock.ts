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
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    code: `function twoSum(nums, target){\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++){\n    const need = target - nums[i];\n    if (map.has(need)) return [map.get(need), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
    language: "javascript",
    summary: "Use a hash map to store seen numbers and check if complement exists in O(n).",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "2 + 7 = 9" },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" }
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists"
    ],
  },
  {
    id: "longest-substring-no-repeat",
    title: "Longest Substring Without Repeating Characters",
    platform: "LeetCode",
    difficulty: "Medium",
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    tags: ["Strings", "Sliding Window"],
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    code: `function lengthOfLongestSubstring(s){\n  let l = 0, ans = 0;\n  const set = new Set();\n  for (let r = 0; r < s.length; r++){\n    while (set.has(s[r])) set.delete(s[l++]);\n    set.add(s[r]);\n    ans = Math.max(ans, r - l + 1);\n  }\n  return ans;\n}`,
    language: "javascript",
    summary: "Sliding window expands and contracts while maintaining a set of unique chars.",
  },
  {
    id: "merge-k-lists",
    title: "Merge k Sorted Lists",
    platform: "LeetCode",
    difficulty: "Hard",
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    tags: ["Linked List", "Heap"],
    description: "You are given an array of k linked-lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
    code: `class MinHeap{\n  constructor(){ this.a = []; }\n  push(x){ this.a.push(x); this._up(this.a.length-1);}\n  pop(){ const r = this.a[0]; const x = this.a.pop(); if(this.a.length) { this.a[0]=x; this._down(0);} return r;}\n  _up(i){ while(i){ const p=(i-1>>1); if(this.a[p].val<=this.a[i].val) break; [this.a[p],this.a[i]]=[this.a[i],this.a[p]]; i=p;} }\n  _down(i){ for(;;){ let l=i*2+1, r=l+1, s=i; if(l<this.a.length&&this.a[l].val<this.a[s].val) s=l; if(r<this.a.length&&this.a[r].val<this.a[s].val) s=r; if(s===i) break; [this.a[s],this.a[i]]=[this.a[i],this.a[s]]; i=s;} }\n}\nfunction mergeKLists(lists){\n  const h = new MinHeap();\n  for (const node of lists) if (node) h.push(node);\n  const dummy = { val:0, next:null }; let cur = dummy;\n  while(h.a.length){ const n=h.pop(); cur.next=n; cur = cur.next; if(n.next) h.push(n.next);}\n  return dummy.next;\n}`,
    language: "javascript",
    summary: "Use a min-heap to always pick the smallest head across lists; O(n log k).",
  },
];

export const topics: string[] = [
  "Arrays", "Strings", "Linked Lists", "Stacks & Queues", "Trees", "Graphs", "Dynamic Programming", "Sliding Window",
];

export const flashcards: Record<string, { question: string; answer: string }[]> = {
  Arrays: [
    { question: "What is two-pointer technique?", answer: "Use two indexes to traverse array optimizing time or space, often for sorted data." },
    { question: "Kadane's algorithm?", answer: "O(n) to find maximum subarray sum by tracking local and global maxima." },
  ],
  "Sliding Window": [
    { question: "When to use sliding window?", answer: "Substrings/subarrays with contiguous constraint and monotonic expansions." },
    { question: "Typical complexity?", answer: "O(n) with two pointers moving forward at most n steps each." },
  ],
};

export const last30Days = Array.from({ length: 30 }, (_, i) => {
  const day = new Date(Date.now() - (29 - i) * 86400000);
  return { day: day.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), solved: Math.max(0, Math.round(Math.sin(i/5) * 3 + 4)) };
});

// Generate last year activity mock (365 days)
export const lastYearActivity: { date: string; count: number }[] = (() => {
  const end = new Date(); end.setHours(0,0,0,0);
  const start = new Date(end); start.setDate(end.getDate() - 364);
  const out: { date: string; count: number }[] = [];
  for (let d = new Date(start), i = 0; d <= end; d.setDate(d.getDate() + 1), i++) {
    const base = Math.max(0, Math.round(Math.sin(i / 10) * 2 + Math.random() * 3));
    out.push({ date: d.toISOString().slice(0,10), count: base });
  }
  return out;
})();

