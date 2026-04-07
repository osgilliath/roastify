"use client"
import { signIn } from "next-auth/react"

export default function LoginButton() {
  return (
    <button
      onClick={() => signIn("spotify", { callbackUrl: "http://127.0.0.1:3000" })}
      className="btn-run"
    >
      [ CONNECT SPOTIFY ]
    </button>
  )
}