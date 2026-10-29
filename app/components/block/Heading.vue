<script setup lang="ts">
import type { ComponentStyle } from '~/types/component'
import type { HeadingBlock } from '~/types/module'

defineProps<{ block: HeadingBlock; styling: ComponentStyle }>()

const sizeClass: Record<HeadingBlock['size'], string> = {
  large: 'text-headline-large',
  medium: 'text-headline-small',
  small: 'text-title-large',
}
</script>

<template>
  <h3 :class="[sizeClass[block.size], textClasses(styling)]" class="mt-2">{{ block.text || 'Heading' }}</h3>
</template>
