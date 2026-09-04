import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import Header from "@/components/Header";
import Providers from "@/components/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "StayElite — Find Your Perfect Stay",
  description: "Discover unique luxury homes, apartments, and experiences around the world. Book with confidence on StayElite.",
  keywords: "vacation rentals, luxury villas, home stays, travel, stayelite, airbnb clone",
  openGraph: {
    title: "StayElite — Find Your Perfect Stay",
    description: "Discover unique luxury homes and stay retreats around the world.",
    url: "https://stayelite.com",
    siteName: "StayElite",
    images: [{ url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StayElite — Premium Stays Worldwide",
    description: "Find your next luxury stay retreat.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-white text-secondary font-sans antialiased">
        <Providers>
          <Suspense fallback={<div className="h-20 w-full bg-white border-b border-gray-200" />}>
            <Header />
          </Suspense>
          <div className="flex-1 w-full">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
