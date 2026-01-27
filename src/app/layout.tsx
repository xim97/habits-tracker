import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/layout/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Habits Tracker",
  description: "Track your daily habits and build better routines",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased bg-gray-50 dark:bg-gray-950 min-h-screen`}>
        <Providers>
          <Header />
          <main className="max-w-5xl mx-auto px-4 py-6">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
