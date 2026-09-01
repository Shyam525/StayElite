"use client";

import { useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Anchor, ArrowLeft, ArrowRight, Bath, BedDouble, Building2, Check,
  CircleDollarSign, Coffee, Dumbbell, Home, ImagePlus, KeyRound, Loader2, MapPin,
  Minus, Mountain, ParkingCircle, PawPrint, Plus, Send, Sparkles, Trees, Trash2,
  UserRound, Utensils, Waves, Wifi, Wind,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createListing, uploadListingPhotos } from "@/services/listingService";
import { initialListingDraft, type ListingDraft, type ListingPhotoDraft, type PropertyType, useListingDraftStore } from "@/store/listingDraftStore";

const propertyTypes: { label: PropertyType; icon: typeof Home; tint: string }[] = [
  { label: "Apartment", icon: Building2, tint: "bg-rose-50 text-rose-600" },
  { label: "House", icon: Home, tint: "bg-amber-50 text-amber-700" },
  { label: "Villa", icon: KeyRound, tint: "bg-sky-50 text-sky-700" },
  { label: "Cabin", icon: Mountain, tint: "bg-emerald-50 text-emerald-700" },
  { label: "Studio", icon: Coffee, tint: "bg-violet-50 text-violet-700" },
  { label: "Loft", icon: Wind, tint: "bg-orange-50 text-orange-700" },
  { label: "Treehouse", icon: Trees, tint: "bg-lime-50 text-lime-700" },
  { label: "Boat", icon: Anchor, tint: "bg-cyan-50 text-cyan-700" },
];

const amenities = [
  ["WiFi", Wifi], ["Pool", Waves], ["Kitchen", Utensils], ["Parking", ParkingCircle],
  ["AC", Wind], ["Gym", Dumbbell], ["Hot Tub", Bath], ["Pet Friendly", PawPrint], ["Workspace", Coffee],
] as const;

const schemas = [
  z.object({ propertyType: z.string().min(1, "Choose a property type") }),
  z.object({ country: z.string().min(1, "Choose a country"), address: z.string().min(3, "Enter a street address"), city: z.string().min(2, "Enter a city"), state: z.string().min(2, "Enter a state or region") }),
  z.object({ maxGuests: z.number().min(1), bedrooms: z.number().min(0), bathrooms: z.number().min(0.5) }),
  z.object({ amenities: z.array(z.string()) }),
  z.object({ photos: z.array(z.object({ id: z.string(), name: z.string(), preview: z.string() })).min(3, "Add at least 3 photos") }),
  z.object({ title: z.string().min(10, "Add a title of at least 10 characters").max(50), description: z.string().min(20, "Add a little more detail").max(500) }),
  z.object({ basePricePerNight: z.number().min(1, "Enter a nightly price"), cleaningFee: z.number().min(0) }),
  z.object({ propertyType: z.string().min(1), country: z.string().min(1), address: z.string().min(1), title: z.string().min(1) }),
] as const;

type FormValues = ListingDraft;

const stepMeta = [
  ["01", "The essentials", "What kind of place are you sharing?"],
  ["02", "Set the scene", "Where should guests find you?"],
  ["03", "Make room", "Tell guests about the space."],
  ["04", "Add the details", "Small touches make a big difference."],
  ["05", "Show, don't tell", "Add at least three photos to bring it to life."],
  ["06", "Give it a voice", "A great title earns the click."],
  ["07", "Name your price", "Keep it clear and competitive."],
  ["08", "One last look", "Check everything before you publish."],
] as const;

function FieldError({ message }: { message?: string }) {
  return message ? <p className="mt-1 text-xs font-medium text-rose-600">{message}</p> : null;
}

