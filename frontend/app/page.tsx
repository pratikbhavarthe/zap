"use client"

import React from "react"
import { useLocalStorage } from "../hooks/useLocalStorage"
import Buddy from "@/components/Buddy"
import { Footer } from "./components/Footer"
import { Header } from "./components/Header"

export default function Home() {
  const [displayName, setDisplayName] = useLocalStorage<string | null>("displayName", null)
  const [, setClientId] = useLocalStorage<string | null>("clientId", null)

  const handleClearCache = React.useCallback(() => {
    setDisplayName(null)
    setClientId(null)
    window.location.reload()
  }, [setDisplayName, setClientId])

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      <Header onClearCache={handleClearCache} />

      <main className="flex max-h-screen w-full flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden">
          <Buddy />
        </div>
      </main>

      <Footer displayName={displayName} />
    </div>
  )
}

