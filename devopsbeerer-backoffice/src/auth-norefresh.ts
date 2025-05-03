import NextAuth from "next-auth"
import type { Provider } from "next-auth/providers"
import Keycloak from "next-auth/providers/keycloak"
import { jwtDecode } from "jwt-decode"

const providers: Provider[] = [
    Keycloak({
        authorization: {
            params: {
                scope: "openid email profile Beers.Read.All Beers.Read Beers.Write"
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
                const decodedToken = jwtDecode(account.access_token!);
                console.log("New account login, setting initial token", {
                    exp: decodedToken.exp,
                    current_time: Math.floor(Date.now() / 1000)
                });
                return {
                    ...token,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    exp: decodedToken.exp
                }
            }

            // Ensure we're comparing timestamps in the same format (seconds)
            const currentTime = Math.floor(Date.now());
            const tokenExp = typeof token.exp === 'number' ? token.exp : 0;

            console.log("Checking token expiration", {
                token_exp: tokenExp,
                current_time: currentTime,
                is_expired: currentTime > tokenExp,
                difference_seconds: tokenExp - currentTime
            });

            // Return previous token if the access token has not expired yet
            if (tokenExp && currentTime < tokenExp) {
                return token
            }

            // Add a guard to prevent refresh loops
            const lastRefresh = token.lastRefresh as number || 0;
            const minRefreshInterval = 10; // minimum seconds between refresh attempts

            if (currentTime - lastRefresh < minRefreshInterval) {
                console.log("Skipping refresh - too soon since last refresh");
                return token;
            }

            // Token has expired
            if (!token.refreshToken) {
                console.log("No refresh token available, marking as expired");
                return {
                    ...token,
                    error: "TokenExpired"
                }
            }

            // Access token has expired, try to refresh it
            try {
                const refreshedTokens = await refreshAccessToken(token.refreshToken as string)
                const decodedNewToken = jwtDecode(refreshedTokens.access_token);

                console.log("Token refreshed successfully", {
                    new_exp: decodedNewToken.exp,
                    current_time: Math.floor(Date.now() / 1000)
                });

                return {
                    ...token,
                    accessToken: refreshedTokens.access_token,
                    refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
                    exp: decodedNewToken.exp,
                    lastRefresh: Math.floor(Date.now() / 1000),
                    error: undefined // Clear any previous errors
                }
            } catch (error) {
                console.error("Error refreshing access token", error)
                return {
                    ...token,
                    error: "RefreshAccessTokenError"
                }
            }
        },
        async session({ session, token }) {
            console.log("Setting session from token", {
                has_error: !!token.error,
                error_type: token.error,
                token_exp: token.exp,
                current_time: Math.floor(Date.now() / 1000)
            });

            session.accessToken = token.accessToken as string;
            session.error = token.error as string || '';
            return session
        }
    },
    pages: {
        signIn: "/signin",
    },
    trustHost: true,
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

        return refreshedTokens
    } catch (error) {
        console.error("Error refreshing token:", error)
        throw error
    }
}