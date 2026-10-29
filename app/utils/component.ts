import type { ComponentStyle } from '~/types/component'

/** Props for a v-card (or other surface) from a component style. */
export const surfaceProps = (style: ComponentStyle) => ({
  variant: style.variant,
  elevation: style.variant === 'elevated' ? style.elevation : undefined,
  rounded: style.rounded,
  border: style.border,
})

/** Classes for text blocks from a component style. */
export const textClasses = (style: ComponentStyle) => [
  `text-${style.align ?? 'start'}`,
  style.textColor ? `text-${style.textColor}` : '',
]
