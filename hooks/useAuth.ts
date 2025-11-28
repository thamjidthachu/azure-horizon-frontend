"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  username: string
  full_name?: string
  email: string
  avatar?: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        setLoading(false)
        return
      }

      // Try to fetch user profile
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/profile/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })

      if (res.ok) {
        const userData = await res.json()
        setUser(userData)
        setIsAuthenticated(true)
        // Dispatch event to notify other components
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth-state-changed', { detail: { isAuthenticated: true, user: userData } }))
        }
      } else {
        // Token might be expired, try to refresh
        const refreshToken = localStorage.getItem('refresh_token')
        if (refreshToken) {
          const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/token/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refreshToken })
          })

          if (refreshRes.ok) {
            const { access } = await refreshRes.json()
            localStorage.setItem('access_token', access)
            // Retry fetching profile with new token
            const retryRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/profile/`, {
              headers: {
                'Authorization': `Bearer ${access}`,
                'Content-Type': 'application/json'
              },
              credentials: 'include'
            })

            if (retryRes.ok) {
              const userData = await retryRes.json()
              setUser(userData)
              setIsAuthenticated(true)
              // Dispatch event to notify other components
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('auth-state-changed', { detail: { isAuthenticated: true, user: userData } }))
              }
            }
          } else {
            // Refresh failed, clear tokens
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
          }
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      const token = localStorage.getItem('access_token')

      // Call logout API
      if (token) {
        await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/logout/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        })
      }
    } catch (error) {
      console.error('Logout API call failed:', error)
    } finally {
      // Always clear local storage and state, even if API fails
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      setUser(null)
      setIsAuthenticated(false)

      // Redirect to login page
      router.push('/login')
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return { user, loading, isAuthenticated, logout, checkAuth }
}