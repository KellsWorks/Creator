<script setup lang="ts" generic="T extends FormModel">
import type { VForm } from 'vuetify/components'
import type { FormModel, FormSchema, FormSection } from '~/types/form'

defineProps<{ schema: FormSchema }>()
const model = defineModel<T>({ required: true })
const form = ref<VForm>()

const sectionModel = (section: FormSection): FormModel =>
  section.key ? model.value[section.key] ?? {} : model.value

function updateSection(section: FormSection, value: FormModel) {
  model.value = (section.key ? { ...model.value, [section.key]: value } : value) as T
}

defineExpose({
  validate: () => form.value!.validate(),
  resetValidation: () => form.value!.resetValidation(),
})
</script>

<template>
  <v-form ref="form" @submit.prevent>
    <section v-for="section in schema" :key="section.title" class="mb-8">
      <h2 class="text-h6">{{ section.title }}</h2>
      <p v-if="section.description" class="text-body-2 text-medium-emphasis mb-4">
        {{ section.description }}
      </p>
      <FormFieldGroup
        :fields="section.fields"
        :model-value="sectionModel(section)"
        @update:model-value="updateSection(section, $event)"
      />
    </section>
  </v-form>
</template>
