<script setup lang="ts">
import type { ModuleConfig } from '~/types/module'
import { LANDING_PAGE_ID } from '~/configs/blocks'
import { modulePages } from '~/configs/module'

const props = defineProps<{ module: ModuleConfig }>()

const pages = computed(() => modulePages(props.module))
const pageId = ref(LANDING_PAGE_ID)
const page = computed(() => pages.value.find(p => p.id === pageId.value) ?? pages.value[0]!)
</script>

<template>
  <div>
    <v-chip-group v-if="pages.length > 1" v-model="pageId" mandatory selected-class="text-primary" class="mb-2">
      <v-chip
        v-for="(p, index) in pages"
        :key="p.id"
        :value="p.id"
        :prepend-icon="p.id === LANDING_PAGE_ID ? 'mdi-home' : undefined"
        size="small"
        variant="outlined"
      >
        {{ p.title || (p.id === LANDING_PAGE_ID ? 'Landing page' : `Page ${index}`) }}
      </v-chip>
    </v-chip-group>

    <v-card variant="outlined" class="overflow-hidden">
      <v-toolbar :color="module.color" density="compact">
        <v-btn
          v-if="page.id !== LANDING_PAGE_ID"
          icon="mdi-arrow-left"
          aria-label="Back to landing page"
          @click="pageId = LANDING_PAGE_ID"
        />
        <v-icon v-else :icon="module.icon || 'mdi-puzzle'" class="ml-4" />
        <v-toolbar-title>{{ module.name || 'Untitled module' }}</v-toolbar-title>
      </v-toolbar>

      <v-card-text class="pa-5 preview-body">
        <ModulePage :page="page" :actions="module.actions" narrow @navigate="pageId = $event" />
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
.preview-body {
  max-height: calc(100vh - 220px);
  overflow-y: auto;
}
</style>
