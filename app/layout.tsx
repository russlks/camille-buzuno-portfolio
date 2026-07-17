import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PurchaseModal from "./components/works/PurchaseModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://camille-buzuno-portfolio.vercel.app";
const SITE_TITLE = "Camille Buzuno — Artist & Creative Director";
const SITE_DESCRIPTION =
  "Contemporary painter and creative director based in Prague. Exploring the language of the human body, color and visual storytelling.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  // og:image / twitter:image come from app/opengraph-image.png &
  // app/twitter-image.png (file conventions); metadataBase makes them absolute.
  openGraph: {
    type: "website",
    siteName: "Camille Buzuno",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

// Light mode is always the default. Dark ("depth") is applied ONLY when the
// visitor previously chose it (saved in localStorage), never from the system
// preference. Runs before first paint so light renders immediately — no flash.
const themeInit = `(function(){try{var q=new URLSearchParams(location.search).get('theme');if(q==='depth'||q==='light'){localStorage.setItem('theme',q);}if(localStorage.getItem('theme')==='depth'){document.documentElement.classList.add('dark');}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="min-h-full">
        {children}
        <PurchaseModal />
      </body>
    </html>
  );
}
