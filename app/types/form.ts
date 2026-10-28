export type FormModel = Record<string, any>

export type ValidationRule = (value: any) => true | string

export type SelectOption = {
  title: string
  value: string
  icon?: string
}

type BaseField = {
  key: string
  label: string
  hint?: string
  required?: boolean
  /** Column width on medium screens and up, out of 12. */
  cols?: number
  rules?: ValidationRule[]
  /** Hide the field unless this returns true for the current model. */
  visible?: (model: FormModel) => boolean
}

export type TextField = BaseField & {
  type: 'text'
  placeholder?: string
  maxLength?: number
}

export type TextareaField = BaseField & {
  type: 'textarea'
  placeholder?: string
  rows?: number
  maxLength?: number
}

export type SelectField = BaseField & {
  type: 'select'
  options: SelectOption[]
}

export type IconField = BaseField & {
  type: 'icon'
  options?: SelectOption[]
}

export type ColorField = BaseField & {
  type: 'color'
  options?: SelectOption[]
}

export type SwitchField = BaseField & {
  type: 'switch'
}

export type ListField = BaseField & {
  type: 'list'
  /** Singular name for one entry, e.g. "Action". */
  itemLabel: string
  fields: FieldSchema[]
  newItem: () => FormModel
  itemTitle?: (item: FormModel, index: number) => string
  maxItems?: number
}

export type FieldSchema =
  | TextField
  | TextareaField
  | SelectField
  | IconField
  | ColorField
  | SwitchField
  | ListField

export type FieldType = FieldSchema['type']

export type FormSection = {
  title: string
  description?: string
  /** Bind the section's fields to `model[key]` instead of the model itself. */
  key?: string
  fields: FieldSchema[]
}

export type FormSchema = FormSection[]
