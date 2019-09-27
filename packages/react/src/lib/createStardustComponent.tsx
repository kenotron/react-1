import { AccessibilityBehavior, AccessibilityActionHandlers } from '@stardust-ui/react-bindings'
import createComponentInternal, { CreateComponentReturnType } from './createComponent'
import * as React from 'react'
import * as _ from 'lodash'

import { ComponentSlotClasses, ComponentSlotStylesPrepared } from '../themes/types'
import { ObjectOf } from '../types'

export interface RenderStardustResultConfig {
  accessibility: AccessibilityBehavior
  classes: ComponentSlotClasses
  rtl: boolean
  styles: ComponentSlotStylesPrepared
}

export interface CreateStardustComponentConfig<P> {
  displayName: string
  className?: string
  render: (props: P & { stardust: RenderStardustResultConfig }) => React.ReactNode
  defaultProps?: any
  actionHandlers?: AccessibilityActionHandlers
}

const createComponent = <P extends ObjectOf<any> = any>({
  displayName,
  className,
  render,
  defaultProps,
  actionHandlers,
}: CreateStardustComponentConfig<P>): CreateComponentReturnType<P> => {
  return createComponentInternal<P>({
    displayName,
    className,
    render: (config, props) => {
      const filteredConfig = _.pick(config, ['accessibility', 'classes', 'rtl', 'styles'])
      return render(Object.assign({ stardust: filteredConfig }, props))
    },
    defaultProps,
    actionHandlers,
  })
}

export default createComponent
