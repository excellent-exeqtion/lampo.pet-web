// hooks/useDeviceDetect.ts
import { useState, useEffect } from 'react'

export function useDeviceDetect() {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth
      setIsMobile(w <= 767)
      setIsTablet(w > 767 && w <= 1024)
      setIsDesktop(w > 1024)
    }

    onResize() // run once on mount
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return { isMobile, isTablet, isDesktop }
}
