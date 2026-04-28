'use client';

import { useState } from 'react';
import { Copy, CheckCircle, FileKey, Loader2 } from 'lucide-react';
import { calculateWhirlpoolHash } from '@/lib/hash';

export default function GeneratorPage() {
  const [inputMode, setInputMode] = useState<'text' | 'file'>('text');
  const [textInput, setTextInput] = useState('');
  const [fileInput, setFileInput] = useState<File | null>(null);
  
  const [hash, setHash] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setHash('');
    
    try {
      if (inputMode === 'text') {
        const h = await calculateWhirlpoolHash(textInput);
        setHash(h);
      } else if (inputMode === 'file' && fileInput) {
        const h = await calculateWhirlpoolHash(fileInput);
        setHash(h);
      }
    } catch (e) {
      console.error(e);
    }
    
    setIsGenerating(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white glow-text uppercase tracking-wider">Hash Generator</h1>
        <p className="text-slate-400 mt-1">Standalone utility to generate a 512-bit Whirlpool hash from text or files.</p>
      </div>

      <div className="cyber-card p-8 space-y-6 border-t-4 border-t-[#00e5ff]">
        <div className="flex gap-4 border-b border-[#1e3a8a]/50 pb-4">
          <button 
            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
              inputMode === 'text' ? 'text-[#00e5ff] border-b-2 border-[#00e5ff]' : 'text-slate-500 hover:text-slate-300'
            }`}
            onClick={() => setInputMode('text')}
          >
            Text String
          </button>
          <button 
            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
              inputMode === 'file' ? 'text-[#00e5ff] border-b-2 border-[#00e5ff]' : 'text-slate-500 hover:text-slate-300'
            }`}
            onClick={() => setInputMode('file')}
          >
            File Upload
          </button>
        </div>

        <div>
          {inputMode === 'text' ? (
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Enter text to hash..."
              className="w-full bg-[#040d21] border border-[#1e3a8a] text-white rounded p-4 h-32 focus:outline-none focus:border-[#00e5ff] transition-colors resize-none"
            />
          ) : (
            <div className="border-2 border-dashed border-[#1e3a8a] bg-[#040d21] rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-[#1e3a8a]/5 transition-colors relative">
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                onChange={(e) => e.target.files && setFileInput(e.target.files[0])}
              />
              <FileKey className="w-8 h-8 text-[#00e5ff] mb-4" />
              {fileInput ? (
                <div className="text-[#00e5ff] font-medium">{fileInput.name} ({(fileInput.size / 1024).toFixed(1)} KB)</div>
              ) : (
                <div className="text-slate-400">Click or drag file to select</div>
              )}
            </div>
          )}
        </div>

        <button 
          onClick={handleGenerate}
          disabled={isGenerating || (inputMode === 'text' && !textInput) || (inputMode === 'file' && !fileInput)}
          className="w-full py-4 bg-[#00e5ff]/10 border border-[#00e5ff] text-[#00e5ff] font-bold rounded-lg hover:bg-[#00e5ff]/20 transition-all glow-box uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileKey className="w-5 h-5" />}
          Generate Whirlpool Hash
        </button>

        {hash && (
          <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-end">
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Output (Hex Format)</h3>
              <div className="flex gap-4 text-xs text-slate-500 font-mono">
                <span>Length: {hash.length} chars</span>
                <span>Bits: 512-bit</span>
              </div>
            </div>
            
            <div className="relative group">
              <div className="w-full bg-[#00050e] border border-[#1e3a8a] text-[#00e5ff] font-mono rounded p-4 break-all text-lg shadow-[inset_0_0_10px_rgba(0,229,255,0.1)]">
                {hash}
              </div>
              <button 
                onClick={copyToClipboard}
                className="absolute top-2 right-2 p-2 bg-[#1e3a8a]/40 text-slate-300 rounded hover:text-white hover:bg-[#1e3a8a] transition-all flex items-center gap-2 opacity-0 group-hover:opacity-100 focus:opacity-100"
              >
                {copied ? <CheckCircle className="w-4 h-4 text-[#10b981]" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
