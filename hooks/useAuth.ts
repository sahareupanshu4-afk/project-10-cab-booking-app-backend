'use client'

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store'
import type { User, Driver } from '../../backend/types'
import toast from 'react-hot-toast'

export function useAuth() {
  const router = useRouter()
  const { user, driver, isAuthenticated, isLoading, setUser, setDriver, setLoading, logout } = useAuthStore()

  // Fetch user profile (demo mode)
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      // Demo mode - return mock user data
      const mockUser: User = {
        id: userId,
        email: 'demo@example.com',
        name: 'Demo User',
        phone: '+1234567890',
        role: 'RIDER',
        avatar_url: null,
        rating: 5.0,
        total_rides: 0,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      
      setUser(mockUser)
      return mockUser
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  }, [setUser])

  // Initialize auth state (demo mode)
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if user is logged in from localStorage (demo mode)
        const savedUser = localStorage.getItem('demo-user')
        if (savedUser) {
          const userData = JSON.parse(savedUser)
          await fetchProfile(userData.id)
        } else {
          setUser(null)
          setDriver(null)
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [fetchProfile, setUser, setDriver, setLoading])

  // Sign up with email
  const signUp = async (email: string, password: string, name: string, phone: string, role: 'RIDER' | 'DRIVER' = 'RIDER') => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, phone, role }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error)
      }

      if (result.data?.user) {
        await fetchProfile(result.data.user.id)
        toast.success('Account created successfully!')
        return { success: true, data: result.data }
      }

      return { success: false, error: 'Failed to create account' }
    } catch (error: any) {
      console.error('Sign up error:', error)
      toast.error(error.message || 'Failed to create account')
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // Sign in with email
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error)
      }

      if (result.data?.user) {
        await fetchProfile(result.data.user.id)
        toast.success('Welcome back!')
        return { success: true, data: result.data }
      }

      return { success: false, error: 'Failed to sign in' }
    } catch (error: any) {
      console.error('Sign in error:', error)
      toast.error(error.message || 'Failed to sign in')
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // Sign in with Google (demo mode)
  const signInWithGoogle = async () => {
    try {
      // Demo mode - simulate Google sign in
      const mockUser: User = {
        id: `demo-google-${Date.now()}`,
        email: 'demo@gmail.com',
        name: 'Demo Google User',
        role: 'RIDER',
        phone: '+1234567890',
        avatar_url: null,
        rating: 5.0,
        total_rides: 0,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      
      localStorage.setItem('demo-user', JSON.stringify(mockUser))
      await fetchProfile(mockUser.id)
      toast.success('Signed in with Google!')
      
      // Redirect to dashboard based on role
      if (mockUser.role === 'DRIVER') {
        router.push('/driver/dashboard')
      } else {
        router.push('/rider/dashboard')
      }
      
      return { success: true, data: { user: mockUser } }
    } catch (error: any) {
      console.error('Google sign in error:', error)
      toast.error(error.message || 'Failed to sign in with Google')
      return { success: false, error: error.message }
    }
  }

  // Sign out (demo mode)
  const signOut = async () => {
    try {
      localStorage.removeItem('demo-user')
      logout()
      router.push('/')
      toast.success('Signed out successfully')
    } catch (error: any) {
      console.error('Sign out error:', error)
      toast.error(error.message || 'Failed to sign out')
    }
  }

  // Reset password (demo mode)
  const resetPassword = async (email: string) => {
    try {
      // Demo mode - simulate password reset
      toast.success('Password reset email sent!')
      return { success: true }
    } catch (error: any) {
      console.error('Reset password error:', error)
      toast.error(error.message || 'Failed to send reset email')
      return { success: false, error: error.message }
    }
  }

  // Update password (demo mode)
  const updatePassword = async (newPassword: string) => {
    try {
      // Demo mode - simulate password update
      toast.success('Password updated successfully!')
      return { success: true }
    } catch (error: any) {
      console.error('Update password error:', error)
      toast.error(error.message || 'Failed to update password')
      return { success: false, error: error.message }
    }
  }

  // Update profile (demo mode)
  const updateProfile = async (updates: Partial<User>) => {
    try {
      if (!user) throw new Error('Not authenticated')

      // Demo mode - update local state
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem('demo-user', JSON.stringify(updatedUser))
      toast.success('Profile updated successfully!')
      return { success: true }
    } catch (error: any) {
      console.error('Update profile error:', error)
      toast.error(error.message || 'Failed to update profile')
      return { success: false, error: error.message }
    }
  }

  // Upload avatar (demo mode)
  const uploadAvatar = async (file: File) => {
    try {
      if (!user) throw new Error('Not authenticated')

      // Demo mode - create a fake URL
      const fakeUrl = `https://demo-avatar.example.com/${user.id}.jpg`
      await updateProfile({ avatar_url: fakeUrl })

      return { success: true, url: fakeUrl }
    } catch (error: any) {
      console.error('Upload avatar error:', error)
      toast.error(error.message || 'Failed to upload avatar')
      return { success: false, error: error.message }
    }
  }

  return {
    user,
    driver,
    isAuthenticated,
    isLoading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    uploadAvatar,
    fetchProfile,
  }
}