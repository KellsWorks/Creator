export type ActionType = 'navigate' | 'form' | 'url'

export type LandingLayout = 'grid' | 'list'

export type LandingAction = {
  id: string
  label: string
  icon: string
  color: string
  type: ActionType
  /** Route, form ID or URL, depending on `type`. */
  target: string
}

export type LandingPage = {
  title: string
  subtitle: string
  layout: LandingLayout
}

export type ModuleConfig = {
  id: string
  name: string
  description: string
  icon: string
  color: string
  landingPage: LandingPage
  actions: LandingAction[]
  updatedAt: string
}
