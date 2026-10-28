<script setup lang="ts">
import type { ModuleConfig } from '~/types/module'
import { createModule, moduleFormSchema } from '~/configs/module'

const props = defineProps<{ module?: ModuleConfig | null }>()
const emit = defineEmits<{ save: [module: ModuleConfig] }>()
const open = defineModel<boolean>({ default: false })

const draft = ref<ModuleConfig>(createModule())
const form = ref<{ validate: () => Promise<{ valid: boolean }> }>()
const isEditing = computed(() => !!props.module)

watch(open, (isOpen) => {
  if (isOpen) draft.value = props.module ? clone(props.module) : createModule()
})

async function save() {
  const { valid } = await form.value!.validate()
  if (!valid) return
  emit('save', clone(draft.value))
  open.value = false
}
</script>

<template>
  <v-dialog v-model="open" fullscreen transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar color="primary" class="flex-grow-0">
        <v-btn icon="mdi-close" aria-label="Close" @click="open = false" />
        <v-toolbar-title>{{ isEditing ? 'Edit module' : 'Create module' }}</v-toolbar-title>
        <template #append>
          <v-btn variant="text" prepend-icon="mdi-content-save" @click="save">Save</v-btn>
        </template>
      </v-toolbar>

      <v-card-text class="pa-0">
        <v-container class="py-6">
          <v-row>
            <v-col cols="12" md="7" lg="8">
              <FormDynamicForm ref="form" v-model="draft" :schema="moduleFormSchema" />
            </v-col>
            <v-col cols="12" md="5" lg="4">
              <div class="preview">
                <div class="text-overline text-medium-emphasis">Preview</div>
                <ModulePreview :module="draft" />
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.preview {
  position: sticky;
  top: 0;
}
</style>
