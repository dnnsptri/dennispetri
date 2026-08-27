/**
 * Single source of truth for site-wide constants.
 *
 * These are consumed by the root layout (meta, OG, Twitter), robots.ts and
 * sitemap.ts. Keeping them here stops the canonical host from drifting between
 * the metadata and the sitemap, which is the usual way a sitemap ends up
 * pointing at the wrong domain.
 */

export const siteUrl = 'https://dennispetri.nl'

export const siteTitle = 'Dennis Petri, product design & creative direction'

export const siteDescription =
  'Creative direction and product design. I decide what good looks like, and make sure it ships. Based in The Hague.'

/** GA4 measurement ID. Loaded cookieless, production only. */
export const gaMeasurementId = 'G-ZVWK9LNYE0'

/** Cache-buster for favicon URLs. Bump when the icon artwork changes. */
export const iconVersion = 2
