// User Types
export type UserRole = 'RIDER' | 'DRIVER' | 'ADMIN'

export interface User {
  id: string
  email: string
  role: UserRole
  name: string | null
  phone: string | null
  avatar_url: string | null
  rating: number
  total_rides: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface EmergencyContact {
  id: string
  user_id: string
  name: string
  phone: string
  relationship: string | null
  created_at: string
}

// Driver Types
export type VehicleType = 'ECONOMY' | 'PREMIUM' | 'XL'

export interface Driver {
  id: string
  user_id: string
  vehicle_type: VehicleType
  vehicle_make: string | null
  vehicle_model: string | null
  vehicle_number: string
  vehicle_color: string | null
  is_available: boolean
  is_verified: boolean
  current_lat: number | null
  current_lng: number | null
  last_location_update: string | null
  total_earnings: number
  total_trips: number
  documents: Record<string, any>
  created_at: string
  updated_at: string
  user?: User
}

export interface DriverLocationHistory {
  id: string
  driver_id: string
  latitude: number
  longitude: number
  speed: number | null
  heading: number | null
  created_at: string
}

// Ride Types
export type RideStatus = 'REQUESTED' | 'ACCEPTED' | 'DRIVER_ARRIVING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

export interface Stop {
  address: string
  lat: number
  lng: number
  order: number
}

export interface Ride {
  id: string
  rider_id: string
  driver_id: string | null
  pickup_address: string
  pickup_lat: number
  pickup_lng: number
  drop_address: string
  drop_lat: number
  drop_lng: number
  stops: Stop[]
  vehicle_type: VehicleType
  distance: number
  duration: number
  base_fare: number
  surge_multiplier: number
  discount: number
  promo_code_id: string | null
  final_fare: number
  status: RideStatus
  cancellation_reason: string | null
  cancelled_by: string | null
  cancelled_at: string | null
  requested_at: string
  accepted_at: string | null
  driver_arrived_at: string | null
  started_at: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
  rider?: User
  driver?: Driver
}

export interface RideTracking {
  id: string
  ride_id: string
  driver_id: string
  latitude: number
  longitude: number
  eta_seconds: number | null
  distance_remaining: number | null
  created_at: string
}

// Payment Types
export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'

export interface Payment {
  id: string
  ride_id: string
  user_id: string
  driver_id: string | null
  stripe_payment_intent: string | null
  stripe_charge_id: string | null
  amount: number
  currency: string
  platform_fee: number
  driver_earnings: number
  status: PaymentStatus
  refund_amount: number | null
  refund_reason: string | null
  refunded_at: string | null
  created_at: string
  updated_at: string
}

export interface PaymentMethod {
  id: string
  user_id: string
  stripe_payment_method_id: string
  card_last_four: string | null
  card_brand: string | null
  is_default: boolean
  created_at: string
}

// Review Types
export interface Review {
  id: string
  ride_id: string
  rider_id: string
  driver_id: string
  rating: number
  comment: string | null
  created_at: string
}

// Promo Code Types
export type PromoType = 'PERCENTAGE' | 'FLAT'

export interface PromoCode {
  id: string
  code: string
  description: string | null
  type: PromoType
  value: number
  min_amount: number
  max_discount: number | null
  usage_limit: number | null
  used_count: number
  is_active: boolean
  valid_from: string
  expires_at: string | null
  created_at: string
}

// Support Types
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'

export interface TicketResponse {
  id: string
  message: string
  responder_id: string
  responder_name: string
  created_at: string
}

export interface SupportTicket {
  id: string
  user_id: string
  ride_id: string | null
  subject: string
  message: string
  status: TicketStatus
  priority: string
  assigned_to: string | null
  responses: TicketResponse[]
  created_at: string
  updated_at: string
  resolved_at: string | null
}

// Emergency Types
export interface EmergencyLog {
  id: string
  ride_id: string
  user_id: string
  latitude: number
  longitude: number
  address: string | null
  alert_type: string
  message: string | null
  resolved: boolean
  resolved_at: string | null
  created_at: string
}

// Notification Types
export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  data: Record<string, any>
  read: boolean
  created_at: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Fare Estimation Types
export interface FareEstimate {
  distance: number
  duration: number
  base_fare: number
  surge_multiplier: number
  surge_fare: number
  total_fare: number
  currency: string
}

export interface RideTypeOption {
  type: VehicleType
  name: string
  description: string
  base_rate: number
  per_km_rate: number
  per_minute_rate: number
  min_fare: number
  capacity: number
  icon: string
}

// Map Types
export interface Location {
  lat: number
  lng: number
  address?: string
}

export interface MapBounds {
  north: number
  south: number
  east: number
  west: number
}

// Auth Types
export interface AuthState {
  user: User | null
  driver: Driver | null
  session: any | null
  isLoading: boolean
  isAuthenticated: boolean
}

// Form Types
export interface LoginFormData {
  email: string
  password: string
}

export interface SignupFormData {
  email: string
  password: string
  confirmPassword: string
  name: string
  phone: string
  role: UserRole
}

export interface ProfileFormData {
  name: string
  phone: string
  email: string
}

export interface RideBookingFormData {
  pickup: Location
  drop: Location
  stops: Stop[]
  vehicle_type: VehicleType
  promo_code?: string
}

// Dashboard Stats Types
export interface RiderStats {
  total_rides: number
  total_spent: number
  favorite_driver: string | null
  average_rating: number
}

export interface DriverStats {
  total_trips: number
  total_earnings: number
  today_earnings: number
  weekly_earnings: number
  monthly_earnings: number
  average_rating: number
  completion_rate: number
  acceptance_rate: number
}

export interface AdminStats {
  total_users: number
  total_drivers: number
  total_rides: number
  total_revenue: number
  active_rides: number
  pending_verifications: number
}

// WebSocket/Realtime Types
export interface RealtimeMessage {
  type: 'RIDE_UPDATE' | 'DRIVER_LOCATION' | 'NOTIFICATION' | 'EMERGENCY'
  payload: any
  timestamp: string
}

export interface DriverLocationUpdate {
  driver_id: string
  ride_id: string
  latitude: number
  longitude: number
  heading: number
  speed: number
}