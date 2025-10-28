import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-teal-400 mb-4">Azure Horizon</h3>
            <p className="text-gray-300 mb-4">
              Discover harmony and elegance at Azure Horizon.
              From peaceful retreats surrounded by nature to indulgent luxury experiences, every moment is designed to refresh your soul.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer"/>
              <Twitter className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer"/>
              <Instagram className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer"/>
              <Youtube className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer"/>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><Link href="/services" className="text-gray-300 hover:text-white">Services</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
              <li><Link href="/cart" className="text-gray-300 hover:text-white">My Bookings</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-300">
                <MapPin className="h-4 w-4 mr-2"/>
                Al Reem Island, Abu Dhabi, UAE
              </li>
              <li className="flex items-center text-gray-300">
                <Phone className="h-4 w-4 mr-2"/>
                +971 527627117
              </li>
              <li className="flex items-center text-gray-300">
                <Mail className="h-4 w-4 mr-2"/>
                info@azurehorizon.com
              </li>
            </ul>
            <div className="mt-4">
              <h5 className="font-semibold mb-2">Legal</h5>
              <ul className="space-y-1">
                <li><Link href="/terms" className="text-gray-300 hover:text-white text-sm">Terms & Conditions</Link></li>
                <li><Link href="/cancellation" className="text-gray-300 hover:text-white text-sm">Cancellation Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 Azure Horizon. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
