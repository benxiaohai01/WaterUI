<script setup lang="ts">
import { computed } from 'vue'
import type { WatermarkProps } from './props'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtWatermark' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<WatermarkProps>(), {
  text: 'Water UI',
  image: '',
  width: 180,
  height: 120,
  fontSize: 14,
  color: 'rgba(0,0,0,0.08)',
  opacity: 1,
  zIndex: 9999,
  customClass: ''
})

/* SVG 水印图案 URL（SSR 安全：仅在浏览器环境生成） */
const watermarkUrl = computed(() => {
  if (typeof document === 'undefined') return ''
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', String(props.width))
  svg.setAttribute('height', String(props.height))

  if (props.image) {
    const img = document.createElementNS('http://www.w3.org/2000/svg', 'image')
    img.setAttribute('x', '0')
    img.setAttribute('y', '0')
    img.setAttribute('width', String(props.width))
    img.setAttribute('height', String(props.height))
    img.setAttribute('href', props.image)
    svg.appendChild(img)
  } else {
    const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    textEl.setAttribute('x', String(props.width / 2))
    textEl.setAttribute('y', String(props.height / 2))
    textEl.setAttribute('text-anchor', 'middle')
    textEl.setAttribute('dominant-baseline', 'middle')
    textEl.setAttribute('fill', props.color)
    textEl.setAttribute('font-size', String(props.fontSize))
    textEl.setAttribute('font-weight', '600')
    textEl.setAttribute('letter-spacing', '3px')
    const lines = props.text.split('\n')
    const lineHeight = props.fontSize * 1.4
    lines.forEach((line, i) => {
      const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan')
      tspan.setAttribute('x', String(props.width / 2))
      tspan.setAttribute(
        'dy',
        i === 0 ? `${-((lines.length - 1) * lineHeight) / 2}px` : `${lineHeight}px`
      )
      tspan.textContent = line
      textEl.appendChild(tspan)
    })
    svg.appendChild(textEl)
  }

  const serializer = new XMLSerializer()
  const svgStr = serializer.serializeToString(svg)
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgStr)}`
})

/* 水印层背景样式 */
const bgStyle = computed(() => ({
  backgroundImage: `url('${watermarkUrl.value}')`,
  backgroundRepeat: 'repeat',
  backgroundSize: `${props.width}px ${props.height}px`
}))
</script>

<template>
  <div class="wt-watermark" :class="props.customClass">
    <slot />
    <div
      v-if="watermarkUrl"
      class="wt-watermark__bg"
      aria-hidden="true"
      :style="bgStyle"
    />
  </div>
</template>

<style scoped lang="scss">
.wt-watermark {
  /* 定位方式 */
  position: relative;
  /* 宽度 */
  width: 100%;
  /* 高度 */
  height: 100%;
  /* 溢出裁剪 */
  overflow: hidden;
}

.wt-watermark__bg {
  /* 定位方式 */
  position: absolute;
  /* 上下左右偏移合成属性 */
  inset: 0;
  /* 层叠层级 */
  z-index: v-bind('props.zIndex');
  /* 透明度 */
  opacity: v-bind('props.opacity');
  /* 是否响应鼠标事件 */
  pointer-events: none;
}
</style>
