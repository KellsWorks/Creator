<script setup lang="ts">
import type { FieldSchema, FormModel } from '~/types/form'

const props = defineProps<{ fields: FieldSchema[] }>()
const model = defineModel<FormModel>({ required: true })

const visibleFields = computed(() =>
  props.fields.filter(field => !field.visible || field.visible(model.value)),
)

function update(key: string, value: unknown) {
  model.value = { ...model.value, [key]: value }
}
</script>

<template>
  <v-row dense>
    <v-col
      v-for="field in visibleFields"
      :key="`${field.key}:${field.label}`"
      cols="12"
      :md="field.cols ?? 12"
    >
      <FormField
        :field="field"
        :model-value="model[field.key]"
        @update:model-value="update(field.key, $event)"
      />
    </v-col>
  </v-row>
</template>
