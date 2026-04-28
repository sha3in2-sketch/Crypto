import Link from 'next/link';
import { Shield, Lock, FileSearch, Fingerprint, Activity, Database } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12">
      <div className="space-y-6 max-w-4xl relative">
        <div className="absolute inset-0 bg-[#00e5ff]/5 blur-[100px] rounded-full -z-10" />
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-[#040d21] border border-[#00e5ff]/30 flex items-center justify-center glow-box">
            <Shield className="w-10 h-10 text-[#00e5ff]" />
          </div>
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white glow-text uppercase">
          Cyber Evidence <span className="text-[#00e5ff]">Locker</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-400 font-light max-w-2xl mx-auto">
          A digital forensic integrity verification system powered by Whirlpool cryptographic hashing.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <Link href="/dashboard" className="px-8 py-4 bg-[#00e5ff]/10 border border-[#00e5ff] text-[#00e5ff] font-bold rounded-lg hover:bg-[#00e5ff]/20 transition-all glow-box uppercase tracking-widest flex items-center gap-2">
          <Lock className="w-5 h-5" /> Access Locker
        </Link>
        <Link href="/how-it-works" className="px-8 py-4 bg-[#1e3a8a]/20 border border-[#1e3a8a] text-slate-300 font-bold rounded-lg hover:bg-[#1e3a8a]/40 hover:text-white transition-all uppercase tracking-widest flex items-center gap-2">
          <Fingerprint className="w-5 h-5" /> How It Works
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-16 text-left">
        <div className="cyber-card p-6 space-y-4">
          <div className="w-12 h-12 rounded-lg bg-[#00e5ff]/10 flex items-center justify-center border border-[#00e5ff]/20">
            <FileSearch className="w-6 h-6 text-[#00e5ff]" />
          </div>
          <h3 className="text-xl font-bold text-white">Immutable Integrity</h3>
          <p className="text-slate-400">Uses 512-bit Whirlpool hashing to generate a unique cryptographic fingerprint for every piece of digital evidence.</p>
        </div>
        <div className="cyber-card p-6 space-y-4">
          <div className="w-12 h-12 rounded-lg bg-[#ef4444]/10 flex items-center justify-center border border-[#ef4444]/20">
            <Activity className="w-6 h-6 text-[#ef4444]" />
          </div>
          <h3 className="text-xl font-bold text-white">Tamper Detection</h3>
          <p className="text-slate-400">Demonstrates the Avalanche Effect where even a single bit change in the file completely alters the resulting hash.</p>
        </div>
        <div className="cyber-card p-6 space-y-4">
          <div className="w-12 h-12 rounded-lg bg-[#10b981]/10 flex items-center justify-center border border-[#10b981]/20">
            <Database className="w-6 h-6 text-[#10b981]" />
          </div>
          <h3 className="text-xl font-bold text-white">Secure Storage</h3>
          <p className="text-slate-400">Simulates a secure digital forensics locker to maintain a solid chain of custody for digital assets.</p>
        </div>
      </div>
    </div>
  );
}
