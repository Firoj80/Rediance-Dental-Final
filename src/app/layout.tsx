import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Radiance Dental Care & Facial Trauma Centre",
  description:
    "Comprehensive dental care in Siwan, Bihar. Dr. Shahid Raza provides modern dental treatments with gentle care and affordable prices.",
  keywords: [
    "dental",
    "dentist",
    "Siwan",
    "Bihar",
    "dental care",
    "oral health",
    "Dr. Shahid Raza",
  ],
  authors: [{ name: "Radiance Dental Care" }],
  openGraph: {
    title: "Radiance Dental Care & Facial Trauma Centre",
    description:
      "Comprehensive dental care in Siwan, Bihar with modern technology and gentle treatment.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Radiance Dental Care",
    description: "Comprehensive dental care in Siwan, Bihar.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${jakarta.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
