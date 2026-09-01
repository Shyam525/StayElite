"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { DateRange, type RangeKeyDict } from "react-date-range";
import { addDays, differenceInCalendarDays, format, isBefore, startOfDay } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import {
  Bath, BedDouble, CalendarDays, Check, ChevronLeft, ChevronRight, Heart, House,
  Image as ImageIcon, Loader2, MapPin, Minus, Plus, Share2, Sparkles, Star, Users,
  Wifi, X, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createBooking, getListing, previewBooking, type ListingDetail, type ListingReview } from "@/services/listingService";
import { useStayEliteStore } from "@/store/useStayEliteStore";
import { ListingReviews } from "@/components/ListingReviews";
import { ContactHostButton } from "@/components/ContactHostButton";

const amenityNames: Record<number, string> = { 1: "WiFi", 2: "Pool", 3: "Kitchen", 4: "Parking", 5: "AC", 6: "Gym", 7: "Hot Tub", 8: "Pet Friendly", 9: "Workspace" };
const amenityIcons: Record<string, typeof Wifi> = { WiFi: Wifi, Pool: Zap, Kitchen: House, Parking: Check, AC: Zap, Gym: Zap, "Hot Tub": Bath, "Pet Friendly": Check, Workspace: House };
const placeholderImages = ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85", "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=85", "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85", "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=85", "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=85"];

