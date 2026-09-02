"use client";

import { ShieldCheck, CreditCard, Headphones } from "lucide-react";

export function WhyUsSection() {
  return (
    <section className="py-16 bg-white border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-2xl font-extrabold text-[#222222]">Why StayElite?</h2>
          <p className="text-xs text-[#717171] mt-1">Book luxury stays with peace of mind</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Card 1 */}
          <div className="flex flex-col items-center text-center p-6 rounded-3xl border border-slate-200/80 bg-white shadow-2xs">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-[#FF385C] mb-4">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-[#222222]">Verified Listings</h3>
            <p className="mt-2 text-xs text-[#717171] leading-relaxed">
              Every single property is inspected and verified by our stay specialists before it goes live.
            </p>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col items-center text-center p-6 rounded-3xl border border-slate-200/80 bg-white shadow-2xs">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-[#FF385C] mb-4">
              <CreditCard className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-[#222222]">Secure Payments</h3>
            <p className="mt-2 text-xs text-[#717171] leading-relaxed">
              Your payments are encrypted and held securely until 24 hours after check-in.
            </p>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col items-center text-center p-6 rounded-3xl border border-slate-200/80 bg-white shadow-2xs">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-[#FF385C] mb-4">
              <Headphones className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-[#222222]">24/7 Global Support</h3>
            <p className="mt-2 text-xs text-[#717171] leading-relaxed">
              Our dedicated support team is available around the clock to assist you in any language.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
