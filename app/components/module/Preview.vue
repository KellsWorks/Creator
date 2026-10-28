<script setup lang="ts">
import type { ModuleConfig } from '~/types/module'

const props = defineProps<{ module: ModuleConfig }>()
const landing = computed(() => props.module.landingPage)
</script>

<template>
  <v-card variant="outlined" class="overflow-hidden">
    <v-toolbar :color="module.color" density="compact">
      <v-icon :icon="module.icon || 'mdi-puzzle'" class="ml-4" />
      <v-toolbar-title>{{ module.name || 'Untitled module' }}</v-toolbar-title>
    </v-toolbar>

    <v-card-text class="pa-5">
      <h3 class="text-h6">{{ landing.title || 'Landing page title' }}</h3>
      <p v-if="landing.subtitle" class="text-body-2 text-medium-emphasis mt-1">
        {{ landing.subtitle }}
      </p>

      <p v-if="!module.actions.length" class="text-body-2 text-medium-emphasis mt-6">
        Landing actions will appear here.
      </p>

      <v-row v-else-if="landing.layout === 'grid'" dense class="mt-4">
        <v-col v-for="action in module.actions" :key="action.id" cols="6">
          <v-card :color="action.color" variant="tonal" class="pa-4 text-center h-100">
            <v-icon :icon="action.icon" size="32" />
            <div class="text-body-2 font-weight-medium mt-2">{{ action.label || 'Untitled action' }}</div>
          </v-card>
        </v-col>
      </v-row>

      <v-list v-else class="mt-2 pa-0">
        <v-list-item
          v-for="action in module.actions"
          :key="action.id"
          :title="action.label || 'Untitled action'"
          :subtitle="action.target"
          append-icon="mdi-chevron-right"
        >
          <template #prepend>
            <v-avatar :color="action.color" variant="tonal">
              <v-icon :icon="action.icon" />
            </v-avatar>
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>
