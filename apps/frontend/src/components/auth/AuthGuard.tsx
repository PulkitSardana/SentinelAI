"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "@/store/use-auth-store"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isAuthenticated && !pathname.startsWith('/login') && !pathname.startsWith('/signup') && pathname !== '/') {
      router.push('/login')
    }
  }, [isAuthenticated, mounted, pathname, router])

  if (!mounted) {
    return null // Prevent hydration mismatch
  }

  // If not authenticated and trying to access a protected route, don't render children
  if (!isAuthenticated && !pathname.startsWith('/login') && !pathname.startsWith('/signup') && pathname !== '/') {
    return null
  }

  return <>{children}</>
}
