<script setup lang="ts">
import type { ComponentStyle, CustomComponent } from '~/types/component'
import type { FieldSchema, FormModel, FormSchema } from '~/types/form'
import type { Block, BlockType, BlockWidth } from '~/types/module'
import { blockVariants } from '~/configs/blocks'
import { sampleActions, sampleBlocks, styleFields } from '~/configs/components'

type Selection = { kind: 'base'; type: BlockType } | { kind: 'custom'; id: string }
type Draft = { name: string; icon: string; style: ComponentStyle; content: FormModel }

const { library, baseStyle, saveBaseStyle, resetBaseStyle, saveCustom, removeCustom } = useComponentLibrary()

const blockTypes = Object.keys(blockVariants) as BlockType[]
const selection = ref<Selection>({ kind: 'base', type: 'card' })
/** A new custom component that hasn't been saved yet. */
const pending = ref<CustomComponent | null>(null)
const draft = ref<Draft>({ name: '', icon: '', style: {}, content: {} })
const form = ref<{ validate: () => Promise<{ valid: boolean }> }>()
const confirmDelete = ref(false)
const saved = ref(false)

const current = computed(() => {
  const sel = selection.value
  if (sel.kind === 'base') return undefined
  return library.value.custom.find(c => c.id === sel.id) ?? (pending.value?.id === sel.id ? pending.value : undefined)
})
const type = computed<BlockType>(() =>
  selection.value.kind === 'base' ? selection.value.type : current.value?.base ?? 'card',
)
const isNew = computed(() => !!pending.value && pending.value.id === current.value?.id)

const keyOf = (sel: Selection) => (sel.kind === 'base' ? `base:${sel.type}` : `custom:${sel.id}`)
const isSelected = (sel: Selection) => keyOf(sel) === keyOf(selection.value)

// Starting content is optional: blocks can always be filled in later.
const optional = (fields: FieldSchema[]): FieldSchema[] =>
  fields.map(field => ({ ...field, required: false, rules: undefined }))

const schema = computed<FormSchema>(() => {
  const look: FormSchema[number] = {
    title: 'Look',
    key: 'style',
    description: selection.value.kind === 'base'
      ? `Applies to every ${blockVariants[type.value].label.toLowerCase()} block that doesn't use one of your components.`
      : 'How blocks made from this component look.',
    fields: styleFields[type.value],
  }
  if (selection.value.kind === 'base') return [look]
  return [
    {
      title: 'Details',
      description: 'How the component is listed in the "Add block" menu.',
      fields: [
        { type: 'text', key: 'name', label: 'Name', required: true, maxLength: 40, cols: 8 },
        { type: 'icon', key: 'icon', label: 'Icon', required: true, cols: 4 },
      ],
    },
    look,
    {
      title: 'Starting content',
      key: 'content',
      description: 'New blocks made from this component start with this content.',
      fields: optional(blockVariants[type.value].fields),
    },
  ]
})

const isFilled = (value: unknown) =>
  value !== '' && value !== null && value !== undefined && !(Array.isArray(value) && !value.length)

/** Sample content, overlaid with whatever starting content the component has. */
const previewBlock = computed(() => {
  const content = Object.fromEntries(Object.entries(draft.value.content).filter(([, v]) => isFilled(v)))
  return { ...sampleBlocks[type.value], ...content, id: 'preview', type: type.value } as Block
})

const previewWidth: Record<BlockWidth, string> = {
  quarter: '320px',
  third: '420px',
  half: '600px',
  full: '100%',
}

function resetDraft() {
  if (selection.value.kind === 'base') {
    draft.value = { name: '', icon: '', style: clone(baseStyle(type.value)), content: {} }
  } else if (current.value) {
    const { name, icon, style, content } = clone(current.value)
    draft.value = { name, icon, style, content }
  }
}

function select(sel: Selection) {
  if (!(sel.kind === 'custom' && sel.id === pending.value?.id)) pending.value = null
  selection.value = sel
  resetDraft()
}

function createCustom(base: BlockType) {
  const { id: _id, type: _type, ...content } = blockVariants[base].newItem()
  pending.value = { id: uid(), name: '', icon: blockVariants[base].icon ?? 'mdi-puzzle', base, style: clone(baseStyle(base)), content }
  select({ kind: 'custom', id: pending.value.id })
}

async function save() {
  const { valid } = await form.value!.validate()
  if (!valid) return
  if (selection.value.kind === 'base') {
    saveBaseStyle(type.value, clone(draft.value.style))
  } else if (current.value) {
    saveCustom({ ...current.value, ...clone(draft.value) })
    pending.value = null
  }
  saved.value = true
}

