'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaCalendarDay, FaHistory, FaWeight, FaInfoCircle, FaCog, FaAppleAlt, FaRunning, FaUserAlt } from 'react-icons/fa';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Today', href: '/', icon: FaCalendarDay },
    { name: 'History', href: '/history', icon: FaHistory },
    { name: 'Institute', href: '/education', icon: FaAppleAlt },
    { name: 'About', href: '/about', icon: FaInfoCircle },
    { name: 'Profile', href: '/settings', icon: FaUserAlt },
  ];

  return (
    <header className="top-0 z-50 sticky px-4 sm:px-8 pt-2 sm:pt-4 w-full pointer-events-none">
      <nav className="glass-morphism relative mx-auto rounded-[24px] max-w-[1500px] overflow-hidden pointer-events-auto border-white/10 shadow-2xl shadow-blue-500/10">
        <div className="mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative flex justify-center items-center bg-blue-600 rounded-xl w-9 h-9 overflow-hidden shadow-xl shadow-blue-500/30 rotate-1 group-hover:rotate-0 transition-transform shrink-0">
                <FaRunning className="relative z-10 w-4 h-4 text-white" />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-700 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg text-white tracking-tighter leading-none italic">
                  VERNA<span className="text-blue-500">VITALITY</span>
                </span>
                <span className="text-[7px] text-zinc-600 font-black uppercase tracking-[0.3em] leading-none mt-1">v2.4 Neural Core</span>
              </div>
            </Link>

            <div className="flex items-center space-x-1 sm:space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all group ${isActive
                      ? 'text-white bg-blue-600/20 border border-blue-500/20'
                      : 'text-zinc-500 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400 animate-pulse' : 'group-hover:text-blue-300 transition-colors'}`} />
                    <span className="hidden xl:block">{item.name}</span>
                    {isActive && (
                      <span className="bottom-0 left-3 right-3 absolute bg-blue-500 blur-md h-px" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
