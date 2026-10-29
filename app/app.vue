<template>
  <v-app>
    <NuxtRouteAnnouncer />

    <v-app-bar color="primary">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-app-bar-title>{{ title }}</v-app-bar-title>
      <template #append>
        <v-btn icon="mdi-cog-outline" to="/components" aria-label="Components" />
        <v-btn
          :icon="theme.current.value.dark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          @click="theme.toggle()"
        />
      </template>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary>
      <v-list nav color="primary">
        <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" to="/" exact />
        <v-list-item prepend-icon="mdi-shape-outline" title="Components" to="/components" />
        <template v-if="modules.length">
          <v-list-subheader>Modules</v-list-subheader>
          <v-list-item
            v-for="module in modules"
            :key="module.id"
            :prepend-icon="module.icon"
            :title="module.name"
            :to="`/modules/${module.id}`"
          />
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <NuxtPage />
    </v-main>

    <v-fab
      v-if="route.path === '/'"
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

const theme = useTheme()
const route = useRoute()
const drawer = ref(false)

const { modules, load, save } = useModules()
const { load: loadComponents } = useComponentLibrary()
const { open: editorOpen, editing, openEditor } = useModuleEditor()
const title = computed(() => {
  if (route.path === '/components') return 'Components'
  return modules.value.find(m => m.id === route.params.id)?.name ?? 'Dashboard'
})

onMounted(() => {
  load()
  loadComponents()
})
</script>
