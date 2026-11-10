import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import SiteBackground from "@/components/layout/SiteBackground";

const geist = localFont({
  src: [
    { path: "./fonts/geist-latin.woff2", weight: "100 900", style: "normal" },
    { path: "./fonts/geist-latin-ext.woff2", weight: "100 900", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
});

const inter = localFont({
  src: "./fonts/inter-latin.woff2",
  variable: "--font-inter",
  display: "block",
});

const jetbrains = localFont({
  src: [
    { path: "./fonts/jetbrains-mono-latin.woff2", weight: "100 900", style: "normal" },
    { path: "./fonts/jetbrains-mono-latin-ext.woff2", weight: "100 900", style: "normal" },
  ],
  variable: "--font-jetbrains",
  display: "swap",
});

const barlowCondensed = localFont({
  src: [
    { path: "./fonts/barlow-condensed-latin-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/barlow-condensed-latin-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-barlow-condensed",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TuniHack 12.0",
  description: "Tunisia's National Hackathon",
  icons: {
    icon: "/logo/tunihack.png",
    shortcut: "/logo/tunihack.png",
    apple: "/logo/tunihack.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", inter.variable, jetbrains.variable, barlowCondensed.variable, "font-sans", geist.variable)}
    >
      <head>
        <link rel="preload" as="image" href="/hero/tux-hologram-480.webp" type="image/webp" crossOrigin="anonymous" media="(max-width: 500px)" fetchPriority="high" />
        <link rel="preload" as="image" href="/hero/tux-hologram-720.webp" type="image/webp" crossOrigin="anonymous" media="(min-width: 501px) and (max-width: 900px)" fetchPriority="high" />
        <link rel="preload" as="image" href="/hero/tux-hologram.webp" type="image/webp" crossOrigin="anonymous" media="(min-width: 901px)" fetchPriority="high" />
      </head>
      <body className="relative isolate min-h-full flex flex-col">
        <SiteBackground />
        <div aria-hidden="true" className="site-background-overlay pointer-events-none fixed inset-0 z-0" />
        {children}
      </body>
    </html>
  );
}
