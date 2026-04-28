'use client';

import { useState, useEffect } from 'react';
import { calculateWhirlpoolHash, hexToBinary } from '@/lib/hash';

export default function AvalanchePage() {
  const [input1, setInput1] = useState('HELLO WORLD');
  const [input2, setInput2] = useState('HELLO WORLd');
  
  const [hash1, setHash1] = useState('');
  const [hash2, setHash2] = useState('');
  
  const [bin1, setBin1] = useState('');
  const [bin2, setBin2] = useState('');
  
  const [diffBits, setDiffBits] = useState(0);

  useEffect(() => {
    const updateHashes = async () => {
      const h1 = await calculateWhirlpoolHash(input1);
      const h2 = await calculateWhirlpoolHash(input2);
      
      setHash1(h1);
      setHash2(h2);
      
      const b1 = hexToBinary(h1);
      const b2 = hexToBinary(h2);
      
      setBin1(b1);
      setBin2(b2);
      
      let diffs = 0;
      for (let i = 0; i < b1.length; i++) {
        if (b1[i] !== b2[i]) diffs++;
      }
      setDiffBits(diffs);
    };
    
    updateHashes();
  }, [input1, input2]);

  const diffPercentage = ((diffBits / 512) * 100).toFixed(1);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white glow-text uppercase tracking-wider">Avalanche Effect</h1>
        <p className="text-slate-400 mt-1">Observe how a tiny change in input causes a completely different hash output.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="cyber-card p-6 space-y-4">
          <label className="text-sm font-medium text-[#00e5ff] uppercase tracking-wider block">Input 1</label>
          <input 
            type="text" 
            value={input1}
            onChange={(e) => setInput1(e.target.value)}
            className="w-full bg-[#040d21] border border-[#1e3a8a] text-white rounded p-3 focus:outline-none focus:border-[#00e5ff] transition-colors"
          />
          <div className="bg-[#040d21] p-3 rounded border border-[#1e3a8a]/30 h-24 overflow-auto">
            <div className="text-xs text-slate-500 uppercase mb-1">Hash</div>
            <div className="font-mono text-xs text-slate-300 break-all">{hash1}</div>
          </div>
        </div>

        <div className="cyber-card p-6 space-y-4">
          <label className="text-sm font-medium text-[#ef4444] uppercase tracking-wider block">Input 2</label>
          <input 
            type="text" 
            value={input2}
            onChange={(e) => setInput2(e.target.value)}
            className="w-full bg-[#040d21] border border-[#ef4444]/50 text-white rounded p-3 focus:outline-none focus:border-[#ef4444] transition-colors"
          />
          <div className="bg-[#040d21] p-3 rounded border border-[#ef4444]/30 h-24 overflow-auto">
            <div className="text-xs text-[#ef4444]/70 uppercase mb-1">Hash</div>
            <div className="font-mono text-xs text-slate-300 break-all">{hash2}</div>
          </div>
        </div>
      </div>

      <div className="cyber-card p-8 border-t-4 border-t-[#00e5ff]">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Bit Difference Analysis</h2>
            <p className="text-sm text-slate-400">Total size: 512 bits</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#ef4444]">{diffBits}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider">Bits Changed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00e5ff]">{diffPercentage}%</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider">Avalanche Effect</div>
            </div>
          </div>
        </div>

        <div className="bg-[#040d21] p-4 rounded border border-[#1e3a8a]/30">
          <div className="text-xs text-slate-500 uppercase mb-3 flex items-center gap-4">
            <span>Binary Comparison Grid</span>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#1e3a8a] rounded-sm"></div> <span className="text-[10px]">Unchanged</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#ef4444] rounded-sm animate-pulse"></div> <span className="text-[10px]">Flipped Bit</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-[2px]">
            {bin1.split('').map((bit, idx) => {
              const isDiff = bit !== bin2[idx];
              return (
                <div 
                  key={idx} 
                  className={`w-3 h-3 md:w-4 md:h-4 text-[6px] flex items-center justify-center font-mono ${
                    isDiff ? 'bg-[#ef4444] text-black shadow-[0_0_5px_#ef4444]' : 'bg-[#1e3a8a]/40 text-slate-500'
                  }`}
                  title={`Bit ${idx}: ${bit} -> ${bin2[idx]}`}
                >
                  {isDiff ? bin2[idx] : bit}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