function imageUrl(url: string) {
  return url.startsWith("http") ? url : `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "http://localhost:8080"}${url}`;
}
function money(value: number) { return `$${value.toLocaleString()}`; }
function Skeleton() { return <div className="mx-auto max-w-6xl animate-pulse space-y-7"><div className="h-8 w-2/3 rounded bg-slate-200" /><div className="h-[430px] rounded-3xl bg-slate-200" /><div className="grid gap-8 lg:grid-cols-[1.7fr_0.9fr]"><div className="space-y-5"><div className="h-28 rounded-2xl bg-slate-200" /><div className="h-56 rounded-2xl bg-slate-200" /></div><div className="h-96 rounded-3xl bg-slate-200" /></div></div>; }
function Avatar({ name, src }: { name: string; src?: string }) { return src ? <img src={src} alt={name} className="h-11 w-11 rounded-full object-cover" /> : <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-100 font-semibold text-rose-700">{name?.charAt(0) || "S"}</div>; }

export default function ListingDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: listing, isLoading, isError } = useQuery({ queryKey: ["listing", params.id], queryFn: () => getListing(params.id), enabled: Boolean(params.id) });
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [amenitiesOpen, setAmenitiesOpen] = useState(false);
  const [guests, setGuests] = useState(1);
  const [reserveError, setReserveError] = useState("");
  const [reserving, setReserving] = useState(false);
  const [range, setRange] = useState({ startDate: addDays(new Date(), 7), endDate: addDays(new Date(), 10), key: "selection" });
  const [favorite, setFavorite] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const images = listing?.photoUrls?.length ? listing.photoUrls.map(imageUrl) : placeholderImages;
  const { data: pricing } = useQuery({ queryKey: ["booking-preview", params.id, range.startDate.toISOString(), range.endDate.toISOString(), guests], queryFn: () => previewBooking({ listingId: params.id, checkIn: format(range.startDate, "yyyy-MM-dd"), checkOut: format(range.endDate, "yyyy-MM-dd"), guestsCount: guests }), enabled: Boolean(listing) && guests <= (listing?.maxGuests || 0), retry: false });
  const nights = Math.max(1, differenceInCalendarDays(range.endDate, range.startDate));
  const nightly = Number(listing?.basePricePerNight || 0);
  const cleaning = Number(listing?.cleaningFee || 0);
  const serviceFee = Math.round((nightly * nights + cleaning) * 0.12);
  const total = Number(pricing?.total ?? nightly * nights + cleaning + serviceFee);
  const amenities = listing?.amenities?.length ? listing.amenities : (listing?.amenityIds || []).map((id) => amenityNames[id] || `Amenity ${id}`);
  const reviews = listing?.reviews || [];
  const blocked = new Set(listing?.blockedDates || []);
  const average = Number(listing?.averageRating || 0);

  const onRangeChange = (ranges: RangeKeyDict) => { const selected = ranges.selection; if (selected.startDate && selected.endDate) setRange({ startDate: selected.startDate, endDate: selected.endDate, key: "selection" }); };
  const reserve = async () => {
    setReserving(true); setReserveError("");
    try { const booking = await createBooking({ listingId: params.id, checkIn: format(range.startDate, "yyyy-MM-dd"), checkOut: format(range.endDate, "yyyy-MM-dd"), guestsCount: guests }); router.push(`/bookings/${booking.id}/payment`); }
    catch (error) { setReserveError(error instanceof Error ? error.message : "We couldn't reserve this stay yet."); }
    finally { setReserving(false); }
  };

  if (isLoading) return <Skeleton />;
  if (isError || !listing) return <div className="mx-auto max-w-3xl py-24 text-center"><House className="mx-auto h-10 w-10 text-slate-300" /><h1 className="mt-5 text-2xl font-semibold">This stay is unavailable</h1><p className="mt-2 text-slate-500">We couldn't load this listing right now.</p></div>;

  return <main className="mx-auto max-w-6xl pb-20">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{listing.title}</h1><div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600"><span className="font-semibold text-slate-900"><Star className="mr-1 inline h-4 w-4 fill-slate-900" />{average ? average.toFixed(1) : "New"}</span>{reviews.length > 0 && <><span>·</span><span className="underline">{reviews.length} reviews</span></>}<span>·</span><span>{[listing.city, listing.state, listing.country].filter(Boolean).join(", ")}</span></div></div><div className="flex gap-2"><Button variant="ghost" size="sm" className="rounded-full" onClick={() => navigator.clipboard?.writeText(window.location.href)}><Share2 className="mr-2 h-4 w-4" />Share</Button><Button variant="ghost" size="sm" className="rounded-full" onClick={() => setFavorite(!favorite)}><Heart className={`mr-2 h-4 w-4 ${favorite ? "fill-rose-500 text-rose-500" : ""}`} />{favorite ? "Saved" : "Save"}</Button></div></div>
    <div className="mt-6 grid h-[280px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-3xl sm:h-[440px]"><img src={images[activeImage] || images[0]} alt={listing.title} className="col-span-4 row-span-2 h-full w-full object-cover sm:col-span-2" />{images.slice(1, 5).map((image, index) => <button type="button" key={image} onClick={() => { setActiveImage(index + 1); setGalleryOpen(true); }} className="hidden overflow-hidden sm:block"><img src={image} alt={`${listing.title} ${index + 2}`} className="h-full w-full object-cover transition hover:scale-105" /></button>)}<button type="button" onClick={() => setGalleryOpen(true)} className="absolute ml-4 mt-4 self-end rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-lg sm:ml-[calc(50%-8rem)] sm:mt-[370px]"><ImageIcon className="mr-2 inline h-4 w-4" />Show all photos</button></div>
    <div className="mt-10 grid gap-12 lg:grid-cols-[1.7fr_0.9fr]"><div>
      <div className="flex items-center justify-between border-b border-slate-200 pb-7"><div className="flex items-center gap-4"><Avatar name={listing.hostName || "Host"} /><div><h2 className="text-lg font-semibold">Hosted by {listing.hostName || "your host"}</h2><p className="text-sm text-slate-500">{listing.isSuperhost ? "Superhost · " : ""}Hosting on StayElite</p></div></div>{listing.isSuperhost && <span className="rounded-full bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700">Superhost</span>}</div>
      <div className="grid grid-cols-3 gap-3 border-b border-slate-200 py-7">{([{ Icon: Users, label: `${listing.maxGuests} guests` }, { Icon: BedDouble, label: `${listing.bedrooms} bedrooms` }, { Icon: Bath, label: `${listing.bathrooms} bathrooms` }]).map(({ Icon, label }) => <div key={label} className="flex items-center gap-3 text-sm font-medium text-slate-700"><Icon className="h-5 w-5 text-slate-500" />{label}</div>)}</div>
      {listing.description && <p className="border-b border-slate-200 py-7 leading-7 text-slate-700">{listing.description}</p>}
      <div className="border-b border-slate-200 py-6"><ContactHostButton listingId={listing.id} hostId={listing.hostId} /></div>
      <ListingReviews listingId={params.id} />
      <section className="border-b border-slate-200 py-8"><div className="flex items-center justify-between"><h2 className="text-xl font-semibold">What this place offers</h2>{amenities.length > 6 && <Button variant="outline" className="rounded-full" onClick={() => setAmenitiesOpen(true)}>Show all</Button>}</div><div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">{(amenities.length ? amenities : ["A thoughtfully prepared stay"]).slice(0, 6).map((name) => { const Icon = amenityIcons[name] || Check; return <div key={name} className="flex items-center gap-3 text-sm text-slate-700"><Icon className="h-5 w-5 text-slate-500" />{name}</div>; })}</div></section>
      <section className="border-b border-slate-200 py-8"><h2 className="text-xl font-semibold">Choose your dates</h2><p className="mt-1 text-sm text-slate-500">Add your travel dates for exact pricing.</p><div className="mt-5 overflow-hidden rounded-2xl border border-slate-200"><DateRange ranges={[range]} onChange={onRangeChange} minDate={startOfDay(new Date())} disabledDates={Array.from(blocked).map((date) => new Date(date))} months={2} direction="horizontal" rangeColors={["#f43f5e"]} /></div></section>
      <section className="py-8"><div className="flex items-center justify-between"><h2 className="text-xl font-semibold"><Star className="mr-2 inline h-5 w-5 fill-slate-900" />{average ? average.toFixed(1) : "New"} · {reviews.length} reviews</h2></div>{reviews.length ? <div className="mt-7 grid gap-7 sm:grid-cols-2">{reviews.map((review: ListingReview) => <article key={review.id}><div className="flex items-center gap-3"><Avatar name={review.reviewerName} src={review.reviewerAvatarUrl} /><div><p className="font-semibold">{review.reviewerName}</p><p className="text-xs text-slate-500">{format(new Date(review.createdAt), "MMMM yyyy")}</p></div></div><p className="mt-4 text-sm leading-6 text-slate-700">{review.comment}</p></article>)}</div> : <p className="mt-4 text-sm text-slate-500">Reviews will appear here after your first guests stay.</p>}</section>
    </div><aside className="lg:sticky lg:top-24 lg:h-fit"><div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50"><div className="flex items-baseline justify-between"><p><span className="text-2xl font-semibold">{money(nightly)}</span> <span className="text-sm text-slate-500">night</span></p>{average > 0 && <span className="text-sm font-semibold"><Star className="mr-1 inline h-3.5 w-3.5 fill-slate-900" />{average.toFixed(1)}</span>}</div><div className="mt-5 overflow-hidden rounded-2xl border border-slate-300"><div className="grid grid-cols-2 divide-x divide-slate-300"><div className="p-3"><p className="text-[10px] font-bold uppercase tracking-wider">Check in</p><p className="mt-1 text-sm">{format(range.startDate, "MMM d, yyyy")}</p></div><div className="p-3"><p className="text-[10px] font-bold uppercase tracking-wider">Check out</p><p className="mt-1 text-sm">{format(range.endDate, "MMM d, yyyy")}</p></div></div><DateRange ranges={[range]} onChange={onRangeChange} minDate={startOfDay(new Date())} disabledDates={Array.from(blocked).map((date) => new Date(date))} months={1} direction="vertical" rangeColors={["#f43f5e"]} /></div><div className="mt-3 flex items-center justify-between rounded-2xl border border-slate-300 p-3"><div><p className="text-[10px] font-bold uppercase tracking-wider">Guests</p><p className="mt-1 text-sm">{guests} guest{guests !== 1 ? "s" : ""}</p></div><div className="flex items-center gap-2"><button type="button" disabled={guests <= 1} onClick={() => setGuests(Math.max(1, guests - 1))} className="rounded-full border border-slate-300 p-1.5 disabled:opacity-40"><Minus className="h-3.5 w-3.5" /></button><button type="button" disabled={guests >= listing.maxGuests} onClick={() => setGuests(Math.min(listing.maxGuests, guests + 1))} className="rounded-full border border-slate-300 p-1.5 disabled:opacity-40"><Plus className="h-3.5 w-3.5" /></button></div></div><Button type="button" onClick={reserve} disabled={reserving} className="mt-5 h-12 w-full rounded-full bg-rose-500 text-white hover:bg-rose-600">{reserving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reserve"}</Button><p className="mt-3 text-center text-xs text-slate-500">You won't be charged yet</p>{reserveError && <p className="mt-3 rounded-lg bg-rose-50 p-3 text-xs text-rose-700">{reserveError}</p>}<div className="mt-6 space-y-3 border-t border-slate-200 pt-5 text-sm"><div className="flex justify-between"><span className="underline">{money(nightly)} × {nights} nights</span><span>{money(nightly * nights)}</span></div><div className="flex justify-between"><span className="underline">Cleaning fee</span><span>{money(cleaning)}</span></div><div className="flex justify-between"><span className="underline">Service fee</span><span>{money(serviceFee)}</span></div><div className="flex justify-between border-t border-slate-200 pt-4 font-semibold"><span>Total</span><span>{money(total)}</span></div></div></div><p className="mt-4 flex justify-center gap-2 text-xs text-slate-500"><Sparkles className="h-3.5 w-3.5" />Your booking is protected by StayElite</p></aside></div>
    {galleryOpen && <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/95 p-5 text-white sm:p-10"><div className="mx-auto flex max-w-6xl items-center justify-between"><p className="font-semibold">{listing.title}</p><button type="button" onClick={() => setGalleryOpen(false)} className="rounded-full p-2 hover:bg-white/10"><X /></button></div><div className="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-2">{images.map((image, index) => <img key={image} src={image} alt={`${listing.title} photo ${index + 1}`} className="w-full rounded-2xl object-cover sm:first:col-span-2 sm:first:max-h-[580px]" />)}</div></div>}
    {amenitiesOpen && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4"><div className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl"><div className="flex items-center justify-between"><h2 className="text-xl font-semibold">What this place offers</h2><button type="button" onClick={() => setAmenitiesOpen(false)}><X /></button></div><div className="mt-6 grid grid-cols-2 gap-5">{amenities.map((name) => <div key={name} className="flex items-center gap-3 text-sm"><Check className="h-4 w-4 text-rose-500" />{name}</div>)}</div></div></div>}
  </main>;
}
