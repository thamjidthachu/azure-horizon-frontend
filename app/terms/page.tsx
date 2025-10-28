import { TrendingHeader } from '@/components/trending-header'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Card, CardContent } from '@/components/ui/card'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Navbar />
      <TrendingHeader />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-black">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 dark:text-white">Terms & Conditions</h1>
          <p className="text-gray-600 dark:text-white">Last updated: January 1, 2024</p>
        </div>

        <Card>
          <CardContent className="p-8 prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="mb-4">
                By booking services at Azure Horizon ("we," "our," or "us"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by the above, please do not use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Booking and Reservations</h2>
              <p className="mb-4">
                All bookings are subject to availability and confirmation by Azure Horizon. We reserve the right to refuse service to anyone for any reason at any time.
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Bookings must be made by guests 18 years or older</li>
                <li>Valid identification is required at check-in</li>
                <li>All rates are quoted in USD and subject to applicable vates</li>
                <li>Special requests are subject to availability and may incur additional charges</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Payment Terms</h2>
              <p className="mb-4">
                Payment is required at the time of booking unless otherwise specified. We accept major credit cards and other payment methods as indicated during the booking process.
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Full payment is due at time of booking for services under $500</li>
                <li>A 50% deposit is required for services over $500, with balance due upon arrival</li>
                <li>Resort fees and vates are additional and will be charged separately</li>
                <li>Currency exchange rates may apply for international payments</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Service Availability</h2>
              <p className="mb-4">
                While we strive to provide all advertised services, availability may be affected by weather conditions, maintenance requirements, or other circumstances beyond our control.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Guest Conduct</h2>
              <p className="mb-4">
                Guests are expected to conduct themselves in a manner that does not disturb other guests or interfere with resort operations. We reserve the right to remove guests who violate our policies.
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Respect for other guests and staff is required at all times</li>
                <li>Damage to resort property will result in additional charges</li>
                <li>Illegal activities are strictly prohibited</li>
                <li>Smoking is only permitted in designated areas</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Health and Safety</h2>
              <p className="mb-4">
                Guests participate in resort activities at their own risk. We recommend consulting with a physician before engaging in physical activities, especially water sports.
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Medical facilities are available on-site for minor issues</li>
                <li>Emergency evacuation insurance is recommended</li>
                <li>Guests with medical conditions should inform staff upon arrival</li>
                <li>Life jackets and safety equipment are provided for water activities</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Privacy and Photography</h2>
              <p className="mb-4">
                Azure Horizon may take photographs or videos of guests for promotional purposes. By staying with us, you consent to such use unless you specifically opt out.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Force Majeure</h2>
              <p className="mb-4">
                Azure Horizon shall not be liable for any failure to perform due to unforeseen circumstances or causes beyond our reasonable control, including but not limited to acts of God, natural disasters, war, terrorism, or government regulations.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
              <p className="mb-4">
                Azure Horizon's liability is limited to the amount paid for services. We are not responsible for indirect, incidental, or consequential damages.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Governing Law</h2>
              <p className="mb-4">
                These terms are governed by the laws of the Republic of Maldives. Any disputes will be resolved through arbitration in accordance with Maldivian law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Contact Information</h2>
              <p className="mb-4">
                If you have any questions about these Terms & Conditions, please contact us at:
              </p>
              <p className="mb-2">Email: legal@azurehorizon.com</p>
              <p className="mb-2">Phone: +960 123-4567</p>
              <p>Address: Al-Reem Island, Abu Dhabi, UAE 00000</p>
            </section>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
