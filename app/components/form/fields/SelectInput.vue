<script setup lang="ts">
import type { SelectField, SelectOption } from '~/types/form'

const props = defineProps<{ field: SelectField }>()
const value = defineModel<string>()
const rules = computed(() => buildRules(props.field))
const selected = computed(() => props.field.options.find(o => o.value === value.value))
</script>

<template>
  <v-select
    v-model="value"
    :items="field.options"
    :label="fieldLabel(field)"
    :hint="field.hint"
    :prepend-inner-icon="selected?.icon"
    :rules="rules"
  >
    <template #item="{ props: itemProps, internalItem }">
      <v-list-item v-bind="itemProps" :prepend-icon="(internalItem.raw as SelectOption).icon" />
    </template>
  </v-select>
</template>
