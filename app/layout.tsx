import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ThemeProvider } from "next-themes";  // ← ADD THIS

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Auth Sprint App",
  description: "Sprint 1 - Authentication UI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        ></ThemeProvider>
        <Header />
        <main className="flex-1 container max-w-lg mx-auto px-4 py-12">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

