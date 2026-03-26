'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { useAuth } from '@/hooks/useAuth'
import { useRideStore } from '@/store'
import { RIDE_TYPES, RIDE_STATUS_LABELS, RIDE_STATUS_COLORS } from '@/constants'
import type { Ride, VehicleType } from '@/types'
import {
  Car,
  MapPin,
  Navigation,
  Clock,
  CreditCard,
  Star,
  Menu,
  Bell,
  User,
  History,
  Settings,
  LogOut,
  Plus,
  X,
  ChevronRight,
  AlertCircle,
} from 'lucide-react'

export default function RiderDashboard() {
  const router = useRouter()
  const { user, signOut, isLoading } = useAuth()
  const {
    pickup,
    drop,
    stops,
    vehicleType,
    promoCode,
    estimatedFare,
    currentRide,
    setPickup,
    setDrop,
    setVehicleType,
    setPromoCode,
    setEstimatedFare,
    setCurrentRide,
  } = useRideStore()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [recentRides, setRecentRides] = useState<Ride[]>([])
  const [showPromoInput, setShowPromoInput] = useState(false)
  const [pickupInput, setPickupInput] = useState('')
  const [dropInput, setDropInput] = useState('')
  const [pickupSuggestions, setPickupSuggestions] = useState<any[]>([])
  const [dropSuggestions, setDropSuggestions] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [activeTab, setActiveTab] = useState('book')
  const [showStops, setShowStops] = useState(false)
  const [localStops, setLocalStops] = useState<any[]>([])

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, isLoading, router])

  // Fetch recent rides (demo mode)
  useEffect(() => {
    const fetchRecentRides = async () => {
      if (!user) return

      // Demo mode - return mock rides
      const mockRides: Ride[] = [
        {
          id: 'demo-ride-1',
          rider_id: user.id,
          driver_id: 'demo-driver-1',
          pickup_address: '123 Main St, New York, NY',
          pickup_lat: 40.7128,
          pickup_lng: -74.0060,
          drop_address: '456 Broadway, New York, NY',
          drop_lat: 40.7589,
          drop_lng: -73.9851,
          stops: [],
          vehicle_type: 'ECONOMY',
          distance: 5.2,
          duration: 15,
          base_fare: 12.50,
          surge_multiplier: 1.0,
          discount: 0,
          promo_code_id: null,
          final_fare: 12.50,
          status: 'COMPLETED',
          cancellation_reason: null,
          cancelled_by: null,
          cancelled_at: null,
          requested_at: new Date(Date.now() - 86400000).toISOString(),
          accepted_at: new Date(Date.now() - 86400000 + 300000).toISOString(),
          driver_arrived_at: new Date(Date.now() - 86400000 + 600000).toISOString(),
          started_at: new Date(Date.now() - 86400000 + 900000).toISOString(),
          completed_at: new Date(Date.now() - 86400000 + 1800000).toISOString(),
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date(Date.now() - 86400000 + 1800000).toISOString(),
        },
      ]
      
      setRecentRides(mockRides)
    }

    fetchRecentRides()
  }, [user])

  // Calculate fare estimate
  useEffect(() => {
    if (pickup && drop) {
      const rideType = RIDE_TYPES[vehicleType]
      // Mock distance calculation (in real app, use Mapbox API)
      const distance = 10 // km
      const duration = 15 // minutes
      const baseFare = rideType.baseRate + (distance * rideType.perKmRate) + (duration * rideType.perMinuteRate)
      const finalFare = Math.max(baseFare, rideType.minFare)
      setEstimatedFare(finalFare)
    }
  }, [pickup, drop, vehicleType, setEstimatedFare])

  // Search locations (demo mode)
  const searchLocations = async (query: string, type: 'pickup' | 'drop') => {
    if (!query || query.length < 2) {
      if (type === 'pickup') setPickupSuggestions([])
      else setDropSuggestions([])
      return
    }

    setIsSearching(true)
    try {
      // Demo mode - return realistic mock location suggestions based on query
      const lowerQuery = query.toLowerCase()
      let mockSuggestions: any[] = []

      // Popular landmarks and places
      const locations = [
        { name: 'Times Square', address: 'Times Square, Manhattan, New York, NY 10036', coords: [-73.9855, 40.7580] },
        { name: 'Central Park', address: 'Central Park, New York, NY 10024', coords: [-73.9654, 40.7829] },
        { name: 'Empire State Building', address: 'Empire State Building, 20 W 34th St, New York, NY 10001', coords: [-73.9857, 40.7484] },
        { name: 'Statue of Liberty', address: 'Statue of Liberty, New York, NY 10004', coords: [-74.0445, 40.6892] },
        { name: 'Brooklyn Bridge', address: 'Brooklyn Bridge, New York, NY 10038', coords: [-73.9969, 40.7061] },
        { name: 'Grand Central Terminal', address: 'Grand Central Terminal, 89 E 42nd St, New York, NY 10017', coords: [-73.9776, 40.7527] },
        { name: 'One World Trade Center', address: 'One World Trade Center, 285 Fulton St, New York, NY 10007', coords: [-74.0134, 40.7127] },
        { name: 'Rockefeller Center', address: 'Rockefeller Center, 45 Rockefeller Plaza, New York, NY 10111', coords: [-73.9787, 40.7587] },
        { name: 'Madison Square Garden', address: 'Madison Square Garden, 4 Pennsylvania Plaza, New York, NY 10001', coords: [-73.9935, 40.7505] },
        { name: 'Yankee Stadium', address: 'Yankee Stadium, 1 E 161st St, Bronx, NY 10451', coords: [-73.9281, 40.8296] },
        { name: 'JFK Airport', address: 'John F. Kennedy International Airport, Queens, NY 11430', coords: [-73.7781, 40.6413] },
        { name: 'LaGuardia Airport', address: 'LaGuardia Airport, Queens, NY 11371', coords: [-73.8740, 40.7769] },
        { name: 'Newark Airport', address: 'Newark Liberty International Airport, Newark, NJ 07114', coords: [-74.1745, 40.6895] },
        { name: 'Penn Station', address: 'Penn Station, 15 Penn Plaza, New York, NY 10001', coords: [-73.9935, 40.7506] },
        { name: 'Wall Street', address: 'Wall Street, New York, NY 10005', coords: [-74.0060, 40.7074] },
        { name: 'Fifth Avenue', address: 'Fifth Avenue, New York, NY', coords: [-73.9712, 40.7751] },
        { name: 'Broadway', address: 'Broadway, New York, NY', coords: [-73.9857, 40.7589] },
        { name: 'Madison Avenue', address: 'Madison Avenue, New York, NY', coords: [-73.9776, 40.7724] },
        { name: 'Park Avenue', address: 'Park Avenue, New York, NY', coords: [-73.9712, 40.7681] },
        { name: 'Lexington Avenue', address: 'Lexington Avenue, New York, NY', coords: [-73.9712, 40.7724] },
      ]

      // Filter locations based on query
      const filteredLocations = locations.filter(loc => 
        loc.name.toLowerCase().includes(lowerQuery) || 
        loc.address.toLowerCase().includes(lowerQuery)
      )

      // If we have matches, use them
      if (filteredLocations.length > 0) {
        mockSuggestions = filteredLocations.slice(0, 5).map((loc, index) => ({
          id: `location-${index}`,
          text: loc.name,
          place_name: loc.address,
          center: loc.coords,
        }))
      } else {
        // Generate dynamic suggestions based on query
        mockSuggestions = [
          {
            id: 'dynamic-1',
            text: query,
            place_name: `${query}, Manhattan, New York, NY`,
            center: [-73.9855 + (Math.random() - 0.5) * 0.02, 40.7580 + (Math.random() - 0.5) * 0.02],
          },
          {
            id: 'dynamic-2',
            text: `${query} Street`,
            place_name: `${query} Street, New York, NY`,
            center: [-73.9776 + (Math.random() - 0.5) * 0.02, 40.7527 + (Math.random() - 0.5) * 0.02],
          },
          {
            id: 'dynamic-3',
            text: `${query} Avenue`,
            place_name: `${query} Avenue, New York, NY`,
            center: [-73.9712 + (Math.random() - 0.5) * 0.02, 40.7681 + (Math.random() - 0.5) * 0.02],
          },
          {
            id: 'dynamic-4',
            text: `${query} Station`,
            place_name: `${query} Station, New York, NY`,
            center: [-73.9935 + (Math.random() - 0.5) * 0.02, 40.7506 + (Math.random() - 0.5) * 0.02],
          },
          {
            id: 'dynamic-5',
            text: `${query} Plaza`,
            place_name: `${query} Plaza, New York, NY`,
            center: [-73.9787 + (Math.random() - 0.5) * 0.02, 40.7587 + (Math.random() - 0.5) * 0.02],
          },
        ]
      }
      
      if (type === 'pickup') {
        setPickupSuggestions(mockSuggestions)
      } else {
        setDropSuggestions(mockSuggestions)
      }
    } catch (error) {
      console.error('Error searching locations:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleLocationSelect = (feature: any, type: 'pickup' | 'drop') => {
    const location = {
      lat: feature.center[1],
      lng: feature.center[0],
      address: feature.place_name,
    }

    if (type === 'pickup') {
      setPickup(location)
      setPickupInput(feature.place_name)
      setPickupSuggestions([])
    } else {
      setDrop(location)
      setDropInput(feature.place_name)
      setDropSuggestions([])
    }
  }

  const handleBookRide = async () => {
    if (!user || !pickup || !drop) return

    const rideType = RIDE_TYPES[vehicleType]
    const distance = 10 // Mock distance
    const duration = 15 // Mock duration

    // Demo mode - create mock ride
    const mockRide: Ride = {
      id: `demo-ride-${Date.now()}`,
      rider_id: user.id,
      driver_id: null,
      pickup_address: pickup.address!,
      pickup_lat: pickup.lat,
      pickup_lng: pickup.lng,
      drop_address: drop.address!,
      drop_lat: drop.lat,
      drop_lng: drop.lng,
      stops: [],
      vehicle_type: vehicleType,
      distance,
      duration,
      base_fare: estimatedFare!,
      surge_multiplier: 1.0,
      discount: 0,
      promo_code_id: null,
      final_fare: estimatedFare!,
      status: 'REQUESTED',
      cancellation_reason: null,
      cancelled_by: null,
      cancelled_at: null,
      requested_at: new Date().toISOString(),
      accepted_at: null,
      driver_arrived_at: null,
      started_at: null,
      completed_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    setCurrentRide(mockRide)
    router.push('/rider/tracking')
  }

  // Handle add stop
  const handleAddStop = () => {
    setShowStops(true)
    // Add a mock stop
    const newStop = {
      id: `stop-${Date.now()}`,
      address: '',
      lat: 0,
      lng: 0,
    }
    setLocalStops([...localStops, newStop])
  }

  // Handle remove stop
  const handleRemoveStop = (index: number) => {
    const newStops = localStops.filter((_, i) => i !== index)
    setLocalStops(newStops)
    if (newStops.length === 0) {
      setShowStops(false)
    }
  }

  // Handle sidebar navigation
  const handleNavigation = (tab: string) => {
    setActiveTab(tab)
    setSidebarOpen(false)
    
    // Navigate based on tab
    switch (tab) {
      case 'book':
        // Stay on current page
        break
      case 'history':
        router.push('/rider/history')
        break
      case 'payments':
        router.push('/rider/payments')
        break
      case 'settings':
        router.push('/rider/settings')
        break
    }
  }

  // Handle view all rides
  const handleViewAllRides = () => {
    router.push('/rider/history')
  }

  // Handle apply promo code
  const handleApplyPromo = () => {
    if (promoCode) {
      // Demo mode - simulate promo code application
      alert(`Promo code "${promoCode}" applied successfully!`)
      setShowPromoInput(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="bg-white/80 backdrop-blur-xl shadow-lg sticky top-0 z-40 border-b border-white/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl hover:bg-primary-50 transition-colors"
              >
                <Menu className="h-6 w-6 text-primary-600" />
              </motion.button>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
              >
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
                  <Car className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">RideX</span>
              </motion.div>
            </div>

            <div className="flex items-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/rider/notifications')}
                className="relative p-2 rounded-xl hover:bg-primary-50 transition-colors"
              >
                <Bell className="h-6 w-6 text-gray-600" />
                <motion.span 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute top-1 right-1 h-3 w-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg"
                ></motion.span>
              </motion.button>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => router.push('/rider/settings')}
                className="hidden sm:flex items-center gap-3 cursor-pointer hover:bg-primary-50 rounded-xl p-2 transition-colors"
              >
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-100 to-purple-100 flex items-center justify-center shadow-md">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt="" className="h-10 w-10 rounded-xl" />
                  ) : (
                    <User className="h-5 w-5 text-primary-600" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-xs text-primary-600 font-medium">Rider</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 lg:hidden"
        >
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl"
          >
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Car className="h-8 w-8 text-primary-600" />
                  <span className="text-xl font-bold gradient-text">RideX</span>
                </div>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <nav className="p-4 space-y-2">
              <button 
                onClick={() => handleNavigation('book')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                  activeTab === 'book' 
                    ? 'bg-primary-50 text-primary-600 shadow-md' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <Car className="h-5 w-5" />
                Book a Ride
              </button>
              <button 
                onClick={() => handleNavigation('history')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                  activeTab === 'history' 
                    ? 'bg-primary-50 text-primary-600 shadow-md' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <History className="h-5 w-5" />
                Ride History
              </button>
              <button 
                onClick={() => handleNavigation('payments')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                  activeTab === 'payments' 
                    ? 'bg-primary-50 text-primary-600 shadow-md' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <CreditCard className="h-5 w-5" />
                Payments
              </button>
              <button 
                onClick={() => handleNavigation('settings')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                  activeTab === 'settings' 
                    ? 'bg-primary-50 text-primary-600 shadow-md' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <Settings className="h-5 w-5" />
                Settings
              </button>
              <button
                onClick={signOut}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 text-red-600 transition-all duration-200"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            </nav>
          </motion.div>
        </motion.div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Location Inputs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500"></div>
                <CardHeader title="Where to?" />
                <CardContent>
                  <div className="space-y-4">
                    {/* Pickup */}
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="relative"
                    >
                      <div className="flex items-center gap-3">
                        <motion.div 
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/30"
                        >
                          <div className="h-4 w-4 bg-white rounded-full shadow-sm"></div>
                        </motion.div>
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            placeholder="Enter pickup location"
                            value={pickupInput}
                            onChange={(e) => {
                              setPickupInput(e.target.value)
                              searchLocations(e.target.value, 'pickup')
                            }}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-300 bg-gradient-to-r from-white to-gray-50 text-gray-900 placeholder-gray-500"
                          />
                          {pickupSuggestions.length > 0 && (
                            <motion.div 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="absolute top-full left-0 right-0 bg-white border-2 border-gray-100 rounded-xl mt-2 shadow-xl z-10 max-h-60 overflow-y-auto"
                            >
                              {pickupSuggestions.map((suggestion, index) => (
                                <motion.button
                                  key={suggestion.id}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  onClick={() => handleLocationSelect(suggestion, 'pickup')}
                                  className="w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-primary-50 hover:to-purple-50 border-b last:border-b-0 transition-all duration-200"
                                >
                                  <p className="font-medium text-gray-900">{suggestion.text}</p>
                                  <p className="text-sm text-gray-500">{suggestion.place_name}</p>
                                </motion.button>
                              ))}
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>

                    {/* Drop */}
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="relative"
                    >
                      <div className="flex items-center gap-3">
                        <motion.div 
                          whileHover={{ scale: 1.1, rotate: -5 }}
                          className="h-12 w-12 rounded-xl bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-500/30"
                        >
                          <div className="h-4 w-4 bg-white rounded-full shadow-sm"></div>
                        </motion.div>
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            placeholder="Enter drop location"
                            value={dropInput}
                            onChange={(e) => {
                              setDropInput(e.target.value)
                              searchLocations(e.target.value, 'drop')
                            }}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-300 bg-gradient-to-r from-white to-gray-50 text-gray-900 placeholder-gray-500"
                          />
                          {dropSuggestions.length > 0 && (
                            <motion.div 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="absolute top-full left-0 right-0 bg-white border-2 border-gray-100 rounded-xl mt-2 shadow-xl z-10 max-h-60 overflow-y-auto"
                            >
                              {dropSuggestions.map((suggestion, index) => (
                                <motion.button
                                  key={suggestion.id}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  onClick={() => handleLocationSelect(suggestion, 'drop')}
                                  className="w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-primary-50 hover:to-purple-50 border-b last:border-b-0 transition-all duration-200"
                                >
                                  <p className="font-medium text-gray-900">{suggestion.text}</p>
                                  <p className="text-sm text-gray-500">{suggestion.place_name}</p>
                                </motion.button>
                              ))}
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>

                    {/* Add Stop */}
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddStop}
                      className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
                    >
                      <Plus className="h-4 w-4" />
                      Add stop
                    </motion.button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Ride Types */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500"></div>
                <CardHeader title="Choose your ride" />
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(RIDE_TYPES).map(([key, ride], index) => (
                      <motion.button
                        key={key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setVehicleType(key as VehicleType)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 ${
                          vehicleType === key
                            ? 'border-primary-500 bg-gradient-to-r from-primary-50 to-purple-50 shadow-lg shadow-primary-500/20'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <motion.span 
                          animate={vehicleType === key ? { scale: [1, 1.2, 1] } : {}}
                          className="text-3xl"
                        >
                          {ride.icon}
                        </motion.span>
                        <div className="flex-1 text-left">
                          <p className="font-semibold text-gray-900">{ride.name}</p>
                          <p className="text-sm text-gray-500">{ride.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                            ${estimatedFare ? (estimatedFare * (ride.baseRate / RIDE_TYPES.ECONOMY.baseRate)).toFixed(2) : '---'}
                          </p>
                          <p className="text-xs text-gray-500">{ride.capacity} seats</p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Promo Code */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
                <CardContent>
                  {showPromoInput ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex gap-3"
                    >
                      <Input
                        placeholder="Enter promo code"
                        value={promoCode || ''}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1 border-2 border-gray-200 rounded-xl focus:border-primary-500"
                      />
                      <Button 
                        onClick={handleApplyPromo}
                        className="bg-gradient-to-r from-primary-500 to-purple-600 hover:from-primary-600 hover:to-purple-700"
                      >
                        Apply
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowPromoInput(true)}
                      className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
                    >
                      <CreditCard className="h-5 w-5" />
                      Add promo code
                    </motion.button>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Book Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Button
                size="lg"
                fullWidth
                disabled={!pickup || !drop}
                onClick={handleBookRide}
                className="h-14 text-lg font-semibold bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 hover:from-primary-600 hover:via-purple-600 hover:to-pink-600 shadow-xl shadow-primary-500/30 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {pickup && drop ? (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    <Car className="h-5 w-5" />
                    Book {RIDE_TYPES[vehicleType].name} - ${estimatedFare?.toFixed(2)}
                  </motion.span>
                ) : (
                  'Enter locations to book'
                )}
              </Button>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"></div>
                <CardHeader title="Your Stats" />
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="text-center p-4 bg-gradient-to-br from-primary-50 to-purple-50 rounded-xl"
                    >
                      <p className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">{user?.total_rides || 0}</p>
                      <p className="text-sm text-gray-600 font-medium">Total Rides</p>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                        <span className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">{user?.rating || 5.0}</span>
                      </div>
                      <p className="text-sm text-gray-600 font-medium">Rating</p>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Rides */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500"></div>
                <CardHeader
                  title="Recent Rides"
                  action={
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      onClick={handleViewAllRides}
                      className="text-primary-600 text-sm hover:text-primary-700 font-medium"
                    >
                      View all
                    </motion.button>
                  }
                />
                <CardContent>
                  {recentRides.length > 0 ? (
                    <div className="space-y-3">
                      {recentRides.map((ride, index) => (
                        <motion.div
                          key={ride.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                          whileHover={{ scale: 1.02, x: 5 }}
                          className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100"
                        >
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-100 to-purple-100 flex items-center justify-center">
                            <Car className="h-5 w-5 text-primary-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate text-gray-900">{ride.drop_address}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(ride.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">${ride.final_fare}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${RIDE_STATUS_COLORS[ride.status]}`}>
                              {RIDE_STATUS_LABELS[ride.status]}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Car className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No rides yet</p>
                      <p className="text-sm">Book your first ride!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Safety Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="border-0 shadow-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 overflow-hidden">
                <CardContent>
                  <div className="flex items-start gap-3">
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0"
                    >
                      <AlertCircle className="h-5 w-5 text-white" />
                    </motion.div>
                    <div>
                      <p className="font-semibold text-green-800">Safety Features</p>
                      <p className="text-sm text-green-700 mt-1">
                        Share your ride, access emergency SOS, and view driver details for a safe journey.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
