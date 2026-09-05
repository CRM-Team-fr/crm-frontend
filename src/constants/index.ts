export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  SALESPERSON: 'salesperson',
  CUSTOMER: 'customer',
} as const

export const CUSTOMER_STAGES = [
  'new',
  'contacted',
  'interested',
  'quotation_sent',
  'negotiation',
  'converted',
  'lost',
] as const

export const QUOTATION_STATUSES = [
  'draft',
  'sent',
  'accepted',
  'rejected',
  'expired',
] as const

export const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'completed',
  'cancelled',
] as const

export const PAYMENT_STATUSES = [
  'pending',
  'partial',
  'paid',
  'refunded',
] as const

export const FOLLOW_UP_STATUSES = [
  'pending',
  'completed',
  'cancelled',
  'rescheduled',
] as const

export const FOLLOW_UP_PRIORITIES = ['low', 'medium', 'high'] as const

export const FOLLOW_UP_TASK_TYPES = ['call', 'visit', 'email', 'follow_up', 'other'] as const

export const PAYMENT_METHODS = ['cash', 'bank_transfer', 'upi', 'card', 'cheque', 'online'] as const

export const RETURN_STATUSES = ['pending', 'approved', 'rejected', 'completed'] as const

export const NOTIFICATION_TYPES = [
  'order_created',
  'order_completed',
  'order_cancelled',
  'payment_received',
  'follow_up_due',
  'customer_approved',
  'return_created',
  'return_approved',
  'return_rejected',
  'quotation_sent',
  'quotation_accepted',
  'quotation_rejected',
] as const
