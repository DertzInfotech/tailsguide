import React from 'react';
import Header from '../UI/header';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="p-4 bg-gray-100">Footer</footer>
    </div>
  );
}
