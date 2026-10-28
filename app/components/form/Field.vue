<script setup lang="ts">
import type { Component } from 'vue'
import type { FieldSchema, FieldType } from '~/types/form'
import TextInput from './fields/TextInput.vue'
import TextareaInput from './fields/TextareaInput.vue'
import SelectInput from './fields/SelectInput.vue'
import IconInput from './fields/IconInput.vue'
import ColorInput from './fields/ColorInput.vue'
import SwitchInput from './fields/SwitchInput.vue'

// Add new field types here and in `FieldSchema`.
const components: Record<FieldType, Component> = {
  text: TextInput,
  textarea: TextareaInput,
  select: SelectInput,
  icon: IconInput,
  color: ColorInput,
  switch: SwitchInput,
  // Async because a list renders field groups, which render fields.
  list: defineAsyncComponent(() => import('./fields/ListInput.vue')),
}

defineProps<{ field: FieldSchema }>()
const value = defineModel<unknown>()
</script>

<template>
  <component :is="components[field.type]" v-model="value" :field="field" />
</template>
