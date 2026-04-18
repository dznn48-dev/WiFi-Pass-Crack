/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wifi, Key, Copy, Check, RotateCcw } from 'lucide-react';

export default function App() {
  const [wifiName, setWifiName] = useState('');
  const [password, setPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculatePassword = () => {
    setError(null);
    setPassword(null);

    const trimmedInput = wifiName.trim();
    let hexPart = '';

    if (trimmedInput.includes('_')) {
      const parts = trimmedInput.split('_');
      hexPart = parts[1].substring(0, 6);
    } else {
      hexPart = trimmedInput.substring(0, 6);
    }

    if (hexPart.length < 6) {
       setError("Need 6 characters (e.g. 2dfc4e)");
       return;
    }

    try {
      const hexValue = parseInt(hexPart, 16);
      if (isNaN(hexValue)) {
        setError("Invalid hex characters");
        return;
      }

      const result = 0xffffff - hexValue;
      const hexResult = result.toString(16).padStart(6, '0').toLowerCase();
      setPassword(`wlan${hexResult}`);
    } catch (e) {
      setError("An unexpected error occurred during calculation.");
    }
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
    <div className="min-h-screen bg-[#111111] flex items-center justify-center p-4 font-sans text-white">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-[380px] h-[680px] bg-[#050505] rounded-[48px] border-8 border-[#222] shadow-[0_40px_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col p-[40px_30px]"
      >
        {/* Decorative Circle Accent */}
        <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] bg-radial-[circle] from-[#00ff620d] to-transparent pointer-events-none" />

        {/* Title Area */}
        <div className="mb-[40px] pt-10">
          <h1 className="text-[48px] leading-[0.9] font-black uppercase tracking-[-2px]">
            Key<br />Gen
          </h1>
          <p className="text-[#777777] text-[14px] font-medium mt-2">Universal WiFi recovery tool.</p>
        </div>

        {/* Result Area */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {password ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-end">
                  <label className="text-[10px] uppercase tracking-[2px] text-[#777777]">Generated Password</label>
                  <button onClick={reset} className="text-[#777777] hover:text-white transition-colors">
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between group">
                  <span className="text-[42px] font-mono font-bold text-[#00ff62] tracking-[-1px] break-all">
                    {password}
                  </span>
                  <button
                    onClick={copyToClipboard}
                    className="p-2 text-[#777777] hover:text-[#00ff62] transition-colors"
                  >
                    {copied ? <Check className="w-5 h-5 text-[#00ff62]" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-[11px] text-[#777777] leading-relaxed">
                  Based on hardware suffix {wifiName.split('_')[1]?.substring(0, 6)}.
                </p>
              </motion.div>
            ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="pt-10 flex flex-col items-center opacity-10"
                >
                  <Key className="w-16 h-16 text-white" />
                </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <div className="mt-auto mb-[30px] space-y-6">
          <div className="space-y-3">
            <label htmlFor="wifi-name" className="text-[10px] uppercase tracking-[2px] text-[#777777]">
              Network Name
            </label>
            <input
              id="wifi-name"
              type="text"
              placeholder="Fh_2dfc4e"
              className="w-full bg-transparent border-none border-b-2 border-[#333] text-[32px] font-bold font-mono text-white py-3 outline-none focus:border-[#00ff62] transition-colors placeholder:text-[#222]"
              value={wifiName}
              onChange={(e) => setWifiName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && calculatePassword()}
            />
          </div>

          <button
            onClick={calculatePassword}
            className="w-full h-[64px] bg-white text-[#050505] rounded-xl font-[800] uppercase text-[16px] tracking-wider hover:bg-[#00ff62] active:scale-[0.98] transition-all"
          >
            Get Password
          </button>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-500 text-[11px] font-medium text-center"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <p className="text-[11px] text-[#777777] text-center mt-4">
            Enter the full SSID name exactly as shown.
          </p>
        </div>

        {/* Decoration Bar */}
        <div className="w-[40px] h-[4px] bg-[#333] rounded-[2px] self-center mb-1" />
      </motion.div>
    </div>
  );
}
