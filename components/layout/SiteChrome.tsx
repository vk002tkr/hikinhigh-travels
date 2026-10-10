
"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import Header from "./Header";
import Footer from "./Footer";
import Chatbot from "../chatbot/Chatbot";

export default function SiteChrome({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  const isAdminRoute =
    pathname === "/admin" || pathname.startsWith("/admin/");

  return (
    <>
      {!isAdminRoute && <Header />}

      {children}

      {!isAdminRoute && <Footer />}

      {!isAdminRoute && <Chatbot />}
    </>
  );
}
