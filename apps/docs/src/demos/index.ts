import { defineAsyncComponent, type Component } from 'vue'

export interface DemoItem {
  title: string
  description: string
  code: string
  component: Component
}

const ButtonDemo = defineAsyncComponent(() => import('./ButtonDemo.vue'))
const IconDemo = defineAsyncComponent(() => import('./IconDemo.vue'))
const LinkDemo = defineAsyncComponent(() => import('./LinkDemo.vue'))
const TextDemo = defineAsyncComponent(() => import('./TextDemo.vue'))
const DividerDemo = defineAsyncComponent(() => import('./DividerDemo.vue'))
const SpaceDemo = defineAsyncComponent(() => import('./SpaceDemo.vue'))
const LayoutDemo = defineAsyncComponent(() => import('./LayoutDemo.vue'))
const GridDemo = defineAsyncComponent(() => import('./GridDemo.vue'))
const TagDemo = defineAsyncComponent(() => import('./TagDemo.vue'))
const SwitchDemo = defineAsyncComponent(() => import('./SwitchDemo.vue'))
const InputDemo = defineAsyncComponent(() => import('./InputDemo.vue'))
const SliderDemo = defineAsyncComponent(() => import('./SliderDemo.vue'))
const ConfigProviderDemo = defineAsyncComponent(() => import('./ConfigProviderDemo.vue'))
const TableDemo = defineAsyncComponent(() => import('./TableDemo.vue'))

export const componentDemos: Record<string, DemoItem[]> = {
  button: [
    {
      title: '基础用法',
      description: '通过 type 和 size 控制按钮语义与尺寸。',
      component: ButtonDemo,
      code: `<wt-button>默认按钮</wt-button>
<wt-button type="primary">主要按钮</wt-button>
<wt-button type="success">成功按钮</wt-button>
<wt-button type="warning">警告按钮</wt-button>
<wt-button type="danger">危险按钮</wt-button>
<wt-button type="info">信息按钮</wt-button>`
    }
  ],
  icon: [
    {
      title: '图标集合',
      description: '使用内置 SVG 图标，可通过 size 与 color 调整。',
      component: IconDemo,
      code: `<wt-icon name="search" :size="24" />
<wt-icon name="github" :size="24" />`
    }
  ],
  link: [
    {
      title: '链接状态',
      description: '链接支持下划线、禁用和新窗口打开。',
      component: LinkDemo,
      code: `<wt-link href="#">默认链接</wt-link>
<wt-link href="#" :underline="false">无下划线链接</wt-link>
<wt-link href="#" disabled>禁用链接</wt-link>`
    }
  ],
  text: [
    {
      title: '文本排版',
      description: '统一文本颜色、尺寸与强调层级。',
      component: TextDemo,
      code: `<wt-text size="large" strong>Water UI 大标题</wt-text>
<wt-text size="medium" type="secondary">次要文本</wt-text>
<wt-text type="danger">危险文本</wt-text>`
    }
  ],
  divider: [
    {
      title: '分割线',
      description: '支持水平、垂直、虚线和内容位置。',
      component: DividerDemo,
      code: `<wt-divider />
<wt-divider content-position="left">左侧文字</wt-divider>
<wt-divider dashed content-position="right">虚线右侧</wt-divider>`
    }
  ],
  space: [
    {
      title: '间距容器',
      description: '快速排列多个元素，支持横向与纵向。',
      component: SpaceDemo,
      code: `<wt-space :size="8">
  <wt-button>按钮 1</wt-button>
  <wt-button>按钮 2</wt-button>
</wt-space>`
    }
  ],
  layout: [
    {
      title: '经典布局',
      description: 'Header、Aside、Main、Footer 可自由组合。',
      component: LayoutDemo,
      code: `<wt-layout>
  <wt-header>Header</wt-header>
  <wt-layout>
    <wt-aside width="120px">Aside</wt-aside>
    <wt-main>Main</wt-main>
  </wt-layout>
  <wt-footer>Footer</wt-footer>
</wt-layout>`
    }
  ],
  grid: [
    {
      title: '24 栅格',
      description: '使用 Row 与 Col 构建响应式栅格。',
      component: GridDemo,
      code: `<wt-row :gutter="12">
  <wt-col :span="12">12</wt-col>
  <wt-col :span="12">12</wt-col>
</wt-row>`
    }
  ],
  tag: [
    {
      title: '水滴标签',
      description: '支持状态色、关闭与圆形样式。',
      component: TagDemo,
      code: `<wt-tag>设计</wt-tag>
<wt-tag type="primary" closable>灵感</wt-tag>
<wt-tag type="success">创意</wt-tag>`
    }
  ],
  switch: [
    {
      title: '水滴开关',
      description: '使用 v-model 绑定布尔值。',
      component: SwitchDemo,
      code: `<wt-switch v-model="enabled" active-text="开启" inactive-text="关闭" />`
    }
  ],
  slider: [
    {
      title: '水滴滑块',
      description: '支持范围、步长与禁用状态。',
      component: SliderDemo,
      code: `<wt-slider v-model="value" show-value />
<wt-slider v-model="step" :min="0" :max="100" :step="10" />`
    }
  ],
  table: [
    {
      title: '水滴表格',
      description: '使用 columns 与 data 快速生成参数说明或数据表格。',
      component: TableDemo,
      code: `<wt-table :columns="columns" :data="rows" striped />`
    }
  ],
  input: [
    {
      title: '输入框',
      description: '支持前后缀、清空与禁用状态。',
      component: InputDemo,
      code: `<wt-input v-model="keyword" placeholder="请输入关键词" clearable>
  <template #prefix>
    <wt-icon name="search" :size="18" />
  </template>
</wt-input>`
    }
  ],
  'config-provider': [
    {
      title: '全局配置',
      description: '为后代组件统一提供尺寸和主题配置。',
      component: ConfigProviderDemo,
      code: `<wt-config-provider size="large">
  <wt-button type="primary">Large 按钮</wt-button>
  <wt-switch active-text="可用开关" />
</wt-config-provider>`
    }
  ]
}
