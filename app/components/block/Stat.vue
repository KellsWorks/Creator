<script setup lang="ts">
import type { ComponentStyle } from '~/types/component'
import type { StatBlock } from '~/types/module'

defineProps<{ block: StatBlock; styling: ComponentStyle }>()
</script>

<template>
  <v-card class="h-100" v-bind="surfaceProps(styling)">
    <v-card-text>
      <div class="d-flex align-center ga-3">
        <v-avatar :color="block.color" variant="tonal" rounded="lg">
          <v-icon :icon="block.icon" />
        </v-avatar>
        <div class="text-body-medium text-medium-emphasis">{{ block.label || 'Label' }}</div>
      </div>
      <div class="text-headline-large font-weight-bold mt-3">{{ block.value || '0' }}</div>
      <div v-if="block.caption" class="text-body-small text-medium-emphasis mt-1">{{ block.caption }}</div>
    </v-card-text>
  </v-card>
</template>
