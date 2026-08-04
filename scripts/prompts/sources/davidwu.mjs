// @ts-check
/**
 * davidwu source — `davidwuw0811-boop/awesome-gpt-image2-prompts`.
 *
 * The upstream ships a ready-made `prompts.json`; we only need to map its
 * fields onto our schema and resolve relative `images/N.png` paths to raw
 * GitHub URLs.
 */
import { fetchText } from '../lib/store.mjs'
import { promptFingerprint } from '../lib/hash.mjs'
import { collapse } from '../lib/normalize.mjs'

const SLUG = 'davidwu'
const RAW_BASE =
  'https://raw.githubusercontent.com/davidwuw0811-boop/awesome-gpt-image2-prompts/main'

/**
 * @returns {Promise<{items: Array, changed: boolean, count: number}>}
 */
export async function fetchDavidwu() {
  const { text, changed } = await fetchText(
    `${RAW_BASE}/prompts.json`,
    SLUG
  )
  const raw = JSON.parse(text)

  const items = raw
    .map((r) => {
      const prompt = collapse(r.prompt || '')
      if (!prompt) return null
      const title = r.title_cn || r.title_en || `#${r.id}`
      const image = r.image?.startsWith('http')
        ? r.image
        : `${RAW_BASE}/${r.image}`.replace(/\/+/g, '/').replace(':/', '://')
      return {
        id: promptFingerprint(prompt),
        collection: SLUG,
        sourceId: String(r.id),
        title,
        titleEn: r.title_en && r.title_en !== title ? r.title_en : undefined,
        image,
        prompt,
        author: r.author || undefined,
        source: r.source || undefined,
        nativeCategory: r.category || undefined,
        nativeCategoryCn: r.category_cn || undefined,
        needsRef: r.needs_ref === true ? true : undefined,
        note: r.note ? collapse(r.note) : undefined,
      }
    })
    .filter(Boolean)

  return { items, changed, count: items.length }
}
