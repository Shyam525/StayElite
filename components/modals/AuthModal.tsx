"use client";

import Link from "next/link";
import { X, LogIn, UserPlus, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-[#FF385C] mb-4">
          <Heart className="h-6 w-6 fill-[#FF385C]" />
        </div>

        <h3 className="text-center text-xl font-bold tracking-tight text-slate-900">
          Log in to save homes
        </h3>
        <p className="mt-2 text-center text-xs text-slate-500 leading-relaxed">
          Create an account or log in to start saving your favorite luxury homes, chalet retreats, and beach villas.
        </p>

        <div className="mt-6 space-y-3">
          <Link href="/login" onClick={onClose}>
            <Button className="w-full h-11 rounded-full bg-[#FF385C] text-sm font-semibold text-white hover:bg-[#e42d4d] shadow-sm flex items-center justify-center gap-2">
              <LogIn className="h-4 w-4" /> Log In
            </Button>
          </Link>

          <Link href="/register" onClick={onClose}>
            <Button variant="outline" className="w-full h-11 rounded-full border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2">
              <UserPlus className="h-4 w-4" /> Create an Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
