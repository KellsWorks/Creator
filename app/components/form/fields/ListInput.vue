<script setup lang="ts">
import type { FormModel, ListField } from '~/types/form'

const props = defineProps<{ field: ListField }>()
const items = defineModel<FormModel[]>({ default: () => [] })
const rules = computed(() => buildRules(props.field))
const canAdd = computed(() => !props.field.maxItems || items.value.length < props.field.maxItems)

function add() {
  items.value = [...items.value, props.field.newItem()]
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
      <p v-if="!items.length" class="text-body-2 text-medium-emphasis mb-4">
        No {{ field.itemLabel.toLowerCase() }}s yet.
      </p>

      <v-card
        v-for="(item, index) in items"
        :key="item.id ?? index"
        variant="outlined"
        class="mb-4"
      >
        <v-card-item>
          <v-card-title class="text-subtitle-1">
            {{ field.itemTitle?.(item, index) ?? `${field.itemLabel} ${index + 1}` }}
          </v-card-title>
          <template #append>
            <v-btn
              icon="mdi-arrow-up"
              variant="text"
              size="small"
              :disabled="index === 0"
              :aria-label="`Move ${field.itemLabel.toLowerCase()} up`"
              @click="move(index, -1)"
            />
            <v-btn
              icon="mdi-arrow-down"
              variant="text"
              size="small"
              :disabled="index === items.length - 1"
              :aria-label="`Move ${field.itemLabel.toLowerCase()} down`"
              @click="move(index, 1)"
            />
            <v-btn
              icon="mdi-delete-outline"
              variant="text"
              size="small"
              color="error"
              :aria-label="`Remove ${field.itemLabel.toLowerCase()}`"
              @click="remove(index)"
            />
          </template>
        </v-card-item>
        <v-card-text>
          <FormFieldGroup
            :fields="field.fields"
            :model-value="item"
            @update:model-value="update(index, $event)"
          />
        </v-card-text>
      </v-card>

      <v-btn
        v-if="canAdd"
        variant="tonal"
        color="primary"
        prepend-icon="mdi-plus"
        block
        @click="add"
      >
        Add {{ field.itemLabel.toLowerCase() }}
      </v-btn>
    </div>
  </v-input>
</template>
