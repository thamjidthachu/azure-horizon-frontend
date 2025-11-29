"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, Loader2, Star } from 'lucide-react'
import { TrendingHeader } from '@/components/trending-header'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { useFavorites } from '@/components/favorites-provider'
import { useAuth } from '@/hooks/useAuth'
import { FavoriteButton } from '@/components/favorite-button'
import { DirhamIcon } from '@/components/ui/dirham-icon'

export default function FavoritesPage() {
    const [mounted, setMounted] = useState(false)
    const { isAuthenticated } = useAuth()
    const { favorites, isLoading, error, favoriteCount } = useFavorites()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="container mx-auto p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
            </div>
        )
    }

    // Show login prompt if not authenticated
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-black">
                <TrendingHeader />
                <Navbar />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <Heart className="h-24 w-24 text-gray-400 mx-auto mb-4" />
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Login Required</h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                            Please log in to view your favorite services.
                        </p>
                        <Link href="/login">
                            <Button size="lg">Login to Continue</Button>
                        </Link>
                    </div>
                </div>

                <Footer />
            </div>
        )
    }

    // Show loading state
    if (isLoading && favorites.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-black">
                <TrendingHeader />
                <Navbar />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold mb-2">Loading your favorites...</h2>
                    </div>
                </div>

                <Footer />
            </div>
        )
    }

    // Show error state
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-black">
                <TrendingHeader />
                <Navbar />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <Heart className="h-24 w-24 text-red-400 mx-auto mb-4" />
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Error Loading Favorites</h1>
                        <p className="text-xl text-red-600 dark:text-red-400 mb-8">{error}</p>
                        <Link href="/services">
                            <Button size="lg">Browse Services</Button>
                        </Link>
                    </div>
                </div>

                <Footer />
            </div>
        )
    }

    // Show empty state
    if (favorites.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-black">
                <TrendingHeader />
                <Navbar />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <Heart className="h-24 w-24 text-gray-400 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No favorites yet!</h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            Start exploring our services and save your favorites for quick access
                        </p>
                        <Link href="/services">
                            <Button size="lg">
                                Explore Services
                            </Button>
                        </Link>
                    </div>
                </div>

                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black">
            <Navbar />
            <TrendingHeader />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            My Favorite Services
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            You have {favoriteCount} favorite service{favoriteCount !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {favorites.map((favorite) => (
                        <Card key={favorite.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                            <CardContent className="p-0">
                                <Link href={`/services/${favorite.service_slug || favorite.service_id}`}>
                                    <div className="relative">
                                        <Image
                                            src={
                                                favorite.service_image && typeof favorite.service_image === 'string' && favorite.service_image.trim() && favorite.service_image !== 'null'
                                                    ? (favorite.service_image.startsWith('/media/')
                                                        ? `${process.env.NEXT_PUBLIC_API_BASE_URL || ''}${favorite.service_image}`
                                                        : favorite.service_image)
                                                    : "/placeholder.svg"
                                            }
                                            alt={favorite.service_name || 'Service'}
                                            width={300}
                                            height={200}
                                            className="w-full h-32 object-cover"
                                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg' }}
                                        />

                                        {/* Favorite button overlay */}
                                        <div className="absolute top-2 right-2">
                                            <FavoriteButton
                                                serviceId={favorite.service_id}
                                                variant="icon-only"
                                                className="h-8 w-8 p-1.5"
                                            />
                                        </div>

                                        {/* Category badge */}
                                        {favorite.service_category && (
                                            <div className="absolute top-2 left-2">
                                                <span className="bg-primary/90 text-primary-foreground px-2 py-0.5 rounded-full text-[10px] font-semibold backdrop-blur-sm">
                                                    {favorite.service_category}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </Link>

                                <div className="p-3">
                                    <Link href={`/services/${favorite.service_slug || favorite.service_id}`}>
                                        <h3 className="text-sm font-semibold mb-1 hover:text-primary transition-colors line-clamp-1">
                                            {favorite.service_name}
                                        </h3>
                                    </Link>

                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center gap-1">
                                            <DirhamIcon className="h-3 w-3 text-primary" />
                                            <span className="text-sm font-bold text-primary">
                                                {favorite.service_price ? parseFloat(favorite.service_price).toFixed(2) : '0.00'}
                                            </span>
                                        </div>

                                        {favorite.service_rating && (
                                            <div className="flex items-center gap-0.5">
                                                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                                <span className="text-xs font-medium text-gray-500">
                                                    {favorite.service_rating.toFixed(1)}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-3">
                                        <Link href={`/services/${favorite.service_slug || favorite.service_id}`} className="w-full block">
                                            <Button className="w-full h-8 text-xs" variant="outline" size="sm">
                                                View Details
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    )
}
