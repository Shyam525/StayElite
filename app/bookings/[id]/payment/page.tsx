"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CheckCircle2, Loader2, LockKeyhole, Sparkles } from "lucide-react";
import { createPaymentIntent } from "@/services/paymentService";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

function PaymentForm({ bookingId }: { bookingId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError("");
    const result = await stripe.confirmPayment({ elements, redirect: "if_required" });
    if (result.error) {
      setError(result.error.message || "Payment could not be completed.");
    } else {
      router.push("/trips?booking=confirmed");
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={submit} className="mt-7">
      <PaymentElement options={{ layout: "tabs" }} />
      <button
        type="submit"
        disabled={!stripe || !elements || submitting}
        className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#FF385C] font-semibold text-white hover:bg-[#e42d4d] transition disabled:opacity-60 shadow-md"
      >
        {submitting ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            Pay securely <LockKeyhole className="h-4 w-4" />
          </>
        )}
      </button>
      {error && <p className="mt-4 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 font-medium">{error}</p>}
      <p className="mt-4 text-center text-xs text-slate-500">
        Your payment is secured by Stripe. You will be redirected after payment.
      </p>
    </form>
  );
}

function DemoPaymentForm({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleDemoConfirm = () => {
    setSubmitting(true);
    setTimeout(() => {
      router.push("/trips?booking=confirmed");
    }, 800);
  };

  return (
    <div className="mt-7 space-y-4 text-center">
      <div className="rounded-2xl bg-amber-50 p-4 text-xs font-semibold text-amber-800 border border-amber-200">
        ⚡ Demo Payment Mode Active (Stripe key not configured)
      </div>
      <p className="text-xs text-slate-500">
        Click below to simulate instant payment confirmation for booking #{bookingId.slice(0, 8)}.
      </p>
      <button
        type="button"
        onClick={handleDemoConfirm}
        disabled={submitting}
        className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#FF385C] font-bold text-white hover:bg-[#e42d4d] transition shadow-md"
      >
        {submitting ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <Sparkles className="h-4 w-4" /> Complete Booking (Demo)
          </>
        )}
      </button>
    </div>
  );
}

function PaymentPageContent() {
  const { id } = useParams<{ id: string }>();
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (publishableKey) {
      void createPaymentIntent(id)
        .then((payment) => setClientSecret(payment.clientSecret))
        .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Could not initialize payment."));
    }
  }, [id]);

  return (
    <main className="mx-auto max-w-lg px-4 py-12 pb-20">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-emerald-50 p-2.5 text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#FF385C]">One last step</p>
            <h1 className="mt-0.5 text-2xl font-extrabold text-slate-900">Confirm your booking</h1>
          </div>
        </div>

        {!publishableKey ? (
          <DemoPaymentForm bookingId={id} />
        ) : error ? (
          <div className="mt-6 text-center">
            <p className="text-xs text-rose-600 font-semibold mb-4">{error}</p>
            <DemoPaymentForm bookingId={id} />
          </div>
        ) : clientSecret && stripePromise ? (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "stripe",
                variables: { colorPrimary: "#FF385C", borderRadius: "12px" },
              },
            }}
          >
            <PaymentForm bookingId={id} />
          </Elements>
        ) : (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-[#FF385C]" />
          </div>
        )}
      </div>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-xs text-slate-500">
          <Loader2 className="mr-2 h-5 w-5 animate-spin text-[#FF385C] inline" /> Loading payment...
        </div>
      }
    >
      <PaymentPageContent />
    </Suspense>
  );
}
