import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User, Driver, Ride, Location, Notification } from '@/types'

// Auth Store
interface AuthStore {
  user: User | null
  driver: Driver | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User | null) => void
  setDriver: (driver: Driver | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      driver: null,
      isAuthenticated: false,
      isLoading: true,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setDriver: (driver) => set({ driver }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null, driver: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, driver: state.driver }),
    }
  )
)

// Ride Store
interface RideStore {
  currentRide: Ride | null
  pickup: Location | null
  drop: Location | null
  stops: Location[]
  vehicleType: 'ECONOMY' | 'PREMIUM' | 'XL'
  promoCode: string | null
  estimatedFare: number | null
  isBooking: boolean
  setPickup: (location: Location | null) => void
  setDrop: (location: Location | null) => void
  addStop: (location: Location) => void
  removeStop: (index: number) => void
  setVehicleType: (type: 'ECONOMY' | 'PREMIUM' | 'XL') => void
  setPromoCode: (code: string | null) => void
  setEstimatedFare: (fare: number | null) => void
  setCurrentRide: (ride: Ride | null) => void
  setBooking: (booking: boolean) => void
  reset: () => void
}

export const useRideStore = create<RideStore>((set) => ({
  currentRide: null,
  pickup: null,
  drop: null,
  stops: [],
  vehicleType: 'ECONOMY',
  promoCode: null,
  estimatedFare: null,
  isBooking: false,
  setPickup: (pickup) => set({ pickup }),
  setDrop: (drop) => set({ drop }),
  addStop: (location) => set((state) => ({ stops: [...state.stops, location] })),
  removeStop: (index) => set((state) => ({ stops: state.stops.filter((_, i) => i !== index) })),
  setVehicleType: (vehicleType) => set({ vehicleType }),
  setPromoCode: (promoCode) => set({ promoCode }),
  setEstimatedFare: (estimatedFare) => set({ estimatedFare }),
  setCurrentRide: (currentRide) => set({ currentRide }),
  setBooking: (isBooking) => set({ isBooking }),
  reset: () => set({
    currentRide: null,
    pickup: null,
    drop: null,
    stops: [],
    vehicleType: 'ECONOMY',
    promoCode: null,
    estimatedFare: null,
    isBooking: false,
  }),
}))

// Driver Store
interface DriverStore {
  isAvailable: boolean
  currentLocation: Location | null
  activeRide: Ride | null
  rideRequests: Ride[]
  earnings: {
    today: number
    weekly: number
    monthly: number
  }
  setAvailable: (available: boolean) => void
  setCurrentLocation: (location: Location | null) => void
  setActiveRide: (ride: Ride | null) => void
  addRideRequest: (ride: Ride) => void
  removeRideRequest: (rideId: string) => void
  clearRideRequests: () => void
  setEarnings: (earnings: { today: number; weekly: number; monthly: number }) => void
}

export const useDriverStore = create<DriverStore>()(
  persist(
    (set) => ({
      isAvailable: false,
      currentLocation: null,
      activeRide: null,
      rideRequests: [],
      earnings: {
        today: 0,
        weekly: 0,
        monthly: 0,
      },
      setAvailable: (isAvailable) => set({ isAvailable }),
      setCurrentLocation: (currentLocation) => set({ currentLocation }),
      setActiveRide: (activeRide) => set({ activeRide }),
      addRideRequest: (ride) => set((state) => ({ rideRequests: [...state.rideRequests, ride] })),
      removeRideRequest: (rideId) => set((state) => ({ rideRequests: state.rideRequests.filter((r) => r.id !== rideId) })),
      clearRideRequests: () => set({ rideRequests: [] }),
      setEarnings: (earnings) => set({ earnings }),
    }),
    {
      name: 'driver-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ isAvailable: state.isAvailable }),
    }
  )
)

// Notification Store
interface NotificationStore {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Notification) => void
  markAsRead: (notificationId: string) => void
  markAllAsRead: () => void
  clearNotifications: () => void
  setNotifications: (notifications: Notification[]) => void
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,
  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications],
    unreadCount: state.unreadCount + 1,
  })),
  markAsRead: (notificationId) => set((state) => ({
    notifications: state.notifications.map((n) =>
      n.id === notificationId ? { ...n, read: true } : n
    ),
    unreadCount: Math.max(0, state.unreadCount - 1),
  })),
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map((n) => ({ ...n, read: true })),
    unreadCount: 0,
  })),
  clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
  setNotifications: (notifications) => set({
    notifications,
    unreadCount: notifications.filter((n) => !n.read).length,
  }),
}))

// Map Store
interface MapStore {
  center: [number, number]
  zoom: number
  bounds: [[number, number], [number, number]] | null
  showTraffic: boolean
  setCenter: (center: [number, number]) => void
  setZoom: (zoom: number) => void
  setBounds: (bounds: [[number, number], [number, number]] | null) => void
  toggleTraffic: () => void
}

export const useMapStore = create<MapStore>((set) => ({
  center: [0, 0],
  zoom: 12,
  bounds: null,
  showTraffic: false,
  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  setBounds: (bounds) => set({ bounds }),
  toggleTraffic: () => set((state) => ({ showTraffic: !state.showTraffic })),
}))

// UI Store
interface UIStore {
  isSidebarOpen: boolean
  isMobileMenuOpen: boolean
  theme: 'light' | 'dark'
  toggleSidebar: () => void
  toggleMobileMenu: () => void
  setTheme: (theme: 'light' | 'dark') => void
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      isSidebarOpen: true,
      isMobileMenuOpen: false,
      theme: 'light',
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'ui-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme }),
    }
  )
)