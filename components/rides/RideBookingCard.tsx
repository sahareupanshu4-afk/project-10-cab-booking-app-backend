'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { MapComponent } from '@/components/maps/MapComponent'
import { RIDE_TYPES } from '@/constants'
import { useRideStore } from '@/store'
import { MapPin, Navigation, Plus, CreditCard, Car } from 'lucide-react'

interface RideBookingCardProps {
  onBookRide?: () => void
}

export function RideBookingCard({ onBookRide }: RideBookingCardProps) {
  const {
    pickup,
    drop,
    vehicleType,
    estimatedFare,
    setPickup,
    setDrop,
    setVehicleType,
    setEstimatedFare,
  } = useRideStore()

  const [pickupInput, setPickupInput] = useState('')
  const [dropInput, setDropInput] = useState('')
  const [showPromoInput, setShowPromoInput] = useState(false)
  const [promoCode, setPromoCode] = useState('')

  // Calculate fare estimate
  const calculateFare = () => {
    if (pickup && drop) {
      const rideType = RIDE_TYPES[vehicleType]
      const distance = 10 // Mock distance in km
      const duration = 15 // Mock duration in minutes
      const baseFare = rideType.baseRate + (distance * rideType.perKmRate) + (duration * rideType.perMinuteRate)
      const finalFare = Math.max(baseFare, rideType.minFare)
      setEstimatedFare(finalFare)
    }
  }

  const handleLocationSelect = (lat: number, lng: number, type: 'pickup' | 'drop') => {
    const location = { lat, lng, address: `${lat.toFixed(4)}, ${lng.toFixed(4)}` }
    if (type === 'pickup') {
      setPickup(location)
      setPickupInput(location.address || '')
    } else {
      setDrop(location)
      setDropInput(location.address || '')
    }
    calculateFare()
  }

  const handleBookRide = () => {
    if (pickup && drop && estimatedFare) {
      onBookRide?.()
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader title="Where to?" />
      <CardContent>
        <div className="space-y-4">
          {/* Location Inputs */}
          <div className="space-y-3">
            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                </div>
                <Input
                  placeholder="Enter pickup location"
                  value={pickupInput}
                  onChange={(e) => setPickupInput(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                </div>
                <Input
                  placeholder="Enter drop location"
                  value={dropInput}
                  onChange={(e) => setDropInput(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <button className="flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-medium">
              <Plus className="h-4 w-4" />
              Add stop
            </button>
          </div>

          {/* Map Preview */}
          <div className="h-48 rounded-lg overflow-hidden">
            <MapComponent
              center={[40.7128, -74.0060]}
              markers={[
                ...(pickup ? [{ lat: pickup.lat, lng: pickup.lng, type: 'pickup' as const }] : []),
                ...(drop ? [{ lat: drop.lat, lng: drop.lng, type: 'drop' as const }] : []),
              ]}
              onLocationSelect={(lat, lng) => handleLocationSelect(lat, lng, 'pickup')}
              className="h-full"
            />
          </div>

          {/* Ride Types */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Choose your ride</h4>
            <div className="space-y-2">
              {Object.entries(RIDE_TYPES).map(([key, ride]) => (
                <button
                  key={key}
                  onClick={() => setVehicleType(key as any)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                    vehicleType === key
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl">{ride.icon}</span>
                  <div className="flex-1 text-left">
                    <p className="font-semibold">{ride.name}</p>
                    <p className="text-sm text-gray-500">{ride.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      ${estimatedFare ? (estimatedFare * (ride.baseRate / RIDE_TYPES.ECONOMY.baseRate)).toFixed(2) : '---'}
                    </p>
                    <p className="text-xs text-gray-500">{ride.capacity} seats</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Promo Code */}
          {showPromoInput ? (
            <div className="flex gap-2">
              <Input
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1"
              />
              <Button onClick={() => setShowPromoInput(false)}>Apply</Button>
            </div>
          ) : (
            <button
              onClick={() => setShowPromoInput(true)}
              className="flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              <CreditCard className="h-4 w-4" />
              Add promo code
            </button>
          )}

          {/* Book Button */}
          <Button
            size="lg"
            fullWidth
            disabled={!pickup || !drop}
            onClick={handleBookRide}
          >
            {pickup && drop ? (
              <div className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Book {RIDE_TYPES[vehicleType].name} - ${estimatedFare?.toFixed(2)}
              </div>
            ) : (
              'Enter locations to book'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}