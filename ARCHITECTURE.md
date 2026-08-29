# Water UI 项目架构设计

## 1. 项目概述

Water UI 是一个基于 Vue 3、TypeScript、Vite、Sass 和 pnpm workspace 的水滴视觉组件库。项目同时包含：

- `packages/theme`：设计 token、主题样式、共享 Sass mixin 与关键动画。
- `packages/water-ui`：组件库源码、入口、类型与构建配置。
- `apps/docs`：使用组件库构建的官方文档站。

项目目标是提供一套视觉统一、主题可替换、暗黑模式友好、响应式且可扩展的 Web 组件体系。

## 2. 顶层结构

```text
water-ui/
├─ pnpm-workspace.yaml
├─ package.json
├─ tsconfig.base.json
├─ packages/
│  ├─ theme/
│  │  ├─ src/
│  │  │  ├─ tokens.scss
│  │  │  ├─ mixins/
│  │  │  │  └─ index.scss
│  │  │  └─ index.scss
│  │  ├─ scripts/
│  │  │  └─ copy.mjs
│  │  └─ package.json
│  ├─ water-ui/
│  │  ├─ src/
│  │  │  ├─ components/
│  │  │  ├─ directives/
│  │  │  ├─ styles/
│  │  │  └─ index.ts
│  │  ├─ package.json
│  │  ├─ tsconfig.json
│  │  └─ vite.config.ts
│  └─ docs/
│     ├─ src/
│     │  ├─ router/
│     │  ├─ layouts/
│     │  ├─ pages/
│     │  ├─ components/
│     │  ├─ composables/
│     │  ├─ demos/
│     │  └─ main.ts
│     ├─ index.html
│     ├─ package.json
│     ├─ tsconfig.json
│     └─ vite.config.ts
└─ ARCHITECTURE.md
```

## 3. 依赖关系

依赖方向严格单向：

```text
packages/theme
      ↑
packages/water-ui
      ↑
apps/docs
```

设计原因：

- `theme` 不依赖组件库，可以独立维护设计 token。
- `water-ui` 只消费 `theme` 提供的 CSS 变量、mixin 和 keyframes。
- `docs` 使用 `workspace:*` 直接依赖组件库源码，开发时无需先发布组件库。
- Vue 作为组件库的 `peerDependency`，避免重复打包。

## 4. Theme 架构

### 4.1 Token 分层

主题层是所有组件视觉一致性的来源，主要包含：

- 颜色 token
- 水滴圆角 token
- 阴影 token
- 高光 token
- 动效时长 token
- 间距 token
- 字体与文字阴影 token
- 按钮扩散效果 token

所有运行时样式通过 CSS 自定义属性 `--wt-*` 暴露，组件不直接使用 Sass 变量作为运行时样式。

### 4.2 明暗主题

主题由根节点属性控制：

```css
:root[data-theme='light'] {
  color-scheme: light;
}

:root[data-theme='dark'] {
  color-scheme: dark;
}
```

暗黑模式通过独立的低饱和色板覆盖默认 token，而不是简单反转颜色。

### 4.3 可替换主题

因为组件运行时只读取 CSS 变量，用户只需在组件样式之后引入自定义主题文件，即可替换整体视觉：

```ts
import '@water-ui/components/style.css'
import './my-theme.css'
```

## 5. 组件库架构

### 5.1 组件目录规范

每个组件目录包含：

```text
button/
├─ Button.vue
├─ props.ts
└─ index.ts
```

组件 SFC 统一使用：

```vue
<script setup lang="ts">
import { computed } from 'vue'
import type { ButtonProps } from './props'

defineOptions({ name: 'WtButton' })

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'default'
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()
</script>
```

### 5.2 命名规范

```text
文件夹：button
组件名：WtButton
标签名：<wt-button />
CSS 类：wt-button
CSS 变量：--wt-*
```

### 5.3 入口与插件

`src/index.ts` 负责：

- 聚合所有组件。
- 导出 `WaterUI` 插件。
- 导出组件、类型和入口。
- 支持完整引入与按需引入。

完整引入：

```ts
import WaterUI from '@water-ui/components'
import '@water-ui/components/style.css'

app.use(WaterUI)
```

### 5.4 构建产物

Vite Library Mode 输出：

- ESM：`dist/water-ui.js`
- CommonJS：`dist/water-ui.umd.cjs`
- CSS：`dist/water-ui.css`
- TypeScript 声明文件

## 6. 水滴视觉机制

