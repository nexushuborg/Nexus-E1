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
    code: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (map.has(need)) return [map.get(need), i];
    map.set(nums[i], i);
  }
  return [];
}`,
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
    code: `def lengthOfLongestSubstring(s: str) -> int:
    char_set = set()
    left = 0
    max_length = 0
    
    for right in range(len(s)):
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        
        char_set.add(s[right])
        max_length = max(max_length, right - left + 1)
    
    return max_length`,
    language: "python",
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
    code: `class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        if (lists == null || lists.length == 0) return null;
        
        PriorityQueue<ListNode> minHeap = new PriorityQueue<>((a, b) -> a.val - b.val);
        
        for (ListNode node : lists) {
            if (node != null) {
                minHeap.offer(node);
            }
        }
        
        ListNode dummy = new ListNode(0);
        ListNode current = dummy;
        
        while (!minHeap.isEmpty()) {
            ListNode node = minHeap.poll();
            current.next = node;
            current = current.next;
            
            if (node.next != null) {
                minHeap.offer(node.next);
            }
        }
        
        return dummy.next;
    }
}`,
    language: "java",
    summary:
      "Use a min-heap to always pick the smallest head across lists; O(n log k).",
  },
  {
    id: "binary-tree-inorder",
    title: "Binary Tree Inorder Traversal",
    platform: "LeetCode",
    difficulty: "Easy",
    date: new Date(Date.now() - 86400000 * 7).toISOString(),
    tags: ["Binary Tree", "Depth-First Search"],
    description:
      "Given the root of a binary tree, return the inorder traversal of its nodes' values.",
    code: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        result = []
        
        def inorder(node):
            if not node:
                return
            inorder(node.left)
            result.append(node.val)
            inorder(node.right)
        
        inorder(root)
        return result`,
    language: "python",
    summary:
      "Recursive inorder traversal: left subtree, root, right subtree.",
  },
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    platform: "LeetCode",
    difficulty: "Easy",
    date: new Date(Date.now() - 86400000 * 10).toISOString(),
    tags: ["Stack", "String"],
    description:
      "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    code: `#include <stack>
#include <string>

class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        
        for (char c : s) {
            if (c == '(' || c == '{' || c == '[') {
                st.push(c);
            } else {
                if (st.empty()) return false;
                
                char top = st.top();
                if ((c == ')' && top == '(') || 
                    (c == '}' && top == '{') || 
                    (c == ']' && top == '[')) {
                    st.pop();
                } else {
                    return false;
                }
            }
        }
        
        return st.empty();
    }
};`,
    language: "cpp",
    summary:
      "Use stack to match opening and closing brackets in correct order.",
  },
  {
    id: "reverse-string",
    title: "Reverse String",
    platform: "LeetCode",
    difficulty: "Easy",
    date: new Date(Date.now() - 86400000 * 12).toISOString(),
    tags: ["Strings", "Two Pointers"],
    description:
      "Write a function that reverses a string. The input string is given as an array of characters s.",
    code: `class Solution {
    public void reverseString(char[] s) {
        int left = 0;
        int right = s.length - 1;
        
        while (left < right) {
            char temp = s[left];
            s[left] = s[right];
            s[right] = temp;
            left++;
            right--;
        }
    }
}`,
    language: "java",
    summary:
      "Use two pointers to swap characters from both ends until they meet in the middle.",
  },
  {
    id: "fibonacci-number",
    title: "Fibonacci Number",
    platform: "LeetCode",
    difficulty: "Easy",
    date: new Date(Date.now() - 86400000 * 15).toISOString(),
    tags: ["Dynamic Programming", "Math"],
    description:
      "The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1.",
    code: `def fib(n: int) -> int:
    if n <= 1:
        return n
    
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    
    return b`,
    language: "python",
    summary:
      "Iterative approach using two variables to track previous two numbers.",
  },
  {
    id: "palindrome-number",
    title: "Palindrome Number",
    platform: "LeetCode",
    difficulty: "Easy",
    date: new Date(Date.now() - 86400000 * 18).toISOString(),
    tags: ["Math"],
    description:
      "Given an integer x, return true if x is a palindrome, and false otherwise.",
    code: `class Solution {
public:
    bool isPalindrome(int x) {
        if (x < 0) return false;
        
        int original = x;
        int reversed = 0;
        
        while (x > 0) {
            reversed = reversed * 10 + x % 10;
            x /= 10;
        }
        
        return original == reversed;
    }
};`,
    language: "cpp",
    summary:
      "Reverse the number and compare with original to check if palindrome.",
  },
  {
    id: "climbing-stairs",
    title: "Climbing Stairs",
    platform: "LeetCode",
    difficulty: "Easy",
    date: new Date(Date.now() - 86400000 * 20).toISOString(),
    tags: ["Dynamic Programming", "Math"],
    description:
      "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    code: `function climbStairs(n: number): number {
    if (n <= 2) return n;
    
    let prev1 = 1;
    let prev2 = 2;
    
    for (let i = 3; i <= n; i++) {
        const current = prev1 + prev2;
        prev1 = prev2;
        prev2 = current;
    }
    
    return prev2;
}`,
    language: "typescript",
    summary:
      "Dynamic programming approach using two variables to track previous two states.",
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
