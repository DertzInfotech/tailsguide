import React from "react";
import Header from "@/shared/Header";
import Footer from "./Footer";

export default function Layout({ children }) {
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
