// @ts-check
/**
 * Parse gallery markdown files from freestylefly/awesome-gpt-image-2 into cases.json.
 *
 * Each case follows a consistent structure:
 *   ### 例 N：标题
 *   ![alt](../data/images/caseN.jpg)
 *   **来源：** ...
 *   **提示词：**
 *   ```text
 *   ...prompt...
 *   ```
 *   ***
 *
 * Images live on the GitHub raw CDN — no need to download them.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

const RAW_BASE =
  'https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main'

const CACHE_DIR = resolve(ROOT, 'scripts', '.cache')

const SOURCES = [
  {
    name: 'part-1',
    url: `${RAW_BASE}/docs/gallery-part-1.md`,
    cache: resolve(CACHE_DIR, 'gallery-part-1.md'),
  },
  {
    name: 'part-2',
    url: `${RAW_BASE}/docs/gallery-part-2.md`,
    cache: resolve(CACHE_DIR, 'gallery-part-2.md'),
  },
]

async function fetchText(url, cachePath) {
  if (existsSync(cachePath)) {
    return readFileSync(cachePath, 'utf8')
  }
  console.log(`  ↓ fetching ${url}`)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  const text = await res.text()
  mkdirSync(dirname(cachePath), { recursive: true })
  writeFileSync(cachePath, text, 'utf8')
  return text
}

// Regex pieces for parsing a single case block.
const CASE_HEADER = /^### 例\s*(\d+)\s*[：:]\s*(.+?)\s*$/m
// Image line. The alt text in some cases wraps across multiple lines
// (e.g. cases 78-80 use a long prompt-like alt), so allow `[...]` to span
// lines. The URL always points at ../data/images/caseN.jpg.
const IMAGE_LINE = /!\[[\s\S]*?\]\((\.\.\/data\/images\/[^)]+)\)/
const SOURCE_LINE = /^\*\*来源[：:]?\*\*\s*(.+?)\s*$/m

function parseMarkdown(md) {
  // Split into case blocks using the "***" separator.
  const blocks = md.split(/^\*\*\*\s*$/m)
  const cases = []

  for (const block of blocks) {
    const header = block.match(CASE_HEADER)
    if (!header) continue
    const id = Number(header[1])
    const title = header[2].trim()

    const imageMatch = block.match(IMAGE_LINE)
    const sourceMatch = block.match(SOURCE_LINE)

    // Prompt: text inside the ```text fenced block(s). A case may contain
    // multiple fenced blocks (e.g. inline examples); capture all and join.
    const promptFences = []
    const fenceRe = /```text\r?\n([\s\S]*?)```/g
    let fm
    while ((fm = fenceRe.exec(block)) !== null) {
      promptFences.push(fm[1])
    }
    const prompt = promptFences.join('\n\n').trim()

    if (!imageMatch) {
      // Skip entries without an image (rare/placeholder).
      continue
    }

    const relPath = imageMatch[1].replace(/^\.\.\//, '')
    const image = `${RAW_BASE}/${relPath}`

    const rawSource = sourceMatch ? sourceMatch[1].trim() : ''
    const source = rawSource && rawSource !== '未提供' ? rawSource : ''

    cases.push({
      id,
      title,
      image,
      source,
      prompt,
    })
  }

  return cases
}

async function main() {
  console.log('Parsing gallery markdown → cases.json')
  const all = []
  for (const src of SOURCES) {
    const md = await fetchText(src.url, src.cache)
    const cases = parseMarkdown(md)
    console.log(`  ${src.name}: ${cases.length} cases`)
    all.push(...cases)
  }

  // De-dup by id, keep first occurrence (part-1 wins), then sort ascending.
  const seen = new Set()
  const unique = []
  for (const c of all) {
    if (seen.has(c.id)) continue
    seen.add(c.id)
    unique.push(c)
  }
  unique.sort((a, b) => a.id - b.id)

  const outDir = resolve(ROOT, 'src', 'data')
  mkdirSync(outDir, { recursive: true })
  const outPath = resolve(outDir, 'cases.json')
  writeFileSync(outPath, JSON.stringify(unique, null, 2), 'utf8')
  console.log(`\n✓ Wrote ${unique.length} cases → ${outPath}`)
  console.log(
    `  ids: ${unique[0].id}..${unique[unique.length - 1].id}, ${
      unique.filter((c) => !c.prompt).length
    } without prompt`
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
