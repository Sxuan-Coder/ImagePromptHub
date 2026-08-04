import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { ClassifiedPrompt } from '../lib/prompts'
import { ALL_PROMPTS } from '../lib/prompts'
import { PROMPT_FILTER_CATEGORIES } from '../lib/prompts'
import { ALL_CATEGORY } from '../lib/categories'

export const PROMPT_ALL_CATEGORY = ALL_CATEGORY

/** Validate a category slug against the prompts category set. */
function readInitialCategory(params: URLSearchParams): string {
  const slug = params.get('cat')
  if (!slug || slug === ALL_CATEGORY) return ALL_CATEGORY
  return PROMPT_FILTER_CATEGORIES.some((c) => c.slug === slug)
    ? slug
    : ALL_CATEGORY
}

/**
 * Filter + paginate the multi-source prompt dataset. Search matches title,
 * prompt, author, and collection. Mirrors `useGalleryFilters`.
 */
export function usePromptFilters(pageSize = 24) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [category, setCategory] = useState<string>(() =>
    readInitialCategory(searchParams)
  )
  const [query, setQuery] = useState<string>('')
  const [visible, setVisible] = useState<number>(pageSize)

  const updateCategory = (slug: string) => {
    setCategory(slug)
    const next = new URLSearchParams(searchParams)
    if (slug === ALL_CATEGORY) next.delete('cat')
    else next.set('cat', slug)
    setSearchParams(next, { replace: true })
  }

  useEffect(() => {
    setVisible(pageSize)
  }, [category, query, pageSize])

  const filtered = useMemo<ClassifiedPrompt[]>(() => {
    const q = query.trim().toLowerCase()
    return ALL_PROMPTS.filter((p) => {
      if (category !== ALL_CATEGORY && p.category !== category) return false
      if (!q) return true
      return (
        p.title.toLowerCase().includes(q) ||
        (p.titleEn?.toLowerCase().includes(q) ?? false) ||
        p.prompt.toLowerCase().includes(q) ||
        (p.author?.toLowerCase().includes(q) ?? false) ||
        p.collection.toLowerCase().includes(q)
      )
    })
  }, [category, query])

  const shown = filtered.slice(0, visible)
  const hasMore = visible < filtered.length

  const loadMore = () => setVisible((v) => v + pageSize)

  return {
    category,
    setCategory: updateCategory,
    query,
    setQuery,
    filtered,
    shown,
    hasMore,
    loadMore,
    total: filtered.length,
  }
}
