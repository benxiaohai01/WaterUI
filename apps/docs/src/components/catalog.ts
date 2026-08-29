export interface CatalogItem {
  name: string
  label: string
  available: boolean
}

export interface CatalogCategory {
  title: string
  items: CatalogItem[]
}

export const componentCatalog: CatalogCategory[] = [
  {
    title: '基础组件',
    items: [
      { name: 'button', label: 'Button 按钮', available: true },
      { name: 'icon', label: 'Icon 图标', available: true },
      { name: 'link', label: 'Link 链接', available: true },
      { name: 'text', label: 'Text 文本', available: true },
      { name: 'divider', label: 'Divider 分割线', available: true },
      { name: 'badge', label: 'Badge 徽标', available: false },
      { name: 'tag', label: 'Tag 标签', available: true },
      { name: 'avatar', label: 'Avatar 头像', available: false }
    ]
  },
  {
    title: '布局组件',
    items: [
      { name: 'layout', label: 'Layout 布局', available: true },
      { name: 'grid', label: 'Grid 栅格', available: true },
      { name: 'space', label: 'Space 间距', available: true },
      { name: 'scrollbar', label: 'Scrollbar 滚动条', available: false },
      { name: 'splitter', label: 'Splitter 分割面板', available: false }
    ]
  },
  {
    title: '导航组件',
    items: [
      { name: 'menu', label: 'Menu 菜单', available: false },
      { name: 'tabs', label: 'Tabs 标签页', available: false },
      { name: 'breadcrumb', label: 'Breadcrumb 面包屑', available: false },
      { name: 'dropdown', label: 'Dropdown 下拉菜单', available: false },
      { name: 'steps', label: 'Steps 步骤条', available: false },
      { name: 'page-header', label: 'PageHeader 页头', available: false },
      { name: 'anchor', label: 'Anchor 锚点', available: false },
      { name: 'affix', label: 'Affix 固定定位', available: false },
      { name: 'back-top', label: 'BackTop 返回顶部', available: false }
    ]
  },
  {
    title: '表单组件',
    items: [
      { name: 'form', label: 'Form 表单', available: true },
      { name: 'input', label: 'Input 输入框', available: true },
      { name: 'textarea', label: 'Textarea 多行输入', available: false },
      { name: 'input-number', label: 'InputNumber 数字输入', available: false },
      { name: 'autocomplete', label: 'Autocomplete 自动补全', available: false },
      { name: 'select', label: 'Select 下拉选择', available: false },
      { name: 'cascader', label: 'Cascader 级联选择', available: false },
      { name: 'checkbox', label: 'Checkbox 复选框', available: false },
      { name: 'radio', label: 'Radio 单选框', available: false },
      { name: 'switch', label: 'Switch 开关', available: true },
      { name: 'slider', label: 'Slider 滑块', available: true },
      { name: 'date-picker', label: 'DatePicker 日期选择', available: false },
      { name: 'time-picker', label: 'TimePicker 时间选择', available: false },
      { name: 'upload', label: 'Upload 上传', available: false },
      { name: 'rate', label: 'Rate 评分', available: false },
      { name: 'color-picker', label: 'ColorPicker 颜色选择', available: false },
      { name: 'transfer', label: 'Transfer 穿梭框', available: false }
    ]
  },
  {
    title: '数据展示',
    items: [
      { name: 'table', label: 'Table 表格', available: true },
      { name: 'pagination', label: 'Pagination 分页', available: false },
      { name: 'tree', label: 'Tree 树形控件', available: false },
      { name: 'card', label: 'Card 卡片', available: false },
      { name: 'carousel', label: 'Carousel 走马灯', available: false },
      { name: 'collapse', label: 'Collapse 折叠面板', available: false },
      { name: 'timeline', label: 'Timeline 时间线', available: false },
      { name: 'descriptions', label: 'Descriptions 描述列表', available: false },
      { name: 'empty', label: 'Empty 空状态', available: false },
      { name: 'result', label: 'Result 结果页', available: false },
      { name: 'statistic', label: 'Statistic 统计数值', available: false },
      { name: 'calendar', label: 'Calendar 日历', available: false },
      { name: 'skeleton', label: 'Skeleton 骨架屏', available: false },
      { name: 'progress', label: 'Progress 进度条', available: false },
      { name: 'image', label: 'Image 图片', available: false }
    ]
  },
  {
    title: '反馈组件',
    items: [
      { name: 'alert', label: 'Alert 警告提示', available: false },
      { name: 'loading', label: 'Loading 加载', available: false },
      { name: 'message', label: 'Message 消息', available: false },
      { name: 'message-box', label: 'MessageBox 消息弹框', available: false },
      { name: 'notification', label: 'Notification 通知', available: false },
      { name: 'dialog', label: 'Dialog 对话框', available: false },
      { name: 'drawer', label: 'Drawer 抽屉', available: false },
      { name: 'tooltip', label: 'Tooltip 提示', available: false },
      { name: 'popover', label: 'Popover 气泡卡片', available: false },
      { name: 'popconfirm', label: 'Popconfirm 气泡确认', available: false }
    ]
  },
  {
    title: '高级与配置',
    items: [
      { name: 'config-provider', label: 'ConfigProvider 全局配置', available: true },
      { name: 'virtual-list', label: 'VirtualList 虚拟列表', available: false },
      { name: 'watermark', label: 'Watermark 水印', available: false },
      { name: 'tour', label: 'Tour 分步引导', available: false },
      { name: 'image-viewer', label: 'ImageViewer 图片预览', available: false }
    ]
  }
]

export const componentMeta = componentCatalog
  .flatMap((category) => category.items)
  .reduce<Record<string, { label: string; available: boolean }>>((acc, item) => {
    acc[item.name] = {
      label: item.label,
      available: item.available
    }
    return acc
  }, {})
