'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { useAuth } from '@/hooks/useAuth'
import { 
  Car, 
  ArrowLeft,
  User,
  Bell,
  Shield,
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronRight,
  Moon,
  Globe,
  Phone,
  Mail,
  MapPin
} from 'lucide-react'

export default function RiderSettings() {
  const router = useRouter()
  const { user, signOut, updateProfile } = useAuth()
  const [activeSection, setActiveSection] = useState('main')
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  })
  const [isSaving, setIsSaving] = useState(false)
  const [paymentMethods, setPaymentMethods] = useState([
    { id: '1', type: 'visa', last4: '4242', isDefault: true },
    { id: '2', type: 'mastercard', last4: '8888', isDefault: false }
  ])
  const [showAddPayment, setShowAddPayment] = useState(false)
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  })
  const [safetySettings, setSafetySettings] = useState({
    emergencyContact1: '',
    emergencyContact2: '',
    shareLocation: true,
    autoAlert: false
  })
  const [notificationSettings, setNotificationSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    rideUpdates: true,
    promotions: false,
    safetyAlerts: true
  })

  // Load saved settings from localStorage on component mount
  useEffect(() => {
    const savedPaymentMethods = localStorage.getItem('paymentMethods')
    if (savedPaymentMethods) {
      setPaymentMethods(JSON.parse(savedPaymentMethods))
    }

    const savedSafetySettings = localStorage.getItem('safetySettings')
    if (savedSafetySettings) {
      setSafetySettings(JSON.parse(savedSafetySettings))
    }

    const savedNotificationSettings = localStorage.getItem('notificationSettings')
    if (savedNotificationSettings) {
      setNotificationSettings(JSON.parse(savedNotificationSettings))
    }
  }, [])

  const settingsSections = [
    {
      id: 'profile',
      title: 'Profile',
      icon: User,
      description: 'Manage your personal information'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      description: 'Configure notification preferences'
    },
    {
      id: 'safety',
      title: 'Safety & Security',
      icon: Shield,
      description: 'Emergency contacts and safety features'
    },
    {
      id: 'payment',
      title: 'Payment Methods',
      icon: CreditCard,
      description: 'Manage payment options'
    },
    {
      id: 'support',
      title: 'Help & Support',
      icon: HelpCircle,
      description: 'Get help and contact support'
    }
  ]

  const handleSignOut = () => {
    signOut()
    router.push('/')
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
                  <Car className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">Settings</span>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {activeSection === 'main' && (
          <div className="space-y-4">
            {/* User Profile Card */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500"></div>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary-100 to-purple-100 flex items-center justify-center shadow-md">
                    <User className="h-8 w-8 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900">{user?.name || 'Rider'}</h2>
                    <p className="text-gray-500">{user?.email}</p>
                    <p className="text-sm text-primary-600 font-medium mt-1">Rider Account</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            {/* Settings Options */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-0">
                {settingsSections.map((section, index) => {
                  const SectionIcon = section.icon
                  return (
                    <motion.button
                      key={section.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                      onClick={() => setActiveSection(section.id)}
                      className="w-full flex items-center gap-4 p-4 border-b last:border-b-0 transition-colors"
                    >
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-100 to-purple-100 flex items-center justify-center">
                        <SectionIcon className="h-5 w-5 text-primary-600" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-gray-900">{section.title}</p>
                        <p className="text-sm text-gray-500">{section.description}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </motion.button>
                  )
                })}
              </CardContent>
            </Card>

            {/* Sign Out */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-red-50 transition-colors text-red-600"
                >
                  <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center">
                    <LogOut className="h-5 w-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold">Sign Out</p>
                    <p className="text-sm text-red-500">Sign out of your account</p>
                  </div>
                </motion.button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === 'profile' && (
          <div className="space-y-6">
            <Button 
              variant="ghost" 
              onClick={() => setActiveSection('main')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Settings
            </Button>
            
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader title="Profile Information" />
              <CardContent className="space-y-4">
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  leftIcon={<User className="h-5 w-5" />}
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  leftIcon={<Mail className="h-5 w-5" />}
                />
                <Input
                  label="Phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  leftIcon={<Phone className="h-5 w-5" />}
                />
                <Button 
                  className="w-full"
                  onClick={async () => {
                    setIsSaving(true)
                    try {
                      await updateProfile(profileData)
                      alert('Profile updated successfully!')
                    } catch (error) {
                      alert('Failed to update profile')
                    } finally {
                      setIsSaving(false)
                    }
                  }}
                  isLoading={isSaving}
                >
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === 'notifications' && (
          <div className="space-y-6">
            <Button 
              variant="ghost" 
              onClick={() => setActiveSection('main')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Settings
            </Button>
            
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader title="Notification Preferences" />
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-primary-600" />
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-gray-500">Receive ride updates</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notificationSettings.pushNotifications}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, pushNotifications: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" 
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary-600" />
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive receipts and updates</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notificationSettings.emailNotifications}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" 
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary-600" />
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-gray-500">Receive ride alerts via SMS</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notificationSettings.smsNotifications}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, smsNotifications: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" 
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Car className="h-5 w-5 text-primary-600" />
                    <div>
                      <p className="font-medium">Ride Updates</p>
                      <p className="text-sm text-gray-500">Get notified about ride status</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notificationSettings.rideUpdates}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, rideUpdates: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" 
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-primary-600" />
                    <div>
                      <p className="font-medium">Safety Alerts</p>
                      <p className="text-sm text-gray-500">Emergency notifications</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notificationSettings.safetyAlerts}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, safetyAlerts: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" 
                  />
                </div>
                <Button 
                  className="w-full mt-4"
                  onClick={() => {
                    localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings))
                    alert('Notification preferences saved successfully!')
                  }}
                >
                  Save Notification Preferences
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === 'safety' && (
          <div className="space-y-6">
            <Button 
              variant="ghost" 
              onClick={() => setActiveSection('main')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Settings
            </Button>
            
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader title="Safety & Security" />
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    <p className="font-semibold text-green-800">Emergency SOS</p>
                  </div>
                  <p className="text-sm text-green-700">Press the emergency button during rides to alert authorities</p>
                </div>
                <Input
                  label="Emergency Contact 1"
                  placeholder="Enter phone number"
                  value={safetySettings.emergencyContact1}
                  onChange={(e) => setSafetySettings({ ...safetySettings, emergencyContact1: e.target.value })}
                  leftIcon={<Phone className="h-5 w-5" />}
                />
                <Input
                  label="Emergency Contact 2"
                  placeholder="Enter phone number"
                  value={safetySettings.emergencyContact2}
                  onChange={(e) => setSafetySettings({ ...safetySettings, emergencyContact2: e.target.value })}
                  leftIcon={<Phone className="h-5 w-5" />}
                />
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary-600" />
                    <div>
                      <p className="font-medium">Share Location</p>
                      <p className="text-sm text-gray-500">Share location during rides</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={safetySettings.shareLocation}
                    onChange={(e) => setSafetySettings({ ...safetySettings, shareLocation: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" 
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-primary-600" />
                    <div>
                      <p className="font-medium">Auto Alert</p>
                      <p className="text-sm text-gray-500">Auto-alert contacts if ride deviates</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={safetySettings.autoAlert}
                    onChange={(e) => setSafetySettings({ ...safetySettings, autoAlert: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" 
                  />
                </div>
                <Button 
                  className="w-full mt-4"
                  onClick={() => {
                    localStorage.setItem('safetySettings', JSON.stringify(safetySettings))
                    alert('Safety settings saved successfully!')
                  }}
                >
                  Save Safety Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === 'payment' && (
          <div className="space-y-6">
            <Button 
              variant="ghost" 
              onClick={() => setActiveSection('main')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Settings
            </Button>
            
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader title="Payment Methods" />
              <CardContent className="space-y-4">
                {paymentMethods.length > 0 ? (
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <motion.div
                        key={method.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-100 to-purple-100 flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-primary-600" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {method.type === 'visa' ? 'Visa' : 'Mastercard'} •••• {method.last4}
                            </p>
                            {method.isDefault && (
                              <p className="text-sm text-primary-600">Default</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!method.isDefault && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const updated = paymentMethods.map(m => ({
                                  ...m,
                                  isDefault: m.id === method.id
                                }))
                                setPaymentMethods(updated)
                                localStorage.setItem('paymentMethods', JSON.stringify(updated))
                                alert('Default payment method updated!')
                              }}
                            >
                              Set Default
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const updated = paymentMethods.filter(m => m.id !== method.id)
                              setPaymentMethods(updated)
                              localStorage.setItem('paymentMethods', JSON.stringify(updated))
                              alert('Payment method removed!')
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CreditCard className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No payment methods added</p>
                    <p className="text-sm">Add a payment method to book rides</p>
                  </div>
                )}
                
                {showAddPayment ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4 p-4 bg-gray-50 rounded-xl"
                  >
                    <h4 className="font-semibold">Add New Payment Method</h4>
                    <Input
                      label="Card Number"
                      placeholder="1234 5678 9012 3456"
                      value={newPaymentMethod.cardNumber}
                      onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, cardNumber: e.target.value })}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Expiry Date"
                        placeholder="MM/YY"
                        value={newPaymentMethod.expiryDate}
                        onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, expiryDate: e.target.value })}
                      />
                      <Input
                        label="CVV"
                        placeholder="123"
                        value={newPaymentMethod.cvv}
                        onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, cvv: e.target.value })}
                      />
                    </div>
                    <Input
                      label="Cardholder Name"
                      placeholder="John Doe"
                      value={newPaymentMethod.cardholderName}
                      onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, cardholderName: e.target.value })}
                    />
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setShowAddPayment(false)
                          setNewPaymentMethod({ cardNumber: '', expiryDate: '', cvv: '', cardholderName: '' })
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={() => {
                          if (newPaymentMethod.cardNumber && newPaymentMethod.expiryDate && newPaymentMethod.cvv && newPaymentMethod.cardholderName) {
                            const newMethod = {
                              id: Date.now().toString(),
                              type: newPaymentMethod.cardNumber.startsWith('4') ? 'visa' : 'mastercard',
                              last4: newPaymentMethod.cardNumber.slice(-4),
                              isDefault: paymentMethods.length === 0
                            }
                            const updated = [...paymentMethods, newMethod]
                            setPaymentMethods(updated)
                            localStorage.setItem('paymentMethods', JSON.stringify(updated))
                            setShowAddPayment(false)
                            setNewPaymentMethod({ cardNumber: '', expiryDate: '', cvv: '', cardholderName: '' })
                            alert('Payment method added successfully!')
                          } else {
                            alert('Please fill in all fields')
                          }
                        }}
                      >
                        Add Card
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <Button 
                    className="w-full"
                    onClick={() => setShowAddPayment(true)}
                  >
                    Add Payment Method
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === 'support' && (
          <div className="space-y-6">
            <Button 
              variant="ghost" 
              onClick={() => setActiveSection('main')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Settings
            </Button>
            
            {/* Support Overview Card */}
            <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">We're Here to Help</h3>
                    <p className="text-sm text-gray-600">Your safety and satisfaction are our top priorities</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white/80 rounded-lg p-3">
                    <p className="text-2xl font-bold text-primary-600">24/7</p>
                    <p className="text-xs text-gray-600">Support Available</p>
                  </div>
                  <div className="bg-white/80 rounded-lg p-3">
                    <p className="text-2xl font-bold text-green-600">&lt; 2 min</p>
                    <p className="text-xs text-gray-600">Avg Response</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Safety Features */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader title="Your Safety Matters" />
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="h-6 w-6 text-green-600" />
                    <h4 className="font-semibold text-green-800">Safety Guarantees</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-green-700">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      All drivers are background-checked and verified
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Real-time trip tracking with emergency alerts
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      24/7 emergency support team monitoring
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Insurance coverage for all rides
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Contact Options */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader title="Contact Support" />
              <CardContent className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-100 to-purple-100 flex items-center justify-center">
                    <HelpCircle className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900">Help Center</p>
                    <p className="text-sm text-gray-500">Browse FAQs and step-by-step guides</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900">Email Support</p>
                    <p className="text-sm text-gray-500">support@ridex.com • Response within 1 hour</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900">Phone Support</p>
                    <p className="text-sm text-gray-500">+1 (555) 123-4567 • Available 24/7</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="w-full flex items-center gap-4 p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors border border-red-200"
                >
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-red-800">Emergency Line</p>
                    <p className="text-sm text-red-600">+1 (555) 911-HELP • Immediate response</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-red-400" />
                </motion.button>
              </CardContent>
            </Card>

            {/* Additional Support */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader title="More Ways We Help" />
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Car className="h-5 w-5 text-primary-600" />
                      <h4 className="font-medium text-gray-900">Trip Issues</h4>
                    </div>
                    <p className="text-sm text-gray-600">Lost items, route disputes, or billing questions? We'll help resolve any ride-related issues quickly.</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <User className="h-5 w-5 text-primary-600" />
                      <h4 className="font-medium text-gray-900">Account Help</h4>
                    </div>
                    <p className="text-sm text-gray-600">Need to update your profile, payment methods, or account settings? Our team can guide you through any changes.</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Bell className="h-5 w-5 text-primary-600" />
                      <h4 className="font-medium text-gray-900">Feedback & Suggestions</h4>
                    </div>
                    <p className="text-sm text-gray-600">Your feedback helps us improve! Share your experience or suggest new features to make RideX better for everyone.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trust & Security */}
            <Card className="border-0 shadow-xl bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200">
              <CardContent className="p-6">
                <div className="text-center">
                  <Shield className="h-8 w-8 text-gray-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Trusted & Secure</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    RideX is committed to your privacy and security. All communications are encrypted and your data is protected according to the highest industry standards.
                  </p>
                  <div className="flex justify-center gap-4 text-xs text-gray-500">
                    <span>🔒 SSL Encrypted</span>
                    <span>🛡️ GDPR Compliant</span>
                    <span>✅ SOC 2 Certified</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </motion.div>
    </div>
  )
}