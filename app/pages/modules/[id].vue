<script setup lang="ts">
import { LANDING_PAGE_ID } from '~/configs/blocks'
import { modulePages } from '~/configs/module'

const route = useRoute()
const { modules, loaded } = useModules()
const { openEditor } = useModuleEditor()

const module = computed(() => modules.value.find(m => m.id === route.params.id))
const pageId = computed(() => (route.query.page as string | undefined) ?? LANDING_PAGE_ID)
const page = computed(() => module.value && modulePages(module.value).find(p => p.id === pageId.value))
const onLanding = computed(() => pageId.value === LANDING_PAGE_ID)

const navigate = (id: string) => navigateTo({ query: id === LANDING_PAGE_ID ? {} : { page: id } })
</script>

<template>
  <v-container>
    <v-empty-state
      v-if="loaded && !page"
      icon="mdi-file-question-outline"
      headline="Page not found"
      text="This module or page may have been deleted."
    >
      <template #actions>
        <v-btn color="primary" to="/">Back to dashboard</v-btn>
      </template>
    </v-empty-state>

    <template v-else-if="module && page">
      <div class="d-flex align-center mb-4">
        <v-btn
          :to="onLanding ? '/' : { query: {} }"
          prepend-icon="mdi-arrow-left"
          variant="text"
        >
          {{ onLanding ? 'Dashboard' : module.landingPage.title || 'Back' }}
        </v-btn>
        <v-spacer />
        <v-btn prepend-icon="mdi-pencil-outline" variant="tonal" color="primary" @click="openEditor(module)">
          Edit module
        </v-btn>
      </div>

      <ModulePage :page="page" :actions="module.actions" @navigate="navigate" />
    </template>
  </v-container>
</template>
