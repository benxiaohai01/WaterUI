﻿# 水滴组件库设计文档

## 1. 项目定位

项目是一个基于 Vue 3 的水滴视觉组件库，同时提供一个使用该组件库构建的官方文档站点。

核心视觉以 `study/uiDemo/waterCompenent.html` 为基准，强调“水的流动性”：

- 不规则水滴形圆角，而不是标准圆角或胶囊形。
- 双层高光伪元素，模拟水面反光。
- 柔和的内外阴影，形成半透明玻璃/水珠质感。
- 低频、低幅度的液体流动动画。
- 组件在视觉上统一，但在尺寸、状态、主题上可配置。

最终交付物包括：

1. `Water UI` 组件库，可独立安装使用。
2. 官方文档站，使用该组件库构建。
3. 文档站提供组件预览、复制代码、CSS 参数实时调节、明暗主题切换。
4. 可替换的 CSS 主题文件，替换单个主题文件即可切换整体风格。

## 2. 技术栈与工程约束

- Vue 3 + TypeScript
- Vite
- Sass
- pnpm workspace
- Vue Router
- Vitest + Vue Test Utils
- Playwright
- ESLint + Prettier + Stylelint
- Commitlint + Husky + lint-staged

工程规范参考阿里巴巴前端规约：统一使用 TypeScript 严格模式，组件 props/emits/slots 明确声明，样式使用 BEM 命名，提交信息使用 Conventional Commits，发布前必须通过 lint、typecheck、test、build。

## 3. 核心设计原则

### 3.1 单一职责

每个组件只负责一个清晰的行为边界。例如：

- `WtButton` 只负责交互触发，不负责业务逻辑。
- `WtInput` 只负责文本输入，不负责表单校验。
- `WtFormItem` 只负责单项字段的布局、label 和错误信息展示。
- 弹层、滚动、主题等通用能力下沉到 composables 或 directives。

### 3.2 可组合性

组件通过 `props`、`slots`、`emits`、`expose` 提供组合能力：

- 使用 `v-model` 统一双向绑定。
- 使用具名插槽支持自定义内容。
- 使用 `defineExpose` 暴露必要的命令式方法。
- 复杂组件由基础组件组合，而不是复制实现。

### 3.3 一致性

- 组件前缀统一为 `wt`。
- 组件标签统一为 `wt-xxx`。
- props 使用 camelCase，事件使用 kebab-case。
- 尺寸枚举统一为 `small`、`medium`、`large`。
- 状态统一支持 `disabled`、`loading`、`readonly`。
- 样式 token 统一由 `theme` 包生成。

### 3.4 视觉一致性

水滴视觉不是每个组件各自绘制一套，而是抽象成一套设计 token 和基础 mixin。按钮、标签、输入框、开关等组件都复用同一套：

- 水滴圆角系统
- 双层高光系统
- 内阴影/外阴影层级
- 液体流动动画曲线
- 明暗主题色板

## 4. 总体架构

### 4.1 Monorepo 结构

```text
frontend-study/
├─ pnpm-workspace.yaml
├─ package.json
├─ tsconfig.base.json
├─ .eslintrc.cjs
├─ .prettierrc
├─ .stylelintrc
├─ commitlint.config.cjs
├─ packages/
│  ├─ theme/
│  │  ├─ src/
│  │  │  ├─ tokens/
│  │  │  ├─ themes/
│  │  │  ├─ mixins/
│  │  │  └─ index.scss
│  │  └─ package.json
│  ├─ water-drop/
│  │  ├─ src/
│  │  │  ├─ components/
│  │  │  ├─ composables/
│  │  │  ├─ directives/
│  │  │  ├─ utils/
│  │  │  ├─ styles/
│  │  │  └─ index.ts
│  │  ├─ package.json
│  │  └─ vite.config.ts
│  └─ docs/
│     ├─ src/
│     │  ├─ router/
│     │  ├─ layouts/
│     │  ├─ pages/
│     │  ├─ demos/
│     │  ├─ playground/
│     │  └─ main.ts
│     ├─ package.json
│     └─ vite.config.ts
└─ ...
```

说明：

