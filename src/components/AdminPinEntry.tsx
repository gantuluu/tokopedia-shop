import React, { useState } from 'react';
import { Lock, ShieldCheck, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminPinEntryProps {
  onSuccess: () => void;
}

export default function AdminPinEntry({ onSuccess }: AdminPinEntryProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const correctPin = '6776123';

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 6) {
      setPin(value);
      setError(false);
      
      if (value === correctPin) {
        onSuccess();
      } else if (value.length === 6) {
        setError(true);
        setTimeout(() => setPin(''), 1000);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-full bg-gray-50 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
      >
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600">
            <Lock size={32} />
          </div>
          
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">Akses Admin</h1>
            <p className="text-gray-500 text-sm">Masukkan PIN keamanan untuk melanjutkan</p>
          </div>

          <div className="w-full relative">
            <input
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={handlePinChange}
              placeholder="••••••"
              className={`w-full text-center text-3xl tracking-[1em] font-mono py-4 border-2 rounded-2xl outline-none transition-all ${
                error ? 'border-red-500 bg-red-50 text-red-600' : 'border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-50/50'
              }`}
              autoFocus
            />
            
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute -bottom-8 left-0 right-0 text-center"
                >
                  <span className="text-red-500 text-sm font-medium flex items-center justify-center gap-1">
                    <XCircle size={14} /> PIN Salah, coba lagi
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-3 gap-4 w-full pt-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'del'].map((num, i) => (
              <button
                key={i}
                onClick={() => {
                  if (num === 'del') {
                    setPin(p => p.slice(0, -1));
                    setError(false);
                  } else if (typeof num === 'number' && pin.length < 6) {
                    const nextPin = pin + num;
                    setPin(nextPin);
                    setError(false);
                    if (nextPin === correctPin) onSuccess();
                    else if (nextPin.length === 6) {
                      setError(true);
                      setTimeout(() => setPin(''), 1000);
                    }
                  }
                }}
                disabled={num === ''}
                className={`h-16 flex items-center justify-center rounded-2xl text-xl font-semibold transition-all ${
                  num === '' ? 'bg-transparent' : 'bg-gray-50 hover:bg-gray-100 active:scale-95 text-gray-700'
                }`}
              >
                {num === 'del' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/><line x1="18" y1="9" x2="12" y2="15"/><line x1="12" y1="9" x2="18" y2="15"/></svg>
                ) : num}
              </button>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2 text-gray-400 text-xs uppercase tracking-widest font-medium">
            <ShieldCheck size={14} />
            <span>Secure Connection</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
