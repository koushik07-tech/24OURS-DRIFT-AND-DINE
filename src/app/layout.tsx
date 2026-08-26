import type { Metadata } from "next";
import { Inter, Outfit, Syne, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BookingModal from "@/components/modals/BookingModal";
import EnquiryModal from "@/components/modals/EnquiryModal";
import { AuthProvider } from "@/context/AuthContext";
import { BookingProvider } from "@/context/BookingContext";
import { siteConfig } from "@/config/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "24OURS — DRIFT AND DINE | Premier Motorsport & Entertainment Hub",
  description:
    "An international-standard motorsport, sky dining, and luxury entertainment destination in Chikkaballapura, Karnataka. Electric go-karting, 360° panoramic dining, RC arena, and banquet halls.",
  keywords: [
    "24Ours",
    "Drift and Dine",
    "Go-Karting Bangalore",
    "Chikkaballapura Go-Karting",
    "360 Sky Dining",
    "RC Racing Arena",
    "Motorsport Entertainment Hub",
  ],
  authors: [{ name: "24Ours Drift and Dine Private Limited" }],
  openGraph: {
    title: "24OURS — DRIFT AND DINE | Premier Motorsport & Entertainment Hub",
    description:
      "Electric go-karting, suspended 360° horizon dining, RC racing arena, and banquet architecture in Chikkaballapura, Karnataka.",
    type: "website",
    locale: "en_IN",
    siteName: "24OURS — DRIFT AND DINE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured JSON-LD Data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: siteConfig.legalName,
    alternateName: "24OURS — DRIFT AND DINE",
    description: siteConfig.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.location.city,
      addressRegion: siteConfig.location.state,
      addressCountry: siteConfig.location.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 13.4325,
      longitude: 77.7275,
    },
    openingHours: "Mo-Su 11:00-23:30",
  };

  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${syne.variable} ${spaceGrotesk.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-brand-black text-brand-white min-h-screen flex flex-col justify-between selection:bg-brand-red selection:text-white">
        <AuthProvider>
          <BookingProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <BookingModal />
            <EnquiryModal />
          </BookingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
