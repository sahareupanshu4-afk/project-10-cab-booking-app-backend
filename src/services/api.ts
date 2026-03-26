import { createClient } from '@supabase/supabase-js'
import type { User, Driver, Ride, Payment } from '@/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth Services
export const authService = {
  async signUp(email: string, password: string, name: string, phone: string, role: 'RIDER' | 'DRIVER') {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, phone, role }),
    })
    return response.json()
  },

  async signIn(email: string, password: string) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    return response.json()
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser() {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.user || null
  },

  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data as User
  },

  async updateProfile(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates as any)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data as User
  },
}

// Ride Services
export const rideService = {
  async createRide(rideData: Omit<Ride, 'id' | 'created_at' | 'updated_at'>) {
    const response = await fetch('/api/rides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rideData),
    })
    return response.json()
  },

  async getRides(filters?: { rider_id?: string; driver_id?: string; status?: string }) {
    const params = new URLSearchParams()
    if (filters?.rider_id) params.append('rider_id', filters.rider_id)
    if (filters?.driver_id) params.append('driver_id', filters.driver_id)
    if (filters?.status) params.append('status', filters.status)
    
    const response = await fetch(`/api/rides?${params.toString()}`)
    return response.json()
  },

  async getRideById(rideId: string) {
    const { data, error } = await supabase
      .from('rides')
      .select('*')
      .eq('id', rideId)
      .single()
    
    if (error) throw error
    return data as Ride
  },

  async updateRide(rideId: string, updates: Partial<Ride>) {
    const { data, error } = await supabase
      .from('rides')
      .update(updates as any)
      .eq('id', rideId)
      .select()
      .single()
    
    if (error) throw error
    return data as Ride
  },

  async cancelRide(rideId: string, reason: string, cancelledBy: string) {
    const { data, error } = await supabase
      .from('rides')
      .update({
        status: 'CANCELLED',
        cancellation_reason: reason,
        cancelled_by: cancelledBy,
        cancelled_at: new Date().toISOString(),
      } as any)
      .eq('id', rideId)
      .select()
      .single()
    
    if (error) throw error
    return data as Ride
  },

  async acceptRide(rideId: string, driverId: string) {
    const { data, error } = await supabase
      .from('rides')
      .update({
        driver_id: driverId,
        status: 'ACCEPTED',
        accepted_at: new Date().toISOString(),
      } as any)
      .eq('id', rideId)
      .select()
      .single()
    
    if (error) throw error
    return data as Ride
  },

  async completeRide(rideId: string) {
    const { data, error } = await supabase
      .from('rides')
      .update({
        status: 'COMPLETED',
        completed_at: new Date().toISOString(),
      } as any)
      .eq('id', rideId)
      .select()
      .single()
    
    if (error) throw error
    return data as Ride
  },
}

// Driver Services
export const driverService = {
  async getDriverProfile(userId: string) {
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error) throw error
    return data as Driver
  },

  async updateDriverProfile(driverId: string, updates: Partial<Driver>) {
    const { data, error } = await supabase
      .from('drivers')
      .update(updates as any)
      .eq('id', driverId)
      .select()
      .single()
    
    if (error) throw error
    return data as Driver
  },

  async updateAvailability(driverId: string, isAvailable: boolean) {
    const { data, error } = await supabase
      .from('drivers')
      .update({ is_available: isAvailable } as any)
      .eq('id', driverId)
      .select()
      .single()
    
    if (error) throw error
    return data as Driver
  },

  async updateLocation(driverId: string, lat: number, lng: number) {
    const { data, error } = await supabase
      .from('drivers')
      .update({
        current_lat: lat,
        current_lng: lng,
        last_location_update: new Date().toISOString(),
      } as any)
      .eq('id', driverId)
      .select()
      .single()
    
    if (error) throw error
    return data as Driver
  },

  async getNearbyDrivers(lat: number, lng: number, radiusKm: number = 10) {
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('is_available', true)
      .not('current_lat', 'is', null)
      .not('current_lng', 'is', null)
    
    if (error) throw error
    
    // Filter by distance (simplified calculation)
    return (data as Driver[]).filter(driver => {
      if (!driver.current_lat || !driver.current_lng) return false
      const distance = calculateDistance(lat, lng, driver.current_lat, driver.current_lng)
      return distance <= radiusKm
    })
  },

  async getEarnings(driverId: string) {
    const { data, error } = await supabase
      .from('payments')
      .select('driver_earnings, created_at')
      .eq('driver_id', driverId)
      .eq('status', 'COMPLETED')
    
    if (error) throw error
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    
    const monthAgo = new Date()
    monthAgo.setMonth(monthAgo.getMonth() - 1)
    
    const todayEarnings = (data as any[])
      .filter(p => new Date(p.created_at) >= today)
      .reduce((sum, p) => sum + (p.driver_earnings || 0), 0)
    
    const weeklyEarnings = (data as any[])
      .filter(p => new Date(p.created_at) >= weekAgo)
      .reduce((sum, p) => sum + (p.driver_earnings || 0), 0)
    
    const monthlyEarnings = (data as any[])
      .filter(p => new Date(p.created_at) >= monthAgo)
      .reduce((sum, p) => sum + (p.driver_earnings || 0), 0)
    
    return { today: todayEarnings, weekly: weeklyEarnings, monthly: monthlyEarnings }
  },
}

// Payment Services
export const paymentService = {
  async createPayment(paymentData: Omit<Payment, 'id' | 'created_at' | 'updated_at'>) {
    const response = await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData),
    })
    return response.json()
  },

  async capturePayment(paymentIntentId: string) {
    const response = await fetch('/api/payments', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payment_intent_id: paymentIntentId, action: 'capture' }),
    })
    return response.json()
  },

  async getPaymentByRideId(rideId: string) {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('ride_id', rideId)
      .single()
    
    if (error) throw error
    return data as Payment
  },
}

// Utility function to calculate distance between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Distance in kilometers
  return distance
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180)
}