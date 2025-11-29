"use client"

import { useEffect, useMemo, useState } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFavorites } from '@/components/favorites-provider'
import { cn } from '@/lib/utils'

interface FavoriteButtonProps {
    serviceId: number | string
    variant?: 'default' | 'icon-only' | 'compact'
    className?: string
    isFavorite?: boolean
}

export function FavoriteButton({ serviceId, variant = 'default', className, isFavorite: initialIsFavorite }: FavoriteButtonProps) {
    const { isFavorite: contextIsFavorite, addToFavorites, removeFromFavorites, isLoading } = useFavorites()
    const [isToggling, setIsToggling] = useState(false)

    const normalizedServiceId = useMemo(() => {
        if (typeof serviceId === 'number') {
            return Number.isFinite(serviceId) ? serviceId : null
        }
        const parsed = Number(serviceId)
        return Number.isFinite(parsed) ? parsed : null
    }, [serviceId])

    const derivedFavorite = useMemo(() => {
        if (initialIsFavorite !== undefined) return initialIsFavorite
        if (normalizedServiceId === null) return false
        return contextIsFavorite(normalizedServiceId)
    }, [initialIsFavorite, contextIsFavorite, normalizedServiceId])

    const [favorite, setFavorite] = useState<boolean>(derivedFavorite)

    useEffect(() => {
        setFavorite(derivedFavorite)
    }, [derivedFavorite])

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (normalizedServiceId === null) return

        setIsToggling(true)
        try {
            if (favorite) {
                await removeFromFavorites(normalizedServiceId)
                setFavorite(false)
            } else {
                await addToFavorites(normalizedServiceId)
                setFavorite(true)
            }
        } catch (error) {
            console.error('Failed to toggle favorite', error)
        } finally {
            setIsToggling(false)
        }
    }

    if (variant === 'icon-only') {
        return (
            <button
                onClick={handleToggle}
                disabled={isToggling || isLoading || normalizedServiceId === null}
                className={cn(
                    "p-2 rounded-full transition-all duration-200 hover:scale-110",
                    "bg-white/90 backdrop-blur-sm shadow-lg",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    className
                )}
                aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
            >
                <Heart
                    className={cn(
                        "h-5 w-5 transition-all duration-200",
                        favorite
                            ? "fill-red-500 text-red-500"
                            : "text-gray-600 hover:text-red-500"
                    )}
                />
            </button>
        )
    }

    if (variant === 'compact') {
        return (
            <Button
                variant="ghost"
                size="sm"
                onClick={handleToggle}
                disabled={isToggling || isLoading || normalizedServiceId === null}
                className={cn("gap-2", className)}
            >
                <Heart
                    className={cn(
                        "h-4 w-4 transition-all duration-200",
                        favorite && "fill-red-500 text-red-500"
                    )}
                />
                {favorite ? "Favorited" : "Add to Favorites"}
            </Button>
        )
    }

    return (
        <Button
            variant={favorite ? "default" : "outline"}
            onClick={handleToggle}
            disabled={isToggling || isLoading || normalizedServiceId === null}
            className={cn("gap-2", className)}
        >
            <Heart
                className={cn(
                    "h-5 w-5 transition-all duration-200",
                    favorite && "fill-current"
                )}
            />
            {favorite ? "Remove from Favorites" : "Add to Favorites"}
        </Button>
    )
}
