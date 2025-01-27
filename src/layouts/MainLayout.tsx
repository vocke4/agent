'use client';
import { useState } from 'react'; // Add missing import
import Link from 'next/link';
import { Rocket, Menu } from 'lucide-react';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-slate-900 border-b border-slate-800">
        <div className="container px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Rocket className="w-6 h-6 text-indigo-400" />
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
            <Menu className="w-6 h-6 text-indigo-400" />
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden ${menuOpen ? 'block' : 'hidden'}`}>
          <div className="px-4 pb-4 space-y-3">
            <MobileNavLink href="/">Home</MobileNavLink>
            <MobileNavLink href="/about">About</MobileNavLink>
            <MobileNavLink href="/contact">Contact</MobileNavLink>
          </div>
        </div>
      </nav>

      <main className="flex-1 py-12">
        <div className="container">
          {children}
        </div>
      </main>

      <footer className="bg-slate-900 border-t border-slate-800">
        <div className="container px-4 py-6 text-center text-slate-400 text-sm">
          © 2025 Agentic Studio. Empower your workflows.
        </div>
      </footer>
    </div>
  );
}

// Rest of the component remains the same...
