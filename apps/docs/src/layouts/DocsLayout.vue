<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { componentCatalog } from '@/components/catalog'

const route = useRoute()

/* 初始主题由 main.ts 在挂载前写入根元素，这里只负责读取与切换 */
const theme = ref<'light' | 'dark'>(
  document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
)
const sidebarOpen = ref(false)

/* 安全写入：隐私模式下 localStorage 会抛出异常，不能中断主题切换 */
const saveTheme = (next: 'light' | 'dark') => {
  try {
    localStorage.setItem('water-ui-theme', next)
  } catch {
    /* 忽略存储失败，主题仍然作用于当前页面 */
  }
}

const applyTheme = (next: 'light' | 'dark') => {
  theme.value = next
  document.documentElement.dataset.theme = next
  saveTheme(next)
}

const toggleTheme = () => {
  applyTheme(theme.value === 'light' ? 'dark' : 'light')
}

/* 键盘：Escape 关闭移动端抽屉 */
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') sidebarOpen.value = false
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
})

/* 路由变化时关闭移动端抽屉，避免遮罩挡住新页面 */
watch(
  () => route.fullPath,
  () => {
    sidebarOpen.value = false
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
            :aria-expanded="sidebarOpen"
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
          <wt-link
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub 仓库"
            :underline="false"
          >
            <wt-icon name="github" :size="19" />
          </wt-link>
          <wt-button
            class="docs-theme-toggle"
            type="default"
            size="small"
            :aria-label="theme === 'light' ? '切换到暗黑模式' : '切换到明亮模式'"
            :aria-pressed="theme === 'dark'"
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
  box-shadow: inset 2px 3px 6px color-mix(in srgb, var(--wt-highlight) 45%, transparent), 2px 3px 8px color-mix(in srgb, var(--wt-primary) 30%, transparent);
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
    /* 关闭态不可见，链接同时移出 Tab 顺序 */
    visibility: hidden;
    transition: transform 0.24s ease, visibility 0.24s ease;
    background: var(--wt-surface);
  }

  .docs-sidebar.is-open {
    transform: translateX(0);
    visibility: visible;
  }

  .docs-sidebar-mask {
    display: block;
    position: fixed;
    inset: 64px 0 0;
    z-index: 25;
    background: var(--wt-shadow-deeper);
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
