// @ts-check
/**
 * imgedify source — `ImgEdify/Awesome-GPT4o-Image-Prompts` (README.zh-CN.md).
 *
 * Markdown layout (per entry):
 *   ### 标题
 *   <description line>
 *   - **模型：** gpt4o
 *   - **提示词文本：** `the full prompt in backticks`
 *   - **示例图片：**
 *   <img src="https://cdn.imgedify.com/..." alt="..." height="400">
 *   - **作者：** [Name](url)
 *   ---
 *
 * Entries are delimited by `---`. The prompt is a single backtick code span
 * (not a fenced block), so we pluck it from the `**提示词文本：**` line.
 */
import { fetchText } from '../lib/store.mjs'
import { promptFingerprint } from '../lib/hash.mjs'
import { collapse } from '../lib/normalize.mjs'

const SLUG = 'imgedify'
const RAW_BASE =
  'https://raw.githubusercontent.com/ImgEdify/Awesome-GPT4o-Image-Prompts/main'

// - **提示词文本：** `....`   (prompt may itself contain backticks → greedy)
const PROMPT_LINE =
  /^\s*[-*]\s*\*\*?提示词文本[：:]?\*\*?\s*`([\s\S]*?)`\s*$/m

function extractAuthor(block) {
  const m = /\*\*?作者[：:]?\*\*?\s*\[([^\]]+)\]/.exec(block)
  return m ? m[1].trim() : undefined
}

export async function fetchImgedify() {
  const { text, changed } = await fetchText(
    `${RAW_BASE}/README.zh-CN.md`,
    SLUG
  )

  // Only consider the body after the detail section starts.
  const bodyStart = text.indexOf('以下是所有可用提示词的详细信息')
  const body = bodyStart >= 0 ? text.slice(bodyStart) : text

  const items = []
  const blocks = body.split(/^---\s*$/m)

  for (const block of blocks) {
    const header = /^###\s+(.+?)\s*$/m.exec(block)
    if (!header) continue
    const title = header[1].replace(/\s+/g, ' ').trim()

    const promptMatch = PROMPT_LINE.exec(block)
    if (!promptMatch) continue
    const prompt = collapse(promptMatch[1])
    if (!prompt) continue

    // Image: first cdn.imgedify.com <img src>.
    const img = /<img[^>]+src=["'](https:\/\/cdn\.imgedify\.com[^"']+)["']/i.exec(
      block
    )
    if (!img) continue

    items.push({
      id: promptFingerprint(prompt),
      collection: SLUG,
      sourceId: title,
      title,
      image: img[1],
      prompt,
      author: extractAuthor(block),
      nativeCategory: 'gpt4o',
    })
  }

  return { items, changed, count: items.length }
}
