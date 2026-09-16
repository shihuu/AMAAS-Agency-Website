/**
 * Utility functions for project live URLs and website screenshot generation.
 */

/**
 * Normalizes a user-entered live website URL.
 * - Trims whitespace
 * - If empty or '#', returns empty string
 * - If user enters "clientwebsite.com", automatically converts to "https://clientwebsite.com"
 * - Preserves existing http:// or https://
 */
export function normalizeLiveUrl(url?: string | null): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed || trimmed === '#') return '';

  // Already starts with http:// or https://
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  // Starts with protocol-relative "//"
  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`;
  }

  // Plain domain or path, e.g. "example.com" or "example.com/sub"
  return `https://${trimmed}`;
}

/**
 * Generates an array of tiered screenshot preview image URLs for a project's live homepage.
 *
 * Tier 1: thum.io — High-speed, publicly accessible screenshot service that handles all standard
 *         and custom web apps (including subdomains and SPAs). Delivers direct image data (image/png).
 * Tier 2: Microlink screenshot embed — High-definition rendering of public web pages.
 * Tier 3: WordPress mshots — Official WordPress global screenshot cache.
 */
export function getWebsiteScreenshotUrls(rawUrl?: string | null): string[] {
  const normalized = normalizeLiveUrl(rawUrl);
  if (!normalized) return [];

  const urls: string[] = [];

  try {
    // 1. thum.io (direct image rendering, highly reliable across web app domains)
    urls.push(`https://image.thum.io/get/width/1200/crop/800/noanimate/${normalized}`);

    // 2. Microlink API screenshot embed (full browser rendering)
    const encoded = encodeURIComponent(normalized);
    urls.push(`https://api.microlink.io?url=${encoded}&screenshot=true&embed=screenshot.url`);

    // 3. WordPress mshots (widely cached public service)
    urls.push(`https://s.wordpress.com/mshots/v1/${encoded}?w=1200`);
  } catch {
    // Gracefully handle any URI encoding errors
  }

  return urls;
}

/**
 * Convenience getter for primary screenshot URL
 */
export function getWebsiteScreenshotUrl(rawUrl?: string | null): string | null {
  const urls = getWebsiteScreenshotUrls(rawUrl);
  return urls.length > 0 ? urls[0] : null;
}
