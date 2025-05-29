// app/layout.tsx
import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
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
  title: "YZ ROBO - Gaming, Automotive, Coding & More",
  description: "Explore the intersection of gaming, automotive engineering, culinary arts, and creative coding with YZ ROBO.",
  keywords: "gaming, streaming, automotive, coding, cooking, YZ ROBO, yzrobo",
  authors: [{ name: "YZ ROBO" }],
  openGraph: {
    title: "YZ ROBO",
    description: "Gaming enthusiast. Automotive engineer. Creative coder.",
    url: "https://yzrobo.com",
    siteName: "YZ ROBO",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "YZ ROBO",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YZ ROBO",
    description: "Gaming enthusiast. Automotive engineer. Creative coder.",
    creator: "@yzRobo",
    images: ["/og-image.png"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${syne.variable}`}>
      <body className="min-h-screen bg-black antialiased">
        {/* Loading screen */}
        <div id="loading-screen" className="fixed inset-0 z-[100] bg-black flex items-center justify-center transition-opacity duration-500">
          <div className="text-6xl font-display font-bold text-white animate-pulse">
            YZ
          </div>
        </div>
        
        {children}
        
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
      </body>
    </html>
  );
}