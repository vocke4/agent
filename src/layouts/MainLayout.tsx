"use client";
import { useState } from "react";
import Link from "next/link";

// We removed:
// import { Rocket, Menu } from 'lucide-react';

// Define NavLink component before MainLayout
const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    className="text-indigo-300 hover:text-indigo-100 transition-colors font-medium"
  >
    {children}
  </Link>
);

// Define MobileNavLink component
const MobileNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    className="block px-4 py-2 text-indigo-300 hover:bg-slate-800 rounded-lg transition-colors"
  >
    {children}
  </Link>
);

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-slate-900 border-b border-slate-800">
        <div className="container px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            {/* Replaced <Rocket ... /> with an emoji so we don't rely on lucide-react */}
            <span className="w-6 h-6 text-indigo-400">🚀</span>
            <span className="text-xl font-semibold text-indigo-100">Agentic Studio</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-6">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/contact">Contact</NavLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-800 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {/* Replaced <Menu ... /> with a burger-menu emoji/text */}
            <span className="w-6 h-6 text-indigo-400">☰</span>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden ${menuOpen ? "block" : "hidden"}`}>
          <div className="px-4 pb-4 space-y-3">
            <MobileNavLink href="/">Home</MobileNavLink>
            <MobileNavLink href="/about">About</MobileNavLink>
            <MobileNavLink href="/contact">Contact</MobileNavLink>
          </div>
        </div>
      </nav>

      <main className="flex-1 py-12">
        <div className="container">{children}</div>
      </main>

      <footer className="bg-slate-900 border-t border-slate-800">
        <div className="container px-4 py-6 text-center text-slate-400 text-sm">
          © 2025 Agentic Studio. Empower your workflows.
        </div>
      </footer>
    </div>
  );
}
