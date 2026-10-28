<template>
  <v-app>
    <NuxtRouteAnnouncer />

    <v-app-bar color="primary">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-app-bar-title>Dashboard</v-app-bar-title>
      <template #append>
        <v-btn
          :icon="theme.current.value.dark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          @click="theme.toggle()"
        />
      </template>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary>
      <v-list nav>
        <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" active color="primary" />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <v-empty-state
          v-if="!modules.length"
          icon="mdi-view-grid-plus-outline"
          headline="No modules yet"
          text="Tap the + button to create your first module."
        />
        <v-row v-else>
          <v-col v-for="module in modules" :key="module.id" cols="12" sm="6" lg="4">
            <ModuleCard :module="module" @edit="openEditor(module)" @remove="remove(module.id)" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-fab
      icon
      color="primary"
      app
      location="bottom end"
      size="large"
      @click="openEditor(null)"
    >
      <v-icon icon="mdi-plus" />
      <span class="d-sr-only">Create module</span>
    </v-fab>

    <ModuleEditorDialog v-model="editorOpen" :module="editing" @save="save" />
  </v-app>
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify'
import type { ModuleConfig } from '~/types/module'

const theme = useTheme()
const drawer = ref(false)

const { modules, load, save, remove } = useModules()
const editorOpen = ref(false)
const editing = ref<ModuleConfig | null>(null)

function openEditor(module: ModuleConfig | null) {
  editing.value = module
  editorOpen.value = true
}

onMounted(load)
</script>
