<script setup lang="ts">
import type { TextareaField } from '~/types/form'

const props = defineProps<{ field: TextareaField }>()
const value = defineModel<string>()
const rules = computed(() => buildRules(props.field))
</script>

<template>
  <v-textarea
    v-model="value"
    :label="fieldLabel(field)"
    :hint="field.hint"
    :placeholder="field.placeholder"
    :rows="field.rows ?? 3"
    :counter="field.maxLength"
    :rules="rules"
    auto-grow
  />
</template>
