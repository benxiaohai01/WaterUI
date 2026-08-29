import type { App, Plugin } from 'vue'
import { WtConfigProvider } from './components/config-provider'
import { WtButton } from './components/button'
import { WtIcon } from './components/icon'
import { WtLink } from './components/link'
import { WtText } from './components/text'
import { WtDivider } from './components/divider'
import { WtSpace } from './components/space'
import { WtLayout, WtHeader, WtAside, WtMain, WtFooter } from './components/layout'
import { WtRow, WtCol } from './components/grid'
import { WtTag } from './components/tag'
import { WtSwitch } from './components/switch'
import { WtInput } from './components/input'
import { WtSlider } from './components/slider'
import { WtTable } from './components/table'
import { WtForm, WtFormItem } from './components/form'
import './styles/index.scss'

const components = [
  WtConfigProvider,
  WtButton,
  WtIcon,
  WtLink,
  WtText,
  WtDivider,
  WtSpace,
  WtLayout,
  WtHeader,
  WtAside,
  WtMain,
  WtFooter,
  WtRow,
  WtCol,
  WtTag,
  WtSwitch,
  WtInput,
  WtSlider,
  WtTable,
  WtForm,
  WtFormItem
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
  WtSpace,
  WtLayout,
  WtHeader,
  WtAside,
  WtMain,
  WtFooter,
  WtRow,
  WtCol,
  WtTag,
  WtSwitch,
  WtInput,
  WtSlider,
  WtTable,
  WtForm,
  WtFormItem
}

export * from './components/button'
export * from './components/icon'
export * from './components/link'
export * from './components/text'
export * from './components/divider'
export * from './components/space'
export * from './components/layout'
export * from './components/grid'
export * from './components/tag'
export * from './components/switch'
export * from './components/input'
export * from './components/slider'
export * from './components/table'
export * from './components/form'

export default WaterUI
