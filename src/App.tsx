import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { GalleryPage } from './pages/GalleryPage'
import { CaseDetailPage } from './pages/CaseDetailPage'
import { PromptsGalleryPage } from './pages/PromptsGalleryPage'
import { PromptDetailPage } from './pages/PromptDetailPage'

/** Reset scroll position on route change (except back/forward via the browser). */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <ScrollToTop />
      <Header />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<GalleryPage />} />
          <Route path="/case/:id" element={<CaseDetailPage />} />
          <Route path="/prompts" element={<PromptsGalleryPage />} />
          <Route path="/prompt/:id" element={<PromptDetailPage />} />
          <Route path="*" element={<GalleryPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}
