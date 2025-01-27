'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Rocket, Menu } from 'lucide-react';

export default function MainLayout({ children }: { 
  children: React.ReactNode 
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-gray-900/80 backdrop-blur border-b border-gray-800">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Rocket className="w-6 h-6 text-indigo-400" />
            <span className="text-xl font-bold text-indigo-100">Agentic Studio</span>
          </Link>
          <button 
            className="text-indigo-400 focus:outline-none transition-transform transform hover:scale-110" 
            aria-label="Toggle navigation menu" 
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu className="w-8 h-8" />
          </button>
        </div>
        <div 
          className={`transition-all duration-500 ease-in-out ${menuOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}
        >
          <ul className="flex flex-col text-center space-y-2">
            <li><Link href="/" className="block text-indigo-300 hover:text-indigo-500 py-2">Home</Link></li>
            <li><Link href="/about" className="block text-indigo-300 hover:text-indigo-500 py-2">About</Link></li>
            <li><Link href="/contact" className="block text-indigo-300 hover:text-indigo-500 py-2">Contact</Link></li>
          </ul>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 flex-1">
        {children}
      </main>

      <footer className="bg-gray-900/80 backdrop-blur border-t border-gray-800 mt-8">
        <div className="container mx-auto px-4 py-4 text-center text-gray-400">
          © 2025 Superior Communications. Empower your workflows.
        </div>
      </footer>
    </div>
  );
}
