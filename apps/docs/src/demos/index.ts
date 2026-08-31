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
const FormDemo = defineAsyncComponent(() => import('./FormDemo.vue'))
const ConfigProviderDemo = defineAsyncComponent(() => import('./ConfigProviderDemo.vue'))
const TableDemo = defineAsyncComponent(() => import('./TableDemo.vue'))
const TextareaDemo = defineAsyncComponent(() => import('./TextareaDemo.vue'))
const InputNumberDemo = defineAsyncComponent(() => import('./InputNumberDemo.vue'))
const AutocompleteDemo = defineAsyncComponent(() => import('./AutocompleteDemo.vue'))
const SelectDemo = defineAsyncComponent(() => import('./SelectDemo.vue'))
const CascaderDemo = defineAsyncComponent(() => import('./CascaderDemo.vue'))
const CheckboxDemo = defineAsyncComponent(() => import('./CheckboxDemo.vue'))
const RadioDemo = defineAsyncComponent(() => import('./RadioDemo.vue'))
const DatePickerDemo = defineAsyncComponent(() => import('./DatePickerDemo.vue'))
const TimePickerDemo = defineAsyncComponent(() => import('./TimePickerDemo.vue'))
const UploadDemo = defineAsyncComponent(() => import('./UploadDemo.vue'))
const RateDemo = defineAsyncComponent(() => import('./RateDemo.vue'))
const ColorPickerDemo = defineAsyncComponent(() => import('./ColorPickerDemo.vue'))
const TransferDemo = defineAsyncComponent(() => import('./TransferDemo.vue'))
const AlertDemo = defineAsyncComponent(() => import('./AlertDemo.vue'))
const LoadingDemo = defineAsyncComponent(() => import('./LoadingDemo.vue'))
const MessageDemo = defineAsyncComponent(() => import('./MessageDemo.vue'))
const MessageBoxDemo = defineAsyncComponent(() => import('./MessageBoxDemo.vue'))
const NotificationDemo = defineAsyncComponent(() => import('./NotificationDemo.vue'))
const DialogDemo = defineAsyncComponent(() => import('./DialogDemo.vue'))
const DrawerDemo = defineAsyncComponent(() => import('./DrawerDemo.vue'))
const TooltipDemo = defineAsyncComponent(() => import('./TooltipDemo.vue'))
const PopoverDemo = defineAsyncComponent(() => import('./PopoverDemo.vue'))
const PopconfirmDemo = defineAsyncComponent(() => import('./PopconfirmDemo.vue'))
const MenuDemo = defineAsyncComponent(() => import('./MenuDemo.vue'))
const TabsDemo = defineAsyncComponent(() => import('./TabsDemo.vue'))
const BreadcrumbDemo = defineAsyncComponent(() => import('./BreadcrumbDemo.vue'))
const DropdownDemo = defineAsyncComponent(() => import('./DropdownDemo.vue'))
const StepsDemo = defineAsyncComponent(() => import('./StepsDemo.vue'))
const PageHeaderDemo = defineAsyncComponent(() => import('./PageHeaderDemo.vue'))
const AnchorDemo = defineAsyncComponent(() => import('./AnchorDemo.vue'))
const AffixDemo = defineAsyncComponent(() => import('./AffixDemo.vue'))
const BackTopDemo = defineAsyncComponent(() => import('./BackTopDemo.vue'))
const BadgeDemo = defineAsyncComponent(() => import('./BadgeDemo.vue'))
const AvatarDemo = defineAsyncComponent(() => import('./AvatarDemo.vue'))
const ScrollbarDemo = defineAsyncComponent(() => import('./ScrollbarDemo.vue'))
const SplitterDemo = defineAsyncComponent(() => import('./SplitterDemo.vue'))
const VirtualListDemo = defineAsyncComponent(() => import('./VirtualListDemo.vue'))
const WatermarkDemo = defineAsyncComponent(() => import('./WatermarkDemo.vue'))
const TourDemo = defineAsyncComponent(() => import('./TourDemo.vue'))
const ImageViewerDemo = defineAsyncComponent(() => import('./ImageViewerDemo.vue'))
const PaginationDemo = defineAsyncComponent(() => import('./PaginationDemo.vue'))
const TreeDemo = defineAsyncComponent(() => import('./TreeDemo.vue'))
const CardDemo = defineAsyncComponent(() => import('./CardDemo.vue'))
const CarouselDemo = defineAsyncComponent(() => import('./CarouselDemo.vue'))
const CollapseDemo = defineAsyncComponent(() => import('./CollapseDemo.vue'))
const TimelineDemo = defineAsyncComponent(() => import('./TimelineDemo.vue'))
const DescriptionsDemo = defineAsyncComponent(() => import('./DescriptionsDemo.vue'))
const EmptyDemo = defineAsyncComponent(() => import('./EmptyDemo.vue'))
const ResultDemo = defineAsyncComponent(() => import('./ResultDemo.vue'))
const StatisticDemo = defineAsyncComponent(() => import('./StatisticDemo.vue'))
const CalendarDemo = defineAsyncComponent(() => import('./CalendarDemo.vue'))
const SkeletonDemo = defineAsyncComponent(() => import('./SkeletonDemo.vue'))
const ProgressDemo = defineAsyncComponent(() => import('./ProgressDemo.vue'))
const ImageDemo = defineAsyncComponent(() => import('./ImageDemo.vue'))

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
  form: [
    {
      title: '表单与表单项',
      description: 'Form 使用 v-model 维护数据，FormItem 提供校验与错误提示。',
      component: FormDemo,
      code: `<wt-form v-model="model" :rules="rules" label-width="90px">
  <wt-form-item label="姓名" prop="name" required>
    <wt-input v-model="model.name" />
  </wt-form-item>
</wt-form>`
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
  textarea: [
    {
      title: '多行文本',
      description: '支持 v-model、字数统计和尺寸。',
      component: TextareaDemo,
      code: `<wt-textarea v-model="value" rows="4" placeholder="请输入内容" show-word-limit />`
    }
  ],
  'input-number': [
    {
      title: '数字输入',
      description: '支持范围、步长和增减控件。',
      component: InputNumberDemo,
      code: `<wt-input-number v-model="value" :min="0" :max="100" :step="2" />`
    }
  ],
  autocomplete: [
    {
      title: '自动补全',
      description: '输入时根据 suggestions 过滤候选值。',
      component: AutocompleteDemo,
      code: `<wt-autocomplete v-model="value" :suggestions="suggestions" clearable />`
    }
  ],
  select: [
    {
      title: '下拉选择',
      description: '通过 options 或 Option 子组件提供选项。',
      component: SelectDemo,
      code: `<wt-select v-model="value" :options="options" clearable />`
    }
  ],
  cascader: [
    {
      title: '级联选择',
      description: '选择嵌套选项并输出完整路径。',
      component: CascaderDemo,
      code: `<wt-cascader v-model="value" :options="options" clearable />`
    }
  ],
  checkbox: [
    {
      title: '复选框',
      description: '支持选中、半选和禁用状态。',
      component: CheckboxDemo,
      code: `<wt-checkbox v-model="checked">已选中</wt-checkbox>`
    }
  ],
  radio: [
    {
      title: '单选框',
      description: '通过 v-model 与 value 配合使用。',
      component: RadioDemo,
      code: `<wt-radio v-model="value" value="left">左对齐</wt-radio>`
    }
  ],
  'date-picker': [
    {
      title: '日期选择',
      description: '基于原生 date 输入的水滴风格选择器。',
      component: DatePickerDemo,
      code: `<wt-date-picker v-model="date" clearable />`
    }
  ],
  'time-picker': [
    {
      title: '时间选择',
      description: '支持清空和禁用状态。',
      component: TimePickerDemo,
      code: `<wt-time-picker v-model="time" clearable />`
    }
  ],
  upload: [
    {
      title: '文件上传',
      description: '选择文件后维护可移除的文件列表。',
      component: UploadDemo,
      code: `<wt-upload v-model="files" multiple accept=".png,.jpg,.pdf" />`
    }
  ],
  rate: [
    {
      title: '评分',
      description: '支持整数与半星评分。',
      component: RateDemo,
      code: `<wt-rate v-model="rate" allow-half />`
    }
  ],
  'color-picker': [
    {
      title: '颜色选择',
      description: '颜色选择与 Hex 文本双向同步。',
      component: ColorPickerDemo,
      code: `<wt-color-picker v-model="color" />`
    }
  ],
  transfer: [
    {
      title: '穿梭框',
      description: '点击条目在左侧和右侧之间移动。',
      component: TransferDemo,
      code: `<wt-transfer v-model="selected" :data="data" />`
    }
  ],
  alert: [
    {
      title: '警告提示',
      description: '支持语义色、图标、描述与关闭操作。',
      component: AlertDemo,
      code: `<wt-alert type="primary" title="主要提示" description="这是一条提示信息" show-icon closable />`
    }
  ],
  loading: [
    {
      title: '水滴加载',
      description: '使用 v-model 控制加载状态，支持尺寸与文字。',
      component: LoadingDemo,
      code: `<wt-loading v-model="loading" size="medium" text="水滴加载中" />`
    }
  ],
  message: [
    {
      title: '全局消息',
      description: '通过 message 方法随时弹出顶部消息。',
      component: MessageDemo,
      code: `message.success('保存成功')`
    }
  ],
  'message-box': [
    {
      title: '消息弹框',
      description: '用于确认关键操作，支持自定义文案与语义色。',
      component: MessageBoxDemo,
      code: `<wt-message-box v-model="visible" title="删除确认" type="warning" />`
    }
  ],
  notification: [
    {
      title: '通知提醒',
      description: '通过 notification 方法在右上角展示通知。',
      component: NotificationDemo,
      code: `notification.success('操作成功', { title: '完成' })`
    }
  ],
  dialog: [
    {
      title: '对话框',
      description: '支持标题、内容与底部操作区，使用 v-model 控制。',
      component: DialogDemo,
      code: `<wt-dialog v-model="visible" title="水滴对话框" width="468px" />`
    }
  ],
  drawer: [
    {
      title: '抽屉',
      description: '支持四个方向的抽屉面板。',
      component: DrawerDemo,
      code: `<wt-drawer v-model="visible" placement="right" title="水滴抽屉" size="300px" />`
    }
  ],
  tooltip: [
    {
      title: '文字提示',
      description: '支持悬浮与点击触发，四种展示方向。',
      component: TooltipDemo,
      code: `<wt-tooltip content="顶部提示" placement="top"><wt-button>上</wt-button></wt-tooltip>`
    }
  ],
  popover: [
    {
      title: '气泡卡片',
      description: '承载更丰富的标题、内容与操作区域。',
      component: PopoverDemo,
      code: `<wt-popover title="水滴气泡" content="更多信息" placement="bottom" />`
    }
  ],
  popconfirm: [
    {
      title: '气泡确认',
      description: '在触发元素旁完成确认或取消。',
      component: PopconfirmDemo,
      code: `<wt-popconfirm title="删除确认" content="是否继续？"><wt-button>删除</wt-button></wt-popconfirm>`
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
  ],
  menu: [
    {
      title: '导航菜单',
      description: '支持垂直/水平模式、子菜单展开与禁用项。',
      component: MenuDemo,
      code: `<wt-menu v-model="active" mode="vertical">
  <wt-menu-item index="1">仪表盘</wt-menu-item>
  <wt-sub-menu index="3" title="组件库">
    <wt-menu-item index="3-1">Button</wt-menu-item>
    <wt-menu-item index="3-2">Tabs</wt-menu-item>
  </wt-sub-menu>
  <wt-menu-item index="4" disabled>设置（禁用）</wt-menu-item>
</wt-menu>`
    }
  ],
  tabs: [
    {
      title: '标签页',
      description: '通过 v-model 控制激活选项卡，支持禁用项。',
      component: TabsDemo,
      code: `<wt-tabs v-model="active">
  <wt-tab-pane label="水滴" name="tab-1">
    <p>水滴是 Water UI 的核心视觉语言。</p>
  </wt-tab-pane>
  <wt-tab-pane label="主题" name="tab-2">
    <p>支持亮色与暗黑双主题切换。</p>
  </wt-tab-pane>
</wt-tabs>`
    }
  ],
  breadcrumb: [
    {
      title: '面包屑',
      description: '展示当前页面在系统层级中的位置，支持自定义分隔符。',
      component: BreadcrumbDemo,
      code: `<wt-breadcrumb separator="/">
  <wt-breadcrumb-item to="/">首页</wt-breadcrumb-item>
  <wt-breadcrumb-item to="/components">组件</wt-breadcrumb-item>
  <wt-breadcrumb-item>导航组件</wt-breadcrumb-item>
</wt-breadcrumb>`
    }
  ],
  dropdown: [
    {
      title: '下拉菜单',
      description: '点击触发，选中项通过 command 事件回调。',
      component: DropdownDemo,
      code: `<wt-dropdown trigger="click" @command="handleCommand">
  <wt-button type="primary">点击展开 ▾</wt-button>
  <template #menu>
    <wt-dropdown-menu>
      <wt-dropdown-item command="edit">编辑</wt-dropdown-item>
      <wt-dropdown-item command="delete" divided>删除</wt-dropdown-item>
    </wt-dropdown-menu>
  </template>
</wt-dropdown>`
    }
  ],
  steps: [
    {
      title: '步骤条',
      description: '展示任务进度，支持横向与状态自定义。',
      component: StepsDemo,
      code: `<wt-steps v-model:active="active">
  <wt-step title="填写信息" description="基础资料" />
  <wt-step title="确认订单" description="核对明细" />
  <wt-step title="完成支付" description="等待到账" />
</wt-steps>`
    }
  ],
  'page-header': [
    {
      title: '页头',
      description: '展示面包屑、标题与操作区，支持返回按钮。',
      component: PageHeaderDemo,
      code: `<wt-page-header title="订单详情" subtitle="订单号 #WU-20260831" @back="goBack">
  <template #breadcrumb>
    <wt-breadcrumb separator="/">
      <wt-breadcrumb-item to="/">首页</wt-breadcrumb-item>
      <wt-breadcrumb-item>订单详情</wt-breadcrumb-item>
    </wt-breadcrumb>
  </template>
  <template #extra>
    <wt-button type="primary">导出</wt-button>
  </template>
</wt-page-header>`
    }
  ],
  anchor: [
    {
      title: '锚点导航',
      description: '滚动监听页面内标题，自动高亮当前锚点。',
      component: AnchorDemo,
      code: `<wt-anchor v-model="active" :offset="20">
  <wt-anchor-link href="anchor-1" title="简介" />
  <wt-anchor-link href="anchor-2" title="特性" />
  <wt-anchor-link href="anchor-3" title="用法" />
</wt-anchor>`
    }
  ],
  affix: [
    {
      title: '固定定位',
      description: '元素滚动到指定偏移后吸附在视口边缘。',
      component: AffixDemo,
      code: `<wt-affix :offset="16" @change="(v) => (fixed = v)">
  <wt-button type="primary">固定定位按钮</wt-button>
</wt-affix>`
    }
  ],
  'back-top': [
    {
      title: '返回顶部',
      description: '滚动超过阈值后显示，点击平滑回到顶部。',
      component: BackTopDemo,
      code: `<wt-back-top :visibility-height="120" />`
    }
  ],
  pagination: [
    {
      title: '基础分页',
      description: '展示总条数、页码与快速跳转，支持省略号折叠。',
      component: PaginationDemo,
      code: `<wt-pagination :current="current" :total="total" show-total show-jumper @change="handleChange" />`
    }
  ],
  tree: [
    {
      title: '树形控件',
      description: '展示层级数据，支持展开/折叠与选中高亮。',
      component: TreeDemo,
      code: `<wt-tree :data="data" default-expand-all show-line />`
    }
  ],
  card: [
    {
      title: '水滴卡片',
      description: '支持标题、内容、底部操作区与三种阴影模式。',
      component: CardDemo,
      code: `<wt-card title="水滴卡片" shadow="hover">
  <p>Water UI 卡片组件，支持标题、内容与底部操作区。</p>
  <template #footer>
    <wt-button type="primary" size="small">了解更多</wt-button>
  </template>
</wt-card>`
    }
  ],
  carousel: [
    {
      title: '走马灯',
      description: '自动播放、循环切换，支持指示器与箭头控制。',
      component: CarouselDemo,
      code: `<wt-carousel v-model="activeIndex" :interval="3500">
  <wt-carousel-item v-for="item in 3" :key="item">
    第 {{ item }} 张幻灯片
  </wt-carousel-item>
</wt-carousel>`
    }
  ],
  collapse: [
    {
      title: '折叠面板',
      description: '支持手风琴模式与多面板展开，使用 v-model 控制。',
      component: CollapseDemo,
      code: `<wt-collapse v-model="activeKey">
  <wt-collapse-item name="panel-1" title="什么是 Water UI？">
    <p>一套以水滴为视觉语言的 Vue 3 组件库。</p>
  </wt-collapse-item>
</wt-collapse>`
    }
  ],
  timeline: [
    {
      title: '时间线',
      description: '按时间顺序展示节点，节点颜色可自定义。',
      component: TimelineDemo,
      code: `<wt-timeline>
  <wt-timeline-item timestamp="2026-08-01" type="primary">项目初始化</wt-timeline-item>
  <wt-timeline-item timestamp="2026-08-31" type="success">组件落地</wt-timeline-item>
</wt-timeline>`
    }
  ],
  descriptions: [
    {
      title: '描述列表',
      description: '以网格方式展示键值信息，支持边框与列数控制。',
      component: DescriptionsDemo,
      code: `<wt-descriptions title="用户信息" :column="3" bordered>
  <wt-descriptions-item label="姓名">林小滴</wt-descriptions-item>
  <wt-descriptions-item label="城市">上海</wt-descriptions-item>
</wt-descriptions>`
    }
  ],
  empty: [
    {
      title: '空状态',
      description: '无数据时的占位提示，可自定义描述与操作。',
      component: EmptyDemo,
      code: `<wt-empty description="暂无数据">
  <wt-button type="primary">重新加载</wt-button>
</wt-empty>`
    }
  ],
  result: [
    {
      title: '结果页',
      description: '用于操作反馈，支持成功、失败与 404 等状态。',
      component: ResultDemo,
      code: `<wt-result status="success" title="支付成功" subtitle="订单金额将在 1-2 个工作日内原路退回">
  <wt-button type="primary">返回首页</wt-button>
</wt-result>`
    }
  ],
  statistic: [
    {
      title: '统计数值',
      description: '展示数据指标，支持千分位与前后缀。',
      component: StatisticDemo,
      code: `<wt-statistic title="今日活跃用户" :value="128936" group-separator suffix="人" />`
    }
  ],
  calendar: [
    {
      title: '日历',
      description: '支持月份切换、今天定位与日期选中。',
      component: CalendarDemo,
      code: `<wt-calendar />`
    }
  ],
  skeleton: [
    {
      title: '骨架屏',
      description: '加载状态占位，支持头像、标题与段落组合。',
      component: SkeletonDemo,
      code: `<wt-skeleton :loading="loading" avatar :title-rows="1" :paragraph-rows="3" animated>
  <wt-card title="加载完成">
    <p>这里是真实内容。</p>
  </wt-card>
</wt-skeleton>`
    }
  ],
  progress: [
    {
      title: '进度条',
      description: '支持线性与圆形两种形态，四种状态色。',
      component: ProgressDemo,
      code: `<wt-progress :percentage="72" status="success" show-text />`
    }
  ],
  image: [
    {
      title: '图片',
      description: '支持填充模式、圆角与点击预览。',
      component: ImageDemo,
      code: `<wt-image
  src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&q=80"
  alt="水滴风景"
  width="320px"
  height="200px"
  fit="cover"
  radius="medium"
  preview
/>`
    }
  ],
  badge: [
    {
      title: '徽标',
      description: '附着在内容右上角的计数或状态小圆点，支持数字、文本与纯圆点模式。',
      component: BadgeDemo,
      code: `<wt-badge :value="count" :max="99">
  <wt-button type="primary" size="small">消息</wt-button>
</wt-badge>
<wt-badge value="new" type="success">
  <wt-button size="small">动态</wt-button>
</wt-badge>
<wt-badge :value="100" type="warning">
  <wt-button size="small">超上限</wt-button>
</wt-badge>
<wt-badge dot>
  <wt-icon name="bell" size="22" />
</wt-badge>`
    }
  ],
  avatar: [
    {
      title: '头像',
      description: '图片或文字头像，支持圆形、方形与水滴液体形态。',
      component: AvatarDemo,
      code: `<wt-avatar src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=80" alt="Portrait" />
<wt-avatar shape="circle" fallback-text="W">W</wt-avatar>
<wt-avatar size="large" shape="square" fallback-text="滴">滴</wt-avatar>
<wt-avatar size="64">水</wt-avatar>`
    }
  ],
  scrollbar: [
    {
      title: '滚动条',
      description: '自定义滚动容器，原生滚动条隐藏，悬停显示水滴滑块，支持拖拽。',
      component: ScrollbarDemo,
      code: `<wt-scrollbar :height="160">
  <p v-for="i in 12" :key="i">第 {{ i }} 行：Water UI 滚动条组件</p>
</wt-scrollbar>`
    }
  ],
  splitter: [
    {
      title: '分割面板',
      description: '双面板布局，拖动中间分隔条实时调整尺寸，支持 v-model。',
      component: SplitterDemo,
      code: `<wt-splitter v-model="size" :min="120" :max="480" style="height: 220px">
  <template #first>
    <wt-card title="左面板" shadow="never">
      <p>拖动分隔条调整宽度，当前：{{ size }}px</p>
    </wt-card>
  </template>
  <template #second>
    <wt-card title="右面板" shadow="never">
      <p>右侧内容区自动占满剩余空间。</p>
    </wt-card>
  </template>
</wt-splitter>`
    }
  ],
  'virtual-list': [
    {
      title: '虚拟列表',
      description: '只渲染可视区条目，万级数据流畅滚动，支持插槽自定义条目。',
      component: VirtualListDemo,
      code: `<wt-virtual-list :data="data" :item-size="40" :height="260" :buffer="3">
  <template #default="{ item, index }">
    <div class="list-row">
      <span>{{ index + 1 }}</span>
      <span>{{ item }}</span>
    </div>
  </template>
</wt-virtual-list>`
    }
  ],
  watermark: [
    {
      title: '水印',
      description: 'SVG 平铺水印层，支持文字与图片，不拦截内容交互。',
      component: WatermarkDemo,
      code: `<wt-watermark text="Water UI\n机密文件" :font-size="15" :opacity="0.12">
  <div>受保护的内容区域</div>
</wt-watermark>`
    }
  ],
  tour: [
    {
      title: '分步引导',
      description: '基于目标元素定位的引导气泡，支持遮罩高亮、键盘操作与多步骤。',
      component: TourDemo,
      code: `<wt-tour v-model="visible" :steps="steps" :current="0" />

<wt-button type="primary" @click="visible = true">开始引导</wt-button>`
    }
  ],
  'image-viewer': [
    {
      title: '图片预览',
      description: '支持多图切换、缩放、旋转、键盘操作的全屏图片预览。',
      component: ImageViewerDemo,
      code: `<wt-image-viewer v-model="visible" :image-list="images" :current="0" />

<wt-button type="primary" @click="visible = true">打开图片预览</wt-button>`
    }
  ]
}
