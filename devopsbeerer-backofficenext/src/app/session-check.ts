'use client'

import { useSession, signOut } from "next-auth/react"
import { useEffect, useRef } from "react"

export function SessionCheck() {
  const { data: session } = useSession()
  const checkingRef = useRef(false)

  useEffect(() => {
    if (session?.error && !checkingRef.current) {
      checkingRef.current = true;
      if (session.error === "TokenExpired" || session.error === "RefreshAccessTokenError") {
        signOut();
      }
      checkingRef.current = false;
    }
  }, [session?.error])

  return null
}
