import type { Directive } from 'vue'

const readVariable = (element: HTMLElement, name: string, fallback: string) => {
  const value = getComputedStyle(element).getPropertyValue(name).trim()
  return value || fallback
}

const createRipple = (event: PointerEvent) => {
  const target = event.currentTarget as HTMLElement

  if (
    target.hasAttribute('disabled') ||
    target.getAttribute('aria-disabled') === 'true' ||
    target.classList.contains('is-disabled')
  ) {
    return
  }

  const enabled = readVariable(target, '--wt-ripple-enabled', '1')
  if (enabled === '0' || enabled === 'false') {
    return
  }

  const rect = target.getBoundingClientRect()
  const size = Number(readVariable(target, '--wt-ripple-size', '20'))
  const scale = Number(readVariable(target, '--wt-ripple-scale', '9'))
  const opacity = Number(readVariable(target, '--wt-ripple-opacity', '0.45'))
  const duration = Number(readVariable(target, '--wt-ripple-duration', '600'))
  const color = readVariable(target, '--wt-ripple-color', 'rgba(255, 255, 255, 0.38)')

  const ripple = document.createElement('span')
  ripple.style.cssText = `
    position: absolute;
    z-index: 5;
    left: ${event.clientX - rect.left}px;
    top: ${event.clientY - rect.top}px;
    width: ${size}px;
    height: ${size}px;
    border-radius: 50%;
    pointer-events: none;
    background: ${color};
    opacity: ${opacity};
    transform: translate(-50%, -50%) scale(1);
  `

  target.appendChild(ripple)
  ripple.animate(
    [
      {
        opacity,
        transform: 'translate(-50%, -50%) scale(1)'
      },
      {
        opacity: 0,
        transform: `translate(-50%, -50%) scale(${scale})`
      }
    ],
    {
      duration,
      easing: 'ease-out'
    }
  )
  window.setTimeout(() => ripple.remove(), duration)
}

export const vRipple: Directive<HTMLElement> = {
  mounted(element) {
    element.addEventListener('pointerdown', createRipple)
  },
  unmounted(element) {
    element.removeEventListener('pointerdown', createRipple)
  }
}
