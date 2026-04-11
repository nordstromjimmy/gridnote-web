import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-outfit",
});

const BASE_URL = "https://gridnoteapp.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Grid Notes — Think in space, not in lists",
    template: "%s — Grid Notes",
  },
  description:
    "An infinite canvas note-taking app. Place notes anywhere on a zoomable grid, link ideas together, and see the whole picture at once. Free to try, no account required.",
  keywords: [
    "infinite canvas",
    "note taking app",
    "spatial notes",
    "canvas notes",
    "mind mapping",
    "note board",
    "visual notes",
    "grid notes",
  ],
  authors: [{ name: "Grid Notes" }],
  creator: "Grid Notes",
  publisher: "Grid Notes",

  // Canonical URL
  alternates: {
    canonical: BASE_URL,
  },

  themeColor: "#1E272C",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Grid Notes",
  },
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",

  // Open Graph — controls Facebook, LinkedIn, Discord previews
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Grid Notes",
    title: "Grid Notes — Think in space, not in lists",
    description:
      "An infinite canvas for your ideas. Place notes anywhere, link them together, and see the whole picture at once.",
    images: [
      {
        url: "/og-image.png", // we'll create this below
        width: 1200,
        height: 630,
        alt: "Grid Notes — Infinite canvas note-taking",
      },
    ],
  },

  // Twitter / X card
  twitter: {
    card: "summary_large_image",
    title: "Grid Notes — Think in space, not in lists",
    description:
      "An infinite canvas for your ideas. Place notes anywhere, link them together, and see the whole picture at once.",
    images: ["/og-image.png"],
  },

  // App stores (add these once published)
  // appLinks: {
  //   android: {
  //     package: 'com.gridnotes.app',
  //     app_name: 'Grid Notes',
  //   },
  // },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={outfit.variable}>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js');
              });
            }
          `,
          }}
        />
      </body>
    </html>
  );
}
