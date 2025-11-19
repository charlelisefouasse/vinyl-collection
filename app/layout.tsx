import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import ReactQueryProvider from "@/app/providers/tanstack-query";
import { AuthSessionProvider } from "@/app/providers/next-auth";
import { Providers } from "@/app/providers";

export const metadata: Metadata = {
  title: "Mes vinyles",
  description: "Ma collection de vinyles",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <div className="min-h-screen from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
