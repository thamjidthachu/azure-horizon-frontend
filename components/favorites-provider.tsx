"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { FavoritesAPIService, type FavoriteService } from '@/lib/favorites-api'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/use-toast'

interface FavoritesContextType {
    // Favorites state
    favorites: FavoriteService[]
    isLoading: boolean
    error: string | null

    // Favorites actions
    addToFavorites: (serviceId: number) => Promise<void>
    removeFromFavorites: (serviceId: number) => Promise<void>
    toggleFavorite: (serviceId: number) => Promise<void>
    isFavorite: (serviceId: number) => boolean
    refreshFavorites: () => Promise<void>

    // Computed values
    favoriteCount: number
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, user } = useAuth()
    const { toast } = useToast()
    const [favorites, setFavorites] = useState<FavoriteService[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [mounted, setMounted] = useState(false)

    const normalizeServiceId = (value: unknown): number | undefined => {
        if (value === null || value === undefined) return undefined
        const parsed = Number(value)
        return Number.isFinite(parsed) ? parsed : undefined
    }

    // Load favorites when user is authenticated
    useEffect(() => {
        setMounted(true)
        if (isAuthenticated && user) {
            refreshFavorites()
        } else {
            // Clear favorites when user logs out
            setFavorites([])
            setError(null)
            setIsLoading(false)
        }

        // Listen for auth state changes
        const handleAuthChange = (event: CustomEvent) => {
            if (event.detail?.isAuthenticated) {
                refreshFavorites()
            }
        }

        window.addEventListener('auth-state-changed', handleAuthChange as EventListener)
        return () => {
            window.removeEventListener('auth-state-changed', handleAuthChange as EventListener)
        }
    }, [isAuthenticated, user])

    const refreshFavorites = async () => {
        const hasToken = typeof window !== 'undefined' && localStorage.getItem('access_token');
        if (!isAuthenticated && !hasToken) return

        setIsLoading(true)
        setError(null)

        try {
            const userFavorites = await FavoritesAPIService.getFavorites()
            setFavorites(userFavorites)
        } catch (err: any) {
            console.error('Failed to load favorites:', err)
            setError(err.message)
            // Don't show toast on initial load failure, just log it
        } finally {
            setIsLoading(false)
        }
    }

    const addToFavorites = async (serviceId: number) => {
        console.log('[DEBUG] addToFavorites called', serviceId);

        // Check both isAuthenticated state and localStorage token to avoid race conditions
        const hasToken = typeof window !== 'undefined' && localStorage.getItem('access_token');
        if (!isAuthenticated && !hasToken) {
            toast({
                title: "Login Required",
                description: "Please log in to add services to your favorites.",
                variant: "destructive"
            })
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            await FavoritesAPIService.addToFavorites(serviceId)

            // Refresh favorites list
            await refreshFavorites()

            toast({
                title: "Added to Favorites",
                description: "Service has been added to your favorites.",
                variant: "success"
            })
        } catch (err: any) {
            console.error('Failed to add to favorites:', err)
            setError(err.message)
            toast({
                title: "Failed to Add to Favorites",
                description: err.message,
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    const removeFromFavorites = async (serviceId: number) => {
        const hasToken = typeof window !== 'undefined' && localStorage.getItem('access_token');
        if (!isAuthenticated && !hasToken) return

        setIsLoading(true)
        setError(null)

        try {
            await FavoritesAPIService.removeFromFavorites(serviceId)

            // Refresh favorites list
            await refreshFavorites()

            toast({
                title: "Removed from Favorites",
                description: "Service has been removed from your favorites.",
                variant: "default"
            })
        } catch (err: any) {
            console.error('Failed to remove from favorites:', err)
            setError(err.message)
            toast({
                title: "Failed to Remove from Favorites",
                description: err.message,
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    const toggleFavorite = async (serviceId: number) => {
        const isFav = isFavorite(serviceId)
        if (isFav) {
            await removeFromFavorites(serviceId)
        } else {
            await addToFavorites(serviceId)
        }
    }

    const isFavorite = useCallback((serviceId: number): boolean => {
        if (!Array.isArray(favorites)) return false

        // Normalize various API response shapes (service_id, service pk, nested service object)
        return favorites.some((fav) => {
            const directId = normalizeServiceId(fav.service_id)
            if (directId === serviceId) return true

            const flatServiceId = normalizeServiceId(fav.service)
            if (flatServiceId === serviceId) return true

            if (fav.service && typeof fav.service === 'object') {
                const nestedId = normalizeServiceId((fav.service as any).id)
                if (nestedId === serviceId) return true
            }

            return false
        })
    }, [favorites])

    // Computed values
    const favoriteCount = favorites.length

    const value: FavoritesContextType = {
        favorites,
        isLoading,
        error,
        addToFavorites,
        removeFromFavorites,
        toggleFavorite,
        isFavorite,
        refreshFavorites,
        favoriteCount
    }

    return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
    const context = useContext(FavoritesContext)
    if (context === undefined) {
        throw new Error('useFavorites must be used within a FavoritesProvider')
    }
    return context
}
