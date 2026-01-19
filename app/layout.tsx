// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import "./globals.css";
// import Header from "./(public)/_components/Header";
// import Footer from "./(public)/_components/Footer";
// import { ThemeProvider } from "next-themes";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Auth Sprint App",
//   description: "Sprint 1 - Authentication UI",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body className={`${inter.className} min-h-screen flex flex-col bg-background text-foreground`}>
//         <ThemeProvider
//           attribute="class"
//           defaultTheme="system"
//           enableSystem
//         ></ThemeProvider>
//         <Header />
//         <main className="flex-1 container max-w-lg mx-auto px-4 py-12">
//           {children}
//         </main>
//         <Footer />
//       </body>
//     </html>
//   );
// }

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Foodify - Food Delivery App",
  description: "Order delicious food delivered to your doorstep",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}