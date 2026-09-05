export interface User {
  id: string
  Name: string
  email?: string
  phoneNumber?: string
  role: 'admin' | 'manager' | 'salesperson' | 'customer'
  status?: string
  customerProfileId?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export type UserRole = 'admin' | 'manager' | 'salesperson' | 'customer'

export type CustomerStage = 'new' | 'contacted' | 'interested' | 'quotation_sent' | 'negotiation' | 'converted' | 'lost'

export type QuotationStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled'

export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'refunded'

export type FollowUpStatus = 'pending' | 'completed' | 'cancelled' | 'rescheduled'

export type FollowUpPriority = 'low' | 'medium' | 'high'

export type FollowUpTaskType = 'call' | 'visit' | 'email' | 'follow_up' | 'other'

export type PaymentMethod = 'cash' | 'bank_transfer' | 'upi' | 'card' | 'cheque' | 'online'

export type ReturnStatus = 'pending' | 'approved' | 'rejected' | 'completed'

export type NotificationType =
  | 'order_created'
  | 'order_completed'
  | 'order_cancelled'
  | 'payment_received'
  | 'follow_up_due'
  | 'customer_approved'
  | 'return_created'
  | 'return_approved'
  | 'return_rejected'
  | 'quotation_sent'
  | 'quotation_accepted'
  | 'quotation_rejected'

export interface Customer {
  id: string
  userId: string
  businessName: string
  customerName: string
  phoneNumber: string
  customerStage: CustomerStage
}

export interface CustomerDetail {
  id: string
  user: {
    id: string
    Name: string
    phoneNumber: string
    status: string
    role: string
  }
  businessName: string
  businessType: string
  address: string
  city: string
  state: string
  pincode: string
  alternatePhoneNumber?: string
  assignedSalesperson?: {
    id: string
    Name: string
    email: string
    phoneNumber: string
  }
  customerStage: string
  totalOrders: number
  totalRevenue: number
  outstandingAmount: number
  lastContactedAt: string | null
  nextFollowUpAt: string | null
  createdAt: string
  updatedAt: string
}

export interface Activity {
  id: string
  customerProfileId: string
  activityType: string
  title: string
  description: string
  metadata?: Record<string, any>
  createdBy: {
    id: string
    Name: string
    role: string
  }
  createdAt: string
}
