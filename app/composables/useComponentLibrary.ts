import type { ComponentLibrary, ComponentStyle, CustomComponent } from '~/types/component'
import type { Block, BlockType } from '~/types/module'
import { builtInStyles } from '~/configs/components'

const STORAGE_KEY = 'creator:components'

export function useComponentLibrary() {
  const library = useState<ComponentLibrary>('component-library', () => ({ base: {}, custom: [] }))

  function load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) library.value = { base: {}, custom: [], ...JSON.parse(saved) }
    } catch {
      // Storage can be unavailable (private mode, blocked site data); use built-in looks.
    }
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(library.value))
    } catch {
      // Keep working in memory when storage is unavailable.
    }
  }

  /** The look of a block type before any custom component is applied. */
  const baseStyle = (type: BlockType): ComponentStyle => ({
    ...builtInStyles[type],
    ...library.value.base[type],
  })

  const findCustom = (id: string | null | undefined) =>
    id ? library.value.custom.find(c => c.id === id) : undefined

  /** The look a block renders with: its custom component's, else its type's. */
  function styleFor(block: Block): ComponentStyle {
    const custom = findCustom(block.component)
    return { ...baseStyle(block.type), ...(custom?.base === block.type ? custom.style : {}) }
  }

  function saveBaseStyle(type: BlockType, style: ComponentStyle) {
    library.value = { ...library.value, base: { ...library.value.base, [type]: style } }
    persist()
  }

  function resetBaseStyle(type: BlockType) {
    const { [type]: _, ...base } = library.value.base
    library.value = { ...library.value, base }
    persist()
  }

  function saveCustom(component: CustomComponent) {
    const exists = library.value.custom.some(c => c.id === component.id)
    const custom = exists
      ? library.value.custom.map(c => (c.id === component.id ? component : c))
      : [...library.value.custom, component]
    library.value = { ...library.value, custom }
    persist()
  }

  /** Blocks using a removed component fall back to their type's look. */
  function removeCustom(id: string) {
    library.value = { ...library.value, custom: library.value.custom.filter(c => c.id !== id) }
    persist()
  }

  return {
    library,
    load,
    baseStyle,
    findCustom,
    styleFor,
    saveBaseStyle,
    resetBaseStyle,
    saveCustom,
    removeCustom,
  }
}
