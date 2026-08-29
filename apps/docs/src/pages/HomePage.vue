<script setup lang="ts">
import CodeBlock from '@/components/CodeBlock.vue'

const installCode = `pnpm add @water-ui/components @water-ui/theme`
const usageCode = `import { createApp } from 'vue'
import WaterUI from '@water-ui/components'
import '@water-ui/components/style.css'

const app = createApp(App)
app.use(WaterUI)`
</script>

<template>
  <main class="home">
    <section class="home__hero">
      <div class="home__hero-copy">
        <wt-tag type="primary">Vue 3 · TypeScript · 水滴视觉</wt-tag>
        <h1>Water UI</h1>
        <p>
          一套以水的流动性为核心的 Vue 3 组件库。水滴形圆角、双层高光、柔和内外阴影，
          让界面拥有半透明水珠般的呼吸感。
        </p>
        <wt-space :size="14" wrap>
          <wt-button type="primary" size="large" @click="$router.push('/components')">
            进入组件库
            <template #icon>
              <wt-icon name="arrow-right" :size="18" />
            </template>
          </wt-button>
          <wt-button size="large" type="default">
            GitHub
            <template #icon>
              <wt-icon name="github" :size="18" />
            </template>
          </wt-button>
        </wt-space>
      </div>

      <div class="home__drop" aria-hidden="true">
        <span class="home__drop-highlight" />
        <span class="home__drop-highlight home__drop-highlight--small" />
      </div>
    </section>

    <section class="home__features">
      <wt-row :gutter="[18, 18]">
        <wt-col :span="24" :sm="12" :lg="8">
          <article class="feature-card">
            <wt-icon name="code" :size="24" color="var(--wt-primary)" />
            <h3>可组合 API</h3>
            <p>统一的 props、slots、events 与 v-model，组件之间可以灵活组合。</p>
          </article>
        </wt-col>
        <wt-col :span="24" :sm="12" :lg="8">
          <article class="feature-card">
            <wt-icon name="moon" :size="24" color="var(--wt-primary)" />
            <h3>明暗主题</h3>
            <p>基于 CSS 自定义属性的完整主题系统，支持暗黑模式与局部主题。</p>
          </article>
        </wt-col>
        <wt-col :span="24" :sm="12" :lg="8">
          <article class="feature-card">
            <wt-icon name="external" :size="24" color="var(--wt-primary)" />
            <h3>一键换肤</h3>
            <p>替换单个主题 CSS 文件，即可改变整体视觉风格。</p>
          </article>
        </wt-col>
      </wt-row>
    </section>

    <section class="home__quickstart">
      <div class="section-heading">
        <wt-text type="secondary" strong>快速开始</wt-text>
        <h2>安装与使用</h2>
      </div>
      <div class="home__code-grid">
        <div>
          <h3>安装</h3>
          <CodeBlock :code="installCode" language="bash" />
        </div>
        <div>
          <h3>引入</h3>
          <CodeBlock :code="usageCode" language="ts" />
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped lang="scss">
.home {
  min-height: 100vh;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 28px 80px;
}

.home__hero {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(280px, 0.95fr);
  align-items: center;
  gap: 48px;
  min-height: calc(100vh - 64px);
  padding: 60px 0;
}

.home__hero-copy h1 {
  margin: 22px 0 18px;
  font-size: clamp(42px, 7vw, 84px);
  line-height: 0.95;
  letter-spacing: -0.02em;
  color: var(--wt-text);
}

.home__hero-copy p {
  max-width: 620px;
  margin: 0 0 28px;
  color: var(--wt-text-secondary);
  font-size: clamp(16px, 2vw, 20px);
  line-height: 1.7;
}

.home__drop {
  position: relative;
  width: min(340px, 70vw);
  aspect-ratio: 1;
  margin: auto;
  border-radius: 41% 59% 70% 30% / 39% 49% 51% 61%;
  background: linear-gradient(
    145deg,
    color-mix(in srgb, var(--wt-primary) 88%, white),
    color-mix(in srgb, var(--wt-primary) 68%, #062b57)
  );
  box-shadow:
    inset 14px 24px 40px rgba(0, 0, 0, 0.28),
    inset -12px -14px 30px rgba(255, 255, 255, 0.35),
    18px 26px 55px color-mix(in srgb, var(--wt-primary) 30%, transparent);
  animation: home-drop 5s ease-in-out infinite alternate;
}

.home__drop-highlight {
  position: absolute;
  top: 26%;
  left: 28%;
  width: 38px;
  height: 38px;
  border-radius: 48% 52% 79% 21% / 46% 25% 75% 54%;
  background: rgba(255, 255, 255, 0.86);
  filter: blur(0.2px);
}

.home__drop-highlight--small {
  top: 42%;
  left: 37%;
  width: 15px;
  height: 15px;
  background: rgba(255, 255, 255, 0.78);
}

.home__features {
  padding: 28px 0 48px;
}

.feature-card {
  height: 100%;
  padding: 26px;
  border-radius: var(--wt-radius-md);
  background: color-mix(in srgb, var(--wt-surface) 86%, transparent);
  box-shadow:
    inset 2px 3px 8px rgba(0, 0, 0, 0.08),
    inset -2px -2px 5px var(--wt-shadow-light),
    0 10px 28px rgba(0, 0, 0, 0.06);
}

.feature-card h3 {
  margin: 18px 0 10px;
  color: var(--wt-text);
  font-size: 18px;
}

.feature-card p {
  margin: 0;
  color: var(--wt-text-secondary);
  line-height: 1.6;
}

.home__quickstart {
  padding: 48px 0;
}

.section-heading {
  margin-bottom: 22px;
}

.section-heading h2 {
  margin: 8px 0 0;
  color: var(--wt-text);
  font-size: 30px;
}

.home__code-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
}

.home__code-grid h3 {
  margin: 0 0 12px;
  color: var(--wt-text);
  font-size: 17px;
}

@keyframes home-drop {
  0% { border-radius: 41% 59% 70% 30% / 39% 49% 51% 61%; transform: scale(1) rotate(0deg); }
  50% { border-radius: 63% 37% 58% 42% / 40% 48% 52% 60%; transform: scale(1.02, 0.98) rotate(1deg); }
  100% { border-radius: 54% 46% 70% 30% / 34% 40% 60% 66%; transform: scale(0.99, 1.01) rotate(-1deg); }
}

@media (max-width: 860px) {
  .home__hero {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .home__drop {
    width: min(280px, 68vw);
  }

  .home__code-grid {
    grid-template-columns: 1fr;
  }
}
</style>
