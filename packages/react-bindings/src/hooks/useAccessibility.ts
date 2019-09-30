import { Accessibility, AccessibilityAttributesBySlot } from '@stardust-ui/accessibility'
import * as React from 'react'

import getAccessibility from '../accessibility/getAccessibility'
import { AccessibilityBehavior, AccessibilityActionHandlers } from '../accessibility/types'

type UseAccessibilityBehaviorOptions<Props> = {
  actionHandlers?: AccessibilityActionHandlers
  debugName?: string
  mapPropsToBehavior?: () => Props
}

const mergeProps = <SlotProps extends Record<string, any>>(
  slotName: string,
  slotProps: SlotProps,
  definition: AccessibilityBehavior,
): SlotProps & Partial<AccessibilityAttributesBySlot> => {
  const finalProps = {
    ...definition.attributes[slotName],
    ...slotProps,
  }
  const slotHandlers = definition.keyHandlers[slotName]

  if (slotHandlers) {
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

const useAccessibility = <Props>(
  behavior: Accessibility<Props>,
  options: UseAccessibilityBehaviorOptions<Props>,
) => {
  const { actionHandlers, debugName = 'Undefined', mapPropsToBehavior = () => ({}) } = options
  const definition = getAccessibility(
    debugName,
    behavior,
    mapPropsToBehavior(),
    true,
    actionHandlers,
  )

  const latestDefinition = React.useRef<AccessibilityBehavior>(definition)
  latestDefinition.current = definition

  return React.useCallback(
    <SlotProps extends Record<string, any>>(slotName: string, slotProps: SlotProps) =>
      mergeProps(slotName, slotProps, latestDefinition.current),
    [],
  )
}

export default useAccessibility
