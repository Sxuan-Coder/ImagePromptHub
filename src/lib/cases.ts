import type { Case } from '../types'
import rawCases from '../data/cases.json'
import { classifyCase } from './categories'

/**
 * Static, build-time dataset. Each case is enriched with its auto-classified
 * category so the UI never recomputes classification during render.
 */
export interface ClassifiedCase extends Case {
  category: string
}

const CASES: ClassifiedCase[] = (rawCases as Case[]).map((c) => ({
  ...c,
  category: classifyCase(c),
}))

export const ALL_CASES: ClassifiedCase[] = CASES

/** id → case lookup for fast detail-page resolution. */
export const CASE_BY_ID: Map<number, ClassifiedCase> = new Map(
  CASES.map((c) => [c.id, c])
)

export interface GalleryStats {
  total: number
  categories: number
  sourced: number
}

export function getStats(): GalleryStats {
  return {
    total: CASES.length,
    categories: new Set(CASES.map((c) => c.category)).size,
    sourced: CASES.filter((c) => c.source).length,
  }
}

/** Count of cases per category slug (includes 'other'). */
export function getCategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const c of CASES) {
    counts[c.category] = (counts[c.category] ?? 0) + 1
  }
  return counts
}

export function getCaseById(id: number): ClassifiedCase | undefined {
  return CASE_BY_ID.get(id)
}

/** Adjacent cases (by sorted id) for prev/next navigation on detail pages. */
export function getAdjacentCases(id: number): {
  prev?: ClassifiedCase
  next?: ClassifiedCase
} {
  const idx = CASES.findIndex((c) => c.id === id)
  if (idx === -1) return {}
  return {
    prev: idx > 0 ? CASES[idx - 1] : undefined,
    next: idx < CASES.length - 1 ? CASES[idx + 1] : undefined,
  }
}

/**
 * Split a prompt into [中文] / [English] sections when the source uses that
 * convention. Falls back to a single block if no markers are present.
 */
export interface PromptSection {
  label: string
  lang: 'zh' | 'en' | 'raw'
  text: string
}

export function splitPrompt(prompt: string): PromptSection[] {
  const normalized = prompt.replace(/\r\n/g, '\n')

  // Match [中文]...[English]... pattern (case-insensitive, allows 中/英文).
  const zhIdx = normalized.search(/\[中文[文]?\]/i)
  const enIdx = normalized.search(/\[(英文|English)\]/i)

  if (zhIdx !== -1 && enIdx !== -1 && enIdx > zhIdx) {
    const zhText = normalized
      .slice(zhIdx, enIdx)
      .replace(/^\[中文[文]?\]\s*/i, '')
      .trim()
    const enText = normalized
      .slice(enIdx)
      .replace(/^\[(英文|English)\]\s*/i, '')
      .trim()
    const leading = zhIdx > 0 ? normalized.slice(0, zhIdx).trim() : ''
    const sections: PromptSection[] = []
    if (leading) sections.push({ label: '前言', lang: 'raw', text: leading })
    if (zhText) sections.push({ label: '中文', lang: 'zh', text: zhText })
    if (enText) sections.push({ label: 'English', lang: 'en', text: enText })
    return sections
  }

  // Single-section prompt — detect language heuristically.
  const hasCJK = /[\u4e00-\u9fff]/.test(normalized)
  return [
    {
      label: hasCJK ? '提示词' : 'Prompt',
      lang: hasCJK ? 'zh' : 'en',
      text: normalized.trim(),
    },
  ]
}

/** Extract a one-line preview of the prompt for cards. */
export function promptPreview(prompt: string, max = 90): string {
  const firstSection = splitPrompt(prompt)[0]
  const text = firstSection.text.replace(/\s+/g, ' ').trim()
  return text.length > max ? text.slice(0, max).trimEnd() + '…' : text
}
