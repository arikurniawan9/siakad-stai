import type { Metadata } from "next";
import { Manrope, IBM_Plex_Mono } from "next/font/google";

import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SIAKAD STAI",
  description: "Sistem Informasi Akademik universitas berbasis Next.js dan Supabase.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${manrope.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
