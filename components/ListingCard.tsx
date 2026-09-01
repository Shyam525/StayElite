"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Heart, Star } from "lucide-react";
import type { ListingDetail } from "@/services/listingService";

const fallback = ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80", "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80"];
export function ListingCard({ listing }: { listing: ListingDetail }) {
  const [index, setIndex] = useState(0);
  const [saved, setSaved] = useState(false);
  const images = listing.photoUrls?.length ? listing.photoUrls : fallback;
  const image = images[index % images.length];
  const src = image.startsWith("http") ? image : `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "http://localhost:8080"}${image}`;
  return <article className="group min-w-0"><div className="relative aspect-[1.03] overflow-hidden rounded-2xl bg-slate-100"><Link href={`/listings/${listing.id}`} aria-label={`View ${listing.title}`}><img src={src} alt={listing.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /></Link><button type="button" onClick={() => setSaved(!saved)} aria-label={saved ? "Remove from wishlist" : "Add to wishlist"} className="absolute right-3 top-3 rounded-full p-2 text-white drop-shadow-lg transition hover:scale-110"><Heart className={`h-5 w-5 ${saved ? "fill-rose-500 text-rose-500" : "fill-black/20"}`} /></button>{listing.averageRating && listing.averageRating > 4.8 && <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-800 shadow-sm">Guest favorite</span>}{images.length > 1 && <><button type="button" onClick={() => setIndex((index - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 rounded-full bg-white/90 p-1.5 opacity-0 shadow transition group-hover:opacity-100"><ChevronLeft className="h-4 w-4" /></button><button type="button" onClick={() => setIndex((index + 1) % images.length)} className="absolute right-3 top-1/2 rounded-full bg-white/90 p-1.5 opacity-0 shadow transition group-hover:opacity-100"><ChevronRight className="h-4 w-4" /></button></>}</div><Link href={`/listings/${listing.id}`} className="block pt-3"><div className="flex justify-between gap-2"><p className="truncate font-semibold text-slate-900">{[listing.city, listing.country].filter(Boolean).join(", ") || "StayElite home"}</p>{listing.averageRating ? <span className="flex shrink-0 items-center gap-1 text-sm"><Star className="h-3.5 w-3.5 fill-slate-900" />{listing.averageRating.toFixed(1)}</span> : null}</div><p className="mt-1 truncate text-sm text-slate-500">{listing.propertyType || "Private stay"} · {listing.bedrooms} bedrooms</p><p className="mt-2 text-sm text-slate-700"><strong className="font-bold text-slate-950">${Number(listing.basePricePerNight || 0).toLocaleString()}</strong> night</p></Link></article>;
}
export function ListingSkeleton() { return <div className="animate-pulse"><div className="aspect-[1.03] rounded-2xl bg-slate-200" /><div className="mt-3 h-4 w-3/4 rounded bg-slate-200" /><div className="mt-2 h-3 w-1/2 rounded bg-slate-200" /><div className="mt-3 h-4 w-1/3 rounded bg-slate-200" /></div>; }
