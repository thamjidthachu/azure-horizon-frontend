"use client"

import { useCart } from "@/components/cart-provider"
import { useState, useEffect } from "react"

export default function ProductsList() {
  const { addToCart } = useCart()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  // Example usage: Replace/add this logic in your product card/button
  // <Button onClick={() => addToCart({ service_id: product.id, quantity: 1 })}>Add to Cart</Button>
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* ...existing products grid and UI... */}
    </div>
  )
}