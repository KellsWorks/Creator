<script setup lang="ts">
import type { FormModel, FormSection } from '~/types/form'

defineProps<{ section: FormSection }>()
const model = defineModel<FormModel>({ required: true })
</script>

<template>
  <section>
    <h2 class="text-title-large">{{ section.title }}</h2>
    <p v-if="section.description" class="text-body-medium text-medium-emphasis mb-4">
      {{ section.description }}
    </p>
    <FormFieldGroup v-model="model" :fields="section.fields" />
  </section>
</template>
