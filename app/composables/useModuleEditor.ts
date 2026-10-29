import type { ModuleConfig } from '~/types/module'

/** Open state for the single module editor dialog that lives in app.vue. */
export function useModuleEditor() {
  const open = useState('module-editor-open', () => false)
  const editing = useState<ModuleConfig | null>('module-editor-module', () => null)

  function openEditor(module: ModuleConfig | null = null) {
    editing.value = module
    open.value = true
  }

  return { open, editing, openEditor }
}
