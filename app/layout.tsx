import "./globals.css";

import AppBar from "@/features/navigation/components/AppBar";
import type { Metadata } from "next";
import RootProvider from "@/lib/proviers/RootProvider";
import localFont from "next/font/local";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "Polka fi - Modern bookeeping",
    description: "AI assisted bookeeping app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <RootProvider>
                    <div className="relative bg-[#FFF6F3] min-h-screen">
                        <div className="max-w-screen-xl sticky z-20 top-0 lg:top-2 mx-auto">
                            <AppBar />
                        </div>
                        {children}
                    </div>
                </RootProvider>
            </body>
        </html>
    );
}
