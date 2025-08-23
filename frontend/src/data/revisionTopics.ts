export type RevisionStatus = 'Not Started' | 'In Progress' | 'Completed';

export interface RevisionTopic {
  id: string;
  name: string;
  status: RevisionStatus;
  relatedSubmissionIds: string[];
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export const revisionTopics: RevisionTopic[] = [
  {
    id: 'dynamic-programming',
    name: 'Dynamic Programming',
    status: 'In Progress',
    relatedSubmissionIds: ['two-sum', 'longest-substring-no-repeat'],
    description: 'Optimization problems solved by breaking them into smaller subproblems',
    difficulty: 'Advanced'
  },
  {
    id: 'arrays',
    name: 'Arrays',
    status: 'Completed',
    relatedSubmissionIds: ['two-sum'],
    description: 'Linear data structure for storing elements in contiguous memory',
    difficulty: 'Beginner'
  },
  {
    id: 'strings',
    name: 'Strings',
    status: 'In Progress',
    relatedSubmissionIds: ['longest-substring-no-repeat'],
    description: 'Sequence of characters and common string manipulation techniques',
    difficulty: 'Beginner'
  },
  {
    id: 'linked-lists',
    name: 'Linked Lists',
    status: 'Not Started',
    relatedSubmissionIds: ['merge-k-lists'],
    description: 'Linear data structure with nodes containing data and references',
    difficulty: 'Intermediate'
  },
  {
    id: 'trees',
    name: 'Trees',
    status: 'Not Started',
    relatedSubmissionIds: [],
    description: 'Hierarchical data structure with nodes and edges',
    difficulty: 'Intermediate'
  },
  {
    id: 'graphs',
    name: 'Graphs',
    status: 'Not Started',
    relatedSubmissionIds: [],
    description: 'Non-linear data structure with vertices and edges',
    difficulty: 'Advanced'
  },
  {
    id: 'sliding-window',
    name: 'Sliding Window',
    status: 'Completed',
    relatedSubmissionIds: ['longest-substring-no-repeat'],
    description: 'Technique for solving problems involving contiguous subarrays',
    difficulty: 'Intermediate'
  },
  {
    id: 'stack',
    name: 'Stack',
    status: 'Not Started',
    relatedSubmissionIds: [],
    description: 'LIFO data structure for managing elements with last-in-first-out access',
    difficulty: 'Beginner'
  },
  {
    id: 'two-pointers',
    name: 'Two Pointers',
    status: 'Not Started',
    relatedSubmissionIds: [],
    description: 'Technique using two indices to traverse data structures efficiently',
    difficulty: 'Intermediate'
  }
];

export const getTopicById = (id: string): RevisionTopic | undefined => {
  return revisionTopics.find(topic => topic.id === id);
};

export const getTopicsByStatus = (status: RevisionStatus): RevisionTopic[] => {
  return revisionTopics.filter(topic => topic.status === status);
};

export const getTopicsNeedingReview = (): RevisionTopic[] => {
  return revisionTopics.filter(topic => topic.status === 'Completed');
};

export const updateTopicStatus = (topicId: string, newStatus: RevisionStatus): void => {
  const topicIndex = revisionTopics.findIndex(topic => topic.id === topicId);
  if (topicIndex !== -1) {
    revisionTopics[topicIndex].status = newStatus;
  }
};
