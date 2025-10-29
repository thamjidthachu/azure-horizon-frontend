"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/products"
import { Star } from "lucide-react"

interface ProductsListProps {
  products: Product[]
  onAddToCart: (product: Product) => void | Promise<void>
}

export default function ProductsList({ products, onAddToCart }: ProductsListProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((skeleton) => (
          <div key={skeleton} className="animate-pulse rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-4 h-48 rounded-lg bg-gray-200 dark:bg-gray-800" />
            <div className="mb-2 h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 p-12 text-center text-gray-500 dark:border-gray-800 dark:text-gray-400">
        No products match the selected filters right now. Try adjusting your search.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <Card
          key={product.id}
          className="overflow-hidden border border-gray-100 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
        >
          <CardContent className="p-0">
            <div className="relative h-56 w-full">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {product.originalPrice && (
                <Badge className="absolute left-3 top-3 bg-red-500 text-white">Sale</Badge>
              )}
            </div>
            <div className="space-y-4 p-6">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{product.category}</Badge>
                <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <Star className="h-4 w-4 text-amber-400" />
                  {product.rating.toFixed(1)}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{product.name}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                  {product.description}
                </p>
              </div>

              {product.features && product.features.length > 0 && (
                <ul className="grid grid-cols-1 gap-1 text-sm text-gray-500 dark:text-gray-400">
                  {product.features.slice(0, 3).map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex items-baseline justify-between">
                <span className="text-xl font-semibold text-teal-600 dark:text-teal-400">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <Button
                className="w-full"
                onClick={() => onAddToCart(product)}
                disabled={!product.inStock}
              >
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
