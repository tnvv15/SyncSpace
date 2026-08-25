export type User = {
  id: string;
  name: string;
  color: string;
  avatarUrl: string;
  isOnline: boolean;
};

export type DocumentSummary = {
  id: string;
  title: string;
  updatedAt: string;
  isFavorite: boolean;
  authorId: string;
  isDeleted?: boolean;
};

export const MOCK_USERS: Record<string, User> = {
  'u1': { id: 'u1', name: 'Tanvi', color: '#00667E', avatarUrl: 'https://api.dicebear.com/7.x/notionists/svg?seed=Tanvi&backgroundColor=c0aede', isOnline: true },
  'u2': { id: 'u2', name: 'Alex', color: '#10B981', avatarUrl: 'https://api.dicebear.com/7.x/notionists/svg?seed=Alex&backgroundColor=b6e3f4', isOnline: true },
  'u3': { id: 'u3', name: 'Rahul', color: '#F59E0B', avatarUrl: 'https://api.dicebear.com/7.x/notionists/svg?seed=Rahul&backgroundColor=ffdfbf', isOnline: false },
};

export const CURRENT_USER_ID = 'u1';

export const MOCK_DOCUMENTS: DocumentSummary[] = [
  { id: 'doc-1', title: 'Distributed Systems Notes', updatedAt: '10 mins ago', isFavorite: true, authorId: 'u1' },
  { id: 'doc-2', title: 'Q3 Product Roadmap', updatedAt: '2 hours ago', isFavorite: false, authorId: 'u2' },
  { id: 'doc-3', title: 'SyncSpace Architecture', updatedAt: 'Yesterday', isFavorite: true, authorId: 'u1' },
  { id: 'doc-4', title: 'Weekly Meeting Agenda', updatedAt: '2 days ago', isFavorite: false, authorId: 'u3' },
];

export type BlockType = 'paragraph' | 'heading1' | 'heading2' | 'bullet_list' | 'numbered_list' | 'checklist' | 'code' | 'divider';

export type Block = {
  id: string;
  type: BlockType;
  content: string;
  checked?: boolean; // for checklist
};

export const MOCK_INITIAL_BLOCKS: Block[] = [
  { id: 'b1', type: 'heading1', content: 'Distributed Systems Notes' },
  { id: 'b2', type: 'paragraph', content: 'A distributed system is a collection of autonomous computing elements that appears to its users as a single coherent system.' },
  { id: 'b3', type: 'heading2', content: 'Key Characteristics' },
  { id: 'b4', type: 'bullet_list', content: 'Concurrency of components' },
  { id: 'b5', type: 'bullet_list', content: 'Lack of a global clock' },
  { id: 'b6', type: 'bullet_list', content: 'Independent failure of components' },
  { id: 'b7', type: 'heading2', content: 'CAP Theorem' },
  { id: 'b8', type: 'paragraph', content: 'It is impossible for a distributed data store to simultaneously provide more than two out of the following three guarantees:' },
  { id: 'b9', type: 'numbered_list', content: 'Consistency' },
  { id: 'b10', type: 'numbered_list', content: 'Availability' },
  { id: 'b11', type: 'numbered_list', content: 'Partition tolerance' },
  { id: 'b12', type: 'divider', content: '' },
  { id: 'b13', type: 'heading2', content: 'Implementation Tasks' },
  { id: 'b14', type: 'checklist', content: 'Setup Vector Clocks', checked: true },
  { id: 'b15', type: 'checklist', content: 'Implement CRDT for text', checked: false },
  { id: 'b16', type: 'checklist', content: 'WebRTC signaling server', checked: false },
  { id: 'b17', type: 'code', content: 'function mergeCRDT(local, remote) {\n  // TODO: implement merge logic\n  return resolveConflicts(local, remote);\n}' },
];

export type HistoryEntry = {
  id: string;
  userId: string;
  timestamp: string;
  description: string;
};

export const MOCK_HISTORY: HistoryEntry[] = [
  { id: 'h1', userId: 'u2', timestamp: '10:42 AM', description: 'Added CAP Theorem section' },
  { id: 'h2', userId: 'u1', timestamp: '10:35 AM', description: 'Checked off "Setup Vector Clocks"' },
  { id: 'h3', userId: 'u3', timestamp: '09:15 AM', description: 'Created document' },
];
