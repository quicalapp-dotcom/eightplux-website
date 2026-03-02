import type { Metadata } from "next";
import { Montserrat, Playfair_Display, Dancing_Script } from "next/font/google";
import { Cinzel, Inter } from "next/font/google"; // Keep existing fonts for backward compatibility
import "./globals.css";
import AppLayoutWrapper from "@/components/layout/AppLayoutWrapper";
import { AuthProvider } from "@/contexts/AuthContext";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ['300', '400', '500', '600', '700', '800'],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  style: ['italic'],
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing-script",
  display: "swap",
  weight: ['700'],
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

export const metadata: Metadata = {
  title: "EIGHTPLU+ | Street Fashion",
  description: "EIGHTPLU+ - Urban fashion and streetwear. Play beyond limits.",
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
    <html lang="en" className={`${montserrat.variable} ${playfair.variable} ${dancingScript.variable} ${cinzel.variable} ${inter.variable}`}>
      <head>
        <link href="https://fonts.cdnfonts.com/css/tt-runs" rel="stylesheet" />
        <link href="https://fonts.cdnfonts.com/css/metropolis-2" rel="stylesheet" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white text-[#1a1a1a] font-sans scroll-smooth" suppressHydrationWarning>
        <AuthProvider>
          <AppLayoutWrapper>{children}</AppLayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
