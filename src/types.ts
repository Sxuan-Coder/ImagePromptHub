export interface Case {
  /** Sequential case number from the source (例 N). */
  id: number
  /** Localized descriptive title of the case. */
  title: string
  /** Absolute CDN URL to the generated image. */
  image: string
  /** Attribution / source string, may be empty. */
  source: string
  /** Full prompt text (may contain both [中文] and [English] sections). */
  prompt: string
}

export interface Category {
  /** Stable slug used in URLs and filters. */
  slug: string
  /** Chinese display label. */
  label: string
  /** Short description shown in the filter bar. */
  desc: string
  /** Emoji shown next to the label. */
  icon: string
  /** Keywords (lowercased) used to auto-classify cases. */
  keywords: string[]
}
