<script setup lang="ts">
import type { Component } from 'vue'
import type { ComponentStyle } from '~/types/component'
import type { Block, BlockType, LandingAction } from '~/types/module'
import Heading from './Heading.vue'
import Text from './Text.vue'
import Stat from './Stat.vue'
import Card from './Card.vue'
import Chart from './Chart.vue'
import List from './List.vue'
import Actions from './Actions.vue'

// Add new block types here, in `Block`, in `blockVariants` and in `styleFields`.
const components: Record<BlockType, Component> = {
  heading: Heading,
  text: Text,
  stat: Stat,
  card: Card,
  chart: Chart,
  list: List,
  actions: Actions,
}

const props = defineProps<{
  block: Block
  actions: LandingAction[]
  /** Render with this look instead of the library's, e.g. an unsaved style being previewed. */
  componentStyle?: ComponentStyle
}>()
defineEmits<{ navigate: [pageId: string] }>()

const { styleFor } = useComponentLibrary()
const styling = computed(() => props.componentStyle ?? styleFor(props.block))
</script>

<template>
  <component
    :is="components[block.type]"
    :block="block"
    :styling="styling"
    v-bind="block.type === 'actions' ? { actions } : {}"
    @navigate="$emit('navigate', $event)"
  />
</template>
