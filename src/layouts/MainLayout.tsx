import Link from 'next/link';
import { Rocket, Menu } from 'lucide-react';
import { useState } from 'react';

export default function MainLayout({ children }: { 
  children: React.ReactNode 
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">
      <nav className="bg-gray-900/80 backdrop-blur border-b border-gray-800 relative">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Rocket className="w-6 h-6 text-indigo-400" />
            <span className="text-xl font-bold text-indigo-100">
              Agentic Studio
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden block text-indigo-100" 
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className={`lg:flex ${menuOpen ? 'block' : 'hidden'} flex-grow lg:items-center`}>
            <ul className="flex flex-col lg:flex-row gap-4 lg:ml-auto">
              <li>
                <Link href="/" className="hover:text-indigo-400">Home</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-indigo-400">About</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-indigo-400">Contact</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 flex-1">
        {children}
      </main>

      <footer className="bg-gray-900/80 backdrop-blur border-t border-gray-800 mt-8">
        <div className="container mx-auto px-4 py-4 text-center text-gray-400">
          © 2024 Agentic Studio. Empower your workflows.
          <div className="mt-2">
            <Link href="https://twitter.com" className="mx-2 hover:text-indigo-400">Twitter</Link>
            <Link href="https://github.com" className="mx-2 hover:text-indigo-400">GitHub</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
