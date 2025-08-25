export interface Flashcard {
  type: string;
  category: string;
  content: string;
  studyTip?: string;
}

export const topicFlashcards: Record<string, Flashcard[]> = {
  'dynamic-programming': [
    { 
      type: 'Introduction / Definition',
      category: 'Dynamic Programming (DP)',
      content: 'A problem-solving technique used when:\nProblems can be divided into overlapping subproblems.\nThe solution exhibits optimal substructure (whole solution built from subproblem solutions).\nAvoids redundant work by storing results (memoization or tabulation).',
      studyTip: ' Converts slow recursive (exponential) solutions into efficient polynomial-time solutions.'
    },
    { 
      type: 'Key Principles of Dynamic Programming',
      category: 'Core Principles',
      content: '1. Optimal Substructure\nWhole solution can be built from subproblem solutions.\nExample: Shortest path = built from optimal smaller paths.\n2. Overlapping Subproblems\nSame subproblems appear repeatedly in recursion.\nExample: Fibonacci → fib(3) recalculated multiple times.\n3. Memoization & Tabulation\nMemoization: Top-down (store recursive results).\nTabulation: Bottom-up (iterative table/array).',
      studyTip: ' Together, these principles make DP efficient.'
    },
    { 
      type: 'Popular Solution Techniques (Part 1)',
      category: 'DP Techniques',
      content: '1. Memoization (Top-Down)\nRecursion + cache to store results.\nComputes only needed states.\nEasy when recursion is natural.\nExample: fib(50) with stored intermediate results.\n\n2. Tabulation (Bottom-Up)\nIterative; fill DP table from base case → target.\nOften more space-efficient than memoization.\nExample: iterative dp[] array for Fibonacci.',
      studyTip: ' Start with Memoization, then switch to Tabulation for efficiency.'
    },
    { 
      type: 'Popular Solution Techniques (Part 2)',
      category: 'DP Techniques',
      content: '3. Space Optimization\nMany problems need only a few previous states, not full table.\nReduces memory: O(n) → O(1) in some cases.\nExample: Fibonacci using 2 variables instead of array.',
      studyTip: ' Use space optimization when you only need recent states, not the full DP table.'
    },
    { 
      type: 'Common Use Cases of DP (Part 1)',
      category: 'Applications',
      content: '1. Combinatorial Counting\n"How many ways" type problems.\nExample: Ways to climb stairs (Fibonacci-like).\n\n2. Sequence/String Problems\nSubsequence, substring, string matching.\nExample: LCS, Edit Distance.\n\n3. Optimization Problems\nFind min/max cost, value, profit, or distance.\nExample: Coin Change, Knapsack.',
      studyTip: ' These three categories cover most counting and optimization DP problems.'
    },
    { 
      type: 'Common Use Cases of DP (Part 2)',
      category: 'Applications',
      content: '4. Grid/Path Problems\nPaths with obstacles or min/max sums.\nExample: Unique Paths in a matrix.\n\n5. Partitioning Problems\nDivide array/string under constraints.\nExample: Palindrome Partitioning, Equal Subset Sum.',
      studyTip: ' Grid problems and partitioning are advanced DP applications that build on the basics.'
    },
    { 
      type: 'Question Identifiers (How to know it\'s a DP problem?) (Part 1)',
      category: 'Problem Recognition',
      content: '1. Overlapping Subproblems\nRecursive exploration with repeated subproblems.\nExample: Fibonacci, Climbing Stairs.\n\n2. Keywords: Max / Min / Count / Longest / Shortest\nOptimization or counting goals often → DP.\n\n3. Choice-based Problems\nMust choose/include or skip/exclude.\nExample: Knapsack.',
      studyTip: ' Look for repeated work, optimization keywords, and choice-based decisions.'
    },
    { 
      type: 'Question Identifiers (How to know it\'s a DP problem?) (Part 2)',
      category: 'Problem Recognition',
      content: '4. Sequential Dependency\nCurrent state depends on previous states (i, i-1, i-2).\nExample: House Robber.\n\n5. Subsequence / Partition Based\nDeals with sub-arrays, substrings, subsequences.\nExample: Longest Palindromic Subsequence.',
      studyTip: ' Sequential dependencies and subsequence problems are strong DP indicators.'
    }
  ],
  'arrays': [
    { 
      type: 'Definition',
      category: 'Data Structure',
      content: 'A collection of elements of the same data type stored in contiguous memory locations.\nKey Points:\nFixed size → Size set at declaration, usually not resizable (static arrays).\nIndex access (O(1)) → Direct access to elements via index.\nZero-based indexing → First element at index 0.\nExample:\narr = {10, 20, 30, 40, 50}\narr[0] = 10\narr[4] = 50',
      studyTip: ' Arrays provide O(1) random access but O(n) insertion/deletion at the beginning.'
    },
    { 
      type: 'Key Principles',
      category: 'Core Concepts',
      content: 'Index-based Access:\narr[index] retrieval in O(1) (constant time).\nTraversal:\nVisiting all elements takes O(n) (linear time).\nInsertion/Deletion:\nEnd: O(1) (amortized in dynamic arrays).\nFront/Middle: O(n), since elements must be shifted.\nMemory Layout:\nStored in contiguous memory → efficient for cache usage & pointer arithmetic.',
      studyTip: ' Use arrays when you need fast random access and know the size in advance.'
    },
    {
      type: 'Array Solution Techniques (Part 1)',
      category: 'Techniques',
      content: '1. Sliding Window\nIdea: Maintain a moving "window" (subarray) to avoid recomputation.\nUse: Fixed/variable size subarray problems.\nTime: O(n) (instead of O(n²)).\nExamples: Max sum of subarray of size k, Longest substring/sequence with constraint\n\n2. Prefix Sum / Cumulative\nIdea: Precompute prefix sums (or aggregates) for fast range queries.\nUse: Subarray sums, difference arrays, range updates.\nTime: Preprocess O(n), Query O(1).\nExamples: Subarray sum between L and R queried multiple times, Is there a subarray with sum = K?',
      studyTip: ' Sliding window and prefix sums are essential for efficient array processing.'
    },
    {
      type: 'Array Solution Techniques (Part 2)',
      category: 'Techniques',
      content: '3. Two-Pointer (Fast–Slow)\nIdea: Use two pointers with different speeds or directions.\nUse: Optimize nested loops, find pairs/subarrays, detect cycles.\nTime: O(n) (vs O(n²)).\nExamples: Two numbers in sorted array = target, Move zeros to end / partition arrays, Detect loop in linked list',
      studyTip: ' Two pointers are perfect for optimizing nested loops and finding pairs.'
    },
    {
      type: 'Common Use Cases (Part 1)',
      category: 'Applications',
      content: '1. Searching Elements\nLinear Search (unsorted): O(n)\nBinary Search (sorted): O(log n)\n\n2. Subarray / Interval Problems\nMax/Min sum subarray → Kadane\'s / Sliding Window\nRange queries → Prefix Sums\n\n3. Frequency-based Counting\nCounting occurrences of elements.\nOften use hashing + arrays.',
      studyTip: ' These three use cases cover most basic array operations and optimizations.'
    },
    {
      type: 'Common Use Cases (Part 2)',
      category: 'Applications',
      content: '4. Sorting-based Challenges\nSort array to simplify pairs/triplet problems.\nFoundation for two-pointer problems.\n\n5. Simulation Problems\nUse arrays to model sequences/states (scores, heights, timestamps, etc.).',
      studyTip: ' Sorting and simulation are advanced array applications that build on the basics.'
    },
    {
      type: 'Question Identifiers',
      category: 'Problem Recognition',
      content: 'Direct Mention:\n"Given an array… find/compute/check…"\nContiguous subsequence/subarray/segment:\nLook for Prefix Sum / Sliding Window / Kadane\'s.\nRearrange, rotate, shift, partition elements:\nLikely Two Pointer Technique.\nFrequency / Duplicates / Missing Number:\nNeeds Hashing / Counting arrays.\nRepeated range queries (sum/diff):\nUse Prefix Sum / Difference Arrays.',
      studyTip: ' Look for array manipulation, subarray problems, or element counting keywords.'
    }
  ],
  'strings': [
    { 
      type: 'Introduction / Definition',
      category: 'String Data Type',
      content: 'String is a sequence of characters stored contiguously in memory.\nTreated as an array of characters but with additional functionality (especially in high-level languages like Python, Java, C++).\nOften used to represent textual data.\nKey points:\nStrings may be mutable (can be modified, e.g., in Python using list conversion, in C++ with std::string) or immutable (cannot be changed directly, e.g., Python str, Java String).\nCharacters are indexed like an array → allows O(1) access.',
      studyTip: ' Strings are immutable in most languages, so operations create new strings.'
    },
    { 
      type: 'Key Principles',
      category: 'Core Concepts',
      content: 'Indexing:\nAccessing characters at positions (0-based index).\nSubstrings are contiguous slices of the main string.\nImmutability vs Mutability:\nIn most languages, string objects are immutable, meaning modifications create new strings.\nFor performance, specialized mutable alternatives (like StringBuilder in Java, list in Python, stringstream in C++) are used.\nOperations Complexity:\nAccessing character → O(1)\nConcatenation → O(n) (depends on language implementation)\nSubstring → O(k), where k is substring length\nSearch operations (naive) → O(n·m), optimized algorithms reduce complexity',
      studyTip: ' Use string manipulation libraries for complex operations to avoid reinventing the wheel.'
    },
    {
      type: 'Popular Solution Techniques (Part 1)',
      category: 'String Algorithms',
      content: 'These are staple string problem-solving techniques in competitive programming:\n1. Hashing (Rolling Hash, Rabin–Karp)\nUse: Pattern searching, substring comparisons.\nIdea: Convert string portions into numerical hashes to compare quickly.\nExample: Find all occurrences of a substring in a text.\n\n2. Two-pointer / Sliding Window Technique\nUse: Problems involving substrings with certain conditions (like "longest substring without repeating characters").\nIdea: Expand window to include, contract when condition breaks.\nExample: Longest substring with K distinct characters.',
      studyTip: ' Hashing is great for pattern matching, while sliding window handles substring constraints.'
    },
    {
      type: 'Popular Solution Techniques (Part 2)',
      category: 'String Algorithms',
      content: '3. KMP / Z-algorithm / Prefix-function\nUse: Efficient substring searching and prefix-suffix matching.\nKMP: Find pattern in O(n + m).\nZ-function: Works in O(n) to find occurrences and prefix matches.\nExample: Searching for words in the dictionary, string rotations.',
      studyTip: ' For pattern matching, consider KMP or Boyer-Moore for large strings.'
    },
    {
      type: 'Use Cases (Part 1)',
      category: 'Applications',
      content: 'You can often spot String-related problems by checking for these:\n1. Pattern Searching / Matching\ne.g., Find if a word appears in text, find occurrences of a substring.\n\n2. Palindrome / Reverse Checking\ne.g., Longest Palindromic Substring, Palindrome Partitioning.\n\n3. Frequency / Counting Characters\ne.g., Anagrams, Isomorphic strings, word counting.',
      studyTip: ' These three categories cover most basic string manipulation and analysis.'
    },
    {
      type: 'Use Cases (Part 2)',
      category: 'Applications',
      content: '4. Substring / Subsequence Problems\ne.g., Longest Common Substring, Longest Common Subsequence (LCS).\n\n5. Encoding / Decoding / Compression\ne.g., Run-length encoding, String compression problems.\n\n6. Dynamic Programming on Strings\ne.g., Edit Distance, Minimum Insertions/Deletions to make palindromes.',
      studyTip: ' Advanced string problems involve subsequences, compression, and dynamic programming.'
    },
    {
      type: 'Question Identifiers',
      category: 'Problem Recognition',
      content: 'The problem involves words, characters, substrings and subsequences.\nMentions pattern searching, palindromes, rotation, repetition.\nIncludes constraints about unique characters, counts, ordering.\nLarge input sizes hinting at need for efficient search algorithms (KMP, Z, Hashing).\nMentions transforming one string to another (edit distance, subsequence check).',
      studyTip: ' Look for text processing, pattern matching, or character manipulation keywords.'
    }
  ],
  'linked-lists': [
    {
      type: 'Definition',
      category: 'Data Structure',
      content: 'Dynamic data structure made of nodes.\nEach node = data + pointer (reference) to next (in singly list).\nMemory:\nNodes are not contiguous, connected via pointers.\nAllows dynamic sizing and efficient insertions/deletions (vs arrays).\nTypes:\nSingly Linked List → node points to next only.\nDoubly Linked List → node points to next & previous.\nCircular Linked List → last node connects back to head.\nVisualization (Singly):\nHead → Node1 → Node2 → Node3 → NULL',
      studyTip: ' Linked lists are great for dynamic size but have no random access.'
    },
    {
      type: 'Key Principles',
      category: 'Core Concepts',
      content: 'Dynamic Size: Nodes can be added/removed at runtime (no fixed length).\nSequential Access:\nNo direct indexing → must traverse from head.\nAccessing nᵗʰ node = O(n).\nInsertions/Deletions:\nAt head = O(1)\nAt specific position = O(n) (find node) + O(1) (update links)\nMemory Usage: Extra space for pointers/references in each node.\nNo Random Access: Cannot jump to element by index like arrays.\nUse Cases: Low-level memory management, real-time systems, frequent insert/delete operations.',
      studyTip: ' Choose singly linked for simple traversal, doubly linked for bidirectional operations.'
    },
    {
      type: 'Popular Techniques (Part 1)',
      category: 'Linked List Algorithms',
      content: '1. Slow & Fast Pointer (Tortoise & Hare)\nIdea: Two pointers, slow = 1 step, fast = 2 steps.\nUse Cases:\nDetect cycle / loop\nFind cycle start\nFind middle element\nTime: O(n)\n\n2. Reversing a Linked List\nIdea: Reverse node pointers (iterative/recursive).\nKey Steps: Use prev, current, next pointers and flip links.',
      studyTip: ' Fast and slow pointers are essential for cycle detection and finding middle elements.'
    },
    {
      type: 'Popular Techniques (Part 2)',
      category: 'Linked List Algorithms',
      content: 'Use Cases:\nPalindrome check\nReorder/rotate list\nTime: O(n)\n\n3. Merging Two Sorted Linked Lists\nIdea: Like merge step in merge sort, rearranging pointers (no extra array).\nUse Cases:\nCombine sorted lists\nSorting via divide & conquer\nTime: O(n + m) (for lists of size n, m)',
      studyTip: ' Reversing and merging are fundamental linked list manipulation techniques.'
    },
    {
      type: 'Common Use Cases (Part 1)',
      category: 'Applications',
      content: '1. Dynamic Insertions/Deletions\nAdd/remove nodes without shifting data (unlike arrays).\nExamples: Implement stacks, queues with dynamic size.\n\n2. Cycle Detection & Removal\nDetect infinite loops using slow/fast pointers.\nExamples: Prevent infinite traversal in cyclic structures.\n\n3. Middle / Nth Element from End\nUse slow fast pointer or two pointer to find element efficiently.',
      studyTip: ' These three use cases cover the core advantages of linked lists over arrays.'
    },
    {
      type: 'Common Use Cases (Part 2)',
      category: 'Applications',
      content: '4. Reversal & Reordering\nReverse full/partial list, reorder nodes by position/value.\nExamples: Palindrome check, rotate/reorder list.\n\n5. Merging & Sorting\nMerge two sorted lists, apply merge sort on linked list.\n\n6. Abstract Data Types\nBasis for Stacks, Queues, Deques, Graph adjacency lists.',
      studyTip: ' Advanced linked list operations involve manipulation and building other data structures.'
    },
    {
      type: 'Question Identifiers (Part 1)',
      category: 'Problem Recognition',
      content: 'Explicit Statements:\n"Given the head of a linked list…"\n"Linked list node structure…"\n\nPointer-based Sequence:\nSequence defined with pointers/references, not array indices.\n\nFrequent Insertions/Deletions:\nProblem involves operations where shifting elements would be costly in arrays.',
      studyTip: ' Look for explicit linked list mentions and pointer-based operations.'
    },
    {
      type: 'Question Identifiers (Part 2)',
      category: 'Problem Recognition',
      content: 'Common Tasks:\nDetect cycles\nFind middle or nth-from-end\nReverse list\nMerge two lists\n\nKeyword Hints:\n"Next pointer" / "Node reference" / "Head node"\n"Reverse linked list"\n"Detect cycle"\n"Merge two sorted lists"',
      studyTip: ' Specific linked list operations and pointer manipulation keywords are strong indicators.'
    }
  ],
  'trees': [
    {
      type: 'Definition',
      category: 'Data Structure',
      content: 'A hierarchical, non-linear structure of nodes connected by edges.\nProperties:\nConnected & Acyclic (no cycles).\nRoot Node: Starting node with unique path to every other node.\nChildren: Nodes directly below a parent.\nLeaves: Nodes with no children.\nKey Terms:\nParent: Node directly above.\nChild: Node directly below.\nSubtree: A node + its descendants.\nHeight: Longest path from a node to a leaf.',
      studyTip: ' Trees are perfect for representing hierarchical relationships.'
    },
    {
      type: 'Key Principles',
      category: 'Core Concepts',
      content: 'Hierarchical Structure: Nodes arranged in levels from root → leaves.\nRecursive Nature: Subtrees mirror tree structure → many solutions use recursion.\nTraversals:\nDFS → Preorder, Inorder, Postorder\nBFS → Level-order\nTypes:\nBinary Tree: Each node has ≤ 2 children (left, right).\nBinary Search Tree (BST): Left < Node < Right (ordering property).\nBalanced Trees: Keep height ≈ log(n) (e.g., AVL, Red-Black) → efficient search/insert/delete.',
      studyTip: ' Inorder traversal gives sorted order in Binary Search Trees.'
    },
    {
      type: 'Popular Techniques (Part 1)',
      category: 'Tree Algorithms',
      content: '1. Depth-First Search (DFS)\nIdea: Recursive or stack-based; explore branch fully before backtracking.\nUses: Traversals (pre/in/post), subtree calculations, path & ancestor problems.\nTime: O(n) (n = no. of nodes).\n\n2. Breadth-First Search (BFS) / Level Order\nIdea: Queue-based; explore nodes level by level.\nUses: Shortest path (unweighted trees), level-wise queries, iterative traversals.\nTime: O(n)',
      studyTip: ' DFS and BFS are fundamental tree traversal techniques with different use cases.'
    },
    {
      type: 'Popular Techniques (Part 2)',
      category: 'Tree Algorithms',
      content: '3. Binary Search Tree (BST) Operations\nIdea: Use BST property (Left < Node < Right) for search/insert/delete.\nOperations:\nSearch: Compare & move left/right.\nInsert/Delete: Adjust while preserving BST rules.\nTime: O(log n) (balanced), O(n) (skewed).',
      studyTip: ' BST enables O(log n) search, insert, and delete operations.'
    },
    {
      type: 'Common Use Cases (Part 1)',
      category: 'Applications',
      content: '1. Hierarchy Modelling\nRepresent organization charts, file systems, XML/JSON structures.\n\n2. Dynamic Searching/Sorting\nUse Binary Search Tree (BST) or Segment Trees for fast search/updates.\n\n3. Traversal-Based Computations\nCalculate sum of nodes, max depth, #leaves, path sums.',
      studyTip: ' These three use cases cover the core applications of tree data structures.'
    },
    {
      type: 'Common Use Cases (Part 2)',
      category: 'Applications',
      content: '4. Lowest Common Ancestor (LCA)\nFind shared ancestor of two nodes.\nKey in DP, graph/tree intersection problems.\n\n5. Balanced Tree Problems\nAVL, Red-Black Trees keep height ~ log(n).\nEnsure efficient insert/search/delete.\n\n6. Dynamic Range Queries\nSegment Trees / Fenwick Trees (BIT) for range sums, min/max, updates.',
      studyTip: ' Advanced tree applications involve complex algorithms and optimizations.'
    },
    {
      type: 'Question Identifiers (Part 1)',
      category: 'Problem Recognition',
      content: 'Hierarchical Dataset:\nProblem involves parent-child relations or starts from a root.\n\nKeyword Hints:\n"Tree", "Root", "Parent", "Child"\n"Binary Tree", "Binary Search Tree (BST)"\n"Subtree", "Depth", "Height"\n"Lowest Common Ancestor (LCA)"',
      studyTip: ' Look for hierarchical relationships and tree-specific keywords.'
    },
    {
      type: 'Question Identifiers (Part 2)',
      category: 'Problem Recognition',
      content: 'Problem Patterns:\nRequires node traversal (DFS/BFS).\nPath / Subtree queries (sum, max depth, #nodes, distances).\nStructural checks (is balanced, is BST, diameter, symmetry).\nModifications (insert, delete, rotate, reorder, restructure).\n\nEfficiency Hints:\nLarge input sizes with path/ancestor queries → expect O(n) or O(log n) tree solutions, not brute force.',
      studyTip: ' Tree problems typically involve traversal, queries, or structural modifications.'
    }
  ],
  'graphs': [
    {
      type: 'Introduction / Definition (Part 1)',
      category: 'Graph Data Structure',
      content: 'A Graph is a data structure consisting of:\nVertices (Nodes): The fundamental units.\nEdges: Connections between vertices (can be directional or bidirectional).\n\nGraphs are often represented as G(V, E):\nV → Set of vertices (nodes).\nE → Set of edges (connections: pairs of vertices).',
      studyTip: ' Graphs model relationships and connections between entities using vertices and edges.'
    },
    {
      type: 'Introduction / Definition (Part 2)',
      category: 'Graph Data Structure',
      content: 'Graphs can be:\nDirected (Digraph): Edges have direction.\nUndirected: Edges are bidirectional.\nWeighted: Each edge has a cost/weight.\nUnweighted: Edges are considered equal.\nCyclic / Acyclic (DAG - Directed Acyclic Graph): Determines if a graph has cycles.\n\nIn short, a graph models relationships/connections between entities',
      studyTip: ' Understanding graph types helps choose the right algorithms and representations.'
    },
    {
      type: 'Key Principles',
      category: 'Core Concepts',
      content: 'Representation:\nAdjacency List (sparse), Adjacency Matrix (dense), Edge List.\nTraversal: BFS (layer-wise), DFS (depth-wise).\nProperties: Path, Cycle, Connectivity, Degree, Bipartite.',
      studyTip: ' Use adjacency matrix for dense graphs, adjacency list for sparse graphs.'
    },
    {
      type: 'Solution Techniques',
      category: 'Graph Algorithms',
      content: '1. Traversal (BFS/DFS): Components, cycle check, path existence.\n2. Shortest Path:\nBFS (unweighted),\nDijkstra (weighted, non-neg),\nBellman-Ford (neg. weights),\nFloyd-Warshall (all pairs).\n3. MST (Minimum Spanning Tree):\nKruskal (edges + union-find),\nPrim (expand tree stepwise).',
      studyTip: ' DFS for exploring paths, BFS for finding shortest paths in unweighted graphs.'
    },
    {
      type: 'Use Cases',
      category: 'Applications',
      content: 'Cycle Detection → DFS check.\nShortest Path → Maps, routing, grid problems.\nConnectivity → Groups, islands, networks.\nTopological Sort → Dependencies, scheduling, courses.\nBipartite Check → Coloring, job assignment, matching.',
      studyTip: ' Graphs are perfect for modeling networks, relationships, and dependencies.'
    },
    {
      type: 'Problem Identifiers',
      category: 'Problem Recognition',
      content: 'Keywords:\n"connected/reachable?" → Traversal\n"shortest/min steps/cost?" → BFS/Dijkstra\n"order/dependency?" → Topological Sort\n"groups/islands/components?" → BFS/DFS\n"minimum cost to connect?" → MST\n"split into 2 groups?" → Bipartite',
      studyTip: ' Look for relationship, connection, or network-related keywords.'
    }
  ],
  'stack': [
    {
      type: 'Introduction / Definition',
      category: 'Stack Data Structure',
      content: 'What is a Stack?\nA linear data structure that follows the principle of LIFO (Last In, First Out).\nImagine a stack of plates: you place (push) plates on top and remove (pop) only from the top.\nOnly the top element of the stack is accessible at any given time.',
      studyTip: ' Think of a stack like a stack of books - you can only access the top book.'
    },
    {
      type: 'Key Principles',
      category: 'Core Operations',
      content: 'Access Rule: You can work only with the top-most element.\nTerminologies and Time Complexity:\nPush → Insert element at the top. → O(1)\nPop → Remove element from the top. → O(1)\nPeek/Top → Retrieve the top element without removing it. → O(1)\nEmpty → Check whether the stack has no elements. → O(1)',
      studyTip: ' All stack operations are O(1) - that\'s what makes them efficient!'
    },
    {
      type: 'Solution Techniques',
      category: 'Common Applications',
      content: '1. Balanced Parentheses / Expression Validation\nUse case: Checking if every opening bracket has a matching closing one.\nApproach: Push opening brackets, pop when a closing bracket appears, and match types.\n2. Next Greater Element (NGE) / Monotonic Stacks\nUse case: Finding closest greater/smaller element to left/right for each position.\nApproach: Maintain a stack while traversing. Pop elements that don\'t satisfy conditions and store answers efficiently.\nClassic problems: "Next Greater Element", "Stock Span problem".\n3. Expression Evaluation (Postfix/Prefix/Infix Conversions)\nUse case: Evaluating expressions like 3 + 5 * (2 - 1) efficiently.\nApproach: Convert infix → postfix using stack. Evaluate postfix using stack.\nImportant in compiler design.',
      studyTip: ' Stacks are perfect for problems involving matching pairs or maintaining order.'
    },
    {
      type: 'Use Cases',
      category: 'Applications',
      content: 'You can often identify stack problems by spotting these patterns:\n1. Reversal or Undo Operations\ne.g., browser back button, undo/redo in text editors.\n2. Parentheses / Nested Structure Checking\ne.g., Valid parentheses, HTML/XML tag matching.\n3. Next Greater / Smaller Element Problems\ne.g., Stock span, Largest Rectangle in Histogram.\n4. Function Call Tracking (Recursion)\nStack maintains "call stack" for function calls.\n5. Expression Parsing and Evaluation\ne.g., Infix → Postfix conversion, expression solvers.',
      studyTip: ' Stacks naturally handle LIFO operations and nested structures.'
    },
    {
      type: 'Question Identifiers',
      category: 'Problem Recognition',
      content: 'If the problem statement contains one or more of the following hints, think Stack:\n"Last inserted, first removed" type constraint.\nMatching pairs (parentheses, tags, delimiters).\nMonotonic order checks (Next greater/smaller element).\nUndo/Redo / Backtracking style requirements.\nNested / hierarchical expressions evaluation.',
      studyTip: ' Look for LIFO behavior, matching pairs, or nested structure keywords.'
    }
  ],
  'two-pointers': [
    {
      type: 'Introduction / Definition',
      category: 'Two Pointers Technique',
      content: 'What is Two Pointers Technique?\nA problem-solving approach where we use two indices (pointers) to traverse a data structure (mostly arrays or strings) in a smart way.\nInstead of using nested loops (O(n²)), the two-pointers technique often reduces complexity to O(n).\nPointers usually represent indices at start, end, or current scanning position.\nKey Intuition: When brute force requires comparing every pair → try moving two pointers strategically to avoid repeated work.',
      studyTip: ' Two pointers can often convert O(n²) solutions to O(n) solutions.'
    },
    {
      type: 'Key Principles',
      category: 'Core Concepts',
      content: 'Pointer Movement:\nOne pointer starts at the beginning, another at the end (Opposite-direction approach).\nOr both start at the beginning and move forward with conditions (Same-direction approach).\nDecision Making:\nMovement of pointers depends on problem constraints.\nExample: If the sum is too large → move the right pointer left (to decrease).\nIf the sum is too small → move left pointer right (to increase).\nEfficiency:\nHandles problems like searching pairs, subarray/substrings analysis efficiently.\nTime Complexity → O(n) in most cases.',
      studyTip: ' The key is deciding when and how to move each pointer based on the problem constraints.'
    },
    {
      type: 'Popular Solution Techniques (Part 1)',
      category: 'Two Pointer Patterns',
      content: '1. Opposite-direction Two Pointers (Start and End)\nUse case: Sorted arrays when searching for pairs/triplets.\nExample: Check if the array has two numbers that add up to the target sum.\nWorks well with sorted arrays.\n\n2. Same-direction Sliding Window (Expanding + Contracting)\nUse case: Subarray / substring problems (finding max/min length with conditions).\nExample: Longest substring without repeating characters.\nMinimum window substring containing all characters.',
      studyTip: ' Opposite-direction pointers work well with sorted arrays, while same-direction handles subarray problems.'
    },
    {
      type: 'Popular Solution Techniques (Part 2)',
      category: 'Two Pointer Patterns',
      content: '3. Fast-Slow Pointers (a.k.a. Tortoise and Hare)\nUse case: Linked list cycle detection, finding middle of list.\nIdea: One pointer moves step by step, another moves faster (2x steps).\nExample: Detect cycle in linked list → if they meet, cycle exists.',
      studyTip: ' Fast-slow pointers are perfect for cycle detection and finding middle elements in linked lists.'
    },
    {
      type: 'Use Cases (Part 1)',
      category: 'Applications',
      content: '1. Searching in Sorted Arrays\ne.g., 2-sum in sorted array, 3-sum.\n\n2. Substring / Subarray Problems\ne.g., Longest substring with at most K distinct characters.\n\n3. Merge-like Operations\ne.g., Merging two sorted arrays efficiently.',
      studyTip: ' Two pointers are excellent for searching, subarray problems, and merge operations.'
    },
    {
      type: 'Use Cases (Part 2)',
      category: 'Applications',
      content: '4. Palindrome Checking\ne.g., Compare characters from both ends inward.\n\n5. Linked List Problems\ne.g., Cycle detection, middle element.\n\n6. Counting / Comparing Pairs\ne.g., Number of valid subarrays with sum less than target.',
      studyTip: ' Two pointers handle palindrome checks, linked list operations, and pair counting efficiently.'
    },
    {
      type: 'Question Identifiers',
      category: 'Problem Recognition',
      content: 'The problem involves an array or string with constraints (subarray/substring length, sum, unique elements).\nPresence of sorted input (often hints at two-pointers for sum/pairs type problems).\nMentions pair, triplets, combinations with conditions.\nRequires reducing O(n²) brute-force to a faster solution.\nLinked list problems asking about cycle detection or middle element.',
      studyTip: ' Look for problems that would naturally require nested loops but can be optimized.'
    }
  ],
  'sliding-window': [
    {
      type: 'Definition',
      category: 'Algorithm Technique',
      content: 'Optimizes problems on arrays/strings by maintaining a contiguous window (subarray/substring) that slides across data, updating results incrementally.\nWhy Use:\nAvoids reprocessing elements.\nReduces O(n²) nested loops → O(n).\nTypes:\nFixed-Size Window: Window length stays constant.\nVariable-Size Window: Expands/contracts based on conditions.',
      studyTip: ' Sliding window is perfect for problems involving contiguous subarrays/substrings.'
    },
    {
      type: 'Key Principles (Part 1)',
      category: 'Core Concepts',
      content: 'Two Pointers (L & R): Define current window boundaries.\n\n1. Fixed-Size Window\nStart with first k elements.\nSlide by removing leftmost & adding new rightmost element.\nUpdate result incrementally (not full recompute).',
      studyTip: ' Fixed-size windows maintain constant boundaries and update incrementally.'
    },
    {
      type: 'Key Principles (Part 2)',
      category: 'Core Concepts',
      content: '2. Variable-Size Window\nExpand R while condition holds.\nShrink with L when condition breaks.\nBalances growth & shrinkage to meet constraints.\n\nPerformance:\nEach element processed at most twice → O(n) time.\nSpace: O(1) to O(n) depending on helpers (maps/sets).',
      studyTip: ' Variable-size windows dynamically adjust boundaries based on conditions.'
    },
    {
      type: 'Popular Techniques (Part 1)',
      category: 'Implementation Patterns',
      content: '1. Fixed-Size Window\nApproach:\nCompute result for first k elements.\nSlide: subtract leftmost, add new rightmost.\nUse Cases:\nMax/Min sum subarray of size k\nMoving averages\nComplexity: O(n)',
      studyTip: ' Fixed-size windows are perfect for problems with constant window size requirements.'
    },
    {
      type: 'Popular Techniques (Part 2)',
      category: 'Implementation Patterns',
      content: '2. Variable-Size Window\nApproach:\nExpand R until constraint breaks.\nShrink with L to restore condition.\nUse Cases:\nLongest substring without repeats\nShortest subarray meeting condition\nComplexity: O(n)',
      studyTip: ' Variable-size windows dynamically adjust to find optimal solutions.'
    },
    {
      type: 'Popular Techniques (Part 3)',
      category: 'Implementation Patterns',
      content: '3. With Auxiliary Data Structures\nApproach:\nTrack frequencies/counts using hashmap/array inside window.\nUpdate dynamically during slide.\nUse Cases:\nCount distinct elements in each window\nLongest substring with ≤ k distinct chars\nComplexity: O(n), Space: O(k) or O(1) (if limited range)',
      studyTip: ' Auxiliary data structures help track complex conditions within the sliding window.'
    },
    {
      type: 'Common Use Cases (Part 1)',
      category: 'Applications',
      content: '1. Max/Min Sum or Average (Fixed Size k)\nExamples:\nMax sum of subarray of size k\nMoving average of data stream\n\n2. Longest/Shortest Substring or Subarray (Variable Size)\nExamples:\nLongest substring without repeating characters\nShortest subarray with sum ≥ S',
      studyTip: ' Fixed-size windows are great for sum/average problems, while variable-size handles length optimization.'
    },
    {
      type: 'Common Use Cases (Part 2)',
      category: 'Applications',
      content: '3. Distinct / Frequency Constraints\nExamples:\nNumber of subarrays with at most k distinct integers\nSubarray with exactly k different characters\n\n4. Pattern Detection in Strings/Arrays\nExamples:\nFind all anagrams of a pattern string in text\nLongest substring with at most 2 distinct characters',
      studyTip: ' Sliding window with auxiliary data structures handles complex frequency and pattern problems.'
    },
    {
      type: 'Question Identifiers (Part 1)',
      category: 'Problem Recognition',
      content: 'Contiguous subsequence (subarrays/substrings), not arbitrary subsets.\nFixed window size k OR variable-size window based on conditions.\n\nTask requires:\nMax/Min value\nLongest/Shortest length\nCount of distinct/frequency in contiguous sequence',
      studyTip: ' Look for problems involving contiguous sequences with optimization goals.'
    },
    {
      type: 'Question Identifiers (Part 2)',
      category: 'Problem Recognition',
      content: 'Naive nested loops → O(n²), but problem expects O(n) / near-linear.\n\nKeyword Hints:\n"Longest substring/subarray"\n"Maximum sum subarray of size k"\n"Window of size k" / "Contiguous elements"\n"Expand/contract window" / "Move window"',
      studyTip: ' Sliding window keywords and efficiency requirements are strong indicators.'
    }
  ]
};

export const getFlashcardsForTopic = (topicId: string): Flashcard[] => {
  return topicFlashcards[topicId] || [];
};

export const getAvailableTopicIds = (): string[] => {
  return Object.keys(topicFlashcards);
};

export const hasFlashcards = (topicId: string): boolean => {
  return topicId in topicFlashcards;
};
