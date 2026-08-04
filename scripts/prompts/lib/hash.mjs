// @ts-check
/**
 * Stable, dependency-free fingerprint for a prompt.
 *
 * We avoid importing node:crypto to keep the parser trivially portable.
 * A compact SHA-1 implementation is used; the fingerprint only needs
 * collision-resistance (not preimage-resistance), so a 48-bit prefix is
 * more than enough for a low-thousands corpus.
 *
 * Format: `p` + first 12 hex chars of SHA-1(normalize(prompt)[:80]).
 */
import { normalizeForFingerprint } from './normalize.mjs'

// ---- minimal SHA-1 (FIPS 180-1) -------------------------------------------
function sha1(input) {
  const bytes =
    typeof input === 'string'
      ? new TextEncoder().encode(input)
      : new Uint8Array(input)
  const len = bytes.length

  // Pre-processing: padding to 56 mod 64, then 8-byte big-endian length.
  const bitLen = len * 8
  const withOne = len + 1
  const padLen = withOne + ((56 - (withOne % 64) + 64) % 64)
  const data = new Uint8Array(padLen + 8)
  data.set(bytes)
  data[len] = 0x80
  // High 32 bits of length (we cap at <512MB so always 0).
  new DataView(data.buffer).setUint32(padLen + 0, 0, false)
  new DataView(data.buffer).setUint32(padLen + 4, bitLen >>> 0, false)

  let h0 = 0x67452301
  let h1 = 0xefcdab89
  let h2 = 0x98badcfe
  let h3 = 0x10325476
  let h4 = 0xc3d2e1f0

  const w = new Int32Array(80)
  const dv = new DataView(data.buffer)

  for (let off = 0; off < data.length; off += 64) {
    for (let i = 0; i < 16; i++) {
      w[i] = dv.getInt32(off + i * 4, false)
    }
    for (let i = 16; i < 80; i++) {
      const t = (w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16]) | 0
      w[i] = (rotl(t, 1)) | 0
    }

    let a = h0, b = h1, c = h2, d = h3, e = h4

    for (let i = 0; i < 80; i++) {
      let f, k
      if (i < 20) {
        f = (b & c) | (~b & d)
        k = 0x5a827999
      } else if (i < 40) {
        f = b ^ c ^ d
        k = 0x6ed9eba1
      } else if (i < 60) {
        f = (b & c) | (b & d) | (c & d)
        k = 0x8f1bbcdc
      } else {
        f = b ^ c ^ d
        k = 0xca62c1d6
      }
      const tmp = (((rotl(a, 5) + f + e + k + w[i]) | 0) >>> 0)
      e = d
      d = c
      c = rotl(b, 30)
      b = a
      a = tmp
    }

    h0 = (h0 + a) | 0
    h1 = (h1 + b) | 0
    h2 = (h2 + c) | 0
    h3 = (h3 + d) | 0
    h4 = (h4 + e) | 0
  }

  return [h0, h1, h2, h3, h4]
    .map((x) => (x >>> 0).toString(16).padStart(8, '0'))
    .join('')
}

function rotl(x, n) {
  return ((x << n) | (x >>> (32 - n))) | 0
}

/**
 * Compute the stable id for a prompt string.
 * Uses the first 80 normalized characters so minor trailing edits to a long
 * prompt do not produce a divergent id, while still distinguishing different
 * prompts (which almost always differ in their opening).
 */
export function promptFingerprint(prompt) {
  const norm = normalizeForFingerprint(prompt).slice(0, 80)
  // Guard against empty prompts (would collide); fall back to full text hash.
  const base = norm || normalizeForFingerprint(prompt) || 'empty'
  return 'p' + sha1(base).slice(0, 12)
}
