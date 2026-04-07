"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Loader2, Sparkles, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function Roaster({ accessToken }: { accessToken: string }) {
  const [data, setData] = useState<{ roast: string; badge: string; rating: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  const generateRoast = async () => {
    setLoading(true);
    setError("");
    setData(null);
    setIsExpired(false);

    try {
      const response = await fetch("http://127.0.0.1:8000/roast", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 401) {
        setIsExpired(true);
        throw new Error("Spotify session expired. Please re-login.");
      }

      if (!response.ok) throw new Error("Backend is offline or failed to fetch roast");

      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {!data && !loading && (
        <button
          onClick={generateRoast}
          className="group relative bg-white text-black font-bold py-4 px-10 rounded-full text-xl transition-all hover:scale-105 active:scale-95 overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            DO YOUR WORST <Flame size={20} className="group-hover:text-orange-500 transition-colors" />
          </span>
        </button>
      )}

      {loading && (
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="animate-spin text-[#1DB954]" size={40} />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-mono text-gray-400 text-sm animate-pulse uppercase tracking-widest"
          >
            Analyzing your basic-ness...
          </motion.p>
        </div>
      )}

      <AnimatePresence>
        {data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-left w-full space-y-6"
          >
            <div className="flex items-center gap-2 text-[#1DB954] font-mono text-xs font-bold uppercase tracking-widest border-b border-white/10 pb-2">
              <Sparkles size={14} /> The Verdict
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-4">
                <p className="text-lg md:text-xl font-medium leading-relaxed text-gray-100 italic">
                  "{data.roast}"
                </p>
              </div>
              
              <div className="space-y-6 border-l border-white/10 pl-0 md:pl-8">
                <div>
                  <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-2">Taste Badge</h3>
                  <div className="inline-block px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-500 rounded-sm text-sm font-black uppercase italic">
                    {data.badge}
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-2">Vibe Rating</h3>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Flame 
                        key={star} 
                        size={18} 
                        className={star <= data.rating ? "text-orange-500 fill-orange-500" : "text-gray-800"} 
                      />
                    ))}
                    <span className="ml-2 text-xs font-mono text-gray-400 self-center">
                      {data.rating}/5
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 flex justify-center">
              <button 
                onClick={() => setData(null)}
                className="text-sm text-gray-500 hover:text-white transition-colors border border-gray-600 hover:border-white rounded-full px-6 py-2"
              >
                Go again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="flex flex-col items-center gap-4">
          <p className="mt-4 text-red-400 font-mono text-xs bg-red-500/10 p-3 rounded-lg border border-red-500/20">
            {error}
          </p>
          {isExpired && (
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 text-sm text-white bg-red-500/20 hover:bg-red-500/40 border border-red-500/50 px-4 py-2 rounded-full transition-all"
            >
              <LogOut size={14} /> Re-connect Spotify
            </button>
          )}
        </div>
      )}
    </div>
  );
}
