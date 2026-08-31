export type AvatarSize = 'small' | 'medium' | 'large' | number
export type AvatarShape = 'circle' | 'square' | 'liquid'

export interface AvatarProps {
  /** 头像尺寸：small / medium / large 或具体像素 */
  size?: AvatarSize
  /** 头像形状：circle / square / liquid（水滴形） */
  shape?: AvatarShape
  /** 图片地址 */
  src?: string
  /** 图片替代文本 */
  alt?: string
  /** 图片加载失败时的回退文本（默认取 slot 内容） */
  fallbackText?: string
  /** 自定义类名 */
  customClass?: string
}
