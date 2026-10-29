import type { InjectionKey, Ref } from 'vue'
import type { FieldSchema, FormModel, ValidationRule } from '~/types/form'

const isEmpty = (value: unknown) =>
  value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)

export const validators = {
  required: (message: string): ValidationRule => value => !isEmpty(value) || message,
  maxLength: (max: number): ValidationRule => value =>
    isEmpty(value) || String(value).length <= max || `Must be ${max} characters or fewer`,
  url: ((value: string) =>
    isEmpty(value) || /^https?:\/\/\S+\.\S+$/.test(value) || 'Enter a full URL starting with http:// or https://') as ValidationRule,
  route: ((value: string) =>
    isEmpty(value) || /^\/[\w\-/]*$/.test(value) || 'Routes start with / and use letters, numbers, - or _') as ValidationRule,
}

export function buildRules(field: FieldSchema): ValidationRule[] {
  const rules: ValidationRule[] = []

  if (field.required) {
    rules.push(validators.required(
      field.type === 'list'
        ? `Add at least one ${field.itemLabel.toLowerCase()}`
        : `${field.label} is required`,
    ))
  }
  if ((field.type === 'text' || field.type === 'textarea') && field.maxLength) {
    rules.push(validators.maxLength(field.maxLength))
  }
  if (field.type === 'number') {
    const { min, max } = field
    if (min !== undefined) rules.push(value => isEmpty(value) || value >= min || `Must be ${min} or more`)
    if (max !== undefined) rules.push(value => isEmpty(value) || value <= max || `Must be ${max} or less`)
  }

  return [...rules, ...(field.rules ?? [])]
}

/** The whole form's value, for fields whose options depend on other parts of the form. */
export const formRootKey: InjectionKey<Ref<FormModel>> = Symbol('form-root')

export const fieldLabel = (field: FieldSchema) => (field.required ? `${field.label} *` : field.label)

export const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value))

export const uid = () => crypto.randomUUID()
