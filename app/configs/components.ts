import type { ComponentStyle } from '~/types/component'
import type { FieldSchema } from '~/types/form'
import type { Block, BlockType, LandingAction } from '~/types/module'
import { colorOptions } from './icons'

const surfaceFields: FieldSchema[] = [
  {
    type: 'select',
    key: 'variant',
    label: 'Style',
    required: true,
    cols: 6,
    options: [
      { title: 'Raised', value: 'elevated', icon: 'mdi-card-outline' },
      { title: 'Flat', value: 'flat', icon: 'mdi-square-outline' },
      { title: 'Tinted', value: 'tonal', icon: 'mdi-square-opacity' },
      { title: 'Outlined', value: 'outlined', icon: 'mdi-border-all-variant' },
      { title: 'Plain', value: 'text', icon: 'mdi-border-none-variant' },
    ],
  },
  {
    type: 'select',
    key: 'rounded',
    label: 'Corners',
    required: true,
    cols: 6,
    options: [
      { title: 'Square', value: '0' },
      { title: 'Slightly rounded', value: 'sm' },
      { title: 'Rounded', value: 'md' },
      { title: 'More rounded', value: 'lg' },
      { title: 'Very rounded', value: 'xl' },
    ],
  },
  {
    type: 'number',
    key: 'elevation',
    label: 'Shadow depth',
    hint: '0 (none) to 5 (deepest)',
    required: true,
    min: 0,
    max: 5,
    cols: 6,
    visible: style => style.variant === 'elevated',
  },
  { type: 'switch', key: 'border', label: 'Border', cols: 6 },
]

const textFields: FieldSchema[] = [
  {
    type: 'select',
    key: 'align',
    label: 'Alignment',
    required: true,
    cols: 6,
    options: [
      { title: 'Left', value: 'start', icon: 'mdi-format-align-left' },
      { title: 'Center', value: 'center', icon: 'mdi-format-align-center' },
      { title: 'Right', value: 'end', icon: 'mdi-format-align-right' },
    ],
  },
  {
    type: 'select',
    key: 'textColor',
    label: 'Text color',
    hint: 'Leave empty for the normal text color',
    options: colorOptions,
    clearable: true,
    cols: 6,
  },
]

/** The look properties each block type supports. */
export const styleFields: Record<BlockType, FieldSchema[]> = {
  heading: textFields,
  text: textFields,
  stat: surfaceFields,
  card: surfaceFields,
  chart: surfaceFields,
  list: surfaceFields,
  actions: surfaceFields,
}

const surface = (variant: ComponentStyle['variant'], elevation = 0, border = false): ComponentStyle => ({
  variant,
  elevation,
  border,
  rounded: 'lg',
})

/** Built-in look of each block type, before any changes in the component library. */
export const builtInStyles: Record<BlockType, ComponentStyle> = {
  heading: { align: 'start', textColor: null },
  text: { align: 'start', textColor: null },
  stat: surface('flat', 0, true),
  card: surface('elevated', 2),
  chart: surface('flat', 0, true),
  list: surface('flat', 0, true),
  actions: surface('tonal'),
}

/** Example content for previewing components in the library. */
export const sampleBlocks: Record<BlockType, Block> = {
  heading: { id: 'sample', type: 'heading', width: 'full', text: 'Ward overview', size: 'medium' },
  text: {
    id: 'sample',
    type: 'text',
    width: 'full',
    text: 'Check every baby before 9am and record vitals before the handover meeting.',
  },
  stat: {
    id: 'sample', type: 'stat', width: 'quarter', label: 'Admissions', value: '1,204', caption: '+12% this week', icon: 'mdi-account-plus', color: 'primary',
  },
  card: {
    id: 'sample', type: 'card', width: 'half', title: 'Daily rounds', body: 'Review every baby on the ward and update their notes.', icon: 'mdi-clipboard-text', color: 'primary', buttonLabel: 'Open', buttonPage: '',
  },
  chart: {
    id: 'sample',
    type: 'chart',
    width: 'half',
    title: 'Admissions per day',
    chartType: 'bar',
    color: 'primary',
    points: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((label, i) => ({ id: label, label, value: [12, 18, 9, 15, 21][i]! })),
  },
  list: {
    id: 'sample',
    type: 'list',
    width: 'half',
    title: 'Recent admissions',
    items: [
      { id: '1', title: 'Baby Banda', subtitle: 'Admitted 08:15', icon: 'mdi-baby-face-outline' },
      { id: '2', title: 'Baby Phiri', subtitle: 'Admitted 10:40', icon: 'mdi-baby-face-outline' },
    ],
  },
  actions: { id: 'sample', type: 'actions', width: 'full', title: '', layout: 'grid' },
}

export const sampleActions: LandingAction[] = [
  { id: '1', label: 'Register', icon: 'mdi-account-plus', color: 'primary', type: 'navigate', target: '' },
  { id: '2', label: 'Patients', icon: 'mdi-account-group', color: 'success', type: 'navigate', target: '' },
  { id: '3', label: 'Reports', icon: 'mdi-chart-bar', color: 'warning', type: 'navigate', target: '' },
]
