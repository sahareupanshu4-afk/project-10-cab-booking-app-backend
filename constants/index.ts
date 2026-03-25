// Ride Types Configuration
export const RIDE_TYPES = {
  ECONOMY: {
    type: 'ECONOMY',
    name: 'Economy',
    description: 'Affordable rides for everyday travel',
    baseRate: 5.00,
    perKmRate: 1.50,
    perMinuteRate: 0.25,
    minFare: 8.00,
    capacity: 4,
    icon: '🚗',
    image: '/images/economy-car.png',
  },
  PREMIUM: {
    type: 'PREMIUM',
    name: 'Premium',
    description: 'Luxury vehicles with top-rated drivers',
    baseRate: 10.00,
    perKmRate: 2.50,
    perMinuteRate: 0.40,
    minFare: 15.00,
    capacity: 4,
    icon: '🚙',
    image: '/images/premium-car.png',
  },
  XL: {
    type: 'XL',
    name: 'XL',
    description: 'Extra space for groups up to 6',
    baseRate: 12.00,
    perKmRate: 3.00,
    perMinuteRate: 0.50,
    minFare: 20.00,
    capacity: 6,
    icon: '🚐',
    image: '/images/xl-car.png',
  },
} as const

// Platform Fee Percentage
export const PLATFORM_FEE_PERCENTAGE = 0.15 // 15%

// Surge Pricing
export const SURGE_MULTIPLIERS = {
  LOW: 1.0,
  MEDIUM: 1.25,
  HIGH: 1.5,
  PEAK: 2.0,
}

// Cancellation Fees
export const CANCELLATION_FEES = {
  GRACE_PERIOD_MINUTES: 2,
  STANDARD_FEE: 5.00,
  DRIVER_ASSIGNED_FEE: 10.00,
  DRIVER_ARRIVED_FEE: 15.00,
}

// Ride Status Labels
export const RIDE_STATUS_LABELS = {
  REQUESTED: 'Finding Driver',
  ACCEPTED: 'Driver Assigned',
  DRIVER_ARRIVING: 'Driver Arriving',
  IN_PROGRESS: 'Ride in Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
} as const

// Ride Status Colors
export const RIDE_STATUS_COLORS = {
  REQUESTED: 'bg-yellow-100 text-yellow-800',
  ACCEPTED: 'bg-blue-100 text-blue-800',
  DRIVER_ARRIVING: 'bg-purple-100 text-purple-800',
  IN_PROGRESS: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-gray-100 text-gray-800',
  CANCELLED: 'bg-red-100 text-red-800',
} as const

// Payment Status Labels
export const PAYMENT_STATUS_LABELS = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
  REFUNDED: 'Refunded',
} as const

// Payment Status Colors
export const PAYMENT_STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-gray-100 text-gray-800',
} as const

// User Role Labels
export const USER_ROLE_LABELS = {
  RIDER: 'Rider',
  DRIVER: 'Driver',
  ADMIN: 'Admin',
} as const

// Ticket Status Labels
export const TICKET_STATUS_LABELS = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
} as const

// Ticket Priority Labels
export const TICKET_PRIORITY_LABELS = {
  LOW: 'Low',
  NORMAL: 'Normal',
  HIGH: 'High',
  URGENT: 'Urgent',
} as const

// Map Configuration
export const MAP_CONFIG = {
  DEFAULT_CENTER: [40.7128, -74.0060] as [number, number], // New York City
  DEFAULT_ZOOM: 12,
  MIN_ZOOM: 10,
  MAX_ZOOM: 18,
  STYLE: 'mapbox://styles/mapbox/streets-v12',
}

// Mapbox Geocoding
export const MAPBOX_GEOCODING_CONFIG = {
  COUNTRIES: 'us',
  TYPES: 'address,place,locality,neighborhood,poi',
  LIMIT: 5,
}

// Animation Durations
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
}

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
}

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy h:mm a',
  TIME_ONLY: 'h:mm a',
  INPUT: 'yyyy-MM-dd',
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
}

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  PHONE_LENGTH: 10,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\d{10}$/,
  VEHICLE_NUMBER_REGEX: /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/,
}

// Rating Configuration
export const RATING_CONFIG = {
  MIN_RATING: 1,
  MAX_RATING: 5,
  DEFAULT_RATING: 5.0,
  MIN_DRIVER_RATING: 4.5, // Minimum rating to accept rides
}

