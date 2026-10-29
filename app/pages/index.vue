<script setup lang="ts">
const { modules, loaded, remove } = useModules()
const { openEditor } = useModuleEditor()
</script>

<template>
  <v-container>
    <v-empty-state
      v-if="loaded && !modules.length"
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
</template>
