import ConfigProvider from './ConfigProvider.vue'

export const WtConfigProvider = ConfigProvider
export { provideConfig, useConfig, resolveSize, wtConfigKey } from './context'
export type { WtConfig, WtComponentSize } from './context'
export default ConfigProvider
