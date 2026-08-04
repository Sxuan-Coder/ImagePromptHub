import { Search, X } from 'lucide-react'
import { ALL_FILTER_CATEGORIES, ALL_CATEGORY } from '../lib/categories'
import { getCategoryCounts } from '../lib/cases'

interface FilterBarProps {
  category: string
  onCategoryChange: (slug: string) => void
  query: string
  onQueryChange: (q: string) => void
  total: number
}

export function FilterBar({
  category,
  onCategoryChange,
  query,
  onQueryChange,
  total,
}: FilterBarProps) {
  const counts = getCategoryCounts()

  return (
    <div className="sticky top-16 z-30 border-b border-line bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        {/* Search row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="搜索标题、提示词或编号…"
              className="w-full rounded-xl border border-line bg-mist py-2.5 pl-10 pr-9 text-sm text-ink placeholder:text-ink-muted/70 focus:border-ink/30 focus:bg-canvas focus:outline-none focus:ring-2 focus:ring-ink/5"
            />
            {query && (
              <button
                type="button"
                onClick={() => onQueryChange('')}
                aria-label="清除搜索"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-ink-muted transition-colors hover:bg-line hover:text-ink"
              >
                <X size={15} />
              </button>
            )}
          </div>
          <p className="text-sm text-ink-muted">
            显示 <span className="font-semibold text-ink">{total}</span> 个结果
          </p>
        </div>

        {/* Category pills */}
        <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-wrap sm:px-0">
          <CategoryPill
            active={category === ALL_CATEGORY}
            onClick={() => onCategoryChange(ALL_CATEGORY)}
            label="全部"
            icon="🖼️"
            count={Object.values(counts).reduce((a, b) => a + b, 0)}
          />
          {ALL_FILTER_CATEGORIES.map((cat) => (
            <CategoryPill
              key={cat.slug}
              active={category === cat.slug}
              onClick={() => onCategoryChange(cat.slug)}
              label={cat.label}
              icon={cat.icon}
              count={counts[cat.slug] ?? 0}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

interface CategoryPillProps {
  active: boolean
  onClick: () => void
  label: string
  icon: string
  count: number
}

function CategoryPill({
  active,
  onClick,
  label,
  icon,
  count,
}: CategoryPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all',
        active
          ? 'border-ink bg-ink text-canvas shadow-sm'
          : 'border-line bg-canvas text-ink-soft hover:border-ink/30 hover:bg-mist',
      ].join(' ')}
    >
      <span className="text-[13px] leading-none">{icon}</span>
      <span>{label}</span>
      <span
        className={[
          'ml-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums',
          active ? 'bg-canvas/20 text-canvas' : 'bg-mist text-ink-muted',
        ].join(' ')}
      >
        {count}
      </span>
    </button>
  )
}
