'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Clock, Home } from 'lucide-react';

export function BottomNavigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'আজ', icon: Home },
    { href: '/calendar', label: 'ক্যালেন্ডার', icon: Calendar },
    { href: '/prayers', label: 'নামাজ', icon: Clock },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border/50 flex justify-around items-center h-20 z-50 safe-bottom px-4">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center gap-1.5 py-2 px-4 rounded-xl transition-all duration-300 ${
              isActive
                ? 'text-primary'
                : 'text-muted-foreground'
            }`}
          >
            <Icon size={26} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-xs font-semibold">{label}</span>
            {isActive && (
              <div className="h-1 w-6 bg-primary rounded-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
