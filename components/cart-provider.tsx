"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { CartAPIService, type Cart, type CartItem, type OrderDetail } from '@/lib/cart-api'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/use-toast'

interface CartContextType {
  // Cart state
  cart: Cart | null
  items: CartItem[]
  isLoading: boolean
  error: string | null
  
  // Cart actions
  addToCart: (serviceData: {
    service_id: number
    quantity: number
    booking_date?: string
    booking_time?: string
  }) => Promise<void>
  updateCartItem: (itemId: number, quantity: number, booking_date?: string, booking_time?: string) => Promise<void>
  removeFromCart: (itemId: number) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
  
  // Checkout
  checkoutCart: (guestInfo: {
    customer_name: string
    customer_email: string
    customer_phone: string
    special_requests?: string
  }) => Promise<OrderDetail | null>
  
  // Computed values
  total: number
  subtotal: number
  vat: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth()
  const { toast } = useToast()
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // Load cart when user is authenticated
  useEffect(() => {
    setMounted(true)
    if (isAuthenticated && user) {
      refreshCart()
    } else {
      // Clear cart when user logs out
      setCart(null)
      setError(null)
    }
  }, [isAuthenticated, user])

  const refreshCart = async () => {
    if (!isAuthenticated) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const activeCart = await CartAPIService.getActiveCart()
      setCart(activeCart)
    } catch (err: any) {
      console.error('Failed to load cart:', err)
      setError(err.message)
      // Don't show toast on initial load failure, just log it
    } finally {
      setIsLoading(false)
    }
  }

  const addToCart = async (serviceData: {
    service_id: number
    quantity: number
    booking_date?: string
    booking_time?: string
  }) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your cart.",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      const updatedCart = await CartAPIService.addToCart(serviceData)
      setCart(updatedCart)
      toast({
        title: "Service added to cart!",
        description: "Item has been added to your cart successfully.",
        variant: "success"
      })
    } catch (err: any) {
      console.error('Failed to add to cart:', err)
      setError(err.message)
      if (err?.message?.includes('500')) {
        toast({
          title: "Error",
          description: "Something went wrong, please try again!!",
          variant: "destructive"
        })
      } else {
        toast({
          title: "Failed to Add to Cart",
          description: err.message,
          variant: "destructive"
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const updateCartItem = async (itemId: number, quantity: number, booking_date?: string, booking_time?: string) => {
    if (!isAuthenticated) return

    setIsLoading(true)
    setError(null)
    try {
      await CartAPIService.updateCartItem(itemId, quantity, booking_date, booking_time)
      // Refresh cart to get updated totals
      await refreshCart()
      toast({
        title: "Cart Updated!",
        description: "Cart item updated successfully.",
        variant: "success"
      })
    } catch (err: any) {
      console.error('Failed to update cart item:', err)
      setError(err.message)
      if (err?.message?.includes('500')) {
        toast({
          title: "Error",
          description: "Something went wrong, please try again!!",
          variant: "destructive"
        })
      } else {
        toast({
          title: "Failed to Update Item",
          description: err.message,
          variant: "destructive"
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromCart = async (itemId: number) => {
    if (!isAuthenticated) return

    setIsLoading(true)
    setError(null)
    
    try {
      await CartAPIService.removeFromCart(itemId)
      // Refresh cart to get updated state
      await refreshCart()
      toast({
        title: "Item Removed",
        description: "Item has been removed from your cart.",
        variant: "default"
      })
    } catch (err: any) {
      console.error('Failed to remove from cart:', err)
      setError(err.message)
      if (err?.message?.includes('500')) {
        toast({
          title: "Error",
          description: "Something went wrong, please try again!!",
          variant: "destructive"
        })
      } else {
        toast({
          title: "Failed to Remove Item",
          description: err.message,
          variant: "destructive"
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const clearCart = async () => {
    if (!isAuthenticated) return

    setIsLoading(true)
    setError(null)
    
    try {
      await CartAPIService.clearCart()
      setCart(null)
      
      toast({
        title: "Cart Cleared",
        description: "All items have been removed from your cart.",
        variant: "default"
      })
    } catch (err: any) {
      console.error('Failed to clear cart:', err)
      setError(err.message)
      toast({
        title: "Failed to Clear Cart",
        description: err.message,
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const checkoutCart = async (guestInfo: {
    customer_name: string
    customer_email: string
    customer_phone: string
    special_requests?: string
  }): Promise<OrderDetail | null> => {
    if (!isAuthenticated || !cart) {
      toast({
        title: "Checkout Failed",
        description: "Please log in and add items to your cart before checkout.",
        variant: "destructive"
      })
      return null
    }

    setIsLoading(true)
    setError(null)
    try {
      // Use authFetch to include the token
      const response = await (await import('@/utils/authFetch')).authFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/api/cart/checkout/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(guestInfo)
        }
      );
      const data = await response.json();
      if (response.status === 201 && data.stripe_checkout_url) {
        window.location.href = data.stripe_checkout_url;
        return null;
      }
      await refreshCart();
      toast({
        title: "Checkout Successful",
        description: data.order_number ? `Order ${data.order_number} has been created successfully.` : 'Order created.',
        variant: "default"
      });
      return data;
    } catch (err: any) {
      console.error('Failed to checkout:', err);
      setError(err.message);
      toast({
        title: "Checkout Failed",
        description: err.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  // Computed values
  const items = cart?.items ?? [];
  const subtotal = cart ? parseFloat(cart.subtotal ?? '0') : 0;
  const vat = cart ? parseFloat(cart.vat ?? '0') : 0;
  const total = cart ? parseFloat(cart.total ?? '0') : 0;
  const itemCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const value: CartContextType = {
    cart,
    items,
    isLoading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart,
    checkoutCart,
    total,
    subtotal,
    vat,
    itemCount
  }

  if (!mounted) {
    return (
      <CartContext.Provider value={{
        cart: null,
        items: [],
        isLoading: false,
        error: null,
        addToCart: async () => {},
        updateCartItem: async () => {},
        removeFromCart: async () => {},
        clearCart: async () => {},
        refreshCart: async () => {},
        checkoutCart: async () => null,
        total: 0,
        subtotal: 0,
        vat: 0,
        itemCount: 0
      }}>
        {children}
      </CartContext.Provider>
    )
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
