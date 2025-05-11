import { providerMap, signIn } from "@/auth"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AuthError } from "next-auth"
import { redirect } from "next/navigation"

export function LoginForm({
  className,
  searchParams,
  ...props
}: any) {
  const o = Object.values(providerMap);

  return o.map(provider => (
    <form key={provider.id} className={cn("flex flex-col gap-6", className)} {...props} action={async () => {
      "use server"
      try {
        await signIn(provider.id, {
          redirectTo: searchParams?.callbackUrl ?? "",
        })
      } catch (error) {
        // Signin can fail for a number of reasons, such as the user
        // not existing, or the user not having the correct role.
        // In some cases, you may want to redirect to a custom error
        if (error instanceof AuthError) {
          return redirect(`?error=${error.type}`)
        }

        // Otherwise if a redirects happens Next.js can handle it
        // so you can just re-thrown the error and let Next.js handle it.
        // Docs:
        // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
        throw error
      }
    }}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Connect through your SSO
        </p>
      </div>
      <div className="grid gap-6">
        <Button variant="outline" className="w-full">
          Login with Keycloak
        </Button>
      </div>
    </form>))
}
