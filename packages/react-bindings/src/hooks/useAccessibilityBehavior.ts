import { Accessibility } from '@stardust-ui/accessibility'
import * as React from 'react'

import getAccessibility from '../accessibility/getAccessibility'
import { AccessibilityBehavior, AccessibilityActionHandlers } from '../accessibility/types'

type UseAccessibilityBehaviorOptions<Props> = {
  actionHandlers?: AccessibilityActionHandlers
  mapPropsToBehavior?: () => Props
}

const enhanceElement = <SlotProps extends Record<string, any>>(
  slotName: string,
  slotProps: SlotProps,
  definition: AccessibilityBehavior,
): React.ReactElement => {
  const finalProps = {
    ...definition.attributes[slotName],
    ...slotProps,
  }

  if (definition.keyHandlers[slotName]) {
    const onKeyDown = (e: React.KeyboardEvent, ...args: any[]) => {
      definition.keyHandlers[slotName].onKeyDown(e)
      if (slotProps.onKeyDown) {
        slotProps.onKeyDown(e, ...args)
      }
    }

    finalProps.onKeyDown = onKeyDown
  }

  return finalProps
}

const useAccessibilityBehavior = <Props>(
  behavior: Accessibility<Props>,
  options: UseAccessibilityBehaviorOptions<Props>,
) => {
  const { actionHandlers, mapPropsToBehavior = () => ({}) } = options
  const latestDefinition = React.useRef<AccessibilityBehavior>(null)

  latestDefinition.current = getAccessibility(
    'Foo',
    behavior,
    mapPropsToBehavior(),
    true,
    actionHandlers,
  )

  return React.useCallback(
    <SlotProps extends Record<string, any>>(slotName: string, slotProps: SlotProps) =>
      enhanceElement(slotName, slotProps, latestDefinition.current),
    [],
  )
}

export default useAccessibilityBehavior
