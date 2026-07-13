"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function KeyboardShortcuts() {
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA" ||
        document.activeElement?.getAttribute("contenteditable") === "true"
      ) {
        return
      }

      // Shift+Key for Navigation
      if (e.shiftKey && !e.metaKey && !e.ctrlKey && !e.altKey) {
        switch (e.key.toLowerCase()) {
          case "d":
            e.preventDefault()
            router.push("/dashboard")
            break
          case "i":
            e.preventDefault()
            router.push("/investigation")
            break
          case "e":
            e.preventDefault()
            router.push("/explainability")
            break
          case "p":
            e.preventDefault()
            router.push("/pipeline")
            break
          case "r":
            e.preventDefault()
            router.push("/registry")
            break
          case "a":
            e.preventDefault()
            router.push("/architecture")
            break
          case "t":
            e.preventDefault()
            router.push("/dev-tools")
            break
          case "s":
            e.preventDefault()
            router.push("/settings")
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [router])

  return null
}
