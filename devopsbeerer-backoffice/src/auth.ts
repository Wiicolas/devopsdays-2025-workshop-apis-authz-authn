import NextAuth from "next-auth"
import type { Provider } from "next-auth/providers"
import Keycloak from "next-auth/providers/keycloak"

const providers: Provider[] = [
    Keycloak
]


export const { handlers, auth, signIn, signOut } = NextAuth({
    providers,
    callbacks: {
        authorized: async ({ auth }) => {
            return !!auth
        },
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
