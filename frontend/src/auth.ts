import NextAuth from "next-auth"
import Spotify from "next-auth/providers/spotify"

declare module "next-auth" {
  interface Session {
    accessToken?: string
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  providers: [
    Spotify({
      clientId: process.env.AUTH_SPOTIFY_ID,
      clientSecret: process.env.AUTH_SPOTIFY_SECRET,
      authorization: {
        url: "https://accounts.spotify.com/authorize",
        params: {
          scope: "user-top-read",
          redirect_uri: "http://127.0.0.1:3000/api/auth/callback/spotify",
         },
      },
      token: {
  url: "https://accounts.spotify.com/api/token",
  async request(context) {
    const params = new URLSearchParams({
      grant_type: "authorization_code",
      code: context.params.code as string,
      redirect_uri: "http://127.0.0.1:3000/api/auth/callback/spotify",
      client_id: process.env.AUTH_SPOTIFY_ID!,
      client_secret: process.env.AUTH_SPOTIFY_SECRET!,
    })

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    })

    const tokens = await response.json()
    console.log("Spotify response:", JSON.stringify(tokens, null, 2))
    return { tokens }
  },
},
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken
      return session
    },
  },
})