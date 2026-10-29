<script setup lang="ts">
import type { ComponentStyle } from '~/types/component'
import type { CardBlock } from '~/types/module'

const props = defineProps<{ block: CardBlock; styling: ComponentStyle }>()
defineEmits<{ navigate: [pageId: string] }>()

// Tinted and outlined cards take the block's color; the others stay neutral with a colored icon.
const cardColor = computed(() =>
  props.styling.variant === 'tonal' || props.styling.variant === 'outlined' ? props.block.color : undefined,
)
</script>

<template>
  <v-card class="h-100 d-flex flex-column" v-bind="surfaceProps(styling)" :color="cardColor">
    <v-card-item>
      <template v-if="block.icon" #prepend>
        <v-icon :icon="block.icon" :color="block.color" />
      </template>
      <v-card-title>{{ block.title || 'Card title' }}</v-card-title>
    </v-card-item>
    <v-card-text v-if="block.body" class="flex-grow-1 block-body">{{ block.body }}</v-card-text>
    <v-card-actions v-if="block.buttonLabel">
      <v-btn :color="block.color" append-icon="mdi-arrow-right" @click="$emit('navigate', block.buttonPage)">
        {{ block.buttonLabel }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.block-body {
  white-space: pre-line;
}
</style>
