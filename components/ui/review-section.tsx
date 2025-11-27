import { useState, useRef, useEffect } from "react"
import { Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import Link from "next/link"
import { authFetch } from "@/utils/authFetch"
import { useAuth } from "@/hooks/useAuth"

export function ReviewSection({ serviceSlug }: { serviceSlug: string }) {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [posting, setPosting] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [message, setMessage] = useState("")
  const reviewsEndRef = useRef<HTMLDivElement>(null)
  const [nextUrl, setNextUrl] = useState<string | null>(null)
  const [currentPath, setCurrentPath] = useState("")
  const { isAuthenticated, loading: authLoading } = useAuth()

  // Set current path on client side
  useEffect(() => {
    setCurrentPath(window.location.pathname + '#reviews')
  }, [])

  // Fetch reviews with pagination
  useEffect(() => {
    let isMounted = true
    setLoading(true)
    const url = nextUrl || `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/services/${serviceSlug}/reviews/?page=${page}`
    authFetch(url)
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return
        if (Array.isArray(data.results)) {
          setReviews(prev => [...prev, ...data.results])
        } else {
          setReviews(prev => [...prev, ...(data.results || [])])
        }
        setHasMore(!!data.next)
        setNextUrl(data.next)
        setLoading(false)
      })
      .catch(() => setLoading(false))

    return () => {
      isMounted = false
    }
  }, [page, serviceSlug])

  // Scroll to new reviews when loaded
  useEffect(() => {
    if (page > 1 && reviewsEndRef.current) {
      reviewsEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [reviews, page])

  // Handle review post
  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rating || !message.trim()) return
    setPosting(true)
    const res = await authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/services/${serviceSlug}/reviews/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, message }),
      credentials: "include"
    })
    if (res.ok) {
      const newReview = await res.json()
      setReviews([newReview, ...reviews])
      setRating(0)
      setMessage("")
    }
    setPosting(false)
  }

  // Format date
  function formatDate(dateStr: string) {
    const date = new Date(dateStr)
    return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
  }

  return (
    <div>
      {/* Review Post Form - Show login prompt if not authenticated */}
      {!authLoading && (
        !isAuthenticated ? (
          <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow border-2 border-dashed border-gray-300 dark:border-gray-600 text-center animate-fade-in">
            <div className="flex flex-col items-center gap-4">
              <Star className="h-12 w-12 text-gray-400" />
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Please login to review
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Share your experience with other users by leaving a review
                </p>
                <Link href={`/login?redirect=${encodeURIComponent(currentPath)}`}>
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                    Login Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePost} className="mb-8 p-4 bg-white rounded-lg shadow flex flex-col gap-4 animate-fade-in dark:bg-gray-800">
            <span className="font-small">Tell others what you think</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <button
                  type="button"
                  key={i}
                  onMouseEnter={() => setHoverRating(i)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(i)}
                  className="transition-transform duration-150"
                  style={{
                    transform: (hoverRating === i || rating === i) ? "scale(1.2)" : "scale(1)"
                  }}
                >
                  <Star
                    className={`h-6 w-6 cursor-pointer transition-colors duration-150 ${(hoverRating || rating) >= i ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    fill={(hoverRating || rating) >= i ? "#eed51dff" : "none"}
                  />
                </button>
              ))}
            </div>
            <Input
              placeholder="Write your review..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              maxLength={200}
              disabled={posting}
            />
            <Button type="submit" disabled={posting || !rating || !message.trim()} className="self-end">
              {posting ? "Posting..." : "Post Review"}
            </Button>
          </form>
        )
      )}

      <Separator />

      {/* Reviews List */}
      <div className="space-y-6 mt-8">
        {reviews.length === 0 && !loading && (
          <div className="text-gray-500 text-center">No reviews yet. Be the first to review!</div>
        )}
        {reviews.map((review, idx) => (
          <div
            key={review.id || idx}
            className="p-4 bg-white rounded-lg shadow animate-fade-in flex gap-4 dark:bg-gray-900"
            style={{ animationDelay: `${idx * 60}ms` }}
          >
            {/* Avatar */}
            <div className="flex-shrink-0">
              <Image
                src={review.author?.avatar || "/placeholder-user.jpg"}
                alt={review.author?.username || "User"}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
            {/* Review Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-800">@{review.author?.username || "Anonymous"}</span>
                <span className="text-xs text-gray-400">{review.created_at ? formatDate(review.created_at) : ""}</span>
              </div>
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${review.rating >= i ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                    fill={review.rating >= i ? "#facc15" : "none"}
                  />
                ))}
              </div>
              <div className="text-gray-800">{review.message}</div>
            </div>
          </div>
        ))}
        <div ref={reviewsEndRef} />
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-6">
          <Button onClick={() => setPage(page + 1)} disabled={loading}>
            {loading ? "Loading..." : "Load More Reviews"}
          </Button>
        </div>
      )}
    </div>
  )
}