import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "@/components/Providers";

const poppinsSans = Poppins({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "900"],
  display: "swap",
});

const poppinsSerif = Poppins({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700", "900"],
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
    <html lang="en" className={cn(poppinsSans.variable, poppinsSerif.variable, "scroll-smooth")}>
      <body className="bg-brand-cream text-brand-charcoal min-h-screen antialiased selection:bg-brand-terracotta/20">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
