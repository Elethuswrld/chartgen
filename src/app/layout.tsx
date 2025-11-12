import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SeedData } from "../components/SeedData";
import { ThemeProvider } from "../components/ThemeProvider";
import { BackToTopButton } from "../components/BackToTopButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ChartGen",
  description: "A modern fintech dashboard",
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
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SeedData />
          {children}
          <BackToTopButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
