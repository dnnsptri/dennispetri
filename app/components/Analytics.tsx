import Script from 'next/script'
import { gaMeasurementId } from '../site'

/**
 * Google Analytics 4, standard configuration with device storage enabled.
 *
 * DELIBERATE: storage is on and there is no consent banner. This is Dennis's
 * decision, made knowingly, not an oversight. Do not "fix" it by silently
 * adding a banner or switching to cookieless.
 *
 * What that buys: GA sets its `_ga` cookie, so returning visitors, session
 * continuity and referrer attribution are accurate.
 *
 * What it costs: under GDPR/ePrivacy, writing an identifier to an EU
 * visitor's device needs prior consent. Without a banner there is no consent,
 * so this setup carries real regulatory risk, and the Dutch AP has been
 * notably active on Google Analytics specifically. If that risk ever needs to
 * go away, the options are a consent banner or a cookieless/non-Google tool.
 *
 * Risk is trimmed where it costs nothing: ad personalisation and Google
 * Signals stay off, so this traffic never feeds an advertising profile, and
 * IPs are anonymised.
 */
export default function Analytics() {
  // Only production reports. Preview deployments and local dev would otherwise
  // land in the same property and dirty the numbers. Checked on the server, so
  // the scripts are never sent to the browser anywhere else.
  if (process.env.VERCEL_ENV !== 'production') {
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}

          gtag('js', new Date());
          gtag('config', '${gaMeasurementId}', {
            anonymize_ip: true,
            allow_google_signals: false,
            allow_ad_personalization_signals: false
          });
        `}
      </Script>
    </>
  )
}
