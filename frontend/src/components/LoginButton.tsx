"use client"
import { signIn } from "next-auth/react"

export default function LoginButton() {
  return (
    <button
      onClick={() => signIn("spotify", { callbackUrl: "/" })}
      className="btn-run"
    >
      [ CONNECT SPOTIFY ]
    </button>
  )
}