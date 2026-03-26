'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { 
  Car, 
  ArrowLeft,
  Bell,
  Check,
  Clock,
  MapPin,
  CreditCard,
  Star,
  AlertCircle,
  Trash2
} from 'lucide-react'

interface Notification {
  id: string
  type: 'ride' | 'payment' | 'promo' | 'safety' | 'system'
  title: string
  message: string
  time: string
  read: boolean
}

export default function RiderNotifications() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'ride',
      title: 'Ride Completed',
      message: 'Your ride to Times Square has been completed. Thank you for riding with us!',
      time: '2 minutes ago',
      read: false
    },
    {
      id: '2',
      type: 'payment',
      title: 'Payment Successful',
      message: 'Payment of $12.50 has been charged to your card ending in 4242.',
      time: '5 minutes ago',
      read: false
    },
    {
      id: '3',
      type: 'promo',
      title: 'Special Offer!',
      message: 'Get 20% off your next 3 rides. Use code: RIDE20',
      time: '1 hour ago',
      read: true
    },
    {
      id: '4',
      type: 'ride',
      title: 'Driver Arriving',
      message: 'Your driver John is arriving in 2 minutes at your pickup location.',
      time: '2 hours ago',
      read: true
    },
    {
      id: '5',
      type: 'safety',
      title: 'Safety Tip',
      message: 'Remember to verify your driver and vehicle before getting in.',
      time: '1 day ago',
      read: true
    },
    {
      id: '6',
      type: 'system',
      title: 'App Update Available',
      message: 'A new version of RideX is available with exciting features!',
      time: '2 days ago',
      read: true
    }
  ])

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'ride': return 'from-blue-500 to-cyan-500'
      case 'payment': return 'from-green-500 to-emerald-500'
      case 'promo': return 'from-purple-500 to-pink-500'
      case 'safety': return 'from-red-500 to-orange-500'
      case 'system': return 'from-gray-500 to-slate-500'
      default: return 'from-gray-500 to-slate-500'
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'ride': return <Car className="h-6 w-6 text-white" />
      case 'payment': return <CreditCard className="h-6 w-6 text-white" />
      case 'promo': return <Star className="h-6 w-6 text-white" />
      case 'safety': return <AlertCircle className="h-6 w-6 text-white" />
      case 'system': return <Bell className="h-6 w-6 text-white" />
      default: return <Bell className="h-6 w-6 text-white" />
    }
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
                onClick={() => router.back()}
                className="p-2 rounded-xl hover:bg-primary-50 transition-colors"
              >
                <ArrowLeft className="h-6 w-6 text-primary-600" />
              </motion.button>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
                  <Bell className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
              </div>
            </div>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={markAllAsRead}
              >
                <Check className="h-4 w-4 mr-2" />
                Mark all read
              </Button>
            )}
          </div>
        </div>
      </motion.header>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-xl ${
                    !notification.read ? 'ring-2 ring-primary-200' : ''
                  }`}
                >
                  <CardContent className="p-0">
                    <div className="flex items-start gap-4 p-4">
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${getNotificationColor(notification.type)} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                              {!notification.read && (
                                <span className="h-2 w-2 bg-primary-500 rounded-full"></span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-400">{notification.time}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => markAsRead(notification.id)}
                                className="p-2 rounded-lg hover:bg-primary-50 transition-colors"
                                title="Mark as read"
                              >
                                <Check className="h-4 w-4 text-primary-600" />
                              </motion.button>
                            )}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => deleteNotification(notification.id)}
                              className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="py-16">
              <div className="text-center">
                <Bell className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Notifications</h3>
                <p className="text-gray-500">You're all caught up! Check back later for updates.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  )
}