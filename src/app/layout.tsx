import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import "./globals.css";
import { Providers } from "@/components/Providers";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
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
    <html lang="en" className={`scroll-smooth ${plusJakarta.variable} ${jetbrainsMono.variable}`}>
      <body className={`${plusJakarta.className} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
