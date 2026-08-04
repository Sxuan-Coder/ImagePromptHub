import { useEffect, useState } from 'react'
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
  ImageIcon,
  User,
  Info,
} from 'lucide-react'
import { getPromptById, getAdjacentPrompts } from '../lib/prompts'
import { getCategory } from '../lib/categories'
import { SOURCES } from '../lib/prompt-categories'
import { useImageLoad } from '../hooks/useImageLoad'
import { useCopy } from '../hooks/useCopy'
import { PromptBlock } from '../components/PromptBlock'

export function PromptDetailPage() {
  const { id } = useParams<{ id: string }>()
  const p = id ? getPromptById(id) : undefined
  const { copied, copy } = useCopy()
  const [activeImg, setActiveImg] = useState(0)

  // Resolve the currently-shown image *before* any early return so the hook
  // order stays stable.
  const imgs = p?.images && p.images.length ? p.images : p ? [p.image] : []
  const currentImg = imgs[activeImg] ?? p?.image ?? ''
  const currentStatus = useImageLoad(currentImg)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
    setActiveImg(0)
  }, [id])

  if (!p) {
    return (
      <main className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-ink">未找到该提示词</h1>
        <p className="mt-2 text-ink-muted">该条目不存在或已被移除。</p>
        <Link
          to="/prompts"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-canvas transition-colors hover:bg-ink/90"
        >
          <ArrowLeft size={16} /> 返回提示词库
        </Link>
      </main>
    )
  }

  const cat = getCategory(p.category)
  const src = SOURCES[p.collection]
  const { prev, next } = getAdjacentPrompts(p.id)

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      {/* Breadcrumb / back */}
      <div className="mb-5 flex items-center justify-between">
        <Link
          to="/prompts"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
        >
          <ArrowLeft size={16} /> 返回提示词库
        </Link>
        <span className="inline-flex items-center gap-1 rounded-full bg-mist px-2.5 py-1 text-xs font-semibold text-ink-soft">
          <Hash size={12} /> {p.id.slice(0, 10)}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
        {/* Image */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-2xl border border-line bg-mist shadow-card">
            {(currentStatus === 'idle' || currentStatus === 'loading') && (
              <div className="aspect-[4/3] w-full animate-pulse bg-gradient-to-br from-mist to-slate-100" />
            )}
            {currentStatus === 'error' ? (
              <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 text-ink-muted">
                <ImageOff size={32} />
                <span className="text-sm">图片加载失败</span>
              </div>
            ) : (
              <img
                src={currentImg}
                alt={p.title}
                className={[
                  'mx-auto max-h-[70vh] w-full object-contain transition-opacity duration-500',
                  currentStatus === 'loaded' ? 'opacity-100' : 'opacity-0',
                ].join(' ')}
              />
            )}
          </div>

          {/* Thumbnails for multi-image entries */}
          {imgs.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {imgs.map((img, i) => (
                <button
                  key={img + i}
                  type="button"
                  onClick={() => setActiveImg(i)}
                  className={[
                    'h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all',
                    i === activeImg
                      ? 'border-ink'
                      : 'border-line opacity-60 hover:opacity-100',
                  ].join(' ')}
                >
                  <img src={img} alt={`图 ${i + 1}`} className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}

          {/* Source attribution */}
          <div className="mt-3 flex flex-wrap items-center gap-2 px-1 text-xs text-ink-muted">
            {src && (
              <Link
                to="/prompts"
                className="inline-flex items-center gap-1 rounded-full border border-line bg-canvas px-2.5 py-1 font-medium text-ink-soft transition-colors hover:border-ink/30 hover:bg-mist"
              >
                <span>{src.icon}</span>
                {src.label}
              </Link>
            )}
            {p.source &&
              (/^https?:\/\//i.test(p.source) ? (
                <a
                  href={p.source}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 break-all hover:text-ink"
                >
                  <ExternalLink size={12} />
                  <span className="truncate">{p.source}</span>
                </a>
              ) : (
                <span className="inline-flex items-center gap-1">
                  <span className="truncate">{p.source}</span>
                </span>
              ))}
          </div>
        </div>

        {/* Details */}
        <div className="min-w-0">
          {cat && (
            <Link
              to={`/prompts?cat=${cat.slug}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas px-3 py-1 text-xs font-medium text-ink-soft transition-colors hover:border-ink/30 hover:bg-mist"
            >
              <span>{cat.icon}</span>
              {cat.label}
            </Link>
          )}

          <h1 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight text-ink sm:text-3xl">
            {p.title}
          </h1>
          {p.titleEn && p.titleEn !== p.title && (
            <p className="mt-1 text-base font-medium text-ink-muted">
              {p.titleEn}
            </p>
          )}

          {/* Meta row */}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-muted">
            {p.author && (
              <span className="inline-flex items-center gap-1.5">
                <User size={14} /> {p.author}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Hash size={14} /> 源内序号 {p.sourceId}
            </span>
            {p.needsRef && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 font-medium text-amber-700">
                <ImageIcon size={13} /> 需要参考图
              </span>
            )}
          </div>

          {/* Usage note */}
          {p.note && (
            <div className="mt-4 flex gap-2 rounded-xl border border-sky-200 bg-sky-50/60 p-3 text-sm text-ink-soft">
              <Info size={16} className="mt-0.5 shrink-0 text-sky-500" />
              <p className="leading-relaxed">{p.note}</p>
            </div>
          )}

          {/* Quick copy */}
          <button
            type="button"
            onClick={() => copy(p.prompt)}
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
            <PromptBlock prompt={p.prompt} />
          </div>

          {/* Source link out (dynamic per collection) */}
          {src && (
            <a
              href={src.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
            >
              <ExternalLink size={15} />
              在 GitHub 查看「{src.label}」原始仓库
            </a>
          )}
        </div>
      </div>

      {/* Prev / Next navigation */}
      <nav className="mt-14 grid grid-cols-2 gap-3 border-t border-line pt-8 sm:gap-4">
        {prev ? (
          <Link
            to={`/prompt/${prev.id}`}
            className="group flex items-center gap-3 rounded-xl border border-line bg-canvas p-3 transition-all hover:border-ink/20 hover:shadow-card sm:p-4"
          >
            <ChevronLeft
              size={18}
              className="shrink-0 text-ink-muted transition-transform group-hover:-translate-x-0.5"
            />
            <span className="min-w-0">
              <span className="block text-[11px] font-medium uppercase tracking-wide text-ink-muted">
                上一条
              </span>
              <span className="block truncate text-sm font-semibold text-ink">
                {prev.title}
              </span>
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to={`/prompt/${next.id}`}
            className="group flex items-center justify-end gap-3 rounded-xl border border-line bg-canvas p-3 text-right transition-all hover:border-ink/20 hover:shadow-card sm:p-4"
          >
            <span className="min-w-0">
              <span className="block text-[11px] font-medium uppercase tracking-wide text-ink-muted">
                下一条
              </span>
              <span className="block truncate text-sm font-semibold text-ink">
                {next.title}
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
