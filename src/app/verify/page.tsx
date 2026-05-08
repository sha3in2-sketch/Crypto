'use client';

import { useState } from 'react';
import { Search, CheckCircle, ShieldAlert, UploadCloud, Loader2 } from 'lucide-react';
import { calculateWhirlpoolHash } from '@/lib/hash';

export default function VerifyPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleVerify = async () => {
    if (!file) return;
    setIsVerifying(true);
    setResult(null);
    
    try {
      const calculatedHash = await calculateWhirlpoolHash(file);
      
      const res = await fetch('/api/evidence');
      const items = await res.json();
      
      // Look for match by file name first to compare hashes
      const storedItem = items.find((i: any) => i.fileName === file.name);
      
      if (storedItem) {
        if (storedItem.fileHash === calculatedHash) {
          setResult({
            status: 'Authentic',
            storedHash: storedItem.fileHash,
            calculatedHash,
            item: storedItem
          });
        } else {
          // Calculate difference roughly
          let diffBits = 0;
          for(let i=0; i<calculatedHash.length; i++) {
            if(calculatedHash[i] !== storedItem.fileHash[i]) diffBits++;
          }
          const diffPercentage = ((diffBits / calculatedHash.length) * 100).toFixed(2);
          
          setResult({
            status: 'Compromised',
            storedHash: storedItem.fileHash,
            calculatedHash,
            diffPercentage,
            item: storedItem
          });
        }
      } else {
        setResult({
          status: 'Not Found',
          calculatedHash
        });
      }
    } catch (e) {
      console.error(e);
    }
    
    setIsVerifying(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white glow-text uppercase tracking-wider">Verify Integrity</h1>
        <p className="text-slate-400 mt-1">Upload a file to verify its authenticity against the secure locker.</p>
      </div>

      <div className="cyber-card p-8">
        <div className="flex gap-4 items-center">
          <div className="flex-1 border border-[#1e3a8a] rounded-lg p-4 bg-[#040d21] relative hover:bg-[#1e3a8a]/10 transition-colors">
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFile(e.target.files[0]);
                  setResult(null);
                }
              }}
            />
            <div className="flex items-center gap-3">
              <UploadCloud className="w-6 h-6 text-[#00e5ff]" />
              <span className="text-slate-300 font-medium">
                {file ? file.name : 'Select file to verify...'}
              </span>
            </div>
          </div>
          <button 
            onClick={handleVerify}
            disabled={!file || isVerifying}
            className="px-6 py-4 bg-[#00e5ff]/10 border border-[#00e5ff] text-[#00e5ff] font-bold rounded-lg hover:bg-[#00e5ff]/20 transition-all glow-box uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isVerifying ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            Verify
          </button>
        </div>
      </div>

      {result && (
        <div className={`cyber-card p-8 border-l-4 ${
          result.status === 'Authentic' ? 'border-l-[#10b981] glow-box' : 
          result.status === 'Compromised' ? 'border-l-[#ef4444] glow-box-destructive' : 
          'border-l-slate-500'
        }`}>
          <div className="flex items-start gap-4">
            {result.status === 'Authentic' && (
              <div className="w-12 h-12 rounded-full bg-[#10b981]/20 flex items-center justify-center border border-[#10b981]/50 flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-[#10b981]" />
              </div>
            )}
            {result.status === 'Compromised' && (
              <div className="w-12 h-12 rounded-full bg-[#ef4444]/20 flex items-center justify-center border border-[#ef4444]/50 flex-shrink-0 animate-pulse">
                <ShieldAlert className="w-6 h-6 text-[#ef4444]" />
              </div>
            )}
            {result.status === 'Not Found' && (
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-slate-600 flex-shrink-0">
                <Search className="w-6 h-6 text-slate-400" />
              </div>
            )}
            
            <div className="space-y-6 w-full">
              <div>
                <h2 className={`text-2xl font-bold ${
                  result.status === 'Authentic' ? 'text-[#10b981]' : 
                  result.status === 'Compromised' ? 'text-[#ef4444]' : 'text-white'
                }`}>
                  {result.status === 'Authentic' ? 'Evidence Authentic' : 
                   result.status === 'Compromised' ? '⚠ SECURITY ALERT: Integrity Compromised' : 
                   'Record Not Found'}
                </h2>
                <p className="text-slate-400">
                  {result.status === 'Authentic' ? 'No tampering detected. The cryptographic hash matches the secure record.' : 
                   result.status === 'Compromised' ? 'Hash mismatch detected. This file has been modified since it was secured.' : 
                   'This file does not exist in the secure locker database.'}
                </p>
              </div>

              {result.status !== 'Not Found' && (
                <div className="space-y-4">
                  <div className="bg-[#040d21] p-4 rounded-lg border border-[#1e3a8a]/50">
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Original Hash (Stored)</div>
                    <div className="font-mono text-sm break-all text-slate-300">
                      {result.storedHash}
                    </div>
                  </div>
                  
                  <div className={`bg-[#040d21] p-4 rounded-lg border ${
                    result.status === 'Authentic' ? 'border-[#10b981]/50' : 'border-[#ef4444]/50'
                  }`}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-xs text-slate-500 uppercase tracking-wider">Current Hash (Calculated)</div>
                      {result.status === 'Compromised' && (
                        <div className="text-xs font-bold text-[#ef4444] bg-[#ef4444]/10 px-2 py-1 rounded">
                          {result.diffPercentage}% Difference
                        </div>
                      )}
                    </div>
                    <div className={`font-mono text-sm break-all ${
                      result.status === 'Authentic' ? 'text-[#10b981]' : 'text-[#ef4444]'
                    }`}>
                      {result.calculatedHash}
                    </div>
                  </div>
                </div>
              )}
              
              {result.status === 'Not Found' && (
                <div className="bg-[#040d21] p-4 rounded-lg border border-[#1e3a8a]/50">
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Calculated Hash</div>
                  <div className="font-mono text-sm break-all text-[#00e5ff]">
                    {result.calculatedHash}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
