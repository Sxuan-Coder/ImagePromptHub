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

/**
 * Source collection slugs for the multi-source prompt dataset. Each maps to
 * one upstream GitHub repo consumed by `scripts/fetch-prompts.mjs`.
 */
export type SourceSlug =
  | 'davidwu'
  | 'zerolu'
  | 'imgedify'
  | 'youmind-gpt-image-2'
  | 'youmind-nano-banana'

/**
 * A single prompt entry aggregated from the multi-source dataset
 * (`src/data/prompts.json`). Independent from `Case` (the freestylefly set):
 * ids are content fingerprints, sources are tagged, and richer metadata
 * (author / dual titles / ref-image flag) is preserved.
 */
export interface PromptItem {
  /** Content fingerprint (`p` + sha1 prefix). Stable across re-fetches. */
  id: string
  /** Upstream repo this entry was first seen in. */
  collection: SourceSlug
  /** Original id / ordinal within the source, for traceability. */
  sourceId: string
  /** Display title (Chinese when available). */
  title: string
  /** English title, when the source provides both. */
  titleEn?: string
  /** Primary image URL. */
  image: string
  /** Additional image URLs (multi-image entries). */
  images?: string[]
  /** Full prompt text. */
  prompt: string
  /** Author handle (e.g. `@dotey`) when known. */
  author?: string
  /** Provenance link or source label. */
  source?: string
  /** Native category from the source (mapped to `category` at runtime). */
  nativeCategory?: string
  /** Native category label in Chinese, when the source provides it. */
  nativeCategoryCn?: string
  /** Whether a reference image is required to use the prompt. */
  needsRef?: boolean
  /** Usage note shipped by the source (davidwu). */
  note?: string
  /** ISO timestamp of first ingestion. */
  fetchedAt: string
}

/** Display metadata for a source collection. */
export interface SourceMeta {
  slug: SourceSlug
  label: string
  repo: string
  repoUrl: string
  file: string
  icon: string
  desc: string
}

