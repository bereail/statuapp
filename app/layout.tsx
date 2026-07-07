// app/layout.tsx
import type { Metadata } from "next";
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
  title: "StatuApp",
  description: "Patrimonio Rosario",
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
