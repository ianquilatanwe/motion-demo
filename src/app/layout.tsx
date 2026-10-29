import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import { MotionProvider } from "@/components/MotionProvider";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"] });

// Absolute base for the social preview image: the Vercel production URL when
// deployed, localhost otherwise.
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

const title = "Lumenfold – A Desk Lamp That Folds Away (Motion Demo)";
const description =
  "A portfolio demo of scroll-linked animation in Next.js: a lamp that folds flat as you scroll, a dusk-to-night scene, a flashlight reveal and a shared-element finish picker, with reduced-motion support. By Ian Quilatan.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: { title, description, type: "website", siteName: "Lumenfold" },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = {
  themeColor: "#0c0a11",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${bricolage.variable} font-sans antialiased`}>
        <a
          href="#main"
          className="sr-only z-50 rounded-full bg-amber px-4 py-2 font-semibold text-night focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
