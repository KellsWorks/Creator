<script setup lang="ts" generic="T extends FormModel">
import type { VForm } from 'vuetify/components'
import type { FormModel, FormSchema, FormSection } from '~/types/form'

const props = defineProps<{
  schema: FormSchema
  /** Show each section on its own tab instead of one long page. */
  tabs?: boolean
}>()
const model = defineModel<T>({ required: true })
const form = ref<VForm>()
const tab = ref(0)

provide(formRootKey, model)

const sectionModel = (section: FormSection): FormModel =>
  section.key ? model.value[section.key] ?? {} : model.value

function updateSection(section: FormSection, value: FormModel) {
  model.value = (section.key ? { ...model.value, [section.key]: value } : value) as T
}

/** Validate, then bring the first invalid field into view: its tab and any collapsed list item. */
async function validate() {
  const result = await form.value!.validate()
  const id = result.errors[0]?.id
  if (result.valid || id === undefined) return result

  const field = document.getElementById(String(id)) ?? document.getElementById(`${id}-messages`)
  const section = field?.closest<HTMLElement>('[data-section]')?.dataset.section
  if (props.tabs && section) tab.value = Number(section)
  field?.dispatchEvent(new CustomEvent('reveal-field', { bubbles: true }))

  await nextTick()
  setTimeout(() => field?.scrollIntoView({ block: 'center', behavior: 'smooth' }), 300)
  return result
}

defineExpose({
  validate,
  resetValidation: () => form.value!.resetValidation(),
})
</script>

<template>
  <v-form ref="form" @submit.prevent>
    <template v-if="tabs">
      <v-tabs v-model="tab" color="primary" show-arrows class="mb-6">
        <v-tab v-for="(section, index) in schema" :key="section.title" :value="index" :prepend-icon="section.icon">
          {{ section.title }}
        </v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab">
        <!-- Eager so fields on other tabs are mounted and still validated. -->
        <v-tabs-window-item
          v-for="(section, index) in schema"
          :key="section.title"
          :value="index"
          :data-section="index"
          eager
        >
          <FormSchemaSection
            :section="section"
            :model-value="sectionModel(section)"
            @update:model-value="updateSection(section, $event)"
          />
        </v-tabs-window-item>
      </v-tabs-window>
    </template>

    <template v-else>
      <FormSchemaSection
        v-for="(section, index) in schema"
        :key="section.title"
        :section="section"
        :data-section="index"
        :model-value="sectionModel(section)"
        class="mb-8"
        @update:model-value="updateSection(section, $event)"
      />
    </template>
  </v-form>
</template>
