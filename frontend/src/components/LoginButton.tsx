"use client";
import { signIn } from "next-auth/react";

export default function LoginButton() {
  return (
    <button
      onClick={() => signIn("spotify")}
      className="bg-[#1DB954] text-black font-bold py-4 px-8 rounded-full hover:bg-[#1ed760] transition-all hover:scale-105 active:scale-95 text-lg"
    >
      Connect with Spotify
    </button>
  );
}