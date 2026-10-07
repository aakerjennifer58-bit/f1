import { useEffect, useState } from 'react'

export function SplashScreen() {
  const [visible, setVisible] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // Start fade out after 2.5 seconds
    const fadeTimer = setTimeout(() => setFadeOut(true), 2500)
    // Remove from DOM after fade completes
    const hideTimer = setTimeout(() => setVisible(false), 3000)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  if (!visible) return null

  return (
    <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}>
      <img
        src="/splash.gif"
        alt="Loading"
        className="max-w-[280px] w-full"
      />
    </div>
  )
}
