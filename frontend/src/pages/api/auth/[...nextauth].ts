import NextAuth, { NextAuthOptions } from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    error?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    accessTokenExpires?: number
    error?: string
  }
}

async function refreshAccessToken(token: any) {
  try {
    if (!token.refreshToken) {
      console.error("No refresh token available");
      return {
        ...token,
        error: "MissingRefreshTokenError",
      }
    }

    const url = "https://accounts.spotify.com/api/token"
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${process.env.AUTH_SPOTIFY_ID}:${process.env.AUTH_SPOTIFY_SECRET}`
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      }),
    })

    const refreshedTokens = await response.json()

    if (!response.ok) {
      console.error("Spotify Token Refresh Error:", refreshedTokens);
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    }
  } catch (error) {
    console.error("RefreshAccessTokenError:", error)

    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  providers: [
    SpotifyProvider({
      clientId: process.env.AUTH_SPOTIFY_ID!,
      clientSecret: process.env.AUTH_SPOTIFY_SECRET!,
      authorization: {
        params: {
          scope: "user-top-read",
          show_dialog: true,
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      // Initial sign in
      if (account && user) {
        // account.expires_at is a timestamp in seconds
        const expiresAt = account.expires_at 
          ? account.expires_at * 1000 
          : Date.now() + 3600 * 1000;

        return {
          accessToken: account.access_token,
          accessTokenExpires: expiresAt,
          refreshToken: account.refresh_token,
          user,
        }
      }

      // Return previous token if the access token has not expired yet
      // Adding a 1-minute buffer to prevent edge cases
      if (Date.now() < (token.accessTokenExpires as number) - 60000) {
        return token
      }

      // Access token has expired, try to update it
      console.log("Token expired, refreshing...");
      return refreshAccessToken(token)
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.error = token.error
      return session
    },
  },
}

export default NextAuth(authOptions)