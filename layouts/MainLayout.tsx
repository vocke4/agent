import React from 'react';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-xl">My AI SaaS</h1>
      </header>
      <main className="flex-1 p-6">{children}</main>
      <footer className="bg-gray-800 text-white p-4 text-center">© 2025 My AI SaaS</footer>
    </div>
  );
}
