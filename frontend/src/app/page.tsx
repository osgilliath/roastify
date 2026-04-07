import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import Roaster from "@/components/roaster";
import LoginButton from "@/components/LoginButton";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className="w">
      <div className="scanline"></div>

      {/* ── GitHub icon — top left ── */}
      <a
        href="https://github.com/osgilliath"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
        className="github-btn"
      >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
        </svg>
        <span>~/github</span>
      </a>

      <div className="inner">
        <div className="brand anim">
          <div className="logo-wrap">
            <svg viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="7" fill="#0d1a0d" />
              <path d="M7 18l4-8 4 6 3-4 3 6" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="logo-dot"></span>
          </div>
          <h1><span className="w1">ROAST MY</span><span className="w2">TASTE.</span></h1>
        </div>

        <div className="terminal anim" style={{ animationDelay: "0.1s" }}>
          <div className="term-bar">
            <span className="dot dot-r"></span>
            <span className="dot dot-y"></span>
            <span className="dot dot-g"></span>
            <span className="term-title">roast-my-taste ~ bash</span>
          </div>
          <div className="term-body" id="term-body">
            {session ? (
              <Roaster accessToken={session.accessToken} />
            ) : (
              <div id="view-idle">
                <div className="prompt-row">
                  <span className="prompt-sym">❯</span>
                  <span className="prompt-cmd">roast --connect spotify --verdict harsh<span className="cursor"></span></span>
                </div>
                <div className="cta-area flex-col items-center gap-4">
                  <span className="out-line out-dim">// connect spotify to let AI judge your life choices</span>
                  <LoginButton />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}