- `packages/theme` 是设计 token 与主题样式包。
- `packages/water-drop` 是组件库，不直接依赖业务代码。
- `apps/docs` 是官方文档站，使用 `water-drop` 与 `theme` 构建。
- 组件库将 Vue 声明为 `peerDependency`，避免重复打包。

### 4.2 依赖关系

```text
theme
  ↑
water-drop
  ↑
docs
```

文档站不仅展示组件，还通过 `workspace:*` 直接依赖源码，做到组件库修改后文档站实时预览。

### 4.3 组件库构建产物

使用 Vite Library Mode 构建：

- ES Module
- CommonJS
- 独立 CSS 文件
- `.d.ts` 类型声明

`package.json` 通过 `exports` 精确暴露：

- 完整引入入口
- 组件单独引入入口
- 主题 CSS 入口
- 类型入口

目标：

- 支持完整引入 `app.use(WaterDropUI)`。
- 支持按需引入单个组件，例如 `import { WtButton } from '@water-drop/components/button'`。
- CSS 可按需加载，也可一次加载全量主题。

## 5. 水滴视觉语言

### 5.1 设计 token

参考 `waterCompenent.html` 中已有的核心变量，扩展为完整 token 体系：

```scss
--wt-bg: #eceff3;
--wt-surface: #f2f5f8;
--wt-surface-strong: #e6ebf0;

--wt-text: #222222;
--wt-text-secondary: #666666;
--wt-text-placeholder: #999999;

--wt-primary: #3d7eff;
--wt-success: #2e7d32;
--wt-warning: #c47a00;
--wt-danger: #c62828;
--wt-info: #5c6bc0;

--wt-shadow-dark-alpha: 0.04;
--wt-shadow-dark-alpha-strong: 0.06;
--wt-highlight: rgba(255, 255, 255, 1);
--wt-highlight-small: rgba(255, 255, 255, 0.85);
--wt-shadow-dark: rgba(0, 0, 0, 0.18);
--wt-shadow-deeper: rgba(0, 0, 0, 0.28);
--wt-shadow-light: rgba(255, 255, 255, 0.06);

--wt-radius-xs: 18px 14px 20px 16px / 16px 18px 14px 20px;
--wt-radius-sm: 24px 16px 26px 18px / 18px 24px 16px 26px;
--wt-radius-md: 28px 18px 30px 22px / 22px 28px 20px 30px;
--wt-radius-lg: 36px 22px 38px 26px / 26px 36px 22px 38px;

--wt-motion-normal: 3.5s;
--wt-motion-slow: 5.5s;

--wt-highlight-safe-margin: 8px;
--wt-highlight-main-factor: 0.18;
--wt-highlight-main-min: 5px;
--wt-highlight-main-max: 14px;
--wt-highlight-small-factor: 0.09;
--wt-highlight-small-min: 3px;
--wt-highlight-small-max: 8px;
```

token 覆盖：

- 颜色
- 字体与排版
- 间距
- 圆角
- 阴影
- 动效时长与曲线
- 高光尺寸
- z-index 层级
- 断点

### 5.2 水滴形状

水滴形状不是纯椭圆，而是使用不规则的 `border-radius`：

```scss
// 基准水滴形状
--wt-radius-md: 28px 18px 30px 22px / 22px 28px 20px 30px;

// hover 时形状轻微变化
--wt-radius-md-hover: 18px 30px 22px 28px / 30px 22px 28px 18px;
```

不同组件根据自身尺寸映射不同圆角层级，但整体视觉仍属于同一水滴系统。

### 5.3 双层高光

每个可交互组件使用两个伪元素模拟高光：

- 主高光：面积较大，不规则水滴形。
- 次高光：面积较小，位置更靠右下。

高光尺寸使用 `clamp()` 和 `max()` 限制在组件内部，避免溢出：

```scss
.wt-button::after {
  width: clamp(
    var(--wt-highlight-main-min),
    calc(var(--wt-highlight-main-factor) * 100%),
    var(--wt-highlight-main-max)
  );
  height: var(--wt-highlight-size);
  top: max(var(--wt-highlight-safe-margin), 4px);
  right: max(var(--wt-highlight-safe-margin), 4px);
  border-radius: 58% 42% 55% 45% / 48% 38% 62% 52%;
  background: var(--wt-highlight);
}
```

