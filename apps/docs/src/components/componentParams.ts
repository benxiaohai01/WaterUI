export interface ParameterItem {
  name: string
  type?: string
  defaultValue?: string
  description: string
}

const stringParam = (
  name: string,
  defaultValue: string,
  description: string
): ParameterItem => ({
  name,
  type: 'string',
  defaultValue,
  description
})

const numberParam = (
  name: string,
  defaultValue: string,
  description: string
): ParameterItem => ({
  name,
  type: 'number',
  defaultValue,
  description
})

const booleanParam = (
  name: string,
  defaultValue: string,
  description: string
): ParameterItem => ({
  name,
  type: 'boolean',
  defaultValue,
  description
})

export const componentParams: Record<string, ParameterItem[]> = {
  button: [
    stringParam('type', 'default', '按钮类型：default / primary / success / warning / danger / info'),
    stringParam('size', 'medium', '按钮尺寸：small / medium / large'),
    booleanParam('disabled', 'false', '是否禁用'),
    booleanParam('loading', 'false', '是否显示加载状态'),
    booleanParam('plain', 'false', '是否使用朴素样式'),
    booleanParam('round', 'false', '是否使用圆形按钮'),
    booleanParam('block', 'false', '是否占满父容器宽度'),
    stringParam('--wt-ripple-enabled', '0', '按钮扩散效果开关，0 关闭，1 开启'),
    numberParam('--wt-ripple-opacity', '0.45', '扩散效果初始透明度'),
    numberParam('--wt-ripple-scale', '9', '扩散效果最大缩放倍数')
  ],
  icon: [
    stringParam('name', '-', '图标名称'),
    stringParam('size', '20', '图标尺寸'),
    stringParam('color', 'currentColor', '图标颜色'),
    booleanParam('wrapped', 'false', '是否显示水滴包裹背景与高光')
  ],
  link: [
    stringParam('href', '#', '链接地址'),
    stringParam('target', '_self', '打开方式'),
    booleanParam('disabled', 'false', '是否禁用'),
    booleanParam('underline', 'true', '是否显示下划线')
  ],
  text: [
    stringParam('as', 'span', '渲染的 HTML 标签'),
    stringParam('size', 'medium', '文本尺寸：small / medium / large'),
    stringParam('type', 'default', '文本语义类型'),
    booleanParam('strong', 'false', '是否加粗'),
    booleanParam('italic', 'false', '是否斜体'),
    booleanParam('block', 'false', '是否块级展示'),
    booleanParam('truncate', 'false', '是否单行截断')
  ],
  divider: [
    stringParam('direction', 'horizontal', '分割线方向：horizontal / vertical'),
    stringParam('contentPosition', 'center', '内容位置：left / center / right'),
    booleanParam('dashed', 'false', '是否使用虚线')
  ],
  space: [
    stringParam('direction', 'horizontal', '排列方向：horizontal / vertical'),
    stringParam('size', '12', '间距大小'),
    booleanParam('wrap', 'false', '是否自动换行'),
    stringParam('align', 'center', '交叉轴对齐方式'),
    stringParam('justify', 'start', '主轴对齐方式')
  ],
  layout: [
    stringParam('direction', 'horizontal', '布局方向：horizontal / vertical'),
    stringParam('height', '64px', 'Header / Footer 高度'),
    stringParam('width', '264px', 'Aside 宽度')
  ],
  grid: [
    numberParam('span', '24', 'Col 在 24 栅格中占用的列数'),
    numberParam('offset', '0', 'Col 左侧偏移列数'),
    numberParam('gutter', '0', 'Row 栅格间距，可传入数字或 [水平, 垂直]')
  ],
  tag: [
    stringParam('type', 'default', '标签类型：default / primary / success / warning / danger / info'),
    booleanParam('closable', 'false', '是否可关闭'),
    booleanParam('round', 'false', '是否使用圆形标签'),
    booleanParam('disabled', 'false', '是否禁用')
  ],
  switch: [
    booleanParam('modelValue', 'false', '当前开关状态'),
    booleanParam('disabled', 'false', '是否禁用'),
    stringParam('size', 'medium', '开关尺寸：small / medium / large'),
    stringParam('activeText', '', '开启状态文字'),
    stringParam('inactiveText', '', '关闭状态文字')
  ],
  slider: [
    numberParam('modelValue', '0', '当前滑块值'),
    numberParam('min', '0', '最小值'),
    numberParam('max', '100', '最大值'),
    numberParam('step', '1', '步长'),
    booleanParam('disabled', 'false', '是否禁用'),
    booleanParam('showValue', 'false', '是否显示当前值')
  ],
  table: [
    stringParam('columns', '-', '表格列配置数组'),
    stringParam('data', '-', '表格数据数组'),
    booleanParam('bordered', 'false', '是否显示边框'),
    booleanParam('striped', 'false', '是否使用斑马纹'),
    stringParam('size', 'medium', '表格尺寸：small / medium / large'),
    stringParam('emptyText', '暂无数据', '空数据占位文本')
  ],
  input: [
    stringParam('modelValue', '', '输入值'),
    stringParam('type', 'text', '输入类型，支持 text / password / email / number / search / url / color'),
    stringParam('placeholder', '', '占位文本'),
    booleanParam('disabled', 'false', '是否禁用'),
    booleanParam('readonly', 'false', '是否只读'),
    stringParam('size', 'medium', '输入框尺寸：small / medium / large'),
    booleanParam('clearable', 'false', '是否显示清空按钮')
  ],
  'config-provider': [
    stringParam('theme', 'system', '主题模式：light / dark / system'),
    stringParam('size', 'medium', '默认组件尺寸：small / medium / large'),
    stringParam('prefix', 'wt', '组件命名前缀'),
    numberParam('--wt-highlight-size', '12', '全局主高光尺寸'),
    numberParam('--wt-motion-normal', '3.5', '全局标准动画时长'),
    numberParam('--wt-shadow-dark-alpha', '0.04', '全局阴影深度'),
    stringParam('--wt-primary', '#3d7eff', '全局主色')
  ]
}
