"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Loader2, Sparkles } from "lucide-react";

export default function Roaster({ accessToken }: { accessToken: string }) {
  const [roast, setRoast] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateRoast = async () => {
    setLoading(true);
    setError("");
    setRoast("");

    try {
      const response = await fetch("http://127.0.0.1:8000/roast", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error("Backend is offline or token expired");

      const data = await response.json();
      setRoast(data.roast);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {!roast && !loading && (
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
        {roast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-left w-full space-y-6"
          >
            <div className="flex items-center gap-2 text-[#1DB954] font-mono text-xs font-bold uppercase tracking-widest border-b border-white/10 pb-2">
              <Sparkles size={14} /> The Verdict
            </div>
            <p className="text-xl md:text-2xl font-medium leading-relaxed text-gray-100 italic">
              "{roast}"
            </p>
            <div className="pt-4 flex justify-center">
              <button 
                onClick={() => setRoast("")}
                className="text-sm text-gray-500 hover:text-white transition-colors border border-gray-600 hover:border-white rounded-full px-6 py-2"
              >
                Go again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="mt-4 text-red-400 font-mono text-xs bg-red-500/10 p-3 rounded-lg border border-red-500/20">
          {error}
        </p>
      )}
    </div>
  );
}