这与参考文件中的高光约束策略保持一致，后续扩展为通用 mixin。

### 5.4 阴影层级

水滴质感来自内外阴影组合：

```scss
box-shadow:
  inset 3px 4px 8px rgba(0, 0, 0, 0.15),
  inset -2px -2px 5px rgba(255, 255, 255, 0.05),
  3px 4px 12px rgba(0, 0, 0, 0.1),
  0 1px 4px rgba(0, 0, 0, 0.06);
```

阴影按状态分层：

- default
- hover
- active
- focus-visible
- disabled

### 5.5 液体流动动画

核心动画只作用于 `transform`、`opacity`、`border-radius`，尽量不触发布局：

```scss
@keyframes wt-liquid-flow {
  0%   { transform: scale(1, 1) rotate(0deg); }
  20%  { transform: scale(1.015, 0.985) rotate(0.15deg); }
  40%  { transform: scale(0.985, 1.015) rotate(-0.15deg); }
  60%  { transform: scale(1.01, 0.99) rotate(0.1deg); }
  80%  { transform: scale(0.99, 1.01) rotate(-0.1deg); }
  100% { transform: scale(1, 1) rotate(0deg); }
}
```

保留参考文件中的：

- `liquidFlow`
- `liquidFlowSlow`
- `highlightFloat`
- `highlightFloatSmall`

同时提供：

- `prefers-reduced-motion` 支持
- 随机动画相位，避免大量组件同步动画
- 离屏暂停动画

## 6. 主题与样式替换机制

### 6.1 样式分层

```text
1. reset.css
2. tokens.css
3. theme-light.css 或 theme-dark.css
4. components.css
5. 用户自定义 theme.css
```

加载顺序后到前，后者可覆盖前者。

### 6.2 CSS 自定义属性

所有组件样式引用 `var(--wt-*)`，不在组件内部硬编码具体颜色。

Sass 变量与 map 只用于源码组织，最终编译为 CSS 自定义属性。

### 6.3 暗黑模式

主题通过根节点属性切换：

```css
:root[data-theme='light'] {
  color-scheme: light;
}

:root[data-theme='dark'] {
  color-scheme: dark;
}
```

组件库同时支持：

- `document.documentElement.dataset.theme`
- `WtConfigProvider` 局部主题
- 跟随系统 `prefers-color-scheme`

### 6.4 一键换肤

用户只需在组件样式之后引入自定义主题文件：

```ts
import '@water-drop/theme/dist/base.css'
import '@water-drop/theme/dist/light.css'
import './my-theme.css'
```

`my-theme.css` 只需覆盖必要的 token：

```css
:root {
  --wt-primary: #00bcd4;
  --wt-radius-md: 40% 60% 70% 30% / 39% 49% 51% 61%;
  --wt-motion-normal: 4s;
}
```

因为组件运行时只读取 CSS 变量，替换该文件即可完成风格切换。

## 7. 组件 API 规范

### 7.1 命名

```text
组件文件：Button.vue
组件名称：WtButton
标签名称：<wt-button />
类型名称：ButtonProps
```

### 7.2 Props

通用 props：

- `size`: `small | medium | large`
- `type`: `default | primary | success | warning | danger | info`
- `disabled`
- `loading`
- `customClass`
- `customStyle`

Props 使用 camelCase，在模板中同样使用 camelCase。

### 7.3 Events

```text
change
input
update:modelValue
visible-change
select
clear
```

事件使用 kebab-case。

### 7.4 v-model

对表单类组件统一支持：

```vue
<wt-input v-model="value" />
<wt-switch v-model="checked" />
<wt-select v-model="selected" />
```

### 7.5 Slots

统一支持：

- `default`
- `prefix`
- `suffix`
- `prepend`
- `append`
- `icon`
- `label`
- `extra`
- `empty`

### 7.6 Expose

仅在确需命令式调用时暴露方法，例如：

- `focus`
- `blur`
- `clear`
- `validate`
- `reset`

### 7.7 可访问性

- 交互组件提供 `role` 或原生语义。
- 支持 `:focus-visible`。
- 键盘可操作。
- 图标装饰性元素设置 `aria-hidden`。
- 状态变化通过 `aria-checked`、`aria-disabled`、`aria-expanded` 等表达。
- 尊重 `prefers-reduced-motion`。

