"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function SignOutPage() {
    const router = useRouter();
    
    useEffect(() => {
        // This page is shown after the user is redirected back from Keycloak
        // Complete the client-side logout to clear the Next.js session
        const completeSignOut = async () => {
            try {
                await signOut({ redirect: false });
                // After signout is complete, redirect to home
                router.push("/");
            } catch (error) {
                console.error("Error during sign out:", error);
                router.push("/");
            }
        };
        
        completeSignOut();
    }, [router]);
    
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Signing you out...</h1>
                <p>Please wait while we complete the logout process.</p>
            </div>
        </div>
    );
}