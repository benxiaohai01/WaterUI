import type { App, Plugin } from 'vue'
import { WtConfigProvider } from './components/config-provider'
import { WtButton } from './components/button'
import { WtIcon } from './components/icon'
import { WtLink } from './components/link'
import { WtText } from './components/text'
import { WtDivider } from './components/divider'
import { WtBadge } from './components/badge'
import { WtAvatar } from './components/avatar'
import { WtSpace } from './components/space'
import { WtLayout, WtHeader, WtAside, WtMain, WtFooter } from './components/layout'
import { WtRow, WtCol } from './components/grid'
import { WtScrollbar } from './components/scrollbar'
import { WtSplitter } from './components/splitter'
import { WtTag } from './components/tag'
import { WtSwitch } from './components/switch'
import { WtInput } from './components/input'
import { WtSlider } from './components/slider'
import { WtTable } from './components/table'
import { WtForm, WtFormItem } from './components/form'
import { WtTextarea } from './components/textarea'
import { WtInputNumber } from './components/input-number'
import { WtAutocomplete } from './components/autocomplete'
import { WtSelect, WtOption } from './components/select'
import { WtCascader } from './components/cascader'
import { WtCheckbox } from './components/checkbox'
import { WtRadio } from './components/radio'
import { WtDatePicker } from './components/date-picker'
import { WtTimePicker } from './components/time-picker'
import { WtUpload } from './components/upload'
import { WtRate } from './components/rate'
import { WtColorPicker } from './components/color-picker'
import { WtTransfer } from './components/transfer'
import { WtAlert } from './components/alert'
import { WtLoading } from './components/loading'
import { WtMessage } from './components/message'
import { WtMessageBox } from './components/message-box'
import { WtNotification } from './components/notification'
import { WtDialog } from './components/dialog'
import { WtDrawer } from './components/drawer'
import { WtTooltip } from './components/tooltip'
import { WtPopover } from './components/popover'
import { WtPopconfirm } from './components/popconfirm'
import { WtMenu, WtMenuItem, WtSubMenu } from './components/menu'
import { WtTabs, WtTabPane } from './components/tabs'
import { WtBreadcrumb, WtBreadcrumbItem } from './components/breadcrumb'
import { WtDropdown, WtDropdownItem, WtDropdownMenu } from './components/dropdown'
import { WtSteps, WtStep } from './components/steps'
import { WtPageHeader } from './components/page-header'
import { WtAnchor, WtAnchorLink } from './components/anchor'
import { WtAffix } from './components/affix'
import { WtBackTop } from './components/back-top'
import { WtPagination } from './components/pagination'
import { WtTree } from './components/tree'
import { WtCard } from './components/card'
import { WtCarousel, WtCarouselItem } from './components/carousel'
import { WtCollapse, WtCollapseItem } from './components/collapse'
import { WtTimeline, WtTimelineItem } from './components/timeline'
import { WtDescriptions, WtDescriptionsItem } from './components/descriptions'
import { WtEmpty } from './components/empty'
import { WtResult } from './components/result'
import { WtStatistic } from './components/statistic'
import { WtCalendar } from './components/calendar'
import { WtSkeleton } from './components/skeleton'
import { WtProgress } from './components/progress'
import { WtImage } from './components/image'
import { WtVirtualList } from './components/virtual-list'
import { WtWatermark } from './components/watermark'
import { WtTour } from './components/tour'
import { WtImageViewer } from './components/image-viewer'
import './styles/index.scss'

const components = [
  WtConfigProvider,
  WtButton,
  WtIcon,
  WtLink,
  WtText,
  WtDivider,
  WtBadge,
  WtAvatar,
  WtSpace,
  WtLayout,
  WtHeader,
  WtAside,
  WtMain,
  WtFooter,
  WtRow,
  WtCol,
  WtScrollbar,
  WtSplitter,
  WtTag,
  WtSwitch,
  WtInput,
  WtSlider,
  WtTable,
  WtForm,
  WtFormItem,
  WtTextarea,
  WtInputNumber,
  WtAutocomplete,
  WtSelect,
  WtOption,
  WtCascader,
  WtCheckbox,
  WtRadio,
  WtDatePicker,
  WtTimePicker,
  WtUpload,
  WtRate,
  WtColorPicker,
  WtTransfer,
  WtAlert,
  WtLoading,
  WtMessage,
  WtMessageBox,
  WtNotification,
  WtDialog,
  WtDrawer,
  WtTooltip,
  WtPopover,
  WtPopconfirm,
  WtMenu,
  WtMenuItem,
  WtSubMenu,
  WtTabs,
  WtTabPane,
  WtBreadcrumb,
  WtBreadcrumbItem,
  WtDropdown,
  WtDropdownItem,
  WtDropdownMenu,
  WtSteps,
  WtStep,
  WtPageHeader,
  WtAnchor,
  WtAnchorLink,
  WtAffix,
  WtBackTop,
  WtPagination,
  WtTree,
  WtCard,
  WtCarousel,
  WtCarouselItem,
  WtCollapse,
  WtCollapseItem,
  WtTimeline,
  WtTimelineItem,
  WtDescriptions,
  WtDescriptionsItem,
  WtEmpty,
  WtResult,
  WtStatistic,
  WtCalendar,
  WtSkeleton,
  WtProgress,
  WtImage,
  WtVirtualList,
  WtWatermark,
  WtTour,
  WtImageViewer
]

