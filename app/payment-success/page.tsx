
"use client";


import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BookingAPIService } from "@/lib/booking-api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";


import dynamic from "next/dynamic";
const Confetti = dynamic(() => import("react-confetti"), { ssr: false });


import { Navbar } from "@/components/navbar";


import { Suspense } from "react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const bookingNumber = searchParams.get("booking_number");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    async function verify() {
      if (!sessionId) {
        setError("Missing session ID");
        setLoading(false);
        return;
      }
      try {
        // @ts-ignore: Accepts bookingNumber as optional second arg
        const res = await BookingAPIService.verifyPayment(sessionId, bookingNumber);
        let data: any = res;
        if (res && typeof res === 'object') {
          if ('booking' in res && res.booking) {
            data = res.booking;
          } else if ('booking_number' in res) {
            data = res;
          }
        }
        if (
          data &&
          data.booking_number &&
          (data.payment_status === "paid" || data.booking_payment_status === "paid")
        ) {
          setDetails(data);
        } else {
          setError("Payment not completed or booking not found.");
        }
      } catch (err: any) {
        setError(err.message || "Verification failed");
      } finally {
        setLoading(false);
      }
    }
    verify();
  }, [sessionId, bookingNumber]);

  return (
    <Card className="p-0 md:p-0 shadow border border-border">
      {loading ? (
        <div className="flex flex-col items-center py-16">
          <svg className="animate-spin mb-4 text-primary" width="48" height="48" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
          <span className="text-lg font-medium text-gray-700">Verifying payment...</span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center py-16">
          <svg width="64" height="64" fill="none" viewBox="0 0 24 24" className="mb-4 text-red-500"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          <div className="text-red-600 text-center py-8 text-lg font-semibold">{error}</div>
        </div>
      ) : details ? (
        <div className="p-6 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-6 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Thank you for your booking!</h1>
              <div className="text-base md:text-lg text-muted-foreground">Your booking <span className="font-semibold text-primary">#{details.booking_number}</span> is confirmed.</div>
              <div className="text-base text-muted-foreground mt-1">A confirmation email has been sent to <span className="font-medium text-foreground">{details.customer_email}</span>.</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <svg width="56" height="56" fill="none" viewBox="0 0 24 24" className="text-primary"><circle cx="12" cy="12" r="10" fill="#2563eb" opacity="0.15"/><path d="M8 12.5l2.5 2.5L16 9.5" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex flex-col gap-2">
              <div className="font-semibold text-foreground flex items-center gap-2"><span>Booking Details</span></div>
              <div className="text-sm text-muted-foreground">Booking #: <span className="font-medium text-foreground">{details.booking_number}</span></div>
              <div className="text-sm text-muted-foreground">Status: <Badge>{details.booking_status}</Badge></div>
              <div className="text-sm text-muted-foreground">Payment: <Badge>{details.payment_status}</Badge></div>
              <div className="text-sm text-muted-foreground">Guest Email: <span className="font-medium text-foreground">{details.customer_email}</span></div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="font-semibold text-foreground flex items-center gap-2"><span>Need Help?</span></div>
              <div className="text-sm text-muted-foreground flex items-center gap-2"><span>📞</span> <span>+1 (888) 232-4535</span></div>
              <div className="text-sm text-muted-foreground flex items-center gap-2"><span>✉️</span> <a href="mailto:support@azurehorizon.com" className="underline hover:text-primary">Email Us</a></div>
              <div className="text-sm text-muted-foreground flex items-center gap-2"><span>💬</span> <a href="/contact" className="underline hover:text-primary">Chat With Us</a></div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:justify-between items-center gap-2 text-xs text-muted-foreground border-t border-border pt-4">
            <div>Need to cancel or change your booking? <a href="/profile" className="underline hover:text-primary">Manage your bookings</a>.</div>
            <div>Print or save this page for your records.</div>
          </div>
        </div>
      ) : null}
    </Card>
  );
}

export default function PaymentSuccessPage() {
  return (
    <>
      <Navbar />
      <main className="bg-background min-h-[80vh] py-8 px-2 md:px-0">
        <div className="max-w-3xl mx-auto">
          <Suspense fallback={<div className="flex flex-col items-center py-16"><span className="text-lg font-medium text-gray-700">Loading...</span></div>}>
            <PaymentSuccessContent />
          </Suspense>
        </div>
      </main>
    </>
  );
}
