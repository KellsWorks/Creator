<script setup lang="ts">
import type { ComponentStyle } from '~/types/component'
import type { TextBlock } from '~/types/module'

defineProps<{ block: TextBlock; styling: ComponentStyle }>()
</script>

<template>
  <p :class="textClasses(styling)" class="text-body-large block-text">{{ block.text || 'Write some text.' }}</p>
</template>

<style scoped>
.block-text {
  white-space: pre-line;
}
</style>
