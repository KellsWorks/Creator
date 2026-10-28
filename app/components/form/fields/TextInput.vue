<script setup lang="ts">
import type { TextField } from '~/types/form'

const props = defineProps<{ field: TextField }>()
const value = defineModel<string>()
const rules = computed(() => buildRules(props.field))
</script>

<template>
  <v-text-field
    v-model="value"
    :label="fieldLabel(field)"
    :hint="field.hint"
    :placeholder="field.placeholder"
    :counter="field.maxLength"
    :rules="rules"
  />
</template>
