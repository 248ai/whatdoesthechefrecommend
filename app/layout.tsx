import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: {
    default: "What Does The Chef Recommend?",
    template: "%s | Chef Recommends",
  },
  description:
    "Discover what chefs actually recommend at restaurants near you. Skip the decision paralysis and order with confidence.",
  keywords: [
    "restaurant recommendations",
    "chef recommendations",
    "what to order",
    "restaurant guide",
    "best dishes",
    "local restaurants",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "What Does The Chef Recommend?",
    title: "What Does The Chef Recommend?",
    description:
      "Discover what chefs actually recommend at restaurants near you.",
  },
  twitter: {
    card: "summary_large_image",
    title: "What Does The Chef Recommend?",
    description:
      "Discover what chefs actually recommend at restaurants near you.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${dmSerif.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
