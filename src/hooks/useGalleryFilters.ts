import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { ClassifiedCase } from '../lib/cases'
import { ALL_CASES } from '../lib/cases'
import { ALL_CATEGORY, CATEGORY_MAP, OTHER_CATEGORY } from '../lib/categories'

export interface GalleryFilters {
  category: string
  query: string
}

/** Resolve a category slug from the ?cat= query param, validating it. */
function readInitialCategory(params: URLSearchParams): string {
  const slug = params.get('cat')
  if (!slug || slug === ALL_CATEGORY) return ALL_CATEGORY
  if (slug === OTHER_CATEGORY.slug) return slug
  return CATEGORY_MAP[slug] ? slug : ALL_CATEGORY
}

/**
 * Filter + paginate the case dataset. The search matches against the title,
 * prompt, and id (so users can jump to a known case number). Results reset to
 * the first page whenever filters change. The initial category can be supplied
 * via the ?cat= query param (used by detail-page category chips).
 */
export function useGalleryFilters(pageSize = 24) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [category, setCategory] = useState<string>(() =>
    readInitialCategory(searchParams)
  )
  const [query, setQuery] = useState<string>('')
  const [visible, setVisible] = useState<number>(pageSize)

  // Keep the ?cat= param in sync when the user picks a category.
  const updateCategory = (slug: string) => {
    setCategory(slug)
    const next = new URLSearchParams(searchParams)
    if (slug === ALL_CATEGORY) next.delete('cat')
    else next.set('cat', slug)
    setSearchParams(next, { replace: true })
  }

  // Reset pagination when filters change.
  useEffect(() => {
    setVisible(pageSize)
  }, [category, query, pageSize])

  const filtered = useMemo<ClassifiedCase[]>(() => {
    const q = query.trim().toLowerCase()
    return ALL_CASES.filter((c) => {
      if (category !== ALL_CATEGORY && c.category !== category) return false
      if (!q) return true
      // Allow searching by case id ("123" matches 例 123).
      if (/^\d+$/.test(q) && String(c.id).includes(q)) return true
      return (
        c.title.toLowerCase().includes(q) ||
        c.prompt.toLowerCase().includes(q)
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
