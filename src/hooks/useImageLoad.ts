import { useEffect, useMemo, useState } from 'react'
import { imageSources } from '../lib/images'

type Status = 'idle' | 'loading' | 'loaded' | 'error'

export interface ImageLoadResult {
  status: Status
  /** The URL actually being shown — the first candidate that resolved. */
  src: string
}

/**
 * Track the load status of an <img> source with automatic CDN fallback.
 *
 * The original URL is expanded into ordered candidates by {@link imageSources}
 * (e.g. GitHub raw → jsDelivr → fastly → raw). Candidates are tried one by
 * one: on failure the hook advances to the next, and the returned `src`
 * always points at whichever candidate is currently in play — so callers can
 * render `<img src={src}>` and get graceful degradation for free.
 */
export function useImageLoad(originalSrc: string): ImageLoadResult {
  const candidates = useMemo(() => imageSources(originalSrc), [originalSrc])
  const [attempt, setAttempt] = useState(0)
  const [status, setStatus] = useState<Status>('idle')

  const src = candidates[Math.min(attempt, candidates.length - 1)] ?? ''

  // Restart from the primary candidate whenever the source set changes.
  useEffect(() => {
    setAttempt(0)
  }, [candidates])

  useEffect(() => {
    if (candidates.length === 0) {
      setStatus('idle')
      return
    }
    const candidate = candidates[attempt]
    if (!candidate) {
      setStatus('error')
      return
    }

    setStatus('loading')
    let active = true
    const img = new Image()
    img.src = candidate

    const advanceOrError = () => {
      if (!active) return
      if (attempt + 1 < candidates.length) {
        setAttempt((a) => a + 1) // try the next mirror
      } else {
        setStatus('error')
      }
    }

    const onLoad = () => active && setStatus('loaded')
    const onError = advanceOrError

    img.addEventListener('load', onLoad)
    img.addEventListener('error', onError)

    // Cached: resolve synchronously-ish (mirrors the original behavior),
    // including the "cached-but-broken" case which advances to the next mirror.
    if (img.complete) {
      if (img.naturalWidth > 0) setStatus('loaded')
      else advanceOrError()
    }

    return () => {
      active = false
      img.removeEventListener('load', onLoad)
      img.removeEventListener('error', onError)
    }
  }, [attempt, candidates])

  return { status, src }
}
