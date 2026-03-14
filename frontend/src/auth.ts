import NextAuth from "next-auth"
import Spotify from "next-auth/providers/spotify"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Spotify({
      authorization: "https://accounts.spotify.com/authorize?scope=user-top-read",
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