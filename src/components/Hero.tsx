import { Image as ImageIcon, Tag, FileText, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getStats } from '../lib/cases'
import { getPromptStats } from '../lib/prompts'

export function Hero() {
  const stats = getStats()
  const promptStats = getPromptStats()

  const metrics = [
    { icon: ImageIcon, value: stats.total, label: '案例画廊' },
    { icon: Tag, value: promptStats.total, label: '多源提示词' },
    { icon: FileText, value: '100%', label: '原文收录' },
  ]

  return (
    <section className="relative overflow-hidden border-b border-line">
      {/* Soft gradient backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(60% 80% at 50% 0%, rgba(15,23,42,0.05) 0%, rgba(255,255,255,0) 70%)',
        }}
      />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas px-3 py-1 text-xs font-semibold text-ink-soft shadow-card">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            GPT Image 2 · 提示词画廊
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            一站式
            <span className="relative whitespace-nowrap">
              <span className="relative z-10"> AI 图像 </span>
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-1 z-0 h-3 bg-amber-300/60 sm:bottom-1.5 sm:h-4"
              />
            </span>
            <br />
            提示词灵感库
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">
            精选 {stats.total} 个高质量案例，外加 {promptStats.total} 条来自{' '}
            {promptStats.sources} 个开源仓库的多源提示词。
            按风格、场景筛选，一键复制，打开即可投入你的创作工作流。
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/prompts"
              className="group inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-canvas shadow-card transition-all hover:bg-ink/90"
            >
              浏览多源提示词库
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <a
              href="#gallery"
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-canvas px-5 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:border-ink/30 hover:bg-mist hover:text-ink"
            >
              查看案例画廊
            </a>
          </div>

          <dl className="mx-auto mt-10 grid max-w-lg grid-cols-3 gap-4">
            {metrics.map((m) => (
              <div
                key={m.label}
                className="rounded-2xl border border-line bg-canvas px-3 py-4 text-center shadow-card"
              >
                <dt className="flex items-center justify-center text-ink-muted">
                  <m.icon size={15} strokeWidth={2} />
                  <span className="ml-1.5 text-[11px] font-medium uppercase tracking-wide">
                    {m.label}
                  </span>
                </dt>
                <dd className="mt-1.5 text-2xl font-extrabold text-ink sm:text-3xl">
                  {m.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
