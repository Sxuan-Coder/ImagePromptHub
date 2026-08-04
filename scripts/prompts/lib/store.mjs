// @ts-check
/**
 * Storage + fetch layer for the prompt pipeline.
 *
 * Responsibilities:
 *  - Fetch upstream source files with on-disk caching + ETag reuse, so a
 *    source that hasn't changed is not re-downloaded (and not re-parsed).
 *  - Read/merge the master `prompts.json` incrementally: existing items (by
 *    fingerprint id) are preserved verbatim; only genuinely new items are
 *    appended. This keeps the file monotonic and diffs reviewable.
 *  - Maintain a manifest of per-source counts + last-fetched timestamps.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..', '..', '..')
const CACHE_DIR = resolve(ROOT, 'scripts', '.cache', 'prompts')
const DATA_DIR = resolve(ROOT, 'src', 'data')
const PROMPTS_PATH = resolve(DATA_DIR, 'prompts.json')
const MANIFEST_PATH = resolve(DATA_DIR, 'prompts-manifest.json')

/**
 * Fetch a text resource with HTTP-level ETag caching.
 * Returns { text, changed } where `changed` indicates whether the content
 * differs from the cached copy (false ⇒ caller can skip parsing).
 */
export async function fetchText(url, cacheName) {
  mkdirSync(CACHE_DIR, { recursive: true })
  const cachePath = resolve(CACHE_DIR, `${cacheName}.txt`)
  const metaPath = resolve(CACHE_DIR, `${cacheName}.meta.json`)

  const headers = { 'user-agent': 'image-prompt-hub/fetcher' }
  if (existsSync(metaPath)) {
    try {
      const meta = JSON.parse(readFileSync(metaPath, 'utf8'))
      if (meta.etag) headers['if-none-match'] = meta.etag
    } catch {
      /* ignore broken meta */
    }
  }

  const res = await fetch(url, { headers })
  if (res.status === 304 && existsSync(cachePath)) {
    return { text: readFileSync(cachePath, 'utf8'), changed: false }
  }
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)

  const text = await res.text()
  writeFileSync(cachePath, text, 'utf8')
  writeFileSync(
    metaPath,
    JSON.stringify(
      { etag: res.headers.get('etag'), url, fetchedAt: new Date().toISOString() },
      null,
      2
    ),
    'utf8'
  )
  return { text, changed: true }
}

/** Read the current master dataset (or return an empty baseline). */
export function readPrompts() {
  if (!existsSync(PROMPTS_PATH)) return []
  try {
    return JSON.parse(readFileSync(PROMPTS_PATH, 'utf8'))
  } catch {
    return []
  }
}

export function readManifest() {
  if (!existsSync(MANIFEST_PATH)) {
    return { lastUpdated: null, sources: {}, total: 0 }
  }
  try {
    return JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'))
  } catch {
    return { lastUpdated: null, sources: {}, total: 0 }
  }
}

/**
 * Merge freshly-parsed items into the existing dataset.
 * - Items whose id already exists are skipped (first-seen wins).
 * - New items are appended with `fetchedAt` set.
 * Returns { items, added, skipped }.
 */
export function mergeItems(existing, incoming, fetchedAt) {
  const seen = new Set(existing.map((it) => it.id))
  const added = []
  let skipped = 0
  for (const raw of incoming) {
    if (!raw || !raw.id) {
      skipped++
      continue
    }
    if (seen.has(raw.id)) {
      skipped++
      continue
    }
    seen.add(raw.id)
    added.push({ ...raw, fetchedAt })
  }
  return { items: [...existing, ...added], added, skipped }
}

/** Persist the master dataset + manifest atomically enough for CLI use. */
export function writePrompts(items, sourceStats) {
  mkdirSync(DATA_DIR, { recursive: true })
  const now = new Date().toISOString()
  writeFileSync(PROMPTS_PATH, JSON.stringify(items, null, 2), 'utf8')

  const manifest = {
    lastUpdated: now,
    total: items.length,
    sources: sourceStats,
  }
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8')
  return { PROMPTS_PATH, MANIFEST_PATH, manifest }
}

export const PATHS = { PROMPTS_PATH, MANIFEST_PATH, CACHE_DIR }
