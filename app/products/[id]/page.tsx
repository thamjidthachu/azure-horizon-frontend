"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Star, ShoppingCart, Heart, Truck, Shield, RotateCcw } from 'lucide-react'
import { TrendingHeader } from '@/components/trending-header'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { getProductById } from '@/lib/products'
import { useCart } from '@/components/cart-provider'
import { useToast } from '@/components/ui/use-toast'

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [quantity, setQuantity] = useState(1)
  const product = getProductById(params.id)
  const { addToCart } = useCart()
  const { toast } = useToast()

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <Navbar />
        <TrendingHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
        </div>
        <Footer />
      </div>
    )
  }

  const handleAddToCart = async () => {
    if (!product.inStock) return

    const numericId = Number(product.id)
    if (Number.isNaN(numericId)) {
      toast({
        title: "Unable to add to cart",
        description: "This product is missing a valid identifier.",
        variant: "destructive",
      })
      return
    }

    await addToCart({
      service_id: numericId,
      quantity,
    })

    toast({
      title: "Added to cart",
      description: `${quantity} ${product.name}${quantity > 1 ? 's' : ''} added to your cart.`,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <TrendingHeader />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-96 lg:h-[500px] object-cover rounded-lg"
              />
              {product.originalPrice && (
                <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                  Sale
                </Badge>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {product.category}
              </Badge>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 ml-2">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-purple-600">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
                {product.originalPrice && (
                  <Badge className="bg-green-100 text-green-800">
                    Save ${(product.originalPrice - product.price).toFixed(2)}
                  </Badge>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {product.features && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <span className="w-2 h-2 bg-purple-600 rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Separator />

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium">Quantity:</label>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="px-4 py-2 text-center min-w-[60px]">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1"
                  size="lg"
                >
                  <ShoppingCart className="h-5 w-5 mr-2"/>
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
                <Button variant="outline" size="lg" className="flex-1">
                  <Heart className="h-5 w-5 mr-2"/>
                  Add to Wishlist
                </Button>
              </div>
            </div>

            <Separator />

            {/* Shipping Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Truck className="h-5 w-5 text-green-600"/>
                <span className="text-sm text-gray-600">Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-blue-600"/>
                <span className="text-sm text-gray-600">2-year warranty included</span>
              </div>
              <div className="flex items-center space-x-3">
                <RotateCcw className="h-5 w-5 text-purple-600"/>
                <span className="text-sm text-gray-600">30-day return policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
