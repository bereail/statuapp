// app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import ShowNavbar from "@/components/ShowNavbar";
import ShowFooter from "@/components/ShowFooter";
import VisitTracker from "@/components/VisitTracker";

import { Inter, Marcellus } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "StatuApp — Patrimonio escultórico de Rosario",
    template: "%s — StatuApp",
  },
  description: "Explorá las estatuas y monumentos de Rosario, su historia y ubicación.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "StatuApp",
  },
};

export const viewport: Viewport = {
  themeColor: "#1E1F26",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning className={`${inter.variable} ${marcellus.variable}`}>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <VisitTracker />
          <ShowNavbar />
          <main
            className="
              min-h-[70vh]
              pb-28 md:pb-24
              [padding-bottom:calc(env(safe-area-inset-bottom,0)+7rem)]
            "
          >
            {children}
          </main>
          <ShowFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
