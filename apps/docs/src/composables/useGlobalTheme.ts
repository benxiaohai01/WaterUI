import { reactive, watchEffect } from 'vue'

export const globalTheme = reactive({
  highlightSize: 12,
  motion: 3.5,
  shadowAlpha: 0.04,
  primaryColor: '#3d7eff'
})

const applyGlobalTheme = () => {
  const root = document.documentElement
  root.style.setProperty('--wt-highlight-size', `${globalTheme.highlightSize}px`)
  root.style.setProperty(
    '--wt-highlight-small-size',
    `${Math.max(3, globalTheme.highlightSize * 0.5)}px`
  )
  root.style.setProperty('--wt-motion-normal', `${globalTheme.motion}s`)
  root.style.setProperty('--wt-motion-slow', `${globalTheme.motion + 1.5}s`)
  root.style.setProperty('--wt-shadow-dark-alpha', `${globalTheme.shadowAlpha}`)
  root.style.setProperty('--wt-shadow-dark-alpha-strong', `${globalTheme.shadowAlpha + 0.02}`)
  root.style.setProperty('--wt-primary', globalTheme.primaryColor)
}

watchEffect(applyGlobalTheme)

export function useGlobalTheme() {
  return globalTheme
}
