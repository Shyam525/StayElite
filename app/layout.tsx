import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StayElite - Premium Accommodation Booking",
  description: "Discover and book premium accommodations worldwide with StayElite",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">SE</span>
                </div>
                <h1 className="text-xl font-bold text-foreground">StayElite</h1>
              </div>
              <nav className="hidden md:flex items-center gap-8">
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition">Home</a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition">Explore</a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition">Bookings</a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition">Host</a>
              </nav>
              <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition">
                Sign In
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="font-semibold mb-4">About</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground transition">About us</a></li>
                  <li><a href="#" className="hover:text-foreground transition">Press</a></li>
                  <li><a href="#" className="hover:text-foreground transition">Blog</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground transition">Help Center</a></li>
                  <li><a href="#" className="hover:text-foreground transition">Contact</a></li>
                  <li><a href="#" className="hover:text-foreground transition">Safety</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Community</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground transition">Become a Host</a></li>
                  <li><a href="#" className="hover:text-foreground transition">Community</a></li>
                  <li><a href="#" className="hover:text-foreground transition">Guidelines</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Legal</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground transition">Terms</a></li>
                  <li><a href="#" className="hover:text-foreground transition">Privacy</a></li>
                  <li><a href="#" className="hover:text-foreground transition">Cookies</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-border pt-8 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">&copy; 2024 StayElite. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <button className="text-muted-foreground hover:text-foreground transition">
                  <span className="text-sm">English</span>
                </button>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
