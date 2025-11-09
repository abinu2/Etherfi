import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-outfit'
});

export const metadata: Metadata = {
  title: "Lumina Finance - Intelligent DeFi Strategy Platform",
  description: "AI-powered DeFi strategy platform with unique Strategy DNA profiling, portfolio genome analysis, and intelligent yield optimization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${outfit.className} font-modern antialiased`}>{children}</body>
    </html>
  );
}