export const WaterUI: Plugin = {
  install(app: App) {
    components.forEach((component) => {
      if (component.name) {
        app.component(component.name, component)
      }
    })
  }
}

export {
  WtConfigProvider,
  WtButton,
  WtIcon,
  WtLink,
  WtText,
  WtDivider,
  WtBadge,
  WtAvatar,
  WtSpace,
  WtLayout,
  WtHeader,
  WtAside,
  WtMain,
  WtFooter,
  WtRow,
  WtCol,
  WtScrollbar,
  WtSplitter,
  WtTag,
  WtSwitch,
  WtInput,
  WtSlider,
  WtTable,
  WtForm,
  WtFormItem,
  WtTextarea,
  WtInputNumber,
  WtAutocomplete,
  WtSelect,
  WtOption,
  WtCascader,
  WtCheckbox,
  WtRadio,
  WtDatePicker,
  WtTimePicker,
  WtUpload,
  WtRate,
  WtColorPicker,
  WtTransfer,
  WtAlert,
  WtLoading,
  WtMessage,
  WtMessageBox,
  WtNotification,
  WtDialog,
  WtDrawer,
  WtTooltip,
  WtPopover,
  WtPopconfirm,
  WtMenu,
  WtMenuItem,
  WtSubMenu,
  WtTabs,
  WtTabPane,
  WtBreadcrumb,
  WtBreadcrumbItem,
  WtDropdown,
  WtDropdownItem,
  WtDropdownMenu,
  WtSteps,
  WtStep,
  WtPageHeader,
  WtAnchor,
  WtAnchorLink,
  WtAffix,
  WtBackTop,
  WtPagination,
  WtTree,
  WtCard,
  WtCarousel,
  WtCarouselItem,
  WtCollapse,
  WtCollapseItem,
  WtTimeline,
  WtTimelineItem,
  WtDescriptions,
  WtDescriptionsItem,
  WtEmpty,
  WtResult,
  WtStatistic,
  WtCalendar,
  WtSkeleton,
  WtProgress,
  WtImage,
  WtVirtualList,
  WtWatermark,
  WtTour,
  WtImageViewer
}

export * from './components/button'
export * from './components/config-provider'
export * from './components/icon'
export * from './components/link'
export * from './components/text'
export * from './components/divider'
export * from './components/badge'
export * from './components/avatar'
export * from './components/space'
export * from './components/layout'
export * from './components/grid'
export * from './components/scrollbar'
export * from './components/splitter'
export * from './components/tag'
export * from './components/switch'
export * from './components/input'
export * from './components/slider'
export * from './components/table'
export * from './components/form'
export * from './components/textarea'
export * from './components/input-number'
export * from './components/autocomplete'
export * from './components/select'
export * from './components/cascader'
export * from './components/checkbox'
export * from './components/radio'
export * from './components/date-picker'
export * from './components/time-picker'
export * from './components/upload'
export * from './components/rate'
export * from './components/color-picker'
export * from './components/transfer'
export * from './components/alert'
export * from './components/loading'
export * from './components/message'
export * from './components/message-box'
export * from './components/notification'
export * from './components/dialog'
export * from './components/drawer'
export * from './components/tooltip'
export * from './components/popover'
export * from './components/popconfirm'
export * from './components/menu'
export * from './components/tabs'
export * from './components/breadcrumb'
export * from './components/dropdown'
export * from './components/steps'
export * from './components/page-header'
export * from './components/anchor'
export * from './components/affix'
export * from './components/back-top'
export * from './components/pagination'
export * from './components/tree'
export * from './components/card'
export * from './components/carousel'
export * from './components/collapse'
export * from './components/timeline'
export * from './components/descriptions'
export * from './components/empty'
export * from './components/result'
export * from './components/statistic'
export * from './components/calendar'
export * from './components/skeleton'
export * from './components/progress'
export * from './components/image'
export * from './components/virtual-list'
export * from './components/watermark'
export * from './components/tour'
export * from './components/image-viewer'

export default WaterUI
