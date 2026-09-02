"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { useToggleWishlist } from "@/hooks/useWishlist";
import { AuthModal } from "@/components/modals/AuthModal";

interface WishlistButtonProps {
  listingId: string;
  isSaved?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  showTextLabel?: boolean;
}

export function WishlistButton({
  listingId,
  isSaved = false,
  size = "sm",
  className = "",
  showTextLabel = false,
}: WishlistButtonProps) {
  const { isAuthenticated } = useAuthStore();
  const toggleMutation = useToggleWishlist();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const buttonSizes = {
    sm: "h-9 w-9",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }

    toggleMutation.mutate(listingId, {
      onSuccess: (data) => {
        if (data.saved) {
          toast.custom(
            (t) => (
              <div
                className={`${
                  t.visible ? "animate-enter" : "animate-leave"
                } pointer-events-auto flex w-full max-w-md rounded-2xl bg-slate-900 p-3.5 shadow-2xl ring-1 ring-black/5 text-white`}
              >
                <div className="flex items-center gap-3 w-full justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <Heart className="h-4 w-4 fill-[#FF385C] text-[#FF385C]" />
                    <span>Saved to wishlist!</span>
                  </div>
                  <Link
                    href="/wishlists"
                    onClick={() => toast.dismiss(t.id)}
                    className="text-xs font-bold text-rose-400 hover:underline"
                  >
                    View wishlist →
                  </Link>
                </div>
              </div>
            ),
            { duration: 3500 }
          );
        } else {
          toast("Removed from wishlist", {
            icon: "💔",
            style: {
              borderRadius: "16px",
              background: "#1e293b",
              color: "#fff",
              fontSize: "12px",
            },
          });
        }
      },
      onError: () => {
        toast.error("Failed to update wishlist. Please try again.");
      },
    });
  };

  return (
    <>
      <motion.button
        type="button"
        onClick={handleClick}
        disabled={toggleMutation.isPending}
        whileTap={{ scale: isSaved ? 0.85 : 1.3 }}
        animate={{ scale: isSaved ? [1, 1.3, 1] : [1, 0.85, 1] }}
        transition={{ duration: 0.3, type: "spring", stiffness: 400, damping: 17 }}
        aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
        className={`group flex items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-xs transition hover:bg-white hover:shadow-lg disabled:opacity-70 ${
          buttonSizes[size]
        } ${className}`}
      >
        {toggleMutation.isPending ? (
          <Loader2 className={`${iconSizes[size]} animate-spin text-slate-500`} />
        ) : (
          <Heart
            className={`${iconSizes[size]} transition-all duration-200 ${
              isSaved
                ? "fill-[#FF385C] text-[#FF385C]"
                : "fill-black/20 text-white group-hover:fill-black/30"
            }`}
          />
        )}
        {showTextLabel && (
          <span className="ml-2 text-sm font-semibold text-slate-900 underline">
            {isSaved ? "Saved" : "Save"}
          </span>
        )}
      </motion.button>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
