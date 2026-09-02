"use client";

import Link from "next/link";
import { Flame, Globe, Share2, MessageSquare, Compass } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#DDDDDD] bg-[#F7F7F7]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Col 1: StayElite Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-[#FF385C]">
                <Flame className="h-5 w-5 fill-current" />
              </div>
              <span className="text-lg font-black tracking-tight text-slate-900">
                Stay<span className="text-[#FF385C]">Elite</span>
              </span>
            </Link>
            <p className="text-xs text-[#717171] leading-relaxed max-w-xs">
              Discover unique luxury stays, mountain chalets, and beachfront villas around the world.
            </p>
            <div className="flex items-center gap-3 text-slate-500 pt-1">
              <a href="#" aria-label="Share" className="hover:text-[#FF385C] transition"><Share2 className="h-4 w-4" /></a>
              <a href="#" aria-label="Community" className="hover:text-[#FF385C] transition"><MessageSquare className="h-4 w-4" /></a>
              <a href="#" aria-label="Explore" className="hover:text-[#FF385C] transition"><Compass className="h-4 w-4" /></a>
            </div>
          </div>

          {/* Col 2: Explore */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#222222] mb-3">Explore</h3>
            <ul className="space-y-2 text-xs font-medium text-[#717171]">
              <li><a href="#" className="hover:text-[#222222] hover:underline">How StayElite works</a></li>
              <li><a href="#" className="hover:text-[#222222] hover:underline">Newsroom & Stories</a></li>
              <li><a href="#" className="hover:text-[#222222] hover:underline">Investors & Partners</a></li>
              <li><a href="#" className="hover:text-[#222222] hover:underline">Careers</a></li>
            </ul>
          </div>

          {/* Col 3: Hosting */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#222222] mb-3">Hosting</h3>
            <ul className="space-y-2 text-xs font-medium text-[#717171]">
              <li><Link href="/host/dashboard" className="hover:text-[#222222] hover:underline">Host your home</Link></li>
              <li><a href="#" className="hover:text-[#222222] hover:underline">Host resources & guide</a></li>
              <li><a href="#" className="hover:text-[#222222] hover:underline">Community forum</a></li>
              <li><a href="#" className="hover:text-[#222222] hover:underline">Responsible hosting</a></li>
            </ul>
          </div>

          {/* Col 4: Support */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#222222] mb-3">Support</h3>
            <ul className="space-y-2 text-xs font-medium text-[#717171]">
              <li><a href="#" className="hover:text-[#222222] hover:underline">Help Center</a></li>
              <li><a href="#" className="hover:text-[#222222] hover:underline">Trust & Safety</a></li>
              <li><a href="#" className="hover:text-[#222222] hover:underline">Cancellation options</a></li>
              <li><a href="#" className="hover:text-[#222222] hover:underline">Report a concern</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#DDDDDD] pt-6 sm:flex-row text-xs text-[#717171]">
          <p>© 2025 StayElite, Inc. · Privacy · Terms · Sitemap</p>
          <div className="flex items-center gap-4 font-semibold text-[#222222]">
            <button type="button" className="flex items-center gap-1.5 hover:underline">
              <Globe className="h-3.5 w-3.5" /> English (US)
            </button>
            <span>$ USD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
