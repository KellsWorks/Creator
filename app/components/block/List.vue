<script setup lang="ts">
import type { ComponentStyle } from '~/types/component'
import type { ListBlock } from '~/types/module'

defineProps<{ block: ListBlock; styling: ComponentStyle }>()
</script>

<template>
  <v-card class="h-100" v-bind="surfaceProps(styling)">
    <v-card-item v-if="block.title">
      <v-card-title class="text-title-medium">{{ block.title }}</v-card-title>
    </v-card-item>
    <v-list>
      <v-list-item
        v-for="item in block.items"
        :key="item.id"
        :title="item.title || 'Item'"
        :subtitle="item.subtitle"
        :prepend-icon="item.icon || undefined"
      />
      <v-list-item v-if="!block.items.length" subtitle="No items yet." />
    </v-list>
  </v-card>
</template>
