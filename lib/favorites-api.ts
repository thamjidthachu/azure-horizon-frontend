import { authFetch } from '@/utils/authFetch'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

export interface FavoriteService {
    id: number
    service_id?: number
    service?: number | {
        id: number
        slug?: string
        name?: string
        price?: string
        image?: string
        files?: Array<{ images?: string }>
        synopsis?: string
        category?: string
        rating?: number
    }
    service_name?: string
    service_slug?: string
    service_price?: string
    service_image?: string
    service_synopsis?: string
    service_category?: string
    service_rating?: number
    created_at: string
}

export interface FavoriteResponse {
    id: number
    service: number
    created_at: string
}

export class FavoritesAPIService {
    private static parseServiceId(value: unknown): number | undefined {
        if (value === null || value === undefined) return undefined
        const parsed = Number(value)
        return Number.isFinite(parsed) ? parsed : undefined
    }

    /**
     * Get all favorite services for the current user
     */
    static async getFavorites(): Promise<FavoriteService[]> {
        console.log('💖 FavoritesAPI: Getting user favorites...')

        try {
            const response = await authFetch(`${API_BASE_URL}/api/v1/services/favorites/list-create/`)

            if (!response.ok) {
                throw new Error(`Failed to get favorites: ${response.status} ${response.statusText}`)
            }

            const data = await response.json()
            console.log('✅ FavoritesAPI: Favorites retrieved:', data)

            // Handle different response structures
            let rawList: any[] = []
            if (Array.isArray(data)) {
                rawList = data
            } else if (data && Array.isArray(data.results)) {
                rawList = data.results
            } else if (data && Array.isArray(data.data)) {
                rawList = data.data
            } else {
                console.warn('⚠️ FavoritesAPI: Unexpected response format, returning empty array:', data)
                return []
            }

            // Map the raw list to FavoriteService interface
            return rawList.map((item: any) => {
                // Check if service details are nested in a 'service' object (common in Django serializers)
                if (item.service && typeof item.service === 'object') {
                    const nestedServiceId = this.parseServiceId(item.service.id)
                    const nestedImage = item.service.image || (Array.isArray(item.service.files) && item.service.files.length > 0 ? item.service.files[0].images : undefined)

                    return {
                        id: item.id,
                        service_id: nestedServiceId,
                        service_name: item.service.name,
                        service_slug: item.service.slug,
                        service_price: typeof item.service.price === 'number' ? item.service.price.toString() : item.service.price,
                        service_image: nestedImage,
                        service_synopsis: item.service.synopsis,
                        service_category: item.service.category,
                        service_rating: item.service.rating,
                        created_at: item.created_at
                    }
                }

                const resolvedServiceId =
                    this.parseServiceId(item.service_id) ??
                    this.parseServiceId(item.service)

                // Normalize the flat structure to always expose service_id
                return {
                    ...item,
                    service_id: resolvedServiceId
                }
            })
        } catch (error: any) {
            console.error('❌ FavoritesAPI: Error getting favorites:', error)
            throw new Error(`Failed to get favorites: ${error.message}`)
        }
    }

    /**
     * Add a service to favorites
     */
    static async addToFavorites(serviceId: number): Promise<FavoriteResponse> {
        console.log('💖 FavoritesAPI: Adding service to favorites:', serviceId)

        try {
            const response = await authFetch(`${API_BASE_URL}/api/v1/services/favorites/list-create/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ service_id: serviceId })
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                console.error('❌ FavoritesAPI: Add to favorites failed:', response.status, errorData)
                throw new Error(errorData.detail || errorData.error || `Failed to add to favorites: ${response.status}`)
            }

            const favorite = await response.json()
            console.log('✅ FavoritesAPI: Service added to favorites:', favorite)
            return favorite
        } catch (error: any) {
            console.error('❌ FavoritesAPI: Error adding to favorites:', error)
            throw new Error(`Failed to add to favorites: ${error.message}`)
        }
    }

    /**
     * Remove a service from favorites
     */
    static async removeFromFavorites(serviceId: number): Promise<void> {
        console.log('💖 FavoritesAPI: Removing service from favorites:', serviceId)

        try {
            const response = await authFetch(`${API_BASE_URL}/api/v1/services/favorites/delete/${serviceId}/`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                console.error('❌ FavoritesAPI: Remove from favorites failed:', response.status, errorData)
                throw new Error(errorData.detail || errorData.error || `Failed to remove from favorites: ${response.status}`)
            }

            console.log('✅ FavoritesAPI: Service removed from favorites')
        } catch (error: any) {
            console.error('❌ FavoritesAPI: Error removing from favorites:', error)
            throw new Error(`Failed to remove from favorites: ${error.message}`)
        }
    }

    /**
     * Toggle favorite status for a service
     */
    static async toggleFavorite(serviceId: number, isFavorite: boolean): Promise<FavoriteResponse | void> {
        if (isFavorite) {
            return await this.removeFromFavorites(serviceId)
        } else {
            return await this.addToFavorites(serviceId)
        }
    }

    /**
     * Check if a service is in favorites
     */
    static async isFavorite(serviceId: number): Promise<boolean> {
        try {
            const favorites = await this.getFavorites()
            return favorites.some(fav => fav.service_id === serviceId)
        } catch (error) {
            console.error('Error checking favorite status:', error)
            return false
        }
    }
}
