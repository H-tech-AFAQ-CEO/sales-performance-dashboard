'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Package, TrendingUp, MapPin, Percent, Home } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Sales Overview', icon: Home },
    { href: '/inventory', label: 'Inventory', icon: Package },
    { href: '/products', label: 'Products', icon: BarChart3 },
    { href: '/stores', label: 'Regional', icon: MapPin },
    { href: '/margins', label: 'Margins', icon: Percent },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/50 bg-slate-950/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-500">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Analytics</h1>
              <p className="text-xs text-slate-500">By Afaq Ahmad</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button className="p-2 text-slate-400 hover:text-slate-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