// Notification Types
export const NOTIFICATION_TYPES = {
  RIDE_REQUEST: 'RIDE_REQUEST',
  RIDE_ACCEPTED: 'RIDE_ACCEPTED',
  RIDE_CANCELLED: 'RIDE_CANCELLED',
  RIDE_COMPLETED: 'RIDE_COMPLETED',
  DRIVER_ARRIVING: 'DRIVER_ARRIVING',
  PAYMENT_RECEIVED: 'PAYMENT_RECEIVED',
  PROMO_APPLIED: 'PROMO_APPLIED',
  SYSTEM: 'SYSTEM',
  EMERGENCY: 'EMERGENCY',
}

// Emergency SOS Configuration
export const SOS_CONFIG = {
  MESSAGE: 'Emergency! I need help. This is my current location.',
  EMERGENCY_SERVICES_NUMBER: '911',
}

// Support Categories
export const SUPPORT_CATEGORIES = [
  'Ride Issue',
  'Payment Issue',
  'Driver Issue',
  'Lost Item',
  'Account Issue',
  'App Bug',
  'Feedback',
  'Other',
]

// Driver Document Types
export const DRIVER_DOCUMENT_TYPES = {
  LICENSE: 'license',
  INSURANCE: 'insurance',
  REGISTRATION: 'registration',
  BACKGROUND_CHECK: 'background_check',
}

// Driver Verification Status
export const DRIVER_VERIFICATION_STATUS = {
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
}

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    RESET_PASSWORD: '/api/auth/reset-password',
  },
  RIDES: {
    BASE: '/api/rides',
    ESTIMATE: '/api/rides/estimate',
    BOOK: '/api/rides/book',
    CANCEL: '/api/rides/cancel',
    HISTORY: '/api/rides/history',
  },
  DRIVERS: {
    BASE: '/api/drivers',
    NEARBY: '/api/drivers/nearby',
    AVAILABILITY: '/api/drivers/availability',
    EARNINGS: '/api/drivers/earnings',
  },
  PAYMENTS: {
    BASE: '/api/payments',
    CREATE_INTENT: '/api/payments/create-intent',
    CONFIRM: '/api/payments/confirm',
    REFUND: '/api/payments/refund',
  },
  USERS: {
    BASE: '/api/users',
    PROFILE: '/api/users/profile',
    PAYMENT_METHODS: '/api/users/payment-methods',
    EMERGENCY_CONTACTS: '/api/users/emergency-contacts',
  },
  PROMO: {
    VALIDATE: '/api/promo/validate',
    APPLY: '/api/promo/apply',
  },
  SUPPORT: {
    BASE: '/api/support',
    TICKETS: '/api/support/tickets',
  },
}

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  PAYMENT_FAILED: 'Payment failed. Please try a different payment method.',
  NO_DRIVERS: 'No drivers available at the moment. Please try again later.',
  RIDE_NOT_FOUND: 'Ride not found.',
  PROMO_INVALID: 'Invalid promo code.',
  PROMO_EXPIRED: 'This promo code has expired.',
  PROMO_LIMIT_REACHED: 'This promo code has reached its usage limit.',
}

// Success Messages
export const SUCCESS_MESSAGES = {
  RIDE_BOOKED: 'Your ride has been booked successfully!',
  RIDE_CANCELLED: 'Your ride has been cancelled.',
  PAYMENT_SUCCESS: 'Payment successful!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PROMO_APPLIED: 'Promo code applied successfully!',
  TICKET_CREATED: 'Your support ticket has been submitted.',
}

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  RECENT_LOCATIONS: 'recent_locations',
  SAVED_PLACES: 'saved_places',
  THEME: 'theme',
  LANGUAGE: 'language',
}

// Time Constants
export const TIME_CONSTANTS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
}

// Debounce Delays
export const DEBOUNCE_DELAYS = {
  SEARCH: 300,
  INPUT: 500,
  LOCATION_UPDATE: 1000,
}

// Feature Flags
export const FEATURE_FLAGS = {
  MULTI_STOP: true,
  SCHEDULED_RIDES: true,
  TIPS: true,
  IN_APP_CHAT: false,
  VOICE_CALLS: false,
}