export default function CreateListingPage() {
  const router = useRouter();
  const { draft, updateDraft, resetDraft } = useListingDraftStore();
  const [step, setStep] = useState(0);
  const [geocoding, setGeocoding] = useState(false);
  const [geoMessage, setGeoMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(schemas[step] as never) as unknown as Resolver<FormValues>,
    defaultValues: draft,
    mode: "onTouched",
  });
  const { register, setValue, watch, trigger, formState: { errors } } = form;
  const watched = watch();

  useEffect(() => {
    form.reset(draft);
  }, [draft, form]);

  const total = useMemo(() => (draft.basePricePerNight * 3) + draft.cleaningFee, [draft.basePricePerNight, draft.cleaningFee]);
  const mapCenter = draft.latitude && draft.longitude ? `${draft.latitude},${draft.longitude}` : "20,0";
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${draft.longitude ? draft.longitude - 0.08 : -10}%2C${draft.latitude ? draft.latitude - 0.05 : -10}%2C${draft.longitude ? draft.longitude + 0.08 : 10}%2C${draft.latitude ? draft.latitude + 0.05 : 10}&layer=mapnik&marker=${mapCenter}`;

  const sync = (updates: Partial<ListingDraft>) => {
    Object.entries(updates).forEach(([key, value]) => setValue(key as keyof FormValues, value as never, { shouldDirty: true }));
    updateDraft(updates);
  };

  const geocode = async () => {
    const query = [draft.address, draft.city, draft.state, draft.country].filter(Boolean).join(", ");
    if (!query) return;
    setGeocoding(true);
    setGeoMessage("");
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(query)}`);
      const results = await response.json() as { lat: string; lon: string; display_name: string }[];
      if (!results[0]) throw new Error("We couldn't find that address.");
      sync({ latitude: Number(results[0].lat), longitude: Number(results[0].lon) });
      setGeoMessage("Location pinned");
    } catch (error) {
      setGeoMessage(error instanceof Error ? error.message : "Could not find that address.");
    } finally {
      setGeocoding(false);
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    const nextFiles = [...files, ...acceptedFiles].slice(0, 12);
    setFiles(nextFiles);
    const newPhotos: ListingPhotoDraft[] = await Promise.all(acceptedFiles.slice(0, 12 - files.length).map(async (file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random()}`,
      name: file.name,
      preview: await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.readAsDataURL(file);
      }),
    })));
    sync({ photos: [...draft.photos, ...newPhotos].slice(0, 12) });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] }, maxSize: 10 * 1024 * 1024 });

  const removePhoto = (id: string) => {
    const index = draft.photos.findIndex((photo) => photo.id === id);
    sync({ photos: draft.photos.filter((photo) => photo.id !== id) });
    setFiles(files.filter((_, fileIndex) => fileIndex !== index));
  };

  const next = async () => {
    const valid = await trigger();
    if (!valid) return;
    if (step === 7) return submit();
    setStep((current) => current + 1);
  };

  const submit = async () => {
    setSubmitting(true);
    setSubmitError("");
    try {
      const created = await createListing({
        country: draft.country,
        address: draft.address,
        city: draft.city,
        state: draft.state,
        title: draft.title,
        description: draft.description,
        maxGuests: draft.maxGuests,
        bedrooms: draft.bedrooms,
        bathrooms: draft.bathrooms,
        basePricePerNight: draft.basePricePerNight,
        cleaningFee: draft.cleaningFee,
        propertyType: draft.propertyType.toUpperCase(),
        lat: draft.latitude,
        lng: draft.longitude,
        amenityIds: [],
      });
      const listingId = created?.id;
      if (listingId && files.length) await uploadListingPhotos(listingId, files);
      resetDraft();
      router.push("/host/listings?created=1");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "We couldn't publish your listing. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    if (step === 0) return <section><p className="eyebrow">Start with the shape</p><div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">{propertyTypes.map(({ label, icon: Icon, tint }) => <button key={label} type="button" onClick={() => sync({ propertyType: label })} className={`group min-h-32 rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-lg ${draft.propertyType === label ? "border-slate-950 bg-slate-950 text-white shadow-xl" : "border-slate-200 bg-white"}`}><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${draft.propertyType === label ? "bg-white/15 text-white" : tint}`}><Icon className="h-5 w-5" /></span><span className="mt-7 block text-sm font-semibold">{label}</span></button>)}</div><FieldError message={errors.propertyType?.message as string} /></section>;
    if (step === 1) return <section><p className="eyebrow">A pin guests can trust</p><div className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]"><div className="space-y-4">{(["country", "address", "city", "state"] as const).map((field) => <label key={field} className="field-label"><span>{field === "address" ? "Street address" : field[0].toUpperCase() + field.slice(1)}</span>{field === "country" ? <select {...register(field)} onChange={(event) => sync({ [field]: event.target.value })} className="field-input"><option>United States</option><option>Canada</option><option>United Kingdom</option><option>Australia</option><option>France</option><option>Italy</option><option>Spain</option><option>Japan</option></select> : <input {...register(field)} onBlur={() => sync({ [field]: watched[field] })} placeholder={field === "address" ? "123 Ocean View Road" : field === "city" ? "San Francisco" : "California"} className="field-input" />}{<FieldError message={errors[field]?.message as string} />}</label>)}<Button type="button" variant="outline" onClick={geocode} disabled={geocoding} className="mt-2 w-full"><MapPin className="mr-2 h-4 w-4" />{geocoding ? "Finding your pin..." : "Pin this address"}</Button>{geoMessage && <p className="text-xs font-medium text-emerald-700">{geoMessage}</p>}</div><div className="relative min-h-[340px] overflow-hidden rounded-3xl border border-slate-200 bg-slate-100"><iframe title="Listing location map" src={mapUrl} className="absolute inset-0 h-full w-full border-0" loading="lazy" /><div className="pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm"><MapPin className="mr-1 inline h-3.5 w-3.5 text-rose-600" />{draft.latitude ? "Address pinned" : "Map preview"}</div></div></div></section>;
    if (step === 2) return <section><p className="eyebrow">Comfort, counted</p><div className="mt-8 divide-y divide-slate-200 rounded-3xl border border-slate-200 bg-white px-5">{([["maxGuests", "Max guests", "How many people can stay?", "UserRound"], ["bedrooms", "Bedrooms", "Private sleeping spaces", "BedDouble"], ["bathrooms", "Bathrooms", "Include half baths", "Bath"]] as const).map(([field, label, hint, icon]) => { const Icon = icon === "BedDouble" ? BedDouble : icon === "Bath" ? Bath : KeyRound; return <div key={field} className="flex items-center justify-between gap-4 py-6"><div className="flex items-center gap-4"><span className="rounded-2xl bg-slate-100 p-3 text-slate-700"><Icon className="h-5 w-5" /></span><div><p className="font-semibold">{label}</p><p className="text-sm text-slate-500">{hint}</p></div></div><div className="flex items-center gap-3"><button type="button" aria-label={`Decrease ${label}`} onClick={() => sync({ [field]: Math.max(field === "bathrooms" ? 0.5 : 0, Number(draft[field]) - (field === "bathrooms" ? 0.5 : 1)) })} className="stepper-button"><Minus className="h-4 w-4" /></button><span className="w-6 text-center font-semibold">{draft[field]}</span><button type="button" aria-label={`Increase ${label}`} onClick={() => sync({ [field]: Number(draft[field]) + (field === "bathrooms" ? 0.5 : 1) })} className="stepper-button"><Plus className="h-4 w-4" /></button></div></div>})}</div></section>;
    if (step === 3) return <section><p className="eyebrow">The good-to-know list</p><div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">{amenities.map(([label, Icon]) => { const selected = draft.amenities.includes(label); return <button type="button" key={label} onClick={() => sync({ amenities: selected ? draft.amenities.filter((item) => item !== label) : [...draft.amenities, label] })} className={`flex min-h-24 flex-col items-start justify-between rounded-2xl border p-4 text-left transition ${selected ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white hover:border-slate-400"}`}><Icon className="h-5 w-5" /><span className="text-sm font-semibold">{label}</span></button>})}</div></section>;
    if (step === 4) return <section><p className="eyebrow">A little visual proof</p><div {...getRootProps()} className={`mt-8 flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 text-center transition ${isDragActive ? "border-rose-500 bg-rose-50" : "border-slate-300 bg-slate-50 hover:border-slate-500"}`}><input {...getInputProps()} /><span className="rounded-2xl bg-white p-4 shadow-sm"><ImagePlus className="h-7 w-7 text-rose-600" /></span><p className="mt-4 font-semibold">{isDragActive ? "Drop them here" : "Drag photos here, or browse"}</p><p className="mt-1 text-sm text-slate-500">JPG, PNG or WEBP · up to 10 MB each</p><p className="mt-4 text-xs font-semibold uppercase tracking-widest text-rose-600">{draft.photos.length}/3 minimum photos</p></div>{errors.photos && <FieldError message={errors.photos.message as string} />}<div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4">{draft.photos.map((photo, index) => <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-2xl bg-slate-100"><img src={photo.preview} alt={`Listing photo ${index + 1}`} className="h-full w-full object-cover" /><button type="button" aria-label={`Delete ${photo.name}`} onClick={() => removePhoto(photo.id)} className="absolute right-2 top-2 rounded-full bg-white/90 p-2 text-slate-700 opacity-0 shadow transition group-hover:opacity-100"><Trash2 className="h-4 w-4" /></button></div>)}</div></section>;
    if (step === 5) return <section><p className="eyebrow">Words guests remember</p><label className="field-label mt-8"><span>Listing title</span><input {...register("title")} maxLength={50} value={draft.title} onChange={(event) => sync({ title: event.target.value })} placeholder="Sunlit retreat above the bay" className="field-input text-lg" /><span className="mt-1 text-right text-xs text-slate-400">{draft.title.length}/50</span><FieldError message={errors.title?.message as string} /></label><label className="field-label mt-5"><span>Description</span><textarea {...register("description")} maxLength={500} value={draft.description} onChange={(event) => sync({ description: event.target.value })} rows={7} placeholder="Tell guests what makes this place special..." className="field-input resize-none" /><span className="mt-1 text-right text-xs text-slate-400">{draft.description.length}/500</span><FieldError message={errors.description?.message as string} /></label><Button type="button" variant="outline" className="mt-5" onClick={() => setGeoMessage("AI writing assistant coming soon") }><Sparkles className="mr-2 h-4 w-4 text-rose-600" />Help me write this</Button></section>;
    if (step === 6) return <section><p className="eyebrow">The numbers, plainly</p><div className="mt-8 grid gap-4 sm:grid-cols-2"><label className="field-label"><span>Base price per night</span><div className="relative"><CircleDollarSign className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" /><input type="number" min="1" {...register("basePricePerNight", { valueAsNumber: true })} value={draft.basePricePerNight} onChange={(event) => sync({ basePricePerNight: Number(event.target.value) })} className="field-input pl-12" /></div><FieldError message={errors.basePricePerNight?.message as string} /></label><label className="field-label"><span>Cleaning fee</span><div className="relative"><CircleDollarSign className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" /><input type="number" min="0" {...register("cleaningFee", { valueAsNumber: true })} value={draft.cleaningFee} onChange={(event) => sync({ cleaningFee: Number(event.target.value) })} className="field-input pl-12" /></div></label></div><div className="mt-8 rounded-3xl bg-slate-950 p-6 text-white"><p className="text-sm text-slate-300">Sample 3-night stay</p><div className="mt-3 flex items-end justify-between"><span className="text-3xl font-semibold">${total.toLocaleString()}</span><span className="text-sm text-slate-400">3 × ${draft.basePricePerNight.toLocaleString()} + ${draft.cleaningFee.toLocaleString()} cleaning</span></div></div></section>;
    return <section><p className="eyebrow">Ready when you are</p><div className="mt-8 grid gap-3 sm:grid-cols-2">{[["Home type", draft.propertyType], ["Location", [draft.city, draft.state, draft.country].filter(Boolean).join(", ")], ["Space", `${draft.maxGuests} guests · ${draft.bedrooms} bedrooms · ${draft.bathrooms} bathrooms`], ["Amenities", draft.amenities.length ? draft.amenities.join(", ") : "None selected"], ["Photos", `${draft.photos.length} photos`], ["Story", draft.title], ["Pricing", `$${draft.basePricePerNight}/night · $${draft.cleaningFee} cleaning`]].map(([label, value]) => <div key={label} className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4"><div><p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</p><p className="mt-2 font-medium text-slate-800">{value}</p></div><button type="button" onClick={() => setStep([["Home type", 0], ["Location", 1], ["Space", 2], ["Amenities", 3], ["Photos", 4], ["Story", 5], ["Pricing", 6]].find(([name]) => name === label)?.[1] as number)} className="text-sm font-semibold text-rose-600 hover:text-rose-700">Edit</button></div>)}</div>{submitError && <p className="mt-5 rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-700">{submitError}</p>}</section>;
  };

  return <main className="mx-auto max-w-5xl pb-16"><div className="mb-10 flex items-center justify-between"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-600">Host studio</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Create your listing</h1></div><span className="hidden text-sm font-semibold text-slate-500 sm:block">Draft saved automatically</span></div><div className="mb-12"><div className="mb-3 flex items-end justify-between"><div><span className="text-xs font-bold tracking-[0.2em] text-slate-400">{stepMeta[step][0]}</span><p className="mt-1 text-lg font-semibold text-slate-950">{stepMeta[step][1]}</p></div><span className="text-sm font-medium text-slate-500">Step {step + 1} of 8</span></div><div className="h-1.5 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-rose-500 transition-all duration-500" style={{ width: `${((step + 1) / 8) * 100}%` }} /></div><p className="mt-3 text-sm text-slate-500">{stepMeta[step][2]}</p></div><form onSubmit={(event) => { event.preventDefault(); void next(); }}><div className="min-h-[430px]">{renderStep()}</div><div className="mt-12 flex items-center justify-between border-t border-slate-200 pt-6"><Button type="button" variant="ghost" onClick={() => step === 0 ? router.push("/") : setStep((current) => current - 1)}><ArrowLeft className="mr-2 h-4 w-4" />Back</Button><Button type="submit" disabled={submitting} className="min-w-32 rounded-full bg-slate-950 px-5 text-white hover:bg-slate-800">{step === 7 ? (submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Publishing</> : <><Send className="mr-2 h-4 w-4" />Publish</>) : <>Next<ArrowRight className="ml-2 h-4 w-4" /></>}</Button></div></form><div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400"><Check className="h-3.5 w-3.5 text-emerald-600" />Your progress is saved on this device</div></main>;
}