## 8. 组件清单

组件按功能分类，覆盖 Web 站点的常见需求。

### 8.1 基础组件

| 组件 | 标签 | 说明 |
| --- | --- | --- |
| Button | `wt-button` | 水滴按钮，支持类型、尺寸、loading、禁用、图标 |
| Icon | `wt-icon` | 统一图标入口，支持 SVG 与外部图标库 |
| Link | `wt-link` | 链接 |
| Text | `wt-text` | 文本排版 |
| Divider | `wt-divider` | 分割线 |
| Badge | `wt-badge` | 徽标 |
| Tag | `wt-tag` | 水滴标签，支持关闭与状态色 |
| Avatar | `wt-avatar` | 头像 |

### 8.2 布局组件

| 组件 | 标签 | 说明 |
| --- | --- | --- |
| Layout | `wt-layout` | 页面整体布局 |
| Header | `wt-header` | 顶部区域 |
| Aside | `wt-aside` | 侧边区域 |
| Main | `wt-main` | 主内容区域 |
| Footer | `wt-footer` | 底部区域 |
| Row | `wt-row` | 栅格行 |
| Col | `wt-col` | 栅格列 |
| Space | `wt-space` | 间距容器 |
| Scrollbar | `wt-scrollbar` | 自定义滚动条 |
| Splitter | `wt-splitter` | 可拖动分割面板 |

### 8.3 导航组件

| 组件 | 标签 | 说明 |
| --- | --- | --- |
| Menu | `wt-menu` | 导航菜单 |
| MenuItem | `wt-menu-item` | 菜单项 |
| SubMenu | `wt-sub-menu` | 子菜单 |
| Tabs | `wt-tabs` | 标签页 |
| TabPane | `wt-tab-pane` | 标签页面板 |
| Breadcrumb | `wt-breadcrumb` | 面包屑 |
| Dropdown | `wt-dropdown` | 下拉菜单 |
| Steps | `wt-steps` | 步骤条 |
| Step | `wt-step` | 步骤项 |
| PageHeader | `wt-page-header` | 页头 |
| Anchor | `wt-anchor` | 锚点 |
| Affix | `wt-affix` | 固定定位 |
| BackTop | `wt-back-top` | 返回顶部 |

### 8.4 表单组件

| 组件 | 标签 | 说明 |
| --- | --- | --- |
| Form | `wt-form` | 表单容器，支持校验 |
| FormItem | `wt-form-item` | 表单项 |
| Input | `wt-input` | 输入框 |
| Textarea | `wt-textarea` | 多行输入 |
| InputNumber | `wt-input-number` | 数字输入 |
| Autocomplete | `wt-autocomplete` | 自动补全 |
| Select | `wt-select` | 下拉选择 |
| Option | `wt-option` | 选项 |
| Cascader | `wt-cascader` | 级联选择 |
| Checkbox | `wt-checkbox` | 复选框 |
| Radio | `wt-radio` | 单选框 |
| Switch | `wt-switch` | 水滴开关 |
| Slider | `wt-slider` | 滑块 |
| DatePicker | `wt-date-picker` | 日期选择 |
| TimePicker | `wt-time-picker` | 时间选择 |
| Upload | `wt-upload` | 上传 |
| Rate | `wt-rate` | 评分 |
| ColorPicker | `wt-color-picker` | 颜色选择 |
| Transfer | `wt-transfer` | 穿梭框 |

### 8.5 数据展示组件

| 组件 | 标签 | 说明 |
| --- | --- | --- |
| Table | `wt-table` | 表格 |
| Pagination | `wt-pagination` | 分页 |
| Tree | `wt-tree` | 树形控件 |
| Card | `wt-card` | 卡片 |
| Carousel | `wt-carousel` | 走马灯 |
| Collapse | `wt-collapse` | 折叠面板 |
| Timeline | `wt-timeline` | 时间线 |
| Descriptions | `wt-descriptions` | 描述列表 |
| Empty | `wt-empty` | 空状态 |
| Result | `wt-result` | 结果页 |
| Statistic | `wt-statistic` | 统计数值 |
| Calendar | `wt-calendar` | 日历 |
| Skeleton | `wt-skeleton` | 骨架屏 |
| Progress | `wt-progress` | 进度条 |
| Image | `wt-image` | 图片 |

