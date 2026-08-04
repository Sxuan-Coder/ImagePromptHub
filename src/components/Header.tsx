import { Link, NavLink } from 'react-router-dom'
import { Sparkles, Github } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-ink transition-opacity hover:opacity-70"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-canvas">
            <Sparkles size={18} strokeWidth={2.2} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[15px] font-extrabold tracking-tight">
              ImagePromptHub
            </span>
            <span className="mt-0.5 hidden text-[11px] font-medium text-ink-muted sm:block">
              AI 图像提示词画廊
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 text-sm font-medium text-ink-soft">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              [
                'rounded-lg px-3 py-2 transition-colors hover:bg-mist hover:text-ink',
                isActive ? 'text-ink' : '',
              ].join(' ')
            }
          >
            案例画廊
          </NavLink>
          <NavLink
            to="/prompts"
            className={({ isActive }) =>
              [
                'rounded-lg px-3 py-2 transition-colors hover:bg-mist hover:text-ink',
                isActive ? 'text-ink' : '',
              ].join(' ')
            }
          >
            提示词库
          </NavLink>
          <a
            href="https://github.com/freestylefly/awesome-gpt-image-2"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub 数据来源仓库"
            title="GitHub 数据来源仓库"
            className="ml-1 rounded-lg p-2 transition-colors hover:bg-mist hover:text-ink"
          >
            <Github size={20} strokeWidth={2} />
          </a>
        </nav>
      </div>
    </header>
  )
}
