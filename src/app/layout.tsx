import type { Metadata } from "next";
import { Fira_Code, Comic_Neue } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const comicNeue = Comic_Neue({
  variable: "--font-comic",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "SENTINEL - AI Threat Detection",
  description: "Can you spot the rogue AI? Review transcripts. Catch attacks. Save the system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${firaCode.variable} ${comicNeue.variable} h-full`}>
      <body className="min-h-full flex flex-col font-mono bg-bg-primary text-text-primary antialiased">
        {children}
        <div className="crt-overlay" />
        <Analytics />
      </body>
    </html>
  );
}
