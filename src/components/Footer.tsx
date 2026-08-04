import { Sparkles, Star, Github, ExternalLink } from 'lucide-react'
import { getStats } from '../lib/cases'
import { SITE } from '../lib/site'

export function Footer() {
  const stats = getStats()
  const year = new Date().getFullYear()

  return (
    <footer className="mt-24 border-t border-line bg-mist">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 text-ink">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-canvas">
                <Sparkles size={16} strokeWidth={2.2} />
              </span>
              <span className="text-base font-extrabold tracking-tight">
                ImagePromptHub
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              精选 {stats.total}+ GPT Image 提示词案例，可按风格、场景筛选，
              一键复制完整提示词，激发你的创作灵感。
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm sm:grid-cols-3">
            <div className="col-span-2 mb-1 text-xs font-semibold uppercase tracking-wider text-ink-muted sm:col-span-1">
              资源
            </div>
            <a
              className="inline-flex items-center gap-1 text-ink-soft transition-colors hover:text-ink"
              href={SITE.repo}
              target="_blank"
              rel="noreferrer"
            >
              <Github size={14} />
              开源仓库
            </a>
            <a
              className="inline-flex items-center gap-1 text-ink-soft transition-colors hover:text-ink"
              href={SITE.dataSource}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink size={14} />
              数据源
            </a>
            <a
              className="inline-flex items-center gap-1 text-ink-soft transition-colors hover:text-ink"
              href="https://ai.sxuan.top"
              target="_blank"
              rel="noreferrer"
            >
              上玄 API
            </a>
            <a
              className="inline-flex items-center gap-1 text-ink-soft transition-colors hover:text-ink"
              href="https://sxapex.com"
              target="_blank"
              rel="noreferrer"
            >
              上玄 APEX 博客
            </a>
            <a
              className="inline-flex items-center gap-1 text-ink-soft transition-colors hover:text-ink"
              href="https://sxuan.top"
              target="_blank"
              rel="noreferrer"
            >
              个人主页
            </a>
          </div>
        </div>

        {/* Star CTA banner */}
        <a
          href={SITE.repo}
          target="_blank"
          rel="noreferrer"
          className="group mt-8 flex items-center justify-between gap-4 rounded-2xl border border-ink/10 bg-canvas px-5 py-4 shadow-sm transition-all hover:border-ink/20 hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <Star size={18} className="fill-current" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">
                这个项目对你有帮助吗？
              </p>
              <p className="text-xs text-ink-muted">
                在 GitHub 给个 Star ⭐ 支持一下，让更多人看到
              </p>
            </div>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-xs font-semibold text-canvas transition-transform group-hover:scale-105">
            <Star size={13} className="fill-current" />
            Star
          </span>
        </a>

        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-line pt-6 text-xs text-ink-muted sm:flex-row sm:items-center">
          <p>
            © {year} ImagePromptHub · 图片与提示词版权归原作者所有，仅作学习展示。
          </p>
          <p>由 React + Vite + TailwindCSS 构建</p>
        </div>
      </div>
    </footer>
  )
}
