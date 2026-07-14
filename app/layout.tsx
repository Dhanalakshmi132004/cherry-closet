import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600"],
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Closet | Handcrafted Crochet Shop",
  description: "Exquisite, warm, editorial-grade handcrafted crochet cardigans, bags, home decor, and plushies. Made to order with premium natural fibers.",
  keywords: ["crochet", "handcrafted", "handmade", "fashion", "decor", "terracotta", "slow fashion"],
  openGraph: {
    title: "The Closet | Handcrafted Crochet Shop",
    description: "Exquisite, warm, editorial-grade handcrafted crochet cardigans, bags, home decor, and plushies.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(inter.variable, fraunces.variable, "scroll-smooth")}>
      <body className="bg-brand-cream text-brand-charcoal min-h-screen antialiased selection:bg-brand-terracotta/20">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
