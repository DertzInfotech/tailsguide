"use client";

import { useEffect, useState } from "react";
import Header from "@/shared/Header";
import Footer from "./Footer";

export default function Layout({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {children}
      </main>

      {/* GLOBAL FOOTER */}
      <Footer />
    </div>
  );
}
