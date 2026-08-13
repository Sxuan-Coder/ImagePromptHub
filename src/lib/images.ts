/**
 * Image source fallback layer.
 *
 * `raw.githubusercontent.com` is unreachable on many mobile networks (notably
 * in mainland China) while it works fine on desktop or via a VPN. Most of this
 * project's images (all 517 cases + ~484 prompt entries) are hosted there.
 *
 * We therefore mirror GitHub raw images through jsDelivr, a global CDN with
 * China reach, and keep two independent jsDelivr backends before finally
 * falling back to the original raw URL. Non-GitHub hosts (youmind / imgedify /
 * twimg, etc.) are already on their own CDNs and are returned unchanged.
 *
 * The ordered candidate list is consumed by {@link useImageLoad}, which tries
 * each in turn until one succeeds.
 */

const RAW_GH_RE =
  /^https?:\/\/raw\.githubusercontent\.com\/([^/]+)\/([^/]+)\/([^/]+)\/(.+)$/i

/**
 * Ordered candidate URLs for an image, primary first.
 *
 * - GitHub raw → `[cdn.jsdelivr.net, fastly.jsdelivr.net, raw]`
 * - any other host → `[url]` (single candidate, no mirror)
 * - empty input → `[]`
 */
export function imageSources(url: string): string[] {
  if (!url) return []
  const m = url.match(RAW_GH_RE)
  if (m) {
    const [, owner, repo, ref, path] = m
    const base = `${owner}/${repo}@${ref}/${path}`
    return [
      `https://cdn.jsdelivr.net/gh/${base}`,
      `https://fastly.jsdelivr.net/gh/${base}`,
      url, // raw as last resort
    ]
  }
  return [url]
}

/**
 * Best (primary) candidate for an image — for non-hook callers such as
 * thumbnail strips that don't need full fallback probing.
 */
export function primaryImageSrc(url: string): string {
  return imageSources(url)[0] ?? url
}
