import type { BlockType } from './module'

export type SurfaceVariant = 'elevated' | 'flat' | 'tonal' | 'outlined' | 'text'

/** How a component looks. Each block type uses the properties that apply to it. */
export type ComponentStyle = {
  variant?: SurfaceVariant
  elevation?: number
  rounded?: '0' | 'sm' | 'md' | 'lg' | 'xl'
  border?: boolean
  align?: 'start' | 'center' | 'end'
  /** Theme color for text blocks; empty uses the normal text color. */
  textColor?: string | null
}

/** A named variation of a built-in block type, with its own look and starting content. */
export type CustomComponent = {
  id: string
  name: string
  icon: string
  base: BlockType
  style: ComponentStyle
  /** Content new blocks made from this component start with. */
  content: Record<string, any>
}

export type ComponentLibrary = {
  /** Overrides for the built-in look of each block type. */
  base: Partial<Record<BlockType, ComponentStyle>>
  custom: CustomComponent[]
}
