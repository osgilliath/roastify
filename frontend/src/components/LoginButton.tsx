import { signIn } from "@/auth";

export default function LoginButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("spotify", { callbackUrl: "http://127.0.0.1:3000" });
      }}
    >
      <button
        type="submit"
        className="bg-[#1DB954] text-black font-bold py-4 px-8 rounded-full hover:bg-[#1ed760] transition-all hover:scale-105 active:scale-95 text-lg cursor-pointer"
      >
        Connect with Spotify
      </button>
    </form>
  );
}
