import { useEffect } from 'react'
import { Search, X, ChevronDown } from 'lucide-react'
import { PromptGrid } from '../components/PromptGrid'
import { usePromptFilters, PROMPT_ALL_CATEGORY } from '../hooks/usePromptFilters'
import {
  PROMPT_FILTER_CATEGORIES,
  getPromptCategoryCounts,
  getPromptStats,
  getPromptSourceCounts,
} from '../lib/prompts'
import { SOURCE_LIST } from '../lib/prompt-categories'

export function PromptsGalleryPage() {
  const {
    category,
    setCategory,
    query,
    setQuery,
    shown,
    hasMore,
    loadMore,
    total,
  } = usePromptFilters()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [category])

  const counts = getPromptCategoryCounts()
  const sourceCounts = getPromptSourceCounts()
  const stats = getPromptStats()

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(60% 80% at 50% 0%, rgba(15,23,42,0.05) 0%, rgba(255,255,255,0) 70%)',
          }}
        />
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas px-3 py-1 text-xs font-semibold text-ink-soft shadow-card">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
              5 大开源数据源 · 每日增量更新
            </span>
            <h1 className="mt-5 text-3xl font-extrabold leading-[1.15] tracking-tight text-ink sm:text-4xl lg:text-5xl">
              AI 图像提示词
              <span className="relative whitespace-nowrap">
                <span className="relative z-10"> 多源合集</span>
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-1 z-0 h-3 bg-sky-300/50 sm:bottom-1.5 sm:h-3.5"
                />
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-soft">
              汇聚 {stats.total} 条社区精选提示词，来自 {stats.sources} 个开源仓库、
              {stats.authors} 位创作者。按分类筛选，一键复制。
            </p>

            {/* Source legend */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {SOURCE_LIST.map((s) => (
                <span
                  key={s.slug}
                  title={s.desc}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas px-3 py-1 text-xs font-medium text-ink-soft shadow-sm"
                >
                  <span>{s.icon}</span>
                  {s.label}
                  <span className="rounded-full bg-mist px-1.5 text-[11px] font-semibold text-ink-muted">
                    {sourceCounts[s.slug] ?? 0}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filter bar */}
      <div className="sticky top-16 z-30 border-b border-line bg-canvas/85 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索标题、提示词、作者或来源…"
                className="w-full rounded-xl border border-line bg-mist py-2.5 pl-10 pr-9 text-base text-ink placeholder:text-ink-muted/70 focus:border-ink/30 focus:bg-canvas focus:outline-none focus:ring-2 focus:ring-ink/5 sm:text-sm"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
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

          <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-wrap sm:px-0">
            <CategoryPill
              active={category === PROMPT_ALL_CATEGORY}
              onClick={() => setCategory(PROMPT_ALL_CATEGORY)}
              label="全部"
              icon="🖼️"
              count={Object.values(counts).reduce((a, b) => a + b, 0)}
            />
            {PROMPT_FILTER_CATEGORIES.map((cat) => {
              // Skip empty categories to keep the bar tidy.
              const cnt = counts[cat.slug] ?? 0
              if (!cnt) return null
              return (
                <CategoryPill
                  key={cat.slug}
                  active={category === cat.slug}
                  onClick={() => setCategory(cat.slug)}
                  label={cat.label}
                  icon={cat.icon}
                  count={cnt}
                />
              )
            })}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <PromptGrid prompts={shown} />

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

interface CategoryPillProps {
  active: boolean
  onClick: () => void
  label: string
  icon: string
  count: number
}

function CategoryPill({ active, onClick, label, icon, count }: CategoryPillProps) {
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
