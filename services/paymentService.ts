import api from "@/lib/axios";

export type PaymentIntent = { clientSecret: string; paymentIntentId: string; currency: string };

export async function createPaymentIntent(bookingId: string): Promise<PaymentIntent> {
  const response = await api.post("/payments/create-intent", { bookingId });
  return response.data?.data ?? response.data;
}
