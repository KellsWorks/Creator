<script setup lang="ts">
import type { BlockWidth, LandingAction, ModulePage } from '~/types/module'
import { widthCols } from '~/configs/blocks'

const props = defineProps<{
  page: ModulePage
  actions: LandingAction[]
  /** Render in a small frame (the editor preview): side-by-side blocks go at most two across. */
  narrow?: boolean
}>()
defineEmits<{ navigate: [pageId: string] }>()

// On small screens and in the preview, anything narrower than full width goes two across.
const twoAcross = (width: BlockWidth) => (width === 'full' ? 12 : 6)
const wideCols = (width: BlockWidth) => (props.narrow ? twoAcross(width) : widthCols[width])
</script>

<template>
  <div>
    <h2 class="text-headline-small font-weight-bold">{{ page.title || 'Untitled page' }}</h2>
    <p v-if="page.subtitle" class="text-body-large text-medium-emphasis mt-1">{{ page.subtitle }}</p>

    <v-row class="mt-4">
      <v-col
        v-for="block in page.blocks"
        :key="block.id"
        cols="12"
        :sm="twoAcross(block.width)"
        :md="wideCols(block.width)"
      >
        <BlockRenderer :block="block" :actions="actions" @navigate="$emit('navigate', $event)" />
      </v-col>
    </v-row>

    <p v-if="!page.blocks.length" class="text-body-medium text-medium-emphasis">
      This page has no content yet.
    </p>
  </div>
</template>
