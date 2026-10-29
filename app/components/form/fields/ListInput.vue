<script setup lang="ts">
import type { FormModel, ListField, ListTemplate, ListVariant } from '~/types/form'

const props = defineProps<{ field: ListField }>()
const items = defineModel<FormModel[]>({ default: () => [] })
const rules = computed(() => buildRules(props.field))
const canAdd = computed(() => !props.field.maxItems || items.value.length < props.field.maxItems)
const noun = computed(() => props.field.itemLabel.toLowerCase())

// Items start collapsed so long lists stay scannable; new items open.
const expanded = ref(new Set<unknown>())
const keyOf = (item: FormModel, index: number) => item.id ?? index
const isExpanded = (item: FormModel, index: number) => expanded.value.has(keyOf(item, index))

function setExpanded(item: FormModel, index: number, open: boolean) {
  const next = new Set(expanded.value)
  if (open) next.add(keyOf(item, index))
  else next.delete(keyOf(item, index))
  expanded.value = next
}

const variantOf = (item: FormModel): ListVariant | undefined =>
  props.field.variants?.[item[props.field.variantKey ?? 'type']]

/** "Add" menu entries grouped under their headings, in first-seen order. */
const templateGroups = computed(() => {
  const templates: ListTemplate[] = props.field.templates
    ?? Object.values(props.field.variants ?? {}).map(v => ({ label: v.label, icon: v.icon, newItem: v.newItem }))
  const groups = new Map<string, ListTemplate[]>()
  for (const template of templates) {
    const group = template.group ?? ''
    groups.set(group, [...(groups.get(group) ?? []), template])
  }
  return [...groups]
})

const fieldsOf = (item: FormModel) => variantOf(item)?.fields ?? props.field.fields ?? []

function titleOf(item: FormModel, index: number) {
  return props.field.itemTitle?.(item, index)
    || variantOf(item)?.label
    || `${props.field.itemLabel} ${index + 1}`
}

function subtitleOf(item: FormModel, index: number) {
  const label = variantOf(item)?.label
  return label && label !== titleOf(item, index) ? label : undefined
}

function add(newItem: () => FormModel) {
  const item = newItem()
  items.value = [...items.value, item]
  setExpanded(item, items.value.length - 1, true)
}

function update(index: number, item: FormModel) {
  items.value = items.value.map((current, i) => (i === index ? item : current))
}

function remove(index: number) {
  items.value = items.value.filter((_, i) => i !== index)
}

function move(index: number, offset: number) {
  const next = [...items.value]
  const [item] = next.splice(index, 1)
  next.splice(index + offset, 0, item!)
  items.value = next
}
</script>

<template>
  <v-input :model-value="items" :rules="rules" hide-details="auto">
    <div class="w-100">
      <div class="text-title-small mb-2">{{ fieldLabel(field) }}</div>

      <p v-if="!items.length" class="text-body-medium text-medium-emphasis mb-4">
        No {{ noun }}s yet.
      </p>

      <v-card
        v-for="(item, index) in items"
        :key="keyOf(item, index)"
        variant="outlined"
        class="mb-3"
        @reveal-field="setExpanded(item, index, true)"
      >
        <v-card-item class="list-item-header" @click="setExpanded(item, index, !isExpanded(item, index))">
          <template #prepend>
            <v-icon :icon="isExpanded(item, index) ? 'mdi-chevron-down' : 'mdi-chevron-right'" />
            <v-icon v-if="variantOf(item)?.icon" :icon="variantOf(item)!.icon" class="ml-2" color="primary" />
          </template>
          <v-card-title class="text-title-medium">{{ titleOf(item, index) }}</v-card-title>
          <v-card-subtitle v-if="subtitleOf(item, index)">{{ subtitleOf(item, index) }}</v-card-subtitle>
          <template #append>
            <v-btn
              icon="mdi-arrow-up"
              variant="text"
              size="small"
              :disabled="index === 0"
              :aria-label="`Move ${noun} up`"
              @click.stop="move(index, -1)"
            />
            <v-btn
              icon="mdi-arrow-down"
              variant="text"
              size="small"
              :disabled="index === items.length - 1"
              :aria-label="`Move ${noun} down`"
              @click.stop="move(index, 1)"
            />
            <v-btn
              icon="mdi-delete-outline"
              variant="text"
              size="small"
              color="error"
              :aria-label="`Remove ${noun}`"
              @click.stop="remove(index)"
            />
          </template>
        </v-card-item>
        <v-expand-transition>
          <!-- v-show, not v-if: collapsed fields must stay mounted so the form still validates them. -->
          <v-card-text v-show="isExpanded(item, index)">
            <FormFieldGroup
              :fields="fieldsOf(item)"
              :model-value="item"
              @update:model-value="update(index, $event)"
            />
          </v-card-text>
        </v-expand-transition>
      </v-card>

      <template v-if="canAdd">
        <v-menu v-if="templateGroups.length">
          <template #activator="{ props: menuProps }">
            <v-btn v-bind="menuProps" variant="tonal" color="primary" prepend-icon="mdi-plus" block>
              Add {{ noun }}
            </v-btn>
          </template>
          <v-list density="compact">
            <template v-for="[group, templates] in templateGroups" :key="group">
              <v-list-subheader v-if="group">{{ group }}</v-list-subheader>
              <v-list-item
                v-for="template in templates"
                :key="template.label"
                :prepend-icon="template.icon"
                :title="template.label"
                @click="add(template.newItem)"
              />
            </template>
          </v-list>
        </v-menu>
        <v-btn
          v-else-if="field.newItem"
          variant="tonal"
          color="primary"
          prepend-icon="mdi-plus"
          block
          @click="add(field.newItem)"
        >
          Add {{ noun }}
        </v-btn>
      </template>
    </div>
  </v-input>
</template>

<style scoped>
.list-item-header {
  cursor: pointer;
}
</style>
