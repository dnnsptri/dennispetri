'use client'

import { useEffect, useRef } from 'react'
import { ArrowSouthWest } from './Icons'

// The glyph is drawn pointing down-left. In screen terms, where 0deg is right
// and angles increase clockwise, that rest direction is 135deg. Every rotation
// below is expressed relative to it, so 0 means "back to how it was drawn".
const REST_ANGLE_DEG = 135

// Sizing and baseline seating live here rather than in page.tsx, because the
// rotation has to compose with the baseline nudge in one transform. See
// Icons.tsx for why 1.15em, and the commit for how -0.054em was derived.
const WIDTH = '1.15em'
const BASELINE_NUDGE = 'translateY(-0.054em)'

// The arrow lands pointing due right, then turns clockwise onto the button.
// -135 relative to a 135deg rest heading is an absolute 0deg, i.e. east.
// Rotating from there up to 0 increases the angle, and a rising CSS rotate()
// turns clockwise, which is the "turn right" half of the effect.
const INTRO_FROM_DEG = -135
const INTRO_DELAY_MS = 2850
const INTRO_MS = 800

// When the arrow swings into line with the CTA, the CTA answers with a quick
// bump. "In line with" means the pointer lies along the arrow-to-button ray,
// so it still counts when the pointer is past the button. Mouse and stylus
// only: on touch the arrow just plays its intro and stays at rest.
const BUTTON_SELECTOR = '.btn-primary'
const BUMP_CLASS = 'btn-bump'
// Half-angle of the cone that counts as aligned. This has to be wider than the
// offset between the arrow's rest heading and the true bearing to the button
// (~20deg at desktop): the arrow reads as pointing at the button when at rest,
// so resting must count as aimed, otherwise neither the intro landing nor the
// spring-back ever bumps and the effect looks dead.
const BUMP_CONE_DEG = 30

// Short enough to feel like tracking, long enough that fast flicks across the
// screen do not judder.
const FOLLOW_MS = 140
// How still the pointer must be before the arrow gives up and springs home.
const RETURN_DELAY_MS = 450
// Overshoot curve, so it settles with a small bounce instead of a dead glide.
const RETURN_MS = 700
const RETURN_EASING = 'cubic-bezier(0.34, 1.56, 0.64, 1)'

export default function HeadlineArrow() {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Kept unwrapped, so it can sit outside -180..180. CSS interpolates the
    // literal rotate() number, so feeding it atan2's output directly makes the
    // arrow spin a full turn whenever the pointer crosses the wrap boundary.
    let currentDeg = INTRO_FROM_DEG

    const apply = (deg: number, ms: number, easing: string) => {
      el.style.transition = `transform ${ms}ms ${easing}`
      el.style.transform = `${BASELINE_NUDGE} rotate(${deg.toFixed(1)}deg)`
    }

    // Both the intro turn and the pointer tracking are decoration. Without
    // them the arrow just sits at rest, which is the design it started from.
    // Note it is rendered pointing east, so this has to correct it.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      currentDeg = 0
      apply(0, 0, 'linear')
      return
    }

    let idleTimer: number | undefined
    let introTimer: number | undefined
    let followTimer: number | undefined

    const button = document.querySelector<HTMLElement>(BUTTON_SELECTOR)
    // Latched, so the bump fires once on entering the cone rather than on
    // every pointermove while the arrow happens to be aimed at the button.
    let aimedAtButton = false

    const clearBump = () => button?.classList.remove(BUMP_CLASS)
    button?.addEventListener('animationend', clearBump)

    // Signed difference in degrees, folded into -180..180.
    const norm180 = (deg: number) => ((((deg + 180) % 360) + 360) % 360) - 180

    const bump = () => {
      if (!button) return
      // Re-adding alone will not replay a running animation; the reflow
      // between removal and re-add is what restarts it.
      button.classList.remove(BUMP_CLASS)
      void button.offsetWidth
      button.classList.add(BUMP_CLASS)
    }

    // One predicate for "the arrow is aimed at the button", used everywhere the
    // arrow settles: tracking, the intro landing, and the spring-back. Bearings
    // are recomputed each time because both boxes move with layout.
    const updateAim = (headingRelDeg: number) => {
      if (!button) return
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const b = button.getBoundingClientRect()
      const toButton =
        (Math.atan2(b.top + b.height / 2 - cy, b.left + b.width / 2 - cx) * 180) / Math.PI
      // headingRelDeg is relative to the drawn rest heading, so add it back to
      // get where the arrow actually points on screen.
      const aimed = Math.abs(norm180(headingRelDeg + REST_ANGLE_DEG - toButton)) <= BUMP_CONE_DEG
      // Rising edge only, so it fires on entering the cone rather than on every
      // pointermove while already inside it.
      if (aimed && !aimedAtButton) bump()
      aimedAtButton = aimed
    }

    const onMove = (e: PointerEvent) => {
      // Finger never drives the arrow: on touch the pointer is the content you
      // are trying to read, so tracking it means the arrow chases the hand
      // covering the headline. A stylus is a deliberate pointing device, so it
      // counts. Filtering per event rather than per device is what keeps an
      // iPad working with a trackpad or Pencil, since the same page reports
      // 'mouse' and 'pen' there while a finger still reports 'touch'.
      if (e.pointerType === 'touch') return

      // Rotation is about the element's centre, so the axis-aligned box that
      // getBoundingClientRect returns while rotated still has the right centre.
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const angle = (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI

      // Advance by the shortest signed step rather than jumping to the raw
      // value, which keeps the motion continuous across the boundary.
      const delta = norm180(angle - REST_ANGLE_DEG - currentDeg)
      currentDeg += delta
      apply(currentDeg, FOLLOW_MS, 'linear')

      updateAim(currentDeg)

      window.clearTimeout(idleTimer)
      idleTimer = window.setTimeout(() => {
        // Unwind to the nearest visual rest rather than to literal 0, so the
        // arrow never rewinds several turns to get home.
        currentDeg = Math.round(currentDeg / 360) * 360
        apply(currentDeg, RETURN_MS, RETURN_EASING)
        // Deliberately no bump here. Rest is where the arrow goes whenever the
        // pointer stops, so bumping on arrival fires on idleness rather than
        // intent, and lands over a second after the user did anything.
      }, RETURN_DELAY_MS)
    }

    introTimer = window.setTimeout(() => {
      currentDeg = 0
      apply(currentDeg, INTRO_MS, RETURN_EASING)
      // Hold off on tracking until the intro has landed, so an early mouse
      // move cannot yank the arrow mid-turn.
      followTimer = window.setTimeout(() => {
        // The turn has just landed on the button; announce it, then start
        // following the pointer.
        updateAim(currentDeg)
        // pointermove also fires for touch; onMove filters that out.
        window.addEventListener('pointermove', onMove, { passive: true })
      }, INTRO_MS)
    }, INTRO_DELAY_MS)

    return () => {
      window.clearTimeout(introTimer)
      window.clearTimeout(followTimer)
      window.clearTimeout(idleTimer)
      window.removeEventListener('pointermove', onMove)
      button?.removeEventListener('animationend', clearBump)
      button?.classList.remove(BUMP_CLASS)
    }
  }, [])

  return (
    <ArrowSouthWest
      ref={ref}
      style={{
        display: 'inline-block',
        width: WIDTH,
        height: WIDTH,
        // Rendered already pointing east, so there is no flash of the rest
        // position before the intro turn begins.
        transform: `${BASELINE_NUDGE} rotate(${INTRO_FROM_DEG}deg)`,
      }}
    />
  )
}
