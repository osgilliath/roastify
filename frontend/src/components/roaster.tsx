"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const QUIPS = [
  "analyzing your basic-ness...",
  "diagnosing your disorder...",
  "consulting the music gods...",
  "processing your L's...",
  "measuring cringe levels...",
];

export default function Roaster({ accessToken }: { accessToken: string }) {
  const [data, setData] = useState<{ roast: string; badge: string; rating: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isExpired, setIsExpired] = useState(false);
  const [quipIndex, setQuipIndex] = useState(0);

  const generateRoast = async () => {
    setLoading(true);
    setError("");
    setData(null);
    setIsExpired(false);

    // Rotate quips while loading
    let qi = 0;
    const iv = setInterval(() => {
      qi = (qi + 1) % QUIPS.length;
      setQuipIndex(qi);
    }, 900);

    try {
      const response = await fetch("http://127.0.0.1:8000/roast", {
        headers: { Authorization: `Bearer ${accessToken}` },
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
      clearInterval(iv);
      setLoading(false);
    }
  };

  // ── ERROR STATE ──
  if (error) {
    return (
      <div id="view-idle" className="anim">
        <div className="prompt-row">
          <span className="prompt-sym">❯</span>
          <span className="prompt-cmd">roast --connect spotify --verdict harsh</span>
        </div>
        <div className="output-block mt-2 mb-4">
          <span className="out-line out-err">error: {error}</span>
        </div>
        <div className="flex flex-col items-center gap-3">
          {isExpired && (
            <button
              onClick={() => signOut()}
              className="btn-again flex items-center gap-2"
              style={{ borderColor: "rgba(239,68,68,0.4)", color: "#ef4444" }}
            >
              <LogOut size={13} /> re-connect spotify
            </button>
          )}
          <button className="btn-again" style={{ marginTop: 0 }} onClick={generateRoast}>
            ↩ retry
          </button>
        </div>
      </div>
    );
  }

  // ── LOADING STATE ──
  if (loading) {
    return (
      <div id="view-loading">
        <div className="prompt-row">
          <span className="prompt-sym">❯</span>
          <span className="prompt-cmd">roast --connect spotify --verdict harsh</span>
        </div>
        <div className="output-block">
          <span className="out-line out-dim">// connecting to spotify api...</span>
          <span className="out-line out-dim">// fetching top tracks &amp; artists...</span>
          <div className="spinner-row">
            <div className="sp"></div>
            <span className="sp-text">{QUIPS[quipIndex]}</span>
          </div>
        </div>
      </div>
    );
  }

  // ── VERDICT STATE ──
  if (data) {
    return (
      <div id="view-verdict" className="anim">
        <div className="prompt-row">
          <span className="prompt-sym">❯</span>
          <span className="prompt-cmd">roast --connect spotify --verdict harsh</span>
        </div>
        <div className="output-block">
          <span className="out-line out-dim">// analysis complete. brace yourself.</span>
          <span className="out-line out-dim">──────────────────────────────────────</span>
          <span className="out-line out-main">&ldquo;{data.roast}&rdquo;</span>
          <span className="out-line out-dim" style={{ marginTop: "8px" }}>
            ──────────────────────────────────────
          </span>
          <span className="out-line" style={{ marginTop: "4px" }}>
            <span className="out-dim">exit code </span>
            <span className="out-err">{data.rating <= 2 ? "1" : "0"}</span>
            <span className="out-dim">  // skill issue detected</span>
          </span>
        </div>
        <div className="sidebar">
          <div className="stat-card">
            <div className="stat-lbl">// taste_badge</div>
            <span className="badge">{data.badge}</span>
          </div>
          <div className="stat-card">
            <div className="stat-lbl">// vibe_rating</div>
            <div className="flames">
              {[1, 2, 3, 4, 5].map((n) => (
                <span key={n} className={`flame ${n <= data.rating ? "on" : "off"}`}>
                  <svg width="12" height="14" viewBox="0 0 12 14">
                    <path d="M6 1C6 1 9.5 4.5 9.5 7.5C9.5 9.5 8 11 6 13C4 11 2.5 9.5 2.5 7.5C2.5 4.5 6 1 6 1Z" />
                  </svg>
                </span>
              ))}
              <span className="rating-num">{data.rating}/5</span>
            </div>
          </div>
        </div>
        <div className="again-row">
          <button className="btn-again" onClick={() => setData(null)}>
            ↩ roast --reset
          </button>
        </div>
      </div>
    );
  }

  // ── IDLE STATE (Default) ──
  return (
    <div id="view-idle">
      <div className="prompt-row">
        <span className="prompt-sym">❯</span>
        <span className="prompt-cmd">
          roast --connect spotify --verdict harsh<span className="cursor"></span>
        </span>
      </div>
      <div className="cta-area">
        <button className="btn-run" onClick={generateRoast}>
          [ RUN ]
        </button>
      </div>
    </div>
  );
}