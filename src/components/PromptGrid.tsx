import type { ClassifiedPrompt } from '../lib/prompts'
import { PromptCard } from './PromptCard'
import { SearchX } from 'lucide-react'

interface PromptGridProps {
  prompts: ClassifiedPrompt[]
}

export function PromptGrid({ prompts }: PromptGridProps) {
  if (prompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-mist/50 px-6 py-20 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-canvas text-ink-muted shadow-card">
          <SearchX size={24} />
        </span>
        <h3 className="mt-4 text-base font-semibold text-ink">没有匹配的提示词</h3>
        <p className="mt-1 text-sm text-ink-muted">
          换个关键词，或选择「全部」分类看看更多内容。
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {prompts.map((p) => (
        <PromptCard key={p.id} prompt={p} />
      ))}
    </div>
  )
}
