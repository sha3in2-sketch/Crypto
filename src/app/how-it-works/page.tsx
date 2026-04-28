import { Shield, Lock, FileSearch, ArrowRight, ArrowDown } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="space-y-12 max-w-4xl mx-auto pb-12">
      <div className="text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-white glow-text uppercase tracking-wider mb-4">How It Works</h1>
        <p className="text-xl text-slate-400">Understanding Cryptographic Hashing in Digital Forensics</p>
      </div>

      <div className="space-y-8">
        <section className="cyber-card p-8 border-l-4 border-l-[#00e5ff]">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <Lock className="text-[#00e5ff]" /> What is a Hash Function?
          </h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            A hash function is a mathematical algorithm that takes input data of any size (like a text message or a large video file) and converts it into a fixed-size string of characters. You can think of a hash as a "digital fingerprint" for data.
          </p>
          <ul className="list-disc pl-5 text-slate-400 space-y-2">
            <li><strong>Deterministic:</strong> The same input will always produce the exact same hash.</li>
            <li><strong>One-way function:</strong> It is practically impossible to reconstruct the original data from the hash alone.</li>
            <li><strong>Unique:</strong> It is highly improbable for two different files to produce the same hash (this is called a collision).</li>
          </ul>
        </section>

        <section className="cyber-card p-8 border-l-4 border-l-[#3b82f6]">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <Shield className="text-[#3b82f6]" /> What is the Whirlpool Algorithm?
          </h2>
          <p className="text-slate-300 leading-relaxed">
            Whirlpool is a cryptographic hash function developed by Vincent Rijmen (co-creator of AES) and Paulo S. L. M. Barreto. It produces a <strong>512-bit</strong> hash (which is typically represented as a 128-character hexadecimal string).
          </p>
          <p className="text-slate-300 leading-relaxed mt-4">
            It is known for its high security margins and resistance to cryptographic attacks, making it highly suitable for verifying the integrity of critical data such as digital evidence.
          </p>
        </section>

        <section className="cyber-card p-8 border-l-4 border-l-[#ef4444]">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <FileSearch className="text-[#ef4444]" /> What is the Avalanche Effect?
          </h2>
          <p className="text-slate-300 leading-relaxed mb-6">
            The avalanche effect is a desirable property in cryptography. It means that if an input is changed slightly (for example, flipping a single bit or changing a single letter), the output hash changes significantly (statistically, about 50% of the output bits should flip).
          </p>
          <div className="bg-[#040d21] p-4 rounded-lg border border-[#1e3a8a] grid grid-cols-1 md:grid-cols-2 gap-4 text-center items-center">
            <div>
              <div className="text-white font-mono mb-2">Input: <span className="text-[#00e5ff]">"cat"</span></div>
              <div className="text-xs text-slate-500 break-all">C91E5B3...</div>
            </div>
            <div className="hidden md:flex justify-center">
              <ArrowRight className="text-slate-500" />
            </div>
            <div>
              <div className="text-white font-mono mb-2">Input: <span className="text-[#ef4444]">"bat"</span></div>
              <div className="text-xs text-slate-500 break-all">F4A21D8...</div>
            </div>
          </div>
        </section>

        <section className="cyber-card p-8 border-t-4 border-t-[#10b981]">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">System Architecture</h2>
          
          <div className="flex flex-col items-center max-w-md mx-auto space-y-2">
            
            <div className="w-full bg-[#1e3a8a]/20 border border-[#1e3a8a] p-4 rounded-lg text-center">
              <h3 className="font-bold text-white">1. File Upload</h3>
              <p className="text-xs text-slate-400 mt-1">Investigator acquires digital evidence</p>
            </div>
            
            <ArrowDown className="text-[#00e5ff] animate-bounce" />
            
            <div className="w-full bg-[#00e5ff]/10 border border-[#00e5ff] p-4 rounded-lg text-center glow-box">
              <h3 className="font-bold text-[#00e5ff]">2. Whirlpool Hash Generation</h3>
              <p className="text-xs text-slate-400 mt-1">System computes 512-bit fingerprint</p>
            </div>
            
            <ArrowDown className="text-[#00e5ff] animate-bounce" />
            
            <div className="w-full bg-[#10b981]/10 border border-[#10b981] p-4 rounded-lg text-center">
              <h3 className="font-bold text-[#10b981]">3. Hash Stored in Locker</h3>
              <p className="text-xs text-slate-400 mt-1">Database securely records the hash & metadata</p>
            </div>
            
            <ArrowDown className="text-[#00e5ff] animate-bounce" />
            
            <div className="w-full bg-[#1e3a8a]/20 border border-[#1e3a8a] p-4 rounded-lg text-center">
              <h3 className="font-bold text-white">4. Verification Phase</h3>
              <p className="text-xs text-slate-400 mt-1">File re-hashed and compared to DB record</p>
            </div>
            
            <ArrowDown className="text-[#00e5ff] animate-bounce" />
            
            <div className="w-full bg-gradient-to-r from-[#10b981]/20 to-[#ef4444]/20 border border-slate-600 p-4 rounded-lg text-center flex">
              <div className="w-1/2 border-r border-slate-600 px-2">
                <h3 className="font-bold text-[#10b981]">Match = Secure</h3>
              </div>
              <div className="w-1/2 px-2">
                <h3 className="font-bold text-[#ef4444]">Mismatch = Tampered</h3>
              </div>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
}
