import { Shield, Lock, FileSearch, ArrowRight, ArrowDown, Link as LinkIcon, Network, Fingerprint } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="space-y-12 max-w-4xl mx-auto pb-12">
      <div className="text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-white glow-text uppercase tracking-wider mb-4">How It Works</h1>
        <p className="text-xl text-slate-400">Cryptographic Foundations of the Evidence Locker</p>
      </div>

      <div className="space-y-8">
        <section className="cyber-card p-8 border-l-4 border-l-[#00e5ff]">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <Lock className="text-[#00e5ff]" /> 1. Cryptographic Hashing
          </h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            A hash function is a mathematical algorithm that takes input data of any size and converts it into a fixed-size string of characters. We use the <strong>Whirlpool Algorithm (512-bit)</strong> to generate a unique digital fingerprint for every evidence file.
          </p>
          <ul className="list-disc pl-5 text-slate-400 space-y-2">
            <li><strong>Deterministic:</strong> The same input will always produce the exact same hash.</li>
            <li><strong>Avalanche Effect:</strong> Changing a single bit of the file completely changes the hash.</li>
            <li><strong>Collision-Resistant:</strong> It is practically impossible for two different files to produce the same hash.</li>
          </ul>
        </section>

        <section className="cyber-card p-8 border-l-4 border-l-[#3b82f6]">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <LinkIcon className="text-[#3b82f6]" /> 2. Blockchain Linking
          </h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            Instead of storing evidence hashes in isolation, each new piece of evidence is linked to the previous one, forming a chronological chain of trust.
          </p>
          <div className="bg-[#040d21] p-4 rounded-lg border border-[#1e3a8a] text-center mb-4 text-sm text-slate-300">
            Block Hash = Hash(Evidence ID + File Hash + <strong>Previous Block Hash</strong> + Timestamp + Signature)
          </div>
          <p className="text-slate-300 leading-relaxed">
            Because Block N contains the hash of Block N-1, if an attacker attempts to modify a file in the past, the block's hash changes. This breaks the link to Block N+1, causing the entire subsequent chain to become invalid. This guarantees <strong>tamper-evidence</strong> and <strong>immutability</strong>.
          </p>
        </section>

        <section className="cyber-card p-8 border-l-4 border-l-[#10b981]">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <Network className="text-[#10b981]" /> 3. Merkle Tree Structure
          </h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            In advanced configurations, evidence blocks can be grouped using a Merkle Tree. This involves pairing hashes and hashing them together until a single <strong>Merkle Root</strong> is formed.
          </p>
          <p className="text-slate-300 leading-relaxed">
            The Merkle Root provides a single summary hash for an entire dataset. It allows for <strong>Partial Verification</strong>—you can prove a specific file belongs to the set without needing to reveal or download all other files in the set.
          </p>
        </section>

        <section className="cyber-card p-8 border-l-4 border-l-[#f59e0b]">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <Fingerprint className="text-[#f59e0b]" /> 4. Digital Signatures
          </h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            To ensure non-repudiation, every piece of evidence is digitally signed by the investigator who uploaded it. Using public-key cryptography (simulated in this demo), the investigator uses their <strong>Private Key</strong> to sign the file hash.
          </p>
          <p className="text-slate-300 leading-relaxed">
            Anyone can verify the signature using the investigator's <strong>Public Key</strong>. If the signature is valid, it proves the evidence was uploaded by authorized personnel and has not been altered since the signature was applied.
          </p>
        </section>

        <section className="cyber-card p-8 border-t-4 border-t-[#10b981]">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">System Architecture</h2>
          
          <div className="flex flex-col items-center max-w-md mx-auto space-y-2">
            
            <div className="w-full bg-[#1e3a8a]/20 border border-[#1e3a8a] p-4 rounded-lg text-center">
              <h3 className="font-bold text-white">1. File Upload & Hashing</h3>
              <p className="text-xs text-slate-400 mt-1">Investigator acquires evidence; Whirlpool Hash generated.</p>
            </div>
            
            <ArrowDown className="text-[#00e5ff] animate-bounce" />
            
            <div className="w-full bg-[#f59e0b]/10 border border-[#f59e0b] p-4 rounded-lg text-center">
              <h3 className="font-bold text-[#f59e0b]">2. Digital Signature</h3>
              <p className="text-xs text-slate-400 mt-1">Investigator signs the hash using their Private Key.</p>
            </div>
            
            <ArrowDown className="text-[#00e5ff] animate-bounce" />
            
            <div className="w-full bg-[#3b82f6]/10 border border-[#3b82f6] p-4 rounded-lg text-center">
              <h3 className="font-bold text-[#3b82f6]">3. Block Construction</h3>
              <p className="text-xs text-slate-400 mt-1">Block connects to Previous Hash, creating a chronological chain.</p>
            </div>
            
            <ArrowDown className="text-[#00e5ff] animate-bounce" />
            
            <div className="w-full bg-[#10b981]/10 border border-[#10b981] p-4 rounded-lg text-center glow-box">
              <h3 className="font-bold text-[#10b981]">4. Continuous Verification</h3>
              <p className="text-xs text-slate-400 mt-1">Any modification instantly cascades and breaks the chain.</p>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
}
