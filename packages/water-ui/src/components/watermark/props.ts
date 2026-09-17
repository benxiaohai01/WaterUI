export interface WatermarkProps {
  /** 水印文本内容 */
  text?: string
  /**
   * 水印图片地址（优先级高于 text）
   * 仅支持 data:URL（base64）或已内联的图片数据：SVG 作为 CSS background 处于
   * secure static mode，http(s) 外链等外部资源会被浏览器禁止加载，不会渲染。
   */
  image?: string
  /** 横向间距（px） */
  width?: number
  /** 纵向间距（px） */
  height?: number
  /** 字号（px） */
  fontSize?: number
  /** 水印颜色 */
  color?: string
  /** 透明度（0-1） */
  opacity?: number
  /** 水印层堆叠层级 */
  zIndex?: number
  /** 自定义类名 */
  customClass?: string
}
