export interface ImageViewerProps {
  /** 是否显示预览 */
  modelValue?: boolean
  /** 图片地址列表 */
  imageList?: string[]
  /** 当前预览索引（v-model:current） */
  current?: number
  /** 是否显示关闭按钮 */
  closable?: boolean
  /** 初始缩放比例 */
  zoomRate?: number
  /** 最大缩放比例 */
  maxZoom?: number
  /** 最小缩放比例 */
  minZoom?: number
  /** 自定义类名 */
  customClass?: string
}
