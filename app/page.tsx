'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { 
  Car, 
  MapPin, 
  Shield, 
  Clock, 
  Star, 
  CreditCard,
  ChevronRight,
  Menu,
  X,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle,
  Users,
  Zap,
  Globe,
  Play,
  User
} from 'lucide-react'

// Simple fallback component for testing
function LandingPageFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">RideX</h1>
        <p className="text-xl text-gray-600 mb-8">Your Ride, Your Way</p>
        <div className="space-x-4">
          <Link href="/auth/login">
            <Button>Login</Button>
          </Link>
          <Link href="/auth/signup">
            <Button variant="outline">Sign Up</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

const features = [
  {
    icon: MapPin,
    title: 'Real-Time Tracking',
    description: 'Track your ride in real-time with live GPS updates and accurate ETA predictions.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Shield,
    title: 'Safe & Secure',
    description: 'Verified drivers, emergency SOS, and ride sharing for your complete safety.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Clock,
    title: 'Quick Pickups',
    description: 'Average pickup time of just 3 minutes in major cities. No more waiting!',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: CreditCard,
    title: 'Easy Payments',
    description: 'Multiple payment options including cards, wallets, UPI, and cash.',
    color: 'from-orange-500 to-red-500',
  },
]

const rideTypes = [
  {
    name: 'Economy',
    description: 'Affordable rides for everyday travel',
    price: 'From $5',
    icon: '🚗',
    features: ['4 seats', 'AC', 'Budget-friendly'],
    gradient: 'from-green-400 to-emerald-500',
  },
  {
    name: 'Premium',
    description: 'Luxury vehicles with top-rated drivers',
    price: 'From $10',
    icon: '🚙',
    features: ['4 seats', 'AC', 'Premium cars', 'Top drivers'],
    popular: true,
    gradient: 'from-purple-400 to-pink-500',
  },
  {
    name: 'XL',
    description: 'Extra space for groups up to 6',
    price: 'From $15',
    icon: '🚐',
    features: ['6 seats', 'AC', 'Spacious', 'Group travel'],
    gradient: 'from-blue-400 to-cyan-500',
  },
]

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Daily Commuter',
    content: 'Best cab service I\'ve ever used! The app is so easy to use and drivers are always professional.',
    rating: 5,
    avatar: '👩‍💼',
  },
  {
    name: 'Michael Chen',
    role: 'Business Traveler',
    content: 'Reliable and punctual. I use it for all my business trips. The premium option is worth every penny.',
    rating: 5,
    avatar: '👨‍💻',
  },
  {
    name: 'Emily Davis',
    role: 'Student',
    content: 'Affordable prices and great service. The economy option fits perfectly within my student budget.',
    rating: 5,
    avatar: '👩‍🎓',
  },
]

