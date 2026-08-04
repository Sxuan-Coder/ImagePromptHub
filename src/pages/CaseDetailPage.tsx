import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  ExternalLink,
  Hash,
  ImageOff,
} from 'lucide-react'
import {
  getCaseById,
  getAdjacentCases,
  splitPrompt,
} from '../lib/cases'
import { getCategory } from '../lib/categories'
import { useImageLoad } from '../hooks/useImageLoad'
import { useCopy } from '../hooks/useCopy'
import { PromptBlock } from '../components/PromptBlock'

export function CaseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const caseId = Number(id)
  const c = Number.isFinite(caseId) ? getCaseById(caseId) : undefined
  const status = useImageLoad(c?.image ?? '')
  const { copied, copy } = useCopy()

  // Scroll to top on navigation between cases.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [caseId])

  if (!c) {
    return (
      <main className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-ink">未找到该案例</h1>
        <p className="mt-2 text-ink-muted">编号 #{id} 不存在或已下线。</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-canvas transition-colors hover:bg-ink/90"
        >
          <ArrowLeft size={16} /> 返回画廊
        </Link>
      </main>
    )
  }

  const cat = getCategory(c.category)
  const { prev, next } = getAdjacentCases(c.id)
  const hasSections = splitPrompt(c.prompt).length > 1

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      {/* Breadcrumb / back */}
      <div className="mb-5 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
        >
          <ArrowLeft size={16} /> 返回画廊
        </Link>
        <span className="inline-flex items-center gap-1 rounded-full bg-mist px-2.5 py-1 text-xs font-semibold text-ink-soft">
          <Hash size={12} /> 案例 #{c.id}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
        {/* Image */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-2xl border border-line bg-mist shadow-card">
            {(status === 'idle' || status === 'loading') && (
              <div className="aspect-[4/3] w-full animate-pulse bg-gradient-to-br from-mist to-slate-100" />
            )}
            {status === 'error' ? (
              <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 text-ink-muted">
                <ImageOff size={32} />
                <span className="text-sm">图片加载失败</span>
              </div>
            ) : (
              <img
                src={c.image}
                alt={c.title}
                className={[
                  'mx-auto max-h-[70vh] w-full object-contain transition-opacity duration-500',
                  status === 'loaded' ? 'opacity-100' : 'opacity-0',
                ].join(' ')}
              />
            )}
          </div>

          {c.source && (
            <p className="mt-3 px-1 text-xs leading-relaxed text-ink-muted [&_a]:font-medium [&_a]:text-ink-soft [&_a]:underline hover:[&_a]:text-ink">
              来源：{' '}
              <span dangerouslySetInnerHTML={{ __html: c.source }} />
            </p>
          )}
        </div>

        {/* Details */}
        <div className="min-w-0">
          {cat && (
            <Link
              to={`/?cat=${cat.slug}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas px-3 py-1 text-xs font-medium text-ink-soft transition-colors hover:border-ink/30 hover:bg-mist"
            >
              <span>{cat.icon}</span>
              {cat.label}
            </Link>
          )}

          <h1 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight text-ink sm:text-3xl">
            {c.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted">
            <span>编号 #{c.id}</span>
            {hasSections && <span>· 含中英双语提示词</span>}
          </div>

          {/* Quick copy */}
          <button
            type="button"
            onClick={() => copy(c.prompt)}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-canvas transition-colors hover:bg-ink/90"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? '已复制到剪贴板' : '复制完整提示词'}
          </button>

          {/* Full prompt */}
          <div className="mt-6">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-ink-muted">
              提示词 Prompt
            </h2>
            <PromptBlock prompt={c.prompt} />
          </div>

          {/* Source link out */}
          <a
            href={`https://github.com/freestylefly/awesome-gpt-image-2/blob/main/docs/gallery-part-${
              c.id <= 165 ? 1 : 2
            }.md#case-${c.id}`}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
          >
            <ExternalLink size={15} />
            在 GitHub 查看原始案例
          </a>
        </div>
      </div>

      {/* Prev / Next navigation */}
      <nav className="mt-14 grid grid-cols-2 gap-3 border-t border-line pt-8 sm:gap-4">
        {prev ? (
          <Link
            to={`/case/${prev.id}`}
            className="group flex items-center gap-3 rounded-xl border border-line bg-canvas p-3 transition-all hover:border-ink/20 hover:shadow-card sm:p-4"
          >
            <ChevronLeft
              size={18}
              className="shrink-0 text-ink-muted transition-transform group-hover:-translate-x-0.5"
            />
            <span className="min-w-0">
              <span className="block text-[11px] font-medium uppercase tracking-wide text-ink-muted">
                上一案例
              </span>
              <span className="block truncate text-sm font-semibold text-ink">
                #{prev.id} {prev.title}
              </span>
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to={`/case/${next.id}`}
            className="group flex items-center justify-end gap-3 rounded-xl border border-line bg-canvas p-3 text-right transition-all hover:border-ink/20 hover:shadow-card sm:p-4"
          >
            <span className="min-w-0">
              <span className="block text-[11px] font-medium uppercase tracking-wide text-ink-muted">
                下一案例
              </span>
              <span className="block truncate text-sm font-semibold text-ink">
                #{next.id} {next.title}
              </span>
            </span>
            <ChevronRight
              size={18}
              className="shrink-0 text-ink-muted transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  )
}
