import { memo } from 'react'
import { Link } from 'react-router-dom'
import { Copy, Eye, ImageOff, ImageIcon } from 'lucide-react'
import type { ClassifiedPrompt } from '../lib/prompts'
import { promptPreview } from '../lib/cases'
import { getCategory } from '../lib/categories'
import { SOURCES } from '../lib/prompt-categories'
import { useImageLoad } from '../hooks/useImageLoad'
import { useCopy } from '../hooks/useCopy'

interface PromptCardProps {
  prompt: ClassifiedPrompt
}

function PromptCardImpl({ prompt: p }: PromptCardProps) {
  const status = useImageLoad(p.image)
  const { copied, copy } = useCopy()
  const cat = getCategory(p.category)
  const src = SOURCES[p.collection]

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-canvas shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-ink/10 hover:shadow-lift">
      <Link
        to={`/prompt/${p.id}`}
        className="relative block overflow-hidden bg-mist"
        style={{ aspectRatio: '4 / 3' }}
      >
        {(status === 'idle' || status === 'loading') && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-mist to-slate-100" />
        )}

        {status === 'error' ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-ink-muted">
            <ImageOff size={26} />
            <span className="text-xs">图片加载失败</span>
          </div>
        ) : (
          <img
            src={p.image}
            alt={p.title}
            loading="lazy"
            className={[
              'h-full w-full object-cover transition-all duration-500',
              status === 'loaded'
                ? 'opacity-100 group-hover:scale-[1.04]'
                : 'opacity-0',
            ].join(' ')}
          />
        )}

        <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-ink/55 via-ink/0 to-ink/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="m-3 inline-flex items-center gap-1.5 rounded-lg bg-canvas/95 px-2.5 py-1.5 text-xs font-semibold text-ink shadow-sm">
            <Eye size={13} /> 查看详情
          </span>
        </div>

        {/* Source badge */}
        {src && (
          <span
            className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-md bg-ink/70 px-1.5 py-0.5 text-[11px] font-semibold text-canvas backdrop-blur-sm"
            title={src.desc}
          >
            <span className="text-[10px]">{src.icon}</span>
            {src.label}
          </span>
        )}

        {/* Needs-ref badge */}
        {p.needsRef && (
          <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-md bg-amber-500/90 px-1.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
            <ImageIcon size={11} /> 需参考图
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-3.5">
        <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
          {cat && (
            <span className="inline-flex items-center gap-1 rounded-full bg-mist px-2 py-0.5 text-[11px] font-medium text-ink-soft">
              <span className="text-[10px]">{cat.icon}</span>
              {cat.label}
            </span>
          )}
          {p.author && (
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
              {p.author}
            </span>
          )}
        </div>

        <h3 className="line-clamp-1 text-sm font-semibold text-ink">
          {p.title}
        </h3>

        <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-ink-muted">
          {promptPreview(p.prompt)}
        </p>

        <div className="mt-3 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => copy(p.prompt)}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-line bg-canvas px-2.5 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:border-ink/30 hover:bg-mist hover:text-ink"
          >
            <Copy size={13} />
            {copied ? '已复制' : '复制'}
          </button>
          <Link
            to={`/prompt/${p.id}`}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-ink px-2.5 py-1.5 text-xs font-semibold text-canvas transition-colors hover:bg-ink/90"
          >
            <Eye size={13} /> 查看
          </Link>
        </div>
      </div>
    </article>
  )
}

export const PromptCard = memo(PromptCardImpl)
