<script setup lang="ts">
import type { ColorField } from '~/types/form'
import { colorOptions } from '~/configs/icons'

const props = defineProps<{ field: ColorField }>()
const value = defineModel<string>()
const rules = computed(() => buildRules(props.field))
const options = computed(() => props.field.options ?? colorOptions)
</script>

<template>
  <v-select
    v-model="value"
    :items="options"
    :label="fieldLabel(field)"
    :hint="field.hint"
    :rules="rules"
  >
    <template #prepend-inner>
      <v-avatar v-if="value" :color="value" size="20" />
    </template>
    <template #item="{ props: itemProps, internalItem }">
      <v-list-item v-bind="itemProps">
        <template #prepend>
          <v-avatar :color="String(internalItem.value)" size="20" class="mr-4" />
        </template>
      </v-list-item>
    </template>
  </v-select>
</template>
