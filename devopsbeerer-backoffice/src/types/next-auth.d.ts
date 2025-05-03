// types/next-auth.d.ts
import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken: string
    refreshToken?: string
    idToken?: string
    roles: string[]
    error: string
    expiresAt: number
  }

  interface JWT {
    accessToken: string
    refreshToken?: string
    idToken?: string
    roles: string[]
    expiresAt: number
    error?: string
  }
}