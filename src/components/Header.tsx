import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Sparkles, Star, Github, Menu, X } from 'lucide-react'
import { SITE } from '../lib/site'

export function Header() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  // Close on Escape for keyboard / screen-reader users.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const linkBase =
    'rounded-lg px-3 py-2 transition-colors hover:bg-mist hover:text-ink'

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-canvas/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            to="/"
            onClick={close}
            className="flex min-w-0 items-center gap-2 text-ink transition-opacity hover:opacity-70"
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

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 text-sm font-medium text-ink-soft sm:flex">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                [linkBase, isActive ? 'text-ink' : ''].join(' ')
              }
            >
              案例画廊
            </NavLink>
            <NavLink
              to="/prompts"
              className={({ isActive }) =>
                [linkBase, isActive ? 'text-ink' : ''].join(' ')
              }
            >
              提示词库
            </NavLink>
            {/* Star CTA — primary action, points to this project's repo */}
            <a
              href={SITE.repo}
              target="_blank"
              rel="noreferrer"
              aria-label="在 GitHub 给项目点 Star"
              title="在 GitHub 给项目点 Star ⭐"
              className="ml-2 inline-flex items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-canvas shadow-sm transition-all hover:bg-ink/90 hover:shadow-md"
            >
              <Star size={14} className="fill-current" />
              Star
            </a>
            {/* GitHub icon — secondary link to the repo */}
            <a
              href={SITE.repo}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub 仓库"
              title="GitHub 仓库"
              className="ml-0.5 rounded-lg p-2 transition-colors hover:bg-mist hover:text-ink"
            >
              <Github size={20} strokeWidth={2} />
            </a>
          </nav>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? '关闭菜单' : '打开菜单'}
            className="-mr-2 inline-flex items-center justify-center rounded-lg p-2 text-ink transition-colors hover:bg-mist sm:hidden"
          >
            {open ? (
              <X size={22} strokeWidth={2.2} />
            ) : (
              <Menu size={22} strokeWidth={2.2} />
            )}
          </button>
        </div>

        {/* Mobile dropdown — hidden on sm+ where the inline nav takes over */}
        {open && (
          <div
            id="mobile-menu"
            className="border-t border-line bg-canvas sm:hidden"
          >
            <nav className="mx-auto flex max-w-7xl flex-col gap-0.5 px-2 py-2">
              <NavLink
                to="/"
                end
                onClick={close}
                className={({ isActive }) =>
                  [
                    'rounded-lg px-3 py-3 text-base font-medium transition-colors',
                    isActive
                      ? 'bg-mist text-ink'
                      : 'text-ink-soft hover:bg-mist hover:text-ink',
                  ].join(' ')
                }
              >
                案例画廊
              </NavLink>
              <NavLink
                to="/prompts"
                onClick={close}
                className={({ isActive }) =>
                  [
                    'rounded-lg px-3 py-3 text-base font-medium transition-colors',
                    isActive
                      ? 'bg-mist text-ink'
                      : 'text-ink-soft hover:bg-mist hover:text-ink',
                  ].join(' ')
                }
              >
                提示词库
              </NavLink>

              {/* Star / GitHub actions */}
              <div className="grid grid-cols-2 gap-2 px-1 pt-2">
                <a
                  href={SITE.repo}
                  target="_blank"
                  rel="noreferrer"
                  onClick={close}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-ink px-3 py-2.5 text-sm font-semibold text-canvas transition-colors hover:bg-ink/90"
                >
                  <Star size={15} className="fill-current" />
                  Star
                </a>
                <a
                  href={SITE.repo}
                  target="_blank"
                  rel="noreferrer"
                  onClick={close}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-line bg-canvas px-3 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:bg-mist hover:text-ink"
                >
                  <Github size={16} strokeWidth={2} />
                  GitHub
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Tap-outside catcher — sits above page content (z-30) but below the
          sticky header (z-40) so the dropdown stays on top and clickable. */}
      {open && (
        <div
          aria-hidden
          onClick={close}
          className="fixed inset-0 z-30 bg-ink/20 sm:hidden"
        />
      )}
    </>
  )
}
