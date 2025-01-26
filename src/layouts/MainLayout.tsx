import Link from 'next/link';
import { Rocket } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-gray-900/80 backdrop-blur border-b border-gray-800">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Rocket className="w-6 h-6 text-indigo-400" />
            <span className="text-xl font-bold text-indigo-100">
              Agentic Studio
            </span>
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 flex-1">
        {children}
      </main>

      <footer className="bg-gray-900/80 backdrop-blur border-t border-gray-800 mt-8">
        <div className="container mx-auto px-4 py-4 text-center text-gray-400">
          © 2024 Agentic Studio. Empower your workflows.
        </div>
      </footer>
    </div>
  );
}
