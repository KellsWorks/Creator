<script setup lang="ts">
import type { NumberField } from '~/types/form'

const props = defineProps<{ field: NumberField }>()
const value = defineModel<number>()
const rules = computed(() => buildRules(props.field))

const text = computed({
  get: () => (value.value ?? '').toString(),
  set: (input: string) => {
    value.value = input === '' ? undefined : Number(input)
  },
})
</script>

<template>
  <v-text-field
    v-model="text"
    type="number"
    :label="fieldLabel(field)"
    :hint="field.hint"
    :placeholder="field.placeholder"
    :min="field.min"
    :max="field.max"
    :rules="rules"
  />
</template>
