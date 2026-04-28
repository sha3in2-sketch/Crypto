'use client';

import { useEffect, useState } from 'react';
import { ShieldCheck, ShieldAlert, FileText, Search, Activity, RefreshCw, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface EvidenceItem {
  id: string;
  fileName: string;
  fileSize: number;
  hash: string;
  timestamp: string;
  status: 'Secure' | 'Tampered';
}

export default function DashboardPage() {
  const [items, setItems] = useState<EvidenceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tamperLoading, setTamperLoading] = useState<string | null>(null);
  const [clearLoading, setClearLoading] = useState(false);
  const fetchEvidence = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/evidence');
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch evidence', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvidence();
  }, []);

  const simulateTamper = async (id: string) => {
    setTamperLoading(id);
    try {
      await fetch(`/api/evidence/${id}/tamper`, { method: 'POST' });
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white glow-text uppercase tracking-wider">Evidence Locker</h1>
          <p className="text-slate-400 mt-1">Manage and verify cryptographic integrity of stored digital evidence.</p>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="cyber-card p-6 border-l-4 border-l-[#00e5ff]">
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">Total Evidence</h3>
          <div className="text-4xl font-bold text-white">{items.length}</div>
        </div>
        <div className="cyber-card p-6 border-l-4 border-l-[#10b981]">
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">Secure Items</h3>
          <div className="text-4xl font-bold text-[#10b981]">{items.filter(i => i.status === 'Secure').length}</div>
        </div>
        <div className="cyber-card p-6 border-l-4 border-l-[#ef4444]">
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">Compromised</h3>
          <div className="text-4xl font-bold text-[#ef4444]">{items.filter(i => i.status === 'Tampered').length}</div>
        </div>
      </div>

      <div className="cyber-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[#00e5ff] uppercase bg-[#1e3a8a]/20 border-b border-[#1e3a8a]">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Evidence ID</th>
                <th className="px-6 py-4">File Name</th>
                <th className="px-6 py-4">Upload Time</th>
                <th className="px-6 py-4">Whirlpool Hash (Truncated)</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e3a8a]/30">
              {items.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    No evidence records found. Upload files or enable Demo Mode.
                  </td>
                </tr>
              )}
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-[#1e3a8a]/10 transition-colors">
                  <td className="px-6 py-4">
                    {item.status === 'Secure' ? (
                      <span className="flex items-center gap-2 text-[#10b981] font-medium bg-[#10b981]/10 px-2 py-1 rounded-md border border-[#10b981]/20 w-fit">
                        <ShieldCheck className="w-4 h-4" /> Secure
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-[#ef4444] font-medium bg-[#ef4444]/10 px-2 py-1 rounded-md border border-[#ef4444]/20 w-fit animate-pulse">
                        <ShieldAlert className="w-4 h-4" /> Tampered
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-300">{item.id}</td>
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#00e5ff]" />
                    {item.fileName}
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {format(new Date(item.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500 max-w-[200px] truncate" title={item.hash}>
                    {item.hash.substring(0, 32)}...
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => simulateTamper(item.id)}
                      disabled={tamperLoading === item.id || item.status === 'Tampered'}
                      className="text-xs px-3 py-1.5 bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30 rounded hover:bg-[#ef4444]/20 disabled:opacity-50 transition-all flex items-center gap-1 ml-auto"
                    >
                      <Activity className="w-3 h-3" />
                      {tamperLoading === item.id ? 'Modifying...' : 'Simulate Tamper'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
