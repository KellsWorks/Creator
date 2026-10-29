import type { CustomComponent } from '~/types/component'
import type { FormSchema, SelectOption } from '~/types/form'
import type { LandingAction, ModuleConfig, ModulePage } from '~/types/module'
import { uid, validators } from '~/utils/form'
import { createActionsBlock, createBlocksField, LANDING_PAGE_ID, pageOptions } from './blocks'

export const actionTypeOptions: SelectOption[] = [
  { title: 'Open a page', value: 'navigate', icon: 'mdi-arrow-right-circle' },
  { title: 'Open a form', value: 'form', icon: 'mdi-form-select' },
  { title: 'Open a link', value: 'url', icon: 'mdi-open-in-new' },
]

export const createAction = (): LandingAction => ({
  id: uid(),
  label: '',
  icon: 'mdi-arrow-right-circle',
  color: 'primary',
  type: 'navigate',
  target: '',
})

export const createPage = (): ModulePage => ({
  id: uid(),
  title: '',
  subtitle: '',
  blocks: [],
})

export const createModule = (): ModuleConfig => ({
  id: uid(),
  name: '',
  description: '',
  icon: 'mdi-puzzle',
  color: 'primary',
  landingPage: {
    title: '',
    subtitle: '',
    blocks: [createActionsBlock()],
  },
  pages: [],
  actions: [],
  updatedAt: new Date().toISOString(),
})

/** Fill in anything missing from modules saved by older versions of the builder. */
export function normalizeModule(saved: Partial<ModuleConfig>): ModuleConfig {
  const defaults = createModule()
  return {
    ...defaults,
    ...saved,
    landingPage: { ...defaults.landingPage, ...saved.landingPage },
    pages: saved.pages ?? [],
    actions: saved.actions ?? [],
  }
}

export const modulePages = (module: ModuleConfig): ModulePage[] => [
  { id: LANDING_PAGE_ID, ...module.landingPage },
  ...module.pages,
]

/** The module editor's form. Rebuilt when the component library changes. */
export const createModuleFormSchema = (custom: CustomComponent[]): FormSchema => {
  const blocksField = createBlocksField(custom)
  return [
    {
      title: 'Details',
      icon: 'mdi-information-outline',
      description: 'How the module appears on the dashboard.',
      fields: [
        { type: 'text', key: 'name', label: 'Module name', required: true, maxLength: 40, cols: 6 },
        { type: 'icon', key: 'icon', label: 'Icon', required: true, cols: 3 },
        { type: 'color', key: 'color', label: 'Color', required: true, cols: 3 },
        { type: 'textarea', key: 'description', label: 'Description', rows: 2, maxLength: 160 },
      ],
    },
    {
      title: 'Landing page',
      icon: 'mdi-home-outline',
      description: 'The first screen people see when they open the module. Add blocks to build it up.',
      key: 'landingPage',
      fields: [
        { type: 'text', key: 'title', label: 'Title', required: true, maxLength: 60 },
        { type: 'textarea', key: 'subtitle', label: 'Subtitle', rows: 2, maxLength: 200 },
        blocksField,
      ],
    },
    {
      title: 'Pages',
      icon: 'mdi-file-document-multiple-outline',
      description: 'More pages in the module. Actions and card buttons can open them.',
      fields: [
        {
          type: 'list',
          key: 'pages',
          label: 'Pages',
          itemLabel: 'Page',
          maxItems: 30,
          newItem: createPage,
          itemTitle: page => page.title,
          fields: [
            { type: 'text', key: 'title', label: 'Title', required: true, maxLength: 60 },
            { type: 'textarea', key: 'subtitle', label: 'Subtitle', rows: 2, maxLength: 200 },
            blocksField,
          ],
        },
      ],
    },
    {
      title: 'Actions',
      icon: 'mdi-gesture-tap-button',
      description: 'Buttons shown wherever a page has a "Landing actions" block.',
      fields: [
        {
          type: 'list',
          key: 'actions',
          label: 'Actions',
          itemLabel: 'Action',
          maxItems: 12,
          newItem: createAction,
          itemTitle: action => action.label,
          fields: [
            { type: 'text', key: 'label', label: 'Label', required: true, maxLength: 30, cols: 6 },
            { type: 'icon', key: 'icon', label: 'Icon', required: true, cols: 3 },
            { type: 'color', key: 'color', label: 'Color', required: true, cols: 3 },
            { type: 'select', key: 'type', label: 'Opens', options: actionTypeOptions, required: true, cols: 4 },
            {
              type: 'select',
              key: 'target',
              label: 'Page',
              options: pageOptions,
              required: true,
              cols: 8,
              visible: action => action.type === 'navigate',
            },
            {
              type: 'text',
              key: 'target',
              label: 'Form ID',
              placeholder: 'patient-registration',
              required: true,
              cols: 8,
              visible: action => action.type === 'form',
            },
            {
              type: 'text',
              key: 'target',
              label: 'URL',
              placeholder: 'https://example.org',
              required: true,
              rules: [validators.url],
              cols: 8,
              visible: action => action.type === 'url',
            },
          ],
        },
      ],
    },
  ]
}