### 8.6 反馈组件

| 组件 | 标签 | 说明 |
| --- | --- | --- |
| Alert | `wt-alert` | 警告提示 |
| Loading | `wt-loading` | 加载状态 |
| Message | `wt-message` | 全局消息 |
| MessageBox | `wt-message-box` | 消息弹框 |
| Notification | `wt-notification` | 通知 |
| Dialog | `wt-dialog` | 对话框 |
| Drawer | `wt-drawer` | 抽屉 |
| Tooltip | `wt-tooltip` | 文字提示 |
| Popover | `wt-popover` | 气泡卡片 |
| Popconfirm | `wt-popconfirm` | 气泡确认 |

### 8.7 高级与配置组件

| 组件 | 标签 | 说明 |
| --- | --- | --- |
| ConfigProvider | `wt-config-provider` | 全局配置 |
| VirtualList | `wt-virtual-list` | 虚拟列表 |
| Watermark | `wt-watermark` | 水印 |
| Tour | `wt-tour` | 分步引导 |
| ImageViewer | `wt-image-viewer` | 图片预览 |

## 9. 文档站设计

### 9.1 信息架构

文档站分为两个主要区域：

1. 首页：组件库介绍、视觉特色、安装方式、快速开始、进入组件库入口。
2. 组件库：左侧组件目录，右侧组件详情。

整体参考 Element UI 的经典布局，但视觉使用水滴主题。

### 9.2 首页

首页包含：

- 顶部导航：Logo、首页、组件、GitHub、主题切换。
- Hero：水滴视觉主视觉和核心特点。
- 特性区：流动性、可组合、主题化、响应式、暗黑模式、高性能。
- 快速开始：安装命令、完整引入、按需引入。
- CTA：进入组件库。

### 9.3 组件库页面

布局：

```text
┌────────────────────────────────────────────┐
│ 顶部导航                                      │
├──────────┬─────────────────────────────────┤
│ 左侧目录  │ 组件标题                          │
│          │ 组件演示                          │
│ 基础      │ 代码预览与复制                    │
│ 布局      │ CSS 参数调节滑块                   │
│ 导航      │ Props / Events / Slots 文档       │
│ 表单      │                                  │
│ 数据展示  │                                  │
│ 反馈      │                                  │
│ 高级      │                                  │
└──────────┴─────────────────────────────────┘
```

左侧目录分类与组件清单一致，点击后通过路由切换到对应组件页面。

### 9.4 组件演示

每个组件页面包含：

- 可交互演示
- 多状态示例
- 代码查看
- 代码复制
- API 文档
- 主题与 CSS 参数调节

### 9.5 代码查看与复制

- 示例代码使用真实可运行源码。
- 使用代码高亮组件。
- 提供“复制代码”按钮。
- 可选提供在独立 Playground 中打开。

### 9.6 CSS 参数滑块

滑块用于动态调节水滴核心视觉参数：

- 圆角比例
- 高光大小
- 高光透明度
- 内阴影强度
- 外阴影强度
- 动画速度
- 颜色透明度
- 组件尺寸

滑块通过修改当前示例容器的 CSS 变量实现实时预览，不重新渲染组件树。

### 9.7 响应式与主题

- 桌面端使用固定侧栏。
- 移动端侧栏转为抽屉。
- 示例区在窄屏下垂直排列。
- 顶部提供明暗主题切换。
- 文档站自身使用组件库构建，作为真实使用场景验证组件质量。

## 10. 性能策略

### 10.1 动画性能

- 动画只使用 `transform`、`opacity`、`border-radius`。
- 高光使用伪元素，避免额外 DOM。
- 大量组件使用随机相位，避免同步动画造成视觉和性能压力。
- 使用 IntersectionObserver 在离屏时暂停动画。
- 使用 `prefers-reduced-motion` 自动关闭动画。
- 不在高频交互中创建/删除大量 DOM。

### 10.2 大数据组件

- Table、Select、Tree、Transfer、VirtualList 使用虚拟滚动。
- 大数据列表使用 `shallowRef` 或 `markRaw`，避免不必要的深度响应式。
- 分页、搜索、过滤通过事件委托和请求级缓存处理。
- 列表项复用 DOM，减少重排。

