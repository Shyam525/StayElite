"use client";

import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function ContactHostButton({ listingId, hostId }: { listingId: string; hostId?: string }) {
  const router = useRouter();
  if (!hostId) return null;
  return <Button type="button" variant="outline" className="rounded-full" onClick={() => router.push(`/messages?listingId=${encodeURIComponent(listingId)}&hostId=${encodeURIComponent(hostId)}&message=${encodeURIComponent("Hi! I am interested in staying here and would love to know more.")}`)}><MessageCircle className="mr-2 h-4 w-4" />Contact host</Button>;
}
