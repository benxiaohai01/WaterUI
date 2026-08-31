import { inject, provide, type InjectionKey } from 'vue'
import type { StepStatus, StepsDirection } from './props'

export interface StepsContext {
  active: number
  direction: StepsDirection
  processStatus: StepStatus
  finishStatus: StepStatus
  length: number
  readonly: boolean
  /** 注册步骤（由 WtStep 在 mounted 时调用，用于推导步骤数量） */
  register: (step: unknown) => void
  /** 注销步骤 */
  unregister: (step: unknown) => void
  /** 触发步骤点击 */
  onSelect: (index: number) => void
}

export const stepsKey: InjectionKey<StepsContext> = Symbol('wtSteps')

export function provideSteps(context: StepsContext) {
  provide(stepsKey, context)
}

export function useSteps() {
  return inject(stepsKey, null)
}