### 10.3 文档站性能

- 组件页面按路由懒加载。
- 示例组件按需加载。
- 代码高亮按需加载。
- 长页面使用 `content-visibility: auto`。
- 构建时拆分组件库、文档站、第三方依赖。

### 10.4 打包性能

- Vue 作为 peer dependency，不重复打包。
- 组件库支持 tree-shaking。
- 按需引入不拉取未使用组件。
- CSS 拆分为基础 token、主题、组件样式。
- 使用 Vite 生产构建压缩产物。

## 11. 响应式设计

断点 token：

```text
xs: < 576px
sm: >= 576px
md: >= 768px
lg: >= 992px
xl: >= 1200px
xxl: >= 1600px
```

策略：

- 栅格使用 24 列，支持响应式断点。
- 表单 label 在移动端自动改为顶部布局。
- Dialog、Drawer 在小屏下自适应宽度。
- Table 在小屏下支持横向滚动或关键列展示。
- 文档站左侧导航在移动端转为抽屉。
- 水滴高光尺寸随组件尺寸变化，通过 `clamp()` 自适应。

## 12. 暗黑模式

暗黑模式不是简单反转颜色，而是独立的低饱和水滴色板：

- 背景使用深蓝灰。
- 文字保持足够对比度。
- 阴影在暗色下加强边界感。
- 高光降低透明度，避免过曝。
- 交互状态使用不同明度表达。
- `color-scheme` 同步原生控件。

## 13. 组件文件规范

每个组件目录：

```text
button/
├─ Button.vue
├─ props.ts
├─ index.ts
├─ style.scss
├─ README.md
└─ __tests__/
   └─ button.spec.ts
```

组件 SFC 采用：

- `<script setup lang="ts">`
- `defineOptions({ name: 'WtButton' })`
- `withDefaults(defineProps<ButtonProps>(), defaults)`
- `defineEmits<ButtonEmits>()`
- 明确导出 `ButtonProps`

## 14. 质量保障

### 14.1 静态检查

- `eslint`
- `vue-tsc`
- `stylelint`
- `prettier --check`

### 14.2 单元测试

- 每个组件覆盖 props、events、v-model、slots、键盘交互。
- 使用 Vitest + Vue Test Utils。

### 14.3 端到端测试

- 文档站关键流程使用 Playwright。
- 覆盖主题切换、组件导航、代码复制、滑块调节。

### 14.4 视觉回归

- 通过 Playwright 截图对比组件关键状态。
- 覆盖 light、dark、移动端。

## 15. 开发顺序

### P0：基础设施与核心视觉

- pnpm workspace、Vite、TS、Sass、lint 体系
- theme token 与明暗主题
- Button、Icon、Link、Text
- Layout、Row、Col、Space、Divider
- ConfigProvider
- 文档站骨架、路由、首页、组件库布局
- 代码复制与 CSS 滑块基础能力

### P1：表单与通用反馈

- Input、Textarea、InputNumber、Select、Radio、Checkbox、Switch、Slider
- Form、FormItem
- Tag、Badge、Avatar
- Alert、Message、Notification、Dialog、Tooltip、Popover、Loading

### P2：导航与数据展示

- Menu、Tabs、Dropdown、Breadcrumb、Steps、Pagination
- Table、Card、Collapse、Tree、Timeline、Empty、Result、Skeleton

### P3：复杂与高级组件

- DatePicker、TimePicker、Cascader、Transfer、Upload、Rate、ColorPicker
- Carousel、Calendar、Descriptions、Statistic、Image、Scrollbar
- VirtualList、Watermark、Tour、ImageViewer、Splitter

## 16. 验收标准

- 组件清单中的组件均可正常展示与交互。
- 组件库可独立构建为 ESM、CJS、类型声明和 CSS。
- 文档站完全使用该组件库构建。
- 支持明暗主题切换。
- 支持替换单个 CSS 文件进行换肤。
- 支持响应式布局。
- 每个组件页面提供可运行示例、代码复制和 CSS 参数调节。
- 大量组件同时渲染时无明显卡顿。
- lint、typecheck、test、build 全部通过。
- 符合阿里巴巴前端规约与可访问性基本要求。
