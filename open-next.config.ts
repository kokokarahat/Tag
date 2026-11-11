import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

/**
 * Cloudflare adapter for the clone.
 *
 * `r2IncrementalCache` keeps ISR/route-cache output in the R2 bucket declared in
 * `wrangler.jsonc`. Create that bucket once with:
 *
 *   npx wrangler r2 bucket create tagmarkets-clone-opennext-cache
 */
export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
});
