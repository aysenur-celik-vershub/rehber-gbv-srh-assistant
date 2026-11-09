import type { Metadata, Viewport } from "next";
import "./globals.css";

// Neutral title and description only: nothing in the tab title or page
// metadata may hint at the app's subject (shared-device safety, brief 11.4).
export const metadata: Metadata = {
  title: "Rehber",
  description: "Kadın sağlığı bilgi rehberi",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5f7f6",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // lang/dir are updated on the client when the user picks a language
  // (see app/page.tsx). Nothing about the choice is written to the URL,
  // cookies or storage.
  return (
    <html lang="tr" dir="ltr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
