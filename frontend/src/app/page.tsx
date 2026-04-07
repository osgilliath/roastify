import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Music } from "lucide-react";
import Roaster from "@/components/roaster";
import LoginButton from "@/components/LoginButton";

export default async function Home() {
  const session = await getServerSession(authOptions);;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#090909] text-white p-6 font-sans selection:bg-[#1DB954] selection:text-black">
      <div className="text-center space-y-8 max-w-4xl w-full">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-[#1DB954] rounded-2xl shadow-[0_0_30px_rgba(29,185,84,0.3)]">
              <Music size={40} className="text-black" />
            </div>
          </div>
          <h1 className="text-7xl font-black tracking-tighter italic uppercase leading-none">
            Roast My <br />
            <span className="text-[#1DB954]">Taste.</span>
          </h1>
        </div>

        <div className="bg-[#121212] border border-white/10 p-8 rounded-3xl shadow-2xl min-h-[250px] flex flex-col justify-center items-center">
          {session ? (
            <Roaster accessToken={session.accessToken} />
          ) : (
            <div className="space-y-6">
              <p className="text-gray-400 font-mono text-sm">
                Connect Spotify. Let AI judge your questionable life choices.
              </p>
              <LoginButton />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}