import { reactive, watchEffect } from 'vue'

export const globalTheme = reactive({
  highlightSize: 12,
  highlightOpacity: 0.78,
  highlightOffset: 8,
  motion: 3.8,
  shadowAlpha: 0.04,
  primaryColor: '#3d7eff'
})

const applyGlobalTheme = () => {
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
  root.style.setProperty('--wt-primary', globalTheme.primaryColor)
}

watchEffect(applyGlobalTheme)

export function useGlobalTheme() {
  return globalTheme
}
