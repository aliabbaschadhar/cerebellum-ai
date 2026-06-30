import type { Metadata } from "next";
import { Libre_Caslon_Text, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const libreCaslon = Libre_Caslon_Text({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-libre-caslon",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cerebellum AI — Save anything from the web",
  description:
    "A unified link-saving tool that gives you rich previews for YouTube, X, GitHub, Reddit, and any article.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${libreCaslon.variable} ${plusJakarta.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}

