"use client"

import { useCallback, useEffect, useState } from "react"

const STORAGE_KEY = "majestic_city_saved_shops_v1"

/**
 * SSR-safe local storage hook for saving favourite / bookmarked stores.
 * Dispatches custom events so multiple components stay synchronised in real time.
 */
export function useShopBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          setBookmarks(parsed)
        }
      }
    } catch {
      // Ignore localStorage errors
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Listen for storage changes across tabs or window events
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue)
          if (Array.isArray(parsed)) setBookmarks(parsed)
        } catch {
          // ignore
        }
      }
    }

    const handleCustom = (e: CustomEvent<string[]>) => {
      if (e.detail && Array.isArray(e.detail)) {
        setBookmarks(e.detail)
      }
    }

    window.addEventListener("storage", handleStorage)
    window.addEventListener("majestic:bookmarks:change" as never, handleCustom)
    return () => {
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener("majestic:bookmarks:change" as never, handleCustom)
    }
  }, [])

  const saveBookmarks = useCallback((next: string[]) => {
    setBookmarks(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      window.dispatchEvent(
        new CustomEvent("majestic:bookmarks:change", { detail: next })
      )
    } catch {
      // ignore storage write errors
    }
  }, [])

  const toggleBookmark = useCallback(
    (id: string) => {
      const next = bookmarks.includes(id)
        ? bookmarks.filter((item) => item !== id)
        : [...bookmarks, id]
      saveBookmarks(next)
    },
    [bookmarks, saveBookmarks]
  )

  const isBookmarked = useCallback(
    (id: string) => bookmarks.includes(id),
    [bookmarks]
  )

  const clearBookmarks = useCallback(() => {
    saveBookmarks([])
  }, [saveBookmarks])

  return {
    bookmarks,
    isBookmarked,
    toggleBookmark,
    clearBookmarks,
    count: bookmarks.length,
    isLoaded,
  }
}
