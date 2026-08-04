import { useCallback, useState } from 'react'

/**
 * Copy text to clipboard with a transient "copied" flag for UI feedback.
 * Falls back to a hidden textarea + execCommand when the async Clipboard API
 * is unavailable (older browsers / non-secure contexts).
 */
export function useCopy(timeout = 2000): {
  copied: boolean
  copy: (text: string) => Promise<boolean>
} {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text)
        } else {
          const ta = document.createElement('textarea')
          ta.value = text
          ta.style.position = 'fixed'
          ta.style.opacity = '0'
          document.body.appendChild(ta)
          ta.select()
          document.execCommand('copy')
          document.body.removeChild(ta)
        }
        setCopied(true)
        window.setTimeout(() => setCopied(false), timeout)
        return true
      } catch {
        setCopied(false)
        return false
      }
    },
    [timeout]
  )

  return { copied, copy }
}
