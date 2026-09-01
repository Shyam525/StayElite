"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Star, X } from "lucide-react";
import { createReview } from "@/services/listingService";

const schema = z.object({
  overallRating: z.number().min(1, "Select a rating").max(5),
  cleanlinessRating: z.number().min(1, "Select a rating").max(5),
  locationRating: z.number().min(1, "Select a rating").max(5),
  valueRating: z.number().min(1, "Select a rating").max(5),
  comment: z.string().trim().min(20, "Please write at least 20 characters").max(1000, "Keep your review under 1000 characters"),
});
type FormValues = z.infer<typeof schema>;
const ratings = [["overallRating", "Overall"], ["cleanlinessRating", "Cleanliness"], ["locationRating", "Location"], ["valueRating", "Value"]] as const;

export function ReviewModal({ bookingId, listingTitle, onClose, onSuccess }: { bookingId: string; listingTitle: string; onClose: () => void; onSuccess: () => void }) {
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { register, setValue, watch, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { overallRating: 0, cleanlinessRating: 0, locationRating: 0, valueRating: 0, comment: "" }, mode: "onTouched" });
  const values = watch();
  const submit = async (data: FormValues) => { setSubmitting(true); setSubmitError(""); try { await createReview({ bookingId, ...data }); onSuccess(); } catch (error) { setSubmitError(error instanceof Error ? error.message : "Could not submit your review."); } finally { setSubmitting(false); } };
  return <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/50 p-0 sm:items-center sm:p-4"><div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl sm:p-8"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-rose-600">Share your stay</p><h2 className="mt-2 text-2xl font-semibold">How was {listingTitle}?</h2></div><button type="button" onClick={onClose} aria-label="Close review modal"><X /></button></div><form onSubmit={handleSubmit(submit)} className="mt-7 space-y-5">{ratings.map(([field, label]) => <fieldset key={field}><legend className="text-sm font-semibold">{label}</legend><div className="mt-2 flex gap-1">{[1, 2, 3, 4, 5].map((rating) => <button type="button" key={rating} onClick={() => setValue(field, rating, { shouldValidate: true })} aria-label={`${label}: ${rating} stars`} className="rounded-lg p-1 transition hover:bg-rose-50"><Star className={`h-7 w-7 ${values[field] >= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} /></button>)}</div><p className="mt-1 text-xs text-rose-600">{errors[field]?.message}</p></fieldset>)}<label className="block text-sm font-semibold">Your review<textarea {...register("comment")} maxLength={1000} rows={5} placeholder="What should future guests know?" className="mt-2 w-full resize-none rounded-xl border border-slate-200 p-3 font-normal outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10" /><span className="mt-1 block text-right text-xs font-normal text-slate-400">{values.comment.length}/1000</span><p className="text-xs font-normal text-rose-600">{errors.comment?.message}</p></label>{submitError && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{submitError}</p>}<button type="submit" disabled={submitting} className="flex h-12 w-full items-center justify-center rounded-full bg-rose-500 font-semibold text-white hover:bg-rose-600 disabled:opacity-60">{submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Publish review"}</button></form></div></div>;
}
