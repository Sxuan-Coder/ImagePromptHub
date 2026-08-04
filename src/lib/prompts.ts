import type { PromptItem, SourceSlug } from '../types'
import rawPrompts from '../data/prompts.json'
import {
  classifyPrompt,
  getPromptCategories,
} from './prompt-categories'
import { getCategory } from './categories'

/**
 * Build-time multi-source prompt dataset. Mirrors the structure of
 * `lib/cases.ts`: raw JSON is enriched with a runtime-computed `category`
 * so the gallery never recomputes classification during render.
 */
export interface ClassifiedPrompt extends PromptItem {
  category: string
}

const PROMPTS: ClassifiedPrompt[] = (rawPrompts as PromptItem[]).map((p) => ({
  ...p,
  category: classifyPrompt(p),
}))

export const ALL_PROMPTS: ClassifiedPrompt[] = PROMPTS

/** id → prompt lookup for fast detail-page resolution. */
export const PROMPT_BY_ID: Map<string, ClassifiedPrompt> = new Map(
  PROMPTS.map((p) => [p.id, p])
)

export function getPromptById(id: string): ClassifiedPrompt | undefined {
  return PROMPT_BY_ID.get(id)
}

/** Adjacent prompts (by stable insertion order) for prev/next navigation. */
export function getAdjacentPrompts(id: string): {
  prev?: ClassifiedPrompt
  next?: ClassifiedPrompt
} {
  const idx = PROMPTS.findIndex((p) => p.id === id)
  if (idx === -1) return {}
  return {
    prev: idx > 0 ? PROMPTS[idx - 1] : undefined,
    next: idx < PROMPTS.length - 1 ? PROMPTS[idx + 1] : undefined,
  }
}

export interface PromptStats {
  total: number
  sources: number
  authors: number
}

export function getPromptStats(): PromptStats {
  const authors = new Set(
    PROMPTS.map((p) => p.author).filter(Boolean) as string[]
  )
  return {
    total: PROMPTS.length,
    sources: new Set(PROMPTS.map((p) => p.collection)).size,
    authors: authors.size,
  }
}

/** Count of prompts per category slug (includes 'other' and extras). */
export function getPromptCategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const p of PROMPTS) {
    counts[p.category] = (counts[p.category] ?? 0) + 1
  }
  return counts
}

/** Count of prompts per source collection slug. */
export function getPromptSourceCounts(): Record<SourceSlug, number> {
  const counts = {} as Record<SourceSlug, number>
  for (const p of PROMPTS) {
    counts[p.collection] = (counts[p.collection] ?? 0) + 1
  }
  return counts
}

/** Category list for the prompts gallery filter bar. */
export const PROMPT_FILTER_CATEGORIES = getPromptCategories()

export { getCategory, classifyPrompt }
