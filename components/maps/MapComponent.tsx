'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface MapComponentProps {
  center?: [number, number]
  zoom?: number
  markers?: Array<{
    lat: number
    lng: number
    type?: 'pickup' | 'drop' | 'driver'
    label?: string
  }>
  onLocationSelect?: (lat: number, lng: number) => void
  showCurrentLocation?: boolean
  className?: string
}

export function MapComponent({
  center = [40.7128, -74.0060], // Default to NYC
  zoom = 12,
  markers = [],
  onLocationSelect,
  showCurrentLocation = false,
  className = '',
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    if (showCurrentLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }
  }, [showCurrentLocation])

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onLocationSelect) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      // Simple conversion (in real app, use proper map library)
      const lat = center[0] + (rect.height / 2 - y) / 1000
      const lng = center[1] + (x - rect.width / 2) / 1000
      
      onLocationSelect(lat, lng)
    }
  }

  return (
    <div
      ref={mapRef}
      className={`relative bg-gradient-to-br from-blue-100 to-green-100 rounded-lg overflow-hidden ${className}`}
      onClick={handleMapClick}
      style={{ minHeight: '300px' }}
    >
      {/* Map Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Center Marker */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <div className="w-6 h-6 bg-primary-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      </motion.div>

      {/* Markers */}
      {markers.map((marker, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0, y: -20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="absolute"
          style={{
            left: `${50 + (marker.lng - center[1]) * 1000}%`,
            top: `${50 - (marker.lat - center[0]) * 1000}%`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
            marker.type === 'pickup' ? 'bg-green-500' :
            marker.type === 'drop' ? 'bg-red-500' :
            marker.type === 'driver' ? 'bg-blue-500' :
            'bg-gray-500'
          }`}>
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          {marker.label && (
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-xs font-medium shadow whitespace-nowrap">
              {marker.label}
            </div>
          )}
        </motion.div>
      ))}

      {/* Current Location */}
      {currentLocation && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute"
          style={{
            left: `${50 + (currentLocation.lng - center[1]) * 1000}%`,
            top: `${50 - (currentLocation.lat - center[0]) * 1000}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </motion.div>
      )}

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button className="w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
          <span className="text-lg font-bold text-gray-600">+</span>
        </button>
        <button className="w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
          <span className="text-lg font-bold text-gray-600">−</span>
        </button>
      </div>

      {/* Map Attribution */}
      <div className="absolute bottom-2 left-2 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
        Map View
      </div>
    </div>
  )
}