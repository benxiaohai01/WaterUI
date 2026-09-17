import { createApp } from 'vue'
import WaterUI from '@water-ui/components'
import '@water-ui/components/style.css'
import App from './App.vue'
import router from './router'
import { startGlobalTheme } from './composables/useGlobalTheme'

/* 主题引导：读取本地存储，未设置时跟随系统偏好，挂载前写入根元素 */
const bootstrapTheme = () => {
  let saved: string | null = null
  try {
    saved = localStorage.getItem('water-ui-theme')
  } catch {
    saved = null
  }

  const prefersDark =
    typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)').matches
  const theme = saved === 'dark' || saved === 'light' ? saved : prefersDark ? 'dark' : 'light'

  document.documentElement.dataset.theme = theme
}

bootstrapTheme()

/* 文档站作为视觉展示站点，始终保留完整水滴动画（不随系统的减少动态效果降级） */
document.documentElement.dataset.wtMotion = 'full'

/* 全局水滴配置在应用启动时应用一次，整站与刷新后持续生效 */
startGlobalTheme()

const app = createApp(App)
app.use(WaterUI)
app.use(router)
app.mount('#app')
