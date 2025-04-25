import type React from "react";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/layout/header";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Zenn Blog",
  description: "Technical blog platform for developers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Script to prevent flash of incorrect theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme');
                  if (
                    savedTheme === 'dark' ||
                    (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
                  ) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  console.error('Error applying theme:', e);
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background text-foreground font-sans",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Header />
            <main className="flex-1 z-1">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
