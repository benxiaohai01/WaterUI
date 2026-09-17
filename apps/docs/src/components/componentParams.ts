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

const numberOrStringParam = (
  name: string,
  defaultValue: string,
  description: string
): ParameterItem => ({
  name,
  type: 'number | string',
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
    numberParam('--wt-ripple-scale', '9', '扩散效果最大缩放倍数'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
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
    booleanParam('disabled', 'false', '是否禁用'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  switch: [
    booleanParam('modelValue', 'false', '当前开关状态'),
    booleanParam('disabled', 'false', '是否禁用'),
    stringParam('size', 'medium', '开关尺寸：small / medium / large'),
    stringParam('activeText', '', '开启状态文字'),
    stringParam('inactiveText', '', '关闭状态文字'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  slider: [
    numberParam('modelValue', '0', '当前滑块值'),
    numberParam('min', '0', '最小值'),
    numberParam('max', '100', '最大值'),
    numberParam('step', '1', '步长'),
    booleanParam('disabled', 'false', '是否禁用'),
    booleanParam('showValue', 'false', '是否显示当前值'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  table: [
    stringParam('columns', '-', '表格列配置数组'),
    stringParam('data', '-', '表格数据数组'),
    booleanParam('bordered', 'false', '是否显示边框'),
    booleanParam('striped', 'false', '是否使用斑马纹'),
    stringParam('size', 'medium', '表格尺寸：small / medium / large'),
    stringParam('emptyText', '暂无数据', '空数据占位文本'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  input: [
    stringParam('modelValue', '', '输入值'),
    stringParam('type', 'text', '输入类型，支持 text / password / email / number / search / url / color'),
    stringParam('placeholder', '', '占位文本'),
    booleanParam('disabled', 'false', '是否禁用'),
    booleanParam('readonly', 'false', '是否只读'),
    stringParam('size', 'medium', '输入框尺寸：small / medium / large'),
    booleanParam('clearable', 'false', '是否显示清空按钮'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  textarea: [
    stringParam('modelValue', '', '文本内容'),
    stringParam('placeholder', '', '占位文本'),
    numberParam('rows', '3', '文本域行数'),
    numberParam('maxlength', '-', '最大输入长度'),
    booleanParam('showWordLimit', 'false', '是否显示字数统计'),
    stringParam('size', 'medium', '文本域尺寸：small / medium / large'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  'input-number': [
    numberParam('modelValue', '0', '当前数值'),
    numberParam('min', '-Infinity', '最小值'),
    numberParam('max', 'Infinity', '最大值'),
    numberParam('step', '1', '步长'),
    numberParam('precision', '-', '保留小数位数'),
    booleanParam('controls', 'true', '是否显示增减控件'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  autocomplete: [
    stringParam('modelValue', '', '当前输入值'),
    stringParam('suggestions', '[]', '候选建议列表'),
    stringParam('placeholder', '', '占位文本'),
    booleanParam('clearable', 'false', '是否显示清空按钮'),
    booleanParam('disabled', 'false', '是否禁用'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  select: [
    stringParam('modelValue', '', '当前选中值'),
    stringParam('options', '[]', '选项数组'),
    stringParam('placeholder', '请选择', '占位文本'),
    booleanParam('clearable', 'false', '是否可清空'),
    booleanParam('disabled', 'false', '是否禁用'),
    stringParam('label', '-', 'WtOption 选项显示文本'),
    stringParam('value', '-', 'WtOption 选项值'),
    booleanParam('disabled', 'false', 'WtOption 是否禁用'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  cascader: [
    stringParam('modelValue', '[]', '当前选中路径数组'),
    stringParam('options', '[]', '级联选项数组'),
    stringParam('placeholder', '请选择', '占位文本'),
    booleanParam('clearable', 'false', '是否可清空'),
    booleanParam('disabled', 'false', '是否禁用'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  checkbox: [
    booleanParam('modelValue', 'false', '是否选中'),
    booleanParam('indeterminate', 'false', '是否为半选状态'),
    booleanParam('disabled', 'false', '是否禁用'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  radio: [
    stringParam('modelValue', '', '当前选中值'),
    stringParam('value', '', '当前单选项的值'),
    booleanParam('disabled', 'false', '是否禁用'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  'date-picker': [
    stringParam('modelValue', '', '日期值'),
    stringParam('pickerType', 'date', '选择器类型：date / datetime'),
    stringParam('placeholder', '', '占位文本'),
    booleanParam('clearable', 'false', '是否可清空'),
    booleanParam('disabled', 'false', '是否禁用'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  'time-picker': [
    stringParam('modelValue', '', '时间值'),
    stringParam('placeholder', '', '占位文本'),
    booleanParam('clearable', 'false', '是否可清空'),
    booleanParam('disabled', 'false', '是否禁用'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  upload: [
    stringParam('modelValue', '[]', '文件列表'),
    stringParam('accept', '', '接受的文件类型'),
    booleanParam('multiple', 'false', '是否支持多选'),
    booleanParam('disabled', 'false', '是否禁用'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  rate: [
    numberParam('modelValue', '0', '当前评分'),
    numberParam('max', '5', '最大评分'),
    booleanParam('allowHalf', 'false', '是否允许半星'),
    booleanParam('disabled', 'false', '是否禁用'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  'color-picker': [
    stringParam('modelValue', '#3d7eff', '当前颜色值'),
    booleanParam('disabled', 'false', '是否禁用'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  transfer: [
    stringParam('modelValue', '[]', '已选中 key 列表'),
    stringParam('data', '[]', '穿梭数据数组'),
    stringParam('titles', "['待选择', '已选择']", '两侧标题'),
    booleanParam('disabled', 'false', '是否禁用'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  form: [
    stringParam('modelValue', '{}', '表单数据对象'),
    stringParam('rules', '{}', '表单校验规则'),
    stringParam('labelWidth', '90px', '标签宽度'),
    stringParam('labelPosition', 'left', '标签位置：left / top'),
    stringParam('size', 'medium', '表单尺寸：small / medium / large'),
    booleanParam('inline', 'false', '是否使用行内布局'),
    booleanParam('disabled', 'false', '是否禁用')
  ],
  alert: [
    stringParam('type', 'default', '提示类型：default / primary / success / warning / danger / info'),
    stringParam('title', '', '标题'),
    stringParam('description', '', '描述文本'),
    booleanParam('closable', 'false', '是否可关闭'),
    booleanParam('showIcon', 'false', '是否显示图标'),
    stringParam('customClass', '', '自定义类名'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  loading: [
    booleanParam('modelValue', 'false', '是否显示加载状态'),
    stringParam('text', '', '加载提示文字'),
    booleanParam('fullscreen', 'false', '是否全屏遮罩'),
    stringParam('size', 'medium', '尺寸：small / medium / large'),
    stringParam('customClass', '', '自定义类名'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  message: [
    stringParam('message', '', '消息文本'),
    stringParam('type', 'info', '消息类型：info / success / warning / error'),
    numberParam('duration', '3000', '自动关闭时长，0 表示不自动关闭'),
    booleanParam('showClose', 'false', '是否显示关闭按钮'),
    stringParam('customClass', '', '自定义类名'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  'message-box': [
    booleanParam('modelValue', 'false', '是否显示弹框'),
    stringParam('title', '提示', '标题'),
    stringParam('message', '', '消息文本'),
    stringParam('type', 'info', '语义类型：info / success / warning / error'),
    stringParam('confirmText', '确定', '确认按钮文案'),
    stringParam('cancelText', '取消', '取消按钮文案'),
    booleanParam('showCancel', 'true', '是否显示取消按钮'),
    booleanParam('maskClosable', 'true', '点击遮罩是否关闭'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  notification: [
    stringParam('title', '', '通知标题'),
    stringParam('message', '', '通知内容'),
    stringParam('type', 'info', '通知类型：info / success / warning / error'),
    numberParam('duration', '4500', '自动关闭时长'),
    booleanParam('showClose', 'true', '是否显示关闭按钮'),
    numberParam('offset', '24', '顶部偏移距离'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  dialog: [
    booleanParam('modelValue', 'false', '是否显示对话框'),
    stringParam('title', '', '标题'),
    stringParam('width', '520px', '面板宽度'),
    booleanParam('closeOnMask', 'true', '点击遮罩是否关闭'),
    booleanParam('closable', 'true', '是否显示关闭按钮'),
    stringParam('customClass', '', '自定义类名'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  drawer: [
    booleanParam('modelValue', 'false', '是否显示抽屉'),
    stringParam('title', '', '标题'),
    stringParam('placement', 'right', '方向：left / right / top / bottom'),
    stringParam('size', '320px', '面板尺寸'),
    booleanParam('closeOnMask', 'true', '点击遮罩是否关闭'),
    booleanParam('closable', 'true', '是否显示关闭按钮'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  tooltip: [
    stringParam('content', '', '提示内容'),
    stringParam('placement', 'top', '方向：top / right / bottom / left'),
    stringParam('trigger', 'hover', '触发方式：hover / click'),
    booleanParam('disabled', 'false', '是否禁用'),
    stringParam('customClass', '', '自定义类名'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  popover: [
    stringParam('title', '', '气泡标题'),
    stringParam('content', '', '气泡内容'),
    stringParam('placement', 'top', '方向：top / right / bottom / left'),
    stringParam('trigger', 'click', '触发方式：hover / click'),
    stringParam('width', '260px', '气泡宽度'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  popconfirm: [
    stringParam('title', '', '标题'),
    stringParam('content', '确定要执行该操作吗？', '内容'),
    stringParam('type', 'warning', '语义类型：info / success / warning / error'),
    stringParam('confirmText', '确定', '确认按钮文案'),
    stringParam('cancelText', '取消', '取消按钮文案'),
    stringParam('placement', 'top', '方向：top / right / bottom / left'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  'config-provider': [
    stringParam('theme', 'system', '主题模式：light / dark / system'),
    stringParam('size', 'medium', '默认组件尺寸：small / medium / large'),
    numberParam('--wt-highlight-size-base', '12', '全局主高光基准尺寸，组件内会自动按空间收束'),
    numberParam('--wt-highlight-opacity', '0.78', '全局高光透明度'),
    numberParam('--wt-highlight-offset', '8', '全局高光整体偏移'),
    numberParam('--wt-motion-normal', '3.5', '全局标准动画时长'),
    numberParam('--wt-shadow-dark-alpha', '0.04', '全局阴影深度'),
    stringParam('--wt-primary', '#3d7eff', '全局主色')
  ],
  menu: [
    stringParam('modelValue', '', '当前激活菜单项标识（v-model）'),
    stringParam('mode', 'vertical', '展示模式：vertical / horizontal'),
    stringParam('theme', 'light', '主题：light / dark'),
    booleanParam('collapse', 'false', '是否折叠（垂直模式）'),
    booleanParam('uniqueOpened', 'false', '是否只允许展开一个子菜单'),
    stringParam('index', '', 'MenuItem / SubMenu 标识'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  tabs: [
    stringParam('modelValue', '', '当前激活选项卡标识（v-model）'),
    stringParam('type', 'text', '展示类型：text / card'),
    stringParam('position', 'top', '标签位置：top / right / bottom / left'),
    booleanParam('closable', 'false', '是否显示关闭按钮'),
    booleanParam('addable', 'false', '是否显示新增按钮'),
    booleanParam('editable', 'false', '是否允许增删'),
    stringParam('label', '', 'TabPane 选项卡标题'),
    stringParam('name', '-', 'TabPane 唯一标识（默认取索引）'),
    booleanParam('lazy', 'false', 'TabPane 是否懒渲染'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  breadcrumb: [
    stringParam('separator', '/', '分隔符内容'),
    stringParam('to', '', 'BreadcrumbItem 跳转链接'),
    stringParam('target', '_self', '链接打开方式')
  ],
  dropdown: [
    stringParam('trigger', 'hover', '触发方式：hover / click'),
    stringParam('placement', 'bottom', '弹出方向：top / right / bottom / left'),
    booleanParam('disabled', 'false', '是否禁用'),
    stringParam('command', '', 'DropdownItem 点击时向上传递的命令值'),
    booleanParam('divided', 'false', 'DropdownItem 是否显示上方分隔线'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  steps: [
    numberParam('active', '0', '当前激活步骤索引（v-model:active）'),
    stringParam('direction', 'horizontal', '展示方向：horizontal / vertical'),
    stringParam('processStatus', 'process', '当前步骤状态：process / finish / error'),
    stringParam('finishStatus', 'finish', '完成步骤状态'),
    booleanParam('readonly', 'false', '是否只读（不响应点击）'),
    stringParam('title', '', 'Step 标题'),
    stringParam('description', '', 'Step 描述'),
    stringParam('status', '', 'Step 自定义状态，覆盖父级推导'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  'page-header': [
    stringParam('title', '', '标题'),
    stringParam('subtitle', '', '副标题'),
    stringParam('breadcrumbSeparator', '/', '面包屑分隔符'),
    booleanParam('showBack', 'true', '是否显示返回按钮'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  anchor: [
    stringParam('modelValue', '', '当前激活锚点（v-model）'),
    stringParam('offset', '0', '滚动偏移量（px）'),
    stringParam('container', 'window', '滚动容器'),
    booleanParam('clickActive', 'true', '点击后是否自动高亮'),
    stringParam('href', '', 'AnchorLink 锚点链接（对应元素 id）'),
    stringParam('title', '', 'AnchorLink 显示标题')
  ],
  affix: [
    numberParam('offset', '0', '距离视口顶部的偏移量（px）'),
    stringParam('container', 'window', '滚动容器'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  'back-top': [
    numberParam('visibilityHeight', '200', '滚动高度达到该值后显示按钮（px）'),
    numberParam('duration', '300', '滚动动画时长（ms）'),
    stringParam('container', 'window', '目标滚动容器'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  pagination: [
    numberParam('current', '1', '当前页码（从 1 开始）'),
    numberParam('pageSize', '10', '每页条数'),
    numberParam('total', '0', '总条数'),
    numberParam('pagerCount', '7', '页码按钮数量（含省略号逻辑）'),
    booleanParam('showTotal', 'false', '是否显示总数'),
    booleanParam('showJumper', 'false', '是否显示快速跳转'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  tree: [
    stringParam('data', '[]', '树数据数组（TreeNode[]）'),
    booleanParam('multiple', 'false', '是否多选'),
    booleanParam('defaultExpandAll', 'false', '是否默认展开所有节点'),
    booleanParam('showLine', 'false', '是否显示连接线'),
    stringParam('key', '-', '节点唯一标识'),
    stringParam('label', '-', '节点标题'),
    booleanParam('disabled', 'false', '节点是否禁用')
  ],
  card: [
    stringParam('title', '', '卡片标题'),
    booleanParam('bordered', 'true', '是否显示边框'),
    stringParam('shadow', 'hover', '阴影显隐：hover / always / never'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  carousel: [
    numberParam('activeIndex', '0', '当前激活索引（v-model）'),
    booleanParam('autoplay', 'true', '是否自动播放'),
    numberParam('interval', '4000', '自动播放间隔（ms）'),
    booleanParam('indicator', 'true', '是否显示指示器'),
    booleanParam('arrow', 'true', '是否显示箭头'),
    booleanParam('loop', 'true', '是否循环播放'),
    stringParam('customClass', '', 'WtCarouselItem 自定义类名'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  collapse: [
    stringParam('activeKey', '', '当前激活面板 key（数组表示多选，v-model）'),
    booleanParam('accordion', 'false', '是否手风琴模式'),
    stringParam('name', '-', 'CollapseItem 面板唯一标识'),
    stringParam('title', '', 'CollapseItem 标题'),
    booleanParam('disabled', 'false', 'CollapseItem 是否禁用'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  timeline: [
    stringParam('timestamp', '', 'TimelineItem 时间'),
    stringParam('type', 'default', '节点类型：default / primary / success / warning / danger'),
    booleanParam('hollow', 'false', '节点是否空心')
  ],
  descriptions: [
    stringParam('title', '', '标题'),
    numberParam('column', '3', '每行列数'),
    booleanParam('bordered', 'false', '是否带边框'),
    stringParam('label', '', 'DescriptionsItem 字段标签'),
    numberParam('span', '1', 'DescriptionsItem 跨列数'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  empty: [
    stringParam('description', '暂无数据', '空状态描述文案'),
    numberParam('imageSize', '96', '图片尺寸（px）'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  result: [
    stringParam('status', 'info', '结果状态：success / warning / danger / info / 404 / 500'),
    stringParam('title', '', '主标题'),
    stringParam('subtitle', '', '副标题'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  statistic: [
    numberParam('value', '0', '数值'),
    stringParam('title', '', '数值标题'),
    stringParam('prefix', '', '数值前缀'),
    stringParam('suffix', '', '数值后缀'),
    numberParam('precision', '0', '小数位'),
    booleanParam('groupSeparator', 'false', '是否千分位分隔')
  ],
  calendar: [
    stringParam('modelValue', '', '当前选中日期（YYYY-MM-DD）'),
    numberParam('year', '-', '默认年份'),
    numberParam('month', '-', '默认月份（1-12）'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  skeleton: [
    booleanParam('loading', 'true', '是否显示骨架屏'),
    booleanParam('avatar', 'false', '是否显示头像骨架'),
    numberParam('titleRows', '1', '标题行数'),
    numberParam('paragraphRows', '2', '段落行数'),
    booleanParam('animated', 'true', '是否开启动画')
  ],
  progress: [
    numberParam('percentage', '0', '进度百分比（0-100）'),
    stringParam('type', 'line', '展示类型：line / circle'),
    stringParam('status', 'normal', '状态：normal / success / warning / danger'),
    numberParam('strokeWidth', '8', '线条高度（px）'),
    numberParam('size', '96', '圆形尺寸（px）'),
    booleanParam('showText', 'true', '是否显示文字'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  image: [
    stringParam('src', '-', '图片地址'),
    stringParam('alt', '', '替代文本'),
    stringParam('width', '100%', '宽度'),
    stringParam('height', 'auto', '高度'),
    stringParam('fit', 'fill', '填充模式：fill / contain / cover / none / scale-down'),
    stringParam('radius', 'medium', '圆角：none / small / medium / large / round'),
    booleanParam('preview', 'false', '是否开启点击预览'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  badge: [
    stringParam('value', '', '徽标显示内容（数字或文本）'),
    numberParam('max', '99', '最大值，超出后显示 max+（仅数字生效）'),
    booleanParam('dot', 'false', '是否使用小圆点模式'),
    booleanParam('hidden', 'false', '是否隐藏徽标'),
    stringParam('type', 'danger', '语义类型：default / primary / success / warning / danger / info'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  avatar: [
    stringParam('size', 'medium', '尺寸：small / medium / large 或具体像素'),
    stringParam('shape', 'liquid', '形状：circle / square / liquid（水滴形）'),
    stringParam('src', '', '图片地址'),
    stringParam('alt', '', '图片替代文本'),
    stringParam('fallbackText', '', '图片加载失败时的回退文本'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  scrollbar: [
    stringParam('height', '', '内容区域高度（不设置则跟随内容撑开）'),
    stringParam('maxHeight', '', '内容区域最大高度'),
    booleanParam('alwaysShow', 'false', '是否始终显示轨道'),
    numberParam('minThumbSize', '24', '滚动条最小长度（px）'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  splitter: [
    stringParam('direction', 'horizontal', '分隔方向：horizontal 左右 / vertical 上下'),
    numberParam('modelValue', '260', '第一个面板的尺寸（px），拖动时实时更新（v-model）'),
    numberParam('min', '80', '最小尺寸（px）'),
    numberParam('max', '800', '最大尺寸（px）'),
    numberParam('barSize', '8', '分隔条宽度（px）'),
    numberOrStringParam('highlightSize', '-', '主高光尺寸（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberOrStringParam('highlightOffset', '-', '高光相对右上角的偏移（数字按 px，也可传 CSS 值），组件级优先于全局配置'),
    numberParam('highlightOpacity', '-', '主高光透明度（0~1），组件级优先于全局配置')
  ],
  'virtual-list': [
    stringParam('data', '-', '列表数据源（数组）'),
    numberParam('itemSize', '-', '每一项的高度（px，必填）'),
    stringParam('height', '400', '可视区高度（px 或 CSS 值）'),
    numberParam('buffer', '5', '预渲染缓冲数量（上下各）'),
    stringParam('customClass', '', '自定义类名')
  ],
  watermark: [
    stringParam('text', 'Water UI', '水印文本内容，换行用 \n 分隔'),
    stringParam('image', '', '水印图片地址（优先级高于 text）'),
    numberParam('width', '180', '水印单元横向尺寸（px）'),
    numberParam('height', '120', '水印单元纵向尺寸（px）'),
    numberParam('fontSize', '14', '字号（px）'),
    stringParam('color', 'rgba(0,0,0,0.08)', '水印颜色'),
    numberParam('opacity', '1', '水印层透明度（0-1）'),
    numberParam('zIndex', '9999', '水印层堆叠层级')
  ],
  tour: [
    booleanParam('modelValue', 'false', '是否显示引导（v-model）'),
    stringParam('steps', '-', '步骤配置数组：title / description / target / placement'),
    numberParam('current', '0', '当前步骤索引（v-model:current）'),
    booleanParam('mask', 'true', '是否显示遮罩'),
    stringParam('maskColor', 'rgba(0, 0, 0, 0.5)', '遮罩颜色'),
    stringParam('prevText', '上一步', '上一步按钮文案'),
    stringParam('nextText', '下一步', '下一步按钮文案'),
    stringParam('doneText', '完成', '完成按钮文案')
  ],
  'image-viewer': [
    booleanParam('modelValue', 'false', '是否显示预览（v-model）'),
    stringParam('imageList', '-', '图片地址列表'),
    numberParam('current', '0', '当前预览索引（v-model:current）'),
    booleanParam('closable', 'true', '是否显示关闭按钮'),
    numberParam('zoomRate', '0.5', '每次缩放的增量'),
    numberParam('maxZoom', '3', '最大缩放比例'),
    numberParam('minZoom', '0.2', '最小缩放比例')
  ]
}
