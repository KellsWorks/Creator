<script setup lang="ts">
import type { SelectField, SelectOption } from '~/types/form'

const props = defineProps<{ field: SelectField }>()
const value = defineModel<string>()
const root = inject(formRootKey, ref({}))

const options = computed(() =>
  typeof props.field.options === 'function' ? props.field.options(root.value) : props.field.options,
)
const selected = computed(() => options.value.find(o => o.value === value.value))
const rules = computed(() => [
  ...buildRules(props.field),
  // Options can disappear, e.g. when the page an action opens is deleted.
  (v: string) => !v || !!selected.value || 'That option no longer exists. Choose another.',
])
</script>

<template>
  <v-select
    v-model="value"
    :items="options"
    :label="fieldLabel(field)"
    :hint="field.hint"
    :no-data-text="field.emptyText"
    :clearable="field.clearable"
    :prepend-inner-icon="selected?.icon"
    :rules="rules"
  >
    <template #item="{ props: itemProps, internalItem }">
      <v-list-item v-bind="itemProps" :prepend-icon="(internalItem.raw as SelectOption).icon" />
    </template>
  </v-select>
</template>
