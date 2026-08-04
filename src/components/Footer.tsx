import { Sparkles } from 'lucide-react'
import { getStats } from '../lib/cases'

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
              className="text-ink-soft transition-colors hover:text-ink"
              href="https://github.com/freestylefly/awesome-gpt-image-2"
              target="_blank"
              rel="noreferrer"
            >
              数据来源仓库
            </a>
            <a
              className="text-ink-soft transition-colors hover:text-ink"
              href="https://ai.sxuan.top"
              target="_blank"
              rel="noreferrer"
            >
              上玄 API
            </a>
            <a
              className="text-ink-soft transition-colors hover:text-ink"
              href="https://sxapex.com"
              target="_blank"
              rel="noreferrer"
            >
              上玄 APEX 博客
            </a>
            <a
              className="text-ink-soft transition-colors hover:text-ink"
              href="https://sxuan.top"
              target="_blank"
              rel="noreferrer"
            >
              个人主页
            </a>
          </div>
        </div>

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
