// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Inter, Syne } from "next/font/google";
import { Analytics } from '@vercel/analytics/react';
import Image from 'next/image'; 
import Footer from "./components/Footer";
import GlobalEffects from "./components/GlobalEffects";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://yzrobo.com'),
  title: "yzRobo - Gaming, Automotive, Recipes & More",
  description: "Explore the intersection of gaming, automotive passion, cooking, and creative coding with yzRobo.",
  keywords: "gaming, streaming, automotive, coding, cooking, yzRobo, yzrobo",
  authors: [{ name: "yzRobo" }],
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
  openGraph: {
    title: "yzRobo",
    description: "Gaming enthusiast. Automotive obsessed. Creative vibe coding.",
    url: "https://yzrobo.com",
    siteName: "yzRobo",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 1200,
        height: 630,
        alt: "yzRobo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "yzRobo",
    description: "Gaming enthusiast. Automotive obsessed. Creative vibe coding.",
    creator: "@yzRobo",
    images: ["/android-chrome-512x512.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${syne.variable}`}>
      <body className="min-h-screen antialiased flex flex-col">
        <GlobalEffects />
        {/* Loading screen */}
        <div id="loading-screen" className="fixed inset-0 z-[100] bg-black flex items-center justify-center transition-opacity duration-500">
          <div className="animate-pulse">
            <Image
              src="/media/yzRobo_Logo_Main.png"
              alt="yzRobo Logo"
              width={240}
              height={70}
              priority
            />
          </div>
        </div>
        
        <main className="flex-grow">
          {children}
        </main>
        
        <Footer />

        {/* Remove loading screen after mount */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('load', function() {
                setTimeout(function() {
                  const loader = document.getElementById('loading-screen');
                  if (loader) {
                    loader.style.opacity = '0';
                    setTimeout(function() {
                      loader.style.display = 'none';
                    }, 500);
                  }
                }, 100);
              });
            `,
          }}
        />
        <Analytics />
      </body>
    </html>
  );
}