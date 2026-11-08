import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = localFont({
  src: [
    { path: "./fonts/geist-latin.woff2", weight: "100 900", style: "normal" },
    { path: "./fonts/geist-latin-ext.woff2", weight: "100 900", style: "normal" },
  ],
  variable: "--font-sans",
});

const inter = localFont({
  src: [
    { path: "./fonts/inter-latin.woff2", weight: "100 900", style: "normal" },
    { path: "./fonts/inter-latin-ext.woff2", weight: "100 900", style: "normal" },
  ],
  variable: "--font-inter",
});

const jetbrains = localFont({
  src: [
    { path: "./fonts/jetbrains-mono-latin.woff2", weight: "100 900", style: "normal" },
    { path: "./fonts/jetbrains-mono-latin-ext.woff2", weight: "100 900", style: "normal" },
  ],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "TuniHack 12.0",
  description: "Tunisia's National Hackathon",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", inter.variable, jetbrains.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
