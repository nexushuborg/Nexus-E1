export type RevisionStatus = 'Not Started' | 'In Progress' | 'Completed';

export interface RevisionTopic {
  id: string;
  name: string;
  status: RevisionStatus;
  lastReviewed: string | null; // ISO date string or null if never reviewed
  relatedSubmissionIds: string[];
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: number; // in minutes
}

export const revisionTopics: RevisionTopic[] = [
  {
    id: 'dynamic-programming',
    name: 'Dynamic Programming',
    status: 'In Progress',
    lastReviewed: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    relatedSubmissionIds: ['two-sum', 'longest-substring-no-repeat'],
    description: 'Optimization problems solved by breaking them into smaller subproblems',
    difficulty: 'Advanced',
    estimatedTime: 120
  },
  {
    id: 'arrays',
    name: 'Arrays',
    status: 'Completed',
    lastReviewed: new Date(Date.now() - 86400000 * 7).toISOString(), // 1 week ago
    relatedSubmissionIds: ['two-sum'],
    description: 'Linear data structure for storing elements in contiguous memory',
    difficulty: 'Beginner',
    estimatedTime: 60
  },
  {
    id: 'strings',
    name: 'Strings',
    status: 'In Progress',
    lastReviewed: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
    relatedSubmissionIds: ['longest-substring-no-repeat'],
    description: 'Sequence of characters and common string manipulation techniques',
    difficulty: 'Beginner',
    estimatedTime: 90
  },
  {
    id: 'linked-lists',
    name: 'Linked Lists',
    status: 'Not Started',
    lastReviewed: null,
    relatedSubmissionIds: ['merge-k-lists'],
    description: 'Linear data structure with nodes containing data and references',
    difficulty: 'Intermediate',
    estimatedTime: 75
  },
  {
    id: 'trees',
    name: 'Trees',
    status: 'Not Started',
    lastReviewed: null,
    relatedSubmissionIds: [],
    description: 'Hierarchical data structure with nodes and edges',
    difficulty: 'Intermediate',
    estimatedTime: 100
  },
  {
    id: 'graphs',
    name: 'Graphs',
    status: 'Not Started',
    lastReviewed: null,
    relatedSubmissionIds: [],
    description: 'Non-linear data structure with vertices and edges',
    difficulty: 'Advanced',
    estimatedTime: 150
  },
  {
    id: 'sliding-window',
    name: 'Sliding Window',
    status: 'Completed',
    lastReviewed: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    relatedSubmissionIds: ['longest-substring-no-repeat'],
    description: 'Technique for solving problems involving contiguous subarrays',
    difficulty: 'Intermediate',
    estimatedTime: 80
  }
];

// Helper function to get topic by ID
export const getTopicById = (id: string): RevisionTopic | undefined => {
  return revisionTopics.find(topic => topic.id === id);
};

// Helper function to get topics by status
export const getTopicsByStatus = (status: RevisionStatus): RevisionTopic[] => {
  return revisionTopics.filter(topic => topic.status === status);
};

// Helper function to get topics that need review (not reviewed in last 7 days)
export const getTopicsNeedingReview = (): RevisionTopic[] => {
  const sevenDaysAgo = new Date(Date.now() - 86400000 * 7);
  return revisionTopics.filter(topic => 
    topic.status === 'Completed' && 
    topic.lastReviewed && 
    new Date(topic.lastReviewed) < sevenDaysAgo
  );
};
