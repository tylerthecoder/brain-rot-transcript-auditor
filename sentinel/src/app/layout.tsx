import type { Metadata } from "next";
import { Fira_Code } from "next/font/google";
import "./globals.css";

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
    <html lang="en" className={`${firaCode.variable} h-full`}>
      <body className="min-h-full flex flex-col font-mono bg-bg-primary text-text-primary antialiased">
        {children}
        <div className="crt-overlay" />
      </body>
    </html>
  );
}