function reset() {
  resetBaseStyle(type.value)
  resetDraft()
}

function remove() {
  if (current.value) removeCustom(current.value.id)
  confirmDelete.value = false
  select({ kind: 'base', type: type.value })
}

// The library loads after mount; refresh the draft once it arrives.
watch(library, resetDraft, { immediate: true })
</script>

<template>
  <v-container fluid class="px-md-8">
    <v-row>
      <v-col cols="12" md="3">
        <v-card border flat>
          <v-list nav color="primary">
            <v-list-subheader>Built-in</v-list-subheader>
            <v-list-item
              v-for="blockType in blockTypes"
              :key="blockType"
              :active="isSelected({ kind: 'base', type: blockType })"
              :prepend-icon="blockVariants[blockType].icon"
              :title="blockVariants[blockType].label"
              :subtitle="library.base[blockType] ? 'Customized' : undefined"
              @click="select({ kind: 'base', type: blockType })"
            />

            <v-list-subheader>Your components</v-list-subheader>
            <v-list-item
              v-for="component in [...library.custom, ...(pending ? [pending] : [])]"
              :key="component.id"
              :active="isSelected({ kind: 'custom', id: component.id })"
              :prepend-icon="component.icon"
              :title="component.name || 'New component'"
              :subtitle="blockVariants[component.base].label"
              @click="select({ kind: 'custom', id: component.id })"
            />
            <p v-if="!library.custom.length && !pending" class="text-body-small text-medium-emphasis px-4 pb-2">
              Make your own variations of the built-in components.
            </p>
          </v-list>

          <v-card-actions>
            <v-menu>
              <template #activator="{ props: menuProps }">
                <v-btn v-bind="menuProps" variant="tonal" color="primary" prepend-icon="mdi-plus" block>
                  New component
                </v-btn>
              </template>
              <v-list density="compact">
                <v-list-subheader>Based on</v-list-subheader>
                <v-list-item
                  v-for="blockType in blockTypes"
                  :key="blockType"
                  :prepend-icon="blockVariants[blockType].icon"
                  :title="blockVariants[blockType].label"
                  @click="createCustom(blockType)"
                />
              </v-list>
            </v-menu>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="9">
        <div class="d-flex align-center flex-wrap ga-2 mb-6">
          <div>
            <h1 class="text-headline-small">
              {{ selection.kind === 'base' ? blockVariants[type].label : draft.name || 'New component' }}
            </h1>
            <p class="text-body-medium text-medium-emphasis">
              {{ selection.kind === 'base' ? 'Built-in component' : `Based on ${blockVariants[type].label}` }}
            </p>
          </div>
          <v-spacer />
          <v-btn
            v-if="selection.kind === 'base' && library.base[type]"
            variant="text"
            prepend-icon="mdi-restore"
            @click="reset"
          >
            Reset to built-in
          </v-btn>
          <v-btn
            v-if="selection.kind === 'custom' && !isNew"
            variant="text"
            color="error"
            prepend-icon="mdi-delete-outline"
            @click="confirmDelete = true"
          >
            Delete
          </v-btn>
          <v-btn color="primary" prepend-icon="mdi-content-save" @click="save">Save</v-btn>
        </div>

        <v-row>
          <v-col cols="12" lg="5">
            <FormDynamicForm :key="keyOf(selection)" ref="form" v-model="draft" :schema="schema" />
          </v-col>
          <v-col cols="12" lg="7">
            <div class="preview">
              <div class="text-label-large text-uppercase text-medium-emphasis mb-2">Preview</div>
              <v-sheet border rounded="lg" class="pa-6">
                <div :style="{ maxWidth: previewWidth[previewBlock.width] }">
                  <BlockRenderer :block="previewBlock" :actions="sampleActions" :component-style="draft.style" />
                </div>
              </v-sheet>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-dialog v-model="confirmDelete" max-width="420">
      <v-card :title="`Delete ${draft.name || 'this component'}?`">
        <v-card-text>
          Blocks that use it will go back to the built-in {{ blockVariants[type].label.toLowerCase() }} look.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="confirmDelete = false">Cancel</v-btn>
          <v-btn color="error" @click="remove">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="saved" timeout="2000">Saved</v-snackbar>
  </v-container>
</template>

<style scoped>
.preview {
  position: sticky;
  top: 80px;
}
</style>
