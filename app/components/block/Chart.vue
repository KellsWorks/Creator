<script setup lang="ts">
import type { ComponentStyle } from '~/types/component'
import type { ChartBlock } from '~/types/module'

const props = defineProps<{ block: ChartBlock; styling: ComponentStyle }>()
const values = computed(() => props.block.points.map(p => Number(p.value) || 0))
const labels = computed(() => props.block.points.map(p => p.label))
</script>

<template>
  <v-card class="h-100" v-bind="surfaceProps(styling)">
    <v-card-item>
      <v-card-title class="text-title-medium">{{ block.title || 'Chart' }}</v-card-title>
    </v-card-item>
    <v-card-text>
      <v-sparkline
        v-if="values.length >= 2"
        :model-value="values"
        :labels="labels"
        :type="block.chartType === 'bar' ? 'bar' : 'trend'"
        :color="block.color"
        :fill="block.chartType === 'line'"
        :line-width="block.chartType === 'bar' ? 8 : 2"
        :label-size="8"
        height="120"
        padding="12"
        smooth
        auto-draw
        show-labels
      />
      <p v-else class="text-body-medium text-medium-emphasis">Add at least two data points to see the chart.</p>
    </v-card-text>
  </v-card>
</template>
