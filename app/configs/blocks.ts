import type { FieldSchema, FormModel, ListField, ListVariant, SelectField, SelectOption } from '~/types/form'
import type { CustomComponent } from '~/types/component'
import type { Block, BlockType, BlockWidth, ModulePage } from '~/types/module'
import { clone, uid } from '~/utils/form'

export const LANDING_PAGE_ID = 'landing'

export const widthCols: Record<BlockWidth, number> = {
  full: 12,
  half: 6,
  third: 4,
  quarter: 3,
}

const widthOptions: SelectOption[] = [
  { title: 'Full width', value: 'full', icon: 'mdi-rectangle-outline' },
  { title: 'Half', value: 'half', icon: 'mdi-view-split-vertical' },
  { title: 'Third', value: 'third', icon: 'mdi-view-column-outline' },
  { title: 'Quarter', value: 'quarter', icon: 'mdi-view-grid-outline' },
]

/** Every page in the module, landing page first, for "opens page" dropdowns. */
export const pageOptions = (root: FormModel): SelectOption[] => [
  { title: 'Landing page', value: LANDING_PAGE_ID, icon: 'mdi-home' },
  ...((root.pages ?? []) as ModulePage[]).map((page, index) => ({
    title: page.title || `Page ${index + 1}`,
    value: page.id,
    icon: 'mdi-file-document-outline',
  })),
]

const widthField = (cols = 4): SelectField => ({
  type: 'select',
  key: 'width',
  label: 'Width',
  options: widthOptions,
  required: true,
  cols,
})

const variant = <T extends Block>(
  label: string,
  icon: string,
  newItem: () => Omit<T, 'id'>,
  fields: FieldSchema[],
): ListVariant => ({
  label,
  icon,
  fields,
  newItem: () => ({ id: uid(), ...newItem() }),
})

