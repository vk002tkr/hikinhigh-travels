import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hikinhigh Travels | Travel Beyond the Ordinary",
  description:
    "Book hotels, tour packages and adventure experiences with Hikinhigh Travels.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}