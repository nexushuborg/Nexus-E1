export type Problem = {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  acceptance: string;
  status: "Solved" | "Attempted" | "Todo";
  date: string;
  source: "LeetCode" | "HackerRank" | "Other";
  codeSnippet: string;
  time?: number;
  category: "DSA" | "System Design" | "Behavioral";
};

export const problems: Problem[] = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    tags: ["Array", "Hash Table"],
    acceptance: "49.1%",
    status: "Solved",
    date: "2024-07-21",
    source: "LeetCode",
    time: 15,
    category: "DSA",
    codeSnippet: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return null;
    }
}`,
  },
  {
    id: "reverse-linked-list",
    title: "Reverse Linked List",
    difficulty: "Easy",
    tags: ["Linked List", "Recursion"],
    acceptance: "38.2%",
    status: "Solved",
    date: "2024-07-20",
    source: "HackerRank",
    time: 25,
    category: "DSA",
    codeSnippet: `class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode current = head;
        while (current != null) {
            ListNode nextTemp = current.next;
            current.next = prev;
            prev = current;
            current = nextTemp;
        }
        return prev;
    }
}`,
  },
  {
    id: "Binary-tree-inorder",
    title: "Binary Tree Inorder Traversal",
    difficulty: "Medium",
    tags: ["Tree", "DFS"],
    acceptance: "33.5%",
    status: "Solved",
    date: "2024-07-19",
    source: "LeetCode",
    time: 45,
    category: "DSA",
    codeSnippet: `class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        helper(root, res);
        return res;
    }
    private void helper(TreeNode root, List<Integer> res) {
        if (root != null) {
            helper(root.left, res);
            res.add(root.val);
            helper(root.right, res);
        }
    }
}`,
  },
  {
    id: "Median-of-Two-Sorted-Arrays",
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    tags: ["Array", "Binary Search"],
    acceptance: "35.0%",
    status: "Attempted",
    date: "2024-07-18",
    source: "LeetCode",
    time: 60,
    category: "DSA",
    codeSnippet: `class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        // Implementation here...
        return 0.0;
    }
}`,
  },
  {
    id: "Valid-Parentheses",
    title: "Valid Parentheses",
    difficulty: "Hard",
    tags: ["String", "Stack"],
    acceptance: "40.6%",
    status: "Solved",
    date: "2024-07-17",
    source: "LeetCode",
    time: 20,
    category: "DSA",
    codeSnippet: `class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '{' || c == '[') {
                stack.push(c);
            } else {
                // ...
            }
        }
        return stack.isEmpty();
    }
}`,
  },
];

const today = new Date();
export const solvedDays: Date[] = Array.from({ length: 25 }, (_, i) => {
  const date = new Date();
  date.setDate(today.getDate() - i);
  return date;
});
