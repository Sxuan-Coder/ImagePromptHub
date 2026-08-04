// @ts-check
/**
 * Master entry point for the prompt pipeline.
 *
 *   node scripts/fetch-prompts.mjs        # incremental update
 *
 * Pipeline:
 *   1. Read existing src/data/prompts.json (if any).
 *   2. Fetch each of the 5 sources (with ETag caching).
 *   3. Merge: append only items whose fingerprint id is not already present.
 *   4. Write prompts.json + prompts-manifest.json.
 *
 * The script is idempotent and cheap: when no source has changed (304), it
 * still re-parses cached bodies but appends nothing — the output is
 * byte-identical to the previous run.
 */
import {
  readPrompts,
  readManifest,
  mergeItems,
  writePrompts,
} from './prompts/lib/store.mjs'
import { fetchDavidwu } from './prompts/sources/davidwu.mjs'
import { fetchZerolu } from './prompts/sources/zerolu.mjs'
import { fetchImgedify } from './prompts/sources/imgedify.mjs'
import {
  fetchGptImage2,
  fetchNanoBanana,
} from './prompts/sources/youmind.mjs'

const SOURCES = [
  { name: 'davidwu', fn: fetchDavidwu },
  { name: 'zerolu', fn: fetchZerolu },
  { name: 'imgedify', fn: fetchImgedify },
  { name: 'youmind-gpt-image-2', fn: fetchGptImage2 },
  { name: 'youmind-nano-banana', fn: fetchNanoBanana },
]

async function main() {
  const existing = readPrompts()
  const prevManifest = readManifest()
  const fetchedAt = new Date().toISOString()

  console.log(`Fetching prompts — ${existing.length} existing items`)
  console.log('─'.repeat(50))

  let all = existing
  const sourceStats = {}
  let totalAdded = 0

  for (const { name, fn } of SOURCES) {
    try {
      const { items, changed, count } = await fn()
      const before = all.length
      const merged = mergeItems(all, items, fetchedAt)
      all = merged.items
      const added = merged.added.length
      totalAdded += added
      sourceStats[name] = {
        count,
        added,
        changed,
      }
      console.log(
        `  ${name.padEnd(22)} parsed=${String(count).padStart(4)}  +${String(
          added
        ).padStart(3)} new  (cache ${changed ? 'refreshed' : 'unchanged'})`
      )
    } catch (err) {
      console.error(`  ✗ ${name}: ${err.message}`)
      sourceStats[name] = { count: 0, added: 0, error: err.message }
    }
  }

  console.log('─'.repeat(50))

  const { PROMPTS_PATH, MANIFEST_PATH, manifest } = writePrompts(
    all,
    sourceStats
  )

  console.log(
    `\n✓ ${existing.length} → ${all.length} items (+${totalAdded} new)`
  )
  console.log(`  prompts.json → ${PROMPTS_PATH}`)
  console.log(`  manifest     → ${MANIFEST_PATH}`)
  console.log(`  last updated ${manifest.lastUpdated}`)

  if (prevManifest.total && totalAdded === 0) {
    console.log('  (no new items since last run)')
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
