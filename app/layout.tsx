import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://note.dropeco.dev"),
  title: {
    default: "Note-Drop: An Online Notepad",
    template: "%s | Note-Drop",
  },
  description: "Copy notes across devices easily. A simple, fast, and efficient online notepad.",
  keywords: ["notepad", "online notes", "share notes", "note drop", "markdown editor"],
  openGraph: {
    title: "Note-Drop: An Online Notepad",
    description: "Copy notes across devices easily. Share text and markdown instantly.",
    url: "/",
    siteName: "Note-Drop",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Note-Drop: An Online Notepad",
    description: "Copy notes across devices easily.",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
