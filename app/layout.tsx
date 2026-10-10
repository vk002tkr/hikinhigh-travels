
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

import { CurrencyProvider } from "../components/providers/CurrencyProvider";
import SiteChrome from "../components/layout/SiteChrome";

export const metadata: Metadata = {
  title: "Hikinhigh Travels | Travel Beyond the Ordinary",
  description:
    "Discover stays, journeys and experiences around the world with Hikinhigh Travels.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CurrencyProvider>
          <SiteChrome>{children}</SiteChrome>
        </CurrencyProvider>
      </body>
    </html>
  );
}
