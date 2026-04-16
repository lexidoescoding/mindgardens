import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar"
import {ThemeProvider} from "next-themes";
import {UserProfileProvider} from "@/context/UserProfileContext"
import { UserRoundPen } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Mind Gardens',
  description: 'a safe space for all systems',
  openGraph: {
    title: 'Mind Gardens',
    description: 'a safe space for all systems',
    url: 'https://mindgardens.app',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <>
        <Navbar />
        <UserProfileProvider>
          {children}
        </UserProfileProvider>
      </>
  )
}
