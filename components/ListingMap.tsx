"use client";

import { useMemo, useState } from "react";
import Map, { Marker, Popup, NavigationControl, type ViewStateChangeEvent } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import type { ListingDetail } from "@/services/listingService";
import type { MapBounds } from "@/store/searchFilterStore";

const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
function imageUrl(url?: string) { return url?.startsWith("http") ? url : url ? `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "http://localhost:8080"}${url}` : "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=320&q=75"; }

export function ListingMap({ listings, hoveredId, onBoundsChange, onAreaSearch, hasMoved }: { listings: ListingDetail[]; hoveredId?: string; onBoundsChange: (bounds: MapBounds) => void; onAreaSearch: () => void; hasMoved: boolean }) {
  const [selected, setSelected] = useState<ListingDetail | null>(null);
  const center = useMemo(() => { const positioned = listings.filter((listing) => listing.latitude != null && listing.longitude != null); return positioned[0] ? { latitude: Number(positioned[0].latitude), longitude: Number(positioned[0].longitude) } : { latitude: 39.5, longitude: -98.35 }; }, [listings]);
  if (!token) return <div className="flex h-full min-h-[560px] items-center justify-center bg-slate-100 p-8 text-center text-sm text-slate-500">Add NEXT_PUBLIC_MAPBOX_TOKEN to display the live map.</div>;
  const moved = (event: ViewStateChangeEvent) => { const bounds = event.target.getBounds(); if (!bounds) return; onBoundsChange({ swLat: bounds.getSouth(), swLng: bounds.getWest(), neLat: bounds.getNorth(), neLng: bounds.getEast() }); };
  return <div className="relative h-full min-h-[560px] overflow-hidden rounded-3xl bg-slate-100"><Map mapboxAccessToken={token} initialViewState={{ ...center, zoom: 3.2 }} mapStyle="mapbox://styles/mapbox/light-v11" onMoveEnd={moved} scrollZoom={false}><NavigationControl position="bottom-right" />{listings.filter((listing) => listing.latitude != null && listing.longitude != null).map((listing) => <Marker key={listing.id} latitude={Number(listing.latitude)} longitude={Number(listing.longitude)} anchor="bottom"><button type="button" onClick={() => setSelected(listing)} className={`rounded-full border-2 px-3 py-1.5 text-xs font-bold shadow-md transition ${hoveredId === listing.id ? "scale-125 border-slate-950 bg-slate-950 text-white" : "border-white bg-white text-slate-900 hover:scale-110"}`}>${Number(listing.basePricePerNight || 0).toLocaleString()}</button></Marker>)}{selected && selected.latitude != null && selected.longitude != null && <Popup latitude={Number(selected.latitude)} longitude={Number(selected.longitude)} anchor="top" closeOnClick={false} onClose={() => setSelected(null)}><div className="w-52"><img src={imageUrl(selected.photoUrls?.[0])} alt={selected.title} className="h-24 w-full rounded-lg object-cover" /><p className="mt-2 font-semibold">{selected.title}</p><p className="text-xs text-slate-500">{selected.city}, {selected.country}</p><p className="mt-1 text-sm font-bold">${Number(selected.basePricePerNight || 0).toLocaleString()} night</p></div></Popup>}</Map>{hasMoved && <button type="button" onClick={onAreaSearch} className="absolute left-1/2 top-5 -translate-x-1/2 rounded-full bg-slate-950 px-4 py-2 text-xs font-bold text-white shadow-xl">Search this area</button>}</div>;
}
