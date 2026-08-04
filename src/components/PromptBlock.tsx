import { Copy, Check } from 'lucide-react'
import { splitPrompt, type PromptSection } from '../lib/cases'
import { useCopy } from '../hooks/useCopy'

interface PromptBlockProps {
  prompt: string
}

export function PromptBlock({ prompt }: PromptBlockProps) {
  const sections = splitPrompt(prompt)
  const { copied, copy } = useCopy()

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-mist">
      <div className="flex items-center justify-between border-b border-line bg-canvas px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="ml-2 text-xs font-medium text-ink-muted">
            prompt.txt
          </span>
        </div>
        <button
          type="button"
          onClick={() => copy(prompt)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-canvas transition-colors hover:bg-ink/90"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? '已复制' : '复制全部'}
        </button>
      </div>

      <div className="flex flex-col divide-y divide-line/70">
        {sections.map((sec, i) => (
          <PromptSectionView key={i} section={sec} />
        ))}
      </div>
    </div>
  )
}

function PromptSectionView({
  section,
}: {
  section: PromptSection
}) {
  const { copied, copy } = useCopy()
  const langLabel =
    section.lang === 'zh'
      ? '中文'
      : section.lang === 'en'
      ? 'EN'
      : '·'

  return (
    <div className="group relative px-4 py-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5">
          <span className="rounded bg-ink/5 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink-muted">
            {langLabel}
          </span>
          <span className="text-xs font-medium text-ink-soft">
            {section.label}
          </span>
        </span>
        <button
          type="button"
          onClick={() => copy(section.text)}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-ink-muted opacity-0 transition-opacity hover:bg-ink/5 hover:text-ink group-hover:opacity-100"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? '已复制' : '复制'}
        </button>
      </div>
      <pre className="whitespace-pre-wrap break-words font-mono text-[13px] leading-relaxed text-ink-soft">
        {section.text}
      </pre>
    </div>
  )
}
