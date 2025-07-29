import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import AnalyticsWrapper from "@/components/AnalyticsWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | UVHub',
    default: 'UVHub - Your Fitness Marketplace',
  },
  description: "Discover and shop the best fitness equipment and accessories at UVHub. Quality products, great prices, and fast shipping.",
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://uvhub.com.ng',
    siteName: 'UVHub',
    title: 'UVHub - Your Fitness Marketplace',
    description: 'Discover and shop the best fitness equipment and accessories at UVHub. Quality products, great prices, and fast shipping.',
    images: [
      {
        url: '/images/about.jpg',
        width: 1200,
        height: 630,
        alt: 'UVHub Fitness Equipment',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@uvhub',
    creator: '@uvhub',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AnalyticsWrapper>
          {children}
        </AnalyticsWrapper>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
