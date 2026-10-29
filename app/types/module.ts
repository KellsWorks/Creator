export type ActionType = 'navigate' | 'form' | 'url'

export type LandingAction = {
  id: string
  label: string
  icon: string
  color: string
  type: ActionType
  /** Page ID, form ID or URL, depending on `type`. */
  target: string
}

export type BlockWidth = 'full' | 'half' | 'third' | 'quarter'

type BlockBase = {
  id: string
  width: BlockWidth
  /** ID of a custom component from the component library; empty uses the built-in look. */
  component?: string | null
}

export type HeadingBlock = BlockBase & {
  type: 'heading'
  text: string
  size: 'large' | 'medium' | 'small'
}

export type TextBlock = BlockBase & {
  type: 'text'
  text: string
}

export type StatBlock = BlockBase & {
  type: 'stat'
  label: string
  value: string
  caption: string
  icon: string
  color: string
}

export type CardBlock = BlockBase & {
  type: 'card'
  title: string
  body: string
  icon: string
  color: string
  buttonLabel: string
  /** Page the button opens. */
  buttonPage: string
}

export type ChartPoint = {
  id: string
  label: string
  value: number
}

export type ChartBlock = BlockBase & {
  type: 'chart'
  title: string
  chartType: 'bar' | 'line'
  color: string
  points: ChartPoint[]
}

export type ListBlockItem = {
  id: string
  title: string
  subtitle: string
  icon: string
}

export type ListBlock = BlockBase & {
  type: 'list'
  title: string
  items: ListBlockItem[]
}

/** Shows the module's landing actions. */
export type ActionsBlock = BlockBase & {
  type: 'actions'
  title: string
  layout: 'grid' | 'list'
}

export type Block =
  | HeadingBlock
  | TextBlock
  | StatBlock
  | CardBlock
  | ChartBlock
  | ListBlock
  | ActionsBlock

export type BlockType = Block['type']

export type ModulePage = {
  id: string
  title: string
  subtitle: string
  blocks: Block[]
}

export type LandingPage = Omit<ModulePage, 'id'>

export type ModuleConfig = {
  id: string
  name: string
  description: string
  icon: string
  color: string
  landingPage: LandingPage
  pages: ModulePage[]
  actions: LandingAction[]
  updatedAt: string
}
