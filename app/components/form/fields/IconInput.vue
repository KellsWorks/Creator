<script setup lang="ts">
import type { IconField } from '~/types/form'
import { iconOptions } from '~/configs/icons'

const props = defineProps<{ field: IconField }>()
const value = defineModel<string>()
const rules = computed(() => buildRules(props.field))
const options = computed(() => props.field.options ?? iconOptions)
</script>

<template>
  <v-autocomplete
    v-model="value"
    :items="options"
    :label="fieldLabel(field)"
    :hint="field.hint"
    :prepend-inner-icon="value"
    :rules="rules"
  >
    <template #item="{ props: itemProps, internalItem }">
      <v-list-item v-bind="itemProps" :prepend-icon="String(internalItem.value)" />
    </template>
  </v-autocomplete>
</template>
