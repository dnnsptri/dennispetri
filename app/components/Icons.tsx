// Material Symbols (Apache 2.0), outlined, weight 300. Weight is tied to the
// rendered box, not to the font: the arrow is drawn at 1.15em so its stroke of
// 60/960 lands at ~6% of 92px, within a hair of Manrope 400's stem at headline
// size. Heavier weights read as an icon bolted on rather than a glyph in the
// line. Rescale the arrow and the weight has to be re-derived.
// These are Google's official 24px exports, so the odd "0 -960 960 960"
// viewBox is theirs: the glyph is drawn above the origin. Do not "fix" it.
//
// Sized in em and filled with currentColor, so it inherits the size and colour
// of whatever type it sits next to.

import type { CSSProperties } from 'react'

type IconProps = {
  className?: string
  style?: CSSProperties
}

/** Closes the headline, gesturing down-left toward the CTA. */
export function ArrowSouthWest({ className, style }: IconProps) {
  return (
    <svg
      viewBox="0 -960 960 960"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={style}
    >
      <path d="M210-210v-380h60v277.85l474-474L786.15-744l-474 474H590v60H210Z" />
    </svg>
  )
}
