'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth';
import { Logo } from '@/components/ui/Logo';

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/admin/login');
  };

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/properties', label: 'Properties', icon: '🏠' },
    { href: '/admin/properties/new', label: 'Add Property', icon: '➕' },
  ];

  return (
    <nav className="bg-gray-900 shadow-lg border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/admin" className="flex items-center space-x-3">
            <Logo width={120} height={40} />
            <span className="text-sm font-medium text-gray-400 hidden md:inline">
              Admin Panel
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  pathname === item.href
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-sm text-gray-400 hover:text-white hidden sm:inline"
            >
              View Site
            </Link>
            <button
              onClick={handleSignOut}
              className="text-sm text-red-400 hover:text-red-300 font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
