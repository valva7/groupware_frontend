// 공통 타입 정의
export interface Member {
  id: string;
  name: string;
  profileImageUrl?: string;
}

export interface Department {
  id: string;
  name: string;
  parentId?: string;
  managerId?: string;
  description?: string;
  children?: Department[];
}

export interface Leave {
  id: string;
  memberId: string;
  memberName: string;
  department: string;
  type: 'annual' | 'sick' | 'personal' | 'other';
  startDate: string;
  endDate: string;
  duration: number; // 시간 단위
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
}

export interface Approval {
  id: string;
  title: string;
  type: string;
  requesterId: string;
  requesterName: string;
  department: string;
  status: 'pending' | 'approved' | 'rejected' | 'draft';
  createdAt: string;
  content: string;
  approvers: ApprovalLine[];
  references?: string[];
  attachments?: Attachment[];
}

export interface ApprovalLine {
  id: string;
  memberId: string;
  memberName: string;
  department: string;
  order: number;
  status: 'pending' | 'approved' | 'rejected';
  comment?: string;
  processedAt?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  startDate: string;
  endDate: string;
  managerId: string;
  managerName: string;
  members: string[];
  progress: number;
}

export interface Vote {
  id: string;
  title: string;
  description: string;
  type: 'single' | 'multiple';
  options: VoteOption[];
  startDate: string;
  endDate: string;
  creatorId: string;
  creatorName: string;
  status: 'active' | 'closed';
  totalVotes: number;
}

export interface VoteOption {
  id: string;
  text: string;
  votes: number;
  voters: string[];
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  categoryId: string;
  categoryName: string;
  createdAt: string;
  updatedAt?: string;
  views: number;
  likes?: number;
  commentsCount?: number;
  attachments?: string[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  type: 'board' | 'approval' | 'project';
  parentId?: string;
}

export interface Attachment {
  id: string;
  name: string;
  originalName: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface Wiki {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt?: string;
  tags: string[];
  attachments?: Attachment[];
}

export interface Manual {
  id: string;
  title: string;
  content: string;
  category: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt?: string;
  version: string;
  attachments?: Attachment[];
}

export interface Notification {
  id: string;
  type: 'approval' | 'project' | 'vote' | 'board' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface Asset {
  id: string;
  name: string;
  type: 'equipment' | 'supplies' | 'furniture' | 'vehicle';
  category: string;
  serialNumber?: string;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  location: string;
  assignedTo?: string;
  status: 'available' | 'in-use' | 'maintenance' | 'disposed';
}

export interface CommonCode {
  id: string;
  groupCode: string;
  groupName: string;
  code: string;
  name: string;
  description?: string;
  order: number;
  isActive: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
  likes: number;
  parentId?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high';
  assigneeId: string;
  assigneeName: string;
  startDate: string;
  endDate: string;
  progress: number;
  projectId: string;
}