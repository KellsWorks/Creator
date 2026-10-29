<script setup lang="ts">
import type { ComponentStyle } from '~/types/component'
import type { ActionsBlock, LandingAction } from '~/types/module'

defineProps<{ block: ActionsBlock; actions: LandingAction[]; styling: ComponentStyle }>()
const emit = defineEmits<{ navigate: [pageId: string] }>()

/** Links open in a new tab; pages navigate; forms aren't built yet, so they do nothing. */
const linkProps = (action: LandingAction) =>
  action.type === 'url'
    ? { href: action.target, target: '_blank', rel: 'noopener' }
    : action.type === 'navigate'
      ? { onClick: () => emit('navigate', action.target) }
      : {}
</script>

<template>
  <div>
    <h3 v-if="block.title" class="text-title-large mb-3">{{ block.title }}</h3>

    <p v-if="!actions.length" class="text-body-medium text-medium-emphasis">
      Landing actions will appear here. Add them on the Actions tab.
    </p>

    <v-row v-else-if="block.layout === 'grid'" dense>
      <v-col v-for="action in actions" :key="action.id" cols="6" sm="4" md="3">
        <v-card
          :color="action.color"
          v-bind="{ ...surfaceProps(styling), ...linkProps(action) }"
          class="pa-4 text-center h-100"
        >
          <v-icon :icon="action.icon" size="32" />
          <div class="text-body-medium font-weight-medium mt-2">{{ action.label || 'Untitled action' }}</div>
        </v-card>
      </v-col>
    </v-row>

    <v-card v-else v-bind="surfaceProps(styling)">
      <v-list class="pa-0" bg-color="transparent">
        <v-list-item
          v-for="action in actions"
          :key="action.id"
          :title="action.label || 'Untitled action'"
          :append-icon="action.type === 'url' ? 'mdi-open-in-new' : 'mdi-chevron-right'"
          v-bind="linkProps(action)"
        >
          <template #prepend>
            <v-avatar :color="action.color" variant="tonal">
              <v-icon :icon="action.icon" />
            </v-avatar>
          </template>
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>
