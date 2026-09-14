import { useState, useEffect } from 'react'

/**
 * Hook to detect whether the user is on a mobile or tablet device (< 1024px width).
 * Supports SSR safety and listens to window resize events with debouncing.
 */
export function useIsMobileOrTablet() {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < 1024
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkDevice = () => {
      setIsMobileOrTablet(window.innerWidth < 1024)
    }

    checkDevice()

    let timeoutId = null
    const debouncedResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(checkDevice, 100)
    }

    window.addEventListener('resize', debouncedResize)
    window.addEventListener('orientationchange', checkDevice)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', debouncedResize)
      window.removeEventListener('orientationchange', checkDevice)
    }
  }, [])

  return isMobileOrTablet
}
