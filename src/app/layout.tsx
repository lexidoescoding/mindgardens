    import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import {ThemeProvider} from "next-themes";
import Navbar from "@/components/Navbar";
import QueryProvider from "@/components/QueryProvider";
import {FolderMapProvider} from "@/context/FolderMapContext";
import GlobalContextProvider from "@/context/GlobalContextPrivider";
import {UserProfileProvider} from "@/context/UserProfileContext";

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
        <html lang="en" suppressHydrationWarning>

        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
            <GlobalContextProvider>
                <ThemeProvider attribute="data-theme">
                    {children}
                </ThemeProvider>
            </GlobalContextProvider>
        </body>
        </html>
    )
}
