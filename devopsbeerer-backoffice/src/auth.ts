import NextAuth from "next-auth"
import type { Provider } from "next-auth/providers"
import Keycloak from "next-auth/providers/keycloak"

const providers: Provider[] = [
    Keycloak({
        authorization: {
            params: {
                scope: "openid email profile"
            }
        }
    })
]

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers,
    callbacks: {
        authorized: async ({ auth }) => {
            return !!auth
        },
        async jwt({ token, account }) {

            if (account) {
                return {
                    ...token,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    expiresAt: account.expires_at ? account.expires_at * 1000 : 0
                }
            }

            if (token.expiresAt && Date.now() < token.exp!) {
                return token
            }

            if (token.refreshToken) {
                try {
                    const refreshedTokens = await refreshAccessToken(token.refreshToken as string)

                    return {
                        ...token,
                        accessToken: refreshedTokens.access_token,
                        refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
                        expiresAt: refreshedTokens.expires_at ? refreshedTokens.expires_at * 1000 : 0,
                    }
                } catch (error) {
                    console.error("Error refreshing access token", error)

                    return {
                        ...token,
                        error: "RefreshAccessTokenError"
                    }
                }
            }

            return {
                ...token,
                error: "TokenExpired"
            }
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken as string
            return session
        }
    },
    pages: {
        signIn: "/signin",
    },
})

export const providerMap = providers
    .map((provider) => {
        if (typeof provider === "function") {
            const providerData = provider()
            return { id: providerData.id, name: providerData.name }
        } else {
            return { id: provider.id, name: provider.name }
        }
    })
    .filter((provider) => provider.id !== "credentials")

async function refreshAccessToken(refreshToken: string) {
    try {
        const url = `${process.env.AUTH_KEYCLOAK_ISSUER}/protocol/openid-connect/token`

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: process.env.AUTH_KEYCLOAK_ID!,
                client_secret: process.env.AUTH_KEYCLOAK_SECRET!,
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            }),
        })

        const refreshedTokens = await response.json()

        if (!response.ok) {
            throw refreshedTokens
        }

        // Calculate new expiration time
        refreshedTokens.expires_at = Math.floor(Date.now() / 1000) + refreshedTokens.expires_in

        return refreshedTokens
    } catch (error) {
        console.error("Error refreshing token:", error)
        throw error
    }
}