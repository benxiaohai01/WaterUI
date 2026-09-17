import { reactive, watch, watchEffect, type WatchStopHandle } from 'vue'

/* 全局水滴配置的默认值 */
const defaultTheme = {
  highlightSize: 12,
  highlightOpacity: 0.78,
  highlightOffset: 8,
  motion: 3.8,
  shadowAlpha: 0.04
}

const STORAGE_KEY = 'water-ui-global-theme'

/* 读取持久化的全局配置（隐私模式下读取失败时回退默认值） */
const readStoredTheme = (): Partial<typeof defaultTheme> => {
  if (typeof localStorage === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Partial<typeof defaultTheme>
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

export const globalTheme = reactive({
  ...defaultTheme,
  ...readStoredTheme()
})

/* 持久化：任意一项变化后写入本地存储，刷新与跨页面都保持 */
const persistTheme = () => {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...globalTheme }))
  } catch {
    /* 忽略写入失败（隐私模式） */
  }
}

/* 主色不在此处写入：内联变量会永久压过明暗主题的 --wt-primary token */

const applyGlobalTheme = () => {
  /* 非浏览器环境（SSR / 预渲染）不访问 document */
  if (typeof document === 'undefined') return

  const root = document.documentElement
  root.style.setProperty('--wt-highlight-size-base', `${globalTheme.highlightSize}px`)
  root.style.setProperty('--wt-highlight-opacity', `${globalTheme.highlightOpacity}`)
  root.style.setProperty(
    '--wt-highlight-small-opacity',
    `${Math.max(0.3, globalTheme.highlightOpacity - 0.1)}`
  )
  root.style.setProperty('--wt-highlight-offset', `${globalTheme.highlightOffset}px`)
  root.style.setProperty('--wt-motion-normal', `${globalTheme.motion}s`)
  root.style.setProperty('--wt-motion-slow', `${globalTheme.motion + 2}s`)
  root.style.setProperty('--wt-shadow-dark-alpha', `${globalTheme.shadowAlpha}`)
  root.style.setProperty('--wt-shadow-dark-alpha-strong', `${globalTheme.shadowAlpha + 0.02}`)
  /* 三档阴影透明度按同一基准等比联动，保证所有组件的阴影深度可被统一调整 */
  root.style.setProperty('--wt-shadow-inset-alpha', `${(globalTheme.shadowAlpha * 3.75).toFixed(3)}`)
  root.style.setProperty('--wt-shadow-cast-alpha', `${(globalTheme.shadowAlpha * 2.5).toFixed(3)}`)
  root.style.setProperty('--wt-shadow-contact-alpha', `${(globalTheme.shadowAlpha * 1.5).toFixed(3)}`)
}

let stopHandle: WatchStopHandle | null = null
let stopPersist: WatchStopHandle | null = null

/* 启动全局主题：应用配置并监听变化（幂等，可在应用启动时调用一次） */
export function startGlobalTheme() {
  if (typeof document === 'undefined') return () => {}

  stopHandle?.()
  stopHandle = watchEffect(applyGlobalTheme)
  stopPersist?.()
  stopPersist = watch(globalTheme, persistTheme)

  return () => {
    stopHandle?.()
    stopHandle = null
    stopPersist?.()
    stopPersist = null
  }
}

/* 恢复默认：重置为默认值并清除本地存储 */
export function resetGlobalTheme() {
  Object.assign(globalTheme, defaultTheme)
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* 忽略移除失败 */
    }
  }
  applyGlobalTheme()
}

export function useGlobalTheme() {
  return globalTheme
}
