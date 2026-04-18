/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wifi, Key, Copy, Check, RotateCcw, ShieldCheck, Terminal, Cpu } from 'lucide-react';

export default function App() {
  const [wifiName, setWifiName] = useState('');
  const [password, setPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const calculatePassword = () => {
    if (!wifiName.trim()) return;
    
    setError(null);
    setIsProcessing(true);
    
    // Simulate technical work
    setTimeout(() => {
      const trimmedInput = wifiName.trim();
      let hexPart = '';

      if (trimmedInput.includes('_') || trimmedInput.includes('-')) {
        const parts = trimmedInput.split(/[_|-]/);
        // Look for the part that looks like hex (6 chars)
        const hexCandidate = parts.find(p => p.length >= 6);
        hexPart = hexCandidate ? hexCandidate.substring(0, 6) : trimmedInput.substring(0, 6);
      } else {
        hexPart = trimmedInput.substring(0, 6);
      }

      if (hexPart.length < 6) {
         setError("Need at least 6 hex chars (e.g. 2dfc4e)");
         setIsProcessing(false);
         return;
      }

      try {
        const hexValue = parseInt(hexPart, 16);
        if (isNaN(hexValue)) {
          setError("Invalid hex format detected.");
          setIsProcessing(false);
          return;
        }

        const result = 0xffffff - hexValue;
        const hexResult = result.toString(16).padStart(6, '0').toLowerCase();
        setPassword(`wlan${hexResult}`);
      } catch (e) {
        setError("Algorithm processing error.");
      } finally {
        setIsProcessing(false);
      }
    }, 800);
  };

  const copyToClipboard = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const reset = () => {
    setWifiName('');
    setPassword(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 font-sans text-white selection:bg-[#00ff62] selection:text-black transition-colors duration-500">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#00ff6211_0%,transparent_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-[400px] h-[720px] bg-[#0c0c0c] rounded-[40px] border border-[#222] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col p-8"
      >
        {/* Hardware Elements */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-[#1a1a1a] rounded-full" />
        <div className="absolute top-4 right-8 flex gap-1">
          <div className="w-1 h-1 rounded-full bg-[#333]" />
          <div className="w-1 h-1 rounded-full bg-[#333]" />
        </div>

        {/* Header */}
        <div className="mt-10 mb-8 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-[#00ff62]" />
              <span className="text-[10px] font-mono uppercase tracking-[3px] text-[#555]">Secure Recovery</span>
            </div>
            <h1 className="text-[42px] font-black uppercase tracking-[-2px] leading-none">
              KEY<br /><span className="text-[#00ff62]">GEN</span>
            </h1>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#111] border border-[#222] flex items-center justify-center">
            <Cpu className="w-6 h-6 text-[#333]" />
          </div>
        </div>

        {/* Display Screen */}
        <div className="relative flex-1 bg-[#050505] rounded-3xl border border-[#222] overflow-hidden group">
          {/* Scanline Effect */}
          <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.03] bg-[repeating-linear-gradient(0deg,#fff,#fff_1px,transparent_1px,transparent_2px)]" />
          
          <div className="p-6 h-full flex flex-col">
            <AnimatePresence mode="wait">
              {password ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex-1 flex flex-col items-center justify-center text-center space-y-10"
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] font-mono tracking-[4px] text-[#222] uppercase">Access Key</span>
                    <span className="text-[32px] font-mono font-bold text-[#00ff62] leading-none tracking-tight drop-shadow-[0_0_20px_rgba(0,255,98,0.4)] whitespace-nowrap">
                      {password}
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-6 w-full">
                    <button
                      onClick={copyToClipboard}
                      className="w-full h-16 bg-[#111] hover:bg-[#1a1a1a] rounded-2xl border border-[#222] hover:border-[#00ff62]/30 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                      {copied ? (
                        <>
                          <Check className="w-5 h-5 text-[#00ff62]" />
                          <span className="text-[12px] font-mono uppercase tracking-[3px] text-[#00ff62]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-5 h-5 text-[#555]" />
                          <span className="text-[12px] font-mono uppercase tracking-[3px] text-[#555]">Copy to Clipboard</span>
                        </>
                      )}
                    </button>
                    
                    <button 
                      onClick={reset} 
                      className="text-[11px] font-mono uppercase tracking-[3px] text-[#333] hover:text-[#00ff62] transition-colors flex items-center gap-2"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Generate New
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 flex flex-col items-center justify-center opacity-40"
                >
                  {isProcessing ? (
                    <div className="flex flex-col items-center gap-4">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 rounded-full border-b-2 border-[#00ff62]"
                      />
                      <span className="text-[10px] font-mono uppercase tracking-[4px] animate-pulse">Analyzing...</span>
                    </div>
                  ) : (
                    <>
                      <Wifi className="w-12 h-12 text-[#222] mb-4" />
                      <span className="text-[10px] font-mono uppercase tracking-[4px] text-[#222]">Waiting for Input</span>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-8 space-y-6">
          <div className="relative">
            <label htmlFor="wifi-name" className="text-[9px] uppercase tracking-[3px] text-[#444] absolute -top-5 left-0">
              Input SSID / Hardware Addr
            </label>
            <div className="flex items-center border-b border-[#222] group-focus-within:border-[#00ff62] transition-colors">
              <input
                id="wifi-name"
                type="text"
                placeholder="SSID_F1E2D3..."
                autoComplete="off"
                className="w-full bg-transparent border-none text-[28px] font-bold font-mono text-white py-4 outline-none placeholder:text-[#1a1a1a]"
                value={wifiName}
                onChange={(e) => setWifiName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && calculatePassword()}
              />
              <div className="flex gap-1 pr-2">
                <div className={`w-1.5 h-1.5 rounded-full ${wifiName ? 'bg-[#00ff62]' : 'bg-[#1a1a1a]'}`} />
              </div>
            </div>
          </div>

          <button
            onClick={calculatePassword}
            disabled={isProcessing || !wifiName}
            className="group relative w-full h-16 overflow-hidden rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            <div className="absolute inset-0 bg-white group-hover:bg-[#00ff62] transition-colors" />
            <span className="relative z-10 text-[#050505] font-black uppercase text-[15px] tracking-[2px]">
              Extract Key
            </span>
            <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20 group-hover:opacity-0 transition-opacity" />
          </button>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl"
              >
                <p className="text-red-400 text-[10px] font-mono uppercase text-center tracking-wider">
                  Error: {error}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between items-center opacity-30 px-2">
            <span className="text-[7px] font-mono uppercase tracking-widest text-[#444]">V 1.0.4-Stable</span>
            <span className="text-[7px] font-mono uppercase tracking-widest text-[#444]">© 2026 WLN_REC</span>
          </div>
        </div>

        {/* Bottom Hardware Bar */}
        <div className="mt-auto pt-6 flex flex-col items-center">
          <div className="w-12 h-1 bg-[#222] rounded-full" />
        </div>
      </motion.div>
    </div>
  );
}
