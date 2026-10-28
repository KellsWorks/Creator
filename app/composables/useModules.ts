import type { ModuleConfig } from '~/types/module'

const STORAGE_KEY = 'creator:modules'

export function useModules() {
  const modules = useState<ModuleConfig[]>('modules', () => [])

  function load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) modules.value = JSON.parse(saved)
    } catch {
      // Storage can be unavailable (private mode, blocked site data); start empty.
    }
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(modules.value))
    } catch {
      // Keep working in memory when storage is unavailable.
    }
  }

  function save(module: ModuleConfig) {
    const saved = { ...module, updatedAt: new Date().toISOString() }
    const exists = modules.value.some(m => m.id === saved.id)
    modules.value = exists
      ? modules.value.map(m => (m.id === saved.id ? saved : m))
      : [...modules.value, saved]
    persist()
  }

  function remove(id: string) {
    modules.value = modules.value.filter(m => m.id !== id)
    persist()
  }

  return { modules, load, save, remove }
}
