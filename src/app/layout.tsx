import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { DepthThemeProvider } from "@/components/providers/DepthThemeProvider";
import "./globals.css";

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Into The Deep",
  description: "A scroll-driven descent through the five layers of the open ocean.",
  openGraph: {
    title: "Into The Deep",
    description: "Descend from the sunlit surface to the hadal trenches in a static scrollytelling site.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${mono.variable}`}>
      <body>
        <a className="skip-link" href="#main">Skip to main content</a>
        <DepthThemeProvider>{children}</DepthThemeProvider>
      </body>
    </html>
  );
}
