// ========================================
// CORE ENTITY TYPES
// ========================================

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface Room {
  id: number;
  name: string;
  userId?: number;
}

export interface Member {
  id: number;
  name: string;
  roomId?: number;
}

// ========================================
// ROOM TYPES
// ========================================

export interface OwnedRoom {
  id: number;
  name: string;
  type: 'owned';
}

export interface MemberRoom {
  id: number;
  name: string;
  type: 'member';
  ownerName: string;
}

export type RoomType = OwnedRoom | MemberRoom;

// ========================================
// BILL & FINANCIAL TYPES
// ========================================

export type BillRule = 'EQUAL' | 'PERCENT' | 'WEIGHT';

export interface BillMeta {
  percents?: Record<string, number>;
  weights?: Record<string, number>;
}

export interface Share {
  id: number;
  memberId: number;
  amountCents: number;
  paid: boolean;
  member?: Member;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  roomId: number;
  createdAt: Date;
}

export interface Tag {
  id: number;
  name: string;
  color: string;
  roomId: number;
  createdAt: Date;
}

export interface BillTag {
  id: number;
  billId: number;
  tagId: number;
  tag?: Tag;
}

export interface Bill {
  id: number;
  title: string;
  amountCents: number;
  period: string;
  rule: BillRule;
  meta: BillMeta | null;
  categoryId?: number;
  category?: Category;
  roomId: number;
  shares: Share[];
  billTags: BillTag[];
  createdAt: Date;
}

// ========================================
// UI & NOTIFICATION TYPES
// ========================================

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  timestamp: Date;
}

// ========================================
// API TYPES
// ========================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiParams {
  params: Promise<{ [key: string]: string }>;
}

export interface RoomParams extends ApiParams {
  params: Promise<{ roomId: string }>;
}

export interface BillParams extends ApiParams {
  params: Promise<{ roomId: string; billId: string }>;
}

export interface MemberParams extends ApiParams {
  params: Promise<{ roomId: string; memberId: string }>;
}

// ========================================
// SUMMARY & ANALYTICS TYPES
// ========================================

export interface RoomSummary {
  totalExpenses: number;
  yourShare: number;
  unpaidBills: number;
  memberCount: number;
  recentActivity: {
    billsThisMonth: number;
    lastActivity: Date;
  };
}

// ========================================
// AUTHENTICATION TYPES
// ========================================

export interface AuthenticatedUser {
  id: number;
  email: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
}

// ========================================
// COMPONENT PROP TYPES
// ========================================

export interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

export interface LoaderProps {
  isLoading: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export type SkeletonType = 'card' | 'list' | 'analytics' | 'room-grid';

// ========================================
// FORM & VALIDATION TYPES
// ========================================

export interface FormErrors {
  [key: string]: string | undefined;
}

export interface SplitMetadata {
  [key: string]: string | number;
}

// ========================================
// UTILITY TYPES
// ========================================

export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;

// ========================================
// UTILITY FUNCTIONS
// ========================================

export const fmt = (cents: number) => (cents / 100).toFixed(2) + " €";
