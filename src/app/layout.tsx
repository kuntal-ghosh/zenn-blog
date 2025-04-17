// import React, { JSX } from 'react';
// import  Header  from '@/shared/components/layout/Header';
// import  Footer  from '../shared/components/layout/Footer';

// const RootLayout = ({ children }: { children: React.ReactNode }) => {
//   return (
//     <html lang="en">
//       <body className="bg-gray-100">
//         <Header />
//         <main>{children}</main>
//         <Footer />
//       </body>
//     </html>
//   );
// };

// export default RootLayout;

import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/layout/header";
import Navigation from "@/components/layout/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zenn - Tech Articles and Knowledge Sharing",
  description: "A platform for developers to share knowledge and insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Header />
            <Navigation />
            <main className="flex-1 bg-slate-50">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
