'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { useAuth } from '@/hooks/useAuth'
import { useDriverStore } from '@/store'
import { RIDE_STATUS_LABELS, RIDE_STATUS_COLORS } from '@/constants'
import type { Ride, Driver } from '@/types'
import {
  Car,
  MapPin,
  Navigation,
  Clock,
  DollarSign,
  Star,
  Menu,
  Bell,
  User,
  History,
  Settings,
  LogOut,
  X,
  Check,
  AlertCircle,
  TrendingUp,
  Calendar,
  Zap,
} from 'lucide-react'

export default function DriverDashboard() {
  const router = useRouter()
  const { user, driver, signOut, isLoading } = useAuth()
  const {
    isAvailable,
    currentLocation,
    activeRide,
    rideRequests,
    earnings,
    setAvailable,
    setCurrentLocation,
    setActiveRide,
    addRideRequest,
    removeRideRequest,
    setEarnings,
  } = useDriverStore()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [todayEarnings, setTodayEarnings] = useState(0)
  const [todayTrips, setTodayTrips] = useState(0)
  const [weeklyEarnings, setWeeklyEarnings] = useState(0)
  const [recentRides, setRecentRides] = useState<Ride[]>([])

  // Redirect if not authenticated or not a driver
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login')
    } else if (user && user.role !== 'DRIVER') {
      router.push('/rider/dashboard')
    }
  }, [user, isLoading, router])

  // Fetch driver data (demo mode)
  useEffect(() => {
    const fetchDriverData = async () => {
      if (!user) return

      // Demo mode - return mock data
      setTodayEarnings(125.50)
      setTodayTrips(8)
      setWeeklyEarnings(890.25)
      
      // Mock recent rides
      const mockRides: Ride[] = [
        {
          id: 'demo-ride-1',
          rider_id: 'demo-rider-1',
          driver_id: user.id,
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
          requested_at: new Date(Date.now() - 3600000).toISOString(),
          accepted_at: new Date(Date.now() - 3600000 + 300000).toISOString(),
          driver_arrived_at: new Date(Date.now() - 3600000 + 600000).toISOString(),
          started_at: new Date(Date.now() - 3600000 + 900000).toISOString(),
          completed_at: new Date(Date.now() - 3600000 + 1800000).toISOString(),
          created_at: new Date(Date.now() - 3600000).toISOString(),
          updated_at: new Date(Date.now() - 3600000 + 1800000).toISOString(),
        },
      ]
      
      setRecentRides(mockRides)
    }

    fetchDriverData()
  }, [user])

  // Get current location (demo mode)
  useEffect(() => {
    if (navigator.geolocation && isAvailable) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setCurrentLocation(location)

          // Demo mode - just log location update
          console.log('Driver location updated:', location)
        },
        (error) => console.error('Error getting location:', error),
        { enableHighAccuracy: true }
      )

      return () => navigator.geolocation.clearWatch(watchId)
    }
  }, [isAvailable, setCurrentLocation])

  // Subscribe to ride requests (demo mode)
  useEffect(() => {
    if (!isAvailable || !driver) return

    // Demo mode - simulate ride requests
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of new ride request
        const mockRide: Ride = {
          id: `demo-request-${Date.now()}`,
          rider_id: 'demo-rider-1',
          driver_id: null,
          pickup_address: '789 Park Ave, New York, NY',
          pickup_lat: 40.7831,
          pickup_lng: -73.9712,
          drop_address: '321 Wall St, New York, NY',
          drop_lat: 40.7074,
          drop_lng: -74.0113,
          stops: [],
          vehicle_type: 'ECONOMY',
          distance: 8.5,
          duration: 25,
          base_fare: 18.75,
          surge_multiplier: 1.0,
          discount: 0,
          promo_code_id: null,
          final_fare: 18.75,
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
        addRideRequest(mockRide)
      }
    }, 10000) // Check every 10 seconds

    return () => clearInterval(interval)
  }, [isAvailable, driver, addRideRequest])

  const toggleAvailability = async () => {
    if (!driver) return

    const newAvailability = !isAvailable
    setAvailable(newAvailability)

    // Demo mode - just update local state
    console.log('Driver availability toggled:', newAvailability)
  }

  const handleAcceptRide = async (ride: Ride) => {
    if (!driver) return

    // Demo mode - simulate accepting ride
    const acceptedRide = { 
      ...ride, 
      driver_id: driver.id, 
      status: 'ACCEPTED' as const,
      accepted_at: new Date().toISOString()
    }
    setActiveRide(acceptedRide)
    removeRideRequest(ride.id)
    router.push('/driver/active-ride')
  }

  const handleRejectRide = (rideId: string) => {
    removeRideRequest(rideId)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="flex items-center gap-2">
                <Car className="h-8 w-8 text-primary-600" />
                <span className="text-xl font-bold gradient-text">RideX Driver</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Availability Toggle */}
              <button
                onClick={toggleAvailability}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  isAvailable
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <Zap className={`h-4 w-4 ${isAvailable ? 'fill-green-500' : ''}`} />
                <span className="font-medium">{isAvailable ? 'Online' : 'Offline'}</span>
              </button>

              <button className="relative p-2 rounded-lg hover:bg-gray-100">
                <Bell className="h-6 w-6 text-gray-600" />
                {rideRequests.length > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                    {rideRequests.length}
                  </span>
                )}
              </button>

              <div className="hidden sm:flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt="" className="h-10 w-10 rounded-full" />
                  ) : (
                    <User className="h-5 w-5 text-primary-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user?.name}</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-gray-500">{driver?.total_trips || 0} trips</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

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
              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-primary-50 text-primary-600">
                <Car className="h-5 w-5" />
                Dashboard
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100">
                <History className="h-5 w-5" />
                Trip History
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100">
                <DollarSign className="h-5 w-5" />
                Earnings
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100">
                <Settings className="h-5 w-5" />
                Settings
              </button>
              <button
                onClick={signOut}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-red-600"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            </nav>
          </motion.div>
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Ride Requests Banner */}
        {rideRequests.length > 0 && isAvailable && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="bg-gradient-to-r from-primary-500 to-purple-500 text-white">
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                      <AlertCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">{rideRequests.length} New Ride Request{rideRequests.length > 1 ? 's' : ''}</p>
                      <p className="text-white/80">Accept now to start earning</p>
                    </div>
                  </div>
                  <Button className="bg-white text-primary-600 hover:bg-gray-100">
                    View Requests
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Offline Message */}
        {!isAvailable && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-bold text-yellow-800">You're Currently Offline</p>
                    <p className="text-yellow-700">Go online to start receiving ride requests</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Today's Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">${todayEarnings.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center">
                  <Car className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Today's Trips</p>
                  <p className="text-2xl font-bold text-gray-900">{todayTrips}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Weekly Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">${weeklyEarnings.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <Star className="h-6 w-6 text-yellow-600 fill-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{user?.rating || 5.0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ride Requests */}
            {isAvailable && rideRequests.length > 0 && (
              <Card>
                <CardHeader title="Incoming Ride Requests" />
                <CardContent>
                  <div className="space-y-4">
                    {rideRequests.map((ride) => (
                      <motion.div
                        key={ride.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="font-bold text-lg">${ride.final_fare}</p>
                            <p className="text-sm text-gray-500">{ride.distance} km • {Math.round(ride.duration / 60)} min</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleRejectRide(ride.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleAcceptRide(ride)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                            <p className="text-sm text-gray-600">{ride.pickup_address}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                            <p className="text-sm text-gray-600">{ride.drop_address}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Map Placeholder */}
            <Card>
              <CardHeader title="Your Location" />
              <CardContent>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  {currentLocation ? (
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-primary-600 mx-auto mb-2" />
                      <p className="text-gray-600">Location: {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}</p>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      <Navigation className="h-12 w-12 mx-auto mb-2" />
                      <p>Enable location services</p>
                      <p className="text-sm">to see your position on the map</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Vehicle Info */}
            <Card>
              <CardHeader title="Your Vehicle" />
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg bg-primary-100 flex items-center justify-center">
                    <Car className="h-8 w-8 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-bold">{driver?.vehicle_make} {driver?.vehicle_model}</p>
                    <p className="text-sm text-gray-500">{driver?.vehicle_number}</p>
                    <p className="text-sm text-gray-500">{driver?.vehicle_color}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Trips */}
            <Card>
              <CardHeader
                title="Recent Trips"
                action={
                  <button className="text-primary-600 text-sm hover:text-primary-700">
                    View all
                  </button>
                }
              />
              <CardContent>
                {recentRides.length > 0 ? (
                  <div className="space-y-3">
                    {recentRides.map((ride) => (
                      <div
                        key={ride.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <Car className="h-5 w-5 text-primary-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{ride.drop_address}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(ride.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${ride.final_fare}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${RIDE_STATUS_COLORS[ride.status]}`}>
                            {RIDE_STATUS_LABELS[ride.status]}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Car className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No trips yet</p>
                    <p className="text-sm">Go online to start driving</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader title="Quick Actions" />
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" fullWidth leftIcon={<Calendar className="h-4 w-4" />}>
                    View Schedule
                  </Button>
                  <Button variant="outline" fullWidth leftIcon={<DollarSign className="h-4 w-4" />}>
                    Earnings Report
                  </Button>
                  <Button variant="outline" fullWidth leftIcon={<Settings className="h-4 w-4" />}>
                    Vehicle Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}