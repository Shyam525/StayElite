"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CheckCircle2, Loader2, LockKeyhole } from "lucide-react";
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
    setSubmitting(true); setError("");
    const result = await stripe.confirmPayment({ elements, redirect: "if_required" });
    if (result.error) setError(result.error.message || "Payment could not be completed.");
    else router.push("/trips?booking=confirmed");
    setSubmitting(false);
  };
  return <form onSubmit={submit} className="mt-7"><PaymentElement options={{ layout: "tabs" }} /><button type="submit" disabled={!stripe || !elements || submitting} className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-rose-500 font-semibold text-white hover:bg-rose-600 disabled:opacity-60">{submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Pay securely <LockKeyhole className="h-4 w-4" /></>}</button>{error && <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}<p className="mt-4 text-center text-xs text-slate-500">Your payment is secured by Stripe. You will be redirected after payment.</p></form>;
}

function PaymentPageContent() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");
  useEffect(() => { void createPaymentIntent(id).then((payment) => setClientSecret(payment.clientSecret)).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Could not initialize payment.")); }, [id]);
  if (!publishableKey) return <div className="mx-auto max-w-lg py-20 text-center"><h1 className="text-2xl font-semibold">Stripe is not configured</h1><p className="mt-2 text-sm text-slate-500">Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to .env.local to enable payments.</p></div>;
  if (error) return <div className="mx-auto max-w-lg py-20 text-center"><h1 className="text-2xl font-semibold">Payment unavailable</h1><p className="mt-2 text-sm text-rose-600">{error}</p></div>;
  return <main className="mx-auto max-w-lg pb-16"><div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8"><div className="flex items-center gap-3"><span className="rounded-full bg-emerald-50 p-2 text-emerald-600"><CheckCircle2 className="h-5 w-5" /></span><div><p className="text-xs font-bold uppercase tracking-widest text-rose-600">One last step</p><h1 className="mt-1 text-2xl font-semibold">Confirm your booking</h1></div></div>{clientSecret && stripePromise ? <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "stripe", variables: { colorPrimary: "#f43f5e", borderRadius: "12px" } } }}><PaymentForm bookingId={id} /></Elements> : <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>}</div></main>;
}

export default function PaymentPage() { return <Suspense fallback={<div className="py-20 text-center text-slate-500">Loading payment...</div>}><PaymentPageContent /></Suspense>; }
