<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { componentCatalog } from '@/components/catalog'

const theme = ref<'light' | 'dark'>('light')
const sidebarOpen = ref(false)

const applyTheme = (next: 'light' | 'dark') => {
  theme.value = next
  document.documentElement.dataset.theme = next
  localStorage.setItem('water-ui-theme', next)
}

const toggleTheme = () => {
  applyTheme(theme.value === 'light' ? 'dark' : 'light')
}

onMounted(() => {
  const saved = localStorage.getItem('water-ui-theme')
  const initial = saved === 'dark' || saved === 'light' ? saved : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  applyTheme(initial)
})

watch(
  () => document.documentElement.dataset.theme,
  (value) => {
    theme.value = value === 'dark' ? 'dark' : 'light'
  }
)
</script>

<template>
  <div class="docs-shell">
    <wt-layout direction="vertical" class="docs-shell__root">
      <wt-header class="docs-header" height="64px">
        <div class="docs-header__left">
          <wt-button
            class="docs-header__menu"
            type="default"
            size="small"
            aria-label="打开目录"
            @click="sidebarOpen = !sidebarOpen"
          >
            <template #icon>
              <wt-icon name="menu" :size="18" />
            </template>
          </wt-button>

          <router-link to="/" class="docs-brand">
            <span class="docs-brand__drop" aria-hidden="true" />
            <span>Water UI</span>
          </router-link>
        </div>

        <wt-space class="docs-header__right" :size="10">
          <router-link class="docs-header__nav" to="/">首页</router-link>
          <router-link class="docs-header__nav" to="/components">组件</router-link>
          <wt-link href="https://github.com/" target="_blank" :underline="false">
            <wt-icon name="github" :size="19" />
          </wt-link>
          <wt-button
            type="default"
            size="small"
            :aria-label="theme === 'light' ? '切换到暗黑模式' : '切换到明亮模式'"
            @click="toggleTheme"
          >
            <template #icon>
              <wt-icon :name="theme === 'light' ? 'moon' : 'sun'" :size="17" />
            </template>
          </wt-button>
        </wt-space>
      </wt-header>

      <wt-layout class="docs-body">
        <div class="docs-sidebar-mask" :class="{ 'is-open': sidebarOpen }" @click="sidebarOpen = false" />
        <wt-aside class="docs-sidebar" width="272px" :class="{ 'is-open': sidebarOpen }">
          <nav class="docs-nav">
            <section v-for="category in componentCatalog" :key="category.title" class="docs-nav__group">
              <div class="docs-nav__title">{{ category.title }}</div>
              <router-link
                v-for="item in category.items"
                :key="item.name"
                v-slot="{ href, navigate, isActive }"
                :to="item.available ? `/components/${item.name}` : ''"
                custom
              >
                <a
                  v-if="item.available"
                  :href="href"
                  class="docs-nav__item"
                  :class="{ 'is-active': isActive }"
                  @click="navigate"
                >
                  {{ item.label }}
                </a>
                <span v-else class="docs-nav__item is-planned">
                  {{ item.label }}
                  <span>规划中</span>
                </span>
              </router-link>
            </section>
          </nav>
        </wt-aside>

        <wt-main class="docs-content">
          <router-view />
        </wt-main>
      </wt-layout>
    </wt-layout>
  </div>
</template>

<style scoped lang="scss">
.docs-shell {
  min-height: 100vh;
  background:
    radial-gradient(circle at 15% 12%, color-mix(in srgb, var(--wt-primary) 12%, transparent), transparent 34%),
    var(--wt-bg);
}

.docs-shell__root {
  min-height: 100vh;
}

.docs-header {
  position: sticky;
  top: 0;
  z-index: 20;
  justify-content: space-between;
  border-bottom: 1px solid color-mix(in srgb, var(--wt-text-secondary) 14%, transparent);
  background: color-mix(in srgb, var(--wt-bg) 88%, transparent);
  backdrop-filter: blur(18px);
}

.docs-header__left,
.docs-header__right {
  display: flex;
  align-items: center;
}

.docs-header__menu {
  display: none;
  margin-right: 12px;
}

.docs-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--wt-text);
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-decoration: none;
}

.docs-brand__drop {
  width: 22px;
  height: 22px;
  background: linear-gradient(145deg, var(--wt-primary), color-mix(in srgb, var(--wt-primary) 55%, white));
  border-radius: 41% 59% 70% 30% / 39% 49% 51% 61%;
  box-shadow: inset 2px 3px 6px rgba(255, 255, 255, 0.45), 2px 3px 8px color-mix(in srgb, var(--wt-primary) 30%, transparent);
}

.docs-header__nav {
  color: var(--wt-text-secondary);
  font-size: 14px;
  text-decoration: none;
  transition: color 0.2s ease;
}

.docs-header__nav:hover {
  color: var(--wt-text);
}

.docs-body {
  flex: 1;
  min-height: 0;
}

.docs-sidebar {
  position: sticky;
  top: 64px;
  height: calc(100vh - 64px);
  border-right: 1px solid color-mix(in srgb, var(--wt-text-secondary) 14%, transparent);
  background: color-mix(in srgb, var(--wt-bg) 76%, transparent);
}

.docs-nav {
  padding: 22px 12px 40px;
}

.docs-nav__group + .docs-nav__group {
  margin-top: 22px;
}

.docs-nav__title {
  padding: 0 12px 8px;
  color: var(--wt-text-placeholder);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.docs-nav__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 34px;
  margin: 2px 0;
  padding: 7px 12px;
  border-radius: 13px;
  color: var(--wt-text-secondary);
  font-size: 14px;
  text-decoration: none;
  transition: color 0.2s ease, background 0.2s ease;
}

.docs-nav__item:hover {
  color: var(--wt-text);
  background: color-mix(in srgb, var(--wt-primary) 8%, transparent);
}

.docs-nav__item.is-active {
  color: var(--wt-primary);
  background: color-mix(in srgb, var(--wt-primary) 14%, transparent);
  font-weight: 600;
}

.docs-nav__item.is-planned {
  cursor: default;
  color: var(--wt-text-placeholder);
  opacity: 0.7;
}

.docs-nav__item.is-planned span {
  font-size: 11px;
  color: var(--wt-primary);
}

.docs-content {
  padding: 32px clamp(20px, 4vw, 56px) 80px;
  background: transparent;
}

.docs-sidebar-mask {
  display: none;
}

@media (max-width: 860px) {
  .docs-header__menu {
    display: inline-flex;
  }

  .docs-sidebar {
    position: fixed;
    top: 64px;
    left: 0;
    z-index: 30;
    height: calc(100vh - 64px);
    transform: translateX(-100%);
    transition: transform 0.24s ease;
    background: var(--wt-surface);
  }

  .docs-sidebar.is-open {
    transform: translateX(0);
  }

  .docs-sidebar-mask {
    display: block;
    position: fixed;
    inset: 64px 0 0;
    z-index: 25;
    background: rgba(0, 0, 0, 0.32);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
  }

  .docs-sidebar-mask.is-open {
    opacity: 1;
    pointer-events: auto;
  }
}
</style>
