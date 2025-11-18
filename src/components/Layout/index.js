import React from 'react';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 bg-gray-100">Header check</header>
      <main className="flex-1">{children}</main>
      <footer className="p-4 bg-gray-100">Footer</footer>
    </div>
  );
}
