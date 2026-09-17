<script setup lang="ts">
import { ref } from 'vue'
import { resetGlobalTheme, useGlobalTheme } from '@/composables/useGlobalTheme'

const theme = useGlobalTheme()
const demoText = ref('')
const demoSwitch = ref(true)
</script>

<template>
  <div class="global-config-demo">
    <div class="global-config-demo__controls">
      <div class="global-config-demo__heading">
        <div>
          <wt-text strong>全局水滴配置</wt-text>
          <wt-text type="secondary">通过 CSS 变量作用于全部组件，并保存在本地，切换页面与刷新后依然生效。</wt-text>
        </div>
        <wt-button size="small" @click="resetGlobalTheme()">恢复默认</wt-button>
      </div>

      <div class="global-config-demo__grid">
        <div class="global-config-demo__control">
          <span>高光尺寸</span>
          <wt-slider v-model="theme.highlightSize" :min="5" :max="14" :step="1" show-value />
        </div>

        <div class="global-config-demo__control">
          <span>高光亮度</span>
          <wt-slider v-model="theme.highlightOpacity" :min="0.3" :max="1" :step="0.05" show-value />
        </div>

        <div class="global-config-demo__control">
          <span>高光偏移</span>
          <wt-slider v-model="theme.highlightOffset" :min="0" :max="12" :step="1" show-value />
        </div>
        <div class="global-config-demo__control">
          <span>动画速度</span>
          <wt-slider v-model="theme.motion" :min="2" :max="7" :step="0.1" show-value />
        </div>

        <div class="global-config-demo__control">
          <span>阴影深度</span>
          <wt-slider v-model="theme.shadowAlpha" :min="0.01" :max="0.12" :step="0.005" show-value />
        </div>
      </div>
    </div>

    <div class="global-config-demo__preview">
      <wt-space wrap :size="12">
        <wt-button type="primary">Primary</wt-button>
        <wt-button type="success">Success</wt-button>
        <wt-button type="danger">Danger</wt-button>
      </wt-space>

      <wt-input v-model="demoText" placeholder="输入框预览" />

      <wt-space wrap :size="12">
        <wt-tag type="primary">标签</wt-tag>
        <wt-switch v-model="demoSwitch" />
      </wt-space>
    </div>
  </div>
</template>

<style scoped lang="scss">
.global-config-demo {
  display: grid;
  gap: 18px;
}

.global-config-demo__controls {
  padding: 20px;
  border-radius: var(--wt-radius-md);
  background: color-mix(in srgb, var(--wt-surface) 72%, transparent);
  box-shadow:
    inset 2px 3px 8px rgba(0, 0, 0, 0.07),
    inset -2px -2px 5px var(--wt-shadow-light);
}

.global-config-demo__heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.global-config-demo__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(140px, 1fr));
  gap: 16px;
}

.global-config-demo__control {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 8px 10px;
  color: var(--wt-text-secondary);
  font-size: 13px;
}

.global-config-demo__control .wt-slider {
  grid-column: 1 / -1;
}

.global-config-demo__preview {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 24px;
  border-radius: var(--wt-radius-lg);
  background: color-mix(in srgb, var(--wt-bg) 92%, var(--wt-surface));
  box-shadow:
    inset 3px 4px 10px rgba(0, 0, 0, 0.08),
    inset -2px -2px 6px var(--wt-shadow-light),
    0 12px 30px rgba(0, 0, 0, 0.06);
}

@media (max-width: 900px) {
  .global-config-demo__grid {
    grid-template-columns: repeat(2, minmax(140px, 1fr));
  }
}

@media (max-width: 560px) {
  .global-config-demo__heading {
    flex-direction: column;
  }

  .global-config-demo__grid {
    grid-template-columns: 1fr;
  }
}
</style>
