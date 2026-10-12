import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FrontendEngineerIntern",
  description:
    "A free, open course that takes you from zero to frontend engineer, one small lesson at a time.",
};

export const viewport: Viewport = {
  themeColor: "#f2f2f4",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/PPNeueMontreal-Book.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
