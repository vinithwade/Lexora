import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import { TimeTheme } from "@/components/TimeTheme";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lexora — Your AI accountability coach",
  description:
    "Two AI meetings a day. Plan in the morning, review in the evening. Build the streak.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans bg-bg text-fg" suppressHydrationWarning>
        <TimeTheme />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
