// @ts-check
/**
 * Text normalization helpers shared across all source parsers.
 *
 * The goal of `normalizeForFingerprint` is to produce a stable key for the
 * *same* prompt even when whitespace, punctuation, or emoji decoration differ
 * slightly between repos that re-publish the same prompt.
 */

// Strip everything that is not a letter, digit, or CJK ideograph.
// Deliberately keep CJK ranges so Chinese/English prompts hash distinctly.
const NON_TOKEN = /[^\p{L}\p{N}]+/gu

/**
 * Normalize arbitrary prompt text into a fingerprint base.
 * Lowercases, collapses all non-alphanumeric/CJK runs, and trims.
 */
export function normalizeForFingerprint(text) {
  if (!text) return ''
  return text
    .toString()
    .toLowerCase()
    // Remove emoji & symbols (pictographic, symbol categories).
    .replace(
      /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{27FF}\u{2B00}-\u{2BFF}\u{1F1E6}-\u{1F1FF}]/gu,
      ''
    )
    .replace(NON_TOKEN, ' ')
    .trim()
}

/** Trim and collapse internal whitespace (newlines → spaces) for storage. */
export function collapse(text) {
  if (!text) return ''
  return text.toString().replace(/\r\n/g, '\n').replace(/\s+\n/g, '\n').trim()
}
