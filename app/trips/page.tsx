"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Loader2, MapPin, Star, Clock, CheckCircle2, XCircle } from "lucide-react";
import { getMyBookings, type BookingListItem } from "@/services/listingService";
import { ReviewModal } from "@/components/ReviewModal";

export default function TripsPage() {
  const [reviewBooking, setReviewBooking] = useState<BookingListItem | null>(null);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"ALL" | "UPCOMING" | "COMPLETED">("ALL");

  const { data: bookings, isLoading, isError, refetch } = useQuery({
    queryKey: ["my-bookings", activeTab],
    queryFn: () => getMyBookings(activeTab === "ALL" ? undefined : activeTab),
  });

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("booking") === "confirmed") {
      setSuccess(true);
    }
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
            <CheckCircle2 className="h-3.5 w-3.5" /> Confirmed
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
            <Clock className="h-3.5 w-3.5" /> Pending Host Approval
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700">
            <XCircle className="h-3.5 w-3.5" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
            Completed
          </span>
        );
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 pb-20 sm:px-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF385C]">Your journey</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">Trips</h1>
        <p className="mt-1.5 text-sm text-slate-500">Relive your stays and share what made them special.</p>
      </div>

      {success && (
        <div className="mt-6 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-800 border border-emerald-200">
          🎉 Booking confirmed! Your trip is all set.
        </div>
      )}

      {/* Tabs */}
      <div className="mt-6 flex items-center gap-3 border-b border-slate-100 pb-3">
        {[
          { id: "ALL", label: "All Stays" },
          { id: "UPCOMING", label: "Upcoming Stays" },
          { id: "COMPLETED", label: "Completed Stays" },
        ].map((tab) => (
          <button
            type="button"
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`rounded-full px-4 py-2 text-xs font-bold transition ${
              activeTab === tab.id
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="mt-8 flex items-center gap-2 text-xs text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin text-[#FF385C]" /> Loading your trips...
        </div>
      )}

      {/* Error state */}
      {isError && (
        <p className="mt-8 rounded-2xl bg-rose-50 p-4 text-xs font-semibold text-rose-700">
          We couldn&apos;t load your trips right now.
        </p>
      )}

      {/* Empty state */}
      {!isLoading && !isError && (!bookings || bookings.length === 0) && (
        <div className="mt-10 rounded-3xl border border-dashed border-slate-300 p-12 text-center bg-slate-50/50">
          <MapPin className="mx-auto h-10 w-10 text-slate-300 mb-2" />
          <h2 className="text-base font-bold text-slate-900">No trips found</h2>
          <p className="mt-1 text-xs text-slate-500">Your booked stays will appear here.</p>
        </div>
      )}

      {/* Bookings List */}
      <div className="mt-8 space-y-4">
        {bookings?.map((booking) => (
          <article
            key={booking.id}
            className="flex flex-col justify-between gap-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs transition hover:shadow-md sm:flex-row sm:items-center"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <h2 className="font-bold text-slate-900 text-base">{booking.listingTitle}</h2>
                {getStatusBadge(booking.status)}
              </div>
              <p className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                <CalendarDays className="h-4 w-4 text-slate-400" /> {booking.checkIn} to {booking.checkOut}
              </p>
              <p className="text-xs text-slate-500">Hosted by {booking.hostName || "Host"}</p>
            </div>

            {booking.status === "COMPLETED" && (
              <button
                type="button"
                onClick={() => setReviewBooking(booking)}
                className="flex h-10 items-center justify-center gap-2 rounded-full border border-slate-900 px-5 text-xs font-bold text-slate-900 hover:bg-slate-900 hover:text-white transition"
              >
                <Star className="h-4 w-4" /> Write a review
              </button>
            )}
          </article>
        ))}
      </div>

      {reviewBooking && (
        <ReviewModal
          bookingId={reviewBooking.id}
          listingTitle={reviewBooking.listingTitle}
          onClose={() => setReviewBooking(null)}
          onSuccess={() => {
            setReviewBooking(null);
            setSuccess(true);
            void refetch();
          }}
        />
      )}
    </main>
  );
}
