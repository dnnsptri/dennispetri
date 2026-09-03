// Material Symbols (Apache 2.0), outlined, weight 400. Weight is tied to both
// the rendered box and the typeface it sits beside: the arrow is drawn at
// 1.15em, so a stroke of 80/960 lands at 7.7px against Sailec 400's measured
// 8px stem at headline size. It was weight 300 for Manrope, whose stem is only
// 5.6px. Change the headline font, its weight, or the arrow's size, and this
// has to be re-derived by measuring, or the arrow stops reading as a glyph in
// the line and starts looking bolted on.
// These are Google's official 24px exports, so the odd "0 -960 960 960"
// viewBox is theirs: the glyph is drawn above the origin. Do not "fix" it.
//
// Sized in em and filled with currentColor, so it inherits the size and colour
// of whatever type it sits next to.

import { forwardRef } from 'react'
import type { CSSProperties } from 'react'

type IconProps = {
  className?: string
  style?: CSSProperties
}

/** Closes the headline, gesturing down-left toward the CTA. */
export const ArrowSouthWest = forwardRef<SVGSVGElement, IconProps>(
  function ArrowSouthWest({ className, style }, ref) {
    return (
      <svg
        ref={ref}
        viewBox="0 -960 960 960"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
        className={className}
        style={style}
      >
        <path d="M200-200v-400h80v264l464-464 56 56-464 464h264v80H200Z" />
      </svg>
    )
  }
)
