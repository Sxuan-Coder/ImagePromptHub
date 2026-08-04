import { useEffect } from 'react'
import { Hero } from '../components/Hero'
import { FilterBar } from '../components/FilterBar'
import { CaseGrid } from '../components/CaseGrid'
import { useGalleryFilters } from '../hooks/useGalleryFilters'
import { ChevronDown } from 'lucide-react'

export function GalleryPage() {
  const {
    category,
    setCategory,
    query,
    setQuery,
    shown,
    hasMore,
    loadMore,
    total,
  } = useGalleryFilters()

  // Scroll to top when the active category changes (not on every keystroke).
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [category])

  return (
    <>
      <Hero />

      <FilterBar
        category={category}
        onCategoryChange={setCategory}
        query={query}
        onQueryChange={setQuery}
        total={total}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <CaseGrid cases={shown} />

        {hasMore && (
          <div className="mt-12 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={loadMore}
              className="inline-flex items-center gap-2 rounded-xl border border-ink/15 bg-canvas px-6 py-3 text-sm font-semibold text-ink shadow-card transition-all hover:border-ink hover:bg-ink hover:text-canvas"
            >
              <ChevronDown size={16} />
              加载更多
            </button>
            <p className="text-xs text-ink-muted">
              已显示 {shown.length} / {total}
            </p>
          </div>
        )}
      </main>
    </>
  )
}
