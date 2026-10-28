<script setup lang="ts">
import type { ModuleConfig } from '~/types/module'

defineProps<{ module: ModuleConfig }>()
defineEmits<{ edit: []; remove: [] }>()
</script>

<template>
  <v-card class="h-100" @click="$emit('edit')">
    <v-card-item>
      <template #prepend>
        <v-avatar :color="module.color" variant="tonal" size="48">
          <v-icon :icon="module.icon" />
        </v-avatar>
      </template>
      <v-card-title>{{ module.name }}</v-card-title>
      <v-card-subtitle>
        {{ module.actions.length }} {{ module.actions.length === 1 ? 'action' : 'actions' }}
      </v-card-subtitle>
      <template #append>
        <v-btn
          icon="mdi-delete-outline"
          variant="text"
          size="small"
          :aria-label="`Delete ${module.name}`"
          @click.stop="$emit('remove')"
        />
      </template>
    </v-card-item>
    <v-card-text v-if="module.description" class="text-medium-emphasis">
      {{ module.description }}
    </v-card-text>
  </v-card>
</template>