### 6.1 水滴圆角

组件使用不规则圆角模拟水滴边缘，而不是标准圆角：

```css
--wt-radius-md: 28px 18px 30px 22px / 22px 28px 20px 30px;
```

### 6.2 双层高光

可交互组件使用 `::before` 与 `::after` 两个伪元素：

- 主高光：面积较大，位置偏右上。
- 次高光：面积较小，位置更偏右下。

高光形状复用：

```css
--wt-highlight-radius: 58% 42% 55% 45% / 48% 38% 62% 52%;
--wt-highlight-small-radius: 50% 50% 60% 40% / 45% 55% 45% 55%;
```

### 6.3 阴影层级

水滴质感来自内阴影与外阴影组合：

- 左上内侧暗阴影。
- 右下内侧浅高光阴影。
- 外部柔和的深阴影。
- 接触面浅阴影。

### 6.4 液体动画

核心动画只使用 `transform`、`opacity`、`border-radius`，避免触发布局。

标准动画：

```css
@keyframes wt-liquid-flow {
  0%   { transform: scale(1, 1) rotate(0deg); }
  20%  { transform: scale(1.015, 0.985) rotate(0.15deg); }
  40%  { transform: scale(0.985, 1.015) rotate(-0.15deg); }
  60%  { transform: scale(1.01, 0.99) rotate(0.1deg); }
  80%  { transform: scale(0.99, 1.01) rotate(-0.1deg); }
  100% { transform: scale(1, 1) rotate(0deg); }
}
```

输入框使用更轻量的：

```css
@keyframes wt-liquid-flow-subtle {
  0%   { transform: scale(1, 1) rotate(0deg); }
  20%  { transform: scale(1.005, 0.995) rotate(0.04deg); }
  40%  { transform: scale(0.995, 1.005) rotate(-0.04deg); }
  60%  { transform: scale(1.003, 0.997) rotate(0.03deg); }
  80%  { transform: scale(0.997, 1.003) rotate(-0.03deg); }
  100% { transform: scale(1, 1) rotate(0deg); }
}
```

## 7. 按钮扩散效果

扩散效果是按钮独有的交互：

- 默认通过 `--wt-ripple-enabled: 0` 关闭。
- 按钮内部读取 `--wt-ripple-enabled`、`--wt-ripple-color`、`--wt-ripple-opacity`、`--wt-ripple-scale`、`--wt-ripple-duration`。
- 使用 Web Animations API 执行，若不可用则回退到 `transform/opacity` 过渡。
- 动画结束后移除涟漪节点。

非按钮组件不绑定该效果。

## 8. 文档站架构

### 8.1 路由

```text
/                            首页
/components                  组件库布局，重定向到 /components/button
/components/:name            组件详情页
```

### 8.2 文档布局

`DocsLayout` 包含：

- 顶部导航：Logo、首页、组件、GitHub、主题切换。
- 左侧组件分类目录。
- 右侧内容区。

移动端侧边栏转为抽屉。

### 8.3 组件详情页

组件详情页包含：

- 组件标题与说明。
- 组件独立参数面板，仅在存在独立参数时显示。
- 实时示例。
- 可折叠、可复制的代码块。
- 参数说明区域。

### 8.4 全局配置

全局视觉参数集中在 ConfigProvider 页面，通过 `useGlobalTheme` 写入 `document.documentElement`，使高光尺寸、动画速度、阴影深度、主色等作用于整个文档站。

## 9. 性能设计

- 动画只使用合成友好属性。
- 高光使用伪元素，避免额外 DOM。
- 代码块默认折叠。
- 组件示例和路由按需加载。
- Vue 作为 peer dependency。
- 组件库支持 tree-shaking。
- 样式通过 CSS 变量实现主题切换，避免重复生成多套组件样式。

## 10. 质量保障

- TypeScript 严格模式。
- `vue-tsc --noEmit` 类型检查。
- 组件库与文档站生产构建。
- 组件 API 统一使用 props、emits、slots、v-model。
- 明暗主题与响应式基础覆盖。

## 11. 扩展约定

新增组件时必须遵守：

- 使用 `wt` 前缀。
- 消费 `theme` 中的 CSS 变量。
- 复用统一高光、阴影、圆角和动画。
- 不向非按钮组件添加按钮扩散效果。
- 在 `componentCatalog` 中注册。
- 在 `componentDemos` 中添加示例。
- 在 `componentParams` 中说明可调参数。
- 保持组件可独立按需引入。
