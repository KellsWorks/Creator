import type { FormSchema, SelectOption } from '~/types/form'
import type { LandingAction, ModuleConfig } from '~/types/module'
import { uid, validators } from '~/utils/form'

export const actionTypeOptions: SelectOption[] = [
  { title: 'Open a page', value: 'navigate', icon: 'mdi-arrow-right-circle' },
  { title: 'Open a form', value: 'form', icon: 'mdi-form-select' },
  { title: 'Open a link', value: 'url', icon: 'mdi-open-in-new' },
]

export const layoutOptions: SelectOption[] = [
  { title: 'Grid', value: 'grid', icon: 'mdi-view-grid' },
  { title: 'List', value: 'list', icon: 'mdi-view-list' },
]

export const createAction = (): LandingAction => ({
  id: uid(),
  label: '',
  icon: 'mdi-arrow-right-circle',
  color: 'primary',
  type: 'navigate',
  target: '',
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
    layout: 'grid',
  },
  actions: [],
  updatedAt: new Date().toISOString(),
})

export const moduleFormSchema: FormSchema = [
  {
    title: 'Details',
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
    description: 'The first screen people see when they open the module.',
    key: 'landingPage',
    fields: [
      { type: 'text', key: 'title', label: 'Title', required: true, maxLength: 60, cols: 8 },
      { type: 'select', key: 'layout', label: 'Layout', options: layoutOptions, required: true, cols: 4 },
      { type: 'textarea', key: 'subtitle', label: 'Subtitle', rows: 2, maxLength: 200 },
    ],
  },
  {
    title: 'Landing actions',
    description: 'The buttons on the landing page and what each one opens.',
    fields: [
      {
        type: 'list',
        key: 'actions',
        label: 'Actions',
        itemLabel: 'Action',
        required: true,
        maxItems: 12,
        newItem: createAction,
        itemTitle: (action, index) => action.label || `Action ${index + 1}`,
        fields: [
          { type: 'text', key: 'label', label: 'Label', required: true, maxLength: 30, cols: 6 },
          { type: 'icon', key: 'icon', label: 'Icon', required: true, cols: 3 },
          { type: 'color', key: 'color', label: 'Color', required: true, cols: 3 },
          { type: 'select', key: 'type', label: 'Opens', options: actionTypeOptions, required: true, cols: 4 },
          {
            type: 'text',
            key: 'target',
            label: 'Route',
            placeholder: '/patients',
            required: true,
            rules: [validators.route],
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
