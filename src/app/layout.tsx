import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased">{children}</body>
    </html>
  );
}