export const blockVariants: Record<BlockType, ListVariant> = {
  heading: variant('Heading', 'mdi-format-header-pound', () => ({ type: 'heading', width: 'full', text: '', size: 'medium' }), [
    { type: 'text', key: 'text', label: 'Text', required: true, maxLength: 80, cols: 8 },
    {
      type: 'select',
      key: 'size',
      label: 'Size',
      required: true,
      cols: 4,
      options: [
        { title: 'Large', value: 'large' },
        { title: 'Medium', value: 'medium' },
        { title: 'Small', value: 'small' },
      ],
    },
  ]),

  text: variant('Text', 'mdi-text', () => ({ type: 'text', width: 'full', text: '' }), [
    { type: 'textarea', key: 'text', label: 'Text', required: true, rows: 3, maxLength: 1000 },
    widthField(),
  ]),

  stat: variant('Stat', 'mdi-numeric', () => ({
    type: 'stat', width: 'quarter', label: '', value: '', caption: '', icon: 'mdi-chart-line', color: 'primary',
  }), [
    { type: 'text', key: 'label', label: 'Label', required: true, maxLength: 40, placeholder: 'Admissions', cols: 6 },
    { type: 'text', key: 'value', label: 'Value', required: true, maxLength: 20, placeholder: '1,204', cols: 6 },
    { type: 'text', key: 'caption', label: 'Caption', maxLength: 60, placeholder: '+12% this week' },
    { type: 'icon', key: 'icon', label: 'Icon', required: true, cols: 4 },
    { type: 'color', key: 'color', label: 'Color', required: true, cols: 4 },
    widthField(),
  ]),

  card: variant('Card', 'mdi-card-text-outline', () => ({
    type: 'card', width: 'half', title: '', body: '', icon: '', color: 'primary', buttonLabel: '', buttonPage: '',
  }), [
    { type: 'text', key: 'title', label: 'Title', required: true, maxLength: 60, cols: 8 },
    { type: 'icon', key: 'icon', label: 'Icon', cols: 4 },
    { type: 'textarea', key: 'body', label: 'Body', rows: 2, maxLength: 500 },
    { type: 'color', key: 'color', label: 'Color', required: true, cols: 6 },
    widthField(6),
    { type: 'text', key: 'buttonLabel', label: 'Button label', maxLength: 30, hint: 'Leave empty for no button', cols: 6 },
    {
      type: 'select',
      key: 'buttonPage',
      label: 'Button opens',
      options: pageOptions,
      required: true,
      cols: 6,
      visible: card => !!card.buttonLabel,
    },
  ]),

  chart: variant('Chart', 'mdi-chart-bar', () => ({
    type: 'chart', width: 'half', title: '', chartType: 'bar', color: 'primary', points: [],
  }), [
    { type: 'text', key: 'title', label: 'Title', required: true, maxLength: 60, cols: 8 },
    {
      type: 'select',
      key: 'chartType',
      label: 'Chart',
      required: true,
      cols: 4,
      options: [
        { title: 'Bar', value: 'bar', icon: 'mdi-chart-bar' },
        { title: 'Line', value: 'line', icon: 'mdi-chart-line' },
      ],
    },
    { type: 'color', key: 'color', label: 'Color', required: true, cols: 6 },
    widthField(6),
    {
      type: 'list',
      key: 'points',
      label: 'Data',
      itemLabel: 'Data point',
      maxItems: 24,
      rules: [points => (points?.length ?? 0) >= 2 || 'Add at least two data points'],
      newItem: () => ({ id: uid(), label: '', value: 0 }),
      itemTitle: point => point.label && `${point.label}: ${point.value}`,
      fields: [
        { type: 'text', key: 'label', label: 'Label', required: true, maxLength: 20, placeholder: 'Mon', cols: 8 },
        { type: 'number', key: 'value', label: 'Value', required: true, min: 0, cols: 4 },
      ],
    },
  ]),

  list: variant('List', 'mdi-format-list-bulleted', () => ({ type: 'list', width: 'half', title: '', items: [] }), [
    { type: 'text', key: 'title', label: 'Title', maxLength: 60, cols: 8 },
    widthField(),
    {
      type: 'list',
      key: 'items',
      label: 'Items',
      itemLabel: 'Item',
      required: true,
      maxItems: 30,
      newItem: () => ({ id: uid(), title: '', subtitle: '', icon: '' }),
      itemTitle: item => item.title,
      fields: [
        { type: 'text', key: 'title', label: 'Title', required: true, maxLength: 60, cols: 6 },
        { type: 'text', key: 'subtitle', label: 'Subtitle', maxLength: 80, cols: 6 },
        { type: 'icon', key: 'icon', label: 'Icon', cols: 6 },
      ],
    },
  ]),

  actions: variant('Landing actions', 'mdi-gesture-tap-button', () => ({ type: 'actions', width: 'full', title: '', layout: 'grid' }), [
    { type: 'text', key: 'title', label: 'Title', maxLength: 60, hint: 'Shows the actions from the Actions tab', cols: 8 },
    {
      type: 'select',
      key: 'layout',
      label: 'Layout',
      required: true,
      cols: 4,
      options: [
        { title: 'Grid', value: 'grid', icon: 'mdi-view-grid' },
        { title: 'List', value: 'list', icon: 'mdi-view-list' },
      ],
    },
    widthField(12),
  ]),
}

const blockTitle = (block: FormModel) => {
  const text: string | undefined = block.title || block.label || block.text
  return text && text.length > 50 ? `${text.slice(0, 50)}…` : text
}

/** A new block made from a custom component: the base block with the component's starting content. */
export function newBlockFrom(component: CustomComponent): FormModel {
  const { id: _id, type: _type, ...content } = clone(component.content)
  return { ...blockVariants[component.base].newItem(), ...content, component: component.id }
}

/**
 * The page content field. Custom components from the library are offered in the
 * "Add block" menu, and blocks of a type that has custom components can switch between them.
 */
export function createBlocksField(custom: CustomComponent[]): ListField {
  const variants = Object.fromEntries(
    Object.entries(blockVariants).map(([type, variant]) => {
      const options = custom.filter(c => c.base === type)
      if (!options.length) return [type, variant]
      const componentField: SelectField = {
        type: 'select',
        key: 'component',
        label: 'Component',
        hint: `Leave empty for the built-in ${variant.label.toLowerCase()}`,
        clearable: true,
        options: options.map(c => ({ title: c.name, value: c.id, icon: c.icon })),
      }
      return [type, { ...variant, fields: [componentField, ...variant.fields] }]
    }),
  )

  return {
    type: 'list',
    key: 'blocks',
    label: 'Content',
    itemLabel: 'Block',
    variants,
    itemTitle: blockTitle,
    templates: [
      ...Object.values(blockVariants).map(v => ({ label: v.label, icon: v.icon, group: 'Built-in', newItem: v.newItem })),
      ...custom.map(c => ({ label: c.name, icon: c.icon, group: 'Your components', newItem: () => newBlockFrom(c) })),
    ],
  }
}

export const createActionsBlock = () => blockVariants.actions.newItem() as Block
