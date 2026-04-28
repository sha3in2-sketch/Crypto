'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Upload, Search, Database, Settings, Activity, FileKey, Info, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Upload Evidence', href: '/upload', icon: Upload },
  { name: 'Verify Integrity', href: '/verify', icon: Search },
  { name: 'Avalanche Effect', href: '/avalanche', icon: Activity },
  { name: 'Hash Generator', href: '/generator', icon: FileKey },
  { name: 'How It Works', href: '/how-it-works', icon: Info },
];

export function Sidebar() {
  const pathname = usePathname();
  const [demoLoading, setDemoLoading] = useState(false);

  const enableDemoMode = async () => {
    setDemoLoading(true);
    try {
      await fetch('/api/demo', { method: 'POST' });
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
    setDemoLoading(false);
  };

  return (
    <aside className="w-64 h-screen bg-[#040d21] border-r border-[#1e3a8a] flex flex-col fixed top-0 left-0 z-10">
      <div className="p-6 flex items-center gap-3 border-b border-[#1e3a8a]/50">
        <div className="w-10 h-10 rounded-lg bg-[#00e5ff]/10 flex items-center justify-center border border-[#00e5ff]/30 glow-box">
          <Shield className="w-6 h-6 text-[#00e5ff]" />
        </div>
        <div>
          <h1 className="font-bold text-white tracking-wider text-sm glow-text">CYBER EVIDENCE</h1>
          <p className="text-[#00e5ff] text-xs font-mono">LOCKER SYS_V1</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        <div className="text-xs font-mono text-[#1e3a8a] mb-4 px-2 uppercase tracking-widest">Main Menu</div>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname === '/' && item.href === '/dashboard');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 text-sm font-medium group relative",
                isActive 
                  ? "bg-[#1e3a8a]/40 text-[#00e5ff] border border-[#00e5ff]/20 glow-box" 
                  : "text-slate-400 hover:text-white hover:bg-[#1e3a8a]/20"
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#00e5ff] rounded-r-md"></span>
              )}
              <item.icon className={cn("w-5 h-5", isActive ? "text-[#00e5ff]" : "text-slate-500 group-hover:text-[#00e5ff]/70")} />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-[#1e3a8a]/50">
        <button 
          onClick={enableDemoMode}
          disabled={demoLoading}
          className="w-full py-2.5 px-4 bg-[#1e3a8a]/20 border border-[#1e3a8a] hover:bg-[#1e3a8a]/40 hover:border-[#00e5ff]/50 rounded-md text-xs font-mono text-slate-300 transition-all flex items-center justify-center gap-2 group"
        >
          <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform" />
          {demoLoading ? 'INITIALIZING...' : 'ENABLE DEMO MODE'}
        </button>
      </div>
    </aside>
  );
}
