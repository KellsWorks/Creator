<script setup lang="ts">
import type { SwitchField } from '~/types/form'

const props = defineProps<{ field: SwitchField }>()
const value = defineModel<boolean>()
const rules = computed(() => buildRules(props.field))
</script>

<template>
  <v-switch
    v-model="value"
    :label="fieldLabel(field)"
    :hint="field.hint"
    :persistent-hint="!!field.hint"
    :rules="rules"
    color="primary"
    inset
  />
</template>
