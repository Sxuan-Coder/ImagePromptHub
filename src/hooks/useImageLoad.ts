import { useEffect, useState } from 'react'

type Status = 'idle' | 'loading' | 'loaded' | 'error'

/**
 * Track the load status of an <img> source. Returns the current status so
 * callers can show a skeleton/blur-up while loading and a fallback on error.
 */
export function useImageLoad(src: string): Status {
  const [status, setStatus] = useState<Status>('idle')

  useEffect(() => {
    // Reset whenever the source changes.
    setStatus('loading')

    const img = new Image()
    img.src = src

    let active = true
    const onLoad = () => active && setStatus('loaded')
    const onError = () => active && setStatus('error')

    if (img.complete) {
      // Cached: resolve synchronously-ish.
      setStatus(img.naturalWidth > 0 ? 'loaded' : 'error')
      return
    }

    img.addEventListener('load', onLoad)
    img.addEventListener('error', onError)
    return () => {
      active = false
      img.removeEventListener('load', onLoad)
      img.removeEventListener('error', onError)
    }
  }, [src])

  return status
}
