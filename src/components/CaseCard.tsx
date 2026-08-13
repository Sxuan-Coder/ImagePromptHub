import { memo } from 'react'
import { Link } from 'react-router-dom'
import { Copy, Eye, ImageOff } from 'lucide-react'
import type { ClassifiedCase } from '../lib/cases'
import { promptPreview } from '../lib/cases'
import { getCategory } from '../lib/categories'
import { useImageLoad } from '../hooks/useImageLoad'
import { useCopy } from '../hooks/useCopy'

interface CaseCardProps {
  case: ClassifiedCase
}

function CaseCardImpl({ case: c }: CaseCardProps) {
  const { status, src } = useImageLoad(c.image)
  const { copied, copy } = useCopy()
  const cat = getCategory(c.category)

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-canvas shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-ink/10 hover:shadow-lift">
      <Link
        to={`/case/${c.id}`}
        className="relative block overflow-hidden bg-mist"
        style={{ aspectRatio: '4 / 3' }}
      >
        {/* Skeleton shimmer while loading */}
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
            src={src}
            alt={c.title}
            loading="lazy"
            className={[
              'h-full w-full object-cover transition-all duration-500',
              status === 'loaded'
                ? 'opacity-100 group-hover:scale-[1.04]'
                : 'opacity-0',
            ].join(' ')}
          />
        )}

        {/* Hover overlay with "view" affordance */}
        <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-ink/55 via-ink/0 to-ink/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="m-3 inline-flex items-center gap-1.5 rounded-lg bg-canvas/95 px-2.5 py-1.5 text-xs font-semibold text-ink shadow-sm">
            <Eye size={13} /> 查看详情
          </span>
        </div>

        {/* Index badge */}
        <span className="absolute left-2.5 top-2.5 rounded-md bg-ink/70 px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-canvas backdrop-blur-sm">
          #{c.id}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-3.5">
        <div className="mb-1.5 flex items-center gap-2">
          {cat && (
            <span className="inline-flex items-center gap-1 rounded-full bg-mist px-2 py-0.5 text-[11px] font-medium text-ink-soft">
              <span className="text-[10px]">{cat.icon}</span>
              {cat.label}
            </span>
          )}
        </div>

        <h3 className="line-clamp-1 text-sm font-semibold text-ink">
          {c.title}
        </h3>

        <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-ink-muted">
          {promptPreview(c.prompt)}
        </p>

        <div className="mt-3 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => copy(c.prompt)}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-line bg-canvas px-2.5 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:border-ink/30 hover:bg-mist hover:text-ink"
          >
            <Copy size={13} />
            {copied ? '已复制' : '复制'}
          </button>
          <Link
            to={`/case/${c.id}`}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-ink px-2.5 py-1.5 text-xs font-semibold text-canvas transition-colors hover:bg-ink/90"
          >
            <Eye size={13} /> 查看
          </Link>
        </div>
      </div>
    </article>
  )
}

export const CaseCard = memo(CaseCardImpl)
