import type { Metadata } from "next";
import "./globals.css";
import React from "react";

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
    <html lang="fr" suppressHydrationWarning>
      <body>
        <Providers>
          <div className="min-h-screen">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
