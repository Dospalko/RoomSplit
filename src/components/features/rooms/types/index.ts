// Domain types for rooms feature
export type Member = { id: number; name: string };
export type Share = { id: number; memberId: number; amountCents: number; paid: boolean; member?: { id: number; name: string } };
export type BillRule = 'EQUAL' | 'PERCENT' | 'WEIGHT';
export type BillMeta = { percents?: Record<string, number>; weights?: Record<string, number> } | null;
export type Bill = { id: number; title: string; amountCents: number; period: string; shares: Share[]; rule?: BillRule; meta?: BillMeta };
export type User = { id: number; email: string; name: string };
export type Room = { id: number; name: string };

// Notification types
export type NotificationType = 'success' | 'error' | 'warning' | 'info';
export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
};

// Summary type
export type RoomSummary = {
  period: string;
  totalCents: number;
  perMember: Record<string, { name: string; cents: number }>;
};

// Utils
export const fmt = (cents: number) => (cents / 100).toFixed(2) + " €";
