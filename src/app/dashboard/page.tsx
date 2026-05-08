'use client';

import { useEffect, useState } from 'react';
import { ShieldCheck, ShieldAlert, FileText, Activity, RefreshCw, Trash2, Link as LinkIcon, Link2Off, Fingerprint, Network } from 'lucide-react';
import { format } from 'date-fns';

interface EvidenceItem {
  id: string;
  fileName: string;
  fileSize: number;
  fileHash: string;
  blockHash: string;
  previousHash: string;
  timestamp: string;
  status: 'Secure' | 'Tampered' | 'Chain Broken';
  nonce: number;
  signature: string;
  signer: string;
}

export default function DashboardPage() {
  const [items, setItems] = useState<EvidenceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tamperLoading, setTamperLoading] = useState<string | null>(null);
  const [clearLoading, setClearLoading] = useState(false);
  const [verifyingChain, setVerifyingChain] = useState(false);
  const [chainStatus, setChainStatus] = useState<'Valid' | 'Broken' | null>(null);

  const fetchEvidence = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/evidence');
      const data = await res.json();
      setItems(data);
      setChainStatus(null);
    } catch (error) {
      console.error('Failed to fetch evidence', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvidence();
  }, []);

  const simulateAttack = async (id: string, type: string) => {
    setTamperLoading(id);
    try {
      await fetch(`/api/evidence/${id}/tamper`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attackType: type })
      });
      await fetchEvidence();
    } catch (e) {
      console.error('Failed to tamper', e);
    }
    setTamperLoading(null);
  };

  const clearEvidence = async () => {
    if (!confirm('Are you sure you want to clear all evidence from the locker?')) return;
    setClearLoading(true);
    try {
      await fetch('/api/evidence/clear', { method: 'POST' });
      await fetchEvidence();
    } catch (e) {
      console.error('Failed to clear evidence', e);
    }
    setClearLoading(false);
  };

  const verifyChain = async () => {
    setVerifyingChain(true);
    try {
      const res = await fetch('/api/evidence/verify-chain');
      const data = await res.json();
      setChainStatus(data.valid ? 'Valid' : 'Broken');
      if (data.items) {
        setItems(data.items);
      }
    } catch (e) {
      console.error('Failed to verify chain', e);
    }
    setVerifyingChain(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white glow-text uppercase tracking-wider">Blockchain Evidence Locker</h1>
          <p className="text-slate-400 mt-1">Cryptographically linked chain-of-trust evidence system.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={clearEvidence}
            disabled={clearLoading || items.length === 0}
            className="px-4 py-2 bg-[#ef4444]/10 border border-[#ef4444]/50 rounded-lg hover:bg-[#ef4444]/20 text-[#ef4444] transition-all flex items-center gap-2 text-sm font-medium disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            {clearLoading ? 'Clearing...' : 'Clear Locker'}
          </button>
          <button 
            onClick={fetchEvidence} 
            className="p-2 bg-[#1e3a8a]/20 border border-[#1e3a8a] rounded-lg hover:bg-[#1e3a8a]/40 text-[#00e5ff] transition-all"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="cyber-card p-6 border-l-4 border-l-[#00e5ff]">
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">Total Blocks</h3>
          <div className="text-4xl font-bold text-white">{items.length}</div>
        </div>
        <div className="cyber-card p-6 border-l-4 border-l-[#10b981]">
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">Secure Items</h3>
          <div className="text-4xl font-bold text-[#10b981]">{items.filter(i => i.status === 'Secure').length}</div>
        </div>
        <div className="cyber-card p-6 border-l-4 border-l-[#ef4444]">
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">Compromised</h3>
          <div className="text-4xl font-bold text-[#ef4444]">{items.filter(i => i.status !== 'Secure').length}</div>
        </div>
        <div className="cyber-card p-6 border-l-4 border-l-[#f59e0b] flex flex-col justify-center">
          <button
            onClick={verifyChain}
            disabled={verifyingChain || items.length === 0}
            className="w-full py-3 bg-[#f59e0b]/20 border border-[#f59e0b]/50 text-[#f59e0b] rounded font-bold hover:bg-[#f59e0b]/30 transition-all flex items-center justify-center gap-2 uppercase tracking-widest disabled:opacity-50 glow-box"
          >
            <Network className="w-5 h-5" />
            {verifyingChain ? 'Verifying...' : 'Verify Chain'}
          </button>
          {chainStatus && (
            <div className={`mt-3 text-center text-sm font-bold uppercase tracking-wider ${chainStatus === 'Valid' ? 'text-[#10b981]' : 'text-[#ef4444] animate-pulse'}`}>
              Status: {chainStatus}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white border-b border-[#1e3a8a] pb-2 uppercase tracking-wider">Blockchain Forensic Timeline</h2>
        {items.length === 0 && !loading && (
          <div className="cyber-card p-8 text-center text-slate-400">
            No evidence blocks found. Upload files or enable Demo Mode.
          </div>
        )}
        
        <div className="relative border-l-2 border-[#1e3a8a] ml-4 md:ml-6 space-y-8 pb-8">
          {items.map((item, index) => {
            const isCompromised = item.status !== 'Secure';
            const isBroken = item.status === 'Chain Broken';

            return (
              <div key={item.id} className="relative pl-8 md:pl-10">
                <div className={`absolute -left-[17px] top-4 w-8 h-8 rounded-full border-2 flex items-center justify-center bg-[#040d21] ${
                  isCompromised ? 'border-[#ef4444] text-[#ef4444]' : 'border-[#10b981] text-[#10b981]'
                }`}>
                  {isCompromised ? <Link2Off className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
                </div>

                <div className={`cyber-card p-6 transition-all ${
                  isBroken ? 'border-[#ef4444] border-l-4 opacity-75 grayscale-[50%]' : 
                  item.status === 'Tampered' ? 'border-[#ef4444] border-l-4 glow-box-destructive' : 
                  'border-[#10b981] border-l-4 hover:bg-[#1e3a8a]/10'
                }`}>
                  <div className="flex flex-col md:flex-row justify-between gap-4 mb-4 border-b border-[#1e3a8a]/50 pb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[#00e5ff] font-mono text-sm">BLOCK #{index}</span>
                        {item.status === 'Secure' && (
                          <span className="text-xs bg-[#10b981]/10 text-[#10b981] px-2 py-0.5 rounded border border-[#10b981]/20 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> VERIFIED
                          </span>
                        )}
                        {item.status === 'Tampered' && (
                          <span className="text-xs bg-[#ef4444]/10 text-[#ef4444] px-2 py-0.5 rounded border border-[#ef4444]/20 flex items-center gap-1 animate-pulse">
                            <ShieldAlert className="w-3 h-3" /> TAMPERED
                          </span>
                        )}
                        {item.status === 'Chain Broken' && (
                          <span className="text-xs bg-[#ef4444]/10 text-[#ef4444] px-2 py-0.5 rounded border border-[#ef4444]/20 flex items-center gap-1">
                            <Link2Off className="w-3 h-3" /> CHAIN BROKEN
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#00e5ff]" />
                        {item.fileName}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">{format(new Date(item.timestamp), 'PPpp')}</p>
                    </div>
                    
                    <div className="flex flex-col gap-2 min-w-[200px]">
                      <div className="text-xs text-slate-500 uppercase">Attack Simulation</div>
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => simulateAttack(item.id, 'content')} disabled={isCompromised} className="text-[10px] px-2 py-1 bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30 rounded hover:bg-[#ef4444]/20 disabled:opacity-30 transition-all">
                          Mod Content
                        </button>
                        <button onClick={() => simulateAttack(item.id, 'block')} disabled={isCompromised} className="text-[10px] px-2 py-1 bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30 rounded hover:bg-[#ef4444]/20 disabled:opacity-30 transition-all">
                          Mod Block
                        </button>
                        <button onClick={() => simulateAttack(item.id, 'signature')} disabled={isCompromised} className="text-[10px] px-2 py-1 bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30 rounded hover:bg-[#ef4444]/20 disabled:opacity-30 transition-all col-span-2">
                          Fake Signature
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                    <div className="space-y-2">
                      <div>
                        <span className="text-slate-500 block mb-1">Previous Hash:</span>
                        <span className={`break-all ${index > 0 && isBroken ? 'text-[#ef4444]' : 'text-slate-400'}`}>
                          {item.previousHash}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-1">Block Hash:</span>
                        <span className="break-all text-[#00e5ff]">{item.blockHash}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-slate-500 block mb-1">File Hash (Whirlpool):</span>
                        <span className="break-all text-slate-300">{item.fileHash}</span>
                      </div>
                      <div className="flex justify-between items-center bg-[#1e3a8a]/20 p-2 rounded border border-[#1e3a8a]/50">
                        <div className="flex items-center gap-2">
                          <Fingerprint className="w-4 h-4 text-[#10b981]" />
                          <span className="text-slate-300">Signer: {item.signer}</span>
                        </div>
                        <span className="text-slate-500">Nonce: {item.nonce}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
