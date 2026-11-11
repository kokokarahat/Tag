import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

/**
 * Cloudflare adapter for the clone.
 *
 * The app has no ISR or `revalidate`, so the read-only static-assets cache is
 * enough: prerendered pages are served straight from the Worker's assets and
 * there is no R2 bucket to create or pay for. If revalidation is added later,
 * switch back to `r2IncrementalCache` and re-add the bucket binding in
 * `wrangler.jsonc`.
 */
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
