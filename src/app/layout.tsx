import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

// Geist is loaded once here and self-hosted by Next.js (no request to Google at runtime).
const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "Slot", template: "%s · Slot" },
  description: "Find a local business and book a time in seconds.",
};

export const viewport: Viewport = {
  themeColor: "#f5f5f5", // browser bar colour; metadata needs a plain value, not a CSS token
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full bg-canvas font-sans text-ink">{children}</body>
    </html>
  );
}