const stats = [
  { label: 'Happy Riders', value: '2M+', icon: Users },
  { label: 'Active Drivers', value: '50K+', icon: Car },
  { label: 'Cities Covered', value: '100+', icon: Globe },
  { label: 'Rides Completed', value: '10M+', icon: Zap },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const ref = useRef(null)
  
  // Fix for SSR - only run framer-motion hooks on client
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  useEffect(() => {
    setIsClient(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Show fallback during SSR or if there are issues
  if (!isClient) {
    return <LandingPageFallback />
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
                  <Car className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                RideX
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <Link href="#features" className={`font-medium transition-colors ${scrolled ? 'text-gray-600 hover:text-gray-900' : 'text-gray-700 hover:text-gray-900'}`}>
                Features
              </Link>
              <Link href="#pricing" className={`font-medium transition-colors ${scrolled ? 'text-gray-600 hover:text-gray-900' : 'text-gray-700 hover:text-gray-900'}`}>
                Pricing
              </Link>
              <Link href="#testimonials" className={`font-medium transition-colors ${scrolled ? 'text-gray-600 hover:text-gray-900' : 'text-gray-700 hover:text-gray-900'}`}>
                Testimonials
              </Link>
              <Link href="/auth/login">
                <Button variant="ghost" className="font-medium">Login</Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="font-medium shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden bg-white border-b shadow-xl"
          >
            <div className="px-4 py-6 space-y-4">
              <Link href="#features" className="block py-2 text-gray-600 hover:text-gray-900 font-medium">
                Features
              </Link>
              <Link href="#pricing" className="block py-2 text-gray-600 hover:text-gray-900 font-medium">
                Pricing
              </Link>
              <Link href="#testimonials" className="block py-2 text-gray-600 hover:text-gray-900 font-medium">
                Testimonials
              </Link>
              <hr className="my-4" />
              <Link href="/auth/login">
                <Button variant="outline" fullWidth className="font-medium">Login</Button>
              </Link>
              <Link href="/auth/signup">
                <Button fullWidth className="font-medium">Get Started</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section ref={ref} className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-purple-50"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-30"></div>
        
        {/* Animated shapes */}
        <motion.div
          style={{ y, opacity }}
          className="absolute top-20 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"
        />
        <motion.div
          style={{ y, opacity }}
          className="absolute top-40 left-10 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"
        />
        <motion.div
          style={{ y, opacity }}
          className="absolute bottom-20 right-1/3 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6"
              >
                <Zap className="h-4 w-4" />
                #1 Rated Cab Booking App
              </motion.div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
                Your Ride,{' '}
                <span className="relative">
                  <span className="bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Your Way
                  </span>
                  <motion.svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 300 12"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                  >
                    <motion.path
                      d="M2 10C50 2 100 2 150 6C200 10 250 10 298 2"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </motion.svg>
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
                Book a ride in seconds, track in real-time, and pay seamlessly. 
                Experience the future of urban transportation with RideX.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/auth/signup">
                  <Button 
                    size="lg" 
                    rightIcon={<ArrowRight className="h-5 w-5" />}
                    className="text-lg px-8 py-4 shadow-xl shadow-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/40 transition-all"
                  >
                    Book a Ride
                  </Button>
                </Link>
                <Link href="/auth/signup?role=driver">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="text-lg px-8 py-4 border-2 hover:bg-gray-50"
                  >
                    Become a Driver
                  </Button>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Free cancellation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>24/7 Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Safe rides</span>
                </div>
              </div>
            </motion.div>

            {/* Right Content - App Preview */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative mx-auto w-72 sm:w-80">
                {/* Phone Frame */}
                <div className="relative bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl"></div>
                  <div className="bg-white rounded-[2.5rem] overflow-hidden">
                    {/* App Screen */}
                    <div className="h-[500px] bg-gradient-to-b from-primary-500 to-purple-600 p-6 flex flex-col">
                      <div className="flex items-center justify-between mb-8">
                        <div className="text-white">
                          <p className="text-sm opacity-80">Good morning</p>
                          <p className="font-semibold">Where to?</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-2xl p-4 mb-4 shadow-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-3 w-3 rounded-full bg-green-500"></div>
                          <span className="text-gray-800 text-sm">Current Location</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-3 w-3 rounded-full bg-red-500"></div>
                          <span className="text-gray-400 text-sm">Enter destination</span>
                        </div>
                      </div>

                      <div className="flex-1 flex items-center justify-center">
                        <motion.div
                          animate={{ 
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ 
                            duration: 3,
                            repeat: Infinity,
                            repeatType: 'reverse'
                          }}
                        >
                          <MapPin className="h-16 w-16 text-white/80" />
                        </motion.div>
                      </div>

                      <div className="bg-white rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-800">Economy</span>
                          <span className="font-bold text-primary-600">$12.50</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '60%' }}
                            transition={{ duration: 1, delay: 1 }}
                            className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Cards */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="absolute -left-20 top-1/4 hidden lg:block"
                >
                  <Card className="shadow-xl border-0 bg-white/95 backdrop-blur" padding="sm">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                        <Car className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Driver Arriving</p>
                        <p className="text-sm text-gray-500">2 min away</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                  className="absolute -right-16 bottom-1/3 hidden lg:block"
                >
                  <Card className="shadow-xl border-0 bg-white/95 backdrop-blur" padding="sm">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center">
                        <CreditCard className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">$12.50</p>
                        <p className="text-sm text-gray-500">Estimated fare</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4, duration: 0.5 }}
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 hidden lg:block"
                >
                  <Card className="shadow-xl border-0 bg-white/95 backdrop-blur" padding="sm">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-sm">👨</div>
                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-sm">👩</div>
                        <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center text-sm">👨</div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">2M+ Riders</p>
                        <p className="text-xs text-gray-500">Trust RideX</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="text-center"
              >
                <stat.icon className="h-8 w-8 text-white/80 mx-auto mb-3" />
                <p className="text-4xl lg:text-5xl font-bold text-white mb-2">{stat.value}</p>
                <p className="text-white/80">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
              Why Choose Us
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Built for the Modern Rider
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're building the future of urban mobility with cutting-edge technology
              and a focus on user experience.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="group"
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${feature.color}`}></div>
                  <div className="p-6">
                    <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-4">
              Ride Options
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Choose Your Ride
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From budget-friendly to premium luxury, we have the perfect ride for every occasion.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {rideTypes.map((ride, index) => (
              <motion.div
                key={ride.name}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="relative"
              >
                {ride.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium px-4 py-1 rounded-full shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                <Card className={`h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${ride.popular ? 'ring-2 ring-purple-500' : ''}`}>
                  <div className={`h-32 bg-gradient-to-br ${ride.gradient} flex items-center justify-center`}>
                    <span className="text-6xl">{ride.icon}</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{ride.name}</h3>
                    <p className="text-gray-500 mb-4">{ride.description}</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-6">
                      {ride.price}
                    </p>
                    <ul className="space-y-3 mb-6">
                      {ride.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-gray-600">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link href="/auth/signup" className="block">
                      <Button fullWidth variant={ride.popular ? 'primary' : 'outline'} className="font-medium">
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
              Testimonials
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              What Our Riders Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied riders who trust RideX for their daily commute.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                  <div className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-6 leading-relaxed">"{testimonial.content}"</p>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-100 to-purple-100 flex items-center justify-center text-2xl">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Download the app or sign up online to start your first ride. 
              Use code <span className="font-bold text-yellow-300">FIRST50</span> for 50% off!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 shadow-xl">
                  Sign Up Now
                </Button>
              </Link>
              <Link href="/auth/signup?role=driver">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-lg px-8">
                  Drive with Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                  <Car className="h-7 w-7 text-white" />
                </div>
                <span className="text-2xl font-bold">RideX</span>
              </div>
              <p className="text-gray-400 mb-6">
                Your trusted partner for safe, reliable, and affordable rides.
              </p>
              <div className="flex gap-4">
                <a href="#" className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-600 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.25 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-600 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="#" className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-600 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-6">Company</h4>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/careers" className="text-gray-400 hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/press" className="text-gray-400 hover:text-white transition-colors">Press</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-6">Support</h4>
              <ul className="space-y-3">
                <li><Link href="/help" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/safety" className="text-gray-400 hover:text-white transition-colors">Safety</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-6">Download App</h4>
              <div className="space-y-3">
                <Link href="#" className="block bg-gray-800 rounded-xl p-4 hover:bg-gray-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">📱</span>
                    <div>
                      <p className="text-xs text-gray-400">Download on</p>
                      <p className="font-semibold">App Store</p>
                    </div>
                  </div>
                </Link>
                <Link href="#" className="block bg-gray-800 rounded-xl p-4 hover:bg-gray-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🤖</span>
                    <div>
                      <p className="text-xs text-gray-400">Get it on</p>
                      <p className="font-semibold">Google Play</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} RideX. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}