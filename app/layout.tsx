import type { Metadata } from "next";
import "./globals.css";
import React from "react";

import { Providers } from "@/app/providers";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Records",
  description: "Collection de vinyles",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <Providers>
          <div className="min-h-screen">{children}</div>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
