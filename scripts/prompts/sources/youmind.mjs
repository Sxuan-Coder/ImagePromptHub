// @ts-check
/**
 * youmind sources — `YouMind-OpenLab/awesome-gpt-image-2` and
 * `YouMind-OpenLab/awesome-nano-banana-pro-prompts` (README_zh.md).
 *
 * Both repos share the same README structure, so a single parameterized
 * parser handles them. Per entry:
 *
 *   ### No. N: 标题
 *   ![Language-EN](...shields.io...)   (badges — skip)
 *   #### 📖 描述 (optional)
 *   #### 📝 揓示词
 *   ```
 *   ...prompt (often a JSON block)...
 *   ```
 *   #### 🖼️ 生成图片
 *   ##### Image 1
 *   <img src="https://cms-assets.youmind.com/..." ...>
 *   #### 📌 详情
 *   - **作者:** [name](url)
 *   - **来源:** [Twitter Post](url)
 *   - **发布时间:** ...
 *
 * Key risk: the README is full of non-entry images (badges, covers,
 * category banners). We therefore only collect `cms-assets.youmind.com`
 * URLs, and only from the `🖼️ 生成图片` subsection.
 */
import { fetchText } from '../lib/store.mjs'
import { promptFingerprint } from '../lib/hash.mjs'
import { collapse } from '../lib/normalize.mjs'

const RAW_BASE =
  'https://raw.githubusercontent.com/YouMind-OpenLab'

/**
 * Build a parser for one youmind repo.
 * @param {{slug: string, repo: string, file: string}} cfg
 */
export function makeYoumindFetcher(cfg) {
  const { slug, repo, file } = cfg
  return async function fetchYoumind() {
    const { text, changed } = await fetchText(`${RAW_BASE}/${repo}/main/${file}`, slug)

    const items = []
    // Split into entry blocks on the "### No." heading.
    const entryRe = /^###\s+No\.\s*(\d+)\s*[:：]\s*(.+?)\s*$/gm
    const indices = []
    let m
    while ((m = entryRe.exec(text)) !== null) {
      indices.push({ no: m[1], title: m[2].replace(/\s+/g, ' ').trim(), start: m.index, headerEnd: m.index + m[0].length })
    }

    for (let i = 0; i < indices.length; i++) {
      const { no, title, headerEnd } = indices[i]
      const next = i + 1 < indices.length ? indices[i + 1].start : text.length
      const block = text.slice(headerEnd, next)

      // Prompt: the first fenced code block under "📝 提示词".
      const promptSection = sliceSection(block, '📝')
      if (!promptSection) continue
      const fence = /```[a-z]*\n([\s\S]*?)```/.exec(promptSection)
      if (!fence) continue
      const prompt = collapse(fence[1])
      if (!prompt) continue

      // Images: cms-assets.youmind.com within "🖼️ 生成图片" section.
      const imageSection = sliceSection(block, '🖼️')
      if (!imageSection) continue
      const imgs = [
        ...imageSection.matchAll(
          /https:\/\/cms-assets\.youmind\.com\/[^\s)"']+/gi
        ),
      ].map((x) => x[0].replace(/["'<>)]+$/g, ''))
      if (!imgs.length) continue

      // Details: 作者 / 来源 / 时间.
      const detailSection = sliceSection(block, '📌')
      const author = detailSection
        ? /\*\*作者[：:]?\*\*\s*\[?([^\]]+)\]?/.exec(detailSection)?.[1]?.trim()
        : undefined
      const source = detailSection
        ? /\*\*来源[：:]?\*\*\s*\[?[^\]]*\]?\s*\(([^)]+)\)/.exec(
            detailSection
          )?.[1]
        : undefined

      items.push({
        id: promptFingerprint(prompt),
        collection: slug,
        sourceId: no,
        title,
        image: imgs[0],
        images: imgs.length > 1 ? imgs : undefined,
        prompt,
        author,
        source,
        nativeCategory: 'youmind',
      })
    }

    return { items, changed, count: items.length }
  }
}

/**
 * Return the substring of `block` under a `#### <emoji>` heading, stopping at
 * the next `####` or `###` heading. Emoji arg is the marker char(s) e.g. "📝".
 */
function sliceSection(block, emojiMarker) {
  // Match the heading line containing the emoji marker.
  const re = new RegExp(
    `^####\\s+[^\\n]*${emojiMarker}[^\\n]*$`,
    'm'
  )
  const head = re.exec(block)
  if (!head) return null
  const after = block.slice(head.index + head[0].length)
  // Stop at the next same-or-higher level heading.
  const next = /^(?:#{1,4})\s/m.exec(after)
  return next ? after.slice(0, next.index) : after
}

export const fetchGptImage2 = makeYoumindFetcher({
  slug: 'youmind-gpt-image-2',
  repo: 'awesome-gpt-image-2',
  file: 'README_zh.md',
})

export const fetchNanoBanana = makeYoumindFetcher({
  slug: 'youmind-nano-banana',
  repo: 'awesome-nano-banana-pro-prompts',
  file: 'README_zh.md',
})
