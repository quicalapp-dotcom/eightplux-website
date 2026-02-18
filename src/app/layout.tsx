import type { Metadata } from "next";
import { Bodoni_Moda, Space_Grotesk } from "next/font/google";
import { Cinzel, Inter, Playfair_Display } from "next/font/google"; // Keep existing fonts for now
import "./globals.css";
import AppLayoutWrapper from "@/components/layout/AppLayoutWrapper";
import { AuthProvider } from "@/contexts/AuthContext";

const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni-moda",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

// Keep existing fonts for backward compatibility
const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Eightplux | High-End Editorial Fashion",
  description: "A fashion-forward, community-driven e-commerce platform that blends editorial storytelling with premium shopping experiences.",
  icons: {
    icon: '/Copy of 8+ red logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bodoniModa.variable} ${spaceGrotesk.variable} ${cinzel.variable} ${inter.variable} ${playfair.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white text-[#1a1a1a] font-body" suppressHydrationWarning>
        <AuthProvider>
          <AppLayoutWrapper>{children}</AppLayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
