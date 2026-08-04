// @ts-check
/**
 * zerolu source — `ZeroLu/awesome-gpt-image` (README.zh-CN.md).
 *
 * Markdown layout (per entry):
 *   ### 标题
 *   <img ...>  or  | col1 | col2 |  table with images
 *   **提示词:** (optional inline)
 *   ```text
 *   ...prompt...
 *   ```
 *   **来源:** [@author](url)  |  *来源: [name](url)*
 *   ---
 *
 * Sections are separated by `---`; the section heading carries the title and
 * a section keyword (📷 摄影 / 🎮 游戏 / 📱 UI …) used as a native category.
 */
import { fetchText } from '../lib/store.mjs'
import { promptFingerprint } from '../lib/hash.mjs'
import { collapse } from '../lib/normalize.mjs'

const SLUG = 'zerolu'
const RAW_BASE =
  'https://raw.githubusercontent.com/ZeroLu/awesome-gpt-image/main'

// ## 📷 摄影与照片级写实  →  category label after emoji
const SECTION_HEADER = /^##\s+.\s*(.+?)\s*$/m

const URL_RX = /https?:\/\/[^\s)"']+/gi

/** Extract the first usable image URL from a block. */
function firstImage(block) {
  // Prefer markdown image syntax, fall back to bare <img src="..."> and
  // raw github/pbs.twimg URLs. Skip shields.io badges & anchors.
  const mdImg = /!\[[\s\S]*?\]\(([^)]+)\)/.exec(block)
  if (mdImg) return mdImg[1]
  const htmlImg = /<img[^>]+src=["']([^"']+)["']/i.exec(block)
  if (htmlImg) return htmlImg[1]
  const urls = block.match(URL_RX) || []
  return (
    urls.find(
      (u) =>
        !/shields\.io|awesome\.re|img\.shields|user-attachments\/assets\/[0-9a-f-]+$/.test(u) ||
        /user-attachments\/assets\//.test(u)
    ) || urls[0]
  )
}

function extractAuthor(block) {
  // **来源:** [@name](url) | *来源: [name](url)*
  const m =
    /\*\*?来源[：:]?\*\*?\s*\[?(@?[\w\-.·\u4e00-\u9fff]+)\]?(?:\([^)]*\))?/.exec(
      block
    )
  if (m && m[1]) return m[1]
  return undefined
}

export async function fetchZerolu() {
  const { text, changed } = await fetchText(
    `${RAW_BASE}/README.zh-CN.md`,
    SLUG
  )

  // Track the active "## 📷 摄影..." section as we scan, so each entry can
  // inherit the section's category label.
  let currentSection = ''
  const entries = []
  let cur = null // { title, lines: [] }

  const flush = () => {
    if (!cur) return
    const block = cur.lines.join('\n')
    // Prompt: capture all ``` fences, prefer the `text` one.
    const fences = [...block.matchAll(/```(?:[a-z]*)\n([\s\S]*?)```/g)]
    if (fences.length) {
      const textFence = fences.find((f) => /```text/.test(f[0])) || fences[0]
      const prompt = collapse(textFence[1])
      const image = firstImage(block)
      if (prompt && image) {
        entries.push({
          id: promptFingerprint(prompt),
          collection: SLUG,
          sourceId: cur.title,
          title: cur.title,
          image,
          prompt,
          author: extractAuthor(block),
          nativeCategory: cur.section || undefined,
        })
      }
    }
    cur = null
  }

  for (const line of text.split('\n')) {
    const sec = /^##\s+.?\s*(\S[^\n]*)$/.exec(line)
    if (sec) {
      flush()
      currentSection = sec[1].trim()
      continue
    }
    const h3 = /^###\s+(.+?)\s*$/.exec(line)
    if (h3) {
      // A new entry starts at each `###` heading (these are the prompt
      // entries; `##` are the section groupings).
      flush()
      cur = { title: h3[1].replace(/\s+/g, ' ').trim(), section: currentSection, lines: [] }
      continue
    }
    if (cur) cur.lines.push(line)
  }
  flush()

  return { items: entries, changed, count: entries.length }
}
