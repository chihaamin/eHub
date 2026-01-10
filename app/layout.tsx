import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "EFHub - Elite Football Hub",
        template: "%s | EFHub",
    },
    description: "Discover, compare, and explore elite football players",
    keywords: ["football", "players", "comparison", "stats", "rankings"],
    authors: [{ name: "EFHub Team" }],
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://efhub.com",
        title: "EFHub - Elite Football Hub",
        description: "Discover, compare, and explore elite football players",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                {children}
            </body>
        </html>
    );
}
