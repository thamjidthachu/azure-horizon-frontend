"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, Calendar, User, Heart, LogOut, ShoppingCart, ChevronDown } from "lucide-react"
import ThemeToggle from "@/components/ui/theme-toggler"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/useAuth"
import { useCart } from '@/components/cart-provider'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { items } = useCart()
  const { user, loading, isAuthenticated, logout } = useAuth()

  const navigation = [
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 dark:bg-gray-900 w-full">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex flex-row flex-nowrap justify-between items-center h-16 w-full min-w-0">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 min-w-0">
            <span className="text-2xl font-bold text-primary whitespace-nowrap">
              Azure Horizon
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-row items-center ml-4 space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                key="My Bookings"
                href="/bookings"
                className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                My Bookings
              </Link>
            )}
          </div>

          {/* Theme Toggle */}
          <div className="hidden md:flex items-center justify-center w-12">
            <ThemeToggle />
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <Link href="/favorites">
              <Button variant="ghost" size="icon" aria-label="Wishlist">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative" aria-label="Cart">
                <ShoppingCart className="h-5 w-5" />
                {items.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {items.reduce((sum, item) => sum + item.quantity, 0)}
                  </Badge>
                )}
              </Button>
            </Link>
            {/* Authenticated User Display or Auth Popover */}
            {!loading && (
              isAuthenticated && user ? (
                <UserProfileSection user={user} onLogout={logout} />
              ) : (
                <AuthPopover />
              )
            )}
          </div>

          {/* Mobile menu */}
          <div className="flex md:hidden items-center space-x-1 ml-2">
            <ThemeToggle />
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative" aria-label="Cart">
                <ShoppingCart className="h-5 w-5" />
                {items.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {items.reduce((sum, item) => sum + item.quantity, 0)}
                  </Badge>
                )}
              </Button>
            </Link>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-8 w-8" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-xs sm:max-w-sm p-0">
                <div className="flex flex-col h-full pt-8 pb-4 px-4">
                  <div className="flex flex-col gap-1 flex-grow">
                    {navigation.map((item) => (
                      <div key={item.name}>
                        <Link
                          href={item.href}
                          className="block text-foreground dark:text-gray-200 hover:text-primary dark:hover:text-teal-400 px-3 py-2 rounded-md text-base font-medium transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.name}
                        </Link>
                        <Separator />
                      </div>
                    ))}
                    {isAuthenticated && (
                      <div key="My Bookings">
                        <Link
                          href="/bookings"
                          className="block text-foreground dark:text-gray-200 hover:text-primary dark:hover:text-teal-400 px-3 py-2 rounded-md text-base font-medium transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          My Bookings
                        </Link>
                        <Separator />
                      </div>
                    )}
                    {isAuthenticated && (
                      <div key="Favorites">
                        <Link
                          href="/favorites"
                          className="block text-foreground dark:text-gray-200 hover:text-primary dark:hover:text-teal-400 px-3 py-2 rounded-md text-base font-medium transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          Favorites
                        </Link>
                        <Separator />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 mt-4">
                    {!loading && (
                      isAuthenticated && user ? (
                        <MobileUserSection user={user} onLogout={logout} onClose={() => setIsOpen(false)} />
                      ) : (
                        <>
                          <Link href="/login" onClick={() => setIsOpen(false)}>
                            <Button variant="outline" className="w-full hover:text-primary dark:hover:text-teal-400">
                              Login
                            </Button>
                          </Link>
                          <Link href="/register" onClick={() => setIsOpen(false)}>
                            <Button variant="default" className="w-full hover:text-primary dark:hover:text-teal-400">
                              Register
                            </Button>
                          </Link>
                        </>
                      )
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}

function UserProfileSection({ user, onLogout }: { user: any, onLogout: () => void }) {
  return (
    <div className="flex items-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-3 px-2 py-1.5 h-auto hover:bg-transparent">
            <Avatar className="h-9 w-9 rounded-md bg-muted text-foreground dark:bg-zinc-800 dark:text-zinc-200">
              <AvatarImage
                src={user.avatar ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${user.avatar}` : undefined}
                alt={user.username}
                className="object-cover w-full h-full rounded-md"
                style={{ imageRendering: 'auto' }}
                width={80}
                height={80}
                loading="eager"
              />
              <AvatarFallback className="bg-muted text-foreground dark:bg-zinc-800 dark:text-zinc-200 rounded-md">
                {user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-sm font-medium text-foreground leading-tight">
                {user.full_name || user.username}
              </span>
              <span className="text-xs text-muted-foreground leading-tight">
                @{user.username}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-48 p-2">
          <div className="flex flex-col gap-2">
            <div className="px-2 py-1 text-sm">
              <div className="font-medium">{user.full_name || user.username}</div>
              <div className="text-muted-foreground text-xs">{user.email}</div>
            </div>
            <Separator />
            <Link href="/profile">
              <Button variant="ghost" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </Link>
            <Link href="/bookings">
              <Button variant="ghost" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                My Bookings
              </Button>
            </Link>
            <Link href="/favorites">
              <Button variant="ghost" className="w-full justify-start">
                <Heart className="h-4 w-4 mr-2" />
                Favorites
              </Button>
            </Link>
            <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

function MobileUserSection({ user, onLogout, onClose }: { user: any, onLogout: () => void, onClose: () => void }) {
  return (
    <div className="space-y-2">
      <div className="px-3 py-2 bg-muted rounded-md">
        <div className="text-sm font-medium">Hey! {user.username}</div>
        <div className="text-xs text-muted-foreground">{user.email}</div>
      </div>
      <Link href="/profile" onClick={onClose}>
        <Button variant="outline" className="w-full justify-start">
          <User className="h-4 w-4 mr-2" />
          Profile
        </Button>
      </Link>
      <div className="h-2"></div> {/* Added gap */}
      <Button
        variant="destructive"
        className="w-full justify-start"
        onClick={() => { onLogout(); onClose(); }}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
    </div>
  )
}

function AuthPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Account">
          <User className="h-6 w-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-40 p-2">
        <div className="flex flex-col gap-2">
          <Link href="/login">
            <Button variant="outline" className="w-full">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="default" className="w-full">
              Register
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  )
}

