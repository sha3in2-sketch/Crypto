'use client';

import { useState } from 'react';
import { UploadCloud, CheckCircle, File as FileIcon, Loader2 } from 'lucide-react';
import { calculateWhirlpoolHash } from '@/lib/hash';
import { generateEvidenceId } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const router = useRouter();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setProgress(10);
    
    try {
      // 1. Calculate Whirlpool Hash
      const hash = await calculateWhirlpoolHash(file);
      setProgress(50);
      
      const evidenceData = {
        id: generateEvidenceId(),
        fileName: file.name,
        fileSize: file.size,
        hash: hash
      };
      
      // 2. Save to db
      const res = await fetch('/api/evidence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(evidenceData)
      });
      
      if (res.ok) {
        setProgress(100);
        const data = await res.json();
        setResult(data);
      }
    } catch (e) {
      console.error(e);
    }
    
    setIsUploading(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white glow-text uppercase tracking-wider">Acquire Evidence</h1>
        <p className="text-slate-400 mt-1">Upload digital artifacts to generate their immutable cryptographic fingerprint.</p>
      </div>

      {!result ? (
        <div className="cyber-card p-8">
          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed border-[#1e3a8a] rounded-xl p-12 flex flex-col items-center justify-center text-center hover:bg-[#1e3a8a]/5 transition-colors cursor-pointer relative"
          >
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              onChange={(e) => e.target.files && setFile(e.target.files[0])}
            />
            <div className="w-20 h-20 rounded-full bg-[#1e3a8a]/20 flex items-center justify-center mb-6">
              <UploadCloud className="w-10 h-10 text-[#00e5ff]" />
            </div>
            
            {file ? (
              <div className="space-y-2">
                <p className="text-xl font-bold text-white flex items-center gap-2 justify-center">
                  <FileIcon className="w-5 h-5 text-[#00e5ff]" />
                  {file.name}
                </p>
                <p className="text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xl font-bold text-white">Drag & drop evidence file here</p>
                <p className="text-slate-400">or click to browse local storage</p>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end">
            <button 
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="px-8 py-3 bg-[#00e5ff]/10 border border-[#00e5ff] text-[#00e5ff] font-bold rounded-lg hover:bg-[#00e5ff]/20 transition-all glow-box uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                'Secure Evidence'
              )}
            </button>
          </div>
          
          {isUploading && (
            <div className="mt-6 w-full h-2 bg-[#040d21] rounded-full overflow-hidden border border-[#1e3a8a]">
              <div 
                className="h-full bg-[#00e5ff] transition-all duration-500 shadow-[0_0_10px_#00e5ff]"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="cyber-card p-8 border-l-4 border-l-[#10b981]">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#10b981]/20 flex items-center justify-center border border-[#10b981]/50 flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-[#10b981]" />
            </div>
            <div className="space-y-6 w-full">
              <div>
                <h2 className="text-2xl font-bold text-white">Evidence Secured Successfully</h2>
                <p className="text-slate-400">The file has been hashed and stored in the secure locker.</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 bg-[#040d21] p-6 rounded-lg border border-[#1e3a8a]/50">
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Evidence ID</div>
                  <div className="font-mono text-white">{result.id}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Status</div>
                  <div className="text-[#10b981] font-bold uppercase flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></div>
                    {result.status}
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">File Name</div>
                  <div className="text-white">{result.fileName}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Whirlpool Hash (512-bit)</div>
                  <div className="font-mono text-[#00e5ff] text-sm break-all bg-[#040d21] p-3 rounded border border-[#1e3a8a]/30">
                    {result.hash}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setResult(null)}
                  className="px-6 py-2 bg-[#1e3a8a]/20 border border-[#1e3a8a] text-slate-300 font-bold rounded-lg hover:bg-[#1e3a8a]/40 hover:text-white transition-all uppercase text-sm"
                >
                  Upload Another
                </button>
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="px-6 py-2 bg-[#00e5ff]/10 border border-[#00e5ff] text-[#00e5ff] font-bold rounded-lg hover:bg-[#00e5ff]/20 transition-all glow-box uppercase text-sm"
                >
                  View Locker
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
