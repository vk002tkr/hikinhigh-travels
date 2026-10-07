import type { Metadata } from "next";
import "./globals.css";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Chatbot from "../components/chatbot/Chatbot";
import { CurrencyProvider } from "../components/providers/CurrencyProvider";

export const metadata: Metadata = {
  title: "Hikinhigh Travels | Travel Beyond the Ordinary",
  description:
    "Discover stays, journeys and experiences around the world with Hikinhigh Travels.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CurrencyProvider>
          <Header />

          {children}

          <Footer />

          <Chatbot />
        </CurrencyProvider>
      </body>
    </html>
  